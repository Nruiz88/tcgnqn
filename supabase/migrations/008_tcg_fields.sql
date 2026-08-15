-- ============================================================
-- TCG fields for single cards - 008
-- ============================================================

alter table public.products
  add column if not exists condition text,
  add column if not exists language text,
  add column if not exists set_name text,
  add column if not exists card_type text;