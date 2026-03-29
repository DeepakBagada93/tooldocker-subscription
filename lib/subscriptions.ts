import { createClient } from '@/lib/supabase/server'
import { SUBSCRIPTION_PLANS, type SubscriptionPlan } from '@/lib/subscription-plans'

export type VendorSubscriptionStatus = {
  hasActiveSubscription: boolean
  plan: SubscriptionPlan | null
  status: 'active' | 'trialing' | 'past_due' | 'inactive'
  currentPeriodEnd: string | null
  productLimit: number
  productCount: number
  remainingProductSlots: number
  planUtilization: number
  canCreateProduct: boolean
  canUseBulkUpload: boolean
  billingInterval: 'monthly' | 'yearly' | null
}

const MOCK_VENDOR_SUBSCRIPTION: VendorSubscriptionStatus = {
  hasActiveSubscription: true,
  plan: SUBSCRIPTION_PLANS[1],
  status: 'active',
  currentPeriodEnd: '2026-04-02T00:00:00.000Z',
  productLimit: SUBSCRIPTION_PLANS[1].productLimit,
  productCount: 24,
  remainingProductSlots: SUBSCRIPTION_PLANS[1].productLimit - 24,
  planUtilization: Math.round((24 / SUBSCRIPTION_PLANS[1].productLimit) * 100),
  canCreateProduct: true,
  canUseBulkUpload: true,
  billingInterval: SUBSCRIPTION_PLANS[1].interval,
}

export function getMockVendorSubscriptionStatus() {
  return MOCK_VENDOR_SUBSCRIPTION
}

function buildSubscriptionStatus(params: {
  plan: SubscriptionPlan | null
  status: VendorSubscriptionStatus['status']
  currentPeriodEnd: string | null
  productCount: number
}) {
  const plan = params.plan
  const productLimit = plan?.productLimit ?? 0
  const remainingProductSlots = Math.max(productLimit - params.productCount, 0)
  const isActive = Boolean(plan) && (params.status === 'active' || params.status === 'trialing')
  const planUtilization = productLimit > 0 ? Math.round((params.productCount / productLimit) * 100) : 0

  return {
    hasActiveSubscription: isActive,
    plan,
    status: params.status,
    currentPeriodEnd: params.currentPeriodEnd,
    productLimit,
    productCount: params.productCount,
    remainingProductSlots,
    planUtilization,
    canCreateProduct: isActive && remainingProductSlots > 0,
    canUseBulkUpload: isActive && Boolean(plan?.bulkUploadEnabled),
    billingInterval: plan?.interval ?? null,
  } satisfies VendorSubscriptionStatus
}

export async function getVendorSubscriptionStatus(userId?: string): Promise<VendorSubscriptionStatus> {
  const supabase = await createClient()

  try {
    const resolvedUserId = userId ?? (await supabase.auth.getUser()).data.user?.id
    if (!resolvedUserId) {
      return buildSubscriptionStatus({
        plan: null,
        status: 'inactive',
        currentPeriodEnd: null,
        productCount: 0,
      })
    }

    const { data: store } = await supabase
      .from('stores')
      .select('id')
      .eq('vendor_id', resolvedUserId)
      .single()

    if (!store?.id) {
      return buildSubscriptionStatus({
        plan: null,
        status: 'inactive',
        currentPeriodEnd: null,
        productCount: 0,
      })
    }

    const { count: productCount } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('store_id', store.id)

    const currentProductCount = productCount ?? 0

    const { data: subscription } = await supabase
      .from('vendor_subscriptions')
      .select('status, current_period_end, billing_interval, subscription_plans(plan_key)')
      .eq('vendor_id', resolvedUserId)
      .in('status', ['active', 'trialing', 'past_due'])
      .order('current_period_end', { ascending: false })
      .limit(1)
      .maybeSingle()

    const planKey =
      subscription?.subscription_plans &&
      typeof subscription.subscription_plans === 'object' &&
      'plan_key' in subscription.subscription_plans
        ? String(subscription.subscription_plans.plan_key)
        : null

    const plan =
      SUBSCRIPTION_PLANS.find((item) => item.id === planKey || item.slug === planKey) ?? null

    return buildSubscriptionStatus({
      plan,
      status: (subscription?.status as VendorSubscriptionStatus['status']) ?? 'inactive',
      currentPeriodEnd: subscription?.current_period_end ?? null,
      productCount: currentProductCount,
    })
  } catch (error) {
    console.warn('Falling back to mock vendor subscription status', error)
    return getMockVendorSubscriptionStatus()
  }
}
