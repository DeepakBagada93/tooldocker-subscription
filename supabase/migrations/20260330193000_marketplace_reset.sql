-- Consolidated reset migration for Tooldocker marketplace.
-- Warning: this migration is destructive for the listed public tables.
-- Note: existing files inside storage bucket `product-images` are not deleted here,
-- because large deletes in `storage.objects` can time out in the Supabase SQL editor.

create extension if not exists pgcrypto;

drop trigger if exists on_auth_user_created on auth.users;

drop policy if exists "Public product images are readable" on storage.objects;
drop policy if exists "Admins upload product images" on storage.objects;
drop policy if exists "Admins update product images" on storage.objects;
drop policy if exists "Admins delete product images" on storage.objects;

drop table if exists public.ai_cache cascade;
drop table if exists public.product_import_rows cascade;
drop table if exists public.product_imports cascade;
drop table if exists public.products cascade;
drop table if exists public.vendor_subscriptions cascade;
drop table if exists public.subscription_plans cascade;
drop table if exists public.categories cascade;
drop table if exists public.stores cascade;
drop table if exists public.profiles cascade;

drop function if exists public.handle_new_user() cascade;
drop function if exists public.is_admin() cascade;
drop function if exists public.current_app_role() cascade;
drop function if exists public.normalize_app_role(text) cascade;
drop function if exists public.set_updated_at() cascade;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.normalize_app_role(input_role text)
returns text
language sql
immutable
as $$
  select case
    when lower(coalesce(input_role, 'buyer')) in ('admin', 'vendor', 'buyer') then lower(coalesce(input_role, 'buyer'))
    else 'buyer'
  end;
$$;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  role text not null default 'buyer' check (role in ('admin', 'vendor', 'buyer')),
  full_name text,
  phone text,
  company_name text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.current_app_role()
