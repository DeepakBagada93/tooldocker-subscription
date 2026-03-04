'use client';

import * as React from 'react';
import { BUYER_ORDERS, BUYER_DISPUTES, SAVED_VENDORS } from '@/lib/buyer-mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Package, 
  Truck, 
  Clock, 
  ShieldCheck, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  History,
  Heart
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function BuyerDashboardPage() {
  const stats = [
    { name: 'Active Orders', value: '2', icon: Truck, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
    { name: 'Completed', value: '12', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
    { name: 'Active RFQs', value: '4', icon: MessageSquare, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
    { name: 'Saved Vendors', value: '8', icon: Heart, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Buyer Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, John. Here&apos;s what&apos;s happening with your procurement.</p>
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
          
          <div className="space-y-4">
            {BUYER_ORDERS.map((order) => (
              <div key={order.id} className="bg-white dark:bg-workshop-dark border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">Order #{order.id}</div>
                      <div className="text-xs text-muted-foreground">{order.vendor} • {new Date(order.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black tracking-tighter">${order.total.toLocaleString()}</div>
                    <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider mt-1">
                      {order.status}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/buyer/orders/${order.id}`}>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* Active Disputes */}
          <div className="bg-white dark:bg-workshop-dark border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold uppercase tracking-tighter border-b pb-2 flex items-center justify-between">
              Active Disputes
              <Badge className="bg-amber-500 text-[10px]">{BUYER_DISPUTES.filter(d => d.status !== 'Resolved').length}</Badge>
            </h3>
            <div className="space-y-4">
              {BUYER_DISPUTES.filter(d => d.status !== 'Resolved').map((dispute) => (
                <div key={dispute.id} className="flex gap-3">
                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="text-xs font-bold leading-tight">{dispute.product}</div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{dispute.status}</div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full text-xs font-bold uppercase tracking-widest" asChild>
              <Link href="/buyer/disputes">Manage Disputes</Link>
            </Button>
          </div>

          {/* Saved Vendors Preview */}
          <div className="bg-white dark:bg-workshop-dark border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold uppercase tracking-tighter border-b pb-2">Saved Vendors</h3>
            <div className="flex -space-x-3 overflow-hidden">
              {SAVED_VENDORS.map((vendor) => (
                <div key={vendor.id} className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-workshop-dark overflow-hidden bg-slate-100 relative">
                  <Image src={vendor.logo} alt={vendor.name} fill className="object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 ring-2 ring-white dark:ring-workshop-dark text-[10px] font-bold">
                +4
              </div>
            </div>
            <Button variant="ghost" size="sm" className="w-full text-xs font-bold uppercase tracking-widest" asChild>
              <Link href="/buyer/vendors">View All Vendors</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { CheckCircle2, MessageSquare, ChevronRight } from 'lucide-react';
