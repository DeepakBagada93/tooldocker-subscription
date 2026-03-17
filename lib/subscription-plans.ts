export type PlanFeature = {
  label: string
  included: boolean
}

export type SubscriptionPlan = {
  id: string
  name: string
  slug: string
  interval: 'monthly' | 'yearly'
  price: number
  productLimit: number
  analyticsEnabled: boolean
  bulkUploadEnabled: boolean
  customStorefrontEnabled: boolean
  supportLevel: string
  description: string
  features: PlanFeature[]
  stripePriceId?: string
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan-starter-monthly',
    name: 'Starter',
    slug: 'starter-monthly',
    interval: 'monthly',
    price: 49,
    productLimit: 25,
    analyticsEnabled: false,
    bulkUploadEnabled: false,
    customStorefrontEnabled: false,
    supportLevel: 'Email support',
    description: 'For new suppliers testing Tooldocker with a focused catalog.',
    stripePriceId: 'price_starter_monthly',
    features: [
      { label: 'Up to 25 active products', included: true },
      { label: 'Manual product creation', included: true },
      { label: 'Basic store profile', included: true },
      { label: 'Bulk CSV/Excel uploads', included: false },
      { label: 'Advanced analytics', included: false },
      { label: 'Custom storefront modules', included: false },
    ],
  },
  {
    id: 'plan-growth-monthly',
    name: 'Growth',
    slug: 'growth-monthly',
    interval: 'monthly',
    price: 129,
    productLimit: 250,
    analyticsEnabled: true,
    bulkUploadEnabled: true,
    customStorefrontEnabled: false,
    supportLevel: 'Priority email support',
    description: 'For growing vendors that need bulk catalog tools and analytics.',
    stripePriceId: 'price_growth_monthly',
    features: [
      { label: 'Up to 250 active products', included: true },
      { label: 'Bulk CSV/Excel uploads', included: true },
      { label: 'Sales and catalog analytics', included: true },
      { label: 'Priority review queue', included: true },
      { label: 'Custom storefront modules', included: false },
      { label: 'Dedicated onboarding support', included: false },
    ],
  },
  {
    id: 'plan-scale-yearly',
    name: 'Scale',
    slug: 'scale-yearly',
    interval: 'yearly',
    price: 1290,
    productLimit: 1000,
    analyticsEnabled: true,
    bulkUploadEnabled: true,
    customStorefrontEnabled: true,
    supportLevel: 'Dedicated success manager',
    description: 'For enterprise catalogs that need scale, branding, and deeper visibility.',
    stripePriceId: 'price_scale_yearly',
    features: [
      { label: 'Up to 1,000 active products', included: true },
      { label: 'Bulk CSV/Excel uploads', included: true },
      { label: 'Advanced analytics and exports', included: true },
      { label: 'Custom storefront modules', included: true },
      { label: 'Dedicated onboarding support', included: true },
      { label: 'Annual billing discount', included: true },
    ],
  },
]
