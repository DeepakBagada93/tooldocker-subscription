import { AdminProductsManager } from '@/components/admin/admin-products-manager';
import { getAdminProductsPageData } from '@/lib/admin-products/server';

export default async function AdminProductsPage() {
  const data = await getAdminProductsPageData();

  return <AdminProductsManager {...data} />;
}
