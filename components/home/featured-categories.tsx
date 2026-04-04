import { getCategories } from '@/app/actions/products';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { CategoryAnimatedGrid } from './category-animated-grid';

export async function FeaturedCategories() {
  const categories = await getCategories();

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="bg-[linear-gradient(180deg,#f7f3ed_0%,#fffdf8_100%)] py-24">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex flex-col gap-5 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">Browse by department</div>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-900 sm:text-4xl">
              Explore all categories built for industrial and construction buying.
            </h2>
            <p className="text-base leading-7 text-stone-600">
              Power tools, machinery, safety equipment, site supplies, and maintenance essentials are grouped to make product discovery faster for contractors, builders, and B2B procurement teams.
            </p>
          </div>
          <Button variant="ghost" className="hidden rounded-full px-0 text-slate-900 hover:bg-transparent hover:text-primary sm:flex" asChild>
            <Link href="/search">
              Search all products <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <CategoryAnimatedGrid categories={categories} />
      </div>
    </section>
  );
}
