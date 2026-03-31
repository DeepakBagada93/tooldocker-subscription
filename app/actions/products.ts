'use server'

import { createClient } from '@/lib/supabase/server'

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
        return (data ?? []) as Category[]
    } catch (error) {
        console.error('Error fetching categories:', error)
        return []
    }
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
        if (error) {
            console.error('Supabase error fetching products:', error)
            throw new Error(error.message)
        }

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
        console.error('Unable to load product detail from Supabase:', error)
    }

    return null
}

export async function getVendorStoreAndProducts(vendorId: string) {
    const supabase = await createClient()

    try {
        // 1. Try to find the vendor's store in DB
        const { data: store, error: storeError } = await supabase
            .from('stores')
            .select(`
                *,
                profiles:profiles(full_name, role)
            `)
            .eq('vendor_id', vendorId)
            .maybeSingle()

        if (storeError) throw new Error(storeError.message)

        // 2. Try to find products for this store in DB
        const { data: dbProducts, error: productsError } = await supabase
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
            .eq('vendor_id', vendorId)
            .eq('is_published', true)
            .order('created_at', { ascending: false })

        if (productsError) throw new Error(productsError.message)

        if (store) {
            // Normalize DB products
            const normalizedProducts = (dbProducts ?? []).map((product: any) => {
                const category = Array.isArray(product.categories) ? product.categories[0] : product.categories
                const storeInfo = Array.isArray(product.stores) ? product.stores[0] : product.stores

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
                    stores: storeInfo
                        ? {
                            store_name: storeInfo.store_name,
                            logo_url: storeInfo.logo_url,
                        }
                        : {
                            store_name: store?.store_name ?? 'Vendor Store',
                            logo_url: store?.logo_url ?? '',
                        },
                } satisfies Product
            })

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
    const supabase = await createClient()

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
