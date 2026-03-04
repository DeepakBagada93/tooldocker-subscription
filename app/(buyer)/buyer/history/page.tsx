'use client';

import * as React from 'react';
import { BUYER_ORDERS } from '@/lib/buyer-mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const STATUS_COLORS = {
  'Delivered': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
  'In Transit': 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
  'Processing': 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  'Cancelled': 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
};

const STATUS_ICONS = {
  'Delivered': CheckCircle2,
  'In Transit': Truck,
  'Processing': Clock,
  'Cancelled': Package,
};

export default function OrderHistoryPage() {
  const [searchTerm, setSearchTerm] = React.useState('');

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Order History</h1>
          <p className="text-muted-foreground">Manage and track all your industrial equipment orders.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by Order ID or Vendor..." 
            className="w-full pl-10 h-10 rounded-lg border bg-white dark:bg-workshop-dark outline-none focus:ring-2 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-10">
          <Filter className="mr-2 h-4 w-4" />
          More Filters
        </Button>
      </div>

      {/* Orders Table/List */}
      <div className="bg-white dark:bg-workshop-dark border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Vendor</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Total</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {BUYER_ORDERS.map((order) => {
                const StatusIcon = STATUS_ICONS[order.status as keyof typeof STATUS_ICONS] || Package;
                return (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-bold font-mono text-sm">{order.id}</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold">{order.vendor}</div>
                      <div className="text-xs text-muted-foreground">{order.items.length} items</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-black tracking-tighter">${order.total.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={cn("px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", STATUS_COLORS[order.status as keyof typeof STATUS_COLORS])}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/buyer/orders/${order.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" title="Download Invoice">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State Example (Hidden) */}
      {BUYER_ORDERS.length === 0 && (
        <div className="py-20 text-center space-y-6 bg-white dark:bg-workshop-dark border-2 border-dashed rounded-3xl">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black tracking-tighter uppercase">No orders yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              You haven&apos;t placed any orders yet. Start browsing our industrial catalog to find what you need.
            </p>
          </div>
          <Button variant="industrial" asChild>
            <Link href="/">Start Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
