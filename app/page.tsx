import Link from 'next/link'
import { getProducts, getCategories, getGames } from '@/lib/data'
import { formatPrice } from '@/lib/format'
import type { Product } from '@/lib/types'
import ProductCard from '@/components/product-card'
import CardTile from '@/components/card-tile'
import { isCard } from '@/lib/cards'
import { POKEMON_ERAS, findPokemonSet } from '@/lib/pokemon-sets'

export const dynamic = 'force-dynamic'

function SectionHeader({
  kicker,
  title,
  subtitle,
  href,
}: {
  kicker: string
  title: string
  subtitle: string
  href?: string
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
          {kicker}
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h2>
        <p className="mt-2 max-w-lg text-sm text-neutral-500 sm:text-base">
          {subtitle}
        </p>
      </div>
      {href && (
        <Link
          href={href}
          className="hidden shrink-0 rounded-full border border-neutral-300 px-5 py-2 text-sm font-medium text-neutral-900 transition hover:border-neutral-900 hover:bg-[#171a21] hover:text-white sm:inline-block"
        >
          Ver todo →
        </Link>
      )}
    </div>
  )
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; game?: string }>
}) {
  const [{ cat, game }, categories, games] = await Promise.all([
    searchParams,
    getCategories(),
    getGames(),
  ])

  const activeCategory = cat
    ? categories.find((c) => c.slug === cat)
    : undefined
  const activeGame = game ? games.find((g) => g.slug === game) : undefined

  const allProducts = await getProducts()
  const products = allProducts.filter((p) => {
    if (activeCategory && p.category?.slug !== cat) return false
    if (activeGame && p.game?.slug !== game) return false
    return true
  })

  // Destacados: los marcados como destacados desde el admin (sin cartas,
  // que tienen su propia sección). Si no hay ninguno marcado, usamos los
  // primeros productos no-cartas para no dejar la sección vacía.
  const markedFeatured = products.filter((p) => p.featured && !isCard(p))
  const featured =
    markedFeatured.length > 0
      ? markedFeatured.slice(0, 8)
      : products.filter((p) => !isCard(p)).slice(0, 8)
  // Nuevos ingresos: los últimos cargados, sin cartas individuales
  // (las cartas tienen su sección Singles más abajo)
  const newArrivals = allProducts.filter((p) => !isCard(p)).slice(0, 10)

  // Accesorios: sección única en la home (solo cuando no hay filtros)
  const accesorios = allProducts.filter((p) => p.category?.slug === 'accesorios')

  // Colecciones de singles, organizadas como filas de cartas (estilo PokeArgentum)
  const singles = allProducts.filter((p) => p.category?.slug === 'cartas')
  const collections: {
    key: string
    name: string
    group: string
    cards: Product[]
  }[] = []
  for (const era of POKEMON_ERAS) {
    for (const s of era.sets) {
      const cards = singles.filter(
        (p) => findPokemonSet(p.set_name)?.code === s.code,
      )
      if (cards.length === 0) continue
      collections.push({ key: s.code, name: s.name, group: era.era, cards })
    }
  }
  const otherCollections = new Map<
    string,
    { name: string; group: string; cards: Product[] }
  >()
  for (const p of singles) {
    if (findPokemonSet(p.set_name) || !p.set_name) continue
    const key = p.set_name.trim().toLowerCase()
    const existing = otherCollections.get(key)
    if (existing) existing.cards.push(p)
    else
      otherCollections.set(key, {
        name: p.set_name,
        group: `${p.game?.name ?? 'Otros'} · Colecciones`,
        cards: [p],
      })
  }
  for (const [key, c] of otherCollections) {
    collections.push({ key, name: c.name, group: c.group, cards: c.cards })
  }
  collections.sort((a, b) => b.cards.length - a.cards.length)
  const featuredCollections = collections.slice(0, 6)

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0d0f14] text-white">
        <div className="bg-grid pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-0 h-[30rem] w-[30rem] rounded-full bg-indigo-600/30 blur-3xl" />
          <div className="absolute -bottom-40 -right-24 h-[30rem] w-[30rem] rounded-full bg-fuchsia-600/30 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-6xl gap-14 px-4 py-24 sm:py-32 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-surface/5 px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Tienda online de cartas TCG
            </span>

            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Cartas para cada{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
                juego TCG
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
              Singles, sobres y accesorios de Pokémon, Yu-Gi-Oh!, One Piece y
              más. Elegí, dejá tu pedido y coordinamos el pago por WhatsApp.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="#productos"
                className="group rounded-full bg-surface px-7 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
              >
                Explorar catálogo{' '}
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <Link
                href="#juegos"
                className="rounded-full border border-white/20 bg-surface/5 px-7 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-surface/10"
              >
                Ver juegos
              </Link>
            </div>

          </div>

          {/* Composición decorativa */}
          <div className="relative hidden lg:block">
            <div className="relative h-[26rem]">
              <div className="absolute right-6 top-0 w-64 rotate-6 rounded-3xl border border-white/10 bg-gradient-to-br from-amber-400/25 to-yellow-600/10 p-6 shadow-2xl backdrop-blur transition hover:rotate-2">
                <p className="text-4xl">⚡</p>
                <p className="mt-4 font-display text-lg font-semibold">Pokémon TCG</p>
                <p className="mt-1 text-xs text-white/60">Raros y chase cards</p>
              </div>
              <div className="absolute left-0 top-20 w-64 -rotate-6 rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/25 to-indigo-600/10 p-6 shadow-2xl backdrop-blur transition hover:-rotate-2">
                <p className="text-4xl">🌀</p>
                <p className="mt-4 font-display text-lg font-semibold">Yu-Gi-Oh!</p>
                <p className="mt-1 text-xs text-white/60">Mazos y singles</p>
              </div>
              <div className="absolute bottom-0 right-24 w-64 rotate-2 rounded-3xl border border-white/10 bg-gradient-to-br from-sky-400/25 to-blue-600/10 p-6 shadow-2xl backdrop-blur transition hover:rotate-0">
                <p className="text-4xl">🏴‍☠️</p>
                <p className="mt-4 font-display text-lg font-semibold">One Piece</p>
                <p className="mt-1 text-xs text-white/60">Booster packs</p>
              </div>
              <div className="absolute -bottom-4 left-16 rounded-2xl border border-white/10 bg-[#171a21]/90 px-5 py-3 shadow-xl backdrop-blur">
                <p className="text-xs text-white/50">Nuevo en la tienda</p>
                <p className="text-sm font-semibold">🫧 Lorcana · Tinta y glimmers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="relative border-t border-white/10 bg-surface/5 py-4 backdrop-blur">
          <div className="flex overflow-hidden">
            <div className="animate-marquee flex shrink-0 items-center gap-12 pr-12">
              {[...games, ...games].map((g, i) => (
                <span key={`${g.id}-${i}`} className="flex items-center gap-2 whitespace-nowrap text-sm font-medium text-white/50">
                  <span>{g.emoji}</span> {g.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nuevos ingresos: ticker con los últimos productos cargados (estilo PokeArgentum) */}
      {!activeGame && !activeCategory && newArrivals.length > 0 && (
        <section className="border-b border-neutral-200 bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
                  Novedades
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  Nuevos ingresos
                </h2>
                <p className="mt-2 text-sm text-neutral-500 sm:text-base">
                  Lo último que llegó a la tienda
                </p>
              </div>
              <Link
                href="/#productos"
                className="hidden shrink-0 rounded-full border border-neutral-300 px-5 py-2 text-sm font-medium text-neutral-900 transition hover:border-neutral-900 hover:bg-[#171a21] hover:text-white sm:inline-block"
              >
                Ver todo →
              </Link>
            </div>

            <div className="ticker-wrap mt-8 block overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50/60 p-2 dark:border-neutral-800/60 dark:bg-neutral-900/40">
              <div className="flex gap-3 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {newArrivals.map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.id}`}
                    className="group flex w-60 shrink-0 snap-start items-center gap-3 rounded-xl border border-neutral-200 bg-surface p-2.5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-400/60 hover:shadow-md dark:border-neutral-700/50"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100 ring-1 ring-inset ring-neutral-200 dark:bg-neutral-800/70 dark:ring-neutral-700/60">
                      {p.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-xl">
                          {p.category?.emoji ?? '🛍️'}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-neutral-800 dark:text-neutral-100">
                        {p.name}
                      </p>
                      <p className="mt-0.5 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                        {formatPrice(p.price)}
                      </p>
                      {p.stock > 0 && p.stock <= 3 && (
                        <p className="mt-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                          ¡Últimas {p.stock}!
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Juegos TCG */}
      <section id="juegos" className="mx-auto max-w-6xl px-4 pt-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {games.map((g) => {
            const gradient = g.color ?? 'from-neutral-500 to-neutral-700'
            const total = allProducts.filter((p) => p.game?.slug === g.slug).length
            return (
              <Link
                key={g.id}
                href={`/cartas?game=${g.slug}`}
                className="group relative flex flex-col items-center overflow-hidden rounded-3xl border border-neutral-200 bg-surface p-7 text-center transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${gradient}`}
                />
                <div
                  className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${gradient} opacity-20 blur-2xl transition group-hover:opacity-40`}
                />
                {g.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={g.image_url}
                    alt={g.name}
                    className="relative h-14 w-full object-contain sm:h-16"
                  />
                ) : (
                  <span
                    className={`relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-3xl shadow-md`}
                  >
                    {g.emoji}
                  </span>
                )}
                {total > 0 && (
                  <span className="relative mt-4 rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-500 transition group-hover:bg-indigo-600 group-hover:text-white">
                    {total} {total === 1 ? 'producto' : 'productos'}
                  </span>
                )}
                <span className="relative mt-5 inline-flex items-center gap-1.5 rounded-full border border-indigo-500/40 px-4 py-1.5 text-sm font-semibold text-indigo-500 transition group-hover:border-indigo-500 group-hover:bg-indigo-500 group-hover:text-white">
                  Ver juego
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Categorías */}
      <section className="border-y border-neutral-200 bg-neutral-50 dark:border-neutral-800/60 dark:bg-neutral-900/30">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {categories.map((c) => {
              const isActive = activeCategory?.slug === c.slug
              const isCartas = c.slug === 'cartas'
              const params = new URLSearchParams()
              if (activeGame && !isActive) params.set('game', activeGame.slug)
              if (!isActive) params.set('cat', c.slug)
              const href = isCartas
                ? '/cartas'
                : isActive || (!activeGame && !isActive && !activeCategory)
                  ? `/?cat=${c.slug}`
                  : `/?${params.toString()}`
              const count = allProducts.filter((p) => p.category?.slug === c.slug).length
              return (
                <Link
                  key={c.id}
                  href={href}
                  className={`group relative flex flex-col overflow-hidden rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    isActive
                      ? 'border-neutral-900 bg-[#0d0f14] text-white dark:border-neutral-700'
                      : 'border-neutral-200 bg-surface hover:border-indigo-400/60'
                  }`}
                >
                  <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br from-indigo-500/10 to-fuchsia-500/10 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl shadow-sm ring-1 ring-inset transition-transform duration-300 group-hover:scale-110 ${
                      isActive
                        ? 'bg-white/10 ring-white/15'
                        : 'bg-gradient-to-br from-indigo-500/10 to-fuchsia-500/10 ring-neutral-200 dark:ring-neutral-700/60'
                    }`}
                  >
                    {c.emoji}
                  </span>
                  <span className="mt-4 font-display text-base font-bold tracking-tight">
                    {c.name}
                  </span>
                  <span
                    className={`mt-1 text-xs font-medium ${
                      isActive ? 'text-white/70' : 'text-neutral-500 dark:text-neutral-400'
                    }`}
                  >
                    {count > 0
                      ? `${count} ${count === 1 ? 'producto' : 'productos'}`
                      : 'Próximamente'}
                  </span>
                  <span
                    className={`mt-4 inline-flex items-center gap-1 text-sm font-semibold transition-transform duration-300 group-hover:translate-x-1 ${
                      isActive
                        ? 'text-white'
                        : 'text-indigo-600 dark:text-indigo-400'
                    }`}
                  >
                    Ver
                    <span aria-hidden>→</span>
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Productos */}
      <section id="productos" className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeader
          kicker="Catálogo"
          title={
            activeGame
              ? `${activeGame.emoji} ${activeGame.name}`
              : activeCategory
                ? activeCategory.name
                : 'Productos destacados'
          }
          subtitle={
            activeGame || activeCategory
              ? 'Resultados con los filtros aplicados'
              : 'Actualizamos la selección seguido'
          }
          href={activeGame || activeCategory ? '/#productos' : undefined}
        />
        {featured.length === 0 ? (
          <p className="mt-10 text-center text-neutral-500">
            Todavía no hay productos en esta selección.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Accesorios: sección única */}
      {!activeGame && !activeCategory && accesorios.length > 0 && (
        <section id="accesorios" className="mx-auto max-w-6xl px-4 pb-20">
          <SectionHeader
            kicker="Accesorios"
            title="Accesorios para tu colección"
            subtitle="Fundas, binders, toploaders y todo lo necesario para cuidar tus cartas"
            href="/?cat=accesorios"
          />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {accesorios.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Singles: colecciones con filas de cartas */}
      {!activeGame &&
        !activeCategory &&
        featuredCollections.length > 0 && (
          <section className="mx-auto max-w-6xl px-4 pb-20">
            <SectionHeader
              kicker="Singles"
              title="Colecciones de cartas"
              subtitle="Explorá las cartas disponibles de cada colección"
              href="/cartas"
            />
            <div className="mt-10 space-y-12">
              {featuredCollections.map((coll) => (
                <div key={coll.key} className="space-y-4">
                  <div className="flex items-end justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                        {coll.group}
                      </p>
                      <h3 className="mt-1 truncate font-display text-xl font-bold tracking-tight sm:text-2xl">
                        {coll.name}
                      </h3>
                    </div>
                    <Link
                      href={`/cartas?set=${encodeURIComponent(coll.key)}`}
                      className="shrink-0 text-sm font-semibold text-indigo-600 transition hover:text-indigo-500"
                    >
                      Ver todo ({coll.cards.length}) →
                    </Link>
                  </div>
                  <div className="-mx-4 flex gap-5 overflow-x-auto px-4 pb-4 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {coll.cards.slice(0, 10).map((card) => (
                      <div key={card.id} className="w-44 shrink-0 snap-start">
                        <CardTile product={card} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      {/* CTA final */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-[#0d0f14] px-6 py-16 text-center text-white sm:px-16">
          <div className="bg-grid pointer-events-none absolute inset-0" />
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-indigo-600/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-fuchsia-600/40 blur-3xl" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-300">
              ¿Buscás algo puntual?
            </p>
            <h2 className="mx-auto mt-3 max-w-xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
              ¿No encontrás lo que buscás?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-white/70 sm:text-base">
              Pedinos esa carta, sobre o accesorio especial y lo conseguimos
              para tu colección.
            </p>
            <Link
              href="/login"
              className="mt-8 inline-block rounded-full bg-surface px-8 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
            >
              Hacé tu pedido →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}