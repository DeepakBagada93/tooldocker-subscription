'use client';

import { motion } from 'motion/react';
import { Store, ShieldCheck, Wrench, Truck, MapPin } from 'lucide-react';

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
        <section className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors">
            {/* Decorative Grid Background */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-900 dark:text-white"
                    >
                        Why Choose <span className="text-primary">Tooldocker?</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium"
                    >
                        The premier marketplace for industrial tools, connecting professionals with verified vendors globally.
                    </motion.p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Features Grid */}
                    <div className="grid sm:grid-cols-2 gap-6">
                        {features.map((feature, idx) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow"
                                >
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{feature.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* World Map Visualization */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden aspect-square md:aspect-video lg:aspect-square flex items-center justify-center"
                    >
                        {/* Abstract Map Background using simple radial gradients to simulate continents or a global reach */}
                        <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 opacity-50"></div>

                        {/* World Map SVG - Simplified */}
                        <svg viewBox="0 0 1008 650" className="w-full h-full text-slate-200 dark:text-slate-800 fill-current absolute inset-0 z-0 p-8">
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

                        {/* Simulated interactive glowing lines representing connections */}
                        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full z-10 pointer-events-none opacity-20" preserveAspectRatio="none">
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

                        <div className="relative z-20 w-full h-full">
                            {/* Animated Map Pins/Shops */}
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
                                        {/* Ping Animation */}
                                        <div className="absolute -inset-2 bg-primary/20 rounded-full animate-ping"></div>

                                        {/* Pin/Store Icon */}
                                        <div className="relative bg-primary text-white p-1.5 md:p-2 rounded-full shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform flex items-center justify-center">
                                            <Store className="w-4 h-4 md:w-5 md:h-5" />
                                        </div>

                                        {/* Tooltip */}
                                        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                            {shop.label}
                                            {/* Triangle pointer */}
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Floating Information Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 1.2 }}
                            className="absolute bottom-6 right-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 z-30 hidden sm:block"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">150+ Countries</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Verified vendors globally</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
