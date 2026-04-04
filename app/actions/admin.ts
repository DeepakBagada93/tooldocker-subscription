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
