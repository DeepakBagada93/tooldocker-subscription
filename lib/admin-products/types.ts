export const PRODUCT_IMPORT_HEADERS = [
  'product_name',
  'description',
  'vendor_id',
  'category_id',
  'price',
  'sale_price',
  'sku',
  'stock_quantity',
  'condition',
  'brand',
  'weight',
  'length',
  'width',
  'height',
  'images',
  'tags',
] as const;

export type ProductImportHeader = (typeof PRODUCT_IMPORT_HEADERS)[number];

export type ProductCondition = 'new' | 'used' | 'refurbished';

export type ProductImportSourceType = 'csv' | 'excel';

export type ProductImportStatus = 'pending' | 'completed' | 'failed' | 'partial';

export type AdminProductOption = {
  id: string;
  label: string;
};

export type AdminVendorOption = {
  id: string;
  vendorId: string;
  storeId: string;
  label: string;
  isActive: boolean;
};

export type AdminProductTableRow = {
  id: string;
  title: string;
  description: string;
  vendorId: string | null;
  vendorName: string;
  storeId: string | null;
  categoryId: string | null;
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
  createdAt: string;
};

export type AdminImportHistoryItem = {
  id: string;
  fileName: string;
  totalProducts: number;
  successCount: number;
  failedCount: number;
  status: ProductImportStatus;
  sourceType: ProductImportSourceType;
  createdAt: string;
};

export type AdminProductFormInput = {
  id?: string;
  title: string;
  description: string;
  vendorId: string;
  categoryId: string;
  price: number;
  salePrice?: number | null;
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

export type AdminBulkEditAction =
  | 'update_price'
  | 'change_category'
  | 'change_vendor'
  | 'update_stock'
  | 'publish'
  | 'unpublish'
  | 'delete';

export type AdminBulkEditInput = {
  productIds: string[];
  action: AdminBulkEditAction;
  price?: number;
  salePrice?: number | null;
  categoryId?: string;
  vendorId?: string;
  stockQuantity?: number;
};

export type ProductImportPreviewRow = {
  rowNumber: number;
  title: string;
  vendorId: string;
  vendorName: string;
  categoryId: string;
  categoryName: string;
  price: number | null;
  stockQuantity: number | null;
  sku: string;
  status: 'ready' | 'invalid';
  errors: string[];
};

export type ProductImportResponse = {
  ok: boolean;
  mode: 'preview' | 'confirm';
  fileName: string;
  sourceType: ProductImportSourceType;
  totalRows: number;
  readyRows: number;
  failedRows: number;
  previewRows: ProductImportPreviewRow[];
  failedReportRows: Array<Record<string, string | number | null>>;
  importId?: string;
  message?: string;
};

export type AdminMutationResult = {
  ok: boolean;
  message: string;
  updatedCount?: number;
};
