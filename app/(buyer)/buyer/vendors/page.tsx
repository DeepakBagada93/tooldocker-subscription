'use client';

import * as React from 'react';
import { SAVED_VENDORS } from '@/lib/buyer-mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  ShieldCheck, 
  MessageSquare, 
  Store, 
  Trash2,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function SavedVendorsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tighter uppercase">Saved Vendors</h1>
        <p className="text-muted-foreground">Quick access to your trusted industrial suppliers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {SAVED_VENDORS.map((vendor) => (
          <div key={vendor.id} className="bg-white dark:bg-workshop-dark border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-16 h-16 relative rounded-xl overflow-hidden border bg-slate-50">
                  <Image src={vendor.logo} alt={vendor.name} fill className="object-cover" referrerPolicy="no-referrer" />
                </div>
                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{vendor.name}</h3>
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-primary">
                  <Star className="h-3 w-3 fill-primary" />
                  {vendor.rating} Rating
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider">
                  {vendor.category}
                </Badge>
                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider">
                  Verified
                </Badge>
              </div>

              <div className="pt-4 grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/vendor/${vendor.id}`}>
                    <Store className="mr-2 h-4 w-4" />
                    Store
                  </Link>
                </Button>
                <Button variant="industrial" size="sm">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {SAVED_VENDORS.length === 0 && (
        <div className="py-20 text-center space-y-6 bg-white dark:bg-workshop-dark border-2 border-dashed rounded-3xl">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
            <Heart className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black tracking-tighter uppercase">No Saved Vendors</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Save vendors to your favorites for quick access to their latest products and deals.
            </p>
          </div>
          <Button variant="industrial" asChild>
            <Link href="/vendors">Explore Vendors</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

import { Heart } from 'lucide-react';
