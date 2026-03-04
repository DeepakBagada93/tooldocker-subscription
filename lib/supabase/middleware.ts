import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_key',
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Fetch the user session
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const pathname = request.nextUrl.pathname

    // Public routes that don't need protection
    const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/auth')
    const isPublicRoute = pathname === '/' || pathname.match(/^\/(product|shop|categories)\/.*/)

    // 1. Unauthenticated users trying to access protected routes go to /login
    if (!user && !isAuthRoute && !isPublicRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // 2. Authenticated users trying to access login/signup go to their dashboard
    if (user && isAuthRoute) {
        const role = user.user_metadata?.role || 'buyer'
        const url = request.nextUrl.clone()

        if (role === 'admin') url.pathname = '/admin'
        else if (role === 'vendor') url.pathname = '/vendor'
        else url.pathname = '/dashboard' // buyer dashboard

        return NextResponse.redirect(url)
    }

    // 3. Role-Based Access Control (RBAC) Protection
    if (user) {
        const role = user.user_metadata?.role || 'buyer'

        // Protect Admin Routes
        if (pathname.startsWith('/admin') && role !== 'admin') {
            const url = request.nextUrl.clone()
            url.pathname = '/unauthorized' // Or redirect to their specific dashboard
            return NextResponse.redirect(url)
        }

        // Protect Vendor Routes (Admins can also view)
        if (pathname.startsWith('/vendor') && role !== 'vendor' && role !== 'admin') {
            const url = request.nextUrl.clone()
            url.pathname = '/unauthorized'
            return NextResponse.redirect(url)
        }

        // Buyer routes - technically both vendors and admins might need to act as buyers sometimes,
        // but typically we just restrict if explicit protection is needed.
        if (pathname.startsWith('/dashboard') && role !== 'buyer' && role !== 'admin') {
            // Optional: Vendors shouldn't see buyer dash
            const url = request.nextUrl.clone()
            url.pathname = '/vendor'
            return NextResponse.redirect(url)
        }
    }

    return supabaseResponse
}
