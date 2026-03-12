import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import {
  buildFailedReportRows,
  detectSourceType,
  parseSpreadsheetFile,
  prepareImportRows,
  summarizeZipFile,
  uploadImagesFromZip,
  type PreparedImportRow,
} from '@/lib/admin-products/import';
import {
  buildProductPayload,
  insertProductsInChunks,
} from '@/lib/admin-products/mutations';
import {
  getAdminProductLookupsWithClient,
  requireAdmin,
} from '@/lib/admin-products/server';
import type {
  ProductImportResponse,
  ProductImportStatus,
} from '@/lib/admin-products/types';

export const runtime = 'nodejs';

const MAX_PRODUCTS_PER_UPLOAD = 1000;

export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireAdmin();
    const formData = await request.formData();
    const mode = formData.get('mode');
    const spreadsheet = formData.get('spreadsheet');
    const imagesZip = formData.get('imagesZip');

    if (mode !== 'preview' && mode !== 'confirm') {
      return NextResponse.json({ message: 'Invalid import mode.' }, { status: 400 });
    }

    if (!isFile(spreadsheet) || spreadsheet.size === 0) {
      return NextResponse.json({ message: 'Spreadsheet file is required.' }, { status: 400 });
    }

    const zipFile = isFile(imagesZip) && imagesZip.size > 0 ? imagesZip : null;
    const sourceType = detectSourceType(spreadsheet.name);
    const rows = await parseSpreadsheetFile(spreadsheet);

    if (!rows.length) {
      return NextResponse.json({ message: 'The spreadsheet does not contain any rows.' }, { status: 400 });
    }

    if (rows.length > MAX_PRODUCTS_PER_UPLOAD) {
      return NextResponse.json(
        { message: `Each upload can contain at most ${MAX_PRODUCTS_PER_UPLOAD} products.` },
        { status: 400 },
      );
    }

    const { categoryOptions, vendorOptions, existingSkus } = await getAdminProductLookupsWithClient(supabase);
    const zipSummary = await summarizeZipFile(zipFile);
    const { preparedRows, readyRows, failedRows } = prepareImportRows({
      rows,
      vendors: vendorOptions,
      categories: categoryOptions,
      existingSkus,
      zipSummary,
    });

    if (mode === 'preview') {
      const previewResponse: ProductImportResponse = {
        ok: true,
        mode,
        fileName: spreadsheet.name,
        sourceType,
        totalRows: rows.length,
        readyRows,
        failedRows,
        previewRows: preparedRows,
        failedReportRows: buildFailedReportRows(preparedRows),
        message: 'Preview generated successfully.',
      };

      return NextResponse.json(previewResponse);
    }

    const { data: importRecord, error: importInsertError } = await supabase
      .from('product_imports')
      .insert({
        created_by: user.id,
        file_name: spreadsheet.name,
        source_type: sourceType,
        total_products: rows.length,
        success_count: 0,
        failed_count: failedRows,
        status: 'pending',
      })
      .select('id')
      .single();

    if (importInsertError || !importRecord) {
      throw new Error(importInsertError?.message ?? 'Failed to create import history record.');
    }

    const readyImportRows = preparedRows.filter((row) => row.status === 'ready');
    const uploadedImages = await uploadImagesFromZip({
      supabase,
      zipFile,
      importId: importRecord.id,
      rows: readyImportRows,
    });

    const importPayloadRows = readyImportRows.map((row) => ({
      rowNumber: row.rowNumber,
      payload: buildProductPayload({
        title: row.title,
        description: row.description,
        vendorId: row.vendorId,
        storeId: row.storeId,
        categoryId: row.categoryId,
        price: row.price ?? 0,
        salePrice: row.salePrice,
        sku: row.sku,
        stockQuantity: row.stockQuantity ?? 0,
        condition: row.condition,
        brand: row.brand,
        weight: row.weight,
        length: row.dimensions.length,
        width: row.dimensions.width,
        height: row.dimensions.height,
        images: uploadedImages.get(row.rowNumber) ?? row.imagesInput.filter(isRemoteUrl),
        tags: row.tags,
        isPublished: row.isPublished,
      }),
    }));

    const { insertedProductIds, failedMessages } = await insertProductsInChunks({
      supabase,
      rows: importPayloadRows,
    });

    const failureReportRows = buildConfirmFailureRows(preparedRows, failedMessages);
    const importRowsPayload = preparedRows.map((row) => {
      const insertionFailure = failedMessages.get(row.rowNumber);
      const errorMessages = [...row.errors, ...(insertionFailure ? [insertionFailure] : [])];
      const uploadedUrls = uploadedImages.get(row.rowNumber) ?? row.imagesInput.filter(isRemoteUrl);

      return {
        import_id: importRecord.id,
        row_number: row.rowNumber,
        product_name: row.title || null,
        sku: row.sku || null,
        vendor_id: row.vendorId || null,
        category_id: row.categoryId || null,
        status: errorMessages.length ? 'failed' : 'completed',
        error_messages: errorMessages,
        product_payload: serializePreparedRow(row, uploadedUrls),
        product_id: insertedProductIds.get(row.rowNumber) ?? null,
      };
    });

    const { error: importRowsError } = await supabase
      .from('product_import_rows')
      .insert(importRowsPayload);

    if (importRowsError) {
      throw new Error(importRowsError.message);
    }

    const successCount = insertedProductIds.size;
    const totalFailed = rows.length - successCount;
    const status: ProductImportStatus =
      successCount === 0 ? 'failed' : totalFailed === 0 ? 'completed' : 'partial';

    const { error: importUpdateError } = await supabase
      .from('product_imports')
      .update({
        success_count: successCount,
        failed_count: totalFailed,
        status,
      })
      .eq('id', importRecord.id);

    if (importUpdateError) {
      throw new Error(importUpdateError.message);
    }

    revalidatePath('/admin/products');
    revalidatePath('/');

    const response: ProductImportResponse = {
      ok: true,
      mode,
      fileName: spreadsheet.name,
      sourceType,
      totalRows: rows.length,
      readyRows: successCount,
      failedRows: totalFailed,
      previewRows: preparedRows.map((row) => ({
        ...row,
        status: failedMessages.has(row.rowNumber) || row.errors.length ? 'invalid' : 'ready',
        errors: [...row.errors, ...(failedMessages.has(row.rowNumber) ? [failedMessages.get(row.rowNumber)!] : [])],
      })),
      failedReportRows: failureReportRows,
      importId: importRecord.id,
      message:
        status === 'completed'
          ? 'All products imported successfully.'
          : status === 'partial'
            ? 'Import completed with some failed rows.'
            : 'No products were imported. Review the error report and try again.',
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Product import failed.',
      },
      { status: 500 },
    );
  }
}

