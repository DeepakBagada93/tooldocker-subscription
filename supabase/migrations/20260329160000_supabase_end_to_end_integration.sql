create extension if not exists pgcrypto;

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

create table if not exists public.profiles (
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
    (
      select p.role
      from public.profiles p
      where p.id = auth.uid()
    ),
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

create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null unique references public.profiles (id) on delete cascade,
  store_name text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.subscription_plans (
  id uuid primary key default gen_random_uuid(),
  plan_key text not null unique,
  name text not null,
  price numeric(12,2) not null default 0,
  billing_interval text not null check (billing_interval in ('monthly', 'yearly')),
  product_limit integer not null default 0,
  bulk_upload_enabled boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.vendor_subscriptions (
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

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references public.profiles (id) on delete set null,
  store_id uuid not null references public.stores (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,
  title text not null,
  description text,
  price numeric(12,2) not null default 0,
  sale_price numeric(12,2),
  sku text unique,
  stock_quantity integer not null default 0,
  inventory_count integer not null default 0,
  condition text not null default 'new',
  brand text,
  weight text,
  dimensions jsonb not null default '{}'::jsonb,
  images text[] not null default '{}'::text[],
  tags text[] not null default '{}'::text[],
  is_published boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.product_imports (
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

create table if not exists public.product_import_rows (
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

create index if not exists idx_profiles_role on public.profiles (role);
create index if not exists idx_stores_vendor_id on public.stores (vendor_id);
create index if not exists idx_vendor_subscriptions_vendor_id on public.vendor_subscriptions (vendor_id);
create index if not exists idx_products_vendor_id on public.products (vendor_id);
create index if not exists idx_products_store_id on public.products (store_id);
create index if not exists idx_products_category_id on public.products (category_id);
create index if not exists idx_product_import_rows_import_id on public.product_import_rows (import_id);

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
    role = excluded.role,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    phone = coalesce(excluded.phone, public.profiles.phone),
    company_name = coalesce(excluded.company_name, public.profiles.company_name),
    updated_at = timezone('utc', now());

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

drop trigger if exists stores_set_updated_at on public.stores;
create trigger stores_set_updated_at
  before update on public.stores
  for each row execute procedure public.set_updated_at();

drop trigger if exists subscription_plans_set_updated_at on public.subscription_plans;
create trigger subscription_plans_set_updated_at
  before update on public.subscription_plans
  for each row execute procedure public.set_updated_at();

drop trigger if exists vendor_subscriptions_set_updated_at on public.vendor_subscriptions;
create trigger vendor_subscriptions_set_updated_at
  before update on public.vendor_subscriptions
  for each row execute procedure public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute procedure public.set_updated_at();

drop trigger if exists product_imports_set_updated_at on public.product_imports;
create trigger product_imports_set_updated_at
  before update on public.product_imports
  for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.stores enable row level security;
alter table public.categories enable row level security;
alter table public.subscription_plans enable row level security;
alter table public.vendor_subscriptions enable row level security;
alter table public.products enable row level security;
alter table public.product_imports enable row level security;
alter table public.product_import_rows enable row level security;

drop policy if exists "Profiles are readable by owner or admin" on public.profiles;
create policy "Profiles are readable by owner or admin"
on public.profiles for select
using (auth.uid() = id or public.is_admin());

drop policy if exists "Profiles are insertable by owner or admin" on public.profiles;
create policy "Profiles are insertable by owner or admin"
on public.profiles for insert
with check (auth.uid() = id or public.is_admin());

drop policy if exists "Profiles are updatable by owner or admin" on public.profiles;
create policy "Profiles are updatable by owner or admin"
on public.profiles for update
using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

drop policy if exists "Stores are viewable by everyone" on public.stores;
create policy "Stores are viewable by everyone"
on public.stores for select
using (true);

drop policy if exists "Vendors manage own store" on public.stores;
create policy "Vendors manage own store"
on public.stores for all
using (auth.uid() = vendor_id or public.is_admin())
with check (auth.uid() = vendor_id or public.is_admin());

drop policy if exists "Categories are viewable by everyone" on public.categories;
create policy "Categories are viewable by everyone"
on public.categories for select
using (true);

drop policy if exists "Admins manage categories" on public.categories;
create policy "Admins manage categories"
on public.categories for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Plans are viewable by everyone" on public.subscription_plans;
create policy "Plans are viewable by everyone"
on public.subscription_plans for select
using (true);

drop policy if exists "Admins manage plans" on public.subscription_plans;
create policy "Admins manage plans"
on public.subscription_plans for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Vendors view own subscriptions" on public.vendor_subscriptions;
create policy "Vendors view own subscriptions"
on public.vendor_subscriptions for select
using (auth.uid() = vendor_id or public.is_admin());

drop policy if exists "Admins manage subscriptions" on public.vendor_subscriptions;
create policy "Admins manage subscriptions"
on public.vendor_subscriptions for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Published products are viewable by everyone" on public.products;
create policy "Published products are viewable by everyone"
on public.products for select
using (is_published or auth.uid() = vendor_id or public.is_admin());

drop policy if exists "Vendors manage their own products" on public.products;
create policy "Vendors manage their own products"
on public.products for all
using (auth.uid() = vendor_id or public.is_admin())
with check (auth.uid() = vendor_id or public.is_admin());

drop policy if exists "Admins manage product imports" on public.product_imports;
create policy "Admins manage product imports"
on public.product_imports for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins manage product import rows" on public.product_import_rows;
create policy "Admins manage product import rows"
on public.product_import_rows for all
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public product images are readable" on storage.objects;
create policy "Public product images are readable"
on storage.objects for select
using (bucket_id = 'product-images');

drop policy if exists "Admins upload product images" on storage.objects;
create policy "Admins upload product images"
on storage.objects for insert
with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins update product images" on storage.objects;
create policy "Admins update product images"
on storage.objects for update
using (bucket_id = 'product-images' and public.is_admin())
with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins delete product images" on storage.objects;
create policy "Admins delete product images"
on storage.objects for delete
using (bucket_id = 'product-images' and public.is_admin());

insert into public.subscription_plans (
  plan_key,
  name,
  price,
  billing_interval,
  product_limit,
  bulk_upload_enabled
)
values
  ('plan-starter-monthly', 'Starter', 49, 'monthly', 25, false),
  ('plan-growth-monthly', 'Growth', 129, 'monthly', 250, true),
  ('plan-scale-yearly', 'Scale', 1290, 'yearly', 1000, true)
on conflict (plan_key) do update
set
  name = excluded.name,
  price = excluded.price,
  billing_interval = excluded.billing_interval,
  product_limit = excluded.product_limit,
  bulk_upload_enabled = excluded.bulk_upload_enabled,
  updated_at = timezone('utc', now());
