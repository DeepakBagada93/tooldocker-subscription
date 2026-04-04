import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { compactUserAuthMetadataIfNeeded } from '@/lib/supabase/auth-metadata'
import {
    ensureUserProfile,
    normalizeAppRole,
} from '@/lib/supabase/profiles'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            const { data: { user } } = await supabase.auth.getUser()
            await compactUserAuthMetadataIfNeeded(supabase, user)
            const profile = await ensureUserProfile(supabase, user)
            const role = normalizeAppRole(profile?.role ?? user?.user_metadata?.role)

            let targetUrl = `${origin}${next}`
            if (next === '/') {
                if (role === 'admin') targetUrl = `${origin}/admin`
                else targetUrl = `${origin}/buyer`
            }

            return NextResponse.redirect(targetUrl)
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
