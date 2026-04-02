alter table public.products
  add column if not exists specifications jsonb not null default '{}'::jsonb check (jsonb_typeof(specifications) = 'object'),
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists deleted_at timestamptz;

create index if not exists idx_products_deleted_at on public.products (deleted_at);
