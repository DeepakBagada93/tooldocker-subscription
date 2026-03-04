'use client';

import * as React from 'react';
import { BUYER_ADDRESSES } from '@/lib/buyer-mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  MapPin, 
  ShieldCheck, 
  Bell, 
  CreditCard, 
  Plus, 
  MoreVertical,
  Trash2,
  Edit2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState<'profile' | 'addresses' | 'notifications'>('profile');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tighter uppercase">Account Settings</h1>
        <p className="text-muted-foreground">Manage your profile, addresses, and notification preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <aside className="w-full lg:w-64 shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-4 lg:pb-0">
            {[
              { id: 'profile', name: 'Profile', icon: User },
              { id: 'addresses', name: 'Addresses', icon: MapPin },
              { id: 'notifications', name: 'Notifications', icon: Bell },
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
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-workshop-dark border rounded-3xl p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-4 border-slate-50 relative group">
                  <User className="h-10 w-10 text-muted-foreground" />
                  <button className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-widest">
                    Change
                  </button>
                </div>
                <div>
                  <h3 className="text-xl font-bold">John Doe</h3>
                  <p className="text-sm text-muted-foreground">Industrial Procurement Specialist</p>
                  <Badge variant="secondary" className="mt-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    <ShieldCheck className="h-3 w-3 mr-1" /> Verified Buyer
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">First Name</label>
                  <Input defaultValue="John" className="h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Last Name</label>
                  <Input defaultValue="Doe" className="h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address</label>
                  <Input defaultValue="john@industrialcorp.com" className="h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone Number</label>
                  <Input defaultValue="+1 (555) 123-4567" className="h-12" />
                </div>
              </div>

              <div className="pt-8 border-t flex justify-end">
                <Button variant="industrial" className="h-12 px-8 font-bold uppercase tracking-tighter">
                  Save Profile Changes
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black tracking-tighter uppercase">Saved Addresses</h2>
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {BUYER_ADDRESSES.map((address) => (
                  <div key={address.id} className={cn(
                    "bg-white dark:bg-workshop-dark border rounded-2xl p-6 shadow-sm relative group transition-all",
                    address.isDefault && "border-primary ring-2 ring-primary/10"
                  )}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-bold text-sm uppercase tracking-widest">{address.type}</span>
                        {address.isDefault && (
                          <Badge className="bg-primary text-[8px] font-bold uppercase tracking-widest">Default</Badge>
                        )}
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-1">
                      <div className="font-bold">{address.name}</div>
                      {address.company && <div className="text-xs font-medium text-muted-foreground">{address.company}</div>}
                      <div className="text-sm text-muted-foreground">
                        {address.street}<br />
                        {address.city}, {address.state} {address.zip}
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t flex items-center gap-4">
                      <button className="text-xs font-bold uppercase tracking-widest text-primary hover:underline flex items-center gap-1">
                        <Edit2 className="h-3 w-3" /> Edit
                      </button>
                      <button className="text-xs font-bold uppercase tracking-widest text-red-500 hover:underline flex items-center gap-1">
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white dark:bg-workshop-dark border rounded-3xl p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black tracking-tighter uppercase">Notification Preferences</h2>
              
              <div className="space-y-6">
                {[
                  { id: 'order_updates', name: 'Order Updates', desc: 'Get notified about your order status and tracking.' },
                  { id: 'rfq_responses', name: 'RFQ Responses', desc: 'Receive alerts when vendors respond to your quote requests.' },
                  { id: 'promotions', name: 'Industrial Deals', desc: 'Stay updated on the latest equipment discounts and offers.' },
                  { id: 'security', name: 'Security Alerts', desc: 'Important notifications about your account security.' },
                ].map((pref) => (
                  <div key={pref.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border">
                    <div className="space-y-1">
                      <div className="font-bold text-sm">{pref.name}</div>
                      <p className="text-xs text-muted-foreground">{pref.desc}</p>
                    </div>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary cursor-pointer">
                      <span className="inline-block h-4 w-4 translate-x-6 rounded-full bg-white transition" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t flex justify-end">
                <Button variant="industrial" className="h-12 px-8 font-bold uppercase tracking-tighter">
                  Update Preferences
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
