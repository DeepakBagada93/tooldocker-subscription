'use client';

import * as React from 'react';
import { getCategories, type Category } from '@/app/actions/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function FilterSidebar() {
  const [priceRange, setPriceRange] = React.useState({ min: '', max: '' });
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);

  React.useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold tracking-[-0.03em] text-slate-900">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                checked={selectedCategories.includes(category.id)}
                onChange={() => toggleCategory(category.id)}
              />
              <span className="text-sm text-slate-700 transition-colors group-hover:text-primary">{category.name}</span>
            </label>
          ))}
          {categories.length === 0 && (
            <p className="text-xs text-stone-400 italic">No categories found</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold tracking-[-0.03em] text-slate-900">Price Range</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Min</span>
            <Input 
              type="number" 
              placeholder="$0" 
              className="border-stone-200 bg-[#fcfaf7]"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Max</span>
            <Input 
              type="number" 
              placeholder="$10k+" 
              className="border-stone-200 bg-[#fcfaf7]"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <Button className="w-full rounded-full" variant="industrial">
        Apply Filters
      </Button>
      
      <Button variant="ghost" className="w-full text-xs font-semibold uppercase tracking-[0.2em] text-stone-500 hover:bg-stone-100" onClick={() => {
        setPriceRange({ min: '', max: '' });
        setSelectedCategories([]);
      }}>
        Clear All
      </Button>
    </div>
  );
}
