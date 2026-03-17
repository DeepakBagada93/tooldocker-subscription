'use client';

import * as React from 'react';
import { VENDOR_STATS } from '@/lib/vendor-mock-data';
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

const integerFormatter = new Intl.NumberFormat('en-US');
const currencyFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export default function VendorDashboardPage() {
  const stats = [
    { name: 'Gross Sales', value: `$${currencyFormatter.format(VENDOR_STATS.grossSales)}`, icon: DollarSign, trend: '+12.5%', isUp: true, note: 'Buyer demand remains strong this month' },
    { name: 'Total Orders', value: VENDOR_STATS.totalOrders, icon: Truck, trend: '+8.2%', isUp: true, note: 'Shipments moving on time' },
    { name: 'Active Products', value: VENDOR_STATS.activeProducts, icon: Package, trend: '+2', isUp: true, note: 'Catalog is actively selling' },
    { name: 'Monthly Plan Cost', value: `$${currencyFormatter.format(VENDOR_STATS.subscriptionSpend)}`, icon: ShieldCheck, trend: 'Growth', isUp: true, note: `${VENDOR_STATS.planUtilization}% of plan capacity is currently used` },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-stone-200/80 bg-[linear-gradient(135deg,_rgba(255,255,255,0.96),_rgba(255,247,237,0.92))] shadow-sm">
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)] lg:p-8">
          <div className="space-y-5">
            <Badge className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700 hover:bg-emerald-100">
              Store health is improving
            </Badge>
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-[-0.05em] text-slate-900 sm:text-4xl">Run your store with clear subscription and catalog visibility.</h1>
              <p className="max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                Track sales, watch product capacity, and stay ahead of billing renewals before your listing access is interrupted. The layout is tuned to stay usable on phones, tablets, and wide screens.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button variant="industrial" className="h-11 rounded-2xl px-5">View Subscription</Button>
              <Button variant="outline" className="h-11 rounded-2xl border-stone-300 bg-white/80 px-5">Catalog Usage</Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Plan status', value: 'Active', icon: CircleCheck },
                { label: 'Renewal window', value: '19 days', icon: Clock3 },
                { label: 'Store momentum', value: 'Strong', icon: Sparkles },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-sm">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-stone-100">
                    <item.icon className="h-4 w-4 text-slate-700" />
                  </div>
                  <div className="text-lg font-bold tracking-tight text-slate-900">{item.value}</div>
                  <div className="text-xs uppercase tracking-[0.2em] text-stone-500">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-stone-200/80 bg-slate-900 p-5 text-white sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/60">This month</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight">{VENDOR_STATS.planUtilization}%</h2>
                <p className="mt-2 text-sm text-white/70">Current utilization of your subscription product allowance.</p>
              </div>
              <Badge className="rounded-full bg-white/10 text-white hover:bg-white/10">Growth plan</Badge>
            </div>
            <div className="mt-6 space-y-4">
              {[
                { label: 'Orders needing action', value: '14', width: 'w-[58%]' },
                { label: 'Bulk upload access', value: 'Enabled', width: 'w-[100%]' },
                { label: 'Catalog completeness', value: '91%', width: 'w-[91%]' },
              ].map((row) => (
                <div key={row.label} className="space-y-2">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/70">
                    <span>{row.label}</span>
                    <span>{row.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div className={`h-2 rounded-full bg-primary ${row.width}`} />
                  </div>
                </div>
              ))}
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

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
        <div className="rounded-[2rem] border border-stone-200/80 bg-white/90 p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-900">Sales Analytics</h2>
              <p className="mt-1 text-sm text-stone-600">Monthly sales trend alongside your subscription-led vendor model.</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-stone-500">
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span>Revenue</span>
              </div>
            </div>
          </div>
          <div className="h-[260px] w-full sm:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={VENDOR_STATS.revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                />
                <Bar dataKey="revenue" fill="var(--color-primary, #F27D26)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[2rem] border border-stone-200/80 bg-white/90 p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-900">Top Products</h2>
                <p className="mt-1 text-sm text-stone-600">Your strongest sellers at a glance.</p>
              </div>
              <Badge variant="outline" className="rounded-full border-stone-300 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-stone-600">Live</Badge>
            </div>
            <div className="mt-6 space-y-4">
              {VENDOR_STATS.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center gap-4 rounded-2xl border border-stone-200/80 bg-stone-50/80 p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-slate-900">{product.name}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.18em] text-stone-500">{product.sales} sales</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black tracking-tight text-slate-900">${currencyFormatter.format(product.revenue)}</div>
                    <div className="mt-1 text-xs text-stone-500">Rank #{index + 1}</div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-6 h-11 w-full rounded-2xl border-stone-300 bg-white text-xs font-bold uppercase tracking-[0.22em]">
              View All Products
            </Button>
          </div>

          <div className="rounded-[2rem] border border-stone-200/80 bg-[linear-gradient(180deg,_#fff,_#f7f4ee)] p-5 shadow-sm sm:p-6">
            <h3 className="text-lg font-black tracking-tight text-slate-900">Quick actions</h3>
            <p className="mt-1 text-sm text-stone-600">Take care of the next few tasks without hunting through the menu.</p>
            <div className="mt-5 space-y-3">
              {[
                { label: 'Review new orders', href: '/vendor/orders' },
                { label: 'Update product catalog', href: '/vendor/products' },
                { label: 'Manage subscription billing', href: '/vendor/commission' },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-primary hover:text-slate-900">
                  <span>{item.label}</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
