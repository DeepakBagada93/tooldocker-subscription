'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Settings, 
  Package, 
  MessageSquare,
  Heart,
  History
} from 'lucide-react';

const BUYER_ITEMS = [
  { name: 'Dashboard', href: '/buyer', icon: LayoutDashboard },
  { name: 'Order History', href: '/buyer/history', icon: History },
  { name: 'Returns & Disputes', href: '/buyer/disputes', icon: MessageSquare },
  { name: 'Saved Vendors', href: '/buyer/vendors', icon: Heart },
  { name: 'Settings', href: '/buyer/settings', icon: Settings },
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
