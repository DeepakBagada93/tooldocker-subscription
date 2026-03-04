'use client';

import * as React from 'react';
import { PAYOUT_HISTORY } from '@/lib/vendor-mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Search, 
  Filter, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  TrendingUp,
  History
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PayoutHistoryPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Payout History</h1>
          <p className="text-muted-foreground">Track your earnings and payout status.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="industrial" size="sm">Request Payout</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { name: 'Available for Payout', value: '$12,450.00', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
          { name: 'Pending Payout', value: '$4,200.00', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
          { name: 'Total Paid Out', value: '$108,750.00', icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
        ].map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-workshop-dark border rounded-2xl p-6 shadow-sm">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", stat.bg)}>
              <stat.icon className={cn("h-5 w-5", stat.color)} />
            </div>
            <div className="text-2xl font-black tracking-tighter">{stat.value}</div>
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.name}</div>
          </div>
        ))}
      </div>

      {/* Payout History Table */}
      <div className="bg-white dark:bg-workshop-dark border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Payout ID</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Amount</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {PAYOUT_HISTORY.map((payout) => (
                <tr key={payout.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-bold font-mono text-sm">{payout.id}</span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(payout.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-black tracking-tighter">${payout.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      {payout.status}
                    </Badge>
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
  );
}
