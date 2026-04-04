'use client';

import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function CTASection() {
    return (
        <section className="relative overflow-hidden bg-[#f6f1e8] py-24 text-slate-900">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(199,98,44,0.12),transparent_26%)]" />
            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="mx-auto max-w-4xl rounded-[2.5rem] border border-white/70 bg-white/80 px-6 py-14 text-center shadow-[0_30px_80px_-45px_rgba(15,23,42,0.32)] backdrop-blur-sm sm:px-10"
                >
                    <div className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">Built for scale</div>
                    <h2 className="text-3xl font-semibold leading-[1.05] tracking-[-0.05em] sm:text-4xl lg:text-5xl xl:text-6xl">
                        Your one-stop shop for
                        <br />
                        tools, machinery, and project supplies.
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg leading-8 text-stone-600 sm:text-xl">
                        Tooldocker brings together quality products, category-driven discovery, India-focused checkout, and smart search in one clear platform for buyers.
                    </p>
                    <div className="flex w-full flex-col justify-center gap-4 px-4 pt-6 sm:w-auto sm:flex-row">
                        <Button asChild size="lg" className="h-14 w-full rounded-full bg-slate-900 px-8 text-base font-medium text-white hover:bg-slate-800 sm:w-auto sm:px-12 sm:text-lg">
                            <Link href="/search">
                            Explore products
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="h-14 w-full rounded-full border-stone-300 bg-white px-8 text-base font-medium text-slate-900 hover:bg-stone-100 sm:w-auto sm:px-12 sm:text-lg">
                            <Link href="/search">
                            Browse categories
                            </Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
