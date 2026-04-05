'use client';

import { motion } from 'motion/react';
import { MapPin, Building2, Users, Truck, TrendingUp } from 'lucide-react';
import Image from 'next/image';

const stats = [
    { icon: MapPin, value: '28', label: 'States covered', growth: '+5 this year' },
    { icon: Building2, value: '500+', label: 'Verified sellers', growth: '+120 new' },
    { icon: Users, value: '10K+', label: 'Active buyers', growth: '+3K this quarter' },
    { icon: Truck, value: 'Same day', label: 'Delivery in metros', growth: '25 cities' },
];

export function IndiaCoverage() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-[#fff5f6] py-24 lg:py-32">
            {/* Background decorations */}
            <div className="absolute inset-0 opacity-[0.02]">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, #c7112c 1px, transparent 0)',
                        backgroundSize: '40px 40px',
                    }}
                />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Top badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mx-auto mb-12 flex w-fit items-center gap-3 rounded-full bg-white px-6 py-3 shadow-lg shadow-slate-900/5"
                >
                    <div className="flex h-10 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#c7112c] to-[#ff4d6a]">
                        <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-900">Proudly Indian</div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">Made for India</div>
                    </div>
                </motion.div>

                {/* Main heading */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mx-auto mb-16 max-w-4xl text-center"
                >
                    <h2 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
                        India's leader in{' '}
                        <span className="relative inline-block">
                            <span className="relative z-10 bg-gradient-to-r from-[#c7112c] to-[#ff4d6a] bg-clip-text text-transparent">
                                industrial supplies
                            </span>
                            <span className="absolute bottom-1 left-0 h-2 w-full bg-[#ff4d6a]/10" aria-hidden="true" />
                        </span>
                    </h2>
                    <p className="text-lg font-medium uppercase tracking-[0.12em] text-[#c7112c]">
                        Serving over 10,000+ customers across the nation
                    </p>
                </motion.div>

                {/* Hero image section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.7 }}
                    className="relative mb-16 overflow-hidden rounded-3xl"
                >
                    <div className="relative h-[400px] w-full lg:h-[500px]">
                        <Image
                            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1400&q=80"
                            alt="India industrial growth"
                            fill
                            className="object-cover"
                            priority
                            referrerPolicy="no-referrer"
                        />
                        {/* Gradient overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#c7112c]/30 to-[#ff4d6a]/20" />

                        {/* Overlay content */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16">
                            <div className="max-w-3xl space-y-4">
                                <p className="text-lg leading-relaxed text-white/90 md:text-xl">
                                    Tooldocker brings together quality tools, machinery, and project supplies from verified sellers across India. Built for contractors, builders, and procurement teams who need reliable products fast.
                                </p>
                                <p className="text-base leading-relaxed text-white/70">
                                    We are laser focused on creating outstanding experiences by providing the most dependable supply chain solutions that enable our customers to thrive.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Corner accent */}
                    <div className="absolute -right-2 -top-2 h-32 w-32 rounded-bl-3xl bg-gradient-to-br from-[#c7112c] to-[#ff4d6a] opacity-90 lg:h-40 lg:w-40" />
                </motion.div>

                {/* Stats grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg shadow-slate-900/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#c7112c]/10"
                            >
                                {/* Background gradient on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#c7112c]/5 to-[#ff4d6a]/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                <div className="relative z-10">
                                    {/* Icon */}
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#c7112c] to-[#ff4d6a] shadow-lg shadow-[#c7112c]/20 transition-transform duration-500 group-hover:scale-110">
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>

                                    {/* Value */}
                                    <div className="mb-1 text-3xl font-bold text-slate-900">{stat.value}</div>

                                    {/* Label */}
                                    <div className="mb-3 text-sm font-medium text-slate-600">{stat.label}</div>

                                    {/* Growth indicator */}
                                    <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5">
                                        <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                                        <span className="text-xs font-semibold text-emerald-700">{stat.growth}</span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
