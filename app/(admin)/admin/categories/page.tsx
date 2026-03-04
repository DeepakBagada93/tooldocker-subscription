'use client';

import * as React from 'react';
import { CATEGORIES_LIST } from '@/lib/admin-mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  LayoutDashboard, 
  Edit2, 
  Trash2, 
  ChevronRight,
  Settings2,
  MoreVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CategoryManagementPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Category Management</h1>
          <p className="text-muted-foreground">Organize and manage the marketplace taxonomy.</p>
        </div>
        <Button variant="industrial">
          <Plus className="mr-2 h-4 w-4" />
          Add New Category
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Search categories..." 
          className="w-full pl-10 h-10 rounded-lg border bg-white dark:bg-workshop-dark outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {CATEGORIES_LIST.map((cat) => (
          <div key={cat.id} className="bg-white dark:bg-workshop-dark border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <LayoutDashboard className="h-6 w-6 text-primary" />
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8"><Edit2 className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{cat.name}</h3>
              <div className="text-xs text-muted-foreground font-mono">/{cat.slug}</div>
            </div>

            <div className="mt-6 pt-6 border-t flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Products</div>
                <div className="text-sm font-black tracking-tighter">{cat.productCount.toLocaleString()}</div>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                {cat.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
