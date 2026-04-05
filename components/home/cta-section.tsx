'use client';

import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function CTASection() {
    return (
        <section className="bg-white py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="relative overflow-hidden rounded-3xl bg-[#c7112c]">
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-[0.06]">
                            <div className="absolute inset-0" style={{
                                backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                                backgroundSize: '28px 28px'
                            }} />
                        </div>

                        {/* Gradient orbs */}
                        <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-white/[0.08] blur-3xl" />
                        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-white/[0.04] blur-3xl" />

                        <div className="relative z-10 grid lg:grid-cols-2">
                            {/* Left: Text content */}
                            <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14 xl:p-16">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="space-y-6"
                                >
                                    <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                                        Built for scale
                                    </span>

                                    <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                                        Your one-stop shop for
                                        <span className="block mt-1">
                                            tools, machinery, and project supplies.
                                        </span>
                                    </h2>

                                    <p className="text-base leading-7 text-white/75 sm:text-lg">
                                        Quality products, category-driven discovery, India-focused checkout, and smart search in one clear platform.
                                    </p>

                                    <div className="flex flex-wrap gap-3 pt-2">
                                        <Button asChild size="lg" className="h-12 rounded-full bg-white px-8 text-[#c7112c] hover:bg-white/90 font-semibold shadow-xl shadow-black/10">
                                            <Link href="/search">
                                                Explore products <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-2 border-white/30 bg-transparent px-8 text-white hover:bg-white/10 hover:text-white font-semibold">
                                            <Link href="/search">
                                                Browse categories
                                            </Link>
                                        </Button>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Right: Sticky image */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="relative hidden lg:block"
                            >
                                <div className="sticky top-8 h-full min-h-[500px] p-8">
                                    <div className="relative h-full w-full overflow-hidden rounded-2xl">
                                        <Image
                                            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80"
                                            alt="Industrial tools and equipment"
                                            fill
                                            className="object-cover"
                                            referrerPolicy="no-referrer"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-l from-[#c7112c]/50 via-transparent to-transparent" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
            </div>
        </section>
    );
}
