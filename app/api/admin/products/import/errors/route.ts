import { NextResponse } from 'next/server';
import { buildCsvFromObjects } from '@/lib/admin-products/import';
import { requireAdmin } from '@/lib/admin-products/server';

export async function GET(request: Request) {
  try {
    const { supabase } = await requireAdmin();
    const { searchParams } = new URL(request.url);
    const importId = searchParams.get('importId');

    if (!importId) {
      return NextResponse.json({ message: 'importId is required.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('product_import_rows')
      .select('row_number, product_name, vendor_id, category_id, sku, error_messages')
      .eq('import_id', importId)
      .eq('status', 'failed')
      .order('row_number', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    const csv = buildCsvFromObjects(
      (data ?? []).map((row: any) => ({
        row_number: row.row_number,
        product_name: row.product_name,
        vendor_id: row.vendor_id,
        category_id: row.category_id,
        sku: row.sku,
        error_reason: Array.isArray(row.error_messages) ? row.error_messages.join('; ') : '',
      })),
    );

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="product-import-${importId}-errors.csv"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Unable to download error report.',
      },
      { status: 500 },
    );
  }
}