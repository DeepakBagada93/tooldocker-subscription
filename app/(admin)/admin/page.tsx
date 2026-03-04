'use client';

import * as React from 'react';
import { ADMIN_STATS } from '@/lib/admin-mock-data';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Globe,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Admin Command Center</h1>
          <p className="text-muted-foreground">Global marketplace performance and system health.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">System Status: Healthy</Button>
          <Button variant="industrial" size="sm">Generate Global Report</Button>
        </div>
      </div>

      {/* Global Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: 'Global GMV', value: `$${(ADMIN_STATS.gmv / 1000000).toFixed(2)}M`, icon: DollarSign, trend: '+18.5%', isUp: true, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
          { name: 'Total Vendors', value: ADMIN_STATS.totalVendors.toLocaleString(), icon: ShieldCheck, trend: '+12.2%', isUp: true, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
          { name: 'Conversion Rate', value: `${ADMIN_STATS.conversionRate}%`, icon: Activity, trend: '+0.4%', isUp: true, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
          { name: 'Active Users', value: (ADMIN_STATS.activeUsers / 1000).toFixed(1) + 'k', icon: Users, trend: '-2.1%', isUp: false, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-950/30' },
        ].map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-workshop-dark border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <div className={`flex items-center text-xs font-bold ${stat.isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                {stat.isUp ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                {stat.trend}
              </div>
            </div>
            <div className="text-2xl font-black tracking-tighter">{stat.value}</div>
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.name}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* GMV Growth Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-workshop-dark border rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black tracking-tighter uppercase">GMV Performance</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Revenue</span>
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ADMIN_STATS.gmvData}>
                <defs>
                  <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary, #F27D26)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-primary, #F27D26)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700 }}
                  tickFormatter={(value) => `$${value/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="gmv" stroke="var(--color-primary, #F27D26)" strokeWidth={3} fillOpacity={1} fill="url(#colorGmv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Alerts / Tasks */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-workshop-dark border rounded-3xl p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-black tracking-tighter uppercase">Action Required</h2>
            <div className="space-y-4">
              {[
                { title: 'Vendor Approvals', count: 12, color: 'bg-blue-500', href: '/admin/vendors' },
                { title: 'Product Moderation', count: 45, color: 'bg-amber-500', href: '/admin/products' },
                { title: 'Open Disputes', count: 5, color: 'bg-red-500', href: '/admin/disputes' },
              ].map((task) => (
                <Link key={task.title} href={task.href} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border hover:border-primary transition-all group">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-2 h-2 rounded-full", task.color)} />
                    <span className="text-sm font-bold">{task.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-black">{task.count}</Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-workshop-dark text-white rounded-3xl p-8 space-y-4 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 industrial-grid" />
            <div className="relative z-10">
              <h3 className="text-lg font-black tracking-tighter uppercase">Platform Health</h3>
              <div className="space-y-4 mt-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span>Server Load</span>
                    <span>24%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[24%]" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span>API Latency</span>
                    <span>120ms</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[15%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
