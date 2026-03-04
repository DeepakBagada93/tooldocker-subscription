'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

import { useCart } from '@/context/cart-context';

export function ProductCard({ id, name, price, image, category, rating, reviews, vendor, isVerified }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, name, price, quantity: 1, image });
  };

  return (
    <div className="group bg-white dark:bg-workshop-dark rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-900">
        <Image 
          src={image} 
          alt={name} 
          fill 
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge variant="secondary" className="bg-white/90 dark:bg-slate-800/90 backdrop-blur text-slate-900 dark:text-white border-none">
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
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{vendor}</span>
          <div className="flex items-center text-amber-500">
            <Star className="h-3 w-3 fill-current" />
            <span className="text-xs font-bold ml-1">{rating}</span>
          </div>
        </div>

        <Link href={`/product/${id}`} className="flex-1">
          <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-4">
            {name}
          </h3>
        </Link>

        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Starting at</span>
            <span className="text-2xl font-black tracking-tighter">${price.toLocaleString()}</span>
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
