-- ============================================================
-- Games (juegos TCG) - 007
-- ============================================================

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  emoji text,
  color text,
  created_at timestamptz not null default now()
);

alter table public.products
  add column if not exists game_id uuid references public.games (id)
    on delete set null;

create index if not exists products_game_id_idx
  on public.products (game_id);

-- ============================================================
-- RLS
-- ============================================================
alter table public.games enable row level security;

drop policy if exists "games_select" on public.games;
create policy "games_select" on public.games
  for select using (true);

drop policy if exists "games_admin" on public.games;
create policy "games_admin" on public.games
  for all using (public.is_admin());

-- ============================================================
-- Grants (Supabase default roles)
-- ============================================================
grant usage on schema public to postgres, anon, authenticated, service_role;
grant all on all tables in schema public to postgres, anon, authenticated, service_role;
grant all on all routines in schema public to postgres, anon, authenticated, service_role;
grant all on all sequences in schema public to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on routines to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to postgres, anon, authenticated, service_role;

-- ============================================================
-- Seed games (juegos TCG más populares)
-- ============================================================
insert into public.games (name, slug, emoji, color) values
  ('Pokémon TCG', 'pokemon', '⚡', 'from-amber-400 to-yellow-500'),
  ('Yu-Gi-Oh!', 'yugioh', '🌀', 'from-purple-500 to-indigo-600'),
  ('One Piece', 'one-piece', '🏴‍☠️', 'from-red-500 to-rose-600'),
  ('Lorcana', 'lorcana', '🫧', 'from-sky-400 to-blue-600'),
  ('Magic: The Gathering', 'magic', '🔮', 'from-blue-600 to-violet-700'),
  ('Digimon', 'digimon', '🦖', 'from-cyan-400 to-teal-500'),
  ('Dragon Ball Super', 'dragon-ball', '🐉', 'from-orange-500 to-amber-600'),
  ('Flesh and Blood', 'fab', '⚔️', 'from-neutral-600 to-neutral-800')
on conflict (slug) do nothing;
