'use server'

import { createClient } from '@/lib/supabase/server'
import { CATEGORIES as MOCK_CATEGORIES, PRODUCTS as MOCK_PRODUCTS } from '@/lib/mock-data'

export type Category = {
    id: string
    name: string
    slug: string
    parent_id: string | null
}

export type Product = {
    id: string
    store_id: string
    category_id: string | null
    title: string
    description: string
    price: number
    inventory_count: number
    images: string[]
    is_published: boolean

    // Relations
    stores?: {
        store_name: string
        logo_url: string
    }
}

export async function getCategories() {
    return MOCK_CATEGORIES as any[];
}

export async function getPublishedProducts(options?: { categorySlug?: string, limit?: number }) {
    let mockData = MOCK_PRODUCTS.map(mp => ({
        id: mp.id,
        store_id: mp.vendorId,
        category_id: mp.categoryId,
        title: mp.name, // using `title` to match the db schema
        description: mp.description,
        price: mp.price,
        inventory_count: mp.stock,
        images: mp.images,
        is_published: true,
        stores: {
            store_name: mp.vendorName,
            logo_url: mp.images[0] // just using first image as placeholder
        }
    })) as Product[];

    if (options?.limit) {
        mockData = mockData.slice(0, options.limit);
    }

    return mockData;
}

export async function getProductById(id: string) {
    const mp = MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0]; // Fallback to first if ID mismatch

    return {
        id: mp.id,
        store_id: mp.vendorId,
        category_id: mp.categoryId,
        title: mp.name,
        description: mp.description,
        price: mp.price,
        inventory_count: mp.stock,
        images: mp.images,
        is_published: true,
        stores: {
            store_name: mp.vendorName,
            logo_url: mp.images[0]
        }
    } as Product;
}
