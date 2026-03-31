'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Plus,
  Trash2,
  Edit2,
  User,
  Bell,
  Lock,
  CreditCard
} from 'lucide-react';

export default function BuyerSettingsPage() {
  const addresses: any[] = [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tighter uppercase">Account Settings</h1>
        <p className="text-muted-foreground">Manage your profile, shipping addresses, and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <aside className="lg:col-span-1 space-y-2">
          {[
            { name: 'Profile Information', icon: User, active: true },
            { name: 'Shipping Addresses', icon: MapPin, active: false },
            { name: 'Security', icon: Lock, active: false },
            { name: 'Notifications', icon: Bell, active: false },
            { name: 'Billing', icon: CreditCard, active: false },
          ].map((item) => (
            <button 
              key={item.name}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${item.active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </button>
          ))}
        </aside>

        {/* Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Shipping Addresses Section */}
          <div className="bg-white dark:bg-workshop-dark border rounded-3xl p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-xl font-black tracking-tighter uppercase">Shipping Addresses</h2>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Address
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr: any) => (
                <div key={addr.id} className="p-6 border rounded-2xl space-y-4 relative group">
                  <div className="flex justify-between items-start">
                    <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-widest">{addr.type}</Badge>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Edit2 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900">{addr.street}</div>
                    <div className="text-sm text-muted-foreground">{addr.city}, {addr.state} {addr.zip}</div>
                    <div className="text-sm text-muted-foreground">{addr.country}</div>
                  </div>
                </div>
              ))}
              {addresses.length === 0 && (
                <div className="col-span-full py-12 text-center border-2 border-dashed rounded-2xl">
                    <MapPin className="h-8 w-8 text-stone-300 mx-auto mb-2" />
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">No saved addresses found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
