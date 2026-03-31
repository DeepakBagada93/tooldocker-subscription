-- Adds the missing marketplace transaction tables referenced by the app.
-- This keeps the reset migration focused on identity/catalog/subscriptions while
-- providing order, review, and notification primitives with RLS coverage.

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'processing', 'paid', 'shipped', 'delivered', 'cancelled')),
  total_amount numeric(12,2) not null default 0 check (total_amount >= 0),
  shipping_address jsonb not null default '{}'::jsonb check (jsonb_typeof(shipping_address) = 'object'),
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.vendor_orders (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  store_id uuid not null references public.stores (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount numeric(12,2) not null default 0 check (total_amount >= 0),
  commission_amount numeric(12,2) not null default 0 check (commission_amount >= 0),
  net_amount numeric(12,2) not null default 0 check (net_amount >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (order_id, store_id)
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  vendor_order_id uuid not null references public.vendor_orders (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete restrict,
  quantity integer not null default 1 check (quantity > 0),
  price_at_time numeric(12,2) not null default 0 check (price_at_time >= 0),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  buyer_id uuid not null references public.profiles (id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  title text,
  body text,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (product_id, buyer_id)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles (id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  is_read boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_orders_buyer_id on public.orders (buyer_id);
create index if not exists idx_orders_created_at on public.orders (created_at desc);
create index if not exists idx_vendor_orders_order_id on public.vendor_orders (order_id);
create index if not exists idx_vendor_orders_store_id on public.vendor_orders (store_id);
create index if not exists idx_vendor_orders_created_at on public.vendor_orders (created_at desc);
create index if not exists idx_order_items_order_id on public.order_items (order_id);
create index if not exists idx_order_items_vendor_order_id on public.order_items (vendor_order_id);
create index if not exists idx_order_items_product_id on public.order_items (product_id);
create index if not exists idx_reviews_product_id on public.reviews (product_id);
create index if not exists idx_reviews_buyer_id on public.reviews (buyer_id);
create index if not exists idx_notifications_recipient_id on public.notifications (recipient_id, is_read);

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at before update on public.orders for each row execute procedure public.set_updated_at();

drop trigger if exists vendor_orders_set_updated_at on public.vendor_orders;
create trigger vendor_orders_set_updated_at before update on public.vendor_orders for each row execute procedure public.set_updated_at();

drop trigger if exists reviews_set_updated_at on public.reviews;
create trigger reviews_set_updated_at before update on public.reviews for each row execute procedure public.set_updated_at();

drop trigger if exists notifications_set_updated_at on public.notifications;
create trigger notifications_set_updated_at before update on public.notifications for each row execute procedure public.set_updated_at();

alter table public.orders enable row level security;
alter table public.vendor_orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "Buyers view own orders" on public.orders;
create policy "Buyers view own orders"
on public.orders
for select
using (auth.uid() = buyer_id or public.is_admin());

drop policy if exists "Buyers create own orders" on public.orders;
create policy "Buyers create own orders"
on public.orders
for insert
with check (auth.uid() = buyer_id or public.is_admin());

drop policy if exists "Buyers update own orders" on public.orders;
create policy "Buyers update own orders"
on public.orders
for update
using (auth.uid() = buyer_id or public.is_admin())
with check (auth.uid() = buyer_id or public.is_admin());

drop policy if exists "Stakeholders view vendor orders" on public.vendor_orders;
create policy "Stakeholders view vendor orders"
on public.vendor_orders
for select
using (
  public.is_admin()
  or exists (
    select 1
    from public.stores s
    where s.id = vendor_orders.store_id
      and s.vendor_id = auth.uid()
  )
  or exists (
    select 1
    from public.orders o
    where o.id = vendor_orders.order_id
      and o.buyer_id = auth.uid()
  )
);

drop policy if exists "Buyers create vendor orders for own checkout" on public.vendor_orders;
create policy "Buyers create vendor orders for own checkout"
on public.vendor_orders
for insert
with check (
  public.is_admin()
  or exists (
    select 1
    from public.orders o
    where o.id = vendor_orders.order_id
      and o.buyer_id = auth.uid()
  )
);

drop policy if exists "Vendors update their vendor orders" on public.vendor_orders;
create policy "Vendors update their vendor orders"
on public.vendor_orders
for update
using (
  public.is_admin()
  or exists (
    select 1
    from public.stores s
    where s.id = vendor_orders.store_id
      and s.vendor_id = auth.uid()
  )
)
with check (
  public.is_admin()
  or exists (
    select 1
    from public.stores s
    where s.id = vendor_orders.store_id
      and s.vendor_id = auth.uid()
  )
);

drop policy if exists "Stakeholders view order items" on public.order_items;
create policy "Stakeholders view order items"
on public.order_items
for select
using (
  public.is_admin()
  or exists (
    select 1
    from public.orders o
    where o.id = order_items.order_id
      and o.buyer_id = auth.uid()
  )
  or exists (
    select 1
    from public.vendor_orders vo
    join public.stores s on s.id = vo.store_id
    where vo.id = order_items.vendor_order_id
      and s.vendor_id = auth.uid()
  )
);

drop policy if exists "Buyers create order items for own checkout" on public.order_items;
create policy "Buyers create order items for own checkout"
on public.order_items
for insert
with check (
  public.is_admin()
  or exists (
    select 1
    from public.orders o
    where o.id = order_items.order_id
      and o.buyer_id = auth.uid()
  )
);

drop policy if exists "Published reviews are public" on public.reviews;
create policy "Published reviews are public"
on public.reviews
for select
using (is_published or auth.uid() = buyer_id or public.is_admin());

drop policy if exists "Buyers create reviews for themselves" on public.reviews;
create policy "Buyers create reviews for themselves"
on public.reviews
for insert
with check (auth.uid() = buyer_id or public.is_admin());

drop policy if exists "Buyers update own reviews" on public.reviews;
create policy "Buyers update own reviews"
on public.reviews
for update
using (auth.uid() = buyer_id or public.is_admin())
with check (auth.uid() = buyer_id or public.is_admin());

drop policy if exists "Users view own notifications" on public.notifications;
create policy "Users view own notifications"
on public.notifications
for select
using (auth.uid() = recipient_id or public.is_admin());

drop policy if exists "Admins create notifications" on public.notifications;
create policy "Admins create notifications"
on public.notifications
for insert
with check (public.is_admin());

drop policy if exists "Users update own notifications" on public.notifications;
create policy "Users update own notifications"
on public.notifications
for update
using (auth.uid() = recipient_id or public.is_admin())
with check (auth.uid() = recipient_id or public.is_admin());
