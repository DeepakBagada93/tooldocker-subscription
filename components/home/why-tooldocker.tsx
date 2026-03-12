'use client';

import { motion } from 'motion/react';
import { Store, ShieldCheck, Wrench, Truck } from 'lucide-react';

const features = [
    {
        icon: ShieldCheck,
        title: 'Verified Vendors',
        description: 'Every seller on Tooldocker undergoes a rigorous verification process to ensure quality and reliability.'
    },
    {
        icon: Wrench,
        title: 'Industrial Grade',
        description: 'We specialize in heavy-duty, professional tools that meet strict industry standards.'
    },
    {
        icon: Truck,
        title: 'Global Logistics',
        description: 'Fast, secure shipping worldwide with real-time tracking from warehouse to worksite.'
    },
    {
        icon: Store,
        title: 'Global Storefronts',
        description: 'Connect with specialized manufacturers and distributors directly, cutting out the middleman.'
    }
];

const shops = [
    { top: '30%', left: '20%', label: 'North America' },
    { top: '45%', left: '45%', label: 'Europe' },
    { top: '60%', left: '30%', label: 'South America' },
    { top: '55%', left: '70%', label: 'Asia' },
    { top: '75%', left: '55%', label: 'Africa' },
    { top: '80%', left: '85%', label: 'Australia' }
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
                        Why teams choose Tooldocker for a more deliberate buying experience.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mx-auto max-w-2xl text-lg leading-8 text-stone-600"
                    >
                        The platform keeps the essentials visible: trusted suppliers, industrial-grade inventory, and a clearer path from discovery to checkout.
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

                        <svg viewBox="0 0 1008 650" className="absolute inset-0 z-0 h-full w-full fill-current p-8 text-stone-300">
                            <path d="M260.5,145.4c-4.2-2.1-15.3-2.1-19.1-1.4c-6.2,1.2-13.8,4.2-16.7,8.3c-2.1,3.1-2.4,9-1.4,14.6c0.5,2.6,2.1,4.2,3.1,3.5
              c1.2-0.9,0.7-3.8-1-5.6c-4.9-5.2-3.1-12.7,4.2-15.6c4-1.6,8.8-1.4,11.8-1.2c5.9,0.5,12,3.3,16,6.6c4,3.3,8.8,3.8,11.4,0.9
              C271.8,152.1,266.3,148.4,260.5,145.4z"/>
                            <path d="M309.8,137.4c-6.6,0.2-15.1,1.4-21.2,3.8c-7.3,2.8-14.8,8.8-16.8,17.2c-1.4,5.9-0.5,13.7,2.8,18.4c3.5,4.9,8.7,8,14.2,9.9
              c5.6,1.9,11.8,2.8,18.1,2.8c7.1,0,13.9-1.2,19.8-3.5c7.6-3.1,13.9-8.7,16.5-16.8c1.9-5.9,2.4-13.2,0.9-18.4
              c-1.6-5.4-4.5-9.9-8.5-13.2C328.7,139.8,318.5,137.2,309.8,137.4z M328,170.8c-3.5,5.6-9.9,8.5-16.7,9.4c-6.8,0.9-14.1,0-19.3-4
              c-4.7-3.8-6.6-10.1-5.4-15.6c1.2-5.4,4.5-9.9,9.4-12.5c5.2-2.8,11.5-3.5,17.4-2.8C319.5,146.4,331.3,165.6,328,170.8z"/>
                            <path d="M485.4,321.4c-4.9-1.2-12.2-2.4-17.7-1.4c-7.3,1.4-14.1,5.6-17,11.3c-2.4,4.7-2.8,12.7-0.7,18.4c1.9,4.9,5.4,8.7,9.2,11.1
              c5.2,3.3,11.5,4.9,17.7,4.9c7.6,0,15.1-2.1,20.7-6.6c6.2-4.9,10.6-12.2,11.3-20.3c0.7-6.8-1.2-14.1-4.7-19.1
              C500.4,314.1,492.2,322.8,485.4,321.4z M500.2,347.1c-2.8,4.7-8,8-13.9,9c-5.6,0.9-11.8,0-16.3-3.8c-4-3.3-6.4-8.7-6.4-13.7
              c0-4.9,2.1-9.9,5.6-13.2c4.2-3.8,10.1-5.6,15.6-5.6C495.3,319.8,503.7,341,500.2,347.1z"/>
                            <path d="M211.5,391.4c-6.8-1.4-16-1.6-22.6,0.2c-8,2.1-15.1,7.3-18.4,14.6c-2.8,6.4-3.1,16.5-0.7,23.6c2.1,6.4,7.1,11.8,12.7,14.9
              c6.8,3.8,14.8,5.4,22.4,4.2c9-1.4,17-5.9,22.1-13.2c5.2-7.3,7.3-17.2,5.6-26.2c-1.2-6.8-4.5-12.7-9.4-17
              C220.7,389.3,215.3,392.1,211.5,391.4z M224.2,423.7c-2.8,5.4-8.3,9.4-14.8,10.1c-6.4,0.7-13.2-0.7-18.1-4.9c-4.5-4-7.3-10.4-6.8-15.8
              c0.5-5.2,3.5-9.9,7.5-12.5c4.7-3.1,10.6-4,15.8-3.1C218.1,399.2,227.3,417.8,224.2,423.7z"/>
                            <path d="M725.1,216.7c-5.6-1.9-14.1-1.9-19.8-0.5c-7.3,1.9-13.7,6.8-16.3,13.4c-2.4,5.9-2.1,14.4,0.5,20.3c2.4,5.6,7.5,10.1,12.7,12.2
              c6.4,2.8,13.4,3.3,19.8,1.9c7.6-1.6,14.4-5.9,18.4-12.2c4-6.4,5.4-14.8,3.5-22.1c-1.4-5.9-4.7-11.1-9.4-14.6
              C731.7,212.9,728.4,217.9,725.1,216.7z M735,243.6c-2.1,4.7-6.8,8.3-12.2,9.2c-5.4,0.9-11.3,0.2-15.6-3.1c-3.8-3.1-6.4-8.3-6.4-12.7
              c0-4.5,2.1-9,5.2-11.8c3.8-3.3,8.7-4.7,13.2-4.2C728.1,221.7,738.1,237.4,735,243.6z"/>
                            <path d="M835.9,461.2c-4.7-2.1-13-2.1-18.1-0.9c-6.8,1.6-12.5,6.4-14.8,12.7c-2.1,5.6-1.4,13.7,1.4,19.1c2.6,5.2,7.5,9.2,12.7,10.8
              c6.4,2.1,13.2,2.4,18.8,0.7c7.1-2.1,13.2-6.8,16.5-13.4c3.3-6.6,4.2-15.1,1.9-22.1c-1.6-5.6-5.4-10.4-10.4-13.2
              C841.1,453.6,838.7,462.4,835.9,461.2z M844.2,485.4c-1.9,4.2-6.4,7.5-11.3,8.3c-4.9,0.7-10.1-0.2-13.9-3.3c-3.5-3.1-5.6-8.3-5.2-12.5
              c0.5-4.2,3.1-8.3,6.6-10.6c4-2.6,9-3.3,13.2-2.4C839.4,466.1,846.5,480.2,844.2,485.4z"/>
                            <circle cx="280" cy="180" r="140" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 8" opacity="0.3" />
                            <circle cx="700" cy="250" r="180" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 8" opacity="0.3" />
                            <circle cx="500" cy="400" r="120" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 8" opacity="0.3" />
                        </svg>

                        <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 z-10 h-full w-full opacity-20" preserveAspectRatio="none">
                            <motion.path
                                d="M20,30 Q45,20 70,55"
                                fill="none"
                                stroke="url(#grad1)"
                                strokeWidth="0.5"
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                            />
                            <motion.path
                                d="M70,55 Q60,70 30,60"
                                fill="none"
                                stroke="url(#grad1)"
                                strokeWidth="0.5"
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 0.5 }}
                            />
                            <motion.path
                                d="M30,60 Q40,50 45,45"
                                fill="none"
                                stroke="url(#grad1)"
                                strokeWidth="0.5"
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 1 }}
                            />
                            <defs>
                                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#e31e33" stopOpacity="1" />
                                    <stop offset="100%" stopColor="#ff8a00" stopOpacity="1" />
                                </linearGradient>
                            </defs>
                        </svg>

                        <div className="relative z-20 h-full w-full">
                            {shops.map((shop, idx) => (
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
                                            <Store className="w-4 h-4 md:w-5 md:h-5" />
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
                                    <p className="text-sm font-semibold text-slate-900">150+ countries</p>
                                    <p className="text-xs font-medium text-stone-500">Verified vendors, globally</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
