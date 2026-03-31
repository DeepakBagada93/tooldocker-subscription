'use client';

import * as React from 'react';
import { 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#F27D26', '#141414', '#5A5A40', '#E4E3E0'];

const CATEGORY_DATA = [
  { name: 'Power Tools', value: 45 },
  { name: 'Heavy Machinery', value: 25 },
  { name: 'Safety Gear', value: 20 },
  { name: 'Other', value: 10 },
];

export function AnalyticsCharts({ vendorGrowth }: { vendorGrowth: any[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Vendor Growth */}
      <div className="bg-white dark:bg-workshop-dark border rounded-3xl p-8 shadow-sm">
        <h2 className="text-xl font-black tracking-tighter uppercase mb-8">Vendor Growth</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={vendorGrowth}>
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
  );
}
