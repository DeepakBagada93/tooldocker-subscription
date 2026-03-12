'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  Loader2,
  PackagePlus,
  Search,
  UploadCloud,
  Wand2,
} from 'lucide-react';
import {
  bulkEditAdminProducts,
  createAdminProduct,
} from '@/app/actions/admin-products';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type {
  AdminBulkEditAction,
  AdminImportHistoryItem,
  AdminMutationResult,
  AdminProductOption,
  AdminProductTableRow,
  AdminVendorOption,
  ProductCondition,
  ProductImportResponse,
} from '@/lib/admin-products/types';

const PAGE_SIZE = 10;

type FeedbackState = {
  type: 'success' | 'error';
  text: string;
} | null;

type CreateFormState = {
  title: string;
  description: string;
  vendorId: string;
  categoryId: string;
  price: string;
  salePrice: string;
  sku: string;
  stockQuantity: string;
  condition: ProductCondition;
  brand: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  images: string;
  tags: string;
  isPublished: boolean;
};

type BulkFormState = {
  action: AdminBulkEditAction;
  price: string;
  salePrice: string;
  categoryId: string;
  vendorId: string;
  stockQuantity: string;
};

const INITIAL_CREATE_FORM: CreateFormState = {
  title: '',
  description: '',
  vendorId: '',
  categoryId: '',
  price: '',
  salePrice: '',
  sku: '',
  stockQuantity: '0',
  condition: 'new',
  brand: '',
  weight: '',
  length: '',
  width: '',
  height: '',
  images: '',
  tags: '',
  isPublished: true,
};

const INITIAL_BULK_FORM: BulkFormState = {
  action: 'publish',
  price: '',
  salePrice: '',
  categoryId: '',
  vendorId: '',
  stockQuantity: '',
};

