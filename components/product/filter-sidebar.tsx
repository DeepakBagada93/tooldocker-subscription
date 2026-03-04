'use client';

import * as React from 'react';
import { CATEGORIES } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export function FilterSidebar() {
  const [priceRange, setPriceRange] = React.useState({ min: '', max: '' });
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-bold text-lg mb-4 uppercase tracking-tighter">Categories</h3>
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <label key={category.id} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                checked={selectedCategories.includes(category.id)}
                onChange={() => toggleCategory(category.id)}
              />
              <span className="text-sm group-hover:text-primary transition-colors">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-lg mb-4 uppercase tracking-tighter">Price Range</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground uppercase font-bold">Min</span>
            <Input 
              type="number" 
              placeholder="$0" 
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground uppercase font-bold">Max</span>
            <Input 
              type="number" 
              placeholder="$10k+" 
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-lg mb-4 uppercase tracking-tighter">Vendor Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2].map((rating) => (
            <label key={rating} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
              <span className="text-sm group-hover:text-primary transition-colors">{rating}+ Stars</span>
            </label>
          ))}
        </div>
      </div>

      <Button className="w-full" variant="industrial">
        Apply Filters
      </Button>
      
      <Button variant="ghost" className="w-full text-xs uppercase font-bold tracking-widest" onClick={() => {
        setPriceRange({ min: '', max: '' });
        setSelectedCategories([]);
      }}>
        Clear All
      </Button>
    </div>
  );
}
