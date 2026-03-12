import JSZip from 'jszip';
import * as XLSX from 'xlsx';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  PRODUCT_IMPORT_HEADERS,
  type AdminProductOption,
  type AdminVendorOption,
  type ProductCondition,
  type ProductImportPreviewRow,
} from '@/lib/admin-products/types';

type RawRow = Record<string, unknown>;

export type PreparedImportRow = ProductImportPreviewRow & {
  description: string;
  storeId: string;
  salePrice: number | null;
  condition: ProductCondition;
  brand: string;
  weight: string;
  dimensions: { length: string; width: string; height: string };
  imagesInput: string[];
  tags: string[];
  isPublished: boolean;
};

type ZipSummary = {
  fullNames: Set<string>;
  baseNames: Set<string>;
};

const HEADER_ALIASES: Record<string, string> = {
  productname: 'product_name',
  name: 'product_name',
  title: 'product_name',
  category: 'category_id',
  vendor: 'vendor_id',
  stock: 'stock_quantity',
  quantity: 'stock_quantity',
};

export function buildTemplateCsv() {
  const exampleValues = [
    'Angle Grinder',
    'Heavy duty grinder',
    'vendor-uuid',
    'category-uuid',
    '4500',
    '4200',
    'AG-5532',
    '10',
    'new',
    'Makita',
    '2.1kg',
    '10',
    '8',
    '6',
    'AG-5532.jpg|https://example.com/AG-5532-side.jpg',
    'grinder|cutting',
  ];

  return `${PRODUCT_IMPORT_HEADERS.join(',')}\n${exampleValues.join(',')}\n`;
}

export async function parseSpreadsheetFile(file: File) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  if (!sheet) {
    return [] as RawRow[];
  }

  return XLSX.utils.sheet_to_json<RawRow>(sheet, { defval: '' });
}

export function detectSourceType(fileName: string): 'csv' | 'excel' {
  return fileName.toLowerCase().endsWith('.csv') ? 'csv' : 'excel';
}

export async function summarizeZipFile(file?: File | null): Promise<ZipSummary | null> {
  if (!file || file.size === 0) {
    return null;
  }

  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const fullNames = new Set<string>();
  const baseNames = new Set<string>();

  zip.forEach((relativePath, zipEntry) => {
    if (zipEntry.dir) return;
    const fileName = relativePath.split('/').pop() ?? relativePath;
    fullNames.add(fileName.toLowerCase());
    baseNames.add(stripExtension(fileName).toLowerCase());
  });

  return { fullNames, baseNames };
}

export function prepareImportRows(params: {
  rows: RawRow[];
  vendors: AdminVendorOption[];
  categories: AdminProductOption[];
  existingSkus: Set<string>;
  zipSummary?: ZipSummary | null;
}) {
  const { rows, vendors, categories, existingSkus, zipSummary } = params;
  const vendorMap = new Map(vendors.map((vendor) => [vendor.vendorId, vendor]));
  const categoryMap = new Map(categories.map((category) => [category.id, category]));
  const skuCounts = new Map<string, number>();

  for (const row of rows) {
    const sku = normalizeSku(getStringCell(row, 'sku'));
    if (sku) {
      skuCounts.set(sku, (skuCounts.get(sku) ?? 0) + 1);
    }
  }

  const preparedRows: PreparedImportRow[] = rows.map((row, index) => {
    const title = getStringCell(row, 'product_name');
    const vendorId = getStringCell(row, 'vendor_id');
    const categoryId = getStringCell(row, 'category_id');
    const price = parseNumber(getStringCell(row, 'price'));
    const salePrice = parseOptionalNumber(getStringCell(row, 'sale_price'));
    const sku = normalizeSku(getStringCell(row, 'sku'));
    const stockQuantity = parseInteger(getStringCell(row, 'stock_quantity'));
    const condition = normalizeCondition(getStringCell(row, 'condition'));
    const brand = getStringCell(row, 'brand');
    const weight = getStringCell(row, 'weight');
    const imagesInput = splitPipeList(getStringCell(row, 'images'));
    const tags = splitPipeList(getStringCell(row, 'tags'));
    const vendor = vendorMap.get(vendorId);
    const category = categoryMap.get(categoryId);
    const errors: string[] = [];

    if (!title) errors.push('Missing product name');
    if (price == null || Number.isNaN(price) || price < 0) errors.push('Invalid price');
    if (salePrice != null && salePrice < 0) errors.push('Invalid sale price');
    if (salePrice != null && price != null && salePrice > price) errors.push('Sale price cannot exceed price');
    if (!vendor) errors.push('Invalid vendor');
    if (vendor && !vendor.isActive) errors.push('Vendor store is inactive');
    if (!category) errors.push('Invalid category');
    if (!sku) errors.push('Missing SKU');
    if (sku && existingSkus.has(sku.toLowerCase())) errors.push('Duplicate SKU already exists');
    if (sku && (skuCounts.get(sku) ?? 0) > 1) errors.push('Duplicate SKU in upload file');
    if (stockQuantity == null || Number.isNaN(stockQuantity) || stockQuantity < 0) errors.push('Invalid stock quantity');
    if (!condition) errors.push('Condition must be new, used, or refurbished');

    for (const imageToken of imagesInput) {
      if (isRemoteUrl(imageToken)) continue;

      const lookupKey = imageToken.toLowerCase();
      const baseKey = stripExtension(lookupKey);

      if (!zipSummary) {
        errors.push(`Image ${imageToken} requires ZIP upload`);
        continue;
      }

      if (!zipSummary.fullNames.has(lookupKey) && !zipSummary.baseNames.has(baseKey)) {
        errors.push(`Image ${imageToken} not found in ZIP`);
      }
    }

    if (zipSummary && imagesInput.length === 0 && sku && !zipSummary.baseNames.has(sku.toLowerCase())) {
      errors.push(`ZIP image not found for SKU ${sku}`);
    }

    return {
      rowNumber: index + 2,
      title,
      description: getStringCell(row, 'description'),
      vendorId,
      vendorName: vendor?.label ?? 'Unknown vendor',
      storeId: vendor?.storeId ?? '',
      categoryId,
      categoryName: category?.label ?? 'Unknown category',
      price,
      salePrice,
      sku,
      stockQuantity,
      condition: condition ?? 'new',
      brand,
      weight,
      dimensions: {
        length: getStringCell(row, 'length'),
        width: getStringCell(row, 'width'),
        height: getStringCell(row, 'height'),
      },
      imagesInput,
      tags,
      isPublished: true,
      status: errors.length ? 'invalid' : 'ready',
      errors,
    };
  });

  return {
    preparedRows,
    readyRows: preparedRows.filter((row) => row.status === 'ready').length,
    failedRows: preparedRows.filter((row) => row.status === 'invalid').length,
  };
}

