-- ============================================================
-- tcgnqn - e-commerce schema
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

-- ---------- products ----------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(12, 2) not null default 0,
  image_url text,
  stock integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- orders ----------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  total numeric(12, 2) not null default 0,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'shipped', 'cancelled')),
  shipping_name text not null,
  shipping_phone text not null,
  shipping_address text not null,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders (user_id);

-- ---------- order_items ----------
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid not null references public.products (id),
  quantity integer not null default 1,
  price numeric(12, 2) not null default 0
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

-- ---------- helper functions ----------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.decrement_stock(product_id uuid, qty integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.products
  set stock = stock - qty
  where id = product_id;
end;
$$;

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
-- Row Level Security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- profiles: users read/update their own; admins read all
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id or public.is_admin());

-- products: everyone can read active ones; admins manage
drop policy if exists "products_select" on public.products;
create policy "products_select" on public.products
  for select using (active = true or public.is_admin());

drop policy if exists "products_insert_admin" on public.products;
create policy "products_insert_admin" on public.products
  for insert with check (public.is_admin());

drop policy if exists "products_update_admin" on public.products;
create policy "products_update_admin" on public.products
  for update using (public.is_admin());

drop policy if exists "products_delete_admin" on public.products;
create policy "products_delete_admin" on public.products
  for delete using (public.is_admin());

-- orders: owners read their own; admins manage
drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own" on public.orders
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "orders_insert_own" on public.orders;
create policy "orders_insert_own" on public.orders
  for insert with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "orders_update_admin" on public.orders;
create policy "orders_update_admin" on public.orders
  for update using (public.is_admin());

-- order_items: owners read through their order; admins manage
drop policy if exists "order_items_select" on public.order_items;
create policy "order_items_select" on public.order_items
  for select using (
    public.is_admin()
    or exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

drop policy if exists "order_items_insert" on public.order_items;
create policy "order_items_insert" on public.order_items
  for insert with check (
    public.is_admin()
    or exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );
