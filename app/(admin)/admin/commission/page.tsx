import { CheckCircle2, CreditCard, Plus, TrendingUp } from 'lucide-react'

import { ACTIVE_SUBSCRIPTIONS, SUBSCRIPTION_PLAN_SUMMARIES } from '@/lib/admin-mock-data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function SubscriptionConfigPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Subscription Plans</h1>
          <p className="text-muted-foreground">Create and manage the plans vendors must purchase before they can add products or use bulk catalog tools.</p>
        </div>
        <Button variant="industrial">
          <Plus className="mr-2 h-4 w-4" />
          Add New Plan
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
        <div className="space-y-6">
          <div className="rounded-3xl border bg-white p-8 shadow-sm">
            <h2 className="border-b pb-4 text-xl font-black tracking-tighter uppercase">Active Plans</h2>
            <div className="mt-6 space-y-4">
              {SUBSCRIPTION_PLAN_SUMMARIES.map((plan) => (
                <div key={plan.id} className="rounded-2xl border bg-slate-50/80 p-6">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-bold text-slate-900">{plan.name}</div>
                        <Badge variant="outline" className="uppercase">{plan.interval}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{plan.description}</div>
                      <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider text-stone-500">
                        <span>{plan.productLimit} products</span>
                        <span>{plan.bulkUploadEnabled ? 'Bulk upload included' : 'No bulk upload'}</span>
                        <span>{plan.analyticsEnabled ? 'Analytics included' : 'Basic analytics'}</span>
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-xl border bg-white px-4 py-3">
                        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Price</div>
                        <div className="mt-1 text-xl font-black text-slate-900">${plan.price}</div>
                      </div>
                      <div className="rounded-xl border bg-white px-4 py-3">
                        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Vendors</div>
                        <div className="mt-1 text-xl font-black text-slate-900">{plan.activeVendors}</div>
                      </div>
                      <div className="rounded-xl border bg-white px-4 py-3">
                        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">MRR</div>
                        <div className="mt-1 text-xl font-black text-slate-900">${plan.monthlyRevenue.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-8 shadow-sm">
            <h2 className="border-b pb-4 text-xl font-black tracking-tighter uppercase">Recent Subscriptions</h2>
            <div className="mt-6 space-y-4">
              {ACTIVE_SUBSCRIPTIONS.map((subscription) => (
                <div key={subscription.id} className="flex flex-col gap-4 rounded-2xl border bg-slate-50/80 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="font-bold text-slate-900">{subscription.vendor}</div>
                    <div className="text-sm text-muted-foreground">{subscription.plan}</div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="font-semibold">${subscription.amount}</span>
                    <span className="text-muted-foreground">Renews {new Date(subscription.renewsOn).toLocaleDateString()}</span>
                    <Badge className={subscription.status === 'Active' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-amber-100 text-amber-700 hover:bg-amber-100'}>
                      {subscription.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border bg-white p-8 shadow-sm">
            <h2 className="border-b pb-4 text-xl font-black tracking-tighter uppercase">Billing Controls</h2>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border bg-stone-50 p-4">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  <CreditCard className="h-4 w-4 text-primary" />
                  Stripe status
                </div>
                <div className="mt-2 text-lg font-black text-slate-900">Connected</div>
              </div>
              <div className="rounded-2xl border bg-stone-50 p-4">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  MRR tracking
                </div>
                <div className="mt-2 text-lg font-black text-slate-900">Automated</div>
              </div>
              <div className="rounded-2xl border bg-stone-50 p-4">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Upload gating
                </div>
                <div className="mt-2 text-sm text-stone-600">Vendors without an active plan should be blocked from product creation and bulk uploads.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
