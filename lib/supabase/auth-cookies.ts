import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { cookies } from 'next/headers'
import { SUPABASE_URL } from '@/lib/supabase/config'

function getSupabaseProjectRef() {
  try {
    const url = new URL(SUPABASE_URL)
    return url.hostname.split('.')[0] ?? 'supabase'
  } catch {
    return 'supabase'
  }
}

function getAuthCookieBaseNames() {
  const projectRef = getSupabaseProjectRef()
  return [
    `sb-${projectRef}-auth-token`,
    `sb-${projectRef}-auth-token-code-verifier`,
  ]
}

export async function clearSupabaseAuthCookies() {
  const cookieStore = await cookies()
  const expiredCookieOptions: Partial<ResponseCookie> = {
    expires: new Date(0),
    maxAge: 0,
    path: '/',
  }

  for (const baseName of getAuthCookieBaseNames()) {
    cookieStore.set(baseName, '', expiredCookieOptions)

    for (let index = 0; index < 10; index += 1) {
      cookieStore.set(`${baseName}.${index}`, '', expiredCookieOptions)
    }
  }
}
