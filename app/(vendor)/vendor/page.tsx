'use client';

import * as React from 'react';
import { VENDOR_STATS } from '@/lib/vendor-mock-data';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  Package, 
  Truck, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function VendorDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Vendor Overview</h1>
          <p className="text-muted-foreground">Monitor your store performance and sales analytics.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Last 30 Days</Button>
          <Button variant="industrial" size="sm">Download Report</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: 'Total Revenue', value: `$${VENDOR_STATS.totalRevenue.toLocaleString()}`, icon: DollarSign, trend: '+12.5%', isUp: true },
          { name: 'Total Orders', value: VENDOR_STATS.totalOrders, icon: Truck, trend: '+8.2%', isUp: true },
          { name: 'Active Products', value: VENDOR_STATS.activeProducts, icon: Package, trend: '+2', isUp: true },
          { name: 'Pending Payout', value: `$${VENDOR_STATS.payoutPending.toLocaleString()}`, icon: TrendingUp, trend: '-3.1%', isUp: false },
        ].map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-workshop-dark border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-primary" />
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
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-workshop-dark border rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black tracking-tighter uppercase">Revenue Analytics</h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Revenue</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={VENDOR_STATS.revenueData}>
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
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                />
                <Bar dataKey="revenue" fill="var(--color-primary, #F27D26)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-workshop-dark border rounded-3xl p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black tracking-tighter uppercase">Top Products</h2>
            <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
          </div>
          <div className="space-y-6">
            {VENDOR_STATS.topProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <Package className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold truncate">{product.name}</div>
                  <div className="text-xs text-muted-foreground">{product.sales} Sales</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black tracking-tighter">${product.revenue.toLocaleString()}</div>
                  <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-widest text-emerald-500">Top Seller</Badge>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full text-xs font-bold uppercase tracking-widest">View All Products</Button>
        </div>
      </div>
    </div>
  );
}
