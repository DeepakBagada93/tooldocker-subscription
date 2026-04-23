'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight, Search, TrendingUp, Zap, Star, ShieldCheck, Truck, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const typingWords = ['industrial tools', 'machinery', 'workshop gear'];

const sliderProducts = [
  {
    name: 'Bosch GSB 500W Drill',
    category: 'Power Tools',
    price: '₹3,299',
    rating: 4.8,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    badge: 'Bestseller',
  },
  {
    name: 'DeWalt Angle Grinder',
    category: 'Hand Tools',
    price: '₹4,599',
    rating: 4.7,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&q=80',
    badge: 'New Arrival',
  },
  {
    name: 'Industrial Safety Helmet',
    category: 'Safety Gear',
    price: '₹499',
    rating: 4.9,
    reviews: 567,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80',
    badge: 'Top Rated',
  },
];

const b2bBenefits = [
  { icon: ShieldCheck, label: 'Verified Vendors' },
  { icon: FileText, label: 'GST Invoices' },
  { icon: Truck, label: 'Bulk Logistics' },
];

// Typing animation
function TypingText({ words }: { words: string[] }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentText, setCurrentText] = useState('');

  useEffect(() => {
    const currentWord = words[wordIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setCurrentText(currentWord.substring(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
          if (charIndex + 1 === currentWord.length) {
            setTimeout(() => setIsDeleting(true), 1500);
          }
        } else {
          setCurrentText(currentWord.substring(0, charIndex - 1));
          setCharIndex((prev) => prev - 1);
          if (charIndex - 1 === 0) {
            setIsDeleting(false);
            setWordIndex((prev) => (prev + 1) % words.length);
          }
        }
      },
      isDeleting ? 40 : 100
    );
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, wordIndex, words]);

  return (
    <span className="inline-block text-slate-900 min-w-[200px]">
      {currentText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        className="inline-block w-[3px] h-[0.95em] bg-primary ml-1 align-text-bottom"
      />
    </span>
  );
}

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % sliderProducts.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + sliderProducts.length) % sliderProducts.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden bg-white min-h-[90vh] flex items-center pt-32 pb-20 lg:pt-20 lg:pb-0"
    >
      {/* Clean background pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <motion.div
        style={{ opacity, y: parallaxY }}
        className="container mx-auto px-4 relative z-10"
      >
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* LEFT: Content */}
          <div className="space-y-10">
            {/* Direct Value Statement */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 rounded-full bg-slate-50 border border-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-600"
            >
              <Zap className="h-3.5 w-3.5 text-primary fill-primary" />
              India&apos;s Smartest B2B Sourcing Hub
            </motion.div>

            {/* Sharp Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl font-black leading-[1.05] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl"
            >
              The easiest way to procure <br />
              <TypingText words={typingWords} />
            </motion.h1>

            {/* Simple Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-lg text-lg text-slate-500 font-medium leading-relaxed"
            >
              A purpose-built marketplace for Indian contractors and procurement teams. Verified vendors, transparent pricing, and seamless GST invoicing.
            </motion.p>

            {/* Engagement Actions */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Button
                asChild
                size="lg"
                className="group h-14 rounded-full bg-slate-900 px-8 text-white hover:bg-slate-800 shadow-xl shadow-slate-200"
              >
                <Link href="/search">
                  Browse Catalog
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 rounded-full border-2 border-slate-200 bg-white px-8 text-slate-900 hover:bg-slate-50"
              >
                <Link href="/register">
                  Register as Buyer
                </Link>
              </Button>
            </motion.div>

            {/* B2B Proof Points */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center gap-8 pt-4"
            >
              {b2bBenefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <benefit.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-bold text-slate-700 tracking-tight">{benefit.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT: Visual Showcase */}
          <div className="relative lg:block">
            {/* Animated card container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative mx-auto w-full max-w-md lg:max-w-lg"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] bg-slate-50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-100">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex flex-col"
                  >
                    <div className="relative flex-1 overflow-hidden p-6 pb-0">
                       <div className="relative h-full w-full overflow-hidden rounded-[1.5rem] shadow-inner">
                        <Image
                          src={sliderProducts[currentSlide].image}
                          alt={sliderProducts[currentSlide].name}
                          fill
                          className="object-cover"
                          priority
                          referrerPolicy="no-referrer"
                        />
                       </div>
                    </div>

                    <div className="p-8 pb-10">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-black uppercase tracking-widest text-primary">
                          {sliderProducts[currentSlide].category}
                        </span>
                        <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 border border-slate-100 shadow-sm">
                          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                          <span className="text-xs font-bold text-slate-900">{sliderProducts[currentSlide].rating}</span>
                        </div>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 mb-4">{sliderProducts[currentSlide].name}</h3>
                      <div className="flex items-center justify-between">
                        <div className="text-3xl font-black text-slate-900">{sliderProducts[currentSlide].price}</div>
                        <Button size="sm" className="rounded-full bg-slate-900 px-6 font-bold h-10">View Deal</Button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Simplified navigation */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/50 shadow-xl">
                  <button onClick={prevSlide} className="text-slate-900 hover:text-primary transition-colors"><ChevronLeft className="h-5 w-5" /></button>
                  <div className="flex gap-1.5">
                    {sliderProducts.map((_, idx) => (
                      <div key={idx} className={`h-1.5 rounded-full transition-all ${idx === currentSlide ? 'w-6 bg-slate-900' : 'w-1.5 bg-slate-300'}`} />
                    ))}
                  </div>
                  <button onClick={nextSlide} className="text-slate-900 hover:text-primary transition-colors"><ChevronRight className="h-5 w-5" /></button>
                </div>
              </div>

              {/* Decorative accent */}
              <div className="absolute -z-10 -bottom-6 -right-6 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
              <div className="absolute -z-10 -top-6 -left-6 h-64 w-64 rounded-full bg-slate-100 blur-3xl" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
