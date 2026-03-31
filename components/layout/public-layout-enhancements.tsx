'use client';

import dynamic from 'next/dynamic';

const FloatingButtons = dynamic(
  () => import('@/components/layout/floating-buttons').then((mod) => mod.FloatingButtons),
  { ssr: false }
);

const PromoPopup = dynamic(
  () => import('@/components/ui/promo-popup').then((mod) => mod.PromoPopup),
  { ssr: false }
);

export function PublicLayoutEnhancements() {
  return (
    <>
      <FloatingButtons />
      <PromoPopup />
    </>
  );
}
