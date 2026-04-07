'use client';

import { motion } from 'motion/react';
import { ShieldCheck, Search, ClipboardList, Zap, CheckCircle2, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

interface Feature {
    icon: typeof ShieldCheck;
    title: string;
    description: string;
    stats?: { value: string; label: string };
}

const features: Feature[] = [
    {
        icon: ShieldCheck,
        title: 'Quality assured products',
        description: 'Every product is verified for quality so buyers get reliable tools, machinery, and supplies for their projects. We rigorously test and certify each item before it reaches your doorstep.',
        stats: { value: '100%', label: 'Quality verified' }
    },
    {
        icon: Search,
        title: 'Built for product discovery',
        description: 'Category browsing, search, and filters organized for contractors and industrial procurement teams. Find exactly what you need in seconds, not hours.',
        stats: { value: '10K+', label: 'Products searchable' }
    },
    {
        icon: ClipboardList,
        title: 'Bulk ordering made easy',
        description: 'Order in bulk with clear pricing, stock availability, and GST invoicing for business buyers. Streamline your procurement process with our enterprise-ready features.',
        stats: { value: '500+', label: 'Bulk orders monthly' }
    },
    {
        icon: Zap,
        title: 'Smart search that works',
        description: 'Find products faster with intelligent search that understands industrial terms and categories. Our AI-powered search learns from your behavior to deliver better results.',
        stats: { value: '<2s', label: 'Search response time' }
    },
];

const images = [
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&q=80',
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80',
];

export function WhyTooldocker() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white py-24 lg:py-32">
            {/* Background decorations */}
            <div className="absolute inset-0 opacity-[0.03]">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, #64748b 1px, transparent 0)',
                        backgroundSize: '48px 48px',
                    }}
                />
            </div>
            <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-slate-200/30 to-slate-300/20 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-slate-300/20 to-slate-200/30 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mx-auto mb-20 max-w-3xl text-center"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="mb-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700"
                    >
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                        Why choose us
                    </motion.div>
                    <h2 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
                        Why Tooldocker is the{' '}
                        <span className="relative inline-block">
                            <span className="relative z-10 text-slate-800">
                                best place
                            </span>
                            <span className="absolute bottom-2 left-0 h-3 w-full bg-slate-200" aria-hidden="true" />
                        </span>{' '}
                        to buy
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600">
                        Quality products, clear categories, fast search, and a buying experience built for contractors and procurement teams.
                    </p>
                </motion.div>

                {/* Feature rows - alternating layout */}
                <div className="space-y-24 lg:space-y-32">
                    {features.map((feature, idx) => {
                        const isEven = idx % 2 === 0;
                        const imageIdx = idx % images.length;

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-100px' }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-16 ${
                                    !isEven ? 'lg:direction-rtl' : ''
                                }`}
                            >
                                {/* Content */}
                                <div className={!isEven ? 'lg:order-2' : ''}>
                                    {/* Icon badge */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.2 }}
                                        className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-700 shadow-xl shadow-slate-900/20"
                                    >
                                        <feature.icon className="h-7 w-7 text-white" />
                                    </motion.div>

                                    {/* Title */}
                                    <motion.h3
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3 }}
                                        className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl"
                                    >
                                        {feature.title}
                                    </motion.h3>

                                    {/* Description */}
                                    <motion.p
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.4 }}
                                        className="mb-8 text-lg leading-relaxed text-slate-600"
                                    >
                                        {feature.description}
                                    </motion.p>

                                    {/* Stats & Checkmarks */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.5 }}
                                        className="flex flex-wrap items-center gap-6"
                                    >
                                        {feature.stats && (
                                            <div className="rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 px-6 py-4">
                                                <div className="text-3xl font-bold text-slate-900">
                                                    {feature.stats.value}
                                                </div>
                                                <div className="mt-1 text-sm font-medium text-slate-600">
                                                    {feature.stats.label}
                                                </div>
                                            </div>
                                        )}
                                        <div className="space-y-2">
                                            {['Verified sellers', 'Fast delivery', 'Easy returns'].map((item, i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4 text-slate-600" />
                                                    <span className="text-sm font-medium text-slate-700">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Image */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 }}
                                    className={`relative ${!isEven ? 'lg:order-1' : ''}`}
                                >
                                    <div className="group relative overflow-hidden rounded-3xl">
                                        <Image
                                            src={images[imageIdx]}
                                            alt={feature.title}
                                            width={600}
                                            height={500}
                                            className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            referrerPolicy="no-referrer"
                                        />
                                        {/* Gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                        {/* Floating arrow on hover */}
                                        <div className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1">
                                            <ArrowUpRight className="h-5 w-5 text-white" />
                                        </div>

                                        {/* Corner accent */}
                                        <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-tr-3xl bg-gradient-to-br from-slate-700 to-slate-500 opacity-80" />
                                        <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-tr-3xl bg-slate-700" style={{ transform: 'translate(8px, -8px)' }} />
                                    </div>

                                    {/* Floating stat card */}
                                    {feature.stats && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.6 }}
                                            className="absolute -bottom-6 -right-6 rounded-2xl bg-white p-4 shadow-2xl shadow-slate-900/10 lg:-right-8"
                                        >
                                            <div className="text-2xl font-bold text-slate-900">{feature.stats.value}</div>
                                            <div className="text-xs text-slate-500">{feature.stats.label}</div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
