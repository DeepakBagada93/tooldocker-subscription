'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight, Search, TrendingUp, Zap, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const quickCategories = [
  { name: 'Power Tools', icon: '⚡', href: '/category/power-tools' },
  { name: 'Hand Tools', icon: '🔧', href: '/category/hand-tools' },
  { name: 'Construction', icon: '🏗️', href: '/category/construction-equipment' },
  { name: 'Safety Gear', icon: '🛡️', href: '/category/safety-equipment' },
  { name: 'Electrical', icon: '🔌', href: '/category/electrical' },
];

const typingWords = ['tools', 'machinery', 'site essentials'];

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
  {
    name: 'Welding Machine 200A',
    category: 'Welding',
    price: '₹12,999',
    rating: 4.6,
    reviews: 145,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80',
    badge: 'Hot Deal',
  },
];

const particleConfigs = Array.from({ length: 20 }, (_, index) => ({
  id: index,
  x: (index * 57) % 1200,
  y: 80 + ((index * 91) % 720),
  scale: 0.5 + ((index % 5) * 0.12),
  driftX: ((index % 7) - 3) * 14,
  duration: 10 + (index % 6) * 2,
}));

// Floating particles background
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particleConfigs.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute h-2 w-2 rounded-full bg-slate-300/30"
          initial={{
            x: particle.x,
            y: particle.y,
            scale: particle.scale,
          }}
          animate={{
            y: [null, -100],
            x: [null, particle.x + particle.driftX],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

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
      isDeleting ? 50 : 120
    );
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, wordIndex, words]);

  return (
    <span className="inline-block text-slate-800">
      {currentText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        className="inline-block w-[3px] h-[0.95em] bg-slate-800 ml-1 align-text-bottom"
      />
    </span>
  );
}

