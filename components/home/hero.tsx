'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Search, ShieldCheck, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const quickCategories = [
  'Power Tools',
  'Hand Tools',
  'Construction Equipment',
  'Safety Gear',
  'Electrical Supplies',
  'Welding Machines',
];

const sliderImages = [
  {
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    alt: 'Industrial warehouse with machinery and tools',
  },
  {
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80',
    alt: 'Construction equipment and safety gear',
  },
  {
    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80',
    alt: 'Electrical supplies and welding equipment',
  },
  {
    url: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800&q=80',
    alt: 'Power tools and hand tools for construction',
  },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fff8ed_0%,#fffdf8_42%,#f0ede5_100%)] py-16 text-slate-900 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(234,88,12,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(15,23,42,0.08),transparent_34%),linear-gradient(120deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.58)_42%,rgba(255,255,255,0)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/70 to-transparent" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 lg:col-span-7 lg:space-y-10"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/85 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-orange-700 shadow-[0_10px_30px_-20px_rgba(234,88,12,0.8)] backdrop-blur-sm"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>India's industrial marketplace</span>
            </motion.div>

            <h1 className="max-w-5xl text-5xl font-semibold leading-[0.92] tracking-[-0.06em] text-slate-900 sm:text-6xl lg:text-[5.4rem]">
              Buy tools,
              machinery, and
              site essentials
              <br className="hidden xl:block" />
              for real work in India.
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl"
            >
              Tooldocker is an ecommerce platform built for contractors, builders, plant teams, and B2B buyers. Search faster, compare clearly, and order quality industrial products with a checkout flow designed for the Indian market.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="grid gap-3 sm:grid-cols-2"
            >
              <div className="rounded-[1.75rem] border border-orange-100 bg-white/80 p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Search className="h-4 w-4 text-orange-600" />
                  Faster product discovery
                </div>
                <p className="text-sm leading-6 text-stone-600">
                  Browse by category, brand, price, and application with content written for industrial buyers, not generic shoppers.
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-orange-100 bg-slate-900 p-5 text-white shadow-[0_24px_60px_-40px_rgba(15,23,42,0.65)]">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  Verified quality products
                </div>
                <p className="text-sm leading-6 text-slate-200">
                  Every product is quality-checked and clearly described so buyers get exactly what they need for their projects.
                </p>
              </div>
            </motion.div>

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
              <Button asChild size="lg" variant="outline" className="h-12 w-full rounded-full border-orange-200 bg-white/85 px-8 text-base text-slate-900 hover:bg-orange-50 sm:h-14 sm:w-auto sm:text-lg">
                <Link href="/search">
                View All Products
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-3"
            >
              {quickCategories.map((category) => (
                <Link
                  key={category}
                  href="/search"
                  className="rounded-full border border-stone-200 bg-white/80 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-orange-300 hover:text-orange-700"
                >
                  {category}
                </Link>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="grid max-w-4xl gap-6 border-t border-stone-300/80 pt-10 sm:grid-cols-3"
            >
              <div className="space-y-1">
                <div className="text-3xl font-semibold text-slate-900">Quality Assured</div>
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Verified product standards</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-semibold text-slate-900">UPI Ready</div>
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">India-focused checkout path</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-semibold text-slate-900">Easy Search</div>
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Find products faster</div>
              </div>
            </motion.div>
          </motion.div>

          <div className="relative block lg:col-span-5">
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto overflow-hidden rounded-[2.5rem] border border-orange-100 bg-white p-4 shadow-[0_35px_90px_-50px_rgba(15,23,42,0.45)] lg:w-full lg:max-w-none">
              <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-[#f0ebe3]">
                <Image
                  src={sliderImages[currentSlide].url}
                  alt={sliderImages[currentSlide].alt}
                  fill
                  className="object-cover transition-all duration-700"
                  referrerPolicy="no-referrer"
                  priority={currentSlide === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#22160d]/55 via-[#22160d]/10 to-white/20" />

                {/* Slide indicators */}
                <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                  {sliderImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? 'w-8 bg-white'
                          : 'w-1.5 bg-white/50 hover:bg-white/70'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                <div className="absolute bottom-6 left-6 right-6 rounded-[1.75rem] border border-white/70 bg-white/88 p-5 shadow-lg backdrop-blur-xl">
                  <div className="space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-700">Built for Indian procurement teams</div>
                    <div className="text-2xl font-semibold leading-tight tracking-[-0.04em] text-slate-900">
                      Construction, electrical, fabrication, and maintenance products in one clear buying flow.
                    </div>
                    <div className="space-y-2 text-sm leading-6 text-slate-600">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        Thousands of industrial products to browse
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        Category-led shopping for bulk and repeat orders
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        Ready for UPI, cards, and GST invoicing
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -left-4 top-10 z-10 hidden w-52 rounded-[2rem] border border-orange-100 bg-white/90 p-4 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.45)] lg:block">
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">Popular demand</div>
              <div className="mt-2 text-lg font-semibold tracking-[-0.03em] text-slate-900">Tiles, concrete, cutting, safety, welding</div>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                High-intent categories highlighted for contractors and industrial buyers.
              </p>
            </div>
            <div className="absolute -right-6 top-10 h-32 w-32 rounded-full bg-orange-300/25 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-slate-200/60 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
