-- ============================================================
-- Search (base) - 003
-- ============================================================

create extension if not exists pg_trgm;

create index if not exists products_name_trgm_idx
  on public.products using gin (name gin_trgm_ops);

create index if not exists products_description_trgm_idx
  on public.products using gin (description gin_trgm_ops);
