# AI Engine Integration Guide (Groq Cloud + Supabase)

## Overview
This document defines the end-to-end AI layer for Tooldocker using Groq Cloud (LLaMA models) integrated with Supabase. The AI engine powers:
- Buyer search assistant (natural language → product results)
- Vendor product creation assistant (auto-generate listings)
- Admin intelligence (moderation, categorization, insights)

Tech Stack:
- AI: Groq Cloud (LLaMA 3/3.1/3.3)
- Backend: Next.js 14 API routes / Server Actions
- Database: Supabase (PostgreSQL + Storage)

---

## 1. Environment Setup

```
GROQ_API_KEY=your_groq_api_key
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Install:
```
npm install groq-sdk @supabase/supabase-js zod
```

---

## 2. Groq Client (Server Only)

Create: `lib/groq.ts`

```ts
import Groq from 'groq-sdk'

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
})
```

---

## 3. Core AI Patterns

### 3.1 Structured Output (Zod)

```ts
import { z } from 'zod'

export const ProductQuerySchema = z.object({
  keywords: z.array(z.string()),
  category: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  specs: z.record(z.string()).optional(),
})
```

---

## 4. Buyer AI Search (NL → SQL)

### Flow
1. User enters natural language query
2. AI parses intent → structured query
3. Backend maps to Supabase query
4. Return ranked products

### API Route: `/api/ai/search`

```ts
import { groq } from '@/lib/groq'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { ProductQuerySchema } from '@/lib/schemas'

export async function POST(req: Request) {
  const { query } = await req.json()

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: 'Extract structured ecommerce search parameters.' },
      { role: 'user', content: query },
    ],
    response_format: { type: 'json_object' },
  })

  const parsed = ProductQuerySchema.parse(JSON.parse(completion.choices[0].message.content!))

  let q = supabaseAdmin.from('products').select('*').limit(20)

  if (parsed.category) q = q.eq('category', parsed.category)
  if (parsed.minPrice) q = q.gte('price', parsed.minPrice)
  if (parsed.maxPrice) q = q.lte('price', parsed.maxPrice)

  if (parsed.keywords?.length) {
    q = q.textSearch('title', parsed.keywords.join(' | '))
  }

  const { data } = await q
  return Response.json({ data })
}
```

---

## 5. Vendor AI Product Generator

### Use Case
Vendor provides minimal input → AI generates full product listing.

### API: `/api/ai/generate-product`

```ts
export async function POST(req: Request) {
  const { name, category, specs } = await req.json()

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'Generate structured ecommerce product data in JSON.',
      },
      {
        role: 'user',
        content: `Product: ${name}, Category: ${category}, Specs: ${JSON.stringify(specs)}`,
      },
    ],
    response_format: { type: 'json_object' },
  })

  return Response.json(JSON.parse(completion.choices[0].message.content!))
}
```

### Expected Output

```json
{
  "title": "Makita Angle Grinder 900W",
  "description": "High performance grinder for industrial use...",
  "price": 4500,
  "tags": ["grinder","cutting"],
  "seo_title": "Makita Grinder",
  "seo_description": "Buy Makita grinder online"
}
```

---

## 6. AI-Assisted Bulk Upload Enhancement

Enhance CSV upload:
- Auto-clean titles
- Fill missing descriptions
- Auto-generate tags

Pipeline:
1. Parse CSV
2. Send each row to AI (batched)
3. Normalize fields
4. Insert into Supabase

---

## 7. Smart Category & Attribute Detection

```ts
// AI determines best category_id
```

- Improves search relevance
- Reduces manual errors

---

## 8. AI Moderation (Admin)

Use AI to:
- Detect spam/fake listings
- Flag restricted products
- Normalize content quality

---

## 9. AI Caching Layer

Create table:

```sql
create table ai_cache (
  id uuid primary key default gen_random_uuid(),
  input text,
  output jsonb,
  created_at timestamp default now()
);
```

- Cache repeated queries
- Reduce AI cost

---

## 10. Cost Optimization

- Use streaming only when needed
- Cache frequent queries
- Batch vendor operations
- Limit tokens via prompt constraints

---

## 11. Security

- AI calls server-side only
- Validate all AI outputs
- Never trust raw AI responses
- Sanitize before DB insert

---

## 12. Frontend Integration

Buyer:
- AI search bar ("Describe what you need...")

Vendor:
- "Generate with AI" button in product form

Admin:
- AI moderation dashboard

---

## 13. Future Enhancements

- Voice search
- Image-based product detection
- Recommendation engine
- Auto pricing suggestions

---

## Final Flow

Buyer:
Query → AI → Supabase → Results

Vendor:
Input → AI → Product Draft → Save

Admin:
AI → Flag/Approve → Control

---

## Done 🚀

You now have a full AI engine integrated with Groq Cloud + Supabase for your SaaS marketplace.

