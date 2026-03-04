'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

export function CategoryAnimatedGrid({ categories }: { categories: any[] }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.slice(0, 4).map((category, index) => (
                <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    whileHover={{ y: -5 }}
                >
                    <Link
                        href={`/products?category=${category.slug}`}
                        className="group block rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-2xl transition-all duration-300 h-full flex flex-col"
                    >
                        <div className="w-full relative overflow-hidden bg-slate-100 dark:bg-slate-800 h-[200px]">
                            {category.image ? (
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    className="object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-in-out"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                                    <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">{category.name[0]}</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-multiply dark:mix-blend-overlay" />
                        </div>
                        <div className="p-6 bg-white dark:bg-slate-900 relative flex-1 flex flex-col">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <h3 className="font-bold text-lg mb-1 text-slate-900 dark:text-white group-hover:text-primary transition-colors tracking-tight">{category.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-auto">{category.description || 'Industrial supplies and equipment'}</p>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}
