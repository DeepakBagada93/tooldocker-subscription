import type { User } from '@supabase/supabase-js'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

const COMPACT_AUTH_METADATA_KEYS = ['role', 'full_name', 'company_name', 'phone'] as const

type CompactAuthMetadataKey = (typeof COMPACT_AUTH_METADATA_KEYS)[number]

type SessionClient = {
  auth: {
    refreshSession: () => Promise<unknown>
  }
}

export type CompactAuthMetadataInput = Partial<Record<CompactAuthMetadataKey, unknown>>

function readMetadataValue(
  metadata: User['user_metadata'],
  key: CompactAuthMetadataKey
) {
  const value = metadata?.[key]
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined
}

export function getCompactAuthMetadata(user: User | null | undefined) {
  return getCompactAuthMetadataFromSource(user?.user_metadata)
}

export function getCompactAuthMetadataFromSource(metadata: CompactAuthMetadataInput | null | undefined) {
  if (!metadata) {
    return {}
  }

  const compactMetadata: Partial<Record<CompactAuthMetadataKey, string>> = {}

  COMPACT_AUTH_METADATA_KEYS.forEach((key) => {
    const value = readMetadataValue(metadata, key)
    if (value) {
      compactMetadata[key] = value
    }
  })

  return compactMetadata
}

export function hasOversizedAuthMetadata(user: User | null | undefined) {
  if (!user?.user_metadata) {
    return false
  }

  const metadataKeys = Object.keys(user.user_metadata)
  const containsExtraKeys = metadataKeys.some(
    (key) => !COMPACT_AUTH_METADATA_KEYS.includes(key as CompactAuthMetadataKey)
  )

  return containsExtraKeys || JSON.stringify(user.user_metadata).length > 512
}

export async function compactUserAuthMetadataIfNeeded(
  sessionClient: SessionClient,
  user: User | null | undefined
) {
  if (!user || !hasOversizedAuthMetadata(user)) {
    return
  }

  try {
    const supabaseAdmin = getSupabaseAdmin()

    await supabaseAdmin.auth.admin.updateUserById(user.id, {
      user_metadata: getCompactAuthMetadata(user),
    })

    await sessionClient.auth.refreshSession()
  } catch (error) {
    console.warn('Unable to compact Supabase auth metadata for the current user.', error)
  }
}