export function AdminProductsManager(props: {
  products: AdminProductTableRow[];
  categories: AdminProductOption[];
  vendors: AdminVendorOption[];
  importHistory: AdminImportHistoryItem[];
}) {
  const { products, categories, vendors, importHistory } = props;
  const router = useRouter();
  const [search, setSearch] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('all');
  const [vendorFilter, setVendorFilter] = React.useState('all');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [createForm, setCreateForm] = React.useState(INITIAL_CREATE_FORM);
  const [bulkForm, setBulkForm] = React.useState(INITIAL_BULK_FORM);
  const [createFeedback, setCreateFeedback] = React.useState<FeedbackState>(null);
  const [bulkFeedback, setBulkFeedback] = React.useState<FeedbackState>(null);
  const [importFeedback, setImportFeedback] = React.useState<FeedbackState>(null);
  const [preview, setPreview] = React.useState<ProductImportResponse | null>(null);
  const [spreadsheetFile, setSpreadsheetFile] = React.useState<File | null>(null);
  const [zipFile, setZipFile] = React.useState<File | null>(null);
  const [importPending, setImportPending] = React.useState(false);
  const [fileInputVersion, setFileInputVersion] = React.useState(0);
  const [createPending, startCreateTransition] = React.useTransition();
  const [bulkPending, startBulkTransition] = React.useTransition();

  const filteredProducts = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.title.toLowerCase().includes(query) ||
        product.vendorName.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query);
      const matchesCategory = categoryFilter === 'all' || product.categoryId === categoryFilter;
      const matchesVendor = vendorFilter === 'all' || product.vendorId === vendorFilter;

      return matchesSearch && matchesCategory && matchesVendor;
    });
  }, [products, search, categoryFilter, vendorFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));

  React.useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const visibleProducts = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredProducts]);

  const allVisibleSelected =
    visibleProducts.length > 0 && visibleProducts.every((product) => selectedIds.includes(product.id));

  const summary = React.useMemo(() => {
    const publishedCount = products.filter((product) => product.isPublished).length;
    const lowStockCount = products.filter((product) => product.stockQuantity <= 5).length;
    const importFailures = importHistory.reduce((sum, item) => sum + item.failedCount, 0);

    return {
      publishedCount,
      lowStockCount,
      importFailures,
    };
  }, [importHistory, products]);

  function updateCreateForm<K extends keyof CreateFormState>(key: K, value: CreateFormState[K]) {
    setCreateForm((current) => ({ ...current, [key]: value }));
  }

  function updateBulkForm<K extends keyof BulkFormState>(key: K, value: BulkFormState[K]) {
    setBulkForm((current) => ({ ...current, [key]: value }));
  }

  function toggleAllVisible(checked: boolean) {
    setSelectedIds((current) => {
      const visibleIds = visibleProducts.map((product) => product.id);
      if (checked) {
        return [...new Set([...current, ...visibleIds])];
      }

      return current.filter((id) => !visibleIds.includes(id));
    });
  }

  function toggleSelection(productId: string, checked: boolean) {
    setSelectedIds((current) =>
      checked ? [...new Set([...current, productId])] : current.filter((id) => id !== productId),
    );
  }

  function buildCreatePayload() {
    return {
      title: createForm.title,
      description: createForm.description,
      vendorId: createForm.vendorId,
      categoryId: createForm.categoryId,
      price: Number(createForm.price),
      salePrice: createForm.salePrice ? Number(createForm.salePrice) : null,
      sku: createForm.sku,
      stockQuantity: Number.parseInt(createForm.stockQuantity || '0', 10),
      condition: createForm.condition,
      brand: createForm.brand,
      weight: createForm.weight,
      length: createForm.length,
      width: createForm.width,
      height: createForm.height,
      images: splitPipeList(createForm.images),
      tags: splitPipeList(createForm.tags),
      isPublished: createForm.isPublished,
    };
  }

  function buildBulkPayload() {
    return {
      productIds: selectedIds,
      action: bulkForm.action,
      price: bulkForm.price ? Number(bulkForm.price) : undefined,
      salePrice: bulkForm.salePrice ? Number(bulkForm.salePrice) : undefined,
      categoryId: bulkForm.categoryId || undefined,
      vendorId: bulkForm.vendorId || undefined,
      stockQuantity: bulkForm.stockQuantity ? Number.parseInt(bulkForm.stockQuantity, 10) : undefined,
    };
  }

  function handleCreateSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreateFeedback(null);

    startCreateTransition(() => {
      void submitCreate();
    });
  }

  async function submitCreate() {
    const result = await createAdminProduct(buildCreatePayload());
    setCreateFeedback(toFeedback(result));

    if (result.ok) {
      setCreateForm(INITIAL_CREATE_FORM);
      router.refresh();
    }
  }

  function handleBulkSubmit() {
    setBulkFeedback(null);
    startBulkTransition(() => {
      void submitBulk();
    });
  }

  async function submitBulk() {
    const result = await bulkEditAdminProducts(buildBulkPayload());
    setBulkFeedback(toFeedback(result));

    if (result.ok) {
      setSelectedIds([]);
      setBulkForm(INITIAL_BULK_FORM);
      router.refresh();
    }
  }

  async function runImport(mode: 'preview' | 'confirm') {
    if (!spreadsheetFile) {
      setImportFeedback({ type: 'error', text: 'Choose a CSV or Excel file first.' });
      return;
    }

    setImportPending(true);
    setImportFeedback(null);

    try {
      const formData = new FormData();
      formData.append('mode', mode);
      formData.append('spreadsheet', spreadsheetFile);
      if (zipFile) {
        formData.append('imagesZip', zipFile);
      }

      const response = await fetch('/api/admin/products/import', {
        method: 'POST',
        body: formData,
      });
      const payload = (await response.json()) as ProductImportResponse & { message?: string };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.message || 'Import request failed.');
      }

      setPreview(payload);
      setImportFeedback({
        type: 'success',
        text: payload.message || (mode === 'preview' ? 'Preview ready.' : 'Import completed.'),
      });

      if (mode === 'confirm') {
        setSelectedIds([]);
        setFileInputVersion((value) => value + 1);
        setSpreadsheetFile(null);
        setZipFile(null);
        router.refresh();
      }
    } catch (error) {
      setImportFeedback({
        type: 'error',
        text: error instanceof Error ? error.message : 'Import failed.',
      });
    } finally {
      setImportPending(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Admin Product Management</h1>
          <p className="text-muted-foreground">
            Create products, upload up to 1000 items in bulk, run admin-only bulk edits, and review import history.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <a href="/api/admin/products/template">
              <Download className="mr-2 h-4 w-4" />
              Download template
            </a>
          </Button>
          <Button onClick={() => void runImport('preview')} disabled={!spreadsheetFile || importPending}>
            {importPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
            Preview import
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Total products" value={String(products.length)} hint="Current catalog size" />
        <SummaryCard label="Published" value={String(summary.publishedCount)} hint="Visible on the marketplace" />
        <SummaryCard label="Import failures" value={String(summary.importFailures)} hint="Rows that need correction" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Catalog table</CardTitle>
            <CardDescription>Search, filter, paginate, and select products for admin-only bulk actions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 lg:grid-cols-[1fr_220px_220px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by title, vendor, or SKU"
                  className="pl-10"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="all">All categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
              <select
                value={vendorFilter}
                onChange={(event) => setVendorFilter(event.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="all">All vendors</option>
                {vendors.map((vendor) => (
                  <option key={vendor.vendorId} value={vendor.vendorId}>
                    {vendor.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="overflow-hidden rounded-xl border">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900/50">
                    <tr className="border-b">
                      <th className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={allVisibleSelected}
                          onChange={(event) => toggleAllVisible(event.target.checked)}
                          aria-label="Select all visible products"
                        />
                      </th>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider text-muted-foreground">Product</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider text-muted-foreground">Vendor</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider text-muted-foreground">Category</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider text-muted-foreground">Price</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider text-muted-foreground">Stock</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleProducts.map((product) => (
                      <tr key={product.id} className="border-b last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-900/30">
                        <td className="px-4 py-3 align-top">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(product.id)}
                            onChange={(event) => toggleSelection(product.id, event.target.checked)}
                            aria-label={`Select ${product.title}`}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold">{product.title}</div>
                          <div className="text-xs text-muted-foreground">SKU: {product.sku || '—'}</div>
                        </td>
                        <td className="px-4 py-3">{product.vendorName}</td>
                        <td className="px-4 py-3">{product.categoryName}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium">₹{product.price.toFixed(2)}</div>
                          {product.salePrice != null ? (
                            <div className="text-xs text-muted-foreground">Sale ₹{product.salePrice.toFixed(2)}</div>
                          ) : null}
                        </td>
                        <td className="px-4 py-3">
                          <span className={product.stockQuantity <= 5 ? 'font-semibold text-amber-600' : ''}>
                            {product.stockQuantity}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={product.isPublished ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}>
                            {product.isPublished ? 'Published' : 'Draft'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                    {!visibleProducts.length ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                          No products match the current filters.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {visibleProducts.length} of {filteredProducts.length} filtered products.
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1}>
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages}>
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Add single product</CardTitle>
              <CardDescription>Create a catalog product directly as an admin.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleCreateSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Product title">
                    <Input value={createForm.title} onChange={(event) => updateCreateForm('title', event.target.value)} required />
                  </Field>
                  <Field label="SKU">
                    <Input value={createForm.sku} onChange={(event) => updateCreateForm('sku', event.target.value)} required />
                  </Field>
                  <Field label="Vendor">
                    <select value={createForm.vendorId} onChange={(event) => updateCreateForm('vendorId', event.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm" required>
                      <option value="">Select vendor</option>
                      {vendors.map((vendor) => (
                        <option key={vendor.vendorId} value={vendor.vendorId}>
                          {vendor.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Category">
                    <select value={createForm.categoryId} onChange={(event) => updateCreateForm('categoryId', event.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm" required>
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Price">
                    <Input type="number" min="0" step="0.01" value={createForm.price} onChange={(event) => updateCreateForm('price', event.target.value)} required />
                  </Field>
                  <Field label="Sale price">
                    <Input type="number" min="0" step="0.01" value={createForm.salePrice} onChange={(event) => updateCreateForm('salePrice', event.target.value)} />
                  </Field>
                  <Field label="Stock quantity">
                    <Input type="number" min="0" step="1" value={createForm.stockQuantity} onChange={(event) => updateCreateForm('stockQuantity', event.target.value)} required />
                  </Field>
                  <Field label="Condition">
                    <select value={createForm.condition} onChange={(event) => updateCreateForm('condition', event.target.value as ProductCondition)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
                      <option value="new">New</option>
                      <option value="used">Used</option>
                      <option value="refurbished">Refurbished</option>
                    </select>
                  </Field>
                  <Field label="Brand">
                    <Input value={createForm.brand} onChange={(event) => updateCreateForm('brand', event.target.value)} />
                  </Field>
                  <Field label="Weight">
                    <Input value={createForm.weight} onChange={(event) => updateCreateForm('weight', event.target.value)} placeholder="e.g. 2.4kg" />
                  </Field>
                  <Field label="Length">
                    <Input value={createForm.length} onChange={(event) => updateCreateForm('length', event.target.value)} />
                  </Field>
                  <Field label="Width">
                    <Input value={createForm.width} onChange={(event) => updateCreateForm('width', event.target.value)} />
                  </Field>
                  <Field label="Height">
                    <Input value={createForm.height} onChange={(event) => updateCreateForm('height', event.target.value)} />
                  </Field>
                  <Field label="Publish now">
                    <label className="flex h-10 items-center gap-3 rounded-md border border-input px-3 text-sm">
                      <input type="checkbox" checked={createForm.isPublished} onChange={(event) => updateCreateForm('isPublished', event.target.checked)} />
                      Publish after create
                    </label>
                  </Field>
                </div>

                <Field label="Description">
                  <textarea value={createForm.description} onChange={(event) => updateCreateForm('description', event.target.value)} className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                </Field>
                <Field label="Images (pipe-separated URLs)">
                  <Input value={createForm.images} onChange={(event) => updateCreateForm('images', event.target.value)} placeholder="https://...|https://..." />
                </Field>
                <Field label="Tags (pipe-separated)">
                  <Input value={createForm.tags} onChange={(event) => updateCreateForm('tags', event.target.value)} placeholder="power-tools|cutting|industrial" />
                </Field>

                <FeedbackBanner feedback={createFeedback} />

                <Button type="submit" disabled={createPending}>
                  {createPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PackagePlus className="mr-2 h-4 w-4" />}
                  Create product
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Bulk edit selected products</CardTitle>
              <CardDescription>{selectedIds.length} product(s) selected for admin-only bulk operations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Bulk action">
                <select value={bulkForm.action} onChange={(event) => updateBulkForm('action', event.target.value as AdminBulkEditAction)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
                  <option value="publish">Publish</option>
                  <option value="unpublish">Unpublish</option>
                  <option value="update_price">Update price</option>
                  <option value="update_stock">Update stock</option>
                  <option value="change_category">Change category</option>
                  <option value="change_vendor">Change vendor</option>
                  <option value="delete">Delete</option>
                </select>
              </Field>

              {bulkForm.action === 'update_price' ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="New price">
                    <Input type="number" min="0" step="0.01" value={bulkForm.price} onChange={(event) => updateBulkForm('price', event.target.value)} />
                  </Field>
                  <Field label="New sale price">
                    <Input type="number" min="0" step="0.01" value={bulkForm.salePrice} onChange={(event) => updateBulkForm('salePrice', event.target.value)} />
                  </Field>
                </div>
              ) : null}

              {bulkForm.action === 'update_stock' ? (
                <Field label="Stock quantity">
                  <Input type="number" min="0" step="1" value={bulkForm.stockQuantity} onChange={(event) => updateBulkForm('stockQuantity', event.target.value)} />
                </Field>
              ) : null}

              {bulkForm.action === 'change_category' ? (
                <Field label="Target category">
                  <select value={bulkForm.categoryId} onChange={(event) => updateBulkForm('categoryId', event.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </Field>
              ) : null}

              {bulkForm.action === 'change_vendor' ? (
                <Field label="Target vendor">
                  <select value={bulkForm.vendorId} onChange={(event) => updateBulkForm('vendorId', event.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
                    <option value="">Select vendor</option>
                    {vendors.map((vendor) => (
                      <option key={vendor.vendorId} value={vendor.vendorId}>
                        {vendor.label}
                      </option>
                    ))}
                  </select>
                </Field>
              ) : null}

              <FeedbackBanner feedback={bulkFeedback} />

              <Button onClick={handleBulkSubmit} disabled={!selectedIds.length || bulkPending} variant={bulkForm.action === 'delete' ? 'destructive' : 'default'}>
                {bulkPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Run bulk action
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Bulk upload</CardTitle>
            <CardDescription>
              Upload CSV or Excel files with optional ZIP images. Invalid rows are skipped and exportable as an error report.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Spreadsheet file">
                <Input
                  key={`sheet-${fileInputVersion}`}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={(event) => setSpreadsheetFile(event.target.files?.[0] ?? null)}
                />
              </Field>
              <Field label="Images ZIP (optional)">
                <Input
                  key={`zip-${fileInputVersion}`}
                  type="file"
                  accept=".zip"
                  onChange={(event) => setZipFile(event.target.files?.[0] ?? null)}
                />
              </Field>
            </div>

            <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
              <p>Accepted formats: CSV, XLSX, XLS. Maximum 1000 products per upload.</p>
              <p>Image column supports public URLs or ZIP filenames matched by name or SKU.</p>
            </div>

            <FeedbackBanner feedback={importFeedback} />

            <div className="flex flex-wrap gap-2">
              <Button onClick={() => void runImport('preview')} disabled={!spreadsheetFile || importPending}>
                {importPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                Preview upload
              </Button>
              <Button
                variant="outline"
                onClick={() => void runImport('confirm')}
                disabled={!spreadsheetFile || importPending || !preview || preview.readyRows === 0}
              >
                Confirm import
              </Button>
              <Button
                variant="ghost"
                onClick={() => preview?.failedReportRows.length && downloadCsv('product-import-preview-errors.csv', preview.failedReportRows)}
                disabled={!preview?.failedReportRows.length}
              >
                Download preview errors
              </Button>
            </div>

            {preview ? (
              <div className="space-y-4 rounded-xl border p-4">
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">{preview.fileName}</Badge>
                  <span>{preview.totalRows} rows</span>
                  <span className="text-emerald-600">{preview.readyRows} ready</span>
                  <span className="text-rose-600">{preview.failedRows} failed</span>
                </div>
                <div className="overflow-x-auto rounded-lg border">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-900/50">
                      <tr className="border-b">
                        <th className="px-3 py-2">Row</th>
                        <th className="px-3 py-2">Product</th>
                        <th className="px-3 py-2">Vendor</th>
                        <th className="px-3 py-2">Category</th>
                        <th className="px-3 py-2">Price</th>
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2">Errors</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.previewRows.slice(0, 12).map((row) => (
                        <tr key={row.rowNumber} className="border-b last:border-b-0">
                          <td className="px-3 py-2">{row.rowNumber}</td>
                          <td className="px-3 py-2">{row.title || '—'}</td>
                          <td className="px-3 py-2">{row.vendorName}</td>
                          <td className="px-3 py-2">{row.categoryName}</td>
                          <td className="px-3 py-2">{row.price ?? '—'}</td>
                          <td className="px-3 py-2">
                            <Badge className={row.status === 'ready' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'}>
                              {row.status}
                            </Badge>
                          </td>
                          <td className="px-3 py-2 text-xs text-muted-foreground">{row.errors.join('; ') || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Import history</CardTitle>
            <CardDescription>Track recent import runs and download failure reports for correction.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {importHistory.map((item) => (
              <div key={item.id} className="rounded-xl border p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-semibold">{item.fileName}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(item.createdAt).toLocaleString()} • {item.totalProducts} rows • {item.sourceType.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={statusClassName(item.status)}>{item.status}</Badge>
                    <Badge variant="outline">{item.successCount} success</Badge>
                    <Badge variant="outline">{item.failedCount} failed</Badge>
                    <Button asChild variant="ghost" size="sm" disabled={item.failedCount === 0}>
                      <a href={`/api/admin/products/import/errors?importId=${item.id}`}>
                        <Download className="mr-2 h-4 w-4" />
                        Error report
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {!importHistory.length ? (
              <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                No imports have been run yet.
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      {summary.lowStockCount > 0 ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-950 dark:bg-amber-950/40 dark:text-amber-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{summary.lowStockCount} product(s) are at or below 5 units and may need replenishment.</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Field(props: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-2 text-sm font-medium">
      <span>{props.label}</span>
      <div>{props.children}</div>
    </label>
  );
}

function SummaryCard(props: { label: string; value: string; hint: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-sm text-muted-foreground">{props.label}</div>
        <div className="mt-2 text-3xl font-black tracking-tighter">{props.value}</div>
        <div className="mt-1 text-xs text-muted-foreground">{props.hint}</div>
      </CardContent>
    </Card>
  );
}

function FeedbackBanner(props: { feedback: FeedbackState }) {
  if (!props.feedback) return null;

  return (
    <div className={props.feedback.type === 'success' ? 'flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-200' : 'flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-950 dark:bg-rose-950/40 dark:text-rose-200'}>
      {props.feedback.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
      <span>{props.feedback.text}</span>
    </div>
  );
}

function toFeedback(result: AdminMutationResult): FeedbackState {
  return {
    type: result.ok ? 'success' : 'error',
    text: result.message,
  };
}

function splitPipeList(value: string) {
  return value
    .split('|')
    .map((item) => item.trim())
    .filter(Boolean);
}

function statusClassName(status: AdminImportHistoryItem['status']) {
  if (status === 'completed') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
  if (status === 'partial') return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
  if (status === 'failed') return 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300';
  return 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
}

function downloadCsv(filename: string, rows: Array<Record<string, string | number | null>>) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const body = rows
    .map((row) => headers.map((header) => escapeCsv(row[header])).join(','))
    .join('\n');
  const csv = `${headers.join(',')}\n${body}\n`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function escapeCsv(value: string | number | null) {
  const normalized = String(value ?? '');
  if (normalized.includes(',') || normalized.includes('"') || normalized.includes('\n')) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }
  return normalized;
}