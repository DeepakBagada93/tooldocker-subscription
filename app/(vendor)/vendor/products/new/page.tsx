import Link from 'next/link'
import { ArrowLeft, Info, Layers, Upload } from 'lucide-react'

import { createVendorProduct } from '@/app/actions/vendor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { getVendorSubscriptionStatus } from '@/lib/subscriptions'

const categories = ['Heavy Machinery', 'Power Tools', 'Welding', 'Safety Gear']

export default async function NewProductPage() {
  const subscription = await getVendorSubscriptionStatus()
  const isLocked = !subscription.canCreateProduct

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/vendor/products">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Add New Product</h1>
          <p className="text-muted-foreground">An active subscription is required before new catalog items can be submitted.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-stone-200/80 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className={subscription.hasActiveSubscription ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-red-100 text-red-700 hover:bg-red-100'}>
                {subscription.hasActiveSubscription ? `${subscription.plan?.name} plan active` : 'Subscription required'}
              </Badge>
              {subscription.billingInterval ? (
                <Badge variant="outline" className="uppercase">
                  {subscription.billingInterval}
                </Badge>
              ) : null}
            </div>
            <p className="text-sm text-stone-600">
              {subscription.hasActiveSubscription
                ? `You are using ${subscription.productCount} of ${subscription.productLimit} product slots.`
                : 'Choose a monthly or yearly plan before you create products.'}
            </p>
          </div>
          <div className="rounded-2xl bg-stone-50 px-4 py-3 text-sm text-stone-700">
            Remaining slots: <span className="font-black text-slate-900">{subscription.remainingProductSlots}</span>
          </div>
        </div>
      </div>

      <form action={createVendorProduct} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="rounded-3xl border bg-white p-8 shadow-sm">
            <h2 className="border-b pb-4 text-xl font-black tracking-tighter uppercase">Basic Information</h2>
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Product Name</label>
                <Input name="title" placeholder="e.g. Industrial Hydraulic Press" className="h-12" required disabled={isLocked} />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</label>
                  <select
                    name="category_id"
                    className="h-12 w-full rounded-xl border bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isLocked}
                    defaultValue=""
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category.toLowerCase().replace(/\s+/g, '-')}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Image URL</label>
                  <Input name="image_url" placeholder="https://example.com/product-image.jpg" className="h-12" disabled={isLocked} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</label>
                <textarea
                  name="description"
                  className="h-40 w-full rounded-xl border bg-white p-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  placeholder="Describe technical specifications, certifications, and delivery notes."
                  disabled={isLocked}
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-8 shadow-sm">
            <h2 className="border-b pb-4 text-xl font-black tracking-tighter uppercase">Pricing & Inventory</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Base Price ($)</label>
                <Input name="price" type="number" min="0" step="0.01" placeholder="0.00" className="h-12" required disabled={isLocked} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Stock Quantity</label>
                <div className="relative">
                  <Layers className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input name="inventory" type="number" min="0" placeholder="0" className="h-12 pl-10" required disabled={isLocked} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="sticky top-8 rounded-3xl border bg-white p-8 shadow-sm">
            <h2 className="border-b pb-4 text-xl font-black tracking-tighter uppercase">Publish</h2>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border bg-slate-50 p-4">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Submission rule</div>
                <div className="mt-2 text-sm font-medium text-slate-700">Products stay unpublished until admin moderation is complete.</div>
              </div>
              <div className="rounded-2xl border bg-slate-50 p-4">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Bulk upload access</div>
                <div className="mt-2 text-sm font-medium text-slate-700">
                  {subscription.canUseBulkUpload ? 'Included in your current subscription.' : 'Upgrade to unlock CSV and Excel catalog imports.'}
                </div>
              </div>
            </div>
            <div className="pt-6 space-y-3">
              <Button type="submit" variant="industrial" className="h-14 w-full text-lg font-bold uppercase tracking-tighter" disabled={isLocked}>
                {isLocked ? 'Subscription Required' : 'Submit Product'}
              </Button>
              <Button variant="outline" className="h-12 w-full font-bold uppercase tracking-widest" asChild>
                <Link href="/vendor/commission">{subscription.hasActiveSubscription ? 'Manage Subscription' : 'Choose a Plan'}</Link>
              </Button>
            </div>
            <div className="mt-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <Info className="h-5 w-5 shrink-0 text-amber-500" />
              <p className="text-[11px] font-medium text-amber-700">
                Vendors must keep an active subscription through billing renewal to continue creating and importing products.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-dashed bg-white p-8 text-center text-sm text-stone-600 shadow-sm">
            <Upload className="mx-auto h-8 w-8 text-primary" />
            <p className="mt-4 font-semibold text-slate-900">Media uploads can be attached after plan validation.</p>
            <p className="mt-2">This page is already enforcing the subscription gate before product creation.</p>
          </div>
        </div>
      </form>
    </div>
  )
}
