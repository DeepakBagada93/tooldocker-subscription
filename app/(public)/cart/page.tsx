'use client';

import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingCart, ArrowRight, ShieldCheck, Truck, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function CartPage() {
  const { items, removeItem, totalPrice, totalItems } = useCart();

  // Group items by vendor/store
  const groupedItems = items.reduce((acc, item) => {
    const vendorId = item.store_id || 'unknown';
    const vendorName = item.store_name || 'Verified Vendor';
    
    if (!acc[vendorId]) {
      acc[vendorId] = { name: vendorName, items: [] };
    }
    acc[vendorId].items.push(item);
    return acc;
  }, {} as Record<string, { name: string, items: any[] }>);

  if (items.length === 0) {
    return (
      <div className="container mx-auto space-y-8 px-4 py-20 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#f3ede4]">
          <ShoppingCart className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-[-0.05em] text-slate-900 lg:text-6xl">Your cart is empty</h1>
          <p className="mx-auto max-w-md text-stone-600">
            Looks like you haven&apos;t added any industrial tools or machinery to your cart yet.
          </p>
        </div>
        <Button asChild size="lg" variant="industrial" className="h-14 rounded-full px-10 text-lg">
          <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col gap-12 lg:flex-row">
        {/* Left: Cart Items */}
        <div className="flex-1 space-y-8">
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <h1 className="text-4xl font-semibold tracking-[-0.05em] text-slate-900">Shopping cart</h1>
            <span className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
              {totalItems} Items
            </span>
          </div>

          <div className="space-y-12">
            {Object.entries(groupedItems).map(([vendorId, group]) => (
              <div key={vendorId} className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                  <ShieldCheck className="h-4 w-4" />
                  Vendor: {group.name}
                </div>
                
                <div className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm">
                  {group.items.map((item, index) => (
                    <div 
                      key={item.id} 
                      className={cn(
                        "p-6 flex flex-col sm:flex-row items-center gap-6",
                        index !== group.items.length - 1 && "border-b"
                      )}
                    >
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-[#f3ede4]">
                        <Image src={item.image || '/images/tooldocker.png'} alt={item.name} fill className="object-cover" referrerPolicy="no-referrer" />
                      </div>
                      
                      <div className="flex-1 space-y-1 text-center sm:text-left">
                        <h3 className="text-lg font-semibold leading-tight text-slate-900">{item.name}</h3>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">SKU: {item.id.split('-')[0].toUpperCase()}</p>
                      </div>
                      
                      <div className="flex items-center gap-8">
                        <div className="flex h-10 items-center overflow-hidden rounded-lg border border-stone-200 bg-[#fcfaf7]">
                          <span className="w-12 text-center font-bold text-sm">Qty: {item.quantity}</span>
                        </div>
                        
                        <div className="text-right min-w-[100px]">
                          <div className="text-lg font-semibold tracking-[-0.03em] text-slate-900">${(item.price * item.quantity).toLocaleString()}</div>
                          <div className="text-xs text-stone-500">${item.price.toLocaleString()} / unit</div>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Summary */}
        <aside className="w-full lg:w-[400px] space-y-6">
          <div className="sticky top-24 rounded-[2rem] border border-stone-200 bg-white p-8 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.28)]">
            <h2 className="mb-6 text-2xl font-semibold tracking-[-0.04em] text-slate-900">Order summary</h2>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">Subtotal</span>
                <span className="font-bold">${totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Shipping (Estimated)</span>
                <span className="font-bold text-emerald-500">FREE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Tax</span>
                <span className="font-bold">$0.00</span>
              </div>
              <div className="my-4 h-px bg-stone-200" />
              <div className="flex justify-between text-xl">
                <span className="font-semibold tracking-[-0.03em] text-slate-900">Total</span>
                <span className="font-semibold tracking-[-0.03em] text-primary">${totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <Button asChild className="mt-8 h-14 w-full rounded-full text-lg font-medium" variant="industrial">
              <Link href="/checkout">
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Secure Industrial Checkout
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                <Truck className="h-4 w-4 text-primary" />
                Global Logistics Support
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                <Clock className="h-4 w-4 text-primary" />
                24/7 Support Available
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
