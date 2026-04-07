'use client';

import { motion } from 'motion/react';
import { Boxes, CreditCard, ShieldCheck, Zap } from 'lucide-react';

export function TrustBar() {
    return (
        <section className="border-b border-slate-200 bg-gradient-to-r from-white via-slate-50 to-white py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { icon: ShieldCheck, title: "Quality verified products", desc: "Every product checked for quality and reliability" },
                        { icon: Boxes, title: "Category-led discovery", desc: "Browse tools, machinery, PPE, and site supplies faster" },
                        { icon: CreditCard, title: "India-ready payments", desc: "Designed for UPI, cards, and net banking flows" },
                        { icon: Zap, title: "Smart product search", desc: "Find exactly what you need for your projects" }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group flex items-center space-x-4 rounded-3xl border-2 border-slate-200 bg-white/90 p-5 transition-all duration-300 hover:border-slate-400 hover:shadow-xl hover:shadow-slate-900/10 hover:-translate-y-2 hover:bg-white"
                        >
                            <div className="rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 p-3 shadow-sm group-hover:from-slate-200 group-hover:to-slate-100 transition-all duration-300 group-hover:scale-110">
                                <item.icon className="h-5 w-5 text-slate-700 group-hover:text-slate-900 transition-colors duration-300" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold tracking-tight text-slate-900 group-hover:text-slate-700 transition-colors duration-300">{item.title}</div>
                                <div className="text-xs text-stone-500">{item.desc}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
