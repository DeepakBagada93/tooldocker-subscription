'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { type Product } from '@/app/actions/products';

export function AddToCartButton({ product }: { product: Product }) {
    const { addItem } = useCart();
    const [quantity, setQuantity] = React.useState(1);

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            name: product.title,
            price: product.price,
            quantity: quantity,
            image: product.images?.[0] || 'https://picsum.photos/seed/fallback/800/600',
        });
    };

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-lg h-12 overflow-hidden bg-white dark:bg-black">
                <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 h-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    -
                </button>
                <span className="w-12 text-center font-bold flex items-center justify-center">
                    {quantity}
                </span>
                <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 h-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    +
                </button>
            </div>
            <Button
                onClick={handleAddToCart}
                size="lg"
                className="flex-1 h-12 text-lg font-bold"
                variant="industrial"
            >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
            </Button>
        </div>
    );
}
