'use client';

import * as React from 'react';
import { BUYER_DISPUTES } from '@/lib/buyer-mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const STATUS_COLORS = {
  'Resolved': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
  'Under Review': 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  'Action Required': 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
};

export default function DisputesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Returns & Disputes</h1>
          <p className="text-muted-foreground">Manage your product returns and order-related disputes.</p>
        </div>
        <Button variant="industrial">
          <Plus className="mr-2 h-4 w-4" />
          New Dispute
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {BUYER_DISPUTES.map((dispute) => (
          <div key={dispute.id} className="bg-white dark:bg-workshop-dark border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-6 w-6 text-amber-500" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{dispute.id}</span>
                    <Badge className={cn("px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", STATUS_COLORS[dispute.status as keyof typeof STATUS_COLORS])}>
                      {dispute.status}
                    </Badge>
                  </div>
                  <div className="text-sm font-medium">{dispute.product}</div>
                  <div className="text-xs text-muted-foreground">
                    Order <span className="font-bold text-foreground">#{dispute.orderId}</span> • Opened on {new Date(dispute.date).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:items-end gap-2">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Reason</div>
                <div className="text-sm font-bold">{dispute.reason}</div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  View Messages
                </Button>
                <Button variant="ghost" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {BUYER_DISPUTES.length === 0 && (
        <div className="py-20 text-center space-y-6 bg-white dark:bg-workshop-dark border-2 border-dashed rounded-3xl">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black tracking-tighter uppercase">No Active Disputes</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Everything looks good! You don&apos;t have any active returns or disputes at the moment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
