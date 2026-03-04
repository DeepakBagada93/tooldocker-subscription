'use client';

import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck, Truck, Zap } from 'lucide-react';
import Image from 'next/image';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-workshop-dark text-white py-20 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 industrial-grid" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center space-x-2 bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-primary/30">
              <Zap className="h-3 w-3" />
              <span>Industrial Grade Marketplace</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9] uppercase">
              Heavy Duty <br />
              <span className="text-primary">Tools & Tech</span> <br />
              For Pros.
            </h1>
            
            <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
              The ultimate multivendor hub for industrial procurement. From high-precision CNC machines to heavy-duty safety gear. 
              Verified vendors. Guaranteed quality.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8 h-14" variant="industrial">
                Browse Catalog <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 h-14 border-slate-700 hover:bg-slate-800 text-white">
                Request a Quote
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-800">
              <div className="space-y-1">
                <div className="text-2xl font-bold">50k+</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest">Products</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold">1.2k+</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest">Vendors</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold">24h</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest">Avg. Quote</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-square rounded-3xl overflow-hidden border-8 border-slate-800 shadow-2xl">
              <Image 
                src="https://picsum.photos/seed/industrial/800/800" 
                alt="Industrial Machinery" 
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-workshop-dark/80 to-transparent" />
              
              {/* Floating Cards */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center space-x-4"
              >
                <div className="bg-primary p-2 rounded-lg">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold">Verified Quality</div>
                  <div className="text-xs text-slate-300">All vendors are background checked</div>
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
