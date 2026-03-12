import { createClient } from '@/lib/supabase/server';
import type {
  AdminImportHistoryItem,
  AdminProductOption,
  AdminProductTableRow,
  AdminVendorOption,
} from '@/lib/admin-products/types';

type SupabaseLikeClient = Awaited<ReturnType<typeof createClient>>;

export async function requireAdmin() {
  const supabase = await createClient();
  await assertAdmin(supabase);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user: user! };
}

export async function assertAdmin(supabase: SupabaseLikeClient) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Unauthorized');
  }

  const userRole = user.user_metadata?.role;

  if (userRole === 'admin') {
    return user;
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || profile?.role !== 'admin') {
    throw new Error('Forbidden');
  }

  return user;
}

export async function getAdminProductLookups() {
  const { supabase } = await requireAdmin();
  return getAdminProductLookupsWithClient(supabase);
}

export async function getAdminProductLookupsWithClient(supabase: SupabaseLikeClient) {
  await assertAdmin(supabase);

  const [{ data: categories }, { data: stores }, { data: skuRows }] = await Promise.all([
    supabase.from('categories').select('id, name').order('name'),
    supabase.from('stores').select('id, vendor_id, store_name, is_active').order('store_name'),
    supabase.from('products').select('sku').not('sku', 'is', null),
  ]);

  const categoryOptions: AdminProductOption[] = (categories ?? []).map((category: any) => ({
    id: category.id,
    label: category.name,
  }));

  const vendorOptions: AdminVendorOption[] = (stores ?? []).map((store: any) => ({
    id: store.vendor_id,
    vendorId: store.vendor_id,
    storeId: store.id,
    label: store.store_name,
    isActive: Boolean(store.is_active),
  }));

  const existingSkus = new Set(
    (skuRows ?? [])
      .map((row: any) => String(row.sku ?? '').trim().toLowerCase())
      .filter(Boolean),
  );

  return {
    supabase,
    categoryOptions,
    vendorOptions,
    existingSkus,
  };
}

export async function getAdminProductsPageData() {
  const { supabase } = await requireAdmin();
  return getAdminProductsPageDataWithClient(supabase);
}

export async function getAdminProductsPageDataWithClient(supabase: SupabaseLikeClient) {
  await assertAdmin(supabase);

  const [productsResult, categoriesResult, storesResult, importsResult] = await Promise.all([
    supabase
      .from('products')
      .select('id, title, description, vendor_id, store_id, category_id, price, sale_price, sku, stock_quantity, inventory_count, condition, brand, weight, dimensions, images, tags, is_published, created_at, categories(name), stores(store_name)')
      .order('created_at', { ascending: false })
      .limit(500),
    supabase.from('categories').select('id, name').order('name'),
    supabase.from('stores').select('id, vendor_id, store_name, is_active').order('store_name'),
    supabase
      .from('product_imports')
      .select('id, file_name, total_products, success_count, failed_count, status, source_type, created_at')
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  const products: AdminProductTableRow[] = (productsResult.data ?? []).map((product: any) => ({
    id: product.id,
    title: product.title ?? 'Untitled product',
    description: product.description ?? '',
    vendorId: product.vendor_id ?? null,
    vendorName: product.stores?.store_name ?? 'Unknown vendor',
    storeId: product.store_id ?? null,
    categoryId: product.category_id ?? null,
    categoryName: product.categories?.name ?? 'Uncategorized',
    price: Number(product.price ?? 0),
    salePrice: product.sale_price == null ? null : Number(product.sale_price),
    sku: product.sku ?? '',
    stockQuantity: Number(product.stock_quantity ?? product.inventory_count ?? 0),
    condition: (product.condition ?? 'new') as AdminProductTableRow['condition'],
    brand: product.brand ?? '',
    weight: product.weight ?? '',
    length: String(product.dimensions?.length ?? ''),
    width: String(product.dimensions?.width ?? ''),
    height: String(product.dimensions?.height ?? ''),
    images: Array.isArray(product.images) ? product.images : [],
    tags: Array.isArray(product.tags) ? product.tags : [],
    isPublished: Boolean(product.is_published),
    createdAt: product.created_at ?? new Date().toISOString(),
  }));

  const categories: AdminProductOption[] = (categoriesResult.data ?? []).map((category: any) => ({
    id: category.id,
    label: category.name,
  }));

  const vendors: AdminVendorOption[] = (storesResult.data ?? []).map((store: any) => ({
    id: store.vendor_id,
    vendorId: store.vendor_id,
    storeId: store.id,
    label: store.store_name,
    isActive: Boolean(store.is_active),
  }));

  const importHistory: AdminImportHistoryItem[] = (importsResult.data ?? []).map((item: any) => ({
    id: item.id,
    fileName: item.file_name,
    totalProducts: Number(item.total_products ?? 0),
    successCount: Number(item.success_count ?? 0),
    failedCount: Number(item.failed_count ?? 0),
    status: item.status ?? 'completed',
    sourceType: item.source_type ?? 'csv',
    createdAt: item.created_at ?? new Date().toISOString(),
  }));

  return {
    products,
    categories,
    vendors,
    importHistory,
  };
}
