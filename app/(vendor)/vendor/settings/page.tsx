'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Store, 
  MapPin, 
  ShieldCheck, 
  Bell, 
  CreditCard, 
  Plus, 
  MoreVertical,
  Trash2,
  Edit2,
  Globe,
  Truck,
  Package,
  Clock,
  User,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StoreSettingsPage() {
  const [activeTab, setActiveTab] = React.useState<'store' | 'shipping' | 'payout'>('store');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tighter uppercase">Store Settings</h1>
        <p className="text-muted-foreground">Manage your vendor profile, shipping rules, and payout methods.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <aside className="w-full lg:w-64 shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-4 lg:pb-0">
            {[
              { id: 'store', name: 'Store Profile', icon: Store },
              { id: 'shipping', name: 'Shipping Rules', icon: Truck },
              { id: 'payout', name: 'Payout Methods', icon: CreditCard },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest rounded-xl transition-all whitespace-nowrap",
                    isActive 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1 space-y-8">
          {activeTab === 'store' && (
            <div className="bg-white dark:bg-workshop-dark border rounded-3xl p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-4 border-slate-50 relative group">
                  <Store className="h-10 w-10 text-muted-foreground" />
                  <button className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-widest">
                    Change Logo
                  </button>
                </div>
                <div>
                  <h3 className="text-xl font-bold">SteelWorks Machinery</h3>
                  <p className="text-sm text-muted-foreground">Industrial Equipment & Heavy Machinery</p>
                  <Badge variant="secondary" className="mt-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    <ShieldCheck className="h-3 w-3 mr-1" /> Verified Vendor
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t">
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
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Store Description</label>
                  <textarea 
                    className="w-full h-32 p-4 rounded-xl border bg-white dark:bg-black outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                    defaultValue="Specializing in high-performance industrial equipment and heavy machinery for construction and manufacturing sectors."
                  />
                </div>
              </div>

              <div className="pt-8 border-t flex justify-end">
                <Button variant="industrial" className="h-12 px-8 font-bold uppercase tracking-tighter">
                  Save Store Profile
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                  <div key={rule.name} className="bg-white dark:bg-workshop-dark border rounded-2xl p-6 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Truck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-bold text-sm">{rule.name}</div>
                        <div className="text-xs text-muted-foreground">{rule.time} • {rule.cost}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={cn(
                        "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                        rule.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
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

          {activeTab === 'payout' && (
            <div className="bg-white dark:bg-workshop-dark border rounded-3xl p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black tracking-tighter uppercase">Payout Methods</h2>
              
              <div className="space-y-4">
                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-black flex items-center justify-center border">
                      <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">Bank Transfer (ACH)</div>
                      <div className="text-xs text-muted-foreground">Ending in **** 4567</div>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500 text-[8px] font-bold uppercase tracking-widest">Primary</Badge>
                </div>
                
                <Button variant="outline" className="w-full h-16 border-dashed border-2 rounded-2xl text-muted-foreground hover:text-primary hover:border-primary">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Payout Method
                </Button>
              </div>

              <div className="pt-8 border-t space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest">Payout Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['Weekly', 'Bi-Weekly', 'Monthly'].map((schedule) => (
                    <button
                      key={schedule}
                      className={cn(
                        "p-4 rounded-xl border text-center transition-all",
                        schedule === 'Weekly' ? "border-primary bg-primary/5 text-primary" : "bg-white dark:bg-black text-muted-foreground hover:border-primary"
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
