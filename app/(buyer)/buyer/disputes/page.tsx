'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Scale
} from 'lucide-react';
import Link from 'next/link';

export default function BuyerDisputesPage() {
  const disputes: any[] = [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">My Disputes</h1>
          <p className="text-muted-foreground">Manage ongoing reports and conflict resolutions with vendors.</p>
        </div>
      </div>

      {/* Empty State */}
      <div className="py-32 text-center border-2 border-dashed rounded-[3rem] bg-slate-50/50 space-y-6">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
            <Scale className="h-10 w-10 text-stone-200" />
        </div>
        <div className="space-y-2">
            <h3 className="text-2xl font-black tracking-tighter uppercase">No active disputes</h3>
            <p className="text-muted-foreground max-w-xs mx-auto text-sm">Thankfully, you don&apos;t have any active conflicts. If you have an issue with an order, you can open a dispute from the order details page.</p>
        </div>
        <Button variant="industrial" asChild>
            <Link href="/buyer/history">View Order History</Link>
        </Button>
      </div>
    </div>
  );
}
