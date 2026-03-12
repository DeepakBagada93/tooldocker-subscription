'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/cart-context';

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
    });
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-35px_rgba(15,23,42,0.28)]"
    >
      <div className="relative aspect-square overflow-hidden bg-[#f4efe7]">
        <Image
          src={product.images?.[0] || 'https://picsum.photos/seed/fallback/800/600'}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        {product.category_id && (
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-slate-700">
              Category ID: {product.category_id}
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col space-y-3 p-5">
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span className="font-medium">{product.stores?.store_name || 'Tooldocker Vendor'}</span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span>5.0</span>
          </div>
        </div>

        <h3 className="line-clamp-2 text-base font-semibold tracking-[-0.02em] text-slate-900 transition-colors group-hover:text-primary">
          {product.title}
        </h3>

        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="text-xl font-semibold tracking-[-0.03em] text-slate-900">
            ${product.price.toLocaleString()}
          </div>
          <Button
            size="icon"
            variant="secondary"
            className="h-9 w-9 rounded-full bg-slate-900 text-white hover:bg-slate-800"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
