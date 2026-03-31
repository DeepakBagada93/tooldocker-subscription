import { AdminDashboardClient } from '@/components/admin/admin-dashboard-client'
import { getAdminDashboardData } from '@/lib/admin-dashboard'

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData()

  return <AdminDashboardClient data={data} />
}
