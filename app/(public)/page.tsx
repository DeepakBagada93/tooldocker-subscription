import { Hero } from '@/components/home/hero';
import { FeaturedCategories } from '@/components/home/featured-categories';
import { FeaturedProducts } from '@/components/home/featured-products';
import { Button } from '@/components/ui/button';
import { Hammer, ShieldCheck, Truck, Clock } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Hero />
      
      {/* Trust Bar */}
      <section className="bg-white dark:bg-workshop-dark border-b py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center space-x-4">
              <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="font-bold text-sm">Verified Vendors</div>
                <div className="text-xs text-muted-foreground">Strict quality control</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="font-bold text-sm">Industrial Shipping</div>
                <div className="text-xs text-muted-foreground">Heavy-duty logistics</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="font-bold text-sm">24h Response</div>
                <div className="text-xs text-muted-foreground">Fast RFQ turnaround</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl">
                <Hammer className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="font-bold text-sm">Expert Support</div>
                <div className="text-xs text-muted-foreground">Technical assistance</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturedCategories />
      <FeaturedProducts />

      {/* CTA Section */}
      <section className="py-20 bg-workshop-dark text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 industrial-grid" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase">
              Ready to Scale Your <br />
              <span className="text-primary">Industrial Business?</span>
            </h2>
            <p className="text-xl text-slate-400">
              Join thousands of industrial suppliers and procurement professionals on the world&apos;s fastest-growing marketplace.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="h-14 px-10 text-lg" variant="industrial">
                Become a Vendor
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-slate-700 text-white hover:bg-slate-800">
                Open a Business Account
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
