-- Migration: Add AI Cache table for cost optimization
create table if not exists public.ai_cache (
  id uuid primary key default gen_random_uuid(),
  input text not null,
  output jsonb not null,
  provider text default 'groq',
  model text default 'llama-3.3-70b-versatile',
  created_at timestamp with time zone default now()
);

-- Index for fast lookup by input query
create index if not exists idx_ai_cache_input on public.ai_cache (input);

-- Enable RLS for ai_cache (but only allow admin/system access usually)
alter table public.ai_cache enable row level security;

-- Only admins/system can view or manage AI cache
create policy "Admins manage AI cache"
on public.ai_cache for all
using (public.is_admin())
with check (public.is_admin());
