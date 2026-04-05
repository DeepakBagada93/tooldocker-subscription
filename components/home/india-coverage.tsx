'use client';

import { motion } from 'motion/react';
import { MapPin, Building2, Users, Truck } from 'lucide-react';
import Image from 'next/image';

const stats = [
    { icon: MapPin, value: '28', label: 'States covered' },
    { icon: Building2, value: '500+', label: 'Verified sellers' },
    { icon: Users, value: '10K+', label: 'Active buyers' },
    { icon: Truck, value: 'Same day', label: 'Delivery in metros' },
];

// Dot positions as percentage (top/left) for overlay on image
const cityDots = [
    // Metros (larger)
    { top: '18%', left: '44%', size: 'w-5 h-5', pulse: true },
    { top: '42%', left: '28%', size: 'w-6 h-6', pulse: true },
    { top: '48%', left: '31%', size: 'w-4 h-4', pulse: true },
    { top: '66%', left: '34%', size: 'w-5 h-5', pulse: true },
    { top: '65%', left: '40%', size: 'w-5 h-5', pulse: true },
    { top: '58%', left: '36%', size: 'w-4 h-4', pulse: true },
    { top: '44%', left: '60%', size: 'w-5 h-5', pulse: true },
    // Other cities (smaller)
    { top: '38%', left: '24%', size: 'w-3 h-3' },
    { top: '46%', left: '40%', size: 'w-3 h-3' },
    { top: '40%', left: '48%', size: 'w-2 h-2' },
    { top: '36%', left: '44%', size: 'w-2 h-2' },
    { top: '34%', left: '63%', size: 'w-2 h-2' },
    { top: '46%', left: '56%', size: 'w-2 h-2' },
    { top: '50%', left: '53%', size: 'w-2 h-2' },
    { top: '74%', left: '37%', size: 'w-3 h-3' },
    { top: '39%', left: '33%', size: 'w-2 h-2' },
    { top: '41%', left: '39%', size: 'w-2 h-2' },
    { top: '28%', left: '46%', size: 'w-2 h-2' },
    { top: '36%', left: '30%', size: 'w-2 h-2' },
    { top: '54%', left: '44%', size: 'w-2 h-2' },
    { top: '55%', left: '34%', size: 'w-2 h-2' },
    { top: '32%', left: '26%', size: 'w-2 h-2' },
];

export function IndiaCoverage() {
    return (
        <section className="bg-white py-20">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-6xl">
                    <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 sm:p-10 lg:p-14 xl:p-16 shadow-sm">
                        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
                            {/* Left: Text content */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="space-y-6"
                            >
                                {/* Badge */}
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-14 items-center justify-center rounded-lg bg-[#c7112c]">
                                        <div className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-white" />
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-900">Proudly Indian</div>
                                        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Made for India</div>
                                    </div>
                                </div>

                                {/* Heading */}
                                <h2 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
                                    India's leader in
                                    <span className="block text-[#c7112c]">industrial supplies.</span>
                                </h2>

                                {/* Subtitle */}
                                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#c7112c]">
                                    Serving over 10,000+ customers
                                </p>

                                {/* Description */}
                                <div className="space-y-4 text-sm leading-7 text-slate-500">
                                    <p>
                                        Tooldocker brings together quality tools, machinery, and project supplies from verified sellers across India. Our platform is built for contractors, builders, and procurement teams who need reliable products fast.
                                    </p>
                                    <p>
                                        We are laser focused on creating outstanding experiences by providing the most dependable supply chain solutions that enable our customers to thrive.
                                    </p>
                                </div>

                                {/* Stats grid */}
                                <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-2">
                                    {stats.map((stat, idx) => {
                                        const Icon = stat.icon;
                                        return (
                                            <motion.div
                                                key={stat.label}
                                                initial={{ opacity: 0, y: 10 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: idx * 0.08 }}
                                                className="flex items-center gap-3"
                                            >
                                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#c7112c]/10">
                                                    <Icon className="h-4 w-4 text-[#c7112c]" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900">{stat.value}</div>
                                                    <div className="text-[11px] text-slate-400">{stat.label}</div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>

                            {/* Right: India map image with dot overlay */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="relative flex items-center justify-center"
                            >
                                <div className="relative w-full max-w-[340px]">
                                    {/* Map image */}
                                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[#f8fafc] border border-slate-100">
                                        <Image
                                            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=80"
                                            alt="India map"
                                            fill
                                            className="object-cover"
                                            referrerPolicy="no-referrer"
                                        />
                                        <div className="absolute inset-0 bg-white/60" />

                                        {/* Dot markers overlay */}
                                        {cityDots.map((dot, i) => (
                                            <div
                                                key={i}
                                                className="absolute"
                                                style={{ top: dot.top, left: dot.left }}
                                            >
                                                <motion.div
                                                    className={`${dot.size} rounded-full bg-[#c7112c] opacity-80`}
                                                    initial={{ scale: 0 }}
                                                    whileInView={{ scale: 1 }}
                                                    viewport={{ once: true }}
                                                    transition={{
                                                        delay: 0.3 + i * 0.04,
                                                        type: 'spring',
                                                        stiffness: 200,
                                                        damping: 15
                                                    }}
                                                />
                                                {dot.pulse && (
                                                    <motion.div
                                                        className="absolute inset-0 rounded-full border border-[#c7112c] opacity-30"
                                                        initial={{ scale: 0.7, opacity: 0.4 }}
                                                        animate={{ scale: 1.8, opacity: 0 }}
                                                        transition={{
                                                            delay: 0.5 + i * 0.1,
                                                            duration: 2.5,
                                                            repeat: Infinity,
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Legend */}
                                    <div className="flex items-center justify-center gap-5 mt-3">
                                        <div className="flex items-center gap-1.5">
                                            <div className="h-2 w-2 rounded-full bg-[#c7112c]" />
                                            <span className="text-[10px] text-slate-400">Small cities</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="h-3 w-3 rounded-full bg-[#c7112c] opacity-80" />
                                            <span className="text-[10px] text-slate-400">Metros</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
