'use client';

import * as React from 'react';
import { COMMISSION_TIERS } from '@/lib/admin-mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Search,
  DollarSign,
  Edit2,
  Trash2,
  ChevronRight,
  Settings2,
  MoreVertical,
  TrendingUp,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CommissionConfigPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Commission Configuration</h1>
          <p className="text-muted-foreground">Manage platform fee structures and vendor commission tiers.</p>
        </div>
        <Button variant="industrial">
          <Plus className="mr-2 h-4 w-4" />
          Add New Tier
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tiers List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-workshop-dark border rounded-3xl p-8 shadow-sm space-y-8">
            <h2 className="text-xl font-black tracking-tighter uppercase border-b pb-4">Active Commission Tiers</h2>
            <div className="space-y-4">
              {COMMISSION_TIERS.map((tier) => (
                <div key={tier.id} className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border hover:border-primary transition-all group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xl font-black text-primary">{tier.rate}%</span>
                      </div>
                      <div className="space-y-1">
                        <div className="text-lg font-bold">{tier.name} Tier</div>
                        <div className="text-xs text-muted-foreground uppercase font-bold tracking-widest">
                          Volume: ${tier.minVolume.toLocaleString('en-US')} - ${tier.maxVolume.toLocaleString('en-US')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm"><Edit2 className="h-4 w-4 mr-2" /> Edit</Button>
                      <Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Settings */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-workshop-dark border rounded-3xl p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-black tracking-tighter uppercase border-b pb-4">Global Fees</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Platform Service Fee ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type="number" defaultValue={3.50} className="w-full h-12 pl-10 rounded-xl border bg-white dark:bg-black outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Payout Processing Fee (%)</label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type="number" defaultValue={1.5} className="w-full h-12 pl-10 rounded-xl border bg-white dark:bg-black outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
                </div>
              </div>
              <Button variant="industrial" className="w-full h-12 font-bold uppercase tracking-tighter">
                Update Global Fees
              </Button>
            </div>
          </div>

          <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-tighter">
              <Info className="h-5 w-5" />
              Fee Logic
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Commission is calculated on the gross order value before taxes and shipping. Platform fees are applied per transaction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