export function buildFailedReportRows(rows: PreparedImportRow[]) {
  return rows
    .filter((row) => row.errors.length > 0)
    .map((row) => ({
      row_number: row.rowNumber,
      product_name: row.title,
      vendor_id: row.vendorId,
      category_id: row.categoryId,
      sku: row.sku,
      error_reason: row.errors.join('; '),
    }));
}

export function buildCsvFromObjects(rows: Array<Record<string, string | number | null>>) {
  if (!rows.length) {
    return 'row_number,error_reason\n';
  }

  const headers = Object.keys(rows[0]);
  const lines = rows.map((row) =>
    headers
      .map((header) => escapeCsvValue(row[header]))
      .join(','),
  );

  return `${headers.join(',')}\n${lines.join('\n')}\n`;
}

export async function uploadImagesFromZip(params: {
  supabase: SupabaseClient;
  zipFile?: File | null;
  importId: string;
  rows: PreparedImportRow[];
}) {
  const { supabase, zipFile, importId, rows } = params;

  if (!zipFile || zipFile.size === 0) {
    return new Map<number, string[]>();
  }

  const zip = await JSZip.loadAsync(await zipFile.arrayBuffer());
  const filesByName = new Map<string, JSZip.JSZipObject>();
  const filesByBase = new Map<string, JSZip.JSZipObject>();

  zip.forEach((relativePath, zipEntry) => {
    if (zipEntry.dir) return;
    const fileName = relativePath.split('/').pop() ?? relativePath;
    filesByName.set(fileName.toLowerCase(), zipEntry);
    const baseName = stripExtension(fileName).toLowerCase();
    if (!filesByBase.has(baseName)) {
      filesByBase.set(baseName, zipEntry);
    }
  });

  const uploadResults = new Map<number, string[]>();

  for (const row of rows) {
    const remoteUrls = row.imagesInput.filter(isRemoteUrl);
    const requestedFileTokens = row.imagesInput.filter((token) => !isRemoteUrl(token));
    const fallbackToken = row.sku ? [row.sku] : [];
    const tokensToMatch = requestedFileTokens.length ? requestedFileTokens : fallbackToken;
    const zipUrls: string[] = [];

    for (const token of tokensToMatch) {
      const lookupKey = token.toLowerCase();
      const file = filesByName.get(lookupKey) ?? filesByBase.get(stripExtension(lookupKey));
      if (!file) continue;

      const originalName = file.name.split('/').pop() ?? file.name;
      const path = `imports/${importId}/${row.sku || `row-${row.rowNumber}`}-${originalName}`;
      const fileBuffer = Buffer.from(await file.async('uint8array'));

      const { error } = await supabase.storage
        .from('product-images')
        .upload(path, fileBuffer, {
          contentType: inferContentType(originalName),
          upsert: true,
        });

      if (error) {
        throw new Error(`Failed to upload image ${originalName}: ${error.message}`);
      }

      const { data } = supabase.storage.from('product-images').getPublicUrl(path);
      zipUrls.push(data.publicUrl);
    }

    uploadResults.set(row.rowNumber, [...remoteUrls, ...zipUrls]);
  }

  return uploadResults;
}

function getStringCell(row: RawRow, header: string) {
  const expectedKey = normalizeHeader(header);

  for (const [key, value] of Object.entries(row)) {
    const normalizedKey = normalizeHeader(key);
    if (normalizedKey === expectedKey) {
      return String(value ?? '').trim();
    }
  }

  return '';
}

function normalizeHeader(header: string) {
  const normalized = header.trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
  return HEADER_ALIASES[normalized] ?? header.trim().toLowerCase();
}

function splitPipeList(value: string) {
  return value
    .split('|')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseNumber(value: string) {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseOptionalNumber(value: string) {
  if (!value) return null;
  return parseNumber(value);
}

function parseInteger(value: string) {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeCondition(value: string): ProductCondition | null {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'new' || normalized === 'used' || normalized === 'refurbished') {
    return normalized;
  }

  return null;
}

function normalizeSku(value: string) {
  return value.trim();
}

function stripExtension(fileName: string) {
  return fileName.replace(/\.[^.]+$/, '');
}

function isRemoteUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function inferContentType(fileName: string) {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.gif')) return 'image/gif';
  if (lower.endsWith('.svg')) return 'image/svg+xml';
  return 'application/octet-stream';
}

function escapeCsvValue(value: string | number | null) {
  const stringValue = String(value ?? '');
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}
