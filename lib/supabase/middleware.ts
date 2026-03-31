import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import {
    isSupabaseConfigured,
    SUPABASE_ANON_KEY,
    SUPABASE_URL,
} from '@/lib/supabase/config'
import { getUserRole } from '@/lib/supabase/profiles'

const VENDOR_DASHBOARD_PATHS = [
    '/vendor/dashboard',
    '/vendor/products',
    '/vendor/bulk-upload',
    '/vendor/orders',
    '/vendor/payouts',
    '/vendor/commission',
    '/vendor/settings',
]

function isVendorDashboardRoute(pathname: string) {
    if (pathname === '/vendor') return true
    return VENDOR_DASHBOARD_PATHS.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
    )
}

function isBuyerDashboardRoute(pathname: string) {
    if (pathname === '/buyer/login') return false
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
    const isApiRoute = pathname === '/api' || pathname.startsWith('/api/')

    if (isApiRoute) {
        return supabaseResponse
    }

    const isProtectedRoute =
        isAdminRoute(pathname) ||
        isVendorDashboardRoute(pathname) ||
        isBuyerDashboardRoute(pathname)

    const isAuthRoute =
        pathname.startsWith('/login') ||
        pathname.startsWith('/signup') ||
        pathname.startsWith('/register') ||
        pathname.startsWith('/vendor/login') ||
        pathname.startsWith('/buyer/login') ||
        pathname.startsWith('/tooldocker-admin/login') ||
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
        if (pathname.startsWith('/admin')) url.pathname = '/tooldocker-admin/login'
        else if (pathname.startsWith('/vendor')) url.pathname = '/vendor/login'
        else if (pathname.startsWith('/buyer')) url.pathname = '/buyer/login'
        else url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    if (user && isAuthRoute) {
        const role = await getUserRole(supabase, user)
        const url = request.nextUrl.clone()

        if (role === 'admin') url.pathname = '/admin'
        else if (role === 'vendor') url.pathname = '/vendor/dashboard'
        else url.pathname = '/buyer'

        return NextResponse.redirect(url)
    }

    if (user && isProtectedRoute) {
        const role = await getUserRole(supabase, user)

        // Redirect /vendor to /vendor/dashboard
        if (pathname === '/vendor') {
            const url = request.nextUrl.clone()
            url.pathname = '/vendor/dashboard'
            return NextResponse.redirect(url)
        }

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
            url.pathname = '/buyer/login' // Correct redirect for buyer dashboard if role mismatch
            return NextResponse.redirect(url)
        }
    }

    if (!user && !isAuthRoute && !isPublicRoute && !isProtectedRoute) {
        const url = request.nextUrl.clone()
        if (pathname.startsWith('/admin')) url.pathname = '/tooldocker-admin/login'
        else if (pathname.startsWith('/vendor')) url.pathname = '/vendor/login'
        else if (pathname.startsWith('/buyer')) url.pathname = '/buyer/login'
        else url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
