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
    category_name?: string | null
    stores?: {
        store_name: string
        logo_url: string
    }
}

export async function getCategories() {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('categories')
            .select('id, name, slug, parent_id')
            .order('name', { ascending: true })

        if (error) throw new Error(error.message)
        if (data?.length) return data as Category[]
    } catch (error) {
        console.warn('Falling back to mock categories', error)
    }

    return MOCK_CATEGORIES as any[]
}

export async function getPublishedProducts(options?: { categorySlug?: string, limit?: number }) {
    const supabase = await createClient()

    try {
        let query = supabase
            .from('products')
            .select(`
                id,
                store_id,
                category_id,
                title,
                description,
                price,
                inventory_count,
                images,
                is_published,
                stores:stores(store_name, logo_url),
                categories:categories(name, slug)
            `)
            .eq('is_published', true)
            .order('created_at', { ascending: false })

        if (options?.limit) query = query.limit(options.limit)

        const { data, error } = await query
        if (error) throw new Error(error.message)

        const filtered = (data ?? []).filter((product: any) =>
            !options?.categorySlug || product.categories?.slug === options.categorySlug
        )

        if (filtered.length) {
            return filtered.map((product: any) => ({
                id: product.id,
                store_id: product.store_id,
                category_id: product.category_id,
                title: product.title,
                description: product.description ?? '',
                price: Number(product.price ?? 0),
                inventory_count: Number(product.inventory_count ?? 0),
                images: Array.isArray(product.images) ? product.images : [],
                is_published: Boolean(product.is_published),
                category_name: product.categories?.name ?? null,
                stores: product.stores
                    ? {
                        store_name: product.stores.store_name,
                        logo_url: product.stores.logo_url,
                    }
                    : undefined,
            })) as Product[]
        }
    } catch (error) {
        console.warn('Falling back to mock published products', error)
    }

    let mockData = MOCK_PRODUCTS.map((product) => ({
        id: product.id,
        store_id: product.vendorId,
        category_id: product.categoryId,
        title: product.name,
        description: product.description,
        price: product.price,
        inventory_count: product.stock,
        images: product.images,
        is_published: true,
        category_name: product.category,
        stores: {
            store_name: product.vendorName,
            logo_url: product.images[0],
        },
    })) as Product[]

    if (options?.categorySlug) {
        mockData = mockData.filter((product) =>
            product.category_name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === options.categorySlug
        )
    }

    if (options?.limit) mockData = mockData.slice(0, options.limit)
    return mockData
}

export async function getProductById(id: string) {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('products')
            .select(`
                id,
                store_id,
                category_id,
                title,
                description,
                price,
                inventory_count,
                images,
                is_published,
                stores:stores(store_name, logo_url),
                categories:categories(name, slug)
            `)
            .eq('id', id)
            .eq('is_published', true)
            .maybeSingle()

        if (error) throw new Error(error.message)

        if (data) {
            const category = Array.isArray(data.categories) ? data.categories[0] : data.categories
            const store = Array.isArray(data.stores) ? data.stores[0] : data.stores

            return {
                id: data.id,
                store_id: data.store_id,
                category_id: data.category_id,
                title: data.title,
                description: data.description ?? '',
                price: Number(data.price ?? 0),
                inventory_count: Number(data.inventory_count ?? 0),
                images: Array.isArray(data.images) ? data.images : [],
                is_published: Boolean(data.is_published),
                category_name: category?.name ?? null,
                stores: store
                    ? {
                        store_name: store.store_name,
                        logo_url: store.logo_url,
                    }
                    : undefined,
            } as Product
        }
    } catch (error) {
        console.warn('Falling back to mock product detail', error)
    }

    const product = MOCK_PRODUCTS.find((entry) => entry.id === id) || MOCK_PRODUCTS[0]

    return {
        id: product.id,
        store_id: product.vendorId,
        category_id: product.categoryId,
        title: product.name,
        description: product.description,
        price: product.price,
        inventory_count: product.stock,
        images: product.images,
        is_published: true,
        category_name: product.category,
        stores: {
            store_name: product.vendorName,
            logo_url: product.images[0],
        },
    } as Product
}
