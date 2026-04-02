'use server';

import { revalidatePath } from 'next/cache';
import {
  buildProductPayload,
  ensureCategoryExists,
  getOrCreateAdminStore,
  getVendorStoreByVendorId,
  validateAdminProductInput,
} from '@/lib/admin-products/mutations';
import {
  createPreviewAdminProduct,
  duplicatePreviewAdminProduct,
  setPreviewAdminProductPublished,
  softDeletePreviewAdminProduct,
  updatePreviewAdminProduct,
} from '@/lib/admin-products/preview-products';
import { requireAdmin } from '@/lib/admin-products/server';
import type {
  AdminBulkEditInput,
  AdminMutationResult,
  AdminProductFormInput,
} from '@/lib/admin-products/types';

export async function createAdminProduct(input: AdminProductFormInput): Promise<AdminMutationResult> {
  try {
    const { supabase, user } = await requireAdmin();

    validateAdminProductInput(input);
    const category = await ensureCategoryExists(supabase, input.categoryId);

    if (!user) {
      await createPreviewAdminProduct({
        title: input.title,
        description: input.description,
        specifications: input.specifications,
        seoTitle: input.seoTitle,
        seoDescription: input.seoDescription,
        categoryId: input.categoryId,
        categoryName: category.name,
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

      revalidatePath('/admin/products');
      return {
        ok: true,
        message: 'Preview product created for admin mode.',
      };
    }

    const store = input.vendorId
      ? await getVendorStoreByVendorId(supabase, input.vendorId)
      : await getOrCreateAdminStore(supabase, user.id);

    const payload = buildProductPayload({
      title: input.title,
      description: input.description,
      specifications: input.specifications,
      seoTitle: input.seoTitle,
      seoDescription: input.seoDescription,
      vendorId: input.vendorId ?? user.id,
      storeId: store.id,
      categoryId: category.id,
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

export async function updateAdminProduct(input: AdminProductFormInput): Promise<AdminMutationResult> {
  try {
    if (!input.id) {
      throw new Error('Product ID is required.');
    }

    const { supabase, user } = await requireAdmin();
    validateAdminProductInput(input);
    const category = await ensureCategoryExists(supabase, input.categoryId);

    if (!user || input.id.startsWith('preview-')) {
      await updatePreviewAdminProduct(input.id, {
        title: input.title,
        description: input.description,
        specifications: input.specifications,
        seoTitle: input.seoTitle,
        seoDescription: input.seoDescription,
        categoryId: input.categoryId,
        categoryName: category.name,
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

      revalidatePath('/admin/products');
      return { ok: true, message: 'Preview product updated successfully.', productId: input.id };
    }

    const store = input.vendorId
      ? await getVendorStoreByVendorId(supabase, input.vendorId)
      : await getOrCreateAdminStore(supabase, user.id);

    const payload = buildProductPayload({
      title: input.title,
      description: input.description,
      specifications: input.specifications,
      seoTitle: input.seoTitle,
      seoDescription: input.seoDescription,
      vendorId: input.vendorId ?? user.id,
      storeId: store.id,
      categoryId: category.id,
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

    const { error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', input.id)
      .is('deleted_at', null);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/products');
    revalidatePath('/');

    return { ok: true, message: 'Product updated successfully.', productId: input.id };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Failed to update product.',
    };
  }
}

export async function duplicateAdminProduct(productId: string): Promise<AdminMutationResult> {
  try {
    const { supabase, user } = await requireAdmin();
    if (!productId.trim()) throw new Error('Product ID is required.');

    if (!user || productId.startsWith('preview-')) {
      const previewProduct = await duplicatePreviewAdminProduct(productId);
      revalidatePath('/admin/products');
      return { ok: true, message: 'Preview product duplicated.', productId: previewProduct.id };
    }

    const { data, error } = await supabase
      .from('products')
      .select('title, description, specifications, seo_title, seo_description, vendor_id, store_id, category_id, price, sale_price, sku, stock_quantity, condition, brand, weight, dimensions, images, tags')
      .eq('id', productId)
      .is('deleted_at', null)
      .single();

    if (error || !data) throw new Error(error?.message ?? 'Product not found.');

    const duplicatePayload = buildProductPayload({
      title: `${data.title} Copy`,
      description: data.description ?? '',
      specifications: isStringRecord(data.specifications) ? data.specifications : {},
      seoTitle: data.seo_title ?? '',
      seoDescription: data.seo_description ?? '',
      vendorId: data.vendor_id,
      storeId: data.store_id,
      categoryId: data.category_id,
      price: Number(data.price ?? 0),
      salePrice: data.sale_price == null ? null : Number(data.sale_price),
      sku: `${data.sku ?? productId}-COPY`,
      stockQuantity: Number(data.stock_quantity ?? 0),
      condition: data.condition,
      brand: data.brand ?? '',
      weight: data.weight ?? '',
      length: String(data.dimensions?.length ?? ''),
      width: String(data.dimensions?.width ?? ''),
      height: String(data.dimensions?.height ?? ''),
      images: Array.isArray(data.images) ? data.images : [],
      tags: Array.isArray(data.tags) ? data.tags : [],
      isPublished: false,
    });

    const { data: inserted, error: insertError } = await supabase
      .from('products')
      .insert(duplicatePayload)
      .select('id')
      .single();

    if (insertError || !inserted) throw new Error(insertError?.message ?? 'Failed to duplicate product.');

    revalidatePath('/admin/products');
    revalidatePath('/');

    return { ok: true, message: 'Product duplicated successfully.', productId: inserted.id };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Failed to duplicate product.',
    };
  }
}

export async function setAdminProductPublished(productId: string, isPublished: boolean): Promise<AdminMutationResult> {
  try {
    const { supabase, user } = await requireAdmin();
    if (!productId.trim()) throw new Error('Product ID is required.');

    if (!user || productId.startsWith('preview-')) {
      await setPreviewAdminProductPublished(productId, isPublished);
    } else {
      const { error } = await supabase
        .from('products')
        .update({ is_published: isPublished })
        .eq('id', productId)
        .is('deleted_at', null);

      if (error) throw new Error(error.message);
    }

    revalidatePath('/admin/products');
    revalidatePath('/');

    return {
      ok: true,
      message: isPublished ? 'Product published successfully.' : 'Product unpublished successfully.',
      productId,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Failed to update publish state.',
    };
  }
}

export async function deleteAdminProduct(productId: string): Promise<AdminMutationResult> {
  try {
    const { supabase, user } = await requireAdmin();
    if (!productId.trim()) throw new Error('Product ID is required.');

    if (!user || productId.startsWith('preview-')) {
      await softDeletePreviewAdminProduct(productId);
    } else {
      const { error } = await supabase
        .from('products')
        .update({ deleted_at: new Date().toISOString(), is_published: false })
        .eq('id', productId)
        .is('deleted_at', null);

      if (error) throw new Error(error.message);
    }

    revalidatePath('/admin/products');
    revalidatePath('/');

    return { ok: true, message: 'Product deleted successfully.', productId };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Failed to delete product.',
    };
  }
}

export async function bulkEditAdminProducts(input: AdminBulkEditInput): Promise<AdminMutationResult> {
  try {
    const { supabase, user } = await requireAdmin();
    const productIds = [...new Set(input.productIds.map((id) => id.trim()).filter(Boolean))];
    const previewIds = productIds.filter((id) => id.startsWith('preview-'));
    const dbIds = productIds.filter((id) => !id.startsWith('preview-'));

    if (!productIds.length) {
      throw new Error('Select at least one product.');
    }

    if (previewIds.length) {
      if (input.action === 'publish' || input.action === 'unpublish') {
        await Promise.all(previewIds.map((id) => setPreviewAdminProductPublished(id, input.action === 'publish')));
      } else if (input.action === 'delete') {
        await Promise.all(previewIds.map((id) => softDeletePreviewAdminProduct(id)));
      } else {
        throw new Error('Preview products currently support only publish, unpublish, or delete bulk actions.');
      }
    }

    if (!dbIds.length && (!user || previewIds.length)) {
      revalidatePath('/admin/products');
      return {
        ok: true,
        message: `Bulk action ${input.action.replace(/_/g, ' ')} completed successfully.`,
        updatedCount: productIds.length,
      };
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
          .in('id', dbIds);

        if (error) throw new Error(error.message);
        break;
      }
      case 'change_category': {
        if (!input.categoryId) throw new Error('Select a category.');
        await ensureCategoryExists(supabase, input.categoryId);
        const { error } = await supabase
          .from('products')
          .update({ category_id: input.categoryId })
          .in('id', dbIds);

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
          .in('id', dbIds);

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
          .in('id', dbIds);

        if (error) throw new Error(error.message);
        break;
      }
      case 'publish': {
        const { error } = await supabase
          .from('products')
          .update({ is_published: true })
          .in('id', dbIds);

        if (error) throw new Error(error.message);
        break;
      }
      case 'unpublish': {
        const { error } = await supabase
          .from('products')
          .update({ is_published: false })
          .in('id', dbIds);

        if (error) throw new Error(error.message);
        break;
      }
      case 'delete': {
        const { error } = await supabase
          .from('products')
          .update({ deleted_at: new Date().toISOString(), is_published: false })
          .in('id', dbIds);

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

function isStringRecord(value: unknown): value is Record<string, string> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
