'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Heart,
  Store
} from 'lucide-react';
import Link from 'next/link';

export default function SavedVendorsPage() {
  const savedVendors: any[] = [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tighter uppercase">Saved Vendors</h1>
        <p className="text-muted-foreground">Quick access to your trusted industrial suppliers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Real data would be mapped here */}
      </div>

      {savedVendors.length === 0 && (
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
