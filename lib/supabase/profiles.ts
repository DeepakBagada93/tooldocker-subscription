import type { User } from '@supabase/supabase-js'

export const APP_ROLES = ['admin', 'buyer'] as const

export type AppRole = (typeof APP_ROLES)[number]

type SupabaseLikeClient = {
  from: (table: string) => any
}

export function normalizeAppRole(value: unknown): AppRole {
  if (typeof value !== 'string') {
    return 'buyer'
  }

  const normalizedValue = value.trim().toLowerCase()
  return APP_ROLES.includes(normalizedValue as AppRole)
    ? (normalizedValue as AppRole)
    : 'buyer'
}

export async function getUserRole(
  supabase: SupabaseLikeClient,
  user: User | null | undefined
): Promise<AppRole> {
  if (!user) {
    return 'buyer'
  }

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (profile?.role) {
      return normalizeAppRole(profile.role)
    }
  } catch (error) {
    console.warn('Unable to read user role from profiles, falling back to metadata', error)
  }

  return normalizeAppRole(user.user_metadata?.role)
}

export async function ensureUserProfile(
  supabase: SupabaseLikeClient,
  user: User | null | undefined
) {
  if (!user) {
    return null
  }

  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  const role = existingProfile?.role
    ? normalizeAppRole(existingProfile.role)
    : normalizeAppRole(user.user_metadata?.role)

  const payload: {
    id: string
    email: string | null
    role: AppRole
    full_name: string | null
    phone: string | null
    company_name: string | null
  } = {
    id: user.id,
    email: user.email ?? null,
    role,
    full_name:
      user.user_metadata?.full_name ??
      user.user_metadata?.name ??
      user.user_metadata?.company_name ??
      null,
    phone: user.user_metadata?.phone ?? null,
    company_name: user.user_metadata?.company_name ?? null,
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert(payload, { onConflict: 'id' })
    .select('id, role')
    .single()

  if (error) {
    throw new Error(`Failed to sync profile: ${error.message}`)
  }

  return data
}
