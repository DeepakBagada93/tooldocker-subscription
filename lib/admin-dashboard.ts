import { getSupabaseAdmin } from '@/lib/supabase/admin'

type MonthlyPoint = {
  name: string
  mrr: number
}

export type AdminDashboardData = {
  mrr: number
  activeVendors: number
  churnRate: number
  activeBuyers: number
  pendingVendorActivations: number
  moderationThroughput: number
  pastDueAccounts: number
  reviewSlaLabel: string
  billingHealthLabel: string
  vendorGrowthLabel: string
  mrrTrend: string
  vendorTrend: string
  churnTrend: string
  buyerTrend: string
  mrrData: MonthlyPoint[]
  actionRequired: {
    vendorActivations: number
    planManagement: number
    productModeration: number
  }
}

export type AdminVendorQueueItem = {
  id: string
  profileId: string
  storeId: string | null
  name: string
  email: string
  country: string
  appliedDate: string
  type: string
  subscriptionId: string | null
  subscriptionPlanKey: string | null
  subscriptionName: string
  subscriptionStatus: string
  status: string
  productAccess: 'approved' | 'pending' | 'blocked'
  productAccessLabel: string
  productLimit: number
  billingInterval: 'monthly' | 'yearly' | null
  bulkUploadEnabled: boolean
  isStoreActive: boolean
}

export type AdminSubscriptionPlanOption = {
  id: string
  planKey: string
  name: string
  billingInterval: 'monthly' | 'yearly'
  productLimit: number
  bulkUploadEnabled: boolean
}

function getFallbackAdminDashboardData(): AdminDashboardData {
  return {
    mrr: 0,
    activeVendors: 0,
    churnRate: 0,
    activeBuyers: 0,
    pendingVendorActivations: 0,
    moderationThroughput: 0,
    pastDueAccounts: 0,
    reviewSlaLabel: 'No data',
    billingHealthLabel: 'No data',
    vendorGrowthLabel: 'No data',
    mrrTrend: '0%',
    vendorTrend: '0%',
    churnTrend: '0%',
    buyerTrend: '0%',
    mrrData: [],
    actionRequired: {
      vendorActivations: 0,
      planManagement: 0,
      productModeration: 0,
    },
  }
}

type RawProfile = {
  id: string
  email: string | null
  full_name: string | null
  company_name: string | null
  created_at: string
}

type RawStore = {
  id: string
  vendor_id: string
  store_name: string
  is_active: boolean
  created_at: string
}

type RawSubscription = {
  id: string
  vendor_id: string
  status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'inactive'
  created_at: string
  billing_interval: 'monthly' | 'yearly' | null
  current_period_end: string | null
  subscription_plans:
    | {
        name: string
        price: number | string
        billing_interval: 'monthly' | 'yearly'
      }
    | {
        name: string
        price: number | string
        billing_interval: 'monthly' | 'yearly'
      }[]
    | null
}

function formatPercent(value: number) {
  const rounded = Math.round(value * 10) / 10
  return `${rounded > 0 ? '+' : ''}${rounded}%`
}

function toNumber(value: number | string | null | undefined) {
  if (typeof value === 'number') return value
  if (typeof value === 'string') return Number(value)
  return 0
}

function getPlanDetails(subscription: RawSubscription) {
  const plan = Array.isArray(subscription.subscription_plans)
    ? subscription.subscription_plans[0]
    : subscription.subscription_plans

  return {
    name: plan?.name ?? 'No plan',
    price: toNumber(plan?.price),
    interval: subscription.billing_interval ?? plan?.billing_interval ?? 'monthly',
  }
}

function monthlyRevenueAmount(subscription: RawSubscription) {
  const plan = getPlanDetails(subscription)
  return plan.interval === 'yearly' ? plan.price / 12 : plan.price
}

function compareIsoDates(a?: string | null, b?: string | null) {
  const aTime = a ? new Date(a).getTime() : 0
  const bTime = b ? new Date(b).getTime() : 0
  return aTime - bTime
}

