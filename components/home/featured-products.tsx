import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import { PRODUCTS as MOCK_PRODUCTS } from '@/lib/mock-data';

export function FeaturedProducts() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tighter uppercase">Trending Industrial Tools</h2>
            <p className="text-muted-foreground">Most popular items across our marketplace this week.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full">New Arrivals</Button>
            <Button variant="outline" className="rounded-full">Top Rated</Button>
            <Button variant="industrial" className="rounded-full">View All</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
