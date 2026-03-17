import { SUBSCRIPTION_PLANS } from '@/lib/subscription-plans'

export const ADMIN_STATS = {
  mrr: 245000,
  activeVendors: 1240,
  churnRate: 2.4,
  activeBuyers: 45200,
  mrrData: [
    { name: 'Jan', mrr: 182000 },
    { name: 'Feb', mrr: 195000 },
    { name: 'Mar', mrr: 208000 },
    { name: 'Apr', mrr: 219000 },
    { name: 'May', mrr: 233000 },
    { name: 'Jun', mrr: 245000 },
  ],
  vendorGrowth: [
    { name: 'Jan', vendors: 800 },
    { name: 'Feb', vendors: 900 },
    { name: 'Mar', vendors: 1050 },
    { name: 'Apr', vendors: 1100 },
    { name: 'May', vendors: 1180 },
    { name: 'Jun', vendors: 1240 },
  ],
}

export const PENDING_VENDORS = [
  { id: 'v-101', name: 'Global Tools Inc', type: 'Manufacturer', country: 'Germany', appliedDate: '2026-03-01', status: 'Pending subscription setup' },
  { id: 'v-102', name: 'Precision Parts Co', type: 'Distributor', country: 'USA', appliedDate: '2026-03-02', status: 'Awaiting verification' },
  { id: 'v-103', name: 'Eco Industrial', type: 'Manufacturer', country: 'Japan', appliedDate: '2026-03-03', status: 'Ready for activation' },
]

export const MODERATION_PRODUCTS = [
  { id: 'p-501', name: 'High-Pressure Steam Valve', vendor: 'Global Tools Inc', category: 'Industrial Parts', submittedDate: '2026-03-01', status: 'In Review' },
  { id: 'p-502', name: 'Heavy Duty Crane Hook', vendor: 'SteelWorks Machinery', category: 'Heavy Machinery', submittedDate: '2026-03-02', status: 'In Review' },
  { id: 'p-503', name: 'Industrial Safety Goggles', vendor: 'SafeGuard Pro', category: 'Safety Gear', submittedDate: '2026-03-03', status: 'In Review' },
]

export const CATEGORIES_LIST = [
  { id: 'cat-1', name: 'Power Tools', slug: 'power-tools', productCount: 12400, status: 'Active' },
  { id: 'cat-2', name: 'Heavy Machinery', slug: 'heavy-machinery', productCount: 3200, status: 'Active' },
  { id: 'cat-3', name: 'Safety Gear', slug: 'safety-gear', productCount: 8500, status: 'Active' },
  { id: 'cat-4', name: 'Hand Tools', slug: 'hand-tools', productCount: 15000, status: 'Active' },
]

export const SUBSCRIPTION_PLAN_SUMMARIES = SUBSCRIPTION_PLANS.map((plan, index) => ({
  ...plan,
  activeVendors: [420, 610, 210][index] ?? 0,
  monthlyRevenue: [20580, 78690, 107500][index] ?? 0,
}))

export const ACTIVE_SUBSCRIPTIONS = [
  { id: 'sub-401', vendor: 'SteelWorks Machinery', plan: 'Growth Monthly', amount: 129, renewsOn: '2026-04-02', status: 'Active' },
  { id: 'sub-402', vendor: 'Global Tools Inc', plan: 'Starter Monthly', amount: 49, renewsOn: '2026-03-29', status: 'Trialing' },
  { id: 'sub-403', vendor: 'ForgePro Supply', plan: 'Scale Yearly', amount: 1290, renewsOn: '2027-01-10', status: 'Active' },
]

export const ADMIN_DISPUTES = [
  { id: 'DISP-501', buyer: 'John Doe', vendor: 'SteelWorks Machinery', reason: 'Damaged Product', status: 'Open', date: '2026-03-01' },
  { id: 'DISP-502', buyer: 'Jane Smith', vendor: 'MaxPower Tools', reason: 'Late Delivery', status: 'In Progress', date: '2026-03-02' },
]
