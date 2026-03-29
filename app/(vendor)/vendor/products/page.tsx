import Link from 'next/link'
import { AlertCircle, Eye, Filter, Package, Plus, Search, Trash2, Edit2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getVendorSubscriptionStatus } from '@/lib/subscriptions'
import { getVendorProducts } from '@/app/actions/vendor'
import { cn } from '@/lib/utils'

export default async function VendorProductsPage() {
  const [subscription, products] = await Promise.all([
    getVendorSubscriptionStatus(),
    getVendorProducts()
  ])

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">My Products</h1>
          <p className="text-muted-foreground">Manage your catalog within the limits of your active vendor subscription.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/vendor/bulk-upload">{subscription.canUseBulkUpload ? 'Bulk Upload' : 'Bulk Upload Locked'}</Link>
          </Button>
          {subscription.canCreateProduct ? (
            <Button variant="industrial" asChild>
              <Link href="/vendor/products/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Link>
            </Button>
          ) : (
            <Button variant="industrial" asChild>
              <Link href="/vendor/commission">
                <Plus className="mr-2 h-4 w-4" />
                Upgrade Plan
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-stone-200/80 bg-white/90 p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-stone-50 p-4">
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Current plan</div>
            <div className="mt-2 text-xl font-black text-slate-900">{subscription.plan?.name ?? 'No active plan'}</div>
            <div className="mt-1 text-sm text-stone-600">{subscription.billingInterval ?? 'billing inactive'}</div>
          </div>
          <div className="rounded-2xl border bg-stone-50 p-4">
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Product usage</div>
            <div className="mt-2 text-xl font-black text-slate-900">{subscription.productCount}/{subscription.productLimit}</div>
            <div className="mt-1 text-sm text-stone-600">{subscription.remainingProductSlots} slots remaining</div>
          </div>
          <div className="rounded-2xl border bg-stone-50 p-4">
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Catalog access</div>
            <div className="mt-2">
              <Badge className={subscription.hasActiveSubscription ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-red-100 text-red-700 hover:bg-red-100'}>
                {subscription.hasActiveSubscription ? 'Active subscription' : 'Subscription required'}
              </Badge>
            </div>
            <div className="mt-2 text-sm text-stone-600">All new products require an active plan and admin moderation.</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            className="h-10 w-full rounded-lg border bg-white pl-10 outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10">
            <Filter className="mr-2 h-4 w-4" />
            Category
          </Button>
          <Button variant="outline" className="h-10">
            Status
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Product</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Price</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Stock</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 overflow-hidden">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                          ) : (
                            <Package className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-bold">{product.name}</div>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">ID: {product.id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider">
                        {product.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-black tracking-tighter">${product.price.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={cn('text-sm font-bold', product.stock === 0 ? 'text-red-500' : 'text-foreground')}>
                          {product.stock}
                        </span>
                        {product.stock < 10 && product.stock > 0 ? <AlertCircle className="h-3 w-3 text-amber-500" /> : null}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={cn(
                        'px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                        product.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-stone-100 text-stone-700'
                      )}>
                        {product.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon"><Edit2 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="h-8 w-8 opacity-20" />
                      <p>No products found in your catalog.</p>
                      <Button variant="link" className="text-primary font-bold uppercase text-xs" asChild>
                        <Link href="/vendor/products/new">Add your first product &rarr;</Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
