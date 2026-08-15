import Link from 'next/link'
import { getProducts, getCategories, getGames } from '@/lib/data'
import type { Product } from '@/lib/types'
import ProductCard from '@/components/product-card'
import CardTile from '@/components/card-tile'
import { isCard } from '@/lib/cards'
import { POKEMON_ERAS, findPokemonSet } from '@/lib/pokemon-sets'

export const dynamic = 'force-dynamic'

const features = [
  { title: 'Envío seguro', desc: 'Protección rígida y seguimiento en todo el país.' },
  { title: 'Cartas verificadas', desc: 'Revisamos calidad y estado antes de enviar.' },
  { title: 'Pago coordinado', desc: 'Arreglamos el pago por WhatsApp al confirmar.' },
  { title: 'Colección curada', desc: 'Solo productos que elegimos para tu binder.' },
]

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

  const featured = products.slice(0, 8)
  // Recién llegados: solo productos normales, sin cartas individuales
  const latest = allProducts
    .filter((p) => !isCard(p))
    .slice()
    .reverse()
    .slice(0, 4)

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

            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
              {features.map((f) => (
                <span key={f.title} className="flex items-center gap-2 text-sm text-white/60">
                  <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
                  </svg>
                  {f.title}
                </span>
              ))}
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

      {/* Features */}
      <section className="border-b border-neutral-200 bg-surface">
        <div className="mx-auto grid max-w-6xl gap-px overflow-hidden px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="group p-2">
              <div className="rounded-2xl p-5 transition group-hover:bg-neutral-50">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0d0f14] text-white transition group-hover:bg-indigo-600">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="mt-4 text-sm font-semibold text-neutral-900">{f.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-neutral-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Juegos TCG */}
      <section id="juegos" className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeader
          kicker="Juegos"
          title="Elegí tu juego"
          subtitle="Singles, sobres, cajas y accesorios para tu juego favorito"
        />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
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
                    className="relative h-20 w-20 rounded-2xl object-cover shadow-md"
                  />
                ) : (
                  <span
                    className={`relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-3xl shadow-md`}
                  >
                    {g.emoji}
                  </span>
                )}
                <p className="relative mt-4 font-display text-lg font-semibold">{g.name}</p>
                <span
                  className={`relative mt-3 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                    total > 0
                      ? 'bg-neutral-100 text-neutral-500 transition group-hover:bg-indigo-600 group-hover:text-white'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {total > 0
                    ? `${total} ${total === 1 ? 'producto' : 'productos'}`
                    : 'Próximamente'}
                </span>
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
      <section className="border-y border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <SectionHeader
            kicker="Categorías"
            title="Explorá por categoría"
            subtitle={
              activeGame
                ? `Categorías disponibles para ${activeGame.name}`
                : 'Lo que tenemos hoy en la tienda'
            }
          />
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
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
              return (
                <Link
                  key={c.id}
                  href={href}
                  className={`group flex items-center justify-between rounded-3xl border p-6 transition hover:-translate-y-1 hover:shadow-lg ${
                    isActive
                      ? 'border-neutral-900 bg-[#0d0f14] text-white'
                      : 'border-neutral-200 bg-surface'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-2xl">{c.emoji}</span>
                    <span className="text-sm font-semibold">{c.name}</span>
                  </span>
                  <span
                    className={`text-lg transition-transform group-hover:translate-x-1 ${
                      isActive ? 'text-white' : 'text-neutral-300'
                    }`}
                  >
                    →
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
            {featured.map((product) =>
              isCard(product) ? (
                <CardTile key={product.id} product={product} />
              ) : (
                <ProductCard key={product.id} product={product} />
              ),
            )}
          </div>
        )}
      </section>

      {/* Novedades */}
      {!activeGame && !activeCategory && latest.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-20">
          <SectionHeader
            kicker="Novedades"
            title="Recién llegados"
            subtitle="Lo último que sumamos a la tienda"
            href="/#productos"
          />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {latest.map((product) =>
              isCard(product) ? (
                <CardTile key={product.id} product={product} />
              ) : (
                <ProductCard key={product.id} product={product} />
              ),
            )}
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