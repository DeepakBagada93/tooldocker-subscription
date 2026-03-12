import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import type { AdminProductTableRow, ProductCondition } from '@/lib/admin-products/types';

const previewFilePath = path.join(process.cwd(), 'data', 'admin-preview-products.json');

type PreviewProductInput = {
  title: string;
  description: string;
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
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function createPreviewAdminProduct(input: PreviewProductInput) {
  const product: AdminProductTableRow = {
    id: `preview-${randomUUID()}`,
    title: input.title.trim(),
    description: input.description.trim(),
    vendorId: null,
    vendorName: 'Tooldocker Admin',
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
  };

  const current = await readPreviewAdminProducts();
  await mkdir(path.dirname(previewFilePath), { recursive: true });
  await writeFile(previewFilePath, JSON.stringify([product, ...current], null, 2), 'utf8');
  return product;
}
