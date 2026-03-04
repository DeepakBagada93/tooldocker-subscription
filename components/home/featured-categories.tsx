import { CATEGORIES as MOCK_CATEGORIES } from '@/lib/mock-data';
import { Box } from 'lucide-react';
import Link from 'next/link';

export function FeaturedCategories() {
  return (
    <section className="py-20 bg-workshop-bg dark:bg-workshop-dark/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tighter uppercase">Shop by Category</h2>
            <p className="text-muted-foreground">Explore our massive inventory of industrial supplies.</p>
          </div>
          <Link href="/categories" className="text-primary font-bold hover:underline flex items-center">
            View All Categories
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {MOCK_CATEGORIES.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/category/${cat.slug}`}
              className="group relative overflow-hidden bg-white dark:bg-workshop-dark p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary hover:shadow-xl transition-all duration-300"
            >
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Box className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-1">{cat.name}</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Browse Items</p>
              
              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
