'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Truck, 
  ArrowRight,
  Heart,
  CheckCircle2,
  MessageSquare,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function BuyerDashboardPage() {
  const stats = [
    { name: 'Active Orders', value: '0', icon: Truck, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
    { name: 'Completed', value: '0', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
    { name: 'Active RFQs', value: '0', icon: MessageSquare, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
    { name: 'Wishlist', value: '0', icon: Heart, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Buyer Dashboard</h1>
          <p className="text-muted-foreground">Welcome back. Here&apos;s what&apos;s happening with your procurement.</p>
        </div>
        <Button variant="industrial" asChild>
          <Link href="/">
            Browse Marketplace
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white dark:bg-workshop-dark border rounded-2xl p-6 shadow-sm">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", stat.bg)}>
                <Icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <div className="text-2xl font-black tracking-tighter">{stat.value}</div>
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.name}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black tracking-tighter uppercase">Recent Orders</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/buyer/history" className="text-xs font-bold uppercase tracking-widest">
                View All
              </Link>
            </Button>
          </div>
          
          <div className="py-20 text-center border-2 border-dashed rounded-3xl bg-slate-50/50">
            <Package className="h-10 w-10 text-stone-300 mx-auto mb-4" />
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">No recent orders</p>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* Active Disputes */}
          <div className="bg-white dark:bg-workshop-dark border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold uppercase tracking-tighter border-b pb-2 flex items-center justify-between">
              Active Disputes
              <Badge className="bg-slate-200 text-slate-700 text-[10px]">0</Badge>
            </h3>
            <p className="text-xs text-muted-foreground text-center py-4">No active disputes reported.</p>
            <Button variant="outline" size="sm" className="w-full text-xs font-bold uppercase tracking-widest" asChild>
              <Link href="/buyer/disputes">Manage Disputes</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
