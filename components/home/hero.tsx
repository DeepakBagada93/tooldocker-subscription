'use client';

import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#faf8f4_0%,#ffffff_38%,#f5f1ea_100%)] py-20 text-slate-900 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(199,98,44,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.06),transparent_24%)]" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-10 lg:col-span-7"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center rounded-full border border-stone-300/80 bg-white/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-600 backdrop-blur-sm"
            >
              <span>Tooldocker Atelier</span>
            </motion.div>

            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.96] tracking-[-0.05em] text-slate-900 sm:text-6xl lg:text-[5.6rem]">
              Precision tools,
              <br className="hidden sm:block" />
              quieter luxury,
              <br className="hidden sm:block" />
              built for modern work.
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl"
            >
              Discover a calmer industrial marketplace with verified makers, curated equipment, and a more considered way to source the pieces your workshop actually needs.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex w-full flex-col gap-4 pt-2 sm:w-auto sm:flex-row"
            >
              <Button asChild size="lg" className="h-12 w-full rounded-full bg-slate-900 px-8 text-base text-white hover:bg-slate-800 sm:h-14 sm:w-auto sm:text-lg">
                <Link href="/search">
                Browse Catalog <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 w-full rounded-full border-stone-300 bg-white/80 px-8 text-base text-slate-900 hover:bg-stone-100 sm:h-14 sm:w-auto sm:text-lg">
                <Link href="/buyer/vendors">
                Explore Vendors
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="grid max-w-3xl grid-cols-3 gap-6 border-t border-stone-300/80 pt-10"
            >
              <div className="space-y-1">
                <div className="text-3xl font-semibold text-slate-900">50k+</div>
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Products</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-semibold text-slate-900">1.2k+</div>
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Studios & Vendors</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-semibold text-slate-900">24h</div>
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Fast sourcing flow</div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotateX: 10, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 100 }}
            className="relative hidden lg:col-span-5 lg:block perspective-1000"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-stone-200 bg-white p-4 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)] transform-gpu">
              <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-[#f0ebe3]">
              <Image
                src="/images/tooldocker-stonemachine.png"
                alt="Industrial Machinery"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#241d18]/35 via-transparent to-white/20" />

              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-6 left-6 right-6 rounded-[1.75rem] border border-white/70 bg-white/78 p-5 shadow-lg backdrop-blur-xl"
              >
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Designed with restraint</div>
                  <div className="font-[family-name:Georgia,Times_New_Roman,serif] text-2xl leading-tight text-slate-900">
                    Industrial sourcing with an Italian editorial touch.
                  </div>
                  <div className="text-sm leading-6 text-slate-600">
                    Refined layout, warm neutrals, and verified products chosen for serious workshops.
                  </div>
                </div>
              </motion.div>
              </div>
            </div>
            <div className="absolute -right-6 top-10 h-32 w-32 rounded-full bg-[#d6b08a]/25 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-slate-200/60 blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
