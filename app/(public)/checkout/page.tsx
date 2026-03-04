'use client';

import * as React from 'react';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, Truck, CreditCard, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 'shipping', name: 'Shipping', icon: Truck },
  { id: 'payment', name: 'Payment', icon: CreditCard },
  { id: 'review', name: 'Review', icon: CheckCircle2 },
];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const { items, totalPrice } = useCart();

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-black uppercase tracking-tighter">No items to checkout</h1>
        <Button asChild className="mt-8" variant="industrial">
          <Link href="/">Back to Shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Stepper */}
        <div className="flex items-center justify-between mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index <= currentStep;
            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                <div 
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500",
                    isActive 
                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                      : "bg-white dark:bg-workshop-dark border-slate-200 dark:border-slate-800 text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className={cn(
                  "text-xs font-bold uppercase tracking-widest",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            {currentStep === 0 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-3xl font-black tracking-tighter uppercase">Shipping Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">First Name</label>
                    <Input placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Last Name</label>
                    <Input placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Company Name (Optional)</label>
                  <Input placeholder="Industrial Corp" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Address</label>
                  <Input placeholder="123 Industrial Way" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">City</label>
                    <Input placeholder="Houston" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">State</label>
                    <Input placeholder="TX" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">ZIP Code</label>
                    <Input placeholder="77001" />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-3xl font-black tracking-tighter uppercase">Payment Method</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-6 border-2 border-primary bg-primary/5 rounded-2xl flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-slate-800 rounded flex items-center justify-center text-white text-[10px] font-bold">VISA</div>
                      <div>
                        <div className="font-bold">Credit / Debit Card</div>
                        <div className="text-xs text-muted-foreground">Ending in 4242</div>
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                    </div>
                  </div>
                  <div className="p-6 border rounded-2xl flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-[10px] font-bold italic">PayPal</div>
                      <div>
                        <div className="font-bold">PayPal</div>
                        <div className="text-xs text-muted-foreground">Pay with your PayPal account</div>
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-full border" />
                  </div>
                </div>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Card Number</label>
                    <Input placeholder="**** **** **** 4242" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Expiry Date</label>
                      <Input placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">CVV</label>
                      <Input placeholder="***" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-3xl font-black tracking-tighter uppercase">Review & Confirm</h2>
                <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 border space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">Order Details</h3>
                    <Button variant="ghost" size="sm" onClick={() => setCurrentStep(0)}>Edit</Button>
                  </div>
                  <div className="space-y-2">
                    <div className="font-bold">John Doe</div>
                    <div className="text-sm text-muted-foreground">123 Industrial Way, Houston, TX 77001</div>
                    <div className="text-sm text-muted-foreground">john@example.com</div>
                  </div>
                  <div className="h-px bg-slate-200 dark:bg-slate-800" />
                  <div className="space-y-4">
                    {items.map(item => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex gap-4 items-center">
                          <div className="w-12 h-12 relative rounded border overflow-hidden bg-white">
                            <Image src={item.image} alt={item.name} fill className="object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <div className="text-sm font-bold">{item.name}</div>
                            <div className="text-xs text-muted-foreground">Qty: {item.quantity}</div>
                          </div>
                        </div>
                        <div className="font-bold">${(item.price * item.quantity).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-8 border-t">
              <Button 
                variant="ghost" 
                onClick={prevStep} 
                disabled={currentStep === 0}
                className="font-bold uppercase tracking-widest text-xs"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button 
                variant="industrial" 
                onClick={nextStep}
                className="h-12 px-8 font-bold uppercase tracking-tighter"
              >
                {currentStep === STEPS.length - 1 ? 'Place Order' : 'Continue'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Summary Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white dark:bg-workshop-dark border rounded-3xl p-8 shadow-xl">
              <h3 className="font-bold uppercase tracking-tighter text-xl mb-6">Summary</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-bold">${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
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
              
              <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">
                  <ShieldCheck className="h-4 w-4 inline-block mr-1 text-primary" />
                  Industrial Grade Security
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

import Image from 'next/image';
