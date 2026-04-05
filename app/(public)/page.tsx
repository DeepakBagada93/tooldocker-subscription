import { Hero } from '@/components/home/hero';
import { FeaturedProducts } from '@/components/home/featured-products';
import { TrustBar } from '@/components/home/trust-bar';
import { WhyTooldocker } from '@/components/home/why-tooldocker';
import { CTASection } from '@/components/home/cta-section';
import { CategoryScroll } from '@/components/home/category-scroll';
import { IndiaCoverage } from '@/components/home/india-coverage';

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <CategoryScroll />
      <FeaturedProducts />
      <IndiaCoverage />
      <WhyTooldocker />
      <CTASection />
    </>
  );
}
