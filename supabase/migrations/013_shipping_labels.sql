-- ============================================================
-- 013 - guías de envío: tracking y referencia en pedidos
--
-- OJO: node scripts/migrate.js hace DROP de todo el schema public
-- ANTES de aplicar el archivo, así que NO lo uses sobre una base
-- con datos. Aplicá este archivo en el SQL editor de Supabase
-- (o con psql); es idempotente, se puede correr varias veces.
-- ============================================================

alter table public.orders
  add column if not exists shipping_tracking_id text,
  add column if not exists shipping_label_reference text;
