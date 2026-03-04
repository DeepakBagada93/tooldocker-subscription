'use client';

import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

export function CTASection() {
    return (
        <section className="py-24 bg-workshop-dark text-white overflow-hidden relative border-t-8 border-primary">
            <div className="absolute inset-0 opacity-10 industrial-grid" />
            <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] mix-blend-screen opacity-30" />
            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="max-w-4xl mx-auto text-center space-y-8"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tighter uppercase leading-[1.1]">
                        Ready to Upgrade Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Industrial Arsenal?</span>
                    </h2>
                    <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-medium">
                        Join thousands of professionals on the world&apos;s fastest-growing industrial marketplace. Get the best tools for your next big project.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6 w-full sm:w-auto px-4">
                        <Button size="lg" className="w-full sm:w-auto h-14 px-8 sm:px-12 text-base sm:text-lg font-bold bg-primary hover:bg-red-700 shadow-[0_4px_14px_0_rgba(227,30,51,0.39)] hover:shadow-[0_6px_20px_rgba(227,30,51,0.23)] hover:-translate-y-0.5 transition-all" variant="industrial">
                            Start Shopping
                        </Button>
                        <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 sm:px-12 text-base sm:text-lg font-bold border-slate-600 hover:bg-slate-800 text-white hover:-translate-y-0.5 transition-all">
                            Become a Vendor
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
