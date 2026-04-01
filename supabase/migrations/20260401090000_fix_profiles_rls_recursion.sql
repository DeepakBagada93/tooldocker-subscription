create or replace function public.current_app_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select p.role from public.profiles p where p.id = auth.uid()),
    public.normalize_app_role(auth.jwt() -> 'user_metadata' ->> 'role')
  );
$$;

revoke all on function public.current_app_role() from public;
grant execute on function public.current_app_role() to anon, authenticated, service_role;
