import { DashboardLayout, type DashboardNavItem } from '@/components/layout/dashboard-layout';

const ADMIN_ITEMS: DashboardNavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: 'layout-dashboard' },
  { name: 'Vendors', href: '/admin/vendors', icon: 'shield-check' },
  { name: 'Products', href: '/admin/products', icon: 'package' },
  { name: 'Category Management', href: '/admin/categories', icon: 'layout-dashboard' },
  { name: 'Plans & Billing', href: '/admin/commission', icon: 'settings' },
  { name: 'Dispute Resolution', href: '/admin/disputes', icon: 'alert-triangle' },
  { name: 'Role Management', href: '/admin/roles', icon: 'users' },
  { name: 'Analytics', href: '/admin/analytics', icon: 'bar-chart-3' },
];

export const dynamic = 'force-dynamic';

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
