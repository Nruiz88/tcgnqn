-- 011 - Snapshot del nombre del producto en order_items.
-- El pedido conserva el nombre aunque el producto se oculte o elimine.

alter table public.order_items
  add column if not exists product_name text;

update public.order_items oi
set product_name = p.name
from public.products p
where p.id = oi.product_id
  and oi.product_name is null;
