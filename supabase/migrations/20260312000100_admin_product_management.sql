-- ==========================================
-- ADMIN PRODUCT MANAGEMENT + BULK IMPORT
-- ==========================================

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS vendor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS sale_price DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS sku TEXT,
  ADD COLUMN IF NOT EXISTS stock_quantity INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS condition TEXT NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS brand TEXT,
  ADD COLUMN IF NOT EXISTS weight TEXT,
  ADD COLUMN IF NOT EXISTS dimensions JSONB NOT NULL DEFAULT '{"length":"","width":"","height":""}'::jsonb,
  ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}'::text[];

UPDATE public.products p
SET vendor_id = s.vendor_id
FROM public.stores s
WHERE p.store_id = s.id
  AND p.vendor_id IS NULL;

UPDATE public.products
SET stock_quantity = COALESCE(stock_quantity, inventory_count, 0)
WHERE stock_quantity IS NULL OR stock_quantity <> COALESCE(inventory_count, 0);

UPDATE public.products
SET images = COALESCE(images, '{}'::text[]),
    tags = COALESCE(tags, '{}'::text[]),
    dimensions = COALESCE(dimensions, '{"length":"","width":"","height":""}'::jsonb),
    condition = COALESCE(NULLIF(BTRIM(condition), ''), 'new');

ALTER TABLE public.products
  ALTER COLUMN images SET DEFAULT '{}'::text[],
  ALTER COLUMN tags SET DEFAULT '{}'::text[];

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'products_sale_price_non_negative'
  ) THEN
    ALTER TABLE public.products
      ADD CONSTRAINT products_sale_price_non_negative CHECK (sale_price IS NULL OR sale_price >= 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'products_sale_price_lte_price'
  ) THEN
    ALTER TABLE public.products
      ADD CONSTRAINT products_sale_price_lte_price CHECK (sale_price IS NULL OR sale_price <= price);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'products_stock_quantity_non_negative'
  ) THEN
    ALTER TABLE public.products
      ADD CONSTRAINT products_stock_quantity_non_negative CHECK (stock_quantity >= 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'products_condition_valid'
  ) THEN
    ALTER TABLE public.products
      ADD CONSTRAINT products_condition_valid CHECK (condition IN ('new', 'used', 'refurbished'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_products_vendor_id ON public.products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_stock_quantity ON public.products(stock_quantity);
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_sku_unique
  ON public.products (LOWER(BTRIM(sku)))
  WHERE sku IS NOT NULL AND BTRIM(sku) <> '';

CREATE TABLE IF NOT EXISTS public.product_imports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('csv', 'excel')),
  total_products INTEGER NOT NULL DEFAULT 0 CHECK (total_products >= 0),
  success_count INTEGER NOT NULL DEFAULT 0 CHECK (success_count >= 0),
  failed_count INTEGER NOT NULL DEFAULT 0 CHECK (failed_count >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'partial')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_import_rows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  import_id UUID NOT NULL REFERENCES public.product_imports(id) ON DELETE CASCADE,
  row_number INTEGER NOT NULL,
  product_name TEXT,
  sku TEXT,
  vendor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('completed', 'failed')),
  error_messages TEXT[] NOT NULL DEFAULT '{}'::text[],
  product_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_imports_created_by ON public.product_imports(created_by);
CREATE INDEX IF NOT EXISTS idx_product_imports_created_at ON public.product_imports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_import_rows_import_id ON public.product_import_rows(import_id);
CREATE INDEX IF NOT EXISTS idx_product_import_rows_status ON public.product_import_rows(status);
CREATE INDEX IF NOT EXISTS idx_product_import_rows_product_id ON public.product_import_rows(product_id);

ALTER TABLE public.product_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_import_rows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage product imports" ON public.product_imports;
CREATE POLICY "Admins manage product imports"
ON public.product_imports
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins manage product import rows" ON public.product_import_rows;
CREATE POLICY "Admins manage product import rows"
ON public.product_import_rows
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  10485760,
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
CREATE POLICY "Admins can upload product images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;
CREATE POLICY "Admins can update product images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'product-images' AND public.is_admin())
WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;
CREATE POLICY "Admins can delete product images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'product-images' AND public.is_admin());