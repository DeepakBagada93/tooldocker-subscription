import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import type { AdminProductTableRow, ProductCondition } from '@/lib/admin-products/types';

const previewFilePath = path.join(process.cwd(), 'data', 'admin-preview-products.json');

type PreviewProductInput = {
  id?: string;
  title: string;
  description: string;
  specifications: Record<string, string>;
  seoTitle: string;
  seoDescription: string;
  categoryId: string;
  categoryName: string;
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

export async function readPreviewAdminProducts(): Promise<AdminProductTableRow[]> {
  try {
    const raw = await readFile(previewFilePath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item) => !item.deletedAt) : [];
  } catch {
    return [];
  }
}

export async function createPreviewAdminProduct(input: PreviewProductInput) {
  const product: AdminProductTableRow = {
    id: input.id ?? `preview-${randomUUID()}`,
    title: input.title.trim(),
    description: input.description.trim(),
    specifications: input.specifications,
    seoTitle: input.seoTitle.trim(),
    seoDescription: input.seoDescription.trim(),
    vendorId: null,
    vendorName: 'Tooldocker',
    storeId: null,
    categoryId: input.categoryId,
    categoryName: input.categoryName,
    price: input.price,
    salePrice: input.salePrice,
    sku: input.sku.trim(),
    stockQuantity: input.stockQuantity,
    condition: input.condition,
    brand: input.brand.trim(),
    weight: input.weight.trim(),
    length: input.length.trim(),
    width: input.width.trim(),
    height: input.height.trim(),
    images: [...input.images],
    tags: [...input.tags],
    isPublished: input.isPublished,
    createdAt: new Date().toISOString(),
    isPreview: true,
  };

  const current = await readPreviewAdminProducts();
  await mkdir(path.dirname(previewFilePath), { recursive: true });
  await writeFile(previewFilePath, JSON.stringify([product, ...current], null, 2), 'utf8');
  return product;
}

export async function updatePreviewAdminProduct(id: string, input: PreviewProductInput) {
  const current = await readPreviewAdminProducts();
  const existing = current.find((item) => item.id === id);

  if (!existing) {
    throw new Error('Preview product not found.');
  }

  const updated: AdminProductTableRow = {
    ...existing,
    title: input.title.trim(),
    description: input.description.trim(),
    specifications: input.specifications,
    seoTitle: input.seoTitle.trim(),
    seoDescription: input.seoDescription.trim(),
    categoryId: input.categoryId,
    categoryName: input.categoryName,
    price: input.price,
    salePrice: input.salePrice,
    sku: input.sku.trim(),
    stockQuantity: input.stockQuantity,
    condition: input.condition,
    brand: input.brand.trim(),
    weight: input.weight.trim(),
    length: input.length.trim(),
    width: input.width.trim(),
    height: input.height.trim(),
    images: [...input.images],
    tags: [...input.tags],
    isPublished: input.isPublished,
    isPreview: true,
  };

  await persistPreviewProducts(current.map((item) => (item.id === id ? updated : item)));
  return updated;
}

export async function duplicatePreviewAdminProduct(id: string) {
  const current = await readPreviewAdminProducts();
  const existing = current.find((item) => item.id === id);

  if (!existing) {
    throw new Error('Preview product not found.');
  }

  return createPreviewAdminProduct({
    title: `${existing.title} Copy`,
    description: existing.description,
    specifications: existing.specifications,
    seoTitle: existing.seoTitle,
    seoDescription: existing.seoDescription,
    categoryId: existing.categoryId ?? '',
    categoryName: existing.categoryName,
    price: existing.price,
    salePrice: existing.salePrice,
    sku: `${existing.sku}-COPY`,
    stockQuantity: existing.stockQuantity,
    condition: existing.condition,
    brand: existing.brand,
    weight: existing.weight,
    length: existing.length,
    width: existing.width,
    height: existing.height,
    images: existing.images,
    tags: existing.tags,
    isPublished: false,
  });
}

export async function setPreviewAdminProductPublished(id: string, isPublished: boolean) {
  const current = await readPreviewAdminProducts();
  const existing = current.find((item) => item.id === id);

  if (!existing) {
    throw new Error('Preview product not found.');
  }

  await persistPreviewProducts(
    current.map((item) => (item.id === id ? { ...item, isPublished } : item)),
  );
}

export async function softDeletePreviewAdminProduct(id: string) {
  const current = await readPreviewAdminProducts();
  const exists = current.some((item) => item.id === id);

  if (!exists) {
    throw new Error('Preview product not found.');
  }

  await persistPreviewProducts(current.filter((item) => item.id !== id));
}

async function persistPreviewProducts(products: AdminProductTableRow[]) {
  await mkdir(path.dirname(previewFilePath), { recursive: true });
  await writeFile(previewFilePath, JSON.stringify(products, null, 2), 'utf8');
}
