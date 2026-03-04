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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  Download, 
  Calendar, 
  Filter, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Globe,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const COLORS = ['#F27D26', '#141414', '#5A5A40', '#E4E3E0'];

const CATEGORY_DATA = [
  { name: 'Power Tools', value: 45 },
  { name: 'Heavy Machinery', value: 25 },
  { name: 'Safety Gear', value: 20 },
  { name: 'Other', value: 10 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Global Analytics</h1>
          <p className="text-muted-foreground">Deep dive into marketplace trends, user behavior, and revenue streams.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Calendar className="mr-2 h-4 w-4" /> Custom Range</Button>
          <Button variant="industrial" size="sm"><Download className="mr-2 h-4 w-4" /> Export Data</Button>
        </div>
      </div>

      {/* Advanced Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { name: 'Avg. Order Value', value: '$2,450.00', trend: '+5.2%', isUp: true },
          { name: 'Customer LTV', value: '$12,800.00', trend: '+12.8%', isUp: true },
          { name: 'Churn Rate', value: '1.2%', trend: '-0.4%', isUp: true },
        ].map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-workshop-dark border rounded-2xl p-6 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{stat.name}</div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-black tracking-tighter">{stat.value}</div>
              <div className={`flex items-center text-xs font-bold ${stat.isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                {stat.isUp ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                {stat.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vendor Growth */}
        <div className="bg-white dark:bg-workshop-dark border rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-black tracking-tighter uppercase mb-8">Vendor Growth</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ADMIN_STATS.vendorGrowth}>
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
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="vendors" stroke="var(--color-primary, #F27D26)" strokeWidth={3} dot={{ r: 4, fill: '#F27D26' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white dark:bg-workshop-dark border rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-black tracking-tighter uppercase mb-8">Revenue by Category</h2>
          <div className="h-[300px] w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-4 shrink-0">
              {CATEGORY_DATA.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <div className="text-[10px] font-bold uppercase tracking-widest">{entry.name}</div>
                  <div className="text-[10px] font-black ml-auto">{entry.value}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
