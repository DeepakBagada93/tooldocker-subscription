import { CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SUBSCRIPTION_PLANS } from '@/lib/subscription-plans'
import { getVendorSubscriptionStatus } from '@/lib/subscriptions'

export default async function VendorSubscriptionPage() {
  const subscription = await getVendorSubscriptionStatus()

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Subscription Plan</h1>
          <p className="text-muted-foreground">Vendors need an active monthly or yearly subscription to create products and manage catalog imports.</p>
        </div>
        <Button variant="outline">Open Stripe Billing Portal</Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <h2 className="border-b pb-4 text-xl font-black tracking-tighter uppercase">Available Plans</h2>
          <div className="mt-6 grid gap-4 xl:grid-cols-3">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const isCurrentPlan = subscription.plan?.id === plan.id
              return (
                <div key={plan.id} className={`rounded-3xl border p-5 ${isCurrentPlan ? 'border-primary bg-primary/5' : 'bg-stone-50/70'}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-lg font-black text-slate-900">{plan.name}</div>
                      <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{plan.interval}</div>
                    </div>
                    {isCurrentPlan ? <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Current</Badge> : null}
                  </div>
                  <div className="mt-4 text-3xl font-black tracking-tight text-slate-900">${plan.price}</div>
                  <p className="mt-2 text-sm text-stone-600">{plan.description}</p>
                  <div className="mt-4 text-sm font-semibold text-slate-900">{plan.productLimit} product slots</div>
                  <div className="mt-4 space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature.label} className="flex items-start gap-2 text-sm text-stone-600">
                        <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${feature.included ? 'text-emerald-500' : 'text-stone-300'}`} />
                        <span>{feature.label}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant={isCurrentPlan ? 'outline' : 'industrial'} className="mt-5 w-full">
                    {isCurrentPlan ? 'Current Plan' : 'Switch Plan'}
                  </Button>
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border bg-white p-8 shadow-sm">
            <h2 className="border-b pb-4 text-xl font-black tracking-tighter uppercase">Current Access</h2>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border bg-stone-50 p-4">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</div>
                <div className="mt-2 flex items-center gap-2">
                  <Badge className={subscription.hasActiveSubscription ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-red-100 text-red-700 hover:bg-red-100'}>
                    {subscription.status}
                  </Badge>
                </div>
              </div>
              <div className="rounded-2xl border bg-stone-50 p-4">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Products used</div>
                <div className="mt-2 text-2xl font-black text-slate-900">{subscription.productCount}/{subscription.productLimit}</div>
                <div className="mt-1 text-sm text-stone-600">{subscription.remainingProductSlots} slots remaining</div>
              </div>
              <div className="rounded-2xl border bg-stone-50 p-4">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Next renewal</div>
                <div className="mt-2 text-lg font-black text-slate-900">
                  {subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : 'Not scheduled'}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6">
            <div className="flex items-center gap-2 font-bold uppercase tracking-tighter text-primary">
              <ShieldCheck className="h-5 w-5" />
              Platform Rule
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              If the subscription becomes inactive or past due, product creation and bulk imports should stop until billing is restored.
            </p>
          </div>

          <div className="rounded-3xl border bg-slate-900 p-6 text-white shadow-sm">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/60">
              <Sparkles className="h-4 w-4" />
              Stripe integration note
            </div>
            <p className="mt-3 text-sm text-white/75">
              Connect this page to Stripe Checkout or the Billing Portal so plan upgrades, renewals, and failed-payment recovery stay self-serve.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
