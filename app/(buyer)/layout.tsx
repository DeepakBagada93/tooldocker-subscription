'use client';

import { DashboardLayout, type DashboardNavItem } from '@/components/layout/dashboard-layout';

const BUYER_ITEMS: DashboardNavItem[] = [
  { name: 'Dashboard', href: '/buyer', icon: 'layout-dashboard' },
  { name: 'Order History', href: '/buyer/history', icon: 'history' },
  { name: 'Returns & Disputes', href: '/buyer/disputes', icon: 'message-square' },
  { name: 'Settings', href: '/buyer/settings', icon: 'settings' },
];

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout role="Buyer" items={BUYER_ITEMS}>
      {children}
    </DashboardLayout>
  );
}
