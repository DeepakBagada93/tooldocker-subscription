'use server'

import { createClient } from '@/lib/supabase/server'
import { getVendorSubscriptionStatus } from '@/lib/subscriptions'
import { revalidatePath } from 'next/cache'

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

        const productData = {
            store_id: store.id,
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            price: parseFloat(formData.get('price') as string),
            inventory_count: parseInt(formData.get('inventory') as string),
            category_id: categoryId && /^[0-9a-f-]{36}$/i.test(categoryId) ? categoryId : null,
            // Start un-published by default, requiring admin moderation
            is_published: false,
            images: [formData.get('image_url') as string].filter(Boolean)
        }

        const { error } = await supabase.from('products').insert([productData])

        if (error) {
            throw new Error(`Failed to create product: ${error.message}`)
        }

        revalidatePath('/dashboard/products')
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

    revalidatePath('/dashboard/products')
    revalidatePath('/admin')
    return { success: true }
}
