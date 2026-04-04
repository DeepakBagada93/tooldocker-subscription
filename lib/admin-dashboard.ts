import { getSupabaseAdmin } from '@/lib/supabase/admin'

type MonthlyPoint = {
  name: string
  mrr: number
}

export type AdminDashboardData = {
  mrr: number
  activeBuyers: number
  totalProducts: number
  totalOrders: number
  reviewSlaLabel: string
  mrrTrend: string
  buyerTrend: string
  mrrData: MonthlyPoint[]
  actionRequired: {
    productModeration: number
  }
}

function getFallbackAdminDashboardData(): AdminDashboardData {
  return {
    mrr: 0,
    activeBuyers: 0,
    totalProducts: 0,
    totalOrders: 0,
    reviewSlaLabel: 'No data',
    mrrTrend: '0%',
    buyerTrend: '0%',
    mrrData: [],
    actionRequired: {
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
      buyersCountResult,
      productsCountResult,
      ordersCountResult,
    ] = await Promise.all([
      supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'buyer'),
      supabase
        .from('products')
        .select('id', { count: 'exact', head: true }),
      supabase
        .from('orders')
        .select('id', { count: 'exact', head: true }),
    ])

    if (buyersCountResult.error) throw new Error(buyersCountResult.error.message)
    if (productsCountResult.error) throw new Error(productsCountResult.error.message)
    if (ordersCountResult.error) throw new Error(ordersCountResult.error.message)

    const now = new Date()
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    // Generate simple MRR data (placeholder - would need actual revenue tracking)
    const mrrData = Array.from({ length: 6 }, (_, i) => {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
      return {
        name: monthDate.toLocaleString('en-US', { month: 'short' }),
        mrr: 0,
      }
    })

    return {
      mrr: 0,
      activeBuyers: buyersCountResult.count ?? 0,
      totalProducts: productsCountResult.count ?? 0,
      totalOrders: ordersCountResult.count ?? 0,
      reviewSlaLabel: 'No data',
      mrrTrend: '0%',
      buyerTrend: '0%',
      mrrData,
      actionRequired: {
        productModeration: 0,
      },
    }
  } catch (error) {
    console.warn('Failed to fetch admin dashboard data:', error)
    return getFallbackAdminDashboardData()
  }
}

export async function getAdminAnalyticsData() {
  const dashboardData = await getAdminDashboardData();

  return {
    stats: [
      { name: 'Total Products', value: dashboardData.totalProducts.toString(), trend: '0%', isUp: true },
      { name: 'Total Orders', value: dashboardData.totalOrders.toString(), trend: '0%', isUp: true },
      { name: 'Active Buyers', value: dashboardData.activeBuyers.toString(), trend: dashboardData.buyerTrend, isUp: true },
    ]
  };
}
