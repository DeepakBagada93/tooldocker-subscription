'use client';

import { useCart } from '@/context/cart-context';
import { PRODUCTS, VENDORS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingCart, ArrowRight, ShieldCheck, Truck, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeItem, totalPrice, totalItems } = useCart();

  // Group items by vendor
  const groupedItems = items.reduce((acc, item) => {
    const product = PRODUCTS.find(p => p.id === item.id);
    const vendorId = product?.vendorId || 'unknown';
    const vendorName = product?.vendorName || 'Unknown Vendor';
    
    if (!acc[vendorId]) {
      acc[vendorId] = { name: vendorName, items: [] };
    }
    acc[vendorId].items.push(item);
    return acc;
  }, {} as Record<string, { name: string, items: any[] }>);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-8">
        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
          <ShoppingCart className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase">Your Cart is Empty</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Looks like you haven&apos;t added any industrial tools or machinery to your cart yet.
          </p>
        </div>
        <Button asChild size="lg" variant="industrial" className="h-14 px-10 text-lg">
          <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left: Cart Items */}
        <div className="flex-1 space-y-8">
          <div className="flex items-center justify-between border-b pb-4">
            <h1 className="text-4xl font-black tracking-tighter uppercase">Shopping Cart</h1>
            <span className="text-sm font-bold uppercase text-muted-foreground tracking-widest">
              {totalItems} Items
            </span>
          </div>

          <div className="space-y-12">
            {Object.entries(groupedItems).map(([vendorId, group]) => (
              <div key={vendorId} className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary">
                  <ShieldCheck className="h-4 w-4" />
                  Vendor: {group.name}
                </div>
                
                <div className="bg-white dark:bg-workshop-dark border rounded-2xl overflow-hidden shadow-sm">
                  {group.items.map((item, index) => (
                    <div 
                      key={item.id} 
                      className={cn(
                        "p-6 flex flex-col sm:flex-row items-center gap-6",
                        index !== group.items.length - 1 && "border-b"
                      )}
                    >
                      <div className="w-24 h-24 relative rounded-xl overflow-hidden border shrink-0 bg-slate-50">
                        <Image src={item.image} alt={item.name} fill className="object-cover" referrerPolicy="no-referrer" />
                      </div>
                      
                      <div className="flex-1 space-y-1 text-center sm:text-left">
                        <h3 className="font-bold text-lg leading-tight">{item.name}</h3>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">SKU: {item.id.toUpperCase()}</p>
                      </div>
                      
                      <div className="flex items-center gap-8">
                        <div className="flex items-center border rounded-lg h-10 overflow-hidden">
                          <button className="px-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">-</button>
                          <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                          <button className="px-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">+</button>
                        </div>
                        
                        <div className="text-right min-w-[100px]">
                          <div className="text-lg font-black tracking-tighter">${(item.price * item.quantity).toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">${item.price.toLocaleString()} / unit</div>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
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
          <div className="bg-white dark:bg-workshop-dark border rounded-3xl p-8 shadow-xl sticky top-24">
            <h2 className="text-2xl font-black tracking-tighter uppercase mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold">${totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping (Estimated)</span>
                <span className="font-bold text-emerald-500">FREE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-bold">$0.00</span>
              </div>
              <div className="h-px bg-slate-200 dark:bg-slate-800 my-4" />
              <div className="flex justify-between text-xl">
                <span className="font-black tracking-tighter uppercase">Total</span>
                <span className="font-black tracking-tighter text-primary">${totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <Button asChild className="w-full h-14 mt-8 text-lg font-bold uppercase tracking-tighter" variant="industrial">
              <Link href="/checkout">
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Secure Industrial Checkout
              </div>
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <Truck className="h-4 w-4 text-primary" />
                Global Logistics Support
              </div>
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
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

import { cn } from '@/lib/utils';
