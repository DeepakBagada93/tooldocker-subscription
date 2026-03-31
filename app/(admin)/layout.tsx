'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import {
  LayoutDashboard,
  Users,
  Settings,
  ShieldCheck,
  BarChart3,
  AlertTriangle
} from 'lucide-react';

const ADMIN_ITEMS = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Vendors', href: '/admin/vendors', icon: ShieldCheck },
  { name: 'Category Management', href: '/admin/categories', icon: LayoutDashboard },
  { name: 'Plans & Billing', href: '/admin/commission', icon: Settings },
  { name: 'Dispute Resolution', href: '/admin/disputes', icon: AlertTriangle },
  { name: 'Role Management', href: '/admin/roles', icon: Users },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout role="Admin" items={ADMIN_ITEMS}>
      {children}
    </DashboardLayout>
  );
}
