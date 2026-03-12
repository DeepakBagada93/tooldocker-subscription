'use server';

import { revalidatePath } from 'next/cache';
import {
  buildProductPayload,
  ensureCategoryExists,
  getVendorStoreByVendorId,
  validateAdminProductInput,
} from '@/lib/admin-products/mutations';
import { requireAdmin } from '@/lib/admin-products/server';
import type {
  AdminBulkEditInput,
  AdminMutationResult,
  AdminProductFormInput,
} from '@/lib/admin-products/types';

export async function createAdminProduct(input: AdminProductFormInput): Promise<AdminMutationResult> {
  try {
    const { supabase } = await requireAdmin();

    validateAdminProductInput(input);
    const [store] = await Promise.all([
      getVendorStoreByVendorId(supabase, input.vendorId),
      ensureCategoryExists(supabase, input.categoryId),
    ]);

    const payload = buildProductPayload({
      title: input.title,
      description: input.description,
      vendorId: input.vendorId,
      storeId: store.id,
      categoryId: input.categoryId,
      price: input.price,
      salePrice: input.salePrice ?? null,
      sku: input.sku,
      stockQuantity: input.stockQuantity,
      condition: input.condition,
      brand: input.brand,
      weight: input.weight,
      length: input.length,
      width: input.width,
      height: input.height,
      images: input.images,
      tags: input.tags,
      isPublished: input.isPublished,
    });

    const { error } = await supabase.from('products').insert(payload);
    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/admin/products');
    revalidatePath('/');

    return {
      ok: true,
      message: 'Product created successfully.',
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Failed to create product.',
    };
  }
}

export async function bulkEditAdminProducts(input: AdminBulkEditInput): Promise<AdminMutationResult> {
  try {
    const { supabase } = await requireAdmin();
    const productIds = [...new Set(input.productIds.map((id) => id.trim()).filter(Boolean))];

    if (!productIds.length) {
      throw new Error('Select at least one product.');
    }

    switch (input.action) {
      case 'update_price': {
        if (input.price == null || !Number.isFinite(input.price) || input.price < 0) {
          throw new Error('Provide a valid price for bulk update.');
        }
        if (input.salePrice != null && (!Number.isFinite(input.salePrice) || input.salePrice < 0)) {
          throw new Error('Provide a valid sale price.');
        }
        if (input.salePrice != null && input.salePrice > input.price) {
          throw new Error('Sale price cannot exceed the regular price.');
        }

        const { error } = await supabase
          .from('products')
          .update({
            price: input.price,
            sale_price: input.salePrice ?? null,
          })
          .in('id', productIds);

        if (error) throw new Error(error.message);
        break;
      }
      case 'change_category': {
        if (!input.categoryId) throw new Error('Select a category.');
        await ensureCategoryExists(supabase, input.categoryId);
        const { error } = await supabase
          .from('products')
          .update({ category_id: input.categoryId })
          .in('id', productIds);

        if (error) throw new Error(error.message);
        break;
      }
      case 'change_vendor': {
        if (!input.vendorId) throw new Error('Select a vendor.');
        const store = await getVendorStoreByVendorId(supabase, input.vendorId);
        const { error } = await supabase
          .from('products')
          .update({
            vendor_id: input.vendorId,
            store_id: store.id,
          })
          .in('id', productIds);

        if (error) throw new Error(error.message);
        break;
      }
      case 'update_stock': {
        if (input.stockQuantity == null || !Number.isInteger(input.stockQuantity) || input.stockQuantity < 0) {
          throw new Error('Provide a valid stock quantity.');
        }
        const { error } = await supabase
          .from('products')
          .update({
            stock_quantity: input.stockQuantity,
            inventory_count: input.stockQuantity,
          })
          .in('id', productIds);

        if (error) throw new Error(error.message);
        break;
      }
      case 'publish': {
        const { error } = await supabase
          .from('products')
          .update({ is_published: true })
          .in('id', productIds);

        if (error) throw new Error(error.message);
        break;
      }
      case 'unpublish': {
        const { error } = await supabase
          .from('products')
          .update({ is_published: false })
          .in('id', productIds);

        if (error) throw new Error(error.message);
        break;
      }
      case 'delete': {
        const { error } = await supabase
          .from('products')
          .delete()
          .in('id', productIds);

        if (error) throw new Error(error.message);
        break;
      }
      default:
        throw new Error('Unsupported bulk action.');
    }

    revalidatePath('/admin/products');
    revalidatePath('/');

    return {
      ok: true,
      message: `Bulk action ${input.action.replace(/_/g, ' ')} completed successfully.`,
      updatedCount: productIds.length,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Bulk action failed.',
    };
  }
}