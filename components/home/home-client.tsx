'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { IntroSequence } from '@/components/home/intro-sequence';

interface HomeClientProps {
  children: React.ReactNode;
}

export function HomeClient({ children }: HomeClientProps) {
  const [showIntro, setShowIntro] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Removed sessionStorage check to ensure it shows on every refresh as requested
  }, []);

  const handleComplete = () => {
    setShowIntro(false);
    // Scroll to top when intro completes
    window.scrollTo(0, 0);
  };

  if (!isMounted) {
    return <div className="opacity-0">{children}</div>;
  }

  return (
    <div className={showIntro ? "overflow-hidden h-screen" : ""}>
      {showIntro && (
        <style dangerouslySetInnerHTML={{ __html: `
          header, footer, .announcement-bar, .floating-buttons, [role="dialog"], .fixed.inset-0.z-\\[101\\], .fixed.inset-0.bg-slate-950\\/70 {
            display: none !important;
          }
        ` }} />
      )}
      <AnimatePresence mode="wait">
        {showIntro ? (
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="fixed inset-0 z-[200]"
          >
            <IntroSequence onComplete={handleComplete} />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
