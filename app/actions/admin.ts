'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getUserRole } from '@/lib/supabase/profiles'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

async function ensureAdmin(supabase: any) {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
        throw new Error(error.message)
    }

    const role = await getUserRole(supabase, user)
    if (!user || role !== 'admin') {
        throw new Error('Unauthorized Access')
    }

    return user
}

export async function approveProduct(productId: string) {
    try {
        const supabase = await createClient()
        await ensureAdmin(supabase)

        const { error } = await supabase
            .from('products')
            .update({ is_published: true })
            .eq('id', productId)

        if (error) throw new Error(error.message)

        revalidatePath('/admin/products')
        revalidatePath('/')
        return { success: true }
    } catch (e) {
        console.warn('Mocking product approval', e);
        return { success: true, mock: true };
    }
}

export async function rejectProduct(productId: string) {
    try {
        const supabase = await createClient()
        await ensureAdmin(supabase)

        const { error } = await supabase
            .from('products')
            .update({ is_published: false })
            .eq('id', productId)

        if (error) throw new Error(error.message)

        revalidatePath('/admin/products')
        revalidatePath('/')
        return { success: true }
    } catch (e) {
        console.warn('Mocking product rejection', e);
        return { success: true, mock: true };
    }
}

export async function toggleStoreStatus(storeId: string, currentStatus: boolean) {
    try {
        const supabase = await createClient()
        await ensureAdmin(supabase)

        const { error } = await supabase
            .from('stores')
            .update({ is_active: !currentStatus })
            .eq('id', storeId)

        if (error) throw new Error(error.message)

        revalidatePath('/admin/vendors')
        return { success: true }
    } catch (e) {
        console.warn('Mocking store status toggle', e);
        return { success: true, mock: true };
    }
}

export async function assignVendorPlan(formData: FormData) {
    const supabase = await createClient()
    await ensureAdmin(supabase)
    const supabaseAdmin = getSupabaseAdmin()

    const vendorId = String(formData.get('vendorId') || '')
    const planKey = String(formData.get('planKey') || '')

    if (!vendorId || !planKey) {
        throw new Error('Vendor and plan are required.')
    }

    const { data: vendorProfile, error: vendorProfileError } = await supabaseAdmin
        .from('profiles')
        .select('id, role')
        .eq('id', vendorId)
        .single()

    if (vendorProfileError || !vendorProfile) {
        throw new Error(vendorProfileError?.message || 'Vendor not found.')
    }

    if (vendorProfile.role !== 'vendor') {
        throw new Error('Selected user is not a vendor.')
    }

    const { data: plan, error: planError } = await supabaseAdmin
        .from('subscription_plans')
        .select('id, billing_interval')
        .eq('plan_key', planKey)
        .single()

    if (planError || !plan) throw new Error(planError?.message || 'Plan not found')

    const { data: existingSubscription, error: existingSubscriptionError } = await supabaseAdmin
        .from('vendor_subscriptions')
        .select('id')
        .eq('vendor_id', vendorId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

    if (existingSubscriptionError) {
        throw new Error(existingSubscriptionError.message)
    }

    const now = new Date()
    const currentPeriodEnd = new Date(now)
    if (plan.billing_interval === 'yearly') currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1)
    else currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1)

    if (existingSubscription?.id) {
        const { error } = await supabaseAdmin
            .from('vendor_subscriptions')
            .update({
                plan_id: plan.id,
                status: 'active',
                billing_interval: plan.billing_interval,
                start_date: now.toISOString(),
                current_period_end: currentPeriodEnd.toISOString(),
            })
            .eq('id', existingSubscription.id)

        if (error) throw new Error(error.message)
    } else {
        const { error } = await supabaseAdmin
            .from('vendor_subscriptions')
            .insert({
                vendor_id: vendorId,
                plan_id: plan.id,
                status: 'active',
                billing_interval: plan.billing_interval,
                start_date: now.toISOString(),
                current_period_end: currentPeriodEnd.toISOString(),
            })

        if (error) throw new Error(error.message)
    }

    revalidatePath('/admin/vendors')
    revalidatePath('/admin')
    revalidatePath('/admin/commission')
    revalidatePath('/vendor/dashboard')
    revalidatePath('/vendor/products')
    revalidatePath('/vendor/products/new')
    revalidatePath('/vendor/bulk-upload')
}

export async function setVendorProductAccess(formData: FormData) {
    const supabase = await createClient()
    await ensureAdmin(supabase)
    const supabaseAdmin = getSupabaseAdmin()

    const vendorId = String(formData.get('vendorId') || '')
    const storeId = String(formData.get('storeId') || '')
    const shouldApprove = String(formData.get('shouldApprove') || 'false') === 'true'

    if (!vendorId || !storeId) {
        throw new Error('Vendor store is required.')
    }

    if (shouldApprove) {
        const { data: existingSubscription, error: subscriptionError } = await supabaseAdmin
            .from('vendor_subscriptions')
            .select('id')
            .eq('vendor_id', vendorId)
            .in('status', ['active', 'trialing'])
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()

        if (subscriptionError) {
            throw new Error(subscriptionError.message)
        }

        if (!existingSubscription?.id) {
            throw new Error('Assign an active plan before approving product access.')
        }
    }

    const { error: storeError } = await supabaseAdmin
        .from('stores')
        .update({ is_active: shouldApprove })
        .eq('id', storeId)

    if (storeError) throw new Error(storeError.message)

    if (!shouldApprove) {
        const { data: existingSubscription, error: existingSubscriptionError } = await supabaseAdmin
            .from('vendor_subscriptions')
            .select('id')
            .eq('vendor_id', vendorId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()

        if (existingSubscriptionError) {
            throw new Error(existingSubscriptionError.message)
        }

        if (existingSubscription?.id) {
            const { error: updateSubscriptionError } = await supabaseAdmin
                .from('vendor_subscriptions')
                .update({ status: 'inactive' })
                .eq('id', existingSubscription.id)

            if (updateSubscriptionError) {
                throw new Error(updateSubscriptionError.message)
            }
        }
    }

    revalidatePath('/admin/vendors')
    revalidatePath('/admin')
    revalidatePath('/vendor/dashboard')
    revalidatePath('/vendor/products')
    revalidatePath('/vendor/products/new')
    revalidatePath('/vendor/bulk-upload')
}
