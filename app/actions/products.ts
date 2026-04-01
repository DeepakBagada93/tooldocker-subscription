'use server'

import { unstable_noStore as noStore } from 'next/cache'

import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export type Category = {
    id: string
    name: string
    slug: string
    parent_id: string | null
}

export type Product = {
    id: string
    vendor_id?: string | null
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
        vendor_id?: string
        store_name: string
        logo_url: string
    }
}

type ProductRow = {
    id: string
    vendor_id: string | null
    store_id: string
    category_id: string | null
    title: string
    description: string | null
    price: number | string | null
    inventory_count: number | string | null
    images: string[] | null
    is_published: boolean | null
}

async function enrichProducts(supabase: Awaited<ReturnType<typeof createClient>>, rows: ProductRow[]) {
    const storeIds = Array.from(new Set(rows.map((row) => row.store_id).filter(Boolean)))
    const categoryIds = Array.from(new Set(rows.map((row) => row.category_id).filter(Boolean))) as string[]

    const [storesResult, categoriesResult] = await Promise.all([
        storeIds.length
            ? supabase.from('stores').select('id, vendor_id, store_name, logo_url').in('id', storeIds)
            : Promise.resolve({ data: [], error: null }),
        categoryIds.length
            ? supabase.from('categories').select('id, name, slug').in('id', categoryIds)
            : Promise.resolve({ data: [], error: null }),
    ])

    if (storesResult.error) throw new Error(storesResult.error.message)
    if (categoriesResult.error) throw new Error(categoriesResult.error.message)

    const storesById = new Map((storesResult.data ?? []).map((store) => [store.id, store]))
    const categoriesById = new Map((categoriesResult.data ?? []).map((category) => [category.id, category]))

    return rows.map((product) => {
        const store = storesById.get(product.store_id)
        const category = product.category_id ? categoriesById.get(product.category_id) : null

        return {
            id: product.id,
            vendor_id: product.vendor_id,
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
                    vendor_id: store.vendor_id,
                    store_name: store.store_name,
                    logo_url: store.logo_url,
                }
                : undefined,
        } satisfies Product
    })
}

function getPublicReadClient() {
    try {
        return getSupabaseAdmin()
    } catch {
        return null
    }
}

export async function getCategories() {
    noStore()
    const supabase = getPublicReadClient() ?? await createClient()

    try {
        const { data, error } = await supabase
            .from('categories')
            .select('id, name, slug, parent_id')
            .order('name', { ascending: true })

        if (error) throw new Error(error.message)
        return (data ?? []) as Category[]
    } catch (error) {
        console.error('Error fetching categories:', error)
        return []
    }
}

export async function getPublishedProducts(options?: { categorySlug?: string, limit?: number }) {
    noStore()
    const supabase = getPublicReadClient() ?? await createClient()

    try {
        let query = supabase
            .from('products')
            .select('id, vendor_id, store_id, category_id, title, description, price, inventory_count, images, is_published')
            .eq('is_published', true)
            .order('created_at', { ascending: false })

        if (options?.limit) query = query.limit(options.limit)

        const { data, error } = await query
        if (error) {
            console.error('Supabase error fetching products:', error)
            throw new Error(error.message)
        }

        const normalizedProducts = await enrichProducts(supabase, (data ?? []) as ProductRow[])

        if (options?.categorySlug) {
            return normalizedProducts.filter((product) =>
                categorySlugify(product.category_name) === options.categorySlug
            )
        }

        return normalizedProducts
    } catch (error) {
        console.error('Unable to load published products from Supabase:', error)
        return []
    }
}

export async function getProductById(id: string) {
    noStore()
    const supabase = getPublicReadClient() ?? await createClient()

    try {
        const { data, error } = await supabase
            .from('products')
            .select('id, vendor_id, store_id, category_id, title, description, price, inventory_count, images, is_published')
            .eq('id', id)
            .eq('is_published', true)
            .maybeSingle()

        if (error) throw new Error(error.message)

        if (data) {
            const [product] = await enrichProducts(supabase, [data as ProductRow])
            return product ?? null
        }
    } catch (error) {
        console.error('Unable to load product detail from Supabase:', error)
    }

    return null
}

export async function getVendorStoreAndProducts(vendorId: string) {
    noStore()
    const supabase = getPublicReadClient() ?? await createClient()

    try {
        const { data: store, error: storeError } = await supabase
            .from('stores')
            .select('id, vendor_id, store_name, description, logo_url, is_active')
            .eq('vendor_id', vendorId)
            .maybeSingle()

        if (storeError) throw new Error(storeError.message)

        const { data: dbProducts, error: productsError } = await supabase
            .from('products')
            .select('id, vendor_id, store_id, category_id, title, description, price, inventory_count, images, is_published')
            .eq('vendor_id', vendorId)
            .eq('is_published', true)
            .order('created_at', { ascending: false })

        if (productsError) throw new Error(productsError.message)

        if (store) {
            const normalizedProducts = await enrichProducts(supabase, (dbProducts ?? []) as ProductRow[])

            // Return DB store info
            return {
                vendor: {
                    id: store.vendor_id,
                    name: store.store_name,
                    description: store.description || 'No description provided.',
                    logo: store.logo_url || 'https://picsum.photos/seed/vendor/100/100',
                    rating: 5.0, // Static for now
                    reviews: 0,
                    isVerified: store.is_active
                },
                products: normalizedProducts
            }
        }
    } catch (error) {
        console.error('Unable to load vendor products from Supabase:', error)
    }

    return {
        vendor: null,
        products: []
    }
}

export async function getAllVendors() {
    noStore()
    const supabase = getPublicReadClient() ?? await createClient()

    try {
        const { data, error } = await supabase
            .from('stores')
            .select('*')
            .eq('is_active', true)
            .order('store_name', { ascending: true })

        if (error) throw new Error(error.message)
        
        return (data ?? []).map(store => ({
            id: store.vendor_id,
            name: store.store_name,
            description: store.description || 'No description provided.',
            logo: store.logo_url || 'https://picsum.photos/seed/vendor/100/100',
            rating: 5.0,
            reviews: 0,
            isVerified: store.is_active
        }))
    } catch (error) {
        console.error('Error fetching vendors:', error)
        return []
    }
}

function categorySlugify(value: string | null | undefined) {
    return (value ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
}
