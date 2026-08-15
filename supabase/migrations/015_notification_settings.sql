-- ============================================================
-- 015 - credenciales de WhatsApp Cloud API (avisos al cliente)
--
-- Mismo patrón que payment_settings / shipping_settings: fila
-- única id = 1, lectura/escritura solo para admins.
--
-- OJO: node scripts/migrate.js hace DROP de todo el schema public
-- ANTES de aplicar el archivo, así que NO lo uses sobre una base
-- con datos. Aplicá este archivo en el SQL editor de Supabase;
-- es idempotente.
-- ============================================================

create table if not exists public.notification_settings (
  id integer primary key default 1 check (id = 1),
  whatsapp_token text,
  whatsapp_phone_id text,
  updated_at timestamptz not null default now()
);

-- ============================================================
-- RLS notification_settings (solo admins)
-- ============================================================
alter table public.notification_settings enable row level security;

drop policy if exists "notification_settings_admin" on public.notification_settings;
create policy "notification_settings_admin" on public.notification_settings
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
insert into public.notification_settings (id) values (1)
on conflict (id) do nothing;
