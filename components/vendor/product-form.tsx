'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Loader2, Layers } from 'lucide-react';
import { createVendorProduct } from '@/app/actions/vendor';

async function getResponseMessage(response: Response, fallbackMessage: string) {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const payload = await response.json().catch(() => null);
    if (payload && typeof payload === 'object' && 'error' in payload && typeof payload.error === 'string') {
      return payload.error;
    }
    if (payload && typeof payload === 'object' && 'message' in payload && typeof payload.message === 'string') {
      return payload.message;
    }
  }

  return fallbackMessage;
}

const categories = ['Heavy Machinery', 'Power Tools', 'Welding', 'Safety Gear'];

interface ProductFormProps {
  isLocked: boolean;
}

export function ProductForm({ isLocked }: ProductFormProps) {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: '',
    category_id: '',
    description: '',
    price: '',
    inventory: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateWithAI = async () => {
    if (!formData.title) {
      alert('Please enter a product name first to generate details.');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: formData.title,
          category: formData.category_id 
        }),
      });

      if (!res.ok) {
        throw new Error(await getResponseMessage(res, 'AI generation is unavailable right now.'));
      }

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('AI generation returned an unexpected response.');
      }

      const data = await res.json();
      
      if (data.description) {
        setFormData(prev => ({
          ...prev,
          description: data.description,
          price: data.price?.toString() || prev.price,
          tags: data.tags?.join(', ') || '',
        }));
      }
    } catch (error) {
      console.error('AI generation failed', error);
      alert(error instanceof Error ? error.message : 'AI generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <form action={createVendorProduct} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-xl font-black tracking-tighter uppercase">Basic Information</h2>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="gap-2 text-primary border-primary/20 hover:bg-primary/5 rounded-full"
              onClick={generateWithAI}
              disabled={isLocked || isGenerating || !formData.title}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Generate with AI
            </Button>
          </div>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Product Name</label>
              <Input 
                name="title" 
                placeholder="e.g. Industrial Hydraulic Press" 
                className="h-12" 
                required 
                disabled={isLocked}
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</label>
                <select
                  name="category_id"
                  className="h-12 w-full rounded-xl border bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isLocked}
                  value={formData.category_id}
                  onChange={handleInputChange}
                >
                  <option value="" disabled>Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category.toLowerCase().replace(/\s+/g, '-')}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Image URL</label>
                <Input name="image_url" placeholder="https://example.com/product-image.jpg" className="h-12" disabled={isLocked} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</label>
              <textarea
                name="description"
                className="h-40 w-full rounded-xl border bg-white p-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="Describe technical specifications, certifications, and delivery notes."
                disabled={isLocked}
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <h2 className="border-b pb-4 text-xl font-black tracking-tighter uppercase">Pricing & Inventory</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Base Price ($)</label>
              <Input 
                name="price" 
                type="number" 
                min="0" 
                step="0.01" 
                placeholder="0.00" 
                className="h-12" 
                required 
                disabled={isLocked}
                value={formData.price}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Stock Quantity</label>
              <div className="relative">
                <Layers className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  name="inventory" 
                  type="number" 
                  min="0" 
                  placeholder="0" 
                  className="h-12 pl-10" 
                  required 
                  disabled={isLocked}
                  value={formData.inventory}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="sticky top-8 rounded-3xl border bg-white p-8 shadow-sm">
          <h2 className="border-b pb-4 text-xl font-black tracking-tighter uppercase">Publish</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border bg-slate-50 p-4">
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Submission rule</div>
              <div className="mt-2 text-sm font-medium text-slate-700">Products stay unpublished until admin moderation is complete.</div>
            </div>
          </div>
          <div className="pt-6 space-y-3">
            <Button type="submit" variant="industrial" className="h-14 w-full text-lg font-bold uppercase tracking-tighter" disabled={isLocked}>
              {isLocked ? 'Subscription Required' : 'Submit Product'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
