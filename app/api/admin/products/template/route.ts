import { NextResponse } from 'next/server';
import { buildTemplateCsv } from '@/lib/admin-products/import';
import { requireAdmin } from '@/lib/admin-products/server';

export async function GET() {
  try {
    await requireAdmin();

    return new NextResponse(buildTemplateCsv(), {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="admin-product-import-template.csv"',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Unauthorized',
      },
      { status: 401 },
    );
  }
}