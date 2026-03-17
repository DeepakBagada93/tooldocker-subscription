import { SUBSCRIPTION_PLANS } from '@/lib/subscription-plans'

export const VENDOR_STATS = {
  grossSales: 125400.5,
  totalOrders: 452,
  activeProducts: 24,
  planUtilization: 96,
  subscriptionSpend: 129,
  revenueData: [
    { name: 'Jan', revenue: 12000 },
    { name: 'Feb', revenue: 15000 },
    { name: 'Mar', revenue: 18000 },
    { name: 'Apr', revenue: 14000 },
    { name: 'May', revenue: 22000 },
    { name: 'Jun', revenue: 25000 },
  ],
  topProducts: [
    { id: 'p1', name: 'Industrial Grade Arc Welder 400A', sales: 45, revenue: 58499.55 },
    { id: 'p3', name: 'Professional Impact Wrench Kit', sales: 128, revenue: 44798.72 },
    { id: 'p2', name: 'Hydraulic Excavator Bucket 24"', sales: 5, revenue: 12250.0 },
  ],
}

export const VENDOR_PRODUCTS = [
  { id: 'p1', name: 'Industrial Grade Arc Welder 400A', price: 1299.99, stock: 12, status: 'Active', category: 'Welding' },
  { id: 'p2', name: 'Hydraulic Excavator Bucket 24"', price: 2450.0, stock: 5, status: 'Active', category: 'Heavy Machinery' },
  { id: 'p3', name: 'Professional Impact Wrench Kit', price: 349.99, stock: 45, status: 'Active', category: 'Power Tools' },
  { id: 'p4', name: 'Safety Harness', price: 89.5, stock: 0, status: 'Out of Stock', category: 'Safety' },
]

export const VENDOR_ORDERS = [
  { id: 'ORD-9921', customer: 'John Doe', date: '2026-03-03', total: 1299.99, status: 'Processing' },
  { id: 'ORD-9920', customer: 'Jane Smith', date: '2026-03-02', total: 349.99, status: 'Shipped' },
  { id: 'ORD-9919', customer: 'Bob Johnson', date: '2026-03-01', total: 2450.0, status: 'Delivered' },
]

export const VENDOR_SUBSCRIPTION_INVOICES = [
  { id: 'INV-301', date: '2026-03-01', amount: 129.0, status: 'Paid', planName: 'Growth Monthly' },
  { id: 'INV-244', date: '2026-02-01', amount: 129.0, status: 'Paid', planName: 'Growth Monthly' },
  { id: 'INV-188', date: '2026-01-01', amount: 129.0, status: 'Paid', planName: 'Growth Monthly' },
]

export const VENDOR_SUBSCRIPTION_OVERVIEW = {
  currentPlan: SUBSCRIPTION_PLANS[1],
  status: 'Active',
  renewsOn: '2026-04-02',
  nextInvoiceAmount: 129.0,
  productCount: 24,
  productLimit: SUBSCRIPTION_PLANS[1].productLimit,
  analyticsReportsUsed: 18,
  analyticsReportsLimit: 999,
}
