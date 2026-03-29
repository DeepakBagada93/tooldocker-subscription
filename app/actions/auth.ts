'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import {
    ensureUserProfile,
    ensureVendorStoreForUser,
    getUserRole,
} from '@/lib/supabase/profiles'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error, data: authData } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return redirect('/login?message=Could not authenticate user')
    }

    await ensureUserProfile(supabase, authData.user)
    await ensureVendorStoreForUser(supabase, authData.user)

    const role = await getUserRole(supabase, authData.user)
    let targetUrl = '/buyer'
    if (role === 'admin') targetUrl = '/admin'
    if (role === 'vendor') targetUrl = '/vendor'

    revalidatePath('/', 'layout')
    redirect(targetUrl)
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const headersList = await headers()
    const origin = headersList.get('origin')

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const role = formData.get('role') as string || 'buyer' // buyer or vendor
    const fullName = formData.get('full_name') as string
    const companyName = formData.get('company_name') as string
    const legalName = formData.get('legal_name') as string
    const phone = formData.get('phone') as string
    const taxId = formData.get('tax_id') as string
    const country = formData.get('country') as string
    const location = formData.get('location') as string
    const website = formData.get('website') as string
    const selectedPlan = formData.get('selected_plan') as string
    const categoryFocus = formData.get('category_focus') as string
    const businessAddress = formData.get('business_address') as string
    const businessSummary = formData.get('business_summary') as string

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
            data: {
                role: role,
                full_name: fullName,
                company_name: companyName,
                legal_name: legalName,
                phone,
                tax_id: taxId,
                country,
                location,
                website,
                selected_plan: selectedPlan,
                category_focus: categoryFocus,
                business_address: businessAddress,
                business_summary: businessSummary,
            }
        },
    })

    if (error) {
        return redirect('/register/vendor?message=Could not sign up user: ' + error.message)
    }

    return redirect('/login?message=Registration successful! Please check your email to verify your account before logging in.')
}

export async function loginWithGoogle() {
    const supabase = await createClient()
    const headersList = await headers()
    const origin = headersList.get('origin')

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${origin}/auth/callback`,
        },
    })

    if (data.url) {
        redirect(data.url)
    }
}

export async function signout() {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
        return redirect('/?message=Could not sign out user')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}
