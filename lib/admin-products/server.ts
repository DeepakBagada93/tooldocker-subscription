import { createClient } from '@/lib/supabase/server';
import { readPreviewAdminProducts } from '@/lib/admin-products/preview-products';
import type {
  AdminImportHistoryItem,
  AdminProductOption,
  AdminProductTableRow,
  AdminVendorOption,
} from '@/lib/admin-products/types';

type SupabaseLikeClient = Awaited<ReturnType<typeof createClient>>;
const PREVIEW_ACCESS_ENABLED = true;

export async function requireAdmin() {
  const supabase = await createClient();
  await assertAdmin(supabase);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user: user ?? null };
}

export async function assertAdmin(supabase: SupabaseLikeClient) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (PREVIEW_ACCESS_ENABLED && (authError || !user)) {
    return null;
  }

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

  if (PREVIEW_ACCESS_ENABLED && (profileError || profile?.role !== 'admin')) {
    return user;
  }

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

  const [{ data: categories }, { data: skuRows }] = await Promise.all([
    supabase.from('categories').select('id, name').order('name'),
    supabase.from('products').select('sku').not('sku', 'is', null),
  ]);

  const categoryOptions: AdminProductOption[] = (categories ?? []).map((category: any) => ({
    id: category.id,
    label: category.name,
  }));

  const existingSkus = new Set(
    (skuRows ?? [])
      .map((row: any) => String(row.sku ?? '').trim().toLowerCase())
      .filter(Boolean),
  );

  return {
    supabase,
    categoryOptions,
    vendorOptions: [],
    existingSkus,
  };
}

export async function getAdminProductsPageData() {
  const { supabase } = await requireAdmin();
  return getAdminProductsPageDataWithClient(supabase);
}

export async function getAdminProductsPageDataWithClient(supabase: SupabaseLikeClient) {
  await assertAdmin(supabase);

  const [productsResult, categoriesResult, importsResult, previewProducts] = await Promise.all([
    supabase
      .from('products')
      .select('id, title, description, specifications, seo_title, seo_description, category_id, price, sale_price, sku, stock_quantity, inventory_count, condition, brand, weight, dimensions, images, tags, is_published, created_at, categories(name)')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(500),
    supabase.from('categories').select('id, name').order('name'),
    supabase
      .from('product_imports')
      .select('id, file_name, total_products, success_count, failed_count, status, source_type, created_at')
      .order('created_at', { ascending: false })
      .limit(10),
    readPreviewAdminProducts(),
  ]);

  const productsFromDb: AdminProductTableRow[] = (productsResult.data ?? []).map((product: any) => ({
    id: product.id,
    title: product.title ?? 'Untitled product',
    description: product.description ?? '',
    specifications: isStringRecord(product.specifications) ? product.specifications : {},
    seoTitle: product.seo_title ?? '',
    seoDescription: product.seo_description ?? '',
    vendorId: null,
    vendorName: 'Tooldocker',
    storeId: null,
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
    isPreview: false,
  }));

  const products: AdminProductTableRow[] = [...previewProducts, ...productsFromDb];

  const categories: AdminProductOption[] = (categoriesResult.data ?? []).map((category: any) => ({
    id: category.id,
    label: category.name,
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
    vendors: [],
    importHistory,
  };
}

function isStringRecord(value: unknown): value is Record<string, string> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