returns text
language sql
stable
as $$
  select coalesce(
    (select p.role from public.profiles p where p.id = auth.uid()),
    public.normalize_app_role(auth.jwt() -> 'user_metadata' ->> 'role')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select public.current_app_role() = 'admin';
$$;

create table public.stores (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null unique references public.profiles (id) on delete cascade,
  store_name text not null,
  description text,
  logo_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.categories (id) on delete set null,
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.subscription_plans (
  id uuid primary key default gen_random_uuid(),
  plan_key text not null unique,
  slug text not null unique,
  name text not null,
  price numeric(12,2) not null default 0,
  billing_interval text not null check (billing_interval in ('monthly', 'yearly')),
  product_limit integer not null default 0,
  bulk_upload_enabled boolean not null default false,
  analytics_enabled boolean not null default false,
  custom_storefront_enabled boolean not null default false,
  support_level text,
  description text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.vendor_subscriptions (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.profiles (id) on delete cascade,
  plan_id uuid not null references public.subscription_plans (id) on delete restrict,
  status text not null default 'inactive' check (status in ('trialing', 'active', 'past_due', 'canceled', 'inactive')),
  billing_interval text check (billing_interval in ('monthly', 'yearly')),
  start_date timestamptz not null default timezone('utc', now()),
  end_date timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references public.profiles (id) on delete set null,
  store_id uuid not null references public.stores (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,
  title text not null,
  description text,
  price numeric(12,2) not null default 0 check (price >= 0),
  sale_price numeric(12,2) check (sale_price is null or sale_price >= 0),
  sku text unique,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  inventory_count integer not null default 0 check (inventory_count >= 0),
  condition text not null default 'new' check (condition in ('new', 'used', 'refurbished')),
  brand text,
  weight text,
  dimensions jsonb not null default '{}'::jsonb check (jsonb_typeof(dimensions) = 'object'),
  images text[] not null default '{}'::text[],
  tags text[] not null default '{}'::text[],
  is_published boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.product_imports (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references public.profiles (id) on delete set null,
  file_name text not null,
  source_type text not null default 'csv',
  total_products integer not null default 0,
  success_count integer not null default 0,
  failed_count integer not null default 0,
  status text not null default 'pending' check (status in ('pending', 'completed', 'partial', 'failed')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.product_import_rows (
  id uuid primary key default gen_random_uuid(),
  import_id uuid not null references public.product_imports (id) on delete cascade,
  row_number integer not null,
  product_name text,
  sku text,
  vendor_id uuid references public.profiles (id) on delete set null,
  category_id uuid references public.categories (id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'completed', 'failed')),
  error_messages text[] not null default '{}'::text[],
  product_payload jsonb,
  product_id uuid references public.products (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.ai_cache (
  id uuid primary key default gen_random_uuid(),
  input text not null unique,
  output jsonb not null,
  provider text not null default 'groq',
  model text not null default 'llama-3.3-70b-versatile',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index idx_profiles_role on public.profiles (role);
create index idx_stores_vendor_id on public.stores (vendor_id);
create index idx_categories_parent_id on public.categories (parent_id);
create index idx_vendor_subscriptions_vendor_id on public.vendor_subscriptions (vendor_id);
create index idx_vendor_subscriptions_status on public.vendor_subscriptions (status);
create index idx_products_vendor_id on public.products (vendor_id);
create index idx_products_store_id on public.products (store_id);
create index idx_products_category_id on public.products (category_id);
create index idx_products_published_created_at on public.products (is_published, created_at desc);
create index idx_products_title_search on public.products using gin (to_tsvector('english', coalesce(title, '')));
create index idx_product_imports_created_at on public.product_imports (created_at desc);
create index idx_product_import_rows_import_id on public.product_import_rows (import_id);
create index idx_ai_cache_created_at on public.ai_cache (created_at desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role, full_name, phone, company_name)
  values (
    new.id,
    new.email,
    public.normalize_app_role(new.raw_user_meta_data ->> 'role'),
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'company_name'
  )
  on conflict (id) do update
  set
    email = excluded.email,
    role = public.profiles.role,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    phone = coalesce(excluded.phone, public.profiles.phone),
    company_name = coalesce(excluded.company_name, public.profiles.company_name),
    updated_at = timezone('utc', now());

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create trigger profiles_set_updated_at before update on public.profiles for each row execute procedure public.set_updated_at();
create trigger stores_set_updated_at before update on public.stores for each row execute procedure public.set_updated_at();
create trigger subscription_plans_set_updated_at before update on public.subscription_plans for each row execute procedure public.set_updated_at();
create trigger vendor_subscriptions_set_updated_at before update on public.vendor_subscriptions for each row execute procedure public.set_updated_at();
create trigger products_set_updated_at before update on public.products for each row execute procedure public.set_updated_at();
create trigger product_imports_set_updated_at before update on public.product_imports for each row execute procedure public.set_updated_at();
create trigger ai_cache_set_updated_at before update on public.ai_cache for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.stores enable row level security;
alter table public.categories enable row level security;
alter table public.subscription_plans enable row level security;
alter table public.vendor_subscriptions enable row level security;
alter table public.products enable row level security;
alter table public.product_imports enable row level security;
alter table public.product_import_rows enable row level security;
alter table public.ai_cache enable row level security;

create policy "Profiles are readable by owner or admin" on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy "Profiles are insertable by owner or admin" on public.profiles for insert with check (auth.uid() = id or public.is_admin());
create policy "Profiles are updatable by owner or admin" on public.profiles for update using (auth.uid() = id or public.is_admin()) with check (auth.uid() = id or public.is_admin());

create policy "Stores are viewable by everyone" on public.stores for select using (true);
create policy "Vendors manage own store" on public.stores for all using (auth.uid() = vendor_id or public.is_admin()) with check (auth.uid() = vendor_id or public.is_admin());

create policy "Categories are viewable by everyone" on public.categories for select using (true);
create policy "Admins manage categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());

create policy "Plans are viewable by everyone" on public.subscription_plans for select using (true);
create policy "Admins manage plans" on public.subscription_plans for all using (public.is_admin()) with check (public.is_admin());

create policy "Vendors view own subscriptions" on public.vendor_subscriptions for select using (auth.uid() = vendor_id or public.is_admin());
create policy "Admins manage subscriptions" on public.vendor_subscriptions for all using (public.is_admin()) with check (public.is_admin());

create policy "Published products are viewable by everyone" on public.products for select using (is_published or auth.uid() = vendor_id or public.is_admin());
create policy "Vendors manage their own products" on public.products for all using (auth.uid() = vendor_id or public.is_admin()) with check (auth.uid() = vendor_id or public.is_admin());

create policy "Admins manage product imports" on public.product_imports for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage product import rows" on public.product_import_rows for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage AI cache" on public.ai_cache for all using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = excluded.public;

create policy "Public product images are readable" on storage.objects for select using (bucket_id = 'product-images');
create policy "Admins upload product images" on storage.objects for insert with check (bucket_id = 'product-images' and public.is_admin());
create policy "Admins update product images" on storage.objects for update using (bucket_id = 'product-images' and public.is_admin()) with check (bucket_id = 'product-images' and public.is_admin());
create policy "Admins delete product images" on storage.objects for delete using (bucket_id = 'product-images' and public.is_admin());

insert into public.categories (name, slug)
values
  ('Power Tools', 'power-tools'),
  ('Hand Tools', 'hand-tools'),
  ('Safety Gear', 'safety-gear'),
  ('Heavy Equipment', 'heavy-equipment'),
  ('Welding', 'welding'),
  ('Measuring', 'measuring')
on conflict (slug) do update set name = excluded.name;

insert into public.subscription_plans (
  plan_key,
  slug,
  name,
  price,
  billing_interval,
  product_limit,
  bulk_upload_enabled,
  analytics_enabled,
  custom_storefront_enabled,
  support_level,
  description
)
values
  ('plan-starter-monthly', 'starter-monthly', 'Starter', 49, 'monthly', 25, false, false, false, 'Email support', 'For new suppliers testing Tooldocker with a focused catalog.'),
  ('plan-growth-monthly', 'growth-monthly', 'Growth', 129, 'monthly', 250, true, true, false, 'Priority email support', 'For growing vendors that need bulk catalog tools and analytics.'),
  ('plan-scale-yearly', 'scale-yearly', 'Scale', 1290, 'yearly', 1000, true, true, true, 'Dedicated success manager', 'For enterprise catalogs that need scale, branding, and deeper visibility.')
on conflict (plan_key) do update
set
  slug = excluded.slug,
  name = excluded.name,
  price = excluded.price,
  billing_interval = excluded.billing_interval,
  product_limit = excluded.product_limit,
  bulk_upload_enabled = excluded.bulk_upload_enabled,
  analytics_enabled = excluded.analytics_enabled,
  custom_storefront_enabled = excluded.custom_storefront_enabled,
  support_level = excluded.support_level,
  description = excluded.description,
  updated_at = timezone('utc', now());