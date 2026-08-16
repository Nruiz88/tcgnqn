import Link from 'next/link'
import { getProducts, getCategories, getGames } from '@/lib/data'
import { formatPrice } from '@/lib/format'
import type { Product } from '@/lib/types'
import ProductCard from '@/components/product-card'
import CardTile from '@/components/card-tile'
import { isCard } from '@/lib/cards'
import { POKEMON_ERAS, findPokemonSet } from '@/lib/pokemon-sets'

export const dynamic = 'force-dynamic'

const CATEGORY_STYLES: Record<
  string,
  {
    accent: string
    iconBox: string
    badge: string
    dot: string
    link: string
  }
> = {
  cartas: {
    accent: 'from-indigo-500 to-violet-500',
    iconBox:
      'from-indigo-500/20 to-violet-500/10 text-indigo-400 ring-indigo-500/25 shadow-indigo-500/20',
    badge:
      'bg-indigo-500/10 text-indigo-600 ring-indigo-500/25 dark:text-indigo-400',
    dot: 'bg-indigo-500',
    link: 'text-indigo-600 dark:text-indigo-400',
  },
  boosters: {
    accent: 'from-fuchsia-500 to-pink-500',
    iconBox:
      'from-fuchsia-500/20 to-pink-500/10 text-fuchsia-400 ring-fuchsia-500/25 shadow-fuchsia-500/20',
    badge:
      'bg-fuchsia-500/10 text-fuchsia-600 ring-fuchsia-500/25 dark:text-fuchsia-400',
    dot: 'bg-fuchsia-500',
    link: 'text-fuchsia-600 dark:text-fuchsia-400',
  },
  sleeves: {
    accent: 'from-emerald-500 to-teal-500',
    iconBox:
      'from-emerald-500/20 to-teal-500/10 text-emerald-400 ring-emerald-500/25 shadow-emerald-500/20',
    badge:
      'bg-emerald-500/10 text-emerald-600 ring-emerald-500/25 dark:text-emerald-400',
    dot: 'bg-emerald-500',
    link: 'text-emerald-600 dark:text-emerald-400',
  },
  accesorios: {
    accent: 'from-amber-500 to-orange-500',
    iconBox:
      'from-amber-500/20 to-orange-500/10 text-amber-400 ring-amber-500/25 shadow-amber-500/20',
    badge:
      'bg-amber-500/10 text-amber-600 ring-amber-500/25 dark:text-amber-400',
    dot: 'bg-amber-500',
    link: 'text-amber-600 dark:text-amber-400',
  },
  default: {
    accent: 'from-neutral-400 to-neutral-500',
    iconBox:
      'from-neutral-500/20 to-neutral-600/10 text-neutral-400 ring-neutral-500/25 shadow-neutral-500/20',
    badge:
      'bg-neutral-500/10 text-neutral-600 ring-neutral-500/25 dark:text-neutral-400',
    dot: 'bg-neutral-400',
    link: 'text-neutral-600 dark:text-neutral-400',
  },
}

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
        {/* Fondo: imagen panorámica + overlays para legibilidad */}
        <div className="pointer-events-none absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://s3.tcg.fans/optimized/users/0bd2c9aa-1bae-479b-8ea0-7b8e7c136684.webp"
            alt=""
            aria-hidden
            className="h-full w-full object-cover object-center opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0f14] via-[#0d0f14]/80 to-[#0d0f14]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f14] via-transparent to-[#0d0f14]/60" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-surface/5 px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Tienda online de cartas TCG
          </span>

          <div className="mt-5 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Cartas para cada{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
                  juego TCG
                </span>
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/70 sm:text-base">
                Singles, sobres y accesorios de Pokémon, Yu-Gi-Oh!, One Piece y
                más. Elegí, dejá tu pedido y coordinamos el pago por WhatsApp.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="#productos"
                className="group rounded-full bg-surface px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
              >
                Explorar catálogo{' '}
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <Link
                href="#juegos"
                className="rounded-full border border-white/20 bg-surface/5 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-surface/10"
              >
                Ver juegos
              </Link>
            </div>
          </div>
        </div>

        {/* Marquee: logos de los juegos TCG */}
        <div className="relative border-t border-white/10 bg-surface/5 py-4 backdrop-blur">
          <div className="flex overflow-hidden">
            <div className="animate-marquee flex shrink-0 items-center gap-12 pr-12">
              {[...games, ...games].map((g, i) => (
                <span
                  key={`${g.id}-${i}`}
                  className="flex shrink-0 items-center gap-2.5 whitespace-nowrap"
                >
                  {g.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={g.image_url}
                      alt={g.name}
                      className="h-7 w-auto object-contain opacity-60 grayscale transition group-hover:opacity-100"
                    />
                  ) : (
                    <span className="flex items-center gap-2 text-sm font-medium text-white/50">
                      <span>{g.emoji}</span> {g.name}
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nuevos ingresos: ticker con los últimos productos cargados (estilo PokeArgentum) */}
      {!activeGame && !activeCategory && newArrivals.length > 0 && (
        <section className="border-b border-neutral-200 bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="ticker-wrap block overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50/60 p-2 dark:border-neutral-800/60 dark:bg-neutral-900/40">
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
                      <p className="truncate text-[13px] font-semibold text-neutral-800">
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
      <section className="relative border-y border-neutral-200 bg-neutral-50 dark:border-neutral-800/60 dark:bg-neutral-900/30">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
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
              const style =
                CATEGORY_STYLES[c.slug] ?? CATEGORY_STYLES.default
              return (
                <Link
                  key={c.id}
                  href={href}
                  className={`group relative flex flex-col overflow-hidden rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${
                    isActive
                      ? 'border-neutral-900 bg-[#0d0f14] text-white dark:border-neutral-700'
                      : 'border-neutral-200 bg-surface hover:border-neutral-300 dark:border-neutral-800/60 dark:hover:border-neutral-700'
                  }`}
                >
                  {/* Glow superior de color por categoría */}
                  <div
                    className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${style.accent}`}
                  />
                  <div
                    className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${style.accent} opacity-[0.14] blur-2xl transition-opacity duration-300 group-hover:opacity-30`}
                  />
                  <div className="pointer-events-none absolute -bottom-16 -left-10 h-28 w-28 rounded-full bg-gradient-to-br from-neutral-500/10 to-transparent blur-2xl" />

                  <span
                    className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-3xl shadow-lg ring-1 ring-inset transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 ${style.iconBox}`}
                  >
                    {c.emoji}
                  </span>

                  <span className="relative mt-5 font-display text-base font-bold tracking-tight">
                    {c.name}
                  </span>

                  <span
                    className={`relative mt-2.5 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${
                      count > 0 ? style.badge : 'bg-neutral-100 text-neutral-400 ring-neutral-200 dark:bg-neutral-800/60 dark:text-neutral-500 dark:ring-neutral-700/60'
                    }`}
                  >
                    {count > 0 ? (
                      <>
                        <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                        {count} {count === 1 ? 'producto' : 'productos'}
                      </>
                    ) : (
                      'Próximamente'
                    )}
                  </span>

                  <span
                    className={`relative mt-auto flex items-center gap-1.5 pt-5 text-sm font-semibold transition-all duration-300 group-hover:gap-2.5 ${
                      isActive ? 'text-white' : style.link
                    }`}
                  >
                    Explorar
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
                      →
                    </span>
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