'use client';

import React, { useCallback, useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Plus, X, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

  const handleUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      setIsUploading(true);
      const newUrls = [...value];

      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
          const filePath = `products/${fileName}`;

          const { error: uploadError, data } = await supabase.storage
            .from('product-images')
            .upload(filePath, file);

          if (uploadError) {
            console.error('Upload error:', uploadError);
            continue;
          }

          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

          newUrls.push(publicUrl);
        }

        onChange(newUrls);
      } catch (error) {
        console.error('Error uploading images:', error);
      } finally {
        setIsUploading(false);
      }
    },
    [value, onChange, supabase]
  );

  const removeImage = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {value.map((url, index) => (
          <div key={url} className="group relative aspect-square overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
            <Image
              src={url}
              alt={`Product ${index + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              disabled={disabled}
              className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg transition-transform hover:scale-110 disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>
            {index === 0 && (
              <Badge className="absolute bottom-2 left-2 z-10 bg-slate-900 text-[10px] text-white">Main</Badge>
            )}
          </div>
        ))}

        <label className={`flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-200 bg-white transition-colors hover:bg-stone-50 ${disabled || isUploading ? 'cursor-not-allowed opacity-50' : ''}`}>
          {isUploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
          ) : (
            <>
              <UploadCloud className="h-6 w-6 text-stone-400" />
              <span className="text-xs font-medium text-stone-500">Upload Images</span>
            </>
          )}
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={disabled || isUploading}
          />
        </label>
      </div>
      
      {value.length > 0 && (
        <p className="text-xs text-stone-500">
          The first image will be used as the main product thumbnail.
        </p>
      )}
    </div>
  );
}
