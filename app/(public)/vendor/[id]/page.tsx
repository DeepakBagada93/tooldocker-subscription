import { VENDORS, PRODUCTS } from '@/lib/mock-data';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShieldCheck, MapPin, Calendar, MessageSquare, Share2 } from 'lucide-react';
import { notFound } from 'next/navigation';
import Image from 'next/image';

export default async function VendorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vendor = VENDORS.find(v => v.id === id);

  if (!vendor) {
    notFound();
  }

  const vendorProducts = PRODUCTS.filter(p => p.vendorId === vendor.id);

  return (
    <div className="flex flex-col">
      {/* Banner */}
      <div className="h-48 lg:h-64 bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 industrial-grid" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-16 lg:-mt-24 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 items-end lg:items-start">
          <div className="w-32 h-32 lg:w-48 lg:h-48 relative rounded-3xl overflow-hidden border-4 border-white dark:border-workshop-dark shadow-2xl shrink-0 bg-white">
            <Image src={vendor.logo} alt={vendor.name} fill className="object-cover" referrerPolicy="no-referrer" />
          </div>
          
          <div className="flex-1 pb-4 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase text-white lg:text-foreground">
                  {vendor.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm font-bold">
                  <div className="flex items-center gap-1 text-primary">
                    <Star className="h-4 w-4 fill-primary" /> {vendor.rating} ({vendor.reviews} reviews)
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" /> Houston, TX
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-4 w-4" /> Joined 2021
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="industrial" className="h-12 px-8">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 py-12">
          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="p-6 bg-white dark:bg-workshop-dark border rounded-2xl space-y-6">
              <h3 className="font-bold uppercase tracking-tighter border-b pb-2">About Vendor</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {vendor.description}
              </p>
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase text-muted-foreground">Verification</span>
                  <Badge className="bg-emerald-500">Verified</Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase text-muted-foreground">Response Time</span>
                  <span className="font-bold">Under 2 Hours</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase text-muted-foreground">On-time Delivery</span>
                  <span className="font-bold">99.2%</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-workshop-dark border rounded-2xl space-y-4">
              <h3 className="font-bold uppercase tracking-tighter border-b pb-2">Store Categories</h3>
              <div className="space-y-2">
                {['All Products', 'Welding Gear', 'Safety Equipment', 'Power Tools'].map((cat) => (
                  <button key={cat} className="w-full text-left text-sm font-medium py-2 hover:text-primary transition-colors">
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black tracking-tighter uppercase">Featured Products</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-muted-foreground">Sort By:</span>
                <select className="bg-transparent text-sm font-bold outline-none cursor-pointer">
                  <option>Popularity</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {vendorProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {vendorProducts.length === 0 && (
              <div className="py-20 text-center border-2 border-dashed rounded-3xl">
                <p className="text-muted-foreground font-bold uppercase tracking-widest">No products listed yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
