'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Store,
  ShieldCheck,
  CreditCard,
  Plus,
  Edit2,
  Truck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StoreSettingsPage() {
  const [activeTab, setActiveTab] = React.useState<'store' | 'shipping' | 'billing'>('store');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tighter uppercase">Store Settings</h1>
        <p className="text-muted-foreground">Manage your vendor profile, shipping rules, and subscription billing preferences.</p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-64">
          <nav className="flex gap-1 overflow-x-auto pb-4 lg:flex-col lg:pb-0">
            {[
              { id: 'store', name: 'Store Profile', icon: Store },
              { id: 'shipping', name: 'Shipping Rules', icon: Truck },
              { id: 'billing', name: 'Billing Preferences', icon: CreditCard },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'store' | 'shipping' | 'billing')}
                  className={cn(
                    'whitespace-nowrap rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-widest transition-all',
                    'flex items-center gap-3',
                    isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-slate-100'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="flex-1 space-y-8">
          {activeTab === 'store' && (
            <div className="animate-in slide-in-from-bottom-4 space-y-8 rounded-3xl border bg-white p-8 duration-500">
              <div className="flex items-center gap-6">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-slate-50 bg-slate-100">
                  <Store className="h-10 w-10 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">SteelWorks Machinery</h3>
                  <p className="text-sm text-muted-foreground">Industrial Equipment & Heavy Machinery</p>
                  <Badge variant="secondary" className="mt-2 bg-emerald-100 text-emerald-700">
                    <ShieldCheck className="mr-1 h-3 w-3" /> Verified Vendor
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 border-t pt-8 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Store Name</label>
                  <Input defaultValue="SteelWorks Machinery" className="h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Support Email</label>
                  <Input defaultValue="support@steelworks.com" className="h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Store Website</label>
                  <Input defaultValue="https://steelworks.com" className="h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone Number</label>
                  <Input defaultValue="+1 (555) 987-6543" className="h-12" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Store Description</label>
                  <textarea
                    className="h-32 w-full rounded-xl border bg-white p-4 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    defaultValue="Specializing in high-performance industrial equipment and heavy machinery for construction and manufacturing sectors."
                  />
                </div>
              </div>

              <div className="flex justify-end border-t pt-8">
                <Button variant="industrial" className="h-12 px-8 font-bold uppercase tracking-tighter">
                  Save Store Profile
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="animate-in slide-in-from-bottom-4 space-y-6 duration-500">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black tracking-tighter uppercase">Shipping Rules</h2>
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Rule
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {[
                  { name: 'Standard Freight', cost: '$150.00', time: '5-7 Days', status: 'Active' },
                  { name: 'Express Delivery', cost: '$450.00', time: '2-3 Days', status: 'Active' },
                  { name: 'Local Pickup', cost: 'Free', time: '1 Day', status: 'Inactive' },
                ].map((rule) => (
                  <div key={rule.name} className="flex items-center justify-between rounded-2xl border bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                        <Truck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-bold">{rule.name}</div>
                        <div className="text-xs text-muted-foreground">{rule.time} - {rule.cost}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={cn(
                        'px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                        rule.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                      )}>
                        {rule.status}
                      </Badge>
                      <Button variant="ghost" size="icon"><Edit2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="animate-in slide-in-from-bottom-4 space-y-8 rounded-3xl border bg-white p-8 duration-500">
              <h2 className="text-2xl font-black tracking-tighter uppercase">Billing Preferences</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-2xl border bg-slate-50 p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border bg-white">
                      <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">Primary Billing Card</div>
                      <div className="text-xs text-muted-foreground">Visa ending in **** 4567</div>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500 text-[8px] font-bold uppercase tracking-widest">Default</Badge>
                </div>

                <Button variant="outline" className="h-16 w-full rounded-2xl border-2 border-dashed text-muted-foreground hover:border-primary hover:text-primary">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Payment Method
                </Button>
              </div>

              <div className="space-y-4 border-t pt-8">
                <h3 className="text-sm font-bold uppercase tracking-widest">Billing Interval</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {['Monthly', 'Yearly', 'Auto-Renew'].map((schedule) => (
                    <button
                      key={schedule}
                      className={cn(
                        'rounded-xl border p-4 text-center transition-all',
                        schedule === 'Monthly' ? 'border-primary bg-primary/5 text-primary' : 'bg-white text-muted-foreground hover:border-primary'
                      )}
                    >
                      <div className="text-sm font-bold">{schedule}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
