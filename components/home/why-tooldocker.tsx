'use client';

import { motion } from 'motion/react';
import { ClipboardList, Search, ShieldCheck, Sparkles } from 'lucide-react';

const features = [
    {
        icon: ShieldCheck,
        title: 'Quality assured products',
        description: 'Every product is verified for quality so buyers get reliable tools, machinery, and supplies for their projects.'
    },
    {
        icon: Search,
        title: 'Built for product discovery',
        description: 'Category browsing, search, and filters are organized for contractors, builders, and industrial procurement teams that buy with intent.'
    },
    {
        icon: ClipboardList,
        title: 'Bulk ordering made easy',
        description: 'Order in bulk with clear pricing, stock availability, and GST invoicing designed for business buyers.'
    },
    {
        icon: Sparkles,
        title: 'Smart search that works',
        description: 'Find products faster with intelligent search that understands industrial terms and categories.'
    }
];

const milestones = [
    { top: '20%', left: '16%', label: 'Search products' },
    { top: '42%', left: '48%', label: 'Compare categories' },
    { top: '66%', left: '28%', label: 'Checkout faster' },
    { top: '62%', left: '74%', label: 'Track orders' }
];

export function WhyTooldocker() {
    return (
        <section className="relative overflow-hidden bg-white py-28">
            <div className="container mx-auto px-4 relative z-10">
                <div className="mx-auto mb-16 max-w-3xl space-y-4 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl font-semibold tracking-[-0.04em] text-slate-900 md:text-5xl"
                    >
                        Why Tooldocker is the best place to buy industrial products.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mx-auto max-w-2xl text-lg leading-8 text-stone-600"
                    >
                        The blueprint is simple: quality products, clear categories, fast search, and a buying experience built for contractors, builders, and procurement teams.
                    </motion.p>
                </div>

                <div className="grid items-center gap-10 lg:grid-cols-2">
                    <div className="grid gap-5 sm:grid-cols-2">
                        {features.map((feature, idx) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="rounded-[2rem] border border-stone-200 bg-[#fcfaf7] p-7 transition-shadow hover:shadow-md"
                                >
                                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-sm">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="mb-3 text-xl font-semibold tracking-[-0.03em] text-slate-900">{feature.title}</h3>
                                    <p className="text-sm leading-7 text-stone-600">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[2.5rem] border border-stone-200 bg-[linear-gradient(180deg,#faf7f1_0%,#f2ece2_100%)] p-8 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.35)] md:aspect-video lg:aspect-square"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(199,98,44,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.07),transparent_30%)]" />

                        <svg viewBox="0 0 100 100" className="absolute inset-0 z-0 h-full w-full p-8 text-stone-300" preserveAspectRatio="none">
                            <path d="M14 26 H86" stroke="currentColor" strokeWidth="0.3" strokeDasharray="1.5 2.5" fill="none" opacity="0.6" />
                            <path d="M14 50 H86" stroke="currentColor" strokeWidth="0.3" strokeDasharray="1.5 2.5" fill="none" opacity="0.6" />
                            <path d="M14 74 H86" stroke="currentColor" strokeWidth="0.3" strokeDasharray="1.5 2.5" fill="none" opacity="0.6" />
                            <path d="M20 20 V80" stroke="currentColor" strokeWidth="0.3" strokeDasharray="1.5 2.5" fill="none" opacity="0.35" />
                            <path d="M50 20 V80" stroke="currentColor" strokeWidth="0.3" strokeDasharray="1.5 2.5" fill="none" opacity="0.35" />
                            <path d="M80 20 V80" stroke="currentColor" strokeWidth="0.3" strokeDasharray="1.5 2.5" fill="none" opacity="0.35" />
                        </svg>

                        <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 z-10 h-full w-full opacity-20" preserveAspectRatio="none">
                            <motion.path
                                d="M20,30 Q38,24 52,42 T82,64"
                                fill="none"
                                stroke="url(#grad1)"
                                strokeWidth="0.9"
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                            />
                            <motion.path
                                d="M18,70 Q38,54 60,58 T84,34"
                                fill="none"
                                stroke="url(#grad1)"
                                strokeWidth="0.9"
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 0.5 }}
                            />
                            <defs>
                                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#e31e33" stopOpacity="1" />
                                    <stop offset="100%" stopColor="#ff8a00" stopOpacity="1" />
                                </linearGradient>
                            </defs>
                        </svg>

                        <div className="relative z-20 h-full w-full">
                            {milestones.map((shop, idx) => (
                                <motion.div
                                    key={idx}
                                    className="absolute"
                                    style={{ top: shop.top, left: shop.left }}
                                    initial={{ opacity: 0, scale: 0 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.5 + idx * 0.1, type: "spring" }}
                                >
                                    <div className="relative group cursor-pointer">
                                        <div className="absolute -inset-2 bg-primary/20 rounded-full animate-ping"></div>

                                        <div className="relative flex items-center justify-center rounded-full bg-slate-900 p-1.5 text-white shadow-lg transition-transform group-hover:scale-110 md:p-2">
                                            <ClipboardList className="w-4 h-4 md:w-5 md:h-5" />
                                        </div>

                                        <div className="pointer-events-none absolute bottom-full left-1/2 mb-3 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-3 py-1.5 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                                            {shop.label}
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 1.2 }}
                            className="absolute bottom-6 right-6 z-30 hidden rounded-[1.5rem] border border-white/70 bg-white/85 p-5 shadow-lg backdrop-blur-md sm:block"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">Search to order</p>
                                    <p className="text-xs font-medium text-stone-500">A simpler flow for industrial buyers</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
