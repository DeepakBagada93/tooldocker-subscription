import * as React from 'react';
import { getAdminAnalyticsData } from '@/lib/admin-dashboard';
import {
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function AnalyticsPage() {
  const data = await getAdminAnalyticsData();

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
        {data.stats.map((stat) => (
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
    </div>
  );
}