function getLatestSubscriptions(subscriptions: RawSubscription[]) {
  const latestByVendor = new Map<string, RawSubscription>()

  for (const subscription of subscriptions) {
    const existing = latestByVendor.get(subscription.vendor_id)
    const existingRankDate = existing?.current_period_end || existing?.created_at
    const candidateRankDate = subscription.current_period_end || subscription.created_at

    if (!existing || compareIsoDates(candidateRankDate, existingRankDate) > 0) {
      latestByVendor.set(subscription.vendor_id, subscription)
    }
  }

  return latestByVendor
}

function getMonthLabel(date: Date) {
  return date.toLocaleString('en-US', { month: 'short' })
}

function buildMrrSeries(latestSubscriptions: RawSubscription[]) {
  const buckets: MonthlyPoint[] = []
  const today = new Date()

  for (let i = 5; i >= 0; i -= 1) {
    const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1)
    const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0, 23, 59, 59, 999)

    const mrr = latestSubscriptions.reduce((sum, subscription) => {
      const isCommitted = subscription.status === 'active' || subscription.status === 'trialing'
      const startedByThen = compareIsoDates(subscription.created_at, monthEnd.toISOString()) <= 0
      return isCommitted && startedByThen ? sum + monthlyRevenueAmount(subscription) : sum
    }, 0)

    buckets.push({
      name: getMonthLabel(monthDate),
      mrr: Math.round(mrr),
    })
  }

  return buckets
}

function computePeriodChange(current: number, previous: number) {
  if (previous === 0) {
    return current === 0 ? 0 : 100
  }

  return ((current - previous) / previous) * 100
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  try {
    const supabase = getSupabaseAdmin()

    const [
      vendorProfilesResult,
      storesResult,
      subscriptionsResult,
      buyersCountResult,
      productsCountResult,
    ] = await Promise.all([
      supabase
        .from('profiles')
        .select('id, email, full_name, company_name, created_at')
        .eq('role', 'vendor')
        .order('created_at', { ascending: true }),
      supabase
        .from('stores')
        .select('id, vendor_id, store_name, is_active, created_at')
        .order('created_at', { ascending: true }),
      supabase
        .from('vendor_subscriptions')
        .select('vendor_id, status, created_at, billing_interval, current_period_end, subscription_plans(name, price, billing_interval)')
        .order('created_at', { ascending: true }),
      supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'buyer'),
      supabase
        .from('products')
        .select('id', { count: 'exact', head: true }),
    ])

    if (vendorProfilesResult.error) throw new Error(vendorProfilesResult.error.message)
    if (storesResult.error) throw new Error(storesResult.error.message)
    if (subscriptionsResult.error) throw new Error(subscriptionsResult.error.message)
    if (buyersCountResult.error) throw new Error(buyersCountResult.error.message)
    if (productsCountResult.error) throw new Error(productsCountResult.error.message)

    const vendorProfiles = (vendorProfilesResult.data ?? []) as RawProfile[]
    const stores = (storesResult.data ?? []) as RawStore[]
    const subscriptions = (subscriptionsResult.data ?? []) as RawSubscription[]
    const latestSubscriptions = getLatestSubscriptions(subscriptions)
    const latestSubscriptionList = Array.from(latestSubscriptions.values())

    const activeVendors = stores.filter((store) => store.is_active).length
    const pastDueAccounts = latestSubscriptionList.filter((subscription) => subscription.status === 'past_due').length
    const committedSubscriptions = latestSubscriptionList.filter(
      (subscription) => subscription.status === 'active' || subscription.status === 'trialing'
    )
    const mrr = committedSubscriptions.reduce((sum, subscription) => sum + monthlyRevenueAmount(subscription), 0)
    const moderationThroughput = 100

    const pendingVendorActivations = vendorProfiles.filter((profile) => {
      const store = stores.find((entry) => entry.vendor_id === profile.id)
      const subscription = latestSubscriptions.get(profile.id)

      return !store || !store.is_active || !subscription || (subscription.status !== 'active' && subscription.status !== 'trialing')
    }).length

    const churnBase = vendorProfiles.length || 1
    const churnRate = Number(((pastDueAccounts / churnBase) * 100).toFixed(1))

    const now = new Date()
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const currentMonthVendors = vendorProfiles.filter((profile) => new Date(profile.created_at) >= currentMonthStart).length
    const previousMonthVendors = vendorProfiles.filter((profile) => {
      const createdAt = new Date(profile.created_at)
      return createdAt >= previousMonthStart && createdAt < currentMonthStart
    }).length

    const mrrSeries = buildMrrSeries(latestSubscriptionList)
    const currentMrrPoint = mrrSeries[mrrSeries.length - 1]?.mrr ?? 0
    const previousMrrPoint = mrrSeries[mrrSeries.length - 2]?.mrr ?? 0

    return {
      mrr: Math.round(mrr),
      activeVendors,
      churnRate,
      activeBuyers: buyersCountResult.count ?? 0,
      pendingVendorActivations,
      moderationThroughput,
      pastDueAccounts,
      reviewSlaLabel: pendingVendorActivations > 0 ? `${pendingVendorActivations} queued` : 'Clear',
      billingHealthLabel: pastDueAccounts > 0 ? `Watch ${pastDueAccounts}` : 'Healthy',
      vendorGrowthLabel: currentMonthVendors >= previousMonthVendors ? 'Positive' : 'Softening',
      mrrTrend: formatPercent(computePeriodChange(currentMrrPoint, previousMrrPoint)),
      vendorTrend: formatPercent(computePeriodChange(currentMonthVendors, previousMonthVendors)),
      churnTrend: pastDueAccounts > 0 ? `+${churnRate}%` : '0%',
      buyerTrend: `${buyersCountResult.count ?? 0} total`,
      mrrData: mrrSeries,
      actionRequired: {
        vendorActivations: pendingVendorActivations,
        planManagement: pastDueAccounts,
        productModeration: 0,
      },
    }
  } catch (error) {
    console.warn('Falling back to admin dashboard defaults', error)
    return getFallbackAdminDashboardData()
  }
}

