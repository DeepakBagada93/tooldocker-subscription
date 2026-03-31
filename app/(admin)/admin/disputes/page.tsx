'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Filter
} from 'lucide-react';

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

      {/* Disputes Table - Empty State */}
      <div className="bg-white dark:bg-workshop-dark border rounded-2xl overflow-hidden shadow-sm">
        <div className="py-24 text-center">
            <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-stone-300" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tighter">No active disputes</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">All conflicts have been resolved or no new reports have been filed.</p>
        </div>
      </div>
    </div>
  );
}
