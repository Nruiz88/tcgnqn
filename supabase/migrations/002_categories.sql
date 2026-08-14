-- ============================================================
-- Categories (base) - 002
-- ============================================================

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  emoji text,
  created_at timestamptz not null default now()
);

alter table public.products
  add column if not exists category_id uuid references public.categories (id)
    on delete set null;

create index if not exists products_category_id_idx
  on public.products (category_id);

-- ============================================================
-- RLS
-- ============================================================
alter table public.categories enable row level security;

drop policy if exists "categories_select" on public.categories;
create policy "categories_select" on public.categories
  for select using (true);

drop policy if exists "categories_admin" on public.categories;
create policy "categories_admin" on public.categories
  for all using (public.is_admin());

-- ============================================================
-- Grants (Supabase default roles)
-- ============================================================
grant usage on schema public to postgres, anon, authenticated, service_role;
grant all on all tables in schema public to postgres, anon, authenticated, service_role;
grant all on all routines in schema public to postgres, anon, authenticated, service_role;
grant all on all sequences in schema public to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on routines to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to postgres, anon, authenticated, service_role;

-- ============================================================
-- Seed categories
-- ============================================================
insert into public.categories (name, slug, emoji) values
  ('Cartas individuales', 'cartas', '🃏'),
  ('Sobres y Boosters', 'boosters', '📦'),
  ('Sleeves y Protectores', 'sleeves', '🛡️'),
  ('Accesorios', 'accesorios', '🎒')
on conflict (slug) do nothing;
