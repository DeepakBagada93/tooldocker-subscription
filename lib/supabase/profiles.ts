import type { User } from '@supabase/supabase-js'

export const APP_ROLES = ['admin', 'vendor', 'buyer'] as const

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

  const role = normalizeAppRole(user.user_metadata?.role)

  const payload = {
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

export async function ensureVendorStoreForUser(
  supabase: SupabaseLikeClient,
  user: User | null | undefined
) {
  if (!user) {
    return null
  }

  const role = normalizeAppRole(user.user_metadata?.role)
  if (role !== 'vendor') {
    return null
  }

  const { data: existingStore, error: existingStoreError } = await supabase
    .from('stores')
    .select('id, vendor_id')
    .eq('vendor_id', user.id)
    .maybeSingle()

  if (existingStoreError) {
    throw new Error(`Failed to check vendor store: ${existingStoreError.message}`)
  }

  if (existingStore?.id) {
    return existingStore
  }

  const storeName =
    user.user_metadata?.company_name ||
    user.user_metadata?.full_name ||
    user.email?.split('@')[0] ||
    'Vendor Store'

  const { data, error } = await supabase
    .from('stores')
    .insert({
      vendor_id: user.id,
      store_name: storeName,
      description:
        user.user_metadata?.business_summary ??
        'Vendor storefront created automatically during onboarding.',
      is_active: true,
    })
    .select('id, vendor_id')
    .single()

  if (error) {
    throw new Error(`Failed to create vendor store: ${error.message}`)
  }

  return data
}
