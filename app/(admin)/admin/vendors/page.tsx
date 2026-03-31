import { assignVendorPlan, setVendorProductAccess } from '@/app/actions/admin'
import { getAdminSubscriptionPlanOptions, getAdminVendorQueue } from '@/lib/admin-dashboard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, ShieldCheck, Globe, Calendar, Download, Lock, PackageCheck } from 'lucide-react'

export default async function VendorApprovalPage() {
  const [vendors, plans] = await Promise.all([
    getAdminVendorQueue(),
    getAdminSubscriptionPlanOptions(),
  ])

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Vendor Activation Queue</h1>
          <p className="text-muted-foreground">Approve vendors, assign plans, and control when they are allowed to add products or use bulk upload.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Vendors
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm dark:bg-workshop-dark">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b bg-slate-50 dark:bg-slate-900/50">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Company</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Type</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Location</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Applied Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Plan</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Access</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {vendors.map((vendor) => (
                <tr key={vendor.id} className="group transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-bold">{vendor.name}</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{vendor.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider">
                      {vendor.type}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Globe className="h-3 w-3 text-muted-foreground" />
                      {vendor.country}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(vendor.appliedDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider">
                        {vendor.subscriptionName}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {vendor.productLimit > 0
                          ? `${vendor.productLimit} products | ${vendor.bulkUploadEnabled ? 'Bulk upload on' : 'Bulk upload off'}`
                          : 'Assign a plan to unlock product slots'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <Badge className={vendor.productAccess === 'approved'
                        ? 'bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                        : vendor.productAccess === 'blocked'
                          ? 'bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-700 dark:bg-red-950 dark:text-red-400'
                          : 'bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:bg-amber-950 dark:text-amber-400'}>
                        {vendor.productAccessLabel}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {vendor.status} | {vendor.subscriptionStatus}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end gap-3">
                      <form action={assignVendorPlan} className="flex flex-col items-end gap-2 sm:flex-row">
                        <input type="hidden" name="vendorId" value={vendor.profileId} />
                        <select
                          name="planKey"
                          defaultValue={vendor.subscriptionPlanKey ?? ''}
                          className="h-9 min-w-[180px] rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <option value="" disabled>
                            Select plan
                          </option>
                          {plans.map((plan) => (
                            <option key={plan.id} value={plan.planKey}>
                              {plan.name} ({plan.billingInterval})
                            </option>
                          ))}
                        </select>
                        <Button variant="outline" size="sm">
                          <PackageCheck className="mr-2 h-4 w-4" />
                          Save Plan
                        </Button>
                      </form>

                      {vendor.storeId ? (
                        <form action={setVendorProductAccess} className="inline-flex">
                          <input type="hidden" name="vendorId" value={vendor.profileId} />
                          <input type="hidden" name="storeId" value={vendor.storeId} />
                          <input
                            type="hidden"
                            name="shouldApprove"
                            value={vendor.productAccess === 'approved' ? 'false' : 'true'}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className={
                              vendor.productAccess === 'approved'
                                ? 'text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30'
                                : 'text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/30'
                            }
                          >
                            {vendor.productAccess === 'approved' ? (
                              <Lock className="mr-2 h-4 w-4" />
                            ) : (
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                            )}
                            {vendor.productAccess === 'approved' ? 'Pause Product Access' : 'Approve Product Access'}
                          </Button>
                        </form>
                      ) : (
                        <span className="text-xs text-muted-foreground">No store yet</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!vendors.length ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-muted-foreground">
                    No vendor profiles were found in Supabase yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
