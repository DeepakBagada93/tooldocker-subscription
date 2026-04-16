'use client';

import * as React from 'react';
import Link from 'next/link';
import { X, Wrench, Factory, ArrowRight, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Button } from '@/components/ui/button';

const FEATURED_PILLS = ['Hand Tools', 'Power Machines', 'Workshop Gear'];

export function PromoPopup() {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsOpen(true);
    }, 1200);

    return () => window.clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Close popup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', damping: 24, stiffness: 260 }}
            className="fixed left-1/2 top-1/2 z-[101] w-[calc(100%-1.5rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative overflow-hidden rounded-[2rem] border border-stone-200 bg-[linear-gradient(145deg,#fffaf2_0%,#fff_45%,#f5efe2_100%)] shadow-[0_40px_120px_-40px_rgba(15,23,42,0.45)]">
              <button
                type="button"
                onClick={handleClose}
                className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/90 text-slate-500 shadow-sm transition hover:text-slate-900"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="grid gap-0 md:grid-cols-[1.05fr_0.95fr]">
                <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(214,48,49,0.22),transparent_38%),linear-gradient(160deg,#111827_0%,#1f2937_55%,#7c2d12_100%)] p-8 text-white sm:p-10">
                  <div className="absolute -right-12 top-10 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
                  <div className="absolute bottom-0 left-0 h-24 w-full bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.08)_100%)]" />

                  <div className="relative z-10">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em]">
                      <Sparkles className="h-3.5 w-3.5" />
                      Tooldocker Picks
                    </div>

                    <h2 className="max-w-sm text-3xl font-black uppercase leading-none tracking-[-0.06em] sm:text-4xl">
                      Best Tools & Machines
                    </h2>

                    <p className="mt-4 max-w-md text-sm leading-6 text-white/80 sm:text-base">
                      Buy workshop-ready machines, trusted hand tools, and industrial equipment picked for Indian buyers.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {FEATURED_PILLS.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-white/90"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative p-8 sm:p-10">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#efe4cf] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#8a4b08]">
                    Ready To Shop
                  </div>

                  <h3 className="max-w-md text-2xl font-black leading-tight tracking-[-0.04em] text-slate-900 sm:text-3xl">
                    Discover top-rated machines for your shop floor.
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-6 text-stone-600">
                    Explore grinders, cutting tools, drilling machines, welding gear, and more from Tooldocker&apos;s featured range.
                  </p>

                  <div className="mt-6 grid gap-3">
                    <div className="rounded-2xl border border-stone-200 bg-white/80 p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f3ede4] text-slate-900">
                          <Wrench className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">Best-selling tools</p>
                          <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Daily workshop essentials</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-stone-200 bg-white/80 p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f3ede4] text-slate-900">
                          <Factory className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">Industrial machines</p>
                          <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Reliable gear for growing businesses</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Button asChild className="h-12 flex-1 rounded-full px-6 text-sm font-bold uppercase tracking-[0.12em]" variant="industrial">
                      <Link href="/search" onClick={handleClose}>
                        Shop Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 rounded-full border-stone-300 px-6 text-sm font-bold uppercase tracking-[0.12em]"
                      onClick={handleClose}
                    >
                      Continue Browsing
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
