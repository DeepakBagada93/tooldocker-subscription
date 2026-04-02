import { z } from 'zod'

export const ProductQuerySchema = z.object({
  keywords: z.array(z.string()).optional().default([]),
  category: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  specs: z.record(z.string(), z.string()).optional(),
})

export const GeneratedProductSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number(),
  tags: z.array(z.string()).optional().default([]),
  specifications: z.record(z.string(), z.string()).optional().default({}),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  sku: z.string().optional(),
  condition: z.enum(['new', 'used', 'refurbished']).optional().default('new'),
  stock_quantity: z.number().optional().default(10),
})
