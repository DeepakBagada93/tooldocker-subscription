import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            // Get role for redirect
            const { data: { user } } = await supabase.auth.getUser()
            const role = user?.user_metadata?.role || 'buyer'

            let targetUrl = `${origin}${next}`
            if (next === '/') {
                if (role === 'admin') targetUrl = `${origin}/admin`
                else if (role === 'vendor') targetUrl = `${origin}/vendor`
                else targetUrl = `${origin}/dashboard`
            }

            return NextResponse.redirect(targetUrl)
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