// Interactive search bar
function SearchBar() {
  const [isFocused, setIsFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.15 }}
      className="relative max-w-xl"
    >
      <div
        className={`relative flex items-center rounded-2xl border-2 bg-white transition-all duration-300 ${
          isFocused
            ? 'border-slate-800 shadow-xl shadow-slate-900/10 scale-105'
            : 'border-slate-200 shadow-lg shadow-slate-900/5'
        }`}
      >
        <Search className="ml-4 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search tools, machinery, equipment..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full bg-transparent px-4 py-4 text-sm outline-none placeholder:text-slate-400"
        />
        <Button
          asChild
          className="mr-2 h-10 rounded-xl bg-slate-900 px-6 text-white hover:bg-slate-800"
        >
          <Link href="/search">Search</Link>
        </Button>
      </div>

      {/* Quick suggestions */}
      <AnimatePresence>
        {isFocused && !searchValue && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -bottom-12 left-0 flex items-center gap-2 text-xs"
          >
            <TrendingUp className="h-3.5 w-3.5 text-slate-600" />
            <span className="text-slate-500">Popular:</span>
            {['Drill Machine', 'Welding', 'Safety Kit'].map((term) => (
              <button
                key={term}
                onClick={() => setSearchValue(term)}
                className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 transition-colors hover:bg-slate-800 hover:text-white"
              >
                {term}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  // Mouse tracking for interactive gradient
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden bg-gradient-to-br from-white via-[#fff8f9] to-[#fff5f6] min-h-screen flex items-center py-20 lg:py-0"
    >
      {/* Animated gradient that follows mouse */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(199, 17, 44, 0.06), transparent 40%)`,
        }}
      />

      {/* Floating particles */}
      <FloatingParticles />

      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #64748b 1px, transparent 0)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-slate-400 to-transparent" />

      <motion.div
        style={{ opacity, y: parallaxY }}
        className="container mx-auto px-4 relative z-10"
      >
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* LEFT: Content */}
          <div className="space-y-8">
            {/* Badge with animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-slate-100 to-slate-50 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-slate-700 border border-slate-200"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="h-2 w-2 rounded-full bg-slate-600"
              />
              India's #1 industrial marketplace
            </motion.div>

            {/* Heading with typing animation */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-5xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl"
              >
                Buy{' '}
                <span className="relative inline-block">
                  <TypingText words={typingWords} />
                  <span className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-slate-700 to-slate-500 rounded-full" />
                </span>
                <br />
                <span className="mt-2 block text-slate-800">
                  for real work in India.
                </span>
              </motion.h1>
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="max-w-lg text-lg leading-relaxed text-slate-600"
            >
              Search faster, compare clearly, and order quality industrial products built for contractors, builders, and B2B buyers.
            </motion.p>

            {/* Interactive Search Bar */}
            <SearchBar />

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Button
                asChild
                size="lg"
                className="group h-14 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-700 px-8 text-white hover:opacity-90 shadow-2xl shadow-slate-900/30"
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
                className="h-14 rounded-2xl border-2 border-slate-300 bg-white px-8 text-slate-900 hover:bg-slate-50 hover:border-slate-500"
              >
                <Link href="/search">
                  View All Products
                </Link>
              </Button>
            </motion.div>

            {/* Category Pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              className="flex flex-wrap items-center gap-3"
            >
              <Zap className="h-4 w-4 text-slate-600" />
              {quickCategories.map((category, idx) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="group rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-800 hover:text-white hover:shadow-lg hover:shadow-slate-900/20 hover:-translate-y-0.5"
                >
                  <span className="mr-1.5">{category.icon}</span>
                  {category.name}
                </Link>
              ))}
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.7 }}
              className="flex flex-wrap items-center gap-6 pt-4"
            >
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-slate-900">4.8/5</span>
                <span className="text-xs text-slate-500">(2.3k reviews)</span>
              </div>
              <div className="h-4 w-px bg-slate-300" />
              <div className="text-sm text-slate-600">
                <span className="font-bold text-slate-900">10,000+</span> happy customers
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Interactive Product Showcase */}
          <div className="relative">
            {/* Floating badges */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -right-4 top-8 z-20 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-slate-900/10"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Trending Now</div>
                  <div className="text-[10px] text-slate-500">+250% sales this month</div>
                </div>
              </div>
            </motion.div>

            {/* Main product slider */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-900/15 border border-slate-100">
                {/* Animated product content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="absolute inset-0 flex flex-col"
                  >
                    {/* Product image */}
                    <div className="relative flex-1 overflow-hidden">
                      <Image
                        src={sliderProducts[currentSlide].image}
                        alt={sliderProducts[currentSlide].name}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                      {/* Badge */}
                      <div className="absolute left-4 top-4 rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 px-3 py-1.5 text-xs font-bold text-white">
                        {sliderProducts[currentSlide].badge}
                      </div>

                      {/* Quick view button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-colors hover:bg-white"
                      >
                        <Search className="h-5 w-5 text-slate-700" />
                      </motion.button>
                    </div>

                    {/* Product info */}
                    <div className="relative bg-white p-6">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        {sliderProducts[currentSlide].category}
                      </div>
                      <div className="text-xl font-bold text-slate-900 mb-2">
                        {sliderProducts[currentSlide].name}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-slate-900">
                          {sliderProducts[currentSlide].price}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                          <span className="text-sm font-semibold text-slate-900">
                            {sliderProducts[currentSlide].rating}
                          </span>
                          <span className="text-xs text-slate-500">
                            ({sliderProducts[currentSlide].reviews})
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110"
                  aria-label="Previous product"
                >
                  <ChevronLeft className="h-6 w-6 text-slate-700" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110"
                  aria-label="Next product"
                >
                  <ChevronRight className="h-6 w-6 text-slate-700" />
                </button>

                {/* Dot indicators */}
                <div className="absolute bottom-[7.5rem] left-1/2 z-20 flex -translate-x-1/2 gap-2">
                  {sliderProducts.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? 'h-2.5 w-8 bg-slate-800'
                          : 'h-2.5 w-2.5 bg-slate-300 hover:bg-slate-500'
                      }`}
                      aria-label={`Go to product ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-4 -left-4 -z-10 h-full w-full rounded-3xl border-2 border-slate-200" />
              <div className="absolute -bottom-8 -left-8 -z-20 h-full w-full rounded-3xl border-2 border-slate-100" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Scroll to explore
          </span>
          <div className="h-8 w-5 rounded-full border-2 border-slate-400 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-slate-600"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
