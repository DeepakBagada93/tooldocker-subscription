'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Download, Loader2, PackagePlus, Search, UploadCloud, Wand2 } from 'lucide-react';
import { bulkEditAdminProducts, createAdminProduct } from '@/app/actions/admin-products';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { AdminBulkEditAction, AdminImportHistoryItem, AdminMutationResult, AdminProductOption, AdminProductTableRow, AdminVendorOption, ProductCondition } from '@/lib/admin-products/types';

const PAGE_SIZE = 10;
const createInitial = { title: '', description: '', categoryId: '', price: '', salePrice: '', sku: '', stockQuantity: '0', condition: 'new' as ProductCondition, brand: '', weight: '', length: '', width: '', height: '', images: '', tags: '', isPublished: true };
const bulkInitial = { action: 'publish' as AdminBulkEditAction, price: '', salePrice: '', categoryId: '', vendorId: '', stockQuantity: '' };

export function AdminProductsManager({ products, categories, vendors, importHistory }: { products: AdminProductTableRow[]; categories: AdminProductOption[]; vendors: AdminVendorOption[]; importHistory: AdminImportHistoryItem[] }) {
  const router = useRouter();
  const [search, setSearch] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('all');
  const [vendorFilter, setVendorFilter] = React.useState('all');
  const [page, setPage] = React.useState(1);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [createForm, setCreateForm] = React.useState(createInitial);
  const [bulkForm, setBulkForm] = React.useState(bulkInitial);
  const [createFeedback, setCreateFeedback] = React.useState<AdminMutationResult | null>(null);
  const [bulkFeedback, setBulkFeedback] = React.useState<AdminMutationResult | null>(null);
  const [sheet, setSheet] = React.useState<File | null>(null);
  const [createPending, startCreate] = React.useTransition();
  const [bulkPending, startBulk] = React.useTransition();

  const filtered = React.useMemo(() => products.filter((p) => {
    const q = search.trim().toLowerCase();
    return (!q || p.title.toLowerCase().includes(q) || p.vendorName.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)) &&
      (categoryFilter === 'all' || p.categoryId === categoryFilter) &&
      (vendorFilter === 'all' || p.vendorId === vendorFilter);
  }), [products, search, categoryFilter, vendorFilter]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const summary = { published: products.filter((p) => p.isPublished).length, low: products.filter((p) => p.stockQuantity <= 5).length, failed: importHistory.reduce((s, i) => s + i.failedCount, 0) };

  React.useEffect(() => setPage((p) => Math.min(p, pages)), [pages]);

  const setCreate = (k: keyof typeof createInitial, v: string | boolean) => setCreateForm((c) => ({ ...c, [k]: v }));
  const setBulk = (k: keyof typeof bulkInitial, v: string) => setBulkForm((c) => ({ ...c, [k]: v }));
  const allSelected = visible.length > 0 && visible.every((p) => selectedIds.includes(p.id));
  const toggleAll = (checked: boolean) => setSelectedIds((c) => checked ? [...new Set([...c, ...visible.map((p) => p.id)])] : c.filter((id) => !visible.some((p) => p.id === id)));
  const toggleOne = (id: string, checked: boolean) => setSelectedIds((c) => checked ? [...new Set([...c, id])] : c.filter((x) => x !== id));

  const submitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateFeedback(null);
    startCreate(async () => {
      const result = await createAdminProduct({ title: createForm.title, description: createForm.description, categoryId: createForm.categoryId, price: Number(createForm.price), salePrice: createForm.salePrice ? Number(createForm.salePrice) : null, sku: createForm.sku, stockQuantity: Number.parseInt(createForm.stockQuantity || '0', 10), condition: createForm.condition, brand: createForm.brand, weight: createForm.weight, length: createForm.length, width: createForm.width, height: createForm.height, images: split(createForm.images), tags: split(createForm.tags), isPublished: createForm.isPublished });
      setCreateFeedback(result);
      if (result.ok) { setCreateForm(createInitial); router.refresh(); }
    });
  };

  const submitBulk = () => {
    setBulkFeedback(null);
    startBulk(async () => {
      const result = await bulkEditAdminProducts({ productIds: selectedIds, action: bulkForm.action, price: bulkForm.price ? Number(bulkForm.price) : undefined, salePrice: bulkForm.salePrice ? Number(bulkForm.salePrice) : undefined, categoryId: bulkForm.categoryId || undefined, vendorId: bulkForm.vendorId || undefined, stockQuantity: bulkForm.stockQuantity ? Number.parseInt(bulkForm.stockQuantity, 10) : undefined });
      setBulkFeedback(result);
      if (result.ok) { setSelectedIds([]); setBulkForm(bulkInitial); router.refresh(); }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Admin Product Management</h1>
          <p className="text-muted-foreground">Admin can publish products directly under the Tooldocker Admin storefront.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline"><a href="/api/admin/products/template"><Download className="mr-2 h-4 w-4" />Download template</a></Button>
          <Button disabled={!sheet}><UploadCloud className="mr-2 h-4 w-4" />Preview import</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total products" value={String(products.length)} hint="Current catalog size" />
        <StatCard label="Published" value={String(summary.published)} hint="Visible on the marketplace" />
        <StatCard label="Import failures" value={String(summary.failed)} hint="Rows that need correction" />
      </div>

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.45fr)_minmax(420px,0.95fr)]">
        <Card className="min-w-0 rounded-[2rem] border-stone-200">
          <CardHeader><CardTitle className="text-xl">Catalog table</CardTitle><CardDescription>Search, filter and review products.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_220px_220px]">
              <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title, vendor, or SKU" className="pl-10" /></div>
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm"><option value="all">All categories</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select>
              <select value={vendorFilter} onChange={(e) => setVendorFilter(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm"><option value="all">All vendors</option>{vendors.map((v) => <option key={v.vendorId} value={v.vendorId}>{v.label}</option>)}</select>
            </div>
            <div className="overflow-hidden rounded-[1.5rem] border border-stone-200 bg-white"><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-[#fcfaf7]"><tr className="border-b"><th className="px-4 py-3"><input type="checkbox" checked={allSelected} onChange={(e) => toggleAll(e.target.checked)} /></th><th className="px-4 py-3">PRODUCT</th><th className="px-4 py-3">VENDOR</th><th className="px-4 py-3">CATEGORY</th><th className="px-4 py-3">PRICE</th><th className="px-4 py-3">STOCK</th><th className="px-4 py-3">STATUS</th></tr></thead><tbody>{visible.map((p) => <tr key={p.id} className="border-b last:border-b-0 hover:bg-slate-50"><td className="px-4 py-3"><input type="checkbox" checked={selectedIds.includes(p.id)} onChange={(e) => toggleOne(p.id, e.target.checked)} /></td><td className="px-4 py-3"><div className="font-semibold">{p.title}</div><div className="text-xs text-muted-foreground">SKU: {p.sku || '-'}</div></td><td className="px-4 py-3">{p.vendorName}</td><td className="px-4 py-3">{p.categoryName}</td><td className="px-4 py-3"><div className="font-medium">Rs {p.price.toFixed(2)}</div>{p.salePrice != null ? <div className="text-xs text-muted-foreground">Sale Rs {p.salePrice.toFixed(2)}</div> : null}</td><td className="px-4 py-3">{p.stockQuantity}</td><td className="px-4 py-3"><Badge className={p.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}>{p.isPublished ? 'Published' : 'Draft'}</Badge></td></tr>)}{!visible.length ? <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No products match the current filters.</td></tr> : null}</tbody></table></div></div>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><p className="text-sm text-muted-foreground">Showing {visible.length} of {filtered.length} filtered products.</p><div className="flex items-center gap-2"><Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button><span className="text-sm text-muted-foreground">Page {page} of {pages}</span><Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}>Next</Button></div></div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[2rem] border-stone-200">
            <CardHeader><CardTitle className="text-xl">Add single product</CardTitle><CardDescription>Create a product directly as Tooldocker Admin.</CardDescription></CardHeader>
            <CardContent>
              <form onSubmit={submitCreate} className="space-y-4">
                <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] px-4 py-3 text-sm text-stone-600">Seller: <span className="font-semibold text-slate-900">Tooldocker Admin</span></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Product title"><Input value={createForm.title} onChange={(e) => setCreate('title', e.target.value)} required /></Field>
                  <Field label="SKU"><Input value={createForm.sku} onChange={(e) => setCreate('sku', e.target.value)} required /></Field>
                  <Field label="Category"><select value={createForm.categoryId} onChange={(e) => setCreate('categoryId', e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" required><option value="">Select category</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select></Field>
                  <Field label="Condition"><select value={createForm.condition} onChange={(e) => setCreate('condition', e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="new">New</option><option value="used">Used</option><option value="refurbished">Refurbished</option></select></Field>
                  <Field label="Price"><Input type="number" min="0" step="0.01" value={createForm.price} onChange={(e) => setCreate('price', e.target.value)} required /></Field>
                  <Field label="Sale price"><Input type="number" min="0" step="0.01" value={createForm.salePrice} onChange={(e) => setCreate('salePrice', e.target.value)} /></Field>
                  <Field label="Stock quantity"><Input type="number" min="0" step="1" value={createForm.stockQuantity} onChange={(e) => setCreate('stockQuantity', e.target.value)} required /></Field>
                  <Field label="Brand"><Input value={createForm.brand} onChange={(e) => setCreate('brand', e.target.value)} /></Field>
                  <Field label="Weight"><Input value={createForm.weight} onChange={(e) => setCreate('weight', e.target.value)} placeholder="e.g. 2.4kg" /></Field>
                  <Field label="Length"><Input value={createForm.length} onChange={(e) => setCreate('length', e.target.value)} /></Field>
                  <Field label="Width"><Input value={createForm.width} onChange={(e) => setCreate('width', e.target.value)} /></Field>
                  <Field label="Height"><Input value={createForm.height} onChange={(e) => setCreate('height', e.target.value)} /></Field>
                  <Field label="Publish now"><label className="flex h-10 items-center gap-3 rounded-md border border-input px-3 text-sm"><input type="checkbox" checked={createForm.isPublished} onChange={(e) => setCreate('isPublished', e.target.checked)} />Publish immediately</label></Field>
                </div>
                <Field label="Description"><textarea value={createForm.description} onChange={(e) => setCreate('description', e.target.value)} className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></Field>
                <Field label="Images (pipe-separated URLs)"><Input value={createForm.images} onChange={(e) => setCreate('images', e.target.value)} placeholder="https://...|https://..." /></Field>
                <Field label="Tags (pipe-separated)"><Input value={createForm.tags} onChange={(e) => setCreate('tags', e.target.value)} placeholder="power-tools|cutting|industrial" /></Field>
                <Feedback result={createFeedback} />
                <Button type="submit" disabled={createPending} className="w-full sm:w-auto">{createPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PackagePlus className="mr-2 h-4 w-4" />}Create product</Button>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-stone-200">
            <CardHeader><CardTitle className="text-xl">Bulk edit selected products</CardTitle><CardDescription>{selectedIds.length} product(s) selected.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <Field label="Bulk action"><select value={bulkForm.action} onChange={(e) => setBulk('action', e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="publish">Publish</option><option value="unpublish">Unpublish</option><option value="update_price">Update price</option><option value="update_stock">Update stock</option><option value="change_category">Change category</option><option value="change_vendor">Change vendor</option><option value="delete">Delete</option></select></Field>
              {bulkForm.action === 'update_price' ? <div className="grid gap-4 sm:grid-cols-2"><Field label="New price"><Input type="number" value={bulkForm.price} onChange={(e) => setBulk('price', e.target.value)} /></Field><Field label="New sale price"><Input type="number" value={bulkForm.salePrice} onChange={(e) => setBulk('salePrice', e.target.value)} /></Field></div> : null}
              {bulkForm.action === 'update_stock' ? <Field label="Stock quantity"><Input type="number" value={bulkForm.stockQuantity} onChange={(e) => setBulk('stockQuantity', e.target.value)} /></Field> : null}
              {bulkForm.action === 'change_category' ? <Field label="Target category"><select value={bulkForm.categoryId} onChange={(e) => setBulk('categoryId', e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="">Select category</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select></Field> : null}
              {bulkForm.action === 'change_vendor' ? <Field label="Target vendor"><select value={bulkForm.vendorId} onChange={(e) => setBulk('vendorId', e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="">Select vendor</option>{vendors.map((v) => <option key={v.vendorId} value={v.vendorId}>{v.label}</option>)}</select></Field> : null}
              <Feedback result={bulkFeedback} />
              <Button onClick={submitBulk} disabled={!selectedIds.length || bulkPending} variant={bulkForm.action === 'delete' ? 'destructive' : 'default'} className="w-full sm:w-auto">{bulkPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}Run bulk action</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)]">
        <Card className="rounded-[2rem] border-stone-200">
          <CardHeader><CardTitle className="text-xl">Bulk upload</CardTitle><CardDescription>Upload spreadsheet files for import.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Spreadsheet file"><Input key={`sheet-${String(sheet)}`} type="file" accept=".csv,.xlsx,.xls" onChange={(e) => setSheet(e.target.files?.[0] ?? null)} /></Field>
              <Field label="Images ZIP (optional)"><Input type="file" accept=".zip" /></Field>
            </div>
            <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">Accepted formats: CSV, XLSX, XLS. Maximum 1000 products per upload.</div>
          </CardContent>
        </Card>
        <Card className="rounded-[2rem] border-stone-200">
          <CardHeader><CardTitle className="text-xl">Import history</CardTitle><CardDescription>Recent import runs.</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            {importHistory.length ? importHistory.map((item) => <div key={item.id} className="rounded-xl border p-4"><div className="font-semibold">{item.fileName}</div><div className="text-sm text-muted-foreground">{new Date(item.createdAt).toLocaleString()} - {item.totalProducts} rows - {item.sourceType.toUpperCase()}</div></div>) : <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">No imports have been run yet.</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="space-y-2 text-sm font-medium"><span>{label}</span><div>{children}</div></label>;
}

function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return <Card className="rounded-[1.5rem] border-stone-200"><CardContent className="p-6"><div className="text-sm text-muted-foreground">{label}</div><div className="mt-2 text-3xl font-black tracking-tighter">{value}</div><div className="mt-1 text-xs text-muted-foreground">{hint}</div></CardContent></Card>;
}

function Feedback({ result }: { result: AdminMutationResult | null }) {
  if (!result) return null;
  return <div className={result.ok ? 'rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800' : 'rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800'}>{result.message}</div>;
}

function split(value: string) {
  return value.split('|').map((item) => item.trim()).filter(Boolean);
}
