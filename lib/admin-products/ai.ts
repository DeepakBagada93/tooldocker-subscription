import { getGroqClient } from '@/lib/groq';
import { GeneratedProductSchema } from '@/lib/schemas';
import type { PreparedImportRow } from '@/lib/admin-products/import';

export async function enhanceImportRowsWithAi(rows: PreparedImportRow[], enabled: boolean) {
  if (!enabled || !process.env.GROQ_API_KEY) {
    return rows;
  }

  const groq = getGroqClient();
  const enhancedRows: PreparedImportRow[] = [];

  for (const row of rows) {
    if (row.status !== 'ready') {
      enhancedRows.push(row);
      continue;
    }

    const needsEnhancement =
      !row.description.trim() ||
      !Object.keys(row.specifications).length ||
      !row.seoTitle.trim() ||
      !row.seoDescription.trim();

    if (!needsEnhancement) {
      enhancedRows.push(row);
      continue;
    }

    try {
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Generate structured product content in JSON with title, description, specifications, seo_title, seo_description, tags, reasonable price, condition, and stock_quantity.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              title: row.title,
              category: row.categoryName,
              description: row.description,
              specifications: row.specifications,
              price: row.price,
              stockQuantity: row.stockQuantity,
            }),
          },
        ],
        response_format: { type: 'json_object' },
      });

      const content = completion.choices[0]?.message?.content;
      const parsed = GeneratedProductSchema.parse(JSON.parse(content ?? '{}'));

      enhancedRows.push({
        ...row,
        title: row.title.trim() || parsed.title,
        description: row.description.trim() || parsed.description,
        specifications: Object.keys(row.specifications).length ? row.specifications : (parsed.specifications ?? {}),
        seoTitle: row.seoTitle.trim() || parsed.seo_title || '',
        seoDescription: row.seoDescription.trim() || parsed.seo_description || '',
      });
    } catch {
      enhancedRows.push(row);
    }
  }

  return enhancedRows;
}
