'use client';

import * as React from 'react';
import { ADMIN_STATS } from '@/lib/admin-mock-data';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import {
  Users,
  ShieldCheck,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  ChevronRight,
  Sparkles,
  Clock3,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const integerFormatter = new Intl.NumberFormat('en-US');

export default function AdminDashboardPage() {
  const stats = [
    { name: 'Global GMV', value: `$${(ADMIN_STATS.gmv / 1000000).toFixed(2)}M`, icon: DollarSign, trend: '+18.5%', isUp: true, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { name: 'Total Vendors', value: integerFormatter.format(ADMIN_STATS.totalVendors), icon: ShieldCheck, trend: '+12.2%', isUp: true, color: 'text-blue-500', bg: 'bg-blue-50' },
    { name: 'Conversion Rate', value: `${ADMIN_STATS.conversionRate}%`, icon: Activity, trend: '+0.4%', isUp: true, color: 'text-amber-500', bg: 'bg-amber-50' },
    { name: 'Active Users', value: `${(ADMIN_STATS.activeUsers / 1000).toFixed(1)}k`, icon: Users, trend: '-2.1%', isUp: false, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-stone-200/80 bg-[linear-gradient(135deg,_rgba(255,255,255,0.97),_rgba(241,245,249,0.95))] shadow-sm">
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:p-8">
          <div className="space-y-5">
            <Badge className="w-fit rounded-full bg-sky-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-700 hover:bg-sky-100">
              Platform operations snapshot
            </Badge>
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-[-0.05em] text-slate-900 sm:text-4xl">Admin tools that feel calmer, clearer, and easier to scan.</h1>
              <p className="max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                Watch marketplace health, catch urgent queues, and move between approvals and analytics quickly. The responsive layout keeps the same structure from mobile through desktop.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button variant="industrial" className="h-11 rounded-2xl px-5">Generate Global Report</Button>
              <Button variant="outline" className="h-11 rounded-2xl border-stone-300 bg-white/80 px-5">System Status: Healthy</Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Review SLA', value: '< 2 hrs', icon: Clock3 },
                { label: 'Trust & safety', value: 'Stable', icon: ShieldAlert },
                { label: 'Marketplace mood', value: 'Positive', icon: Sparkles },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/70 bg-white/85 px-4 py-3 shadow-sm">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-stone-100">
                    <item.icon className="h-4 w-4 text-slate-700" />
                  </div>
                  <div className="text-lg font-bold tracking-tight text-slate-900">{item.value}</div>
                  <div className="text-xs uppercase tracking-[0.2em] text-stone-500">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-800/80 bg-slate-900 p-5 text-white sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/60">Live command center</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight">${(ADMIN_STATS.gmv / 1000).toFixed(0)}k</h2>
                <p className="mt-2 text-sm text-white/70">Gross merchandise volume moving through the platform right now.</p>
              </div>
              <Badge className="rounded-full bg-white/10 text-white hover:bg-white/10">Healthy</Badge>
            </div>
            <div className="mt-6 space-y-4">
              {[
                { label: 'Approval queue', value: '12 pending', width: 'w-[48%]' },
                { label: 'Moderation throughput', value: '76%', width: 'w-[76%]' },
                { label: 'Support load', value: '31%', width: 'w-[31%]' },
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
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', stat.bg)}>
                <stat.icon className={cn('h-5 w-5', stat.color)} />
              </div>
              <div className={`flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${stat.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {stat.isUp ? <ArrowUpRight className="mr-1 h-3 w-3" /> : <ArrowDownRight className="mr-1 h-3 w-3" />}
                {stat.trend}
              </div>
            </div>
            <div className="text-2xl font-black tracking-tight text-slate-900">{stat.value}</div>
            <div className="mt-1 text-xs font-bold uppercase tracking-[0.22em] text-stone-500">{stat.name}</div>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
        <div className="rounded-[2rem] border border-stone-200/80 bg-white/90 p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-900">GMV Performance</h2>
              <p className="mt-1 text-sm text-stone-600">Revenue movement across the recent marketplace period.</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.22em] text-stone-500">
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span>Revenue</span>
              </div>
            </div>
          </div>
          <div className="h-[280px] w-full sm:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ADMIN_STATS.gmvData}>
                <defs>
                  <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary, #F27D26)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-primary, #F27D26)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="gmv" stroke="var(--color-primary, #F27D26)" strokeWidth={3} fillOpacity={1} fill="url(#colorGmv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[2rem] border border-stone-200/80 bg-white/90 p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-black tracking-tight text-slate-900">Action Required</h2>
            <p className="mt-1 text-sm text-stone-600">Priority queues that need admin attention next.</p>
            <div className="mt-6 space-y-3">
              {[
                { title: 'Vendor Approvals', count: 12, color: 'bg-blue-500', href: '/admin/vendors' },
                { title: 'Product Moderation', count: 45, color: 'bg-amber-500', href: '/admin/products' },
                { title: 'Open Disputes', count: 5, color: 'bg-red-500', href: '/admin/disputes' },
              ].map((task) => (
                <Link key={task.title} href={task.href} className="group flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50/80 p-4 transition-all hover:border-primary hover:bg-white">
                  <div className="flex items-center gap-3">
                    <div className={cn('h-2 w-2 rounded-full', task.color)} />
                    <span className="text-sm font-bold text-slate-900">{task.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-black">{task.count}</Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] bg-workshop-dark p-5 text-white shadow-sm sm:p-6">
            <div className="absolute inset-0 opacity-10 industrial-grid" />
            <div className="relative z-10">
              <h3 className="text-lg font-black tracking-tight">Platform Health</h3>
              <p className="mt-1 text-sm text-white/70">Service levels remain stable across core systems.</p>
              <div className="mt-5 space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span>Server Load</span>
                    <span>24%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[24%] bg-emerald-500" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span>API Latency</span>
                    <span>120ms</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[15%] bg-emerald-500" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span>Fraud screening</span>
                    <span>92%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[92%] bg-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
