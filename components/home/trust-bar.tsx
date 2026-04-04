'use client';

import { motion } from 'motion/react';
import { Boxes, CreditCard, ShieldCheck, Sparkles } from 'lucide-react';

export function TrustBar() {
    return (
        <section className="border-b border-stone-200 bg-white py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { icon: ShieldCheck, title: "Quality verified products", desc: "Every product checked for quality and reliability" },
                        { icon: Boxes, title: "Category-led discovery", desc: "Browse tools, machinery, PPE, and site supplies faster" },
                        { icon: CreditCard, title: "India-ready payments", desc: "Designed for UPI, cards, and net banking flows" },
                        { icon: Sparkles, title: "Smart product search", desc: "Find exactly what you need for your projects" }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex items-center space-x-4 rounded-3xl border border-stone-200 bg-[#fcfaf7] p-5 transition-shadow hover:shadow-md"
                        >
                            <div className="rounded-2xl bg-white p-3 shadow-sm">
                                <item.icon className="h-5 w-5 text-slate-900" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold tracking-tight text-slate-900">{item.title}</div>
                                <div className="text-xs text-stone-500">{item.desc}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
