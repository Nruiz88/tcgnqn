-- ============================================================
-- Site settings (social links) - 009
-- ============================================================

create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  instagram text,
  facebook text,
  tiktok text,
  x text,
  youtube text,
  discord text,
  updated_at timestamptz not null default now()
);

-- ============================================================
-- RLS
-- ============================================================
alter table public.site_settings enable row level security;

drop policy if exists "site_settings_select" on public.site_settings;
create policy "site_settings_select" on public.site_settings
  for select using (true);

drop policy if exists "site_settings_admin" on public.site_settings;
create policy "site_settings_admin" on public.site_settings
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

-- ============================================================
-- Seed singleton row
-- ============================================================
insert into public.site_settings (id) values (1)
on conflict (id) do nothing;