export async function getAdminAnalyticsData() {
  const dashboardData = await getAdminDashboardData();
  
  // Build a default vendor growth series based on DB profiles if possible
  // For now, reuse buildMrrSeries logic for a simple growth indicator
  return {
    vendorGrowth: dashboardData.mrrData.map(point => ({
      name: point.name,
      vendors: Math.round(point.mrr / 50) || 0 // Very rough estimate for visualization
    })),
    stats: [
      { name: 'Avg. Order Value', value: '$0.00', trend: '0%', isUp: true },
      { name: 'Customer LTV', value: '$0.00', trend: '0%', isUp: true },
      { name: 'Churn Rate', value: `${dashboardData.churnRate}%`, trend: dashboardData.churnTrend, isUp: dashboardData.churnRate < 5 },
    ]
  };
}

function getVendorStatus(store: RawStore | undefined, subscription: RawSubscription | undefined) {
  if (!store) return 'Pending store setup'
  if (!store.is_active) return 'Inactive store'
  if (!subscription) return 'Subscription pending'
  if (subscription.status === 'past_due') return 'Past due'
  if (subscription.status === 'trialing') return 'Trialing'
  if (subscription.status === 'active') return 'Active'
  return 'Needs review'
}

function getProductAccessState(store: RawStore | undefined, subscription: RawSubscription | undefined) {
  if (!store || !store.is_active) {
    return {
      state: 'blocked' as const,
      label: 'Store inactive',
    }
  }

  if (!subscription) {
    return {
      state: 'pending' as const,
      label: 'Plan required',
    }
  }

  if (subscription.status === 'active' || subscription.status === 'trialing') {
    return {
      state: 'approved' as const,
      label: 'Can add products',
    }
  }

  if (subscription.status === 'past_due') {
    return {
      state: 'blocked' as const,
      label: 'Billing issue',
    }
  }

  return {
    state: 'pending' as const,
    label: 'Awaiting approval',
  }
}

