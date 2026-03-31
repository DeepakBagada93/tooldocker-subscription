'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Filter, 
  Package
} from 'lucide-react';
import Link from 'next/link';

export default function OrderHistoryPage() {
  const orders: any[] = [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Order History</h1>
          <p className="text-muted-foreground">Review and track all your past marketplace transactions.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by Order ID, product, or vendor..." 
            className="w-full pl-10 h-10 rounded-lg border bg-white dark:bg-workshop-dark outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <Button variant="outline" className="h-10">
          <Filter className="mr-2 h-4 w-4" />
          Filter Results
        </Button>
      </div>

      {/* Empty State */}
      <div className="py-32 text-center border-2 border-dashed rounded-[3rem] bg-slate-50/50 space-y-6">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
            <Package className="h-10 w-10 text-stone-200" />
        </div>
        <div className="space-y-2">
            <h3 className="text-2xl font-black tracking-tighter uppercase">No orders found</h3>
            <p className="text-muted-foreground max-w-xs mx-auto text-sm">You haven&apos;t placed any orders yet. Explore our marketplace to find tools and machinery.</p>
        </div>
        <Button variant="industrial" asChild>
            <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    </div>
  );
}
