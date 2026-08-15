-- ============================================================
-- Mercado Pago - 012
-- ============================================================

-- Activación pública de Mercado Pago (se lee en el checkout sin login)
alter table public.site_settings
  add column if not exists mercadopago_enabled boolean not null default false;

-- Credenciales de Mercado Pago (acceso restringido a admins)
create table if not exists public.payment_settings (
  id integer primary key default 1 check (id = 1),
  mercadopago_access_token text,
  mercadopago_public_key text,
  updated_at timestamptz not null default now()
);

-- ============================================================
-- RLS payment_settings (solo admins)
-- ============================================================
alter table public.payment_settings enable row level security;

drop policy if exists "payment_settings_admin" on public.payment_settings;
create policy "payment_settings_admin" on public.payment_settings
  for all using (public.is_admin());

-- ============================================================
-- Orders: método de pago + datos de Mercado Pago
-- ============================================================
alter table public.orders
  add column if not exists payment_method text not null default 'manual',
  add column if not exists mp_preference_id text,
  add column if not exists mp_payment_id text;

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
insert into public.payment_settings (id) values (1)
on conflict (id) do nothing;
