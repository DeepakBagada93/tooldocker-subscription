import { getPublishedProducts } from '@/app/actions/products';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductAnimatedGrid } from './product-animated-grid';

export async function FeaturedProducts() {
  const products = await getPublishedProducts({ limit: 4 });
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500 dark:text-stone-400">Featured products</div>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-900 dark:text-white sm:text-4xl">
              Fast-moving products buyers can evaluate without friction.
            </h2>
            <p className="text-base leading-7 text-stone-600 dark:text-slate-300">
              This section is built for high-intent buying: clear pricing, visible stock, concise descriptions, and category context that helps teams shortlist products quickly.
            </p>
          </div>
          <Button asChild variant="ghost" className="rounded-full px-0 text-slate-900 hover:bg-transparent hover:text-primary dark:text-white">
            <Link href="/search">
              View all products <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <ProductAnimatedGrid products={products} />
      </div>
    </section>
  );
}
