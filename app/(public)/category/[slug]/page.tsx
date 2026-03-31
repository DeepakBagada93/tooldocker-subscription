import { getCategories, getPublishedProducts } from '@/app/actions/products';
import { ProductCard } from '@/components/product/product-card';
import { FilterSidebar } from '@/components/product/filter-sidebar';
import { Button } from '@/components/ui/button';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find(c => c.slug === slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = await getPublishedProducts({ categorySlug: slug });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Home / Categories / <span className="text-foreground font-medium">{category.name}</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase">{category.name}</h1>
          <p className="text-muted-foreground max-w-2xl">
            Browse our extensive collection of professional-grade {category.name.toLowerCase()} from verified industrial suppliers.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <FilterSidebar />
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Controls */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="text-sm font-medium">
                Showing <span className="text-primary">{categoryProducts.length}</span> products
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" className="lg:hidden">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sort by:</span>
                  <Button variant="ghost" size="sm" className="font-bold">
                    Newest First
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Grid */}
            {categoryProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product as any} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-4 border-2 border-dashed rounded-[3rem]">
                <div className="text-4xl font-black text-slate-200 uppercase tracking-tighter">No Products Found</div>
                <p className="text-muted-foreground">We couldn&apos;t find any products in this category at the moment.</p>
                <Button variant="outline" asChild>
                    <Link href="/search">View All Products</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';
