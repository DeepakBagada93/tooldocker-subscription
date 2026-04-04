import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import {
    isSupabaseConfigured,
    SUPABASE_ANON_KEY,
    SUPABASE_URL,
} from '@/lib/supabase/config'
import { getUserRole } from '@/lib/supabase/profiles'

function isBuyerDashboardRoute(pathname: string) {
    if (pathname === '/buyer/login') return false
    return pathname === '/buyer' || pathname.startsWith('/buyer/')
}

function isAdminRoute(pathname: string) {
    return pathname === '/admin' || pathname.startsWith('/admin/')
}

export async function updateSession(request: NextRequest) {
    if (request.method === 'OPTIONS') {
        const origin = request.headers.get('origin') ?? '*'
        const requestedHeaders = request.headers.get('access-control-request-headers')

        return new NextResponse(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': origin,
                'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
                'Access-Control-Allow-Headers': requestedHeaders ?? 'Content-Type, Authorization, X-Requested-With',
                'Access-Control-Allow-Credentials': 'true',
                Vary: 'Origin, Access-Control-Request-Headers',
            },
        })
    }

    if (!isSupabaseConfigured()) {
        return NextResponse.next({
            request,
        })
    }

    const pathname = request.nextUrl.pathname
    const isApiRoute = pathname === '/api' || pathname.startsWith('/api/')

    const isProtectedRoute =
        isAdminRoute(pathname) ||
        isBuyerDashboardRoute(pathname)

    const isAuthRoute =
        pathname.startsWith('/login') ||
        pathname.startsWith('/signup') ||
        pathname.startsWith('/register') ||
        pathname.startsWith('/buyer/login') ||
        pathname.startsWith('/tooldocker-admin/login') ||
        pathname.startsWith('/auth')

    const isPublicRoute =
        pathname === '/' ||
        pathname === '/shop' ||
        pathname === '/search' ||
        pathname === '/categories' ||
        pathname === '/cart' ||
        pathname.match(/^\/category\/[^/]+$/) ||
        pathname.match(/^\/product\/[^/]+$/)

    if (isApiRoute || (!isProtectedRoute && !isAuthRoute)) {
        return NextResponse.next({
            request,
        })
    }

    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
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
        error,
    } = await supabase.auth.getUser()

    if (!user && isProtectedRoute) {
        const url = request.nextUrl.clone()
        if (pathname.startsWith('/admin')) url.pathname = '/tooldocker-admin/login'
        else if (pathname.startsWith('/buyer')) url.pathname = '/buyer/login'
        else url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    if (user && isAuthRoute) {
        const role = await getUserRole(supabase, user)
        const url = request.nextUrl.clone()

        if (role === 'admin') url.pathname = '/admin'
        else url.pathname = '/buyer'

        return NextResponse.redirect(url)
    }

    if (user && isProtectedRoute) {
        const role = await getUserRole(supabase, user)

        if (isAdminRoute(pathname) && role !== 'admin') {
            const url = request.nextUrl.clone()
            url.pathname = '/unauthorized'
            return NextResponse.redirect(url)
        }

        if (isBuyerDashboardRoute(pathname) && role !== 'buyer' && role !== 'admin') {
            const url = request.nextUrl.clone()
            url.pathname = '/buyer/login'
            return NextResponse.redirect(url)
        }
    }

    if (!user && !isAuthRoute && !isPublicRoute) {
        const url = request.nextUrl.clone()
        if (pathname.startsWith('/admin')) url.pathname = '/tooldocker-admin/login'
        else if (pathname.startsWith('/buyer')) url.pathname = '/buyer/login'
        else url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