export async function getAdminSubscriptionPlanOptions(): Promise<AdminSubscriptionPlanOption[]> {
  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('id, plan_key, name, billing_interval, product_limit, bulk_upload_enabled')
      .order('price', { ascending: true })

    if (error) {
      throw new Error(error.message)
    }

    return (data ?? []).map((plan) => ({
      id: String(plan.id),
      planKey: String(plan.plan_key),
      name: String(plan.name),
      billingInterval: plan.billing_interval as 'monthly' | 'yearly',
      productLimit: Number(plan.product_limit ?? 0),
      bulkUploadEnabled: Boolean(plan.bulk_upload_enabled),
    }))
  } catch (error) {
    console.warn('Unable to load subscription plans for admin queue', error)
    return []
  }
}

export async function getAdminVendorQueue(): Promise<AdminVendorQueueItem[]> {
  try {
    const supabase = getSupabaseAdmin()

    const [vendorProfilesResult, storesResult, subscriptionsResult] = await Promise.all([
      supabase
        .from('profiles')
        .select('id, email, full_name, company_name, created_at')
        .eq('role', 'vendor')
        .order('created_at', { ascending: false }),
      supabase
        .from('stores')
        .select('id, vendor_id, store_name, is_active, created_at')
        .order('created_at', { ascending: false }),
      supabase
        .from('vendor_subscriptions')
        .select('id, vendor_id, status, created_at, billing_interval, current_period_end, subscription_plans(plan_key, name, price, billing_interval, product_limit, bulk_upload_enabled)')
        .order('created_at', { ascending: false }),
    ])

    if (vendorProfilesResult.error) throw new Error(vendorProfilesResult.error.message)
    if (storesResult.error) throw new Error(storesResult.error.message)
    if (subscriptionsResult.error) throw new Error(subscriptionsResult.error.message)

    const vendorProfiles = (vendorProfilesResult.data ?? []) as RawProfile[]
    const stores = (storesResult.data ?? []) as RawStore[]
    const latestSubscriptions = getLatestSubscriptions((subscriptionsResult.data ?? []) as RawSubscription[])

    return vendorProfiles.map((profile) => {
      const store = stores.find((entry) => entry.vendor_id === profile.id)
      const subscription = latestSubscriptions.get(profile.id)
      const plan = subscription ? getPlanDetails(subscription) : null
      const name = store?.store_name || profile.company_name || profile.full_name || profile.email || 'Unnamed vendor'
      const productAccess = getProductAccessState(store, subscription)
      const rawPlan = subscription
        ? (Array.isArray(subscription.subscription_plans)
            ? subscription.subscription_plans[0]
            : subscription.subscription_plans)
        : null

      return {
        id: profile.id,
        profileId: profile.id,
        storeId: store?.id ?? null,
        name,
        email: profile.email ?? 'No email on file',
        country: 'Not provided',
        appliedDate: store?.created_at || profile.created_at,
        type: store ? 'Storefront' : 'Profile only',
        subscriptionId: subscription?.id ?? null,
        subscriptionPlanKey:
          rawPlan && typeof rawPlan === 'object' && 'plan_key' in rawPlan
            ? String(rawPlan.plan_key)
            : null,
        subscriptionName: plan?.name ?? 'No plan',
        subscriptionStatus: subscription?.status ?? 'inactive',
        status: getVendorStatus(store, subscription),
        productAccess: productAccess.state,
        productAccessLabel: productAccess.label,
        productLimit:
          rawPlan && typeof rawPlan === 'object' && 'product_limit' in rawPlan
            ? Number(rawPlan.product_limit ?? 0)
            : 0,
        billingInterval: subscription?.billing_interval ?? null,
        bulkUploadEnabled:
          rawPlan && typeof rawPlan === 'object' && 'bulk_upload_enabled' in rawPlan
            ? Boolean(rawPlan.bulk_upload_enabled)
            : false,
        isStoreActive: store?.is_active ?? false,
      }
    })
  } catch (error) {
    console.warn('Unable to load admin vendor queue', error)
    return []
  }
}
