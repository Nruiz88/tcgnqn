-- ============================================================
-- 002 - envíos: método, costo y código postal en pedidos
-- Aplicar: node scripts/migrate.js supabase/migrations/002_shipping.sql
-- ============================================================

alter table public.orders
  add column if not exists shipping_method text,
  add column if not exists shipping_label text,
  add column if not exists shipping_price numeric(12, 2) not null default 0,
  add column if not exists shipping_cp text;
