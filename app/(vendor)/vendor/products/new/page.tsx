import Link from 'next/link'
import { ArrowLeft, Info, Layers, Upload } from 'lucide-react'

import { createVendorProduct } from '@/app/actions/vendor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { getVendorSubscriptionStatus } from '@/lib/subscriptions'

import { ProductForm } from '@/components/vendor/product-form'

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

      <ProductForm isLocked={isLocked} />

      <div className="rounded-3xl border border-dashed bg-white p-8 text-center text-sm text-stone-600 shadow-sm">
        <Upload className="mx-auto h-8 w-8 text-primary" />
        <p className="mt-4 font-semibold text-slate-900">Media uploads can be attached after plan validation.</p>
        <p className="mt-2">This page is already enforcing the subscription gate before product creation.</p>
      </div>
    </div>
  )
}
