'use client';

import * as React from 'react';
import { BUYER_ORDERS } from '@/lib/buyer-mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Download,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params.id as string;
  const order = BUYER_ORDERS.find(o => o.id === orderId);

  if (!order) {
    return notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/buyer/history">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Order Tracking</h1>
          <p className="text-sm text-muted-foreground">Order <span className="font-bold text-foreground">#{order.id}</span> • Placed on {new Date(order.date).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-workshop-dark border rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-black tracking-tighter uppercase mb-8">Tracking Timeline</h2>
            
            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-slate-200 before:to-slate-200 dark:before:via-slate-800 dark:before:to-slate-800">
              {order.tracking.map((step, index) => {
                const isFirst = index === 0;
                const isLast = index === order.tracking.length - 1;
                
                return (
                  <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    {/* Icon */}
                    <div className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-workshop-dark shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors",
                      isFirst ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-muted-foreground"
                    )}>
                      {step.status === 'Delivered' && <CheckCircle2 className="h-4 w-4" />}
                      {step.status === 'Out for Delivery' && <Truck className="h-4 w-4" />}
                      {step.status === 'In Transit' && <Truck className="h-4 w-4" />}
                      {step.status === 'Shipped' && <Package className="h-4 w-4" />}
                      {step.status === 'Processing' && <Clock className="h-4 w-4" />}
                    </div>
                    
                    {/* Content */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-slate-50/50 dark:bg-slate-900/30 transition-all hover:shadow-md">
                      <div className="flex items-center justify-between mb-1">
                        <time className="text-xs font-bold uppercase tracking-widest text-primary">{step.date}</time>
                        <Badge variant="outline" className="text-[10px] font-bold uppercase">{step.status}</Badge>
                      </div>
                      <div className="text-sm font-bold mb-1">{step.description}</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {step.location}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Details Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-workshop-dark border rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="font-bold uppercase tracking-tighter border-b pb-2">Order Summary</h3>
            
            <div className="space-y-4">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="text-sm font-bold leading-tight">{item.name}</div>
                    <div className="text-xs text-muted-foreground">Qty: {item.quantity}</div>
                  </div>
                  <div className="text-sm font-black tracking-tighter">${item.price.toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold">${order.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-bold text-emerald-500">FREE</span>
              </div>
              <div className="flex justify-between text-lg pt-2">
                <span className="font-black tracking-tighter uppercase">Total</span>
                <span className="font-black tracking-tighter text-primary">${order.total.toLocaleString()}</span>
              </div>
            </div>

            <Button className="w-full" variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download Invoice
            </Button>
          </div>

          <div className="bg-white dark:bg-workshop-dark border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold uppercase tracking-tighter border-b pb-2">Vendor Info</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-primary">
                {order.vendor.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-bold">{order.vendor}</div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold uppercase">
                  <ShieldCheck className="h-3 w-3" />
                  Verified
                </div>
              </div>
            </div>
            <Button variant="ghost" className="w-full justify-start text-xs font-bold uppercase tracking-widest h-8">
              Contact Vendor
            </Button>
          </div>

          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
            <div className="space-y-1">
              <div className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-widest">Need Help?</div>
              <p className="text-[10px] text-amber-700 dark:text-amber-500">If you encounter any issues with your order, you can open a dispute within 30 days of delivery.</p>
              <Button variant="link" className="h-auto p-0 text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-widest">Open Dispute</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
