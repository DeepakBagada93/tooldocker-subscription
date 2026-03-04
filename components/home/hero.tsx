'use client';

import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck, Truck, Zap } from 'lucide-react';
import Image from 'next/image';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-workshop-dark via-slate-900 to-black text-white py-20 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20 industrial-grid" />
      {/* Ambient Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen opacity-50" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[150px] mix-blend-screen opacity-40" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 lg:col-span-7"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-primary/30 backdrop-blur-sm"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Next-Gen Industrial Sourcing</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-[5rem] font-black tracking-tighter leading-[1] uppercase">
              Heavy Duty <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-400 drop-shadow-[0_0_15px_rgba(227,30,51,0.5)]">Tools & Tech</span> <br />
              For Pros.
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed font-medium"
            >
              The ultimate multivendor hub for industrial procurement. From high-precision CNC machines to heavy-duty safety gear.
              Verified vendors. Guaranteed quality.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto"
            >
              <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-8 h-12 sm:h-14 bg-primary hover:bg-red-700 shadow-[0_0_20px_rgba(227,30,51,0.4)] transition-all hover:shadow-[0_0_30px_rgba(227,30,51,0.6)]" variant="industrial">
                Browse Catalog <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base sm:text-lg px-8 h-12 sm:h-14 border-slate-600 hover:bg-slate-800 text-white backdrop-blur-sm bg-white/5">
                Request a Quote
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-800/60"
            >
              <div className="space-y-1">
                <div className="text-3xl font-black text-white">50k+</div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">Products</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black text-white">1.2k+</div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">Vendors</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black text-white">24h</div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">Avg. Quote</div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotateX: 10, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 100 }}
            className="relative hidden lg:block lg:col-span-5 perspective-1000"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border-8 border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform-gpu">
              <Image
                src="https://picsum.photos/seed/fallback/800/600"
                alt="Industrial Machinery"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              {/* Floating Cards */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-10 left-6 right-6 bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-2xl flex items-center space-x-4 shadow-xl"
              >
                <div className="bg-primary/20 p-3 rounded-xl border border-primary/30">
                  <ShieldCheck className="h-7 w-7 text-primary drop-shadow-[0_0_8px_rgba(227,30,51,0.8)]" />
                </div>
                <div>
                  <div className="text-base font-black tracking-tight text-white">Verified Quality</div>
                  <div className="text-sm font-medium text-slate-300">All vendors are rigorously vetted</div>
                </div>
              </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
