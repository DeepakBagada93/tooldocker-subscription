'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  MapPin, 
  FileText,
  Clock,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function BuyerOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Order Detail</div>
          <h1 className="text-2xl font-black tracking-tighter uppercase">#{id || 'Unknown'}</h1>
        </div>
      </div>

      <div className="py-20 text-center border-2 border-dashed rounded-3xl bg-slate-50/50">
        <Package className="h-10 w-10 text-stone-300 mx-auto mb-4" />
        <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Order details not available or order not found.</p>
        <Button variant="industrial" className="mt-6" asChild>
            <Link href="/buyer/history">Back to History</Link>
        </Button>
      </div>
    </div>
  );
}
