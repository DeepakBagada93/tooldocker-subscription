import { createClient } from '@/lib/supabase/server'

export type DashboardUserSummary = {
  name: string
  email: string
  initials: string
}

function getInitials(name: string) {
  const cleaned = name.trim()
  if (!cleaned) return '??'

  return (
    cleaned
      .split(/\s+/)
      .map((part) => part[0] ?? '')
      .join('')
      .toUpperCase()
      .slice(0, 2) || '??'
  )
}

export async function getDashboardUserSummary(): Promise<DashboardUserSummary> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      name: 'Workspace User',
      email: '',
      initials: 'WU',
    }
  }

  let profileName: string | null = null

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, company_name')
      .eq('id', user.id)
      .maybeSingle()

    profileName = profile?.full_name || profile?.company_name || null
  } catch (error) {
    console.warn('Unable to read profile name for dashboard shell', error)
  }

  const name =
    profileName ||
    user.user_metadata?.full_name ||
    user.user_metadata?.company_name ||
    user.email?.split('@')[0] ||
    'Workspace User'

  return {
    name,
    email: user.email || '',
    initials: getInitials(name),
  }
}
