'use client';

import { DashboardLayout, type DashboardNavItem } from '@/components/layout/dashboard-layout';

const VENDOR_ITEMS: DashboardNavItem[] = [
  { name: 'Overview', href: '/vendor', icon: 'layout-dashboard' },
  { name: 'My Products', href: '/vendor/products', icon: 'package' },
  { name: 'Bulk Upload', href: '/vendor/bulk-upload', icon: 'bar-chart-3' },
  { name: 'Orders', href: '/vendor/orders', icon: 'truck' },
  { name: 'Billing', href: '/vendor/payouts', icon: 'credit-card' },
  { name: 'Subscription', href: '/vendor/commission', icon: 'shield-check' },
  { name: 'Settings', href: '/vendor/settings', icon: 'settings' },
];

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout role="Vendor" items={VENDOR_ITEMS}>
      {children}
    </DashboardLayout>
  );
}
