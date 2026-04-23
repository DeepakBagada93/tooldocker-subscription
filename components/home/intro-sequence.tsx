'use client';

import React, { useEffect } from 'react';
import { motion } from 'motion/react';

interface IntroSequenceProps {
  onComplete: () => void;
}

export function IntroSequence({ onComplete }: IntroSequenceProps) {
  const companyName = "TOOLDOCKER";
  const tagline = "THE FUTURE OF INDUSTRIAL SOURCING";

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Variants for staggered children animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex h-full w-full flex-col items-center justify-center bg-white overflow-hidden"
    >
      {/* Subtle Background Detail */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.03 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative text-center">
        {/* Main Title with staggered letters */}
        <motion.div className="flex overflow-hidden px-4">
          {companyName.split("").map((char, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              className="text-6xl font-black uppercase tracking-[-0.02em] text-slate-900 md:text-8xl lg:text-9xl"
            >
              {char}
            </motion.span>
          ))}
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="mt-6 overflow-hidden"
        >
          <p className="text-xs font-medium uppercase tracking-[0.6em] text-stone-400 md:text-sm">
            {tagline}
          </p>
        </motion.div>

        {/* Elegant Progress Line */}
        <div className="absolute -bottom-12 left-1/2 w-48 -translate-x-1/2 overflow-hidden rounded-full bg-stone-100 md:w-64">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ delay: 0.5, duration: 3.5, ease: "linear" }}
            className="h-[2px] w-full bg-slate-900"
          />
        </div>
      </div>

      {/* Aesthetic Accents */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-12 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-stone-300 font-bold">
          EST. 2026
        </span>
      </motion.div>
    </motion.div>
  );
}
