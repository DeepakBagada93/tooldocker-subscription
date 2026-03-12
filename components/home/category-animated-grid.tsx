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
                        className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-35px_rgba(15,23,42,0.28)]"
                    >
                        <div className="relative h-[220px] w-full overflow-hidden bg-[#f3ede4]">
                            {category.image ? (
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#efe6d8] to-[#d8c7b0]">
                                    <span className="text-xl font-semibold uppercase tracking-[0.28em] text-stone-500">{category.name[0]}</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(15,23,42,0.08)_100%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </div>
                        <div className="relative flex flex-1 flex-col p-7">
                            <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-400">Category</div>
                            <h3 className="mb-2 text-xl font-semibold tracking-[-0.03em] text-slate-900 transition-colors group-hover:text-primary">{category.name}</h3>
                            <p className="mt-auto line-clamp-2 text-sm leading-6 text-stone-500">{category.description || 'Industrial supplies and equipment'}</p>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}
