import { getGroqClient } from '@/lib/groq'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { ProductQuerySchema } from '@/lib/schemas'

export async function POST(req: Request) {
  try {
    const { query } = await req.json()

    if (!query) {
      return Response.json({ error: 'Query is required' }, { status: 400 })
    }

    const supabaseAdmin = getSupabaseAdmin()

    // 1. Check AI Cache
    const { data: cacheHit } = await supabaseAdmin
      .from('ai_cache')
      .select('output')
      .eq('input', query.toLowerCase().trim())
      .single()

    let parsed;

    if (cacheHit) {
      parsed = cacheHit.output;
    } else {
      // 2. Call Groq
      const groq = getGroqClient()
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { 
            role: 'system', 
            content: 'Extract structured ecommerce search parameters in JSON format. For keywords, provide an array of strings. If category, price range, or specs are mentioned, include them.' 
          },
          { role: 'user', content: query },
        ],
        response_format: { type: 'json_object' },
      })

      parsed = ProductQuerySchema.parse(JSON.parse(completion.choices[0].message.content!))

      // 3. Save to AI Cache (fire and forget)
      supabaseAdmin.from('ai_cache').insert({
        input: query.toLowerCase().trim(),
        output: parsed
      }).then(() => {});
    }

    let q = supabaseAdmin.from('products').select('*').limit(20)

    if (parsed.category) q = q.ilike('category', `%${parsed.category}%`)
    if (parsed.minPrice) q = q.gte('price', parsed.minPrice)
    if (parsed.maxPrice) q = q.lte('price', parsed.maxPrice)

    if (parsed.keywords?.length) {
      // Simple text search implementation
      const searchStr = parsed.keywords.join(' & ')
      q = q.textSearch('title', searchStr, { config: 'english' })
    }

    const { data, error } = await q

    if (error) {
      console.error('Supabase search error:', error)
      return Response.json({ error: 'Search failed' }, { status: 500 })
    }

    return Response.json({ data, parameters: parsed })
  } catch (error) {
    console.error('AI Search Error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
