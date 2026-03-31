import { CheckCircle2, CreditCard, Plus, TrendingUp } from 'lucide-react'
import { getAdminSubscriptionPlanOptions } from '@/lib/admin-dashboard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default async function SubscriptionConfigPage() {
  const plans = await getAdminSubscriptionPlanOptions();

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
              {plans.map((plan) => (
                <div key={plan.id} className="rounded-2xl border bg-slate-50/80 p-6">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-bold text-slate-900">{plan.name}</div>
                        <Badge variant="outline" className="uppercase">{plan.billingInterval}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">Industrial tier subscription plan.</div>
                      <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider text-stone-500">
                        <span>{plan.productLimit} products</span>
                        <span>{plan.bulkUploadEnabled ? 'Bulk upload included' : 'No bulk upload'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {plans.length === 0 && (
                <div className="py-10 text-center border-2 border-dashed rounded-2xl text-muted-foreground uppercase font-bold tracking-widest text-xs">
                  No plans configured in database
                </div>
              )}
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
                <div className="mt-2 text-sm text-stone-600">Vendors without an active plan are blocked from product creation.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
