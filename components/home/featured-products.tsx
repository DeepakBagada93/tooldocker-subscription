import { getPublishedProducts } from '@/app/actions/products';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ProductAnimatedGrid } from './product-animated-grid';

export async function FeaturedProducts() {
  const products = await getPublishedProducts({ limit: 4 });
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 md:mb-12 gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase">Trending Industrial Tools</h2>
            <p className="text-base text-muted-foreground">Most popular items across our marketplace this week.</p>
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <Button variant="outline" className="rounded-full flex-1 md:flex-none">New Arrivals</Button>
            <Button variant="outline" className="rounded-full flex-1 md:flex-none">Top Rated</Button>
            <Button variant="industrial" className="rounded-full flex-1 md:flex-none">View All</Button>
          </div>
        </div>

        <ProductAnimatedGrid products={products} />
      </div>
    </section>
  );
}
