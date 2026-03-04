'use client';

import { motion } from 'motion/react';
import { Hammer, ShieldCheck, Truck, Clock } from 'lucide-react';

export function TrustBar() {
    return (
        <section className="bg-white dark:bg-workshop-dark border-b py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { icon: ShieldCheck, title: "Verified Vendors", desc: "Strict quality control" },
                        { icon: Truck, title: "Industrial Shipping", desc: "Heavy-duty logistics" },
                        { icon: Clock, title: "24h Response", desc: "Fast RFQ turnaround" },
                        { icon: Hammer, title: "Expert Support", desc: "Technical assistance" }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex items-center space-x-4 bg-white dark:bg-workshop-dark p-4 rounded-xl hover:shadow-lg transition-shadow border border-slate-100 dark:border-slate-800/50"
                        >
                            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                                <item.icon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <div className="font-bold text-sm tracking-tight">{item.title}</div>
                                <div className="text-xs text-muted-foreground">{item.desc}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
