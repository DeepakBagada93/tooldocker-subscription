'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import {
    type AppRole,
    ensureUserProfile,
    ensureVendorStoreForUser,
    normalizeAppRole,
} from '@/lib/supabase/profiles'
import {
    compactUserAuthMetadataIfNeeded,
    getCompactAuthMetadataFromSource,
} from '@/lib/supabase/auth-metadata'

function getLoginRouteForRedirectTarget(redirectTo: FormDataEntryValue | null) {
    if (typeof redirectTo !== 'string') {
        return '/login'
    }

    if (redirectTo.startsWith('/admin')) return '/tooldocker-admin/login'
    if (redirectTo.startsWith('/vendor')) return '/vendor/login'
    if (redirectTo.startsWith('/buyer')) return '/buyer/login'
    return '/login'
}

function getDefaultPostLoginRoute(role: AppRole) {
    if (role === 'admin') return '/admin'
    if (role === 'vendor') return '/vendor/dashboard'
    return '/buyer'
}

function resolvePostLoginRoute(role: AppRole, redirectTo: FormDataEntryValue | null) {
    if (typeof redirectTo !== 'string') {
        return getDefaultPostLoginRoute(role)
    }

    if (role === 'admin' && redirectTo.startsWith('/admin')) return '/admin'
    if (role === 'vendor' && redirectTo.startsWith('/vendor')) return '/vendor/dashboard'
    if (role === 'buyer' && redirectTo.startsWith('/buyer')) return '/buyer'

    return getDefaultPostLoginRoute(role)
}

export async function login(formData: FormData) {
    const supabase = await createClient()
    const redirectTo = formData.get('redirectTo')
    const loginRoute = getLoginRouteForRedirectTarget(redirectTo)

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error, data: authData } = await supabase.auth.signInWithPassword(data)

    if (error) {
        const message = encodeURIComponent(error.message || 'Could not authenticate user')
        return redirect(`${loginRoute}?message=${message}`)
    }

    const activeUser = authData.user
    await compactUserAuthMetadataIfNeeded(supabase, activeUser)
    const profile = await ensureUserProfile(supabase, activeUser)
    const role = normalizeAppRole(profile?.role ?? activeUser?.user_metadata?.role)

    await ensureVendorStoreForUser(supabase, activeUser, role)

    revalidatePath('/', 'layout')
    redirect(resolvePostLoginRoute(role, redirectTo))
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
    const phone = formData.get('phone') as string

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
            data: getCompactAuthMetadataFromSource({
                role,
                full_name: fullName,
                company_name: companyName,
                phone,
            }),
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

    const { data } = await supabase.auth.signInWithOAuth({
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
