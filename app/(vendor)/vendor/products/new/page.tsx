'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Upload, 
  Plus, 
  X, 
  Info, 
  Package, 
  Tag, 
  DollarSign, 
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function NewProductPage() {
  const [images, setImages] = React.useState<string[]>([]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/vendor/products">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Add New Product</h1>
          <p className="text-muted-foreground">List a new industrial tool or piece of machinery.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Info */}
          <div className="bg-white dark:bg-workshop-dark border rounded-3xl p-8 space-y-6 shadow-sm">
            <h2 className="text-xl font-black tracking-tighter uppercase border-b pb-4">Basic Information</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Product Name</label>
                <Input placeholder="e.g. Industrial Hydraulic Press" className="h-12" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</label>
                  <select className="w-full h-12 px-4 rounded-xl border bg-white dark:bg-black outline-none focus:ring-2 focus:ring-primary/20 text-sm">
                    <option>Select Category</option>
                    <option>Heavy Machinery</option>
                    <option>Power Tools</option>
                    <option>Welding</option>
                    <option>Safety Gear</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">SKU / Model Number</label>
                  <Input placeholder="e.g. HP-500-PRO" className="h-12" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</label>
                <textarea 
                  className="w-full h-40 p-4 rounded-xl border bg-white dark:bg-black outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                  placeholder="Describe the technical specifications and features..."
                />
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white dark:bg-workshop-dark border rounded-3xl p-8 space-y-6 shadow-sm">
            <h2 className="text-xl font-black tracking-tighter uppercase border-b pb-4">Pricing & Inventory</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Base Price ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="number" placeholder="0.00" className="h-12 pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Stock Quantity</label>
                <div className="relative">
                  <Layers className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="number" placeholder="0" className="h-12 pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Minimum Order Quantity (MOQ)</label>
                <Input type="number" defaultValue={1} className="h-12" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Discount Price ($)</label>
                <Input type="number" placeholder="Optional" className="h-12" />
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="bg-white dark:bg-workshop-dark border rounded-3xl p-8 space-y-6 shadow-sm">
            <h2 className="text-xl font-black tracking-tighter uppercase border-b pb-4">Product Media</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="aspect-square border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary">
                <Upload className="h-6 w-6" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Upload</span>
              </div>
              {/* Placeholder for uploaded images */}
              <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center relative group">
                <ImageIcon className="h-8 w-8 text-slate-300" />
                <button className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
              Add up to 8 high-resolution images. First image will be the primary thumbnail.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-workshop-dark border rounded-3xl p-8 shadow-sm space-y-6 sticky top-8">
            <h2 className="text-xl font-black tracking-tighter uppercase border-b pb-4">Publish</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border">
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-widest">Status</div>
                  <div className="text-sm font-bold text-emerald-500">Active</div>
                </div>
                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary cursor-pointer">
                  <span className="inline-block h-4 w-4 translate-x-6 rounded-full bg-white transition" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border">
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-widest">Visibility</div>
                  <div className="text-sm font-bold">Public</div>
                </div>
                <Badge className="bg-primary text-[8px] font-bold uppercase tracking-widest">Live</Badge>
              </div>
            </div>
            <div className="pt-6 space-y-3">
              <Button variant="industrial" className="w-full h-14 text-lg font-bold uppercase tracking-tighter">
                Publish Product
              </Button>
              <Button variant="outline" className="w-full h-12 font-bold uppercase tracking-widest">
                Save as Draft
              </Button>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl flex gap-3">
              <Info className="h-5 w-5 text-amber-500 shrink-0" />
              <p className="text-[10px] text-amber-700 dark:text-amber-500 font-medium">
                New products are reviewed by our quality control team before appearing in search results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
