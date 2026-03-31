import { getPublishedProducts } from '@/app/actions/products';
import { ProductCard } from '@/components/product/product-card';
import { FilterSidebar } from '@/components/product/filter-sidebar';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, SlidersHorizontal } from 'lucide-react';

export default async function SearchPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await props.searchParams;
  const query = typeof params.q === 'string' ? params.q : '';

  // Fetch products from Supabase (with fallback to mock data implemented in the action)
  const allProducts = await getPublishedProducts();

  const results = allProducts.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.description.toLowerCase().includes(query.toLowerCase()) ||
    (p.category_name || '').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
...
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-[-0.05em] text-slate-900 lg:text-6xl">
            Search Results
          </h1>
          <div className="flex items-center gap-2 text-stone-500">
            <SearchIcon className="h-4 w-4" />
            <span>Showing results for <span className="font-semibold text-slate-900">&quot;{query}&quot;</span></span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
              <FilterSidebar />
            </div>
          </aside>

          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div className="text-sm font-medium">
                Found <span className="text-primary">{results.length}</span> matches
              </div>
              <Button variant="outline" size="sm" className="border-stone-300 bg-white lg:hidden">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product as any} />
                ))}
              </div>
            ) : (
              <div className="space-y-6 rounded-[2rem] border-2 border-dashed border-stone-200 bg-[#fcfaf7] py-20 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f3ede4]">
                  <SearchIcon className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-900">No matches found</h3>
                  <p className="mx-auto max-w-md text-stone-600">
                    We couldn&apos;t find anything matching your search. Try checking for typos or using more general terms.
                  </p>
                </div>
                <Button variant="industrial" className="rounded-full">Browse All Products</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
