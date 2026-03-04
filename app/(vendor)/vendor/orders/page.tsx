'use client';

import * as React from 'react';
import { VENDOR_ORDERS } from '@/lib/vendor-mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Truck, 
  Package, 
  CheckCircle2, 
  Clock, 
  MoreVertical,
  Eye,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_COLORS = {
  'Processing': 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  'Shipped': 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
  'Delivered': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
};

export default function VendorOrdersPage() {
  const [activeFilter, setActiveFilter] = React.useState('All');

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Order Management</h1>
          <p className="text-muted-foreground">Track and fulfill your customer orders.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Export Orders</Button>
        </div>
      </div>

      {/* Tabs/Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              "px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full border transition-all whitespace-nowrap",
              activeFilter === filter 
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                : "bg-white dark:bg-workshop-dark text-muted-foreground hover:border-primary"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Search & Bulk Actions */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by Order ID or Customer..." 
            className="w-full pl-10 h-10 rounded-lg border bg-white dark:bg-workshop-dark outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <Button variant="outline" className="h-10">
          <Filter className="mr-2 h-4 w-4" />
          More Filters
        </Button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {VENDOR_ORDERS.map((order) => (
          <div key={order.id} className="bg-white dark:bg-workshop-dark border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{order.id}</span>
                    <Badge className={cn("px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", STATUS_COLORS[order.status as keyof typeof STATUS_COLORS])}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="text-sm font-medium">{order.customer}</div>
                  <div className="text-xs text-muted-foreground">Placed on {new Date(order.date).toLocaleDateString()}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-8">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Items</div>
                  <div className="text-sm font-bold">3 Products</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Revenue</div>
                  <div className="text-sm font-black tracking-tighter">${order.total.toLocaleString()}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Shipping Method</div>
                  <div className="text-sm font-bold">Industrial Freight</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  Details
                </Button>
                {order.status === 'Processing' && (
                  <Button variant="industrial" size="sm">
                    <Truck className="mr-2 h-4 w-4" />
                    Ship Order
                  </Button>
                )}
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
