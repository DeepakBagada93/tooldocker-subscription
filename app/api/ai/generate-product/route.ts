import { getGroqClient } from '@/lib/groq'
import { GeneratedProductSchema } from '@/lib/schemas'

export async function POST(req: Request) {
  try {
    const { name, category, specs, description } = await req.json()

    if (!name) {
      return Response.json({ error: 'Product name is required' }, { status: 400 })
    }

    const groq = getGroqClient()
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'Generate structured ecommerce product data in JSON. Include a title, detailed description, realistic tool specifications as key-value pairs, a reasonable price, tags, SEO title, SEO description, condition, and stock quantity based on the user input.',
        },
        {
          role: 'user',
          content: `Product: ${name}${category ? `, Category: ${category}` : ''}${description ? `, Existing description: ${description}` : ''}${specs ? `, Existing specs: ${JSON.stringify(specs)}` : ''}`,
        },
      ],
      response_format: { type: 'json_object' },
    })

    const parsed = GeneratedProductSchema.parse(JSON.parse(completion.choices[0].message.content!))

    return Response.json(parsed)
  } catch (error) {
    console.error('AI Product Generation Error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to generate product' },
      { status: 500 }
    )
  }
}
