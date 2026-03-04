import { getCategories } from '@/app/actions/products';
import { Button } from '@/components/ui/button';
import { ArrowRight, Box } from 'lucide-react';
import Link from 'next/link';
import { CategoryAnimatedGrid } from './category-animated-grid';

export async function FeaturedCategories() {
  const categories = await getCategories();

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 uppercase text-slate-900 dark:text-white">Industrial Categories</h2>
            <p className="text-base text-muted-foreground">Browse equipment by your specific sector</p>
          </div>
          <Button variant="ghost" className="hidden sm:flex" asChild>
            <Link href="/products">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <CategoryAnimatedGrid categories={categories} />
      </div>
    </section>
  );
}
