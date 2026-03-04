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
      className="group bg-white dark:bg-workshop-dark border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <Image
          src={product.images?.[0] || 'https://picsum.photos/seed/fallback/800/600'}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        {product.category_id && (
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-white/90 dark:bg-black/90 backdrop-blur-sm">
              Category ID: {product.category_id}
            </Badge>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{product.stores?.store_name || 'Tooldocker Vendor'}</span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span>5.0</span>
          </div>
        </div>

        <h3 className="font-bold text-sm line-clamp-2 group-hover:text-primary transition-colors">
          {product.title}
        </h3>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="text-lg font-black tracking-tight">
            ${product.price.toLocaleString()}
          </div>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
