import Link from 'next/link'
import { AlertCircle, CheckCircle2, Download, FileSpreadsheet, Info, Lock, Upload } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getVendorSubscriptionStatus } from '@/lib/subscriptions'

export default async function BulkUploadPage() {
  const subscription = await getVendorSubscriptionStatus()
  const isLocked = !subscription.canUseBulkUpload

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tighter uppercase">Bulk Catalog Upload</h1>
        <p className="text-muted-foreground">CSV and Excel imports are available only for vendors with an active plan that includes bulk uploads.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className={`relative overflow-hidden rounded-3xl border-2 border-dashed p-12 text-center transition-all ${isLocked ? 'border-red-200 bg-red-50/70' : 'border-stone-200 bg-white'}`}>
            <div className="space-y-6">
              <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-2xl ${isLocked ? 'bg-red-100' : 'bg-slate-100'}`}>
                {isLocked ? <Lock className="h-10 w-10 text-red-500" /> : <Upload className="h-10 w-10 text-primary" />}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">
                  {isLocked ? 'Upgrade required before uploads can start' : 'Drag and drop your CSV or Excel file here'}
                </h3>
                <p className="mx-auto max-w-md text-muted-foreground">
                  {isLocked
                    ? 'Your current subscription does not include bulk product imports. Upgrade to Growth or Scale to unlock CSV and Excel processing.'
                    : 'Accepted formats: .csv, .xlsx. Product limits still apply, and every upload is checked against your active subscription.'}
                </p>
              </div>
              {isLocked ? (
                <Button variant="outline" className="h-12 px-8" asChild>
                  <Link href="/vendor/commission">Upgrade Subscription</Link>
                </Button>
              ) : (
                <Button variant="industrial" className="h-12 px-8">Browse Files</Button>
              )}
            </div>
          </div>

          <div className="rounded-2xl border bg-slate-50/80 p-6">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
              <Info className="h-4 w-4 text-primary" />
              Upload Rules
            </div>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                Product imports are blocked if the vendor has no active subscription at upload time.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                Product count cannot exceed the remaining slots in the current plan.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                Imported products still enter the moderation queue before going live.
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="border-b pb-3 font-bold uppercase tracking-tighter">Subscription Access</h3>
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border bg-stone-50 p-4">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Current plan</div>
                <div className="mt-2 text-lg font-black text-slate-900">{subscription.plan?.name ?? 'No active plan'}</div>
                <div className="mt-1 text-sm text-stone-600">
                  {subscription.hasActiveSubscription ? `${subscription.productCount}/${subscription.productLimit} products used` : 'Billing activation needed'}
                </div>
              </div>
              <div className="rounded-2xl border bg-stone-50 p-4">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Bulk upload</div>
                <div className="mt-2 flex items-center gap-2">
                  <Badge className={subscription.canUseBulkUpload ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-red-100 text-red-700 hover:bg-red-100'}>
                    {subscription.canUseBulkUpload ? 'Enabled' : 'Locked'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="border-b pb-3 font-bold uppercase tracking-tighter">Templates</h3>
            <div className="mt-4 space-y-3">
              {['Vendor upload template', 'Sample industrial catalog'].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-xl border bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="h-5 w-5 text-primary" />
                    <div className="text-sm font-bold text-slate-900">{item}</div>
                  </div>
                  <Download className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <div className="flex items-center gap-2 font-bold uppercase tracking-tighter text-primary">
              <AlertCircle className="h-5 w-5" />
              Billing note
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Stripe-backed billing should be used to activate vendor plans before catalog imports are accepted by the backend.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
