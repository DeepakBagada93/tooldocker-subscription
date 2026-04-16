import { getProductById } from '@/app/actions/products';
import { ImageGallery } from '@/components/product/image-gallery';
import { AddToCartButton } from '@/components/product/add-to-cart-button';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShieldCheck, Truck, Heart, Share2 } from 'lucide-react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/currency';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

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
                        i < 4 ? "fill-primary text-primary" : "text-slate-300"
                      )}
                    />
                  ))}
                  <span className="ml-2 text-sm font-bold">4.8 (124 reviews)</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border space-y-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black tracking-tighter">{formatCurrency(product.price)}</span>
                <span className="text-muted-foreground line-through text-lg">{formatCurrency(product.price * 1.2)}</span>
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
      </div>
    </div>
  );
}
