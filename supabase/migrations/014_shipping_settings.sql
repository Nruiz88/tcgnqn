-- ============================================================
-- 014 - credenciales de Correo Argentino en el panel admin
--
-- Mismo patrón que payment_settings (Mercado Pago): fila única
-- id = 1, lectura/escritura solo para admins.
--
-- OJO: node scripts/migrate.js hace DROP de todo el schema public
-- ANTES de aplicar el archivo, así que NO lo uses sobre una base
-- con datos. Aplicá este archivo en el SQL editor de Supabase;
-- es idempotente.
-- ============================================================

create table if not exists public.shipping_settings (
  id integer primary key default 1 check (id = 1),
  correo_user_token text,
  correo_password_token text,
  correo_email text,
  correo_password text,
  correo_customer_id text,
  correo_sender_cp text,
  updated_at timestamptz not null default now()
);

-- ============================================================
-- RLS shipping_settings (solo admins)
-- ============================================================
alter table public.shipping_settings enable row level security;

drop policy if exists "shipping_settings_admin" on public.shipping_settings;
create policy "shipping_settings_admin" on public.shipping_settings
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
insert into public.shipping_settings (id) values (1)
on conflict (id) do nothing;
