'use client';

import * as React from 'react';
import { createClient } from '@/lib/supabase/client';
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
  const [orders, setOrders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const supabase = createClient();

  const fetchOrders = React.useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setOrders(VENDOR_ORDERS as any[]);
        setLoading(false);
        return;
      }

      // Get store ID
      const { data: store, error: storeError } = await supabase
        .from('stores')
        .select('id')
        .eq('vendor_id', user.id)
        .single();

      if (storeError || !store) {
        setOrders(VENDOR_ORDERS as any[]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('vendor_orders')
        .select('*, orders(shipping_address, buyer_id)')
        .eq('store_id', store.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setOrders(data);
      }
    } catch (e) {
      console.warn('Supabase fetch failed (or unconfigured), falling back to mock orders', e);
      setOrders(VENDOR_ORDERS as any[]);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  React.useEffect(() => {
    fetchOrders();

    try {
      // Set up Realtime Subscription for this vendor's orders
      const channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: '*', // Listen to INSERT, UPDATE, DELETE
            schema: 'public',
            table: 'vendor_orders',
          },
          (payload) => {
            console.log('Realtime change received!', payload);
            fetchOrders();
          }
        )
        .subscribe((status, err) => {
          if (err) console.warn('Supabase Realtime not connected (using mock data)');
        });

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (e) {
      console.warn('Realtime subscription skipped due to unconfigured connection');
    }
  }, [fetchOrders, supabase]);

  const filteredOrders = activeFilter === 'All'
    ? orders
    : orders.filter(o => o.status.toLowerCase() === activeFilter.toLowerCase());

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
        {loading ? (
          <p className="text-muted-foreground p-4">Loading your orders...</p>
        ) : filteredOrders.length === 0 ? (
          <p className="text-muted-foreground p-4">No orders found.</p>
        ) : filteredOrders.map((order) => (
          <div key={order.id} className="bg-white dark:bg-workshop-dark border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg truncate w-32" title={order.id}>{order.id.split('-')[0]}...</span>
                    <Badge className={cn("px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", STATUS_COLORS[order.status as keyof typeof STATUS_COLORS] || 'bg-slate-100 text-slate-700')}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="text-sm font-medium">{order.customer || order.orders?.shipping_address?.name || 'Customer'}</div>
                  <div className="text-xs text-muted-foreground">Placed on {new Date(order.date || order.created_at).toLocaleDateString()}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-8">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Platform Fee</div>
                  <div className="text-sm font-bold text-emerald-600">${order.commission_amount ?? 0}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Vendor Receivable</div>
                  <div className="text-sm font-black tracking-tighter text-emerald-500">${order.net_amount || order.total?.toLocaleString() || '0'}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Paid</div>
                  <div className="text-sm font-bold">${order.total_amount || order.total?.toLocaleString() || '0'}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  Details
                </Button>
                {order.status === 'pending' && (
                  <Button variant="industrial" size="sm">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Accept
                  </Button>
                )}
                {order.status === 'processing' && (
                  <Button variant="industrial" size="sm">
                    <Truck className="mr-2 h-4 w-4" />
                    Ship Order
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
