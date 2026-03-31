import { getProductById } from '@/app/actions/products';
import { VENDORS } from '@/lib/mock-data';
import { ImageGallery } from '@/components/product/image-gallery';
import { AddToCartButton } from '@/components/product/add-to-cart-button';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShieldCheck, Truck, ShoppingCart, Heart, Share2 } from 'lucide-react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  // Currently mocking vendor info, but eventually this would join from DB 'stores'
  const vendor = VENDORS.find(v => v.id === product.store_id) || VENDORS[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-12">
        {/* Breadcrumbs */}
        <div className="text-sm text-muted-foreground">
          Home / {product.category_name || 'Category'} / <span className="text-foreground font-medium">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Gallery */}
          <ImageGallery images={product.images} />

          {/* Right: Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="px-3 py-1">{product.category_name || 'Marketplace Product'}</Badge>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="rounded-full"><Heart className="h-5 w-5" /></Button>
                  <Button variant="ghost" size="icon" className="rounded-full"><Share2 className="h-5 w-5" /></Button>
                </div>
              </div>

              <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase leading-none">
                {product.title}
              </h1>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < 4 ? "fill-primary text-primary" : "text-slate-300" // using static 4 for now
                      )}
                    />
                  ))}
                  <span className="ml-2 text-sm font-bold">4.8 (124 reviews)</span>
                </div>
                <div className="h-4 w-px bg-slate-200" />
                <Link href={`/vendor/${product.store_id}`} className="text-sm font-bold text-primary hover:underline">
                  By {product.stores?.store_name || vendor?.name}
                </Link>
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border space-y-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black tracking-tighter">${product.price.toLocaleString()}</span>
                <span className="text-muted-foreground line-through text-lg">${(product.price * 1.2).toLocaleString()}</span>
                <Badge className="bg-emerald-500 ml-2">SAVE 20%</Badge>
              </div>

              <div className="space-y-4">
                <AddToCartButton product={product} />

                <Button variant="outline" className="w-full h-12 font-bold border-2">
                  Request Bulk Quote (RFQ)
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                  <Truck className="h-4 w-4 text-primary" />
                  Free Shipping
                </div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  2Y Warranty
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="font-bold uppercase tracking-tighter text-lg">Description</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div>
                <h3 className="font-bold uppercase tracking-tighter text-lg mb-4">Inventory & Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border">
                    <span className="text-xs font-bold uppercase text-muted-foreground">In Stock</span>
                    <span className="text-sm font-bold">{product.inventory_count} Units</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vendor Info Section */}
        <section className="bg-white dark:bg-workshop-dark border rounded-3xl p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
            <div className="w-24 h-24 relative rounded-2xl overflow-hidden border-4 border-slate-100 shrink-0">
              <Image src={vendor?.logo || ''} alt={vendor?.name || ''} fill className="object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="flex-1 text-center lg:text-left space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <h2 className="text-3xl font-black tracking-tighter uppercase">{vendor?.name}</h2>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    <ShieldCheck className="h-3 w-3 mr-1" /> Verified Vendor
                  </Badge>
                  <div className="flex items-center gap-1 text-sm font-bold">
                    <Star className="h-4 w-4 fill-primary text-primary" /> {vendor?.rating}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground max-w-2xl">{vendor?.description}</p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Button variant="outline" size="sm">Visit Storefront</Button>
                <Button variant="ghost" size="sm">Contact Supplier</Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 shrink-0">
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl text-center">
                <div className="text-2xl font-black tracking-tighter">98%</div>
                <div className="text-[10px] font-bold uppercase text-muted-foreground">Response Rate</div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl text-center">
                <div className="text-2xl font-black tracking-tighter">24h</div>
                <div className="text-[10px] font-bold uppercase text-muted-foreground">Avg. Shipping</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
