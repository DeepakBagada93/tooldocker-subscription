'use client';

import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';

const categories = [
    { name: 'Power Tools', slug: 'power-tools', icon: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=300&q=80', count: 245, gradient: 'from-[#c7112c] to-[#a50e23]' },
    { name: 'Hand Tools', slug: 'hand-tools', icon: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80', count: 189, gradient: 'from-[#1a1a2e] to-[#16213e]' },
    { name: 'Safety Gear', slug: 'safety-equipment', icon: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&q=80', count: 156, gradient: 'from-[#0f4c3a] to-[#0a3628]' },
    { name: 'Welding', slug: 'welding', icon: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&q=80', count: 98, gradient: 'from-[#c7112c] to-[#e85d75]' },
    { name: 'Construction', slug: 'construction-equipment', icon: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80', count: 312, gradient: 'from-[#2d1b00] to-[#4a2c00]' },
    { name: 'Electrical', slug: 'electrical', icon: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&q=80', count: 203, gradient: 'from-[#1e3a5f] to-[#152a45]' },
    { name: 'Machinery', slug: 'machinery', icon: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80', count: 87, gradient: 'from-[#3d0c02] to-[#5c1a10]' },
    { name: 'Hardware', slug: 'hardware', icon: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=300&q=80', count: 421, gradient: 'from-[#2c2c2c] to-[#1a1a1a]' },
];

export function CategoryScroll() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    };

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const amount = direction === 'left' ? -300 : 300;
        scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
        setTimeout(checkScroll, 300);
    };

    return (
        <section className="bg-white py-16">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-6xl">
                    {/* Header */}
                    <div className="mb-10 flex items-end justify-between">
                        <div>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#c7112c]"
                            >
                                Browse by category
                            </motion.p>
                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.05 }}
                                className="text-2xl font-bold tracking-tight text-black sm:text-3xl"
                            >
                                Explore our range
                            </motion.h2>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => scroll('left')}
                                disabled={!canScrollLeft}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-[#c7112c] hover:text-white hover:border-[#c7112c] disabled:opacity-30 disabled:cursor-not-allowed"
                                aria-label="Scroll left"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                disabled={!canScrollRight}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-[#c7112c] hover:text-white hover:border-[#c7112c] disabled:opacity-30 disabled:cursor-not-allowed"
                                aria-label="Scroll right"
                            >
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable cards */}
                    <div
                        ref={scrollRef}
                        onScroll={checkScroll}
                        className="flex gap-4 overflow-x-auto pb-4 scroll-smooth"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {categories.map((cat, idx) => (
                            <motion.div
                                key={cat.slug}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.06 }}
                                className="group flex-shrink-0 w-[220px]"
                            >
                                <Link
                                    href={`/category/${cat.slug}`}
                                    className="block"
                                >
                                    <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-[#c7112c]/10 hover:-translate-y-1">
                                        {/* Image */}
                                        <div className="relative h-36 overflow-hidden">
                                            <Image
                                                src={cat.icon}
                                                alt={cat.name}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                referrerPolicy="no-referrer"
                                            />
                                            {/* Gradient overlay */}
                                            <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient} opacity-60 group-hover:opacity-80 transition-opacity duration-300`} />
                                            
                                            {/* Arrow icon */}
                                            <div className="absolute top-3 right-3 h-7 w-7 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                                                <ArrowUpRight className="h-3.5 w-3.5 text-white" />
                                            </div>

                                            {/* Product count */}
                                            <div className="absolute bottom-3 left-3">
                                                <span className="rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-semibold text-slate-900">
                                                    {cat.count} products
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-4">
                                            <h3 className="text-sm font-semibold text-slate-900 group-hover:text-[#c7112c] transition-colors">
                                                {cat.name}
                                            </h3>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
