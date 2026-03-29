import * as React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  TrendingUp,
  Package,
  Truck,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  CircleCheck,
  Clock3,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { getVendorSubscriptionStatus } from '@/lib/subscriptions';
import { createClient } from '@/lib/supabase/server';

// Since we need charts, we'll keep the UI part in a client component or use a wrapper.
// For now, let's just make the main page a Server Component to fetch data.

export default async function VendorDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const subscription = await getVendorSubscriptionStatus();

  // Fetch real stats
  const { count: productCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('vendor_id', user?.id);

  // In a real app, we'd fetch orders and revenue here. 
  // For now, we'll show 0 or actual data if available.
  const { data: orders } = await supabase
    .from('orders') // Assuming an orders table exists or using a mock for now if not
    .select('total_amount')
    .eq('vendor_id', user?.id);

  const totalOrders = orders?.length || 0;
  const grossSales = orders?.reduce((acc, order) => acc + (order.total_amount || 0), 0) || 0;

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  });

  const stats = [
    { name: 'Gross Sales', value: currencyFormatter.format(grossSales), icon: DollarSign, trend: '+0%', isUp: true, note: 'Real-time sales tracking' },
    { name: 'Total Orders', value: totalOrders.toString(), icon: Truck, trend: '+0%', isUp: true, note: 'Orders needing fulfillment' },
    { name: 'Active Products', value: (productCount || 0).toString(), icon: Package, trend: `Limit: ${subscription.productLimit}`, isUp: true, note: 'Your current catalog size' },
    { name: 'Plan Status', value: subscription.plan?.name || 'No Plan', icon: ShieldCheck, trend: subscription.billingInterval || 'Inactive', isUp: true, note: `${subscription.planUtilization}% of capacity used` },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-stone-200/80 bg-[linear-gradient(135deg,_rgba(255,255,255,0.96),_rgba(255,247,237,0.92))] shadow-sm">
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)] lg:p-8">
          <div className="space-y-5">
            <Badge className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700 hover:bg-emerald-100">
              {subscription.hasActiveSubscription ? 'Store is active' : 'Subscription required'}
            </Badge>
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-[-0.05em] text-slate-900 sm:text-4xl">Manage your industrial storefront with precision.</h1>
              <p className="max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                Monitor your business performance, track product limits, and manage your {subscription.plan?.name || 'basic'} subscription all in one place.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button variant="industrial" className="h-11 rounded-2xl px-5" asChild>
                <Link href="/vendor/commission">Manage Subscription</Link>
              </Button>
              <Button variant="outline" className="h-11 rounded-2xl border-stone-300 bg-white/80 px-5" asChild>
                <Link href="/vendor/products">View Catalog</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-stone-200/80 bg-slate-900 p-5 text-white sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/60">Product Usage</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight">{subscription.productCount} / {subscription.productLimit}</h2>
                <p className="mt-2 text-sm text-white/70">You are using {subscription.planUtilization}% of your plan's product slots.</p>
              </div>
              <Badge className="rounded-full bg-white/10 text-white hover:bg-white/10">{subscription.plan?.name || 'Free'}</Badge>
            </div>
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/70">
                  <span>Usage Level</span>
                  <span>{subscription.planUtilization}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${subscription.planUtilization}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="rounded-[1.6rem] border border-stone-200/80 bg-white/90 p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div className={`flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${stat.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {stat.isUp ? <ArrowUpRight className="mr-1 h-3 w-3" /> : <ArrowDownRight className="mr-1 h-3 w-3" />}
                {stat.trend}
              </div>
            </div>
            <div className="text-2xl font-black tracking-tight text-slate-900">{stat.value}</div>
            <div className="mt-1 text-xs font-bold uppercase tracking-[0.22em] text-stone-500">{stat.name}</div>
            <p className="mt-3 text-sm text-stone-600">{stat.note}</p>
          </div>
        ))}
      </section>

      <div className="rounded-[2rem] border border-stone-200/80 bg-white/90 p-12 text-center shadow-sm">
        <div className="mx-auto max-w-sm space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-100">
            <TrendingUp className="h-8 w-8 text-stone-400" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Sales analytics coming soon</h2>
          <p className="text-sm text-stone-600">
            We are working on integrating real-time sales and revenue charts for your store. Check back after your first few orders!
          </p>
          <Button variant="industrial" asChild className="mt-4 rounded-xl px-8">
            <Link href="/vendor/products/new">Add More Products</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
