'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Game = { id: string; slug: string; name: string; emoji: string | null }
type SetOption = { name: string; gameName: string; count: number }

const chipCls =
  'rounded-full border px-4 py-2 text-sm font-medium transition'
const selectCls =
  'mt-1 w-full rounded-lg border border-neutral-300 bg-surface px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none sm:w-64'

export default function CatalogControls({
  games,
  sets,
  game,
  set,
  sort,
}: {
  games: Game[]
  sets: SetOption[]
  game?: string
  set?: string
  sort?: string
}) {
  const router = useRouter()

  const buildQs = (g?: string, s?: string, o?: string) => {
    const p = new URLSearchParams()
    if (g) p.set('game', g)
    if (s) p.set('set', s)
    if (o) p.set('sort', o)
    const str = p.toString()
    return str ? `?${str}` : ''
  }

  const change = (key: 'set' | 'sort', value: string) => {
    const nextSet = key === 'set' ? value || undefined : set
    const nextGame = key === 'set' ? undefined : game
    const nextSort = key === 'sort' ? value || undefined : sort
    router.push(`/cartas${buildQs(nextGame, nextSet, nextSort)}`)
  }

  const grouped = new Map<string, SetOption[]>()
  for (const sg of sets) {
    const arr = grouped.get(sg.gameName) ?? []
    arr.push(sg)
    grouped.set(sg.gameName, arr)
  }

  return (
    <div className="mt-8 space-y-4">
      <div className="flex flex-wrap gap-2">
        <Link
          href={buildQs(undefined, set, sort)}
          className={`${chipCls} ${
            !game
              ? 'border-neutral-900 bg-[#0d0f14] text-white'
              : 'border-neutral-300 text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          Todos
        </Link>
        {games.map((g) => (
          <Link
            key={g.id}
            href={buildQs(g.slug, undefined, sort)}
            className={`${chipCls} ${
              game === g.slug
                ? 'border-neutral-900 bg-[#0d0f14] text-white'
                : 'border-neutral-300 text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            {g.emoji} {g.name}
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="block sm:w-64">
          <span className="text-xs font-medium text-neutral-500">
            Colección
          </span>
          <select
            value={set ?? ''}
            onChange={(e) => change('set', e.target.value)}
            className={selectCls}
          >
            <option value="">Todas las colecciones</option>
            {[...grouped.entries()].map(([gameName, list]) => (
              <optgroup key={gameName} label={gameName}>
                {list.map((sg) => (
                  <option key={sg.name} value={sg.name}>
                    {sg.name} ({sg.count})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>

        <label className="block sm:w-64">
          <span className="text-xs font-medium text-neutral-500">
            Ordenar por
          </span>
          <select
            value={sort ?? ''}
            onChange={(e) => change('sort', e.target.value)}
            className={selectCls}
          >
            <option value="">Predeterminado</option>
            <option value="name">Nombre</option>
            <option value="price-desc">Mayor precio</option>
            <option value="price-asc">Menor precio</option>
          </select>
        </label>
      </div>
    </div>
  )
}