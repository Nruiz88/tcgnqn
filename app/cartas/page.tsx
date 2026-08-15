import { getProducts, getGames } from '@/lib/data'
import CardTile from '@/components/card-tile'
import CatalogControls from '@/components/catalog-controls'

export const dynamic = 'force-dynamic'

export default async function CartasPage({
  searchParams,
}: {
  searchParams: Promise<{ game?: string; set?: string; sort?: string }>
}) {
  const [{ game, set: setParam, sort }, games, allProducts] = await Promise.all([
    searchParams,
    getGames(),
    getProducts(),
  ])

  const singles = allProducts.filter((p) => p.category?.slug === 'cartas')
  const activeGame = game ? games.find((g) => g.slug === game) : undefined

  const sets: { name: string; gameName: string; count: number }[] = []
  const setMap = new Map<string, { name: string; gameName: string; count: number }>()
  for (const p of singles) {
    if (!p.set_name) continue
    const key = p.set_name.trim().toLowerCase()
    const existing = setMap.get(key)
    if (existing) existing.count += 1
    else {
      const opt = {
        name: p.set_name,
        gameName: p.game?.name ?? 'Otros',
        count: 1,
      }
      setMap.set(key, opt)
      sets.push(opt)
    }
  }
  sets.sort((a, b) => a.name.localeCompare(b.name))

  let filtered = singles
  if (activeGame) filtered = filtered.filter((p) => p.game?.slug === game)
  if (setParam) {
    filtered = filtered.filter(
      (p) => p.set_name?.trim().toLowerCase() === setParam.trim().toLowerCase(),
    )
  }

  if (sort === 'name') {
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))
  } else if (sort === 'price-desc') {
    filtered = [...filtered].sort((a, b) => b.price - a.price)
  } else if (sort === 'price-asc') {
    filtered = [...filtered].sort((a, b) => a.price - b.price)
  }

  const subtitle = setParam
    ? `Cartas de la colección ${setParam}`
    : activeGame
      ? `Singles sueltos de ${activeGame.name} para tu colección`
      : 'Cartas sueltas de todos los juegos, elegidas para tu binder'

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
            Singles
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {setParam
              ? setParam
              : activeGame
                ? `${activeGame.emoji} Cartas individuales · ${activeGame.name}`
                : 'Cartas individuales'}
          </h1>
          <p className="mt-2 max-w-lg text-sm text-neutral-500 sm:text-base">
            {subtitle}
          </p>
        </div>
      </div>

      <CatalogControls
        games={games.map((g) => ({
          id: g.id,
          slug: g.slug,
          name: g.name,
          emoji: g.emoji,
        }))}
        sets={sets}
        game={game}
        set={setParam}
        sort={sort}
      />

      {filtered.length === 0 ? (
        <p className="mt-16 rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-sm text-neutral-500">
          {setParam
            ? `Todavía no hay cartas de la colección ${setParam}.`
            : activeGame
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