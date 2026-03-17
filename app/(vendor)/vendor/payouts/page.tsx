import { CreditCard, Download, FileText, Receipt, ShieldCheck } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { VENDOR_SUBSCRIPTION_INVOICES, VENDOR_SUBSCRIPTION_OVERVIEW } from '@/lib/vendor-mock-data'

export default function BillingHistoryPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Billing & Invoices</h1>
          <p className="text-muted-foreground">Track subscription payments, invoice history, and the plan features keeping your catalog online.</p>
        </div>
        <Button variant="industrial" size="sm">Update Payment Method</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { name: 'Current Plan', value: VENDOR_SUBSCRIPTION_OVERVIEW.currentPlan.name, icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { name: 'Next Invoice', value: `$${VENDOR_SUBSCRIPTION_OVERVIEW.nextInvoiceAmount.toLocaleString()}`, icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-50' },
          { name: 'Billing Status', value: VENDOR_SUBSCRIPTION_OVERVIEW.status, icon: Receipt, color: 'text-amber-500', bg: 'bg-amber-50' },
        ].map((stat) => (
          <div key={stat.name} className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-black tracking-tighter">{stat.value}</div>
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.name}</div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Invoice</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Plan</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Amount</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {VENDOR_SUBSCRIPTION_INVOICES.map((invoice) => (
                <tr key={invoice.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-bold font-mono text-sm">{invoice.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{new Date(invoice.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm font-medium">{invoice.planName}</td>
                  <td className="px-6 py-4 font-black tracking-tighter">${invoice.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">{invoice.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
