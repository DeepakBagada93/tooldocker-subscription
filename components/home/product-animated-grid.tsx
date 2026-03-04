'use client';

import { motion } from 'motion/react';
import { ProductCard } from '@/components/product/product-card';

export function ProductAnimatedGrid({ products }: { products: any[] }) {
    if (products.length === 0) {
        return (
            <div className="text-muted-foreground col-span-full py-10 text-center bg-slate-50 rounded-xl border border-dashed">
                No products found. Start adding inventory!
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
                <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    whileHover={{ y: -5 }}
                >
                    <ProductCard product={product} />
                </motion.div>
            ))}
        </div>
    );
}
