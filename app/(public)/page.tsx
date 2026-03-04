import { Hero } from '@/components/home/hero';
import { FeaturedCategories } from '@/components/home/featured-categories';
import { FeaturedProducts } from '@/components/home/featured-products';
import { TrustBar } from '@/components/home/trust-bar';
import { WhyTooldocker } from '@/components/home/why-tooldocker';
import { CTASection } from '@/components/home/cta-section';

export default function Home() {
  return (
    <>
      <Hero />

      <TrustBar />
      <FeaturedCategories />
      <FeaturedProducts />
      <WhyTooldocker />
      <CTASection />
    </>
  );
}
