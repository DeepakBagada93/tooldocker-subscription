import Link from 'next/link'
import { ArrowLeft, Upload } from 'lucide-react'

import { getCategories } from '@/app/actions/products'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getVendorSubscriptionStatus } from '@/lib/subscriptions'

import { ProductForm } from '@/components/vendor/product-form'

export default async function NewProductPage() {
  const [subscription, categories] = await Promise.all([
    getVendorSubscriptionStatus(),
    getCategories(),
  ])
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
          <p className="text-muted-foreground">Approved vendor accounts can add products directly to the storefront.</p>
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

      <ProductForm
        isLocked={isLocked}
        categories={categories.map((category) => ({ id: category.id, name: category.name }))}
      />

      <div className="rounded-3xl border border-dashed bg-white p-8 text-center text-sm text-stone-600 shadow-sm">
        <Upload className="mx-auto h-8 w-8 text-primary" />
        <p className="mt-4 font-semibold text-slate-900">Approved vendors can publish products directly.</p>
        <p className="mt-2">Your product appears on the website as soon as your account and plan are active.</p>
      </div>
    </div>
  )
}
