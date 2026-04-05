'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const quickCategories = [
  'Power Tools',
  'Hand Tools',
  'Construction Equipment',
  'Safety Gear',
  'Electrical Supplies',
];

// Words that cycle with typing animation
const typingWords = ['tools', 'machinery', 'site essentials'];

const sliderProducts = [
  {
    name: 'Bosch GSB 500W Drill',
    category: 'Power Tools',
    price: '₹3,299',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
  },
  {
    name: 'DeWalt Angle Grinder',
    category: 'Hand Tools',
    price: '₹4,599',
    image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&q=80',
  },
  {
    name: 'Industrial Safety Helmet',
    category: 'Safety Gear',
    price: '₹499',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80',
  },
  {
    name: 'Welding Machine 200A',
    category: 'Welding',
    price: '₹12,999',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80',
  },
];

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
            // Pause at end before deleting
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
    <span className="inline-block text-[#c7112c]">
      {currentText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        className="inline-block w-[2px] h-[0.9em] bg-[#c7112c] ml-0.5 align-text-bottom"
      />
    </span>
  );
}

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % sliderProducts.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + sliderProducts.length) % sliderProducts.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section className="relative overflow-hidden bg-white py-16 text-slate-900 lg:py-24">
      {/* Subtle red accent top line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c7112c]/40 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* LEFT: Text with typing animation */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full border border-[#c7112c]/20 bg-[#fff5f6] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c7112c]"
            >
              India's industrial marketplace
            </motion.div>

            {/* Heading with typing animation */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold leading-tight tracking-tight text-black sm:text-5xl lg:text-[3.4rem]"
              >
                Buy{' '}
                <TypingText words={typingWords} />
                <br />
                <span className="text-[#c7112c]">for real work in India.</span>
              </motion.h1>
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg"
            >
              Search faster compare clearly and order quality industrial products built for contractors builders and B2B buyers
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.05 }}
              className="flex flex-wrap items-center gap-3"
            >
              <Button asChild size="lg" className="h-12 rounded-full bg-[#c7112c] px-8 text-white hover:bg-[#a50e23] shadow-lg shadow-[#c7112c]/25">
                <Link href="/search">
                  Browse Catalog <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-2 border-[#c7112c]/30 bg-white px-8 text-[#c7112c] hover:bg-[#c7112c] hover:text-white hover:border-[#c7112c]">
                <Link href="/search">View All Products</Link>
              </Button>
            </motion.div>

            {/* Category Pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="flex flex-wrap items-center gap-2"
            >
              {quickCategories.map((category) => (
                <Link
                  key={category}
                  href="/search"
                  className="rounded-full border-2 border-[#c7112c]/15 bg-[#fff5f6] px-4 py-1.5 text-sm font-medium text-[#c7112c] transition-all hover:bg-[#c7112c] hover:text-white hover:border-[#c7112c]"
                >
                  {category}
                </Link>
              ))}
            </motion.div>
          </div>

          {/* RIGHT: 1:1 Product Slider */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-stone-100 shadow-xl shadow-[#c7112c]/10">
              {/* Animated product content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="absolute inset-0 flex flex-col"
                >
                  {/* Product image */}
                  <div className="relative flex-1 overflow-hidden">
                    <Image
                      src={sliderProducts[currentSlide].image}
                      alt={sliderProducts[currentSlide].name}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>

                  {/* Product info */}
                  <div className="relative bg-white p-5">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#c7112c]">
                      {sliderProducts[currentSlide].category}
                    </div>
                    <div className="mt-1 text-lg font-semibold text-black">
                      {sliderProducts[currentSlide].name}
                    </div>
                    <div className="mt-1 text-xl font-bold text-[#c7112c]">
                      {sliderProducts[currentSlide].price}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md transition-colors hover:bg-white"
                aria-label="Previous product"
              >
                <ChevronLeft className="h-5 w-5 text-[#c7112c]" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md transition-colors hover:bg-white"
                aria-label="Next product"
              >
                <ChevronRight className="h-5 w-5 text-[#c7112c]" />
              </button>

              {/* Dot indicators */}
              <div className="absolute bottom-[5.5rem] left-1/2 z-20 flex -translate-x-1/2 gap-2">
                {sliderProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'h-2 w-6 bg-[#c7112c]'
                        : 'h-2 w-2 bg-[#c7112c]/30 hover:bg-[#c7112c]/50'
                    }`}
                    aria-label={`Go to product ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
