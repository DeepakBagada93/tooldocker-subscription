import { Hero } from '@/components/home/hero';
import { FeaturedProducts } from '@/components/home/featured-products';
import { TrustBar } from '@/components/home/trust-bar';
import { WhyTooldocker } from '@/components/home/why-tooldocker';
import { CTASection } from '@/components/home/cta-section';
import { CategoryScroll } from '@/components/home/category-scroll';
import { IndiaCoverage } from '@/components/home/india-coverage';
import { HomeClient } from '@/components/home/home-client';

export default async function Home() {
  return (
    <HomeClient>
      <Hero />
      <TrustBar />
      <CategoryScroll />
      <FeaturedProducts />
      <IndiaCoverage />
      <WhyTooldocker />
      <CTASection />
    </HomeClient>
  );
}
