-- ============================================================
-- Featured products (destacados configurables desde el admin)
-- ============================================================

alter table public.products
  add column if not exists featured boolean not null default false;

-- Los admins ya pueden editar products (products_update_admin), no hace falta
-- una policy nueva: el toggle se hace con la misma policy de update.
