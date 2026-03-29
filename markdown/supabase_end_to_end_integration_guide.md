# Supabase End-to-End Integration Guide (Auth + Backend)

## Overview
This document provides a complete end-to-end integration of Supabase for a subscription-based marketplace platform. It covers authentication, database setup, role-based access, and frontend integration using Next.js.

---

## 1. Supabase Project Setup

1. Create a project at https://supabase.com
2. Copy:
   - Project URL
   - Anon public key
   - Service role key

3. Enable:
   - Email Auth
   - Google OAuth (optional)

---

## 2. Install Dependencies

```bash
npm install @supabase/supabase-js
```

---

## 3. Supabase Client Setup

Create file: `lib/supabaseClient.ts`

```ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

---

## 4. Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

---

## 5. Authentication System

### Sign Up

```ts
const { data, error } = await supabase.auth.signUp({
  email,
  password,
})
```

### Login

```ts
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
})
```

### Logout

```ts
await supabase.auth.signOut()
```

---

## 6. Role-Based System

Create `profiles` table:

```sql
create table profiles (
  id uuid references auth.users on delete cascade,
  role text check (role in ('admin','vendor','buyer')),
  created_at timestamp default now()
);
```

---

## 7. Subscription Tables

```sql
create table subscription_plans (
  id uuid primary key default gen_random_uuid(),
  name text,
  price numeric,
  product_limit int,
  created_at timestamp default now()
);

create table vendor_subscriptions (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid,
  plan_id uuid,
  status text,
  start_date timestamp,
  end_date timestamp
);
```

---

## 8. Product Table

```sql
create table products (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid,
  title text,
  price numeric,
  stock int,
  created_at timestamp default now()
);
```

---

## 9. RLS Policies

Enable RLS:

```sql
alter table products enable row level security;
```

Vendor access:

```sql
create policy "Vendors can manage their products"
on products for all
using (auth.uid() = vendor_id);
```

---

## 10. Subscription Validation Logic

Before creating product:

```ts
const { data } = await supabase
  .from('vendor_subscriptions')
  .select('*')
  .eq('vendor_id', user.id)
  .eq('status', 'active')
  .single()

if (!data) {
  throw new Error('Subscription required')
}
```

---

## 11. Protect Routes (Next.js Middleware)

```ts
import { NextResponse } from 'next/server'

export function middleware(req) {
  // Add auth checks
  return NextResponse.next()
}
```

---

## 12. Frontend Integration

Example fetch products:

```ts
const { data } = await supabase
  .from('products')
  .select('*')
```

---

## 13. Storage (Images)

Upload:

```ts
await supabase.storage
  .from('product-images')
  .upload('file.png', file)
```

---

## 14. Security Best Practices

- Use RLS everywhere
- Never expose service role key
- Validate user roles server-side
- Use API routes for sensitive logic

---

## 15. Final Flow

1. User signs up
2. Role assigned (vendor/buyer/admin)
3. Vendor subscribes
4. Vendor adds products
5. Buyer purchases

---

## Done 🎉

You now have a full Supabase auth + backend integration for your SaaS marketplace.

