'use client';

import * as React from 'react';
import { ADMIN_DISPUTES } from '@/lib/admin-mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  AlertTriangle, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Calendar,
  MoreVertical,
  Scale
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DisputeResolutionPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Dispute Resolution Panel</h1>
          <p className="text-muted-foreground">Mediate and resolve conflicts between buyers and vendors.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Resolution Guidelines</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by dispute ID, buyer, or vendor..." 
            className="w-full pl-10 h-10 rounded-lg border bg-white dark:bg-workshop-dark outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10">
            <Filter className="mr-2 h-4 w-4" />
            Status
          </Button>
          <Button variant="outline" className="h-10">
            Reason
          </Button>
        </div>
      </div>

      {/* Disputes Table */}
      <div className="bg-white dark:bg-workshop-dark border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Dispute ID</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Parties</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Reason</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Date Opened</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {ADMIN_DISPUTES.map((dispute) => (
                <tr key={dispute.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-bold font-mono text-sm">{dispute.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold">{dispute.buyer}</div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">vs {dispute.vendor}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium">{dispute.reason}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-muted-foreground">
                      {new Date(dispute.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={cn(
                      "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                      dispute.status === 'Open' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                    )}>
                      {dispute.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" title="View Dispute"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80" title="Mediate">
                        <Scale className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Messages">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
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
