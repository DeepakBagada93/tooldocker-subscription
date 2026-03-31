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
        if (error) {
            console.error('Supabase error fetching products:', error)
            throw new Error(error.message)
        }

        if (data && data.length > 0) {
            const normalizedProducts = data.map((product: any) => {
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
        }
    } catch (error) {
        console.warn('Unable to load published products from Supabase, falling back to mock data', error)
    }

    // Fallback to mock products if Supabase fails or returns no data
    const mockProducts = (MOCK_PRODUCTS as any[]).map(p => ({
        id: p.id,
        store_id: p.vendorId,
        category_id: p.categoryId,
        title: p.name,
        description: p.description,
        price: p.price,
        inventory_count: p.stock,
        images: p.images,
        is_published: true,
        category_name: p.category,
        stores: {
            store_name: p.vendorName,
            logo_url: `https://picsum.photos/seed/${p.vendorId}/100/100`
        }
    }))

    const filteredMock = mockProducts.filter((product) =>
        !options?.categorySlug || categorySlugify(product.category_name) === options.categorySlug
    )
    
    return options?.limit ? filteredMock.slice(0, options.limit) : filteredMock
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
        console.warn('Unable to load product detail from Supabase, checking mock data', error)
    }

    // Fallback to mock data if not found in Supabase
    const mockProduct = MOCK_PRODUCTS.find(p => p.id === id)
    if (mockProduct) {
        return {
            id: mockProduct.id,
            store_id: mockProduct.vendorId,
            category_id: mockProduct.categoryId,
            title: mockProduct.name,
            description: mockProduct.description,
            price: mockProduct.price,
            inventory_count: mockProduct.stock,
            images: mockProduct.images,
            is_published: true,
            category_name: mockProduct.category,
            stores: {
                store_name: mockProduct.vendorName,
                logo_url: `https://picsum.photos/seed/${mockProduct.vendorId}/100/100`
            }
        } as Product
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

        if (store || (dbProducts && dbProducts.length > 0)) {
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
                vendor: store ? {
                    id: store.vendor_id,
                    name: store.store_name,
                    description: store.description || 'No description provided.',
                    logo: store.logo_url || 'https://picsum.photos/seed/vendor/100/100',
                    rating: 5.0, // Mock rating for now
                    reviews: 0,
                    isVerified: store.is_active
                } : null,
                products: normalizedProducts
            }
        }
    } catch (error) {
        console.warn('Unable to load vendor products from Supabase, checking mock data', error)
    }

    // Fallback to mock data if nothing found in DB
    const mockVendor = (require('@/lib/mock-data').VENDORS as any[]).find(v => v.id === vendorId)
    const mockProducts = (require('@/lib/mock-data').PRODUCTS as any[])
        .filter(p => p.vendorId === vendorId)
        .map(p => ({
            id: p.id,
            store_id: p.vendorId,
            category_id: p.categoryId,
            title: p.name,
            description: p.description,
            price: p.price,
            inventory_count: p.stock,
            images: p.images,
            is_published: true,
            category_name: p.category,
            stores: {
                store_name: p.vendorName,
                logo_url: `https://picsum.photos/seed/${p.vendorId}/100/100`
            }
        }))

    return {
        vendor: mockVendor ? {
            id: mockVendor.id,
            name: mockVendor.name,
            description: mockVendor.description,
            logo: mockVendor.logo,
            rating: mockVendor.rating,
            reviews: mockVendor.reviews,
            isVerified: true
        } : null,
        products: mockProducts
    }
}

function categorySlugify(value: string | null | undefined) {
    return (value ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
}
