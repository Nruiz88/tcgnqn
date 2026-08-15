import Link from 'next/link'
import { getProducts, getGames } from '@/lib/data'
import CardTile from '@/components/card-tile'

export const dynamic = 'force-dynamic'

export default async function CartasPage({
  searchParams,
}: {
  searchParams: Promise<{ game?: string }>
}) {
  const [{ game }, games, allProducts] = await Promise.all([
    searchParams,
    getGames(),
    getProducts(),
  ])

  const singles = allProducts.filter((p) => p.category?.slug === 'cartas')
  const activeGame = game ? games.find((g) => g.slug === game) : undefined
  const filtered = activeGame
    ? singles.filter((p) => p.game?.slug === game)
    : singles

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
            Singles
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {activeGame
              ? `${activeGame.emoji} Cartas individuales · ${activeGame.name}`
              : 'Cartas individuales'}
          </h1>
          <p className="mt-2 max-w-lg text-sm text-neutral-500 sm:text-base">
            {activeGame
              ? `Singles sueltos de ${activeGame.name} para tu colección`
              : 'Cartas sueltas de todos los juegos, elegidas para tu binder'}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/cartas"
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
            !activeGame
              ? 'border-neutral-900 bg-[#0d0f14] text-white'
              : 'border-neutral-300 text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          Todos
        </Link>
        {games.map((g) => (
          <Link
            key={g.id}
            href={`/cartas?game=${g.slug}`}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              activeGame?.slug === g.slug
                ? 'border-neutral-900 bg-[#0d0f14] text-white'
                : 'border-neutral-300 text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            {g.emoji} {g.name}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-sm text-neutral-500">
          {activeGame
            ? `Todavía no hay cartas individuales de ${activeGame.name}.`
            : 'Todavía no hay cartas individuales cargadas.'}
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <CardTile key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}