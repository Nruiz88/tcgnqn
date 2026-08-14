-- ============================================================
-- Coupons (module) - 005
-- ============================================================

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  type text not null default 'percent' check (type in ('percent', 'fixed')),
  value numeric(12, 2) not null default 0,
  min_total numeric(12, 2),
  max_uses integer,
  used_count integer not null default 0,
  expires_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================
-- RLS
-- ============================================================
alter table public.coupons enable row level security;

drop policy if exists "coupons_select_active" on public.coupons;
create policy "coupons_select_active" on public.coupons
  for select using (active = true or public.is_admin());

drop policy if exists "coupons_admin" on public.coupons;
create policy "coupons_admin" on public.coupons
  for all using (public.is_admin());

-- ============================================================
-- Grants
-- ============================================================
grant usage on schema public to postgres, anon, authenticated, service_role;
grant all on all tables in schema public to postgres, anon, authenticated, service_role;
grant all on all routines in schema public to postgres, anon, authenticated, service_role;
grant all on all sequences in schema public to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on routines to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to postgres, anon, authenticated, service_role;
