'use client';

import { motion } from 'motion/react';
import { Boxes, CreditCard, ShieldCheck, Zap } from 'lucide-react';

export function TrustBar() {
    return (
        <section className="border-b border-[#c7112c]/10 bg-gradient-to-r from-white via-[#fff5f6] to-white py-8">
            <div className="container mx-auto px-4">
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
                            className="group flex items-center space-x-4 rounded-3xl border-2 border-[#c7112c]/10 bg-white/90 p-5 transition-all duration-300 hover:border-[#ff4d6a]/50 hover:shadow-xl hover:shadow-[#c7112c]/15 hover:-translate-y-2 hover:bg-white"
                        >
                            <div className="rounded-2xl bg-gradient-to-br from-[#c7112c]/10 to-[#ff4d6a]/10 p-3 shadow-sm group-hover:from-[#c7112c]/20 group-hover:to-[#ff4d6a]/20 transition-all duration-300 group-hover:scale-110">
                                <item.icon className="h-5 w-5 text-[#c7112c] group-hover:text-[#ff4d6a] transition-colors duration-300" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold tracking-tight text-slate-900 group-hover:text-[#c7112c] transition-colors duration-300">{item.title}</div>
                                <div className="text-xs text-stone-500">{item.desc}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
