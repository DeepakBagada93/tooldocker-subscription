'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { getVendorSubscriptionStatus } from '@/lib/subscriptions'

function sanitizeFileName(fileName: string) {
    return fileName.replace(/[^a-zA-Z0-9._-]/g, '-')
}

function inferContentType(fileName: string, fallbackType?: string) {
    if (fallbackType) return fallbackType

    const normalized = fileName.toLowerCase()
    if (normalized.endsWith('.png')) return 'image/png'
    if (normalized.endsWith('.webp')) return 'image/webp'
    if (normalized.endsWith('.gif')) return 'image/gif'
    return 'image/jpeg'
}

async function uploadVendorProductImage(params: { file: File; vendorId: string }) {
    const { file, vendorId } = params

    if (!file.size) return null
    if (!file.type.startsWith('image/')) {
        throw new Error('Only image files can be uploaded.')
    }

    const supabaseAdmin = getSupabaseAdmin()
    const extension = file.name.includes('.') ? file.name.split('.').pop() : 'jpg'
    const path = `vendors/${vendorId}/${Date.now()}-${crypto.randomUUID()}.${sanitizeFileName(extension || 'jpg')}`
    const fileBuffer = Buffer.from(await file.arrayBuffer())

    const { error } = await supabaseAdmin.storage
        .from('product-images')
        .upload(path, fileBuffer, {
            contentType: inferContentType(file.name, file.type),
            upsert: false,
        })

    if (error) throw new Error(`Image upload failed: ${error.message}`)

    const { data } = supabaseAdmin.storage.from('product-images').getPublicUrl(path)
    return data.publicUrl
}

async function getAuthenticatedVendorContext(requireAvailableSlot: boolean) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('You must be signed in as a vendor.')

    const subscriptionStatus = await getVendorSubscriptionStatus(user.id)
    if (!subscriptionStatus.hasActiveSubscription) {
        throw new Error('Your vendor account must be approved and have an active plan before adding products.')
    }

    if (requireAvailableSlot && !subscriptionStatus.canCreateProduct) {
        throw new Error(`You have reached your current plan limit of ${subscriptionStatus.productLimit} products.`)
    }

    const { data: store, error: storeError } = await supabase
        .from('stores')
        .select('id, is_active')
        .eq('vendor_id', user.id)
        .single()

    if (storeError || !store) throw new Error('Vendor store not found.')
    if (!store.is_active) throw new Error('Your vendor account must be approved before products can go live.')

    return { supabase, user, store }
}

export async function createVendorProduct(formData: FormData) {
    const { supabase, user, store } = await getAuthenticatedVendorContext(true)

    const categoryId = String(formData.get('category_id') || '').trim()
    const uploadedImage = formData.get('image_file')
    const imageUrlInput = String(formData.get('image_url') || '').trim()
    const uploadedImageUrl =
        uploadedImage instanceof File && uploadedImage.size > 0
            ? await uploadVendorProductImage({ file: uploadedImage, vendorId: user.id })
            : null

    const title = String(formData.get('title') || '').trim()
    const description = String(formData.get('description') || '').trim()
    const price = Number.parseFloat(String(formData.get('price') || '0'))
    const inventory = Number.parseInt(String(formData.get('inventory') || '0'), 10)

    if (!title) throw new Error('Product title is required.')

    const { error } = await supabase.from('products').insert([{
        store_id: store.id,
        vendor_id: user.id,
        title,
        description,
        price,
        stock_quantity: inventory,
        inventory_count: inventory,
        category_id: categoryId && /^[0-9a-f-]{36}$/i.test(categoryId) ? categoryId : null,
        is_published: true,
        images: [uploadedImageUrl, imageUrlInput].filter(Boolean),
    }])

    if (error) throw new Error(`Failed to create product: ${error.message}`)

    revalidatePath('/vendor/products')
    revalidatePath('/vendor')
    revalidatePath('/')
    revalidatePath('/search')
    redirect('/vendor/products')
}

export async function updateVendorProduct(formData: FormData) {
    const { supabase, user, store } = await getAuthenticatedVendorContext(false)

    const productId = String(formData.get('product_id') || '').trim()
    if (!productId) throw new Error('Product id is required.')

    const categoryId = String(formData.get('category_id') || '').trim()
    const currentImageUrl = String(formData.get('current_image_url') || '').trim()
    const imageUrlInput = String(formData.get('image_url') || '').trim()
    const uploadedImage = formData.get('image_file')
    const uploadedImageUrl =
        uploadedImage instanceof File && uploadedImage.size > 0
            ? await uploadVendorProductImage({ file: uploadedImage, vendorId: user.id })
            : null

    const title = String(formData.get('title') || '').trim()
    const description = String(formData.get('description') || '').trim()
    const price = Number.parseFloat(String(formData.get('price') || '0'))
    const inventory = Number.parseInt(String(formData.get('inventory') || '0'), 10)

    const { error } = await supabase
        .from('products')
        .update({
            store_id: store.id,
            vendor_id: user.id,
            title,
            description,
            price,
            stock_quantity: inventory,
            inventory_count: inventory,
            category_id: categoryId && /^[0-9a-f-]{36}$/i.test(categoryId) ? categoryId : null,
            is_published: true,
            images: [uploadedImageUrl, imageUrlInput, currentImageUrl].filter(Boolean),
        })
        .eq('id', productId)
        .eq('vendor_id', user.id)

    if (error) throw new Error(`Failed to update product: ${error.message}`)

    revalidatePath('/vendor/products')
    revalidatePath('/')
    revalidatePath('/search')
    revalidatePath(`/product/${productId}`)
    redirect('/vendor/products')
}

export async function toggleProductPublishStatus(productId: string, currentStatus: boolean) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('products')
        .update({ is_published: !currentStatus })
        .eq('id', productId)

    if (error) throw new Error(error.message)

    revalidatePath('/admin')
    revalidatePath('/vendor/products')
    return { success: true }
}

export async function getVendorProducts() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
        .from('products')
        .select(`
            *,
            category:categories(name)
        `)
        .eq('vendor_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching vendor products:', error)
        return []
    }

    return data.map((product) => ({
        id: product.id,
        name: product.title,
        price: Number(product.price ?? 0),
        stock: product.stock_quantity || product.inventory_count || 0,
        category: product.category?.name || 'Uncategorized',
        status: product.is_published ? 'Active' : 'Draft',
        image: product.images?.[0] || null,
    }))
}

export async function getVendorProductById(productId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
        .from('products')
        .select('id, title, description, price, stock_quantity, inventory_count, category_id, images')
        .eq('id', productId)
        .eq('vendor_id', user.id)
        .maybeSingle()

    if (error || !data) return null

    return {
        id: data.id,
        title: data.title ?? '',
        description: data.description ?? '',
        price: String(data.price ?? ''),
        inventory: String(data.stock_quantity ?? data.inventory_count ?? 0),
        category_id: data.category_id ?? '',
        image_url: Array.isArray(data.images) ? (data.images[0] ?? '') : '',
    }
}