function isFile(value: FormDataEntryValue | null): value is File {
  return typeof File !== 'undefined' && value instanceof File;
}

function isRemoteUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function serializePreparedRow(row: PreparedImportRow, images: string[]) {
  return {
    title: row.title,
    description: row.description,
    vendor_id: row.vendorId,
    store_id: row.storeId,
    category_id: row.categoryId,
    price: row.price,
    sale_price: row.salePrice,
    sku: row.sku,
    stock_quantity: row.stockQuantity,
    condition: row.condition,
    brand: row.brand,
    weight: row.weight,
    dimensions: row.dimensions,
    images,
    tags: row.tags,
    is_published: row.isPublished,
  };
}

function buildConfirmFailureRows(
  rows: PreparedImportRow[],
  failedMessages: Map<number, string>,
): Array<Record<string, string | number | null>> {
  return rows
    .filter((row) => row.errors.length || failedMessages.has(row.rowNumber))
    .map((row) => ({
      row_number: row.rowNumber,
      product_name: row.title,
      vendor_id: row.vendorId,
      category_id: row.categoryId,
      sku: row.sku,
      error_reason: [...row.errors, ...(failedMessages.has(row.rowNumber) ? [failedMessages.get(row.rowNumber)!] : [])].join('; '),
    }));
}