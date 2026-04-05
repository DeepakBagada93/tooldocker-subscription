'use client';

import { motion } from 'motion/react';
import { X, Megaphone, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative overflow-hidden bg-[#c7112c] text-white"
    >
      {/* Subtle shimmer effect */}
      <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.08)_37%,transparent_63%)]" />

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 py-2 text-xs font-medium sm:text-sm">
          <Megaphone className="h-3.5 w-3.5 flex-shrink-0 animate-pulse" />
          <span>Free shipping on orders above ₹5,000 — limited time offer</span>
          <Link
            href="/search"
            className="ml-1 hidden items-center gap-1 font-semibold underline underline-offset-4 transition-colors hover:opacity-80 sm:inline-flex"
          >
            Shop now
            <ArrowRight className="h-3 w-3" />
          </Link>
          <button
            onClick={() => setIsVisible(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/25"
            aria-label="Close announcement"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
