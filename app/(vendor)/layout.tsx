'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  BarChart3, 
  MessageSquare,
  Users,
  Truck
} from 'lucide-react';

const VENDOR_ITEMS = [
  { name: 'Overview', href: '/vendor', icon: LayoutDashboard },
  { name: 'My Products', href: '/vendor/products', icon: Package },
  { name: 'Bulk Upload', href: '/vendor/bulk-upload', icon: BarChart3 },
  { name: 'Orders', href: '/vendor/orders', icon: Truck },
  { name: 'Payouts', href: '/vendor/payouts', icon: MessageSquare },
  { name: 'Commission', href: '/vendor/commission', icon: Users },
  { name: 'Settings', href: '/vendor/settings', icon: Settings },
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
