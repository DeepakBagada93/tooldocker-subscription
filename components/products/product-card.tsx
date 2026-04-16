'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/cart-context';
import { formatCurrency } from '@/lib/currency';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  vendor: string;
  isVerified?: boolean;
}

export function ProductCard({ id, name, price, image, category, rating, reviews, vendor, isVerified }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, name, price, quantity: 1, image });
  };

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_-35px_rgba(15,23,42,0.28)]">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-[#f3ede4]">
        <Image 
          src={image} 
          alt={name} 
          fill 
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge variant="secondary" className="border-none bg-white/90 text-slate-900 backdrop-blur">
            {category}
          </Badge>
          {isVerified && (
            <Badge className="bg-emerald-500 text-white border-none flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Verified
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">{vendor}</span>
          <div className="flex items-center text-amber-500">
            <Star className="h-3 w-3 fill-current" />
            <span className="text-xs font-bold ml-1">{rating}</span>
          </div>
        </div>

        <Link href={`/product/${id}`} className="flex-1">
          <h3 className="mb-4 line-clamp-2 text-lg font-semibold leading-tight tracking-[-0.03em] text-slate-900 transition-colors group-hover:text-primary">
            {name}
          </h3>
        </Link>

        <div className="mt-auto flex items-center justify-between border-t border-stone-200 pt-4">
          <div className="flex flex-col">
            <span className="text-xs text-stone-500">Starting at</span>
            <span className="text-2xl font-semibold tracking-[-0.03em] text-slate-900">{formatCurrency(price)}</span>
          </div>
          <Button 
            size="icon" 
            variant="industrial" 
            className="rounded-xl"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
