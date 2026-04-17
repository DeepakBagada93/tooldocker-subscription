'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/cart-context';
import { formatCurrency } from '@/lib/currency';

import { type Product } from '@/app/actions/products';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.title,
      price: product.price,
      quantity: 1,
      image: product.images?.[0] || 'https://picsum.photos/seed/fallback/800/600', // fallback
      store_id: product.store_id,
      store_name: product.stores?.store_name
    });
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-stone-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-35px_rgba(15,23,42,0.28)] sm:rounded-[1.75rem]"
    >
      <div className="relative aspect-square overflow-hidden bg-[#f4efe7]">
        <Image
          src={product.images?.[0] || 'https://picsum.photos/seed/fallback/800/600'}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        {product.category_name && (
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-white/90 px-2 py-0.5 text-[10px] text-slate-700 backdrop-blur-sm sm:text-xs">
              {product.category_name}
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col space-y-2 p-3 sm:space-y-3 sm:p-5">
        <div className="flex items-center justify-between gap-2 text-[11px] text-stone-500 sm:text-xs">
          <span className="truncate font-medium">{product.stores?.store_name || 'Tooldocker Vendor'}</span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span>5.0</span>
          </div>
        </div>

        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold tracking-[-0.02em] text-slate-900 transition-colors group-hover:text-primary sm:min-h-[3rem] sm:text-base">
          {product.title}
        </h3>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2 sm:pt-4">
          <div className="text-lg font-semibold tracking-[-0.03em] text-slate-900 sm:text-xl">
            {formatCurrency(product.price)}
          </div>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full bg-slate-900 text-white hover:bg-slate-800 sm:h-9 sm:w-9"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
