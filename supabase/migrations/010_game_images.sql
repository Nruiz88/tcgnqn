-- ============================================================
-- Game images (storage + image_url) - 010
-- ============================================================

alter table public.games
  add column if not exists image_url text;

-- ============================================================
-- Storage bucket
-- ============================================================
insert into storage.buckets (id, name, public)
values ('game-images', 'game-images', true)
on conflict (id) do nothing;

-- ============================================================
-- Storage RLS
-- ============================================================
drop policy if exists "game_images_select" on storage.objects;
create policy "game_images_select" on storage.objects
  for select using (bucket_id = 'game-images');

drop policy if exists "game_images_insert_admin" on storage.objects;
create policy "game_images_insert_admin" on storage.objects
  for insert with check (bucket_id = 'game-images' and public.is_admin());

drop policy if exists "game_images_update_admin" on storage.objects;
create policy "game_images_update_admin" on storage.objects
  for update using (bucket_id = 'game-images' and public.is_admin());

drop policy if exists "game_images_delete_admin" on storage.objects;
create policy "game_images_delete_admin" on storage.objects
  for delete using (bucket_id = 'game-images' and public.is_admin());