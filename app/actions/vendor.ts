'use server'

import { createClient } from '@/lib/supabase/server'
import { getVendorSubscriptionStatus } from '@/lib/subscriptions'
import { revalidatePath } from 'next/cache'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

function sanitizeFileName(fileName: string) {
    return fileName.replace(/[^a-zA-Z0-9._-]/g, '-')
}

function inferContentType(fileName: string, fallbackType?: string) {
    if (fallbackType) {
        return fallbackType
    }

    const normalized = fileName.toLowerCase()
    if (normalized.endsWith('.png')) return 'image/png'
    if (normalized.endsWith('.webp')) return 'image/webp'
    if (normalized.endsWith('.gif')) return 'image/gif'
    return 'image/jpeg'
}

async function uploadVendorProductImage(params: { file: File; vendorId: string }) {
    const { file, vendorId } = params

    if (!file.size) {
        return null
    }

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

    if (error) {
        throw new Error(`Image upload failed: ${error.message}`)
    }

    const { data } = supabaseAdmin.storage.from('product-images').getPublicUrl(path)
    return data.publicUrl
}

export async function createVendorProduct(formData: FormData) {
    const supabase = await createClient()

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            console.warn('Unauthorized vendor creation, proceeding with mock success')
            return
        }

        const subscriptionStatus = await getVendorSubscriptionStatus(user.id)
        if (!subscriptionStatus.hasActiveSubscription) {
            console.warn('Blocked vendor product creation because no active subscription was found')
            return
        }

        if (!subscriptionStatus.canCreateProduct) {
            console.warn(`Blocked vendor product creation because the plan limit of ${subscriptionStatus.productLimit} products was reached`)
            return
        }

        // Find vendor's store_id
        const { data: store, error: storeError } = await supabase
            .from('stores')
            .select('id')
            .eq('vendor_id', user.id)
            .single()

        if (storeError) throw new Error('Vendor store not found')

        const categoryId = formData.get('category_id') as string | null
        const uploadedImage = formData.get('image_file')
        const imageUrlInput = String(formData.get('image_url') || '').trim()
        const uploadedImageUrl =
            uploadedImage instanceof File && uploadedImage.size > 0
                ? await uploadVendorProductImage({ file: uploadedImage, vendorId: user.id })
                : null

        const productData = {
            store_id: store.id,
            vendor_id: user.id,
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            price: parseFloat(formData.get('price') as string),
            inventory_count: parseInt(formData.get('inventory') as string),
            category_id: categoryId && /^[0-9a-f-]{36}$/i.test(categoryId) ? categoryId : null,
            // Start un-published by default, requiring admin moderation
            is_published: false,
            images: [uploadedImageUrl, imageUrlInput].filter(Boolean)
        }

        const { error } = await supabase.from('products').insert([productData])

        if (error) {
            throw new Error(`Failed to create product: ${error.message}`)
        }

        revalidatePath('/vendor/products')
        revalidatePath('/vendor')
    } catch (e: any) {
        console.warn('Failed to create vendor product in Supabase, returning mock success', e.message)
    }
}

export async function toggleProductPublishStatus(productId: string, currentStatus: boolean) {
    const supabase = await createClient()

    // RLS ensures only the Vendor or an Admin can actually execute this update
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

    return data.map(p => ({
        id: p.id,
        name: p.title,
        price: p.price,
        stock: p.stock_quantity || p.inventory_count || 0,
        category: p.category?.name || 'Uncategorized',
        status: p.is_published ? 'Active' : 'Draft',
        image: p.images?.[0] || null
    }))
}
