-- Migration: Restore stores table
-- Date: 2026-04-07
-- Purpose: Recreate the stores table that was accidentally dropped
-- The application still requires this table for product and order management

-- Recreate the stores table
create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null unique references public.profiles (id) on delete cascade,
  store_name text not null,
  description text,
  logo_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Create index for vendor_id
create index if not exists idx_stores_vendor_id on public.stores (vendor_id);

-- Create trigger for updated_at
create trigger stores_set_updated_at before update on public.stores 
  for each row execute procedure public.set_updated_at();

-- Enable row level security
alter table public.stores enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Stores are viewable by everyone" on public.stores;
drop policy if exists "Vendors manage own store" on public.stores;

-- Create RLS policies
create policy "Stores are viewable by everyone" on public.stores 
  for select using (true);

create policy "Vendors manage own store" on public.stores 
  for all 
  using (auth.uid() = vendor_id or public.is_admin()) 
  with check (auth.uid() = vendor_id or public.is_admin());

-- Add helpful comment
comment on table stores is 'Vendor stores for marketplace products';
