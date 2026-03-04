'use client';

import * as React from 'react';
import { COMMISSION_BREAKDOWN } from '@/lib/vendor-mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Info, 
  Search, 
  Filter, 
  DollarSign, 
  PieChart, 
  BarChart3, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CommissionBreakdownPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Commission Breakdown</h1>
          <p className="text-muted-foreground">Understand your earnings and platform fee structure.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <HelpCircle className="mr-2 h-4 w-4" />
            Fee Structure
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-workshop-dark border rounded-3xl p-8 shadow-sm space-y-6">
          <h2 className="text-xl font-black tracking-tighter uppercase">Current Fee Tier</h2>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-3xl font-black text-primary">10%</span>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-bold">Standard Vendor Tier</div>
              <p className="text-sm text-muted-foreground">Your commission rate is based on your monthly sales volume.</p>
              <Badge className="bg-emerald-500 text-[10px] font-bold uppercase tracking-widest mt-2">Active</Badge>
            </div>
          </div>
          <div className="pt-6 border-t space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Monthly Sales</span>
              <span className="font-bold">$12,450 / $25,000</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[50%] rounded-full" />
            </div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Reach $25,000 to drop to 8% commission</p>
          </div>
        </div>

        <div className="bg-white dark:bg-workshop-dark border rounded-3xl p-8 shadow-sm space-y-6">
          <h2 className="text-xl font-black tracking-tighter uppercase">Earnings Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border">
              <span className="text-sm font-bold">Gross Sales</span>
              <span className="text-lg font-black tracking-tighter">$125,400.50</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border">
              <span className="text-sm font-bold">Total Commission</span>
              <span className="text-lg font-black tracking-tighter text-red-500">-$12,540.05</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-primary/5 rounded-2xl border border-primary/20">
              <span className="text-sm font-bold text-primary">Net Earnings</span>
              <span className="text-lg font-black tracking-tighter text-primary">$112,860.45</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="bg-white dark:bg-workshop-dark border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Gross Amount</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Commission (10%)</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Platform Fee</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground text-right">Net Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {COMMISSION_BREAKDOWN.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-bold font-mono text-sm">{item.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold">${item.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-red-500 font-bold">-${item.commission.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-muted-foreground font-bold">-${item.platformFee.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-black tracking-tighter text-emerald-500">${item.net.toLocaleString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
