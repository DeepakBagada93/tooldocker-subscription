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

        const normalizedProducts = (data ?? []).map((product: any) => {
            const category = Array.isArray(product.categories) ? product.categories[0] : product.categories
            const store = Array.isArray(product.stores) ? product.stores[0] : product.stores

            return {
                id: product.id,
                store_id: product.store_id,
                category_id: product.category_id,
                title: product.title,
                description: product.description ?? '',
                price: Number(product.price ?? 0),
                inventory_count: Number(product.inventory_count ?? 0),
                images: Array.isArray(product.images) ? product.images : [],
                is_published: Boolean(product.is_published),
                category_name: category?.name ?? null,
                stores: store
                    ? {
                        store_name: store.store_name,
                        logo_url: store.logo_url,
                    }
                    : undefined,
            } satisfies Product
        })

        return normalizedProducts.filter((product) =>
            !options?.categorySlug || categorySlugify(product.category_name) === options.categorySlug
        )
    } catch (error) {
        console.warn('Unable to load published products from Supabase', error)
    }

    return []
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
        console.warn('Unable to load product detail from Supabase', error)
    }

    return null
}

function categorySlugify(value: string | null | undefined) {
    return (value ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
}
