import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import {
    isSupabaseConfigured,
    SUPABASE_ANON_KEY,
    SUPABASE_URL,
} from '@/lib/supabase/config'
import { getUserRole } from '@/lib/supabase/profiles'

const VENDOR_DASHBOARD_PATHS = [
    '/vendor',
    '/vendor/products',
    '/vendor/bulk-upload',
    '/vendor/orders',
    '/vendor/payouts',
    '/vendor/commission',
    '/vendor/settings',
]

function isVendorDashboardRoute(pathname: string) {
    return VENDOR_DASHBOARD_PATHS.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
    )
}

function isBuyerDashboardRoute(pathname: string) {
    return pathname === '/buyer' || pathname.startsWith('/buyer/')
}

function isAdminRoute(pathname: string) {
    return pathname === '/admin' || pathname.startsWith('/admin/')
}

export async function updateSession(request: NextRequest) {
    if (!isSupabaseConfigured()) {
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

    const isProtectedRoute =
        isAdminRoute(pathname) ||
        isVendorDashboardRoute(pathname) ||
        isBuyerDashboardRoute(pathname)

    const isAuthRoute =
        pathname.startsWith('/login') ||
        pathname.startsWith('/signup') ||
        pathname.startsWith('/register') ||
        pathname.startsWith('/auth')

    const isPublicRoute =
        pathname === '/' ||
        pathname === '/shop' ||
        pathname === '/categories' ||
        pathname === '/cart' ||
        pathname.match(/^\/(product|shop|categories)\/.*/) ||
        pathname.match(/^\/vendor\/[^/]+$/)

    if (!user && isProtectedRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    if (user && isAuthRoute) {
        const role = await getUserRole(supabase, user)
        const url = request.nextUrl.clone()

        if (role === 'admin') url.pathname = '/admin'
        else if (role === 'vendor') url.pathname = '/vendor'
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

        if (isVendorDashboardRoute(pathname) && role !== 'vendor' && role !== 'admin') {
            const url = request.nextUrl.clone()
            url.pathname = '/unauthorized'
            return NextResponse.redirect(url)
        }

        if (isBuyerDashboardRoute(pathname) && role !== 'buyer' && role !== 'admin') {
            const url = request.nextUrl.clone()
            url.pathname = '/vendor'
            return NextResponse.redirect(url)
        }
    }

    if (!user && !isAuthRoute && !isPublicRoute && !isProtectedRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
