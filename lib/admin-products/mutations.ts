import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  AdminProductFormInput,
  ProductCondition,
} from '@/lib/admin-products/types';

type ProductPayloadInput = {
  title: string;
  description: string;
  specifications: Record<string, string>;
  seoTitle: string;
  seoDescription: string;
  vendorId: string | null;
  storeId: string;
  categoryId: string | null;
  price: number;
  salePrice: number | null;
  sku: string;
  stockQuantity: number;
  condition: ProductCondition;
  brand: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  images: string[];
  tags: string[];
  isPublished: boolean;
};

export type ProductInsertPayload = ReturnType<typeof buildProductPayload>;

export function validateAdminProductInput(input: AdminProductFormInput) {
  const title = input.title.trim();
  const categoryId = input.categoryId.trim();
  const sku = input.sku.trim();

  if (!title) throw new Error('Product title is required.');
  if (!categoryId) throw new Error('Category is required.');
  if (!sku) throw new Error('SKU is required.');
  if (!Number.isFinite(input.price) || input.price < 0) throw new Error('Price must be a valid positive number.');
  if (input.salePrice != null && (!Number.isFinite(input.salePrice) || input.salePrice < 0)) {
    throw new Error('Sale price must be a valid positive number.');
  }
  if (input.salePrice != null && input.salePrice > input.price) {
    throw new Error('Sale price cannot exceed the regular price.');
  }
  if (!Number.isInteger(input.stockQuantity) || input.stockQuantity < 0) {
    throw new Error('Stock quantity must be a non-negative integer.');
  }
}

export async function getVendorStoreByVendorId(supabase: SupabaseClient, vendorId: string) {
  const { data, error } = await supabase
    .from('stores')
    .select('id, vendor_id, store_name, is_active')
    .eq('vendor_id', vendorId)
    .single();

  if (error || !data) {
    throw new Error('Vendor store not found.');
  }

  if (!data.is_active) {
    throw new Error('Vendor store is inactive.');
  }

  return data;
}

export async function getOrCreateAdminStore(supabase: SupabaseClient, adminUserId: string) {
  const existingStore = await supabase
    .from('stores')
    .select('id, vendor_id, store_name, is_active')
    .eq('vendor_id', adminUserId)
    .single();

  if (existingStore.data) {
    if (!existingStore.data.is_active) {
      throw new Error('Admin store is inactive.');
    }
    return existingStore.data;
  }

  const { data, error } = await supabase
    .from('stores')
    .insert({
      vendor_id: adminUserId,
      store_name: 'Tooldocker',
      description: 'Internal storefront for admin-managed products.',
      is_active: true,
    })
    .select('id, vendor_id, store_name, is_active')
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? 'Admin store could not be created.');
  }

  return data;
}

export async function ensureCategoryExists(supabase: SupabaseClient, categoryId: string) {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name')
    .eq('id', categoryId)
    .single();

  if (error || !data) {
    throw new Error('Category not found.');
  }

  return data;
}

export function buildProductPayload(input: ProductPayloadInput) {
  return {
    store_id: input.storeId,
    vendor_id: input.vendorId,
    category_id: input.categoryId,
    title: input.title.trim(),
    description: input.description.trim() || null,
    specifications: sanitizeSpecifications(input.specifications),
    seo_title: input.seoTitle.trim() || null,
    seo_description: input.seoDescription.trim() || null,
    price: input.price,
    sale_price: input.salePrice,
    sku: input.sku.trim(),
    stock_quantity: input.stockQuantity,
    inventory_count: input.stockQuantity,
    condition: input.condition,
    brand: input.brand.trim() || null,
    weight: input.weight.trim() || null,
    dimensions: {
      length: input.length.trim(),
      width: input.width.trim(),
      height: input.height.trim(),
    },
    images: sanitizeTextArray(input.images),
    tags: sanitizeTextArray(input.tags),
    is_published: input.isPublished,
  };
}

export async function insertProductsInChunks(params: {
  supabase: SupabaseClient;
  rows: Array<{ rowNumber: number; payload: ProductInsertPayload }>;
  chunkSize?: number;
}) {
  const { supabase, rows, chunkSize = 100 } = params;
  const insertedProductIds = new Map<number, string>();
  const failedMessages = new Map<number, string>();

  for (let index = 0; index < rows.length; index += chunkSize) {
    const batch = rows.slice(index, index + chunkSize);

    const { data, error } = await supabase
      .from('products')
      .insert(batch.map((item) => item.payload))
      .select('id, sku');

    if (!error && data) {
      const idsBySku = new Map((data as Array<{ id: string; sku: string }>).map((item) => [item.sku, item.id]));
      for (const item of batch) {
        const productId = idsBySku.get(item.payload.sku);
        if (productId) {
          insertedProductIds.set(item.rowNumber, productId);
        } else {
          failedMessages.set(item.rowNumber, 'Product inserted but returned ID could not be resolved.');
        }
      }
      continue;
    }

    for (const item of batch) {
      const { data: singleInsert, error: singleError } = await supabase
        .from('products')
        .insert(item.payload)
        .select('id')
        .single();

      if (singleError || !singleInsert) {
        failedMessages.set(item.rowNumber, singleError?.message ?? 'Product insert failed.');
      } else {
        insertedProductIds.set(item.rowNumber, singleInsert.id);
      }
    }
  }

  return {
    insertedProductIds,
    failedMessages,
  };
}

export function sanitizeTextArray(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

export function sanitizeSpecifications(specifications: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(specifications)
      .map(([key, value]) => [key.trim(), value.trim()])
      .filter(([key, value]) => key && value),
  );
}
