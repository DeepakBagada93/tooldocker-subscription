'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

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

    // Redirect based on role
    const role = authData.user?.user_metadata?.role || 'buyer'
    let targetUrl = '/dashboard'
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

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
            data: {
                role: role,
                full_name: fullName
            }
        },
    })

    if (error) {
        return redirect('/signup?message=Could not sign up user')
    }

    return redirect('/login?message=Check email to continue sign in process')
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
