'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Download, Eye, FileSpreadsheet, Loader2, PackagePlus, Pencil, Search, SlidersHorizontal, Store, Trash2, UploadCloud, Wand2 } from 'lucide-react';
import { bulkEditAdminProducts, createAdminProduct, deleteAdminProduct, duplicateAdminProduct, setAdminProductPublished, updateAdminProduct } from '@/app/actions/admin-products';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { AdminBulkEditAction, AdminImportHistoryItem, AdminMutationResult, AdminProductFormInput, AdminProductOption, AdminProductTableRow, AdminVendorOption, ProductCondition, ProductImportResponse } from '@/lib/admin-products/types';

const PAGE_SIZE = 10;

type ProductFormState = {
  id?: string;
  title: string;
  description: string;
  specifications: string;
  seoTitle: string;
  seoDescription: string;
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

const createInitial: ProductFormState = {
  title: '',
  description: '',
  specifications: '',
  seoTitle: '',
  seoDescription: '',
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
  isPublished: false,
};

const bulkInitial = {
  action: 'publish' as AdminBulkEditAction,
  price: '',
  salePrice: '',
  categoryId: '',
  vendorId: '',
  stockQuantity: '',
};

export function AdminProductsManager({
  products,
  categories,
  vendors,
  importHistory,
}: {
  products: AdminProductTableRow[];
  categories: AdminProductOption[];
  vendors: AdminVendorOption[];
  importHistory: AdminImportHistoryItem[];
}) {
  const router = useRouter();
  const [search, setSearch] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [vendorFilter, setVendorFilter] = React.useState('all');
  const [page, setPage] = React.useState(1);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [formState, setFormState] = React.useState<ProductFormState>(createInitial);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [createFeedback, setCreateFeedback] = React.useState<AdminMutationResult | null>(null);
  const [bulkFeedback, setBulkFeedback] = React.useState<AdminMutationResult | null>(null);
  const [rowFeedback, setRowFeedback] = React.useState<AdminMutationResult | null>(null);
  const [spreadsheet, setSpreadsheet] = React.useState<File | null>(null);
  const [imagesZip, setImagesZip] = React.useState<File | null>(null);
  const [importResponse, setImportResponse] = React.useState<ProductImportResponse | null>(null);
  const [importMessage, setImportMessage] = React.useState<string | null>(null);
  const [enhanceImportWithAi, setEnhanceImportWithAi] = React.useState(true);
  const [isGeneratingAi, setIsGeneratingAi] = React.useState(false);
  const [isImporting, setIsImporting] = React.useState(false);
  const [isSaving, startSave] = React.useTransition();
  const [isBulkPending, startBulk] = React.useTransition();
  const [isRowActionPending, startRowAction] = React.useTransition();
  const [bulkForm, setBulkForm] = React.useState(bulkInitial);

  const filtered = React.useMemo(() => products.filter((product) => {
    const query = search.trim().toLowerCase();
    return (
      (!query || product.title.toLowerCase().includes(query) || product.categoryName.toLowerCase().includes(query) || product.sku.toLowerCase().includes(query)) &&
      (categoryFilter === 'all' || product.categoryId === categoryFilter) &&
      (vendorFilter === 'all' || product.vendorId === vendorFilter) &&
      (statusFilter === 'all' || (statusFilter === 'published' && product.isPublished) || (statusFilter === 'draft' && !product.isPublished))
    );
  }), [products, search, categoryFilter, vendorFilter, statusFilter]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const allSelected = visible.length > 0 && visible.every((product) => selectedIds.includes(product.id));
  const summary = {
    published: products.filter((product) => product.isPublished).length,
    drafts: products.filter((product) => !product.isPublished).length,
    lowStock: products.filter((product) => product.stockQuantity <= 5).length,
  };
  const adminVendorLabel = 'Tooldocker';

  React.useEffect(() => {
    setPage((current) => Math.min(current, pages));
  }, [pages]);

  const setField = (key: keyof ProductFormState, value: string | boolean) => {
    setFormState((current) => ({ ...current, [key]: value }));
  };

  const setBulkField = (key: keyof typeof bulkInitial, value: string) => {
    setBulkForm((current) => ({ ...current, [key]: value }));
  };

  const resetEditor = React.useCallback(() => {
    setEditingId(null);
    setFormState(createInitial);
  }, []);

  const toggleAll = (checked: boolean) => {
    setSelectedIds((current) => checked ? [...new Set([...current, ...visible.map((product) => product.id)])] : current.filter((id) => !visible.some((product) => product.id === id)));
  };

  const toggleOne = (id: string, checked: boolean) => {
    setSelectedIds((current) => checked ? [...new Set([...current, id])] : current.filter((value) => value !== id));
  };

  const submitProduct = (event: React.FormEvent) => {
    event.preventDefault();
    setCreateFeedback(null);
    setRowFeedback(null);

    startSave(async () => {
      const payload = buildProductInput(formState);
      const result = editingId ? await updateAdminProduct(payload) : await createAdminProduct(payload);
      setCreateFeedback(result);
      if (result.ok) {
        resetEditor();
        router.refresh();
      }
    });
  };

  const runBulkAction = () => {
    setBulkFeedback(null);
    startBulk(async () => {
      const result = await bulkEditAdminProducts({
        productIds: selectedIds,
        action: bulkForm.action,
        price: bulkForm.price ? Number(bulkForm.price) : undefined,
        salePrice: bulkForm.salePrice ? Number(bulkForm.salePrice) : undefined,
        categoryId: bulkForm.categoryId || undefined,
        vendorId: bulkForm.vendorId || undefined,
        stockQuantity: bulkForm.stockQuantity ? Number.parseInt(bulkForm.stockQuantity, 10) : undefined,
      });
      setBulkFeedback(result);
      if (result.ok) {
        setSelectedIds([]);
        setBulkForm(bulkInitial);
        router.refresh();
      }
    });
  };

  const handleEdit = (product: AdminProductTableRow) => {
    setEditingId(product.id);
    setCreateFeedback(null);
    setFormState({
      id: product.id,
      title: product.title,
      description: product.description,
      specifications: specificationsToText(product.specifications),
      seoTitle: product.seoTitle,
      seoDescription: product.seoDescription,
      vendorId: product.vendorId ?? '',
      categoryId: product.categoryId ?? '',
      price: String(product.price),
      salePrice: product.salePrice == null ? '' : String(product.salePrice),
      sku: product.sku,
      stockQuantity: String(product.stockQuantity),
      condition: product.condition,
      brand: product.brand,
      weight: product.weight,
      length: product.length,
      width: product.width,
      height: product.height,
      images: product.images.join(' | '),
      tags: product.tags.join(' | '),
      isPublished: product.isPublished,
    });
  };

  const handleAiGenerate = async () => {
    if (!formState.title.trim()) {
      setCreateFeedback({ ok: false, message: 'Enter a title before using AI generation.' });
      return;
    }

    setIsGeneratingAi(true);
    setCreateFeedback(null);

    try {
      const response = await fetch('/api/ai/generate-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formState.title,
          category: categories.find((category) => category.id === formState.categoryId)?.label ?? '',
          description: formState.description,
          specs: textToSpecifications(formState.specifications),
        }),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.error ?? payload?.message ?? 'AI generation failed.');
      }

      setFormState((current) => ({
        ...current,
        title: payload?.title || current.title,
        description: payload?.description || current.description,
        specifications: payload?.specifications && typeof payload.specifications === 'object' ? specificationsToText(payload.specifications) : current.specifications,
        seoTitle: payload?.seo_title || current.seoTitle,
        seoDescription: payload?.seo_description || current.seoDescription,
        price: typeof payload?.price === 'number' && Number.isFinite(payload.price) ? String(payload.price) : current.price,
        condition: payload?.condition ?? current.condition,
        stockQuantity: typeof payload?.stock_quantity === 'number' && Number.isFinite(payload.stock_quantity) ? String(payload.stock_quantity) : current.stockQuantity,
        tags: Array.isArray(payload?.tags) && payload.tags.length ? payload.tags.join(' | ') : current.tags,
      }));

      setCreateFeedback({ ok: true, message: 'AI content generated. Review and edit before saving.' });
    } catch (error) {
      setCreateFeedback({ ok: false, message: error instanceof Error ? error.message : 'AI generation failed.' });
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const runRowAction = (action: () => Promise<AdminMutationResult>) => {
    setRowFeedback(null);
    startRowAction(async () => {
      const result = await action();
      setRowFeedback(result);
      if (result.ok) {
        if (editingId === result.productId) {
          resetEditor();
        }
        router.refresh();
      }
    });
  };

  const handleImport = async (mode: 'preview' | 'confirm') => {
    if (!spreadsheet) {
      setImportMessage('Select a CSV or Excel file first.');
      return;
    }

    setIsImporting(true);
    setImportMessage(null);

    try {
      const body = new FormData();
      body.set('mode', mode);
      body.set('spreadsheet', spreadsheet);
      body.set('enhanceWithAi', String(enhanceImportWithAi));
      if (imagesZip) {
        body.set('imagesZip', imagesZip);
      }

      const response = await fetch('/api/admin/products/import', { method: 'POST', body });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.message ?? 'Import request failed.');
      }

      setImportResponse(payload);
      setImportMessage(payload?.message ?? (mode === 'preview' ? 'Preview ready.' : 'Import completed.'));
      if (mode === 'confirm') {
        router.refresh();
      }
    } catch (error) {
      setImportMessage(error instanceof Error ? error.message : 'Import request failed.');
    } finally {
      setIsImporting(false);
    }
  };

  const downloadClientErrorReport = () => {
    if (!importResponse?.failedReportRows?.length) return;

    const rows = importResponse.failedReportRows;
    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(','),
      ...rows.map((row) => headers.map((header) => escapeCsvValue(row[header])).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'admin-product-import-errors.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Admin Product Management</h1>
          <p className="text-muted-foreground">Create, edit, publish, bulk import, and control products from the admin catalog.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <a href="/api/admin/products/template">
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </a>
          </Button>
          <Button variant="outline" onClick={() => handleImport('preview')} disabled={isImporting || !spreadsheet}>
            {isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
            Preview Import
          </Button>
          <Button onClick={() => handleImport('confirm')} disabled={isImporting || !spreadsheet || !importResponse}>
            {isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileSpreadsheet className="mr-2 h-4 w-4" />}
            Confirm Import
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Products" value={String(products.length)} hint="All active catalog items" />
        <StatCard label="Published" value={String(summary.published)} hint="Visible to buyers" />
        <StatCard label="Drafts" value={String(summary.drafts)} hint="Hidden from buyers" />
        <StatCard label="Low Stock" value={String(summary.lowStock)} hint="At or below 5 units" />
      </div>

      {rowFeedback ? <Feedback result={rowFeedback} /> : null}

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.35fr)_minmax(460px,0.95fr)]">
        <Card className="rounded-[2rem] border-stone-200 bg-white/90 shadow-sm">
          <CardHeader className="border-b border-stone-100">
            <CardTitle className="text-xl">Products Dashboard</CardTitle>
            <CardDescription>Search, filter, paginate, and manage the current product catalog.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[1.5rem] border border-stone-200 bg-[#fcfaf7] p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <SlidersHorizontal className="h-4 w-4" />
                Search and filters
              </div>
              <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_220px_220px_220px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title, category, or SKU" className="h-11 rounded-xl border-stone-200 bg-white pl-10" />
                </div>
                <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="h-11 rounded-xl border border-stone-200 bg-white px-3 text-sm">
                  <option value="all">All categories</option>
                  {categories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
                </select>
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-11 rounded-xl border border-stone-200 bg-white px-3 text-sm">
                  <option value="all">All statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
                <select value={vendorFilter} onChange={(event) => setVendorFilter(event.target.value)} className="h-11 rounded-xl border border-stone-200 bg-white px-3 text-sm">
                  <option value="all">All vendors</option>
                  {vendors.map((vendor) => <option key={vendor.vendorId} value={vendor.vendorId}>{formatVendorLabel(vendor.label)}</option>)}
                </select>
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.5rem] border border-stone-200 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1200px] text-left text-sm">
                  <thead className="bg-[#fcfaf7]">
                    <tr className="border-b">
                      <th className="px-4 py-3"><input type="checkbox" checked={allSelected} onChange={(event) => toggleAll(event.target.checked)} /></th>
                      <th className="px-4 py-3">Image</th>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Stock</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Created</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((product) => (
                      <tr key={product.id} className="border-b last:border-b-0 hover:bg-slate-50">
                        <td className="px-4 py-3"><input type="checkbox" checked={selectedIds.includes(product.id)} onChange={(event) => toggleOne(product.id, event.target.checked)} /></td>
                        <td className="px-4 py-3">
                          {product.images[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={product.images[0]} alt={product.title} className="h-14 w-14 rounded-xl border object-cover" />
                          ) : (
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl border bg-stone-100 text-xs text-muted-foreground">No image</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold">{product.title}</div>
                          <div className="text-xs text-muted-foreground">{formatVendorLabel(product.vendorName)} | SKU {product.sku || '-'}</div>
                        </td>
                        <td className="px-4 py-3">{product.categoryName}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium">Rs {product.price.toFixed(2)}</div>
                          {product.salePrice != null ? <div className="text-xs text-muted-foreground">Sale Rs {product.salePrice.toFixed(2)}</div> : null}
                        </td>
                        <td className="px-4 py-3">{product.stockQuantity}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <Badge className={product.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}>{product.isPublished ? 'Published' : 'Draft'}</Badge>
                            {product.isPreview ? <span className="text-xs text-amber-700">Preview mode</span> : null}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(product.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <Button type="button" size="sm" variant="outline" onClick={() => handleEdit(product)}><Pencil className="mr-2 h-4 w-4" />Edit</Button>
                            <Button type="button" size="sm" variant="outline" disabled={isRowActionPending} onClick={() => runRowAction(() => duplicateAdminProduct(product.id))}><Copy className="mr-2 h-4 w-4" />Duplicate</Button>
                            <Button type="button" size="sm" variant="outline" disabled={isRowActionPending} onClick={() => runRowAction(() => setAdminProductPublished(product.id, !product.isPublished))}><Eye className="mr-2 h-4 w-4" />{product.isPublished ? 'Unpublish' : 'Publish'}</Button>
                            <Button type="button" size="sm" variant="destructive" disabled={isRowActionPending} onClick={() => { if (window.confirm(`Delete "${product.title}"?`)) runRowAction(() => deleteAdminProduct(product.id)); }}><Trash2 className="mr-2 h-4 w-4" />Delete</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!visible.length ? <tr><td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">No products match the current filters.</td></tr> : null}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-muted-foreground">Showing {visible.length} of {filtered.length} filtered products.</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>Previous</Button>
                <span className="text-sm text-muted-foreground">Page {page} of {pages}</span>
                <Button variant="outline" size="sm" onClick={() => setPage((current) => Math.min(pages, current + 1))} disabled={page === pages}>Next</Button>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-stone-200 bg-[#fcfaf7] p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="grid flex-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <Field label="Bulk action">
                    <select value={bulkForm.action} onChange={(event) => setBulkField('action', event.target.value)} className="h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm">
                      <option value="publish">Publish</option>
                      <option value="unpublish">Unpublish</option>
                      <option value="update_price">Update price</option>
                      <option value="update_stock">Update stock</option>
                      <option value="change_category">Change category</option>
                      <option value="change_vendor">Change vendor</option>
                      <option value="delete">Delete</option>
                    </select>
                  </Field>
                  {bulkForm.action === 'update_price' ? <Field label="New price"><Input type="number" value={bulkForm.price} onChange={(event) => setBulkField('price', event.target.value)} /></Field> : null}
                  {bulkForm.action === 'update_price' ? <Field label="Sale price"><Input type="number" value={bulkForm.salePrice} onChange={(event) => setBulkField('salePrice', event.target.value)} /></Field> : null}
                  {bulkForm.action === 'update_stock' ? <Field label="Stock quantity"><Input type="number" value={bulkForm.stockQuantity} onChange={(event) => setBulkField('stockQuantity', event.target.value)} /></Field> : null}
                  {bulkForm.action === 'change_category' ? (
                    <Field label="Target category">
                      <select value={bulkForm.categoryId} onChange={(event) => setBulkField('categoryId', event.target.value)} className="h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm">
                        <option value="">Select category</option>
                        {categories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
                      </select>
                    </Field>
                  ) : null}
                  {bulkForm.action === 'change_vendor' ? (
                    <Field label="Target vendor">
                      <select value={bulkForm.vendorId} onChange={(event) => setBulkField('vendorId', event.target.value)} className="h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm">
                        <option value="">Select vendor</option>
                        {vendors.map((vendor) => <option key={vendor.vendorId} value={vendor.vendorId}>{formatVendorLabel(vendor.label)}</option>)}
                      </select>
                    </Field>
                  ) : null}
                </div>
                <Button type="button" onClick={runBulkAction} disabled={!selectedIds.length || isBulkPending} variant={bulkForm.action === 'delete' ? 'destructive' : 'default'}>
                  {isBulkPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                  Run Bulk Action
                </Button>
              </div>
              {bulkFeedback ? <div className="mt-4"><Feedback result={bulkFeedback} /></div> : null}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="sticky top-24 rounded-[2rem] border-stone-200 bg-white/95 shadow-sm">
            <CardHeader className="border-b border-stone-100">
              <CardTitle className="text-xl">{editingId ? 'Edit Product' : 'Add Product'}</CardTitle>
              <CardDescription>{editingId ? 'Update the selected product, then save changes.' : 'Create a new product and save as draft or publish immediately.'}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={submitProduct} className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" onClick={handleAiGenerate} disabled={isGeneratingAi || !formState.title.trim()}>
                    {isGeneratingAi ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                    Generate with AI
                  </Button>
                  {editingId ? <Button type="button" variant="outline" onClick={resetEditor}>Cancel Edit</Button> : null}
                </div>

                <div className="rounded-[1.25rem] border border-stone-200 bg-[#fcfaf7] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                      <Store className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Product owner</p>
                      <p className="text-sm font-semibold text-slate-900">{adminVendorLabel}</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Title"><Input value={formState.title} onChange={(event) => setField('title', event.target.value)} required className="h-11 rounded-xl border-stone-200" /></Field>
                  <Field label="SKU"><Input value={formState.sku} onChange={(event) => setField('sku', event.target.value)} required className="h-11 rounded-xl border-stone-200" /></Field>
                  <Field label="Category">
                    <select value={formState.categoryId} onChange={(event) => setField('categoryId', event.target.value)} className="h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm" required>
                      <option value="">Select category</option>
                      {categories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
                    </select>
                  </Field>
                  <Field label="Channel">
                    <div className="flex h-11 items-center rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm font-medium text-slate-700">
                      {adminVendorLabel}
                    </div>
                  </Field>
                  <Field label="Price"><Input type="number" min="0" step="0.01" value={formState.price} onChange={(event) => setField('price', event.target.value)} required className="h-11 rounded-xl border-stone-200" /></Field>
                  <Field label="Sale price"><Input type="number" min="0" step="0.01" value={formState.salePrice} onChange={(event) => setField('salePrice', event.target.value)} className="h-11 rounded-xl border-stone-200" /></Field>
                  <Field label="Stock"><Input type="number" min="0" step="1" value={formState.stockQuantity} onChange={(event) => setField('stockQuantity', event.target.value)} required className="h-11 rounded-xl border-stone-200" /></Field>
                  <Field label="Condition">
                    <select value={formState.condition} onChange={(event) => setField('condition', event.target.value)} className="h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm">
                      <option value="new">New</option>
                      <option value="used">Used</option>
                      <option value="refurbished">Refurbished</option>
                    </select>
                  </Field>
                  <Field label="Brand"><Input value={formState.brand} onChange={(event) => setField('brand', event.target.value)} className="h-11 rounded-xl border-stone-200" /></Field>
                  <Field label="Weight"><Input value={formState.weight} onChange={(event) => setField('weight', event.target.value)} className="h-11 rounded-xl border-stone-200" /></Field>
                  <Field label="Length"><Input value={formState.length} onChange={(event) => setField('length', event.target.value)} className="h-11 rounded-xl border-stone-200" /></Field>
                  <Field label="Width"><Input value={formState.width} onChange={(event) => setField('width', event.target.value)} className="h-11 rounded-xl border-stone-200" /></Field>
                  <Field label="Height"><Input value={formState.height} onChange={(event) => setField('height', event.target.value)} className="h-11 rounded-xl border-stone-200" /></Field>
                  <Field label="Visibility">
                    <label className="flex h-11 items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm">
                      <input type="checkbox" checked={formState.isPublished} onChange={(event) => setField('isPublished', event.target.checked)} />
                      Publish product
                    </label>
                  </Field>
                </div>

                <Field label="Description"><textarea value={formState.description} onChange={(event) => setField('description', event.target.value)} className="min-h-28 w-full rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm" /></Field>
                <Field label="Specifications"><textarea value={formState.specifications} onChange={(event) => setField('specifications', event.target.value)} placeholder={'Power: 1200W\nVoltage: 220V\nMaterial: Steel'} className="min-h-28 w-full rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm" /></Field>
                <Field label="SEO title"><Input value={formState.seoTitle} onChange={(event) => setField('seoTitle', event.target.value)} className="h-11 rounded-xl border-stone-200" /></Field>
                <Field label="SEO description"><textarea value={formState.seoDescription} onChange={(event) => setField('seoDescription', event.target.value)} className="min-h-24 w-full rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm" /></Field>
                <Field label="Images"><Input value={formState.images} onChange={(event) => setField('images', event.target.value)} placeholder="https://... | https://..." className="h-11 rounded-xl border-stone-200" /></Field>
                <Field label="Tags"><Input value={formState.tags} onChange={(event) => setField('tags', event.target.value)} placeholder="industrial | cutting | tools" className="h-11 rounded-xl border-stone-200" /></Field>

                {createFeedback ? <Feedback result={createFeedback} /> : null}

                <div className="flex flex-wrap gap-2">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PackagePlus className="mr-2 h-4 w-4" />}
                    {editingId ? 'Save Changes' : formState.isPublished ? 'Publish Product' : 'Save as Draft'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setField('isPublished', !formState.isPublished)}>
                    {formState.isPublished ? 'Switch to Draft' : 'Switch to Publish'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-stone-200">
            <CardHeader>
              <CardTitle className="text-xl">Bulk Upload</CardTitle>
              <CardDescription>Upload CSV or Excel files, preview the parsed rows, then confirm the import.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Spreadsheet"><Input type="file" accept=".csv,.xlsx,.xls" onChange={(event) => setSpreadsheet(event.target.files?.[0] ?? null)} /></Field>
                <Field label="Images ZIP"><Input type="file" accept=".zip" onChange={(event) => setImagesZip(event.target.files?.[0] ?? null)} /></Field>
              </div>
              <label className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm">
                <input type="checkbox" checked={enhanceImportWithAi} onChange={(event) => setEnhanceImportWithAi(event.target.checked)} />
                Fill missing descriptions, specifications, and SEO fields with AI during import.
              </label>
              <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">Required fields: title, category, price, and stock. Optional fields include description, images, specifications, SEO, and draft status.</div>
              {importMessage ? <div className="rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-700">{importMessage}</div> : null}
              {importResponse ? (
                <div className="space-y-4 rounded-[1.5rem] border border-stone-200 p-4">
                  <div className="grid gap-3 md:grid-cols-3">
                    <StatCard label="Rows" value={String(importResponse.totalRows)} hint={importResponse.fileName} />
                    <StatCard label="Ready" value={String(importResponse.readyRows)} hint="Valid rows" />
                    <StatCard label="Failed" value={String(importResponse.failedRows)} hint="Need correction" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" onClick={downloadClientErrorReport} disabled={!importResponse.failedReportRows.length}>
                      <Download className="mr-2 h-4 w-4" />
                      Download Error Report
                    </Button>
                  </div>
                  <div className="max-h-72 overflow-auto rounded-xl border">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-stone-50">
                        <tr>
                          <th className="px-3 py-2">Row</th>
                          <th className="px-3 py-2">Title</th>
                          <th className="px-3 py-2">Vendor</th>
                          <th className="px-3 py-2">Category</th>
                          <th className="px-3 py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importResponse.previewRows.slice(0, 25).map((row) => (
                          <tr key={`${row.rowNumber}-${row.sku}`} className="border-t">
                            <td className="px-3 py-2">{row.rowNumber}</td>
                            <td className="px-3 py-2"><div className="font-medium">{row.title || 'Untitled'}</div>{row.errors.length ? <div className="text-xs text-rose-700">{row.errors.join('; ')}</div> : null}</td>
                            <td className="px-3 py-2">{formatVendorLabel(row.vendorName)}</td>
                            <td className="px-3 py-2">{row.categoryName}</td>
                            <td className="px-3 py-2"><Badge className={row.status === 'ready' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}>{row.status}</Badge></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-stone-200">
            <CardHeader>
              <CardTitle className="text-xl">Import History</CardTitle>
              <CardDescription>Track previous uploads, totals, successes, failures, and import date.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {importHistory.length ? importHistory.map((item) => (
                <div key={item.id} className="rounded-xl border p-4">
                  <div className="font-semibold">{item.fileName}</div>
                  <div className="text-sm text-muted-foreground">{new Date(item.createdAt).toLocaleString()} • {item.totalProducts} rows • {item.successCount} success • {item.failedCount} failed</div>
                  <div className="mt-2">
                    <Badge className={item.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : item.status === 'partial' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-700'}>{item.status}</Badge>
                  </div>
                </div>
              )) : <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">No imports have been run yet.</div>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function buildProductInput(formState: ProductFormState): AdminProductFormInput {
  return {
    id: formState.id,
    title: formState.title,
    description: formState.description,
    specifications: textToSpecifications(formState.specifications),
    seoTitle: formState.seoTitle,
    seoDescription: formState.seoDescription,
    vendorId: formState.vendorId || undefined,
    categoryId: formState.categoryId,
    price: Number(formState.price),
    salePrice: formState.salePrice ? Number(formState.salePrice) : null,
    sku: formState.sku,
    stockQuantity: Number.parseInt(formState.stockQuantity || '0', 10),
    condition: formState.condition,
    brand: formState.brand,
    weight: formState.weight,
    length: formState.length,
    width: formState.width,
    height: formState.height,
    images: splitPipeList(formState.images),
    tags: splitPipeList(formState.tags),
    isPublished: formState.isPublished,
  };
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="space-y-2 text-sm font-medium"><span>{label}</span><div>{children}</div></label>;
}

function formatVendorLabel(label: string) {
  return label === 'Tooldocker Admin' ? 'Tooldocker' : label;
}

function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return <Card className="rounded-[1.5rem] border-stone-200"><CardContent className="p-6"><div className="text-sm text-muted-foreground">{label}</div><div className="mt-2 text-3xl font-black tracking-tighter">{value}</div><div className="mt-1 text-xs text-muted-foreground">{hint}</div></CardContent></Card>;
}

function Feedback({ result }: { result: AdminMutationResult | null }) {
  if (!result) return null;
  return <div className={result.ok ? 'rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800' : 'rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800'}>{result.message}</div>;
}

function splitPipeList(value: string) {
  return value.split('|').map((item) => item.trim()).filter(Boolean);
}

function textToSpecifications(value: string) {
  return Object.fromEntries(value.split('\n').map((line) => line.trim()).filter(Boolean).map((line) => {
    const [key, ...rest] = line.split(':');
    return [key?.trim() ?? '', rest.join(':').trim()];
  }).filter(([key, specValue]) => key && specValue));
}

function specificationsToText(specifications: Record<string, string>) {
  return Object.entries(specifications).map(([key, value]) => `${key}: ${value}`).join('\n');
}

function escapeCsvValue(value: string | number | null) {
  const stringValue = String(value ?? '');
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) return `"${stringValue.replace(/"/g, '""')}"`;
  return stringValue;
}
