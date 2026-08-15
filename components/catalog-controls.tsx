'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

type Game = {
  id: string
  slug: string
  name: string
  emoji: string | null
  image_url: string | null
}

export type CollectionEntry = {
  key: string
  name: string
  code?: string
  group: string
  count: number
}

const chipCls = 'rounded-full border px-4 py-2 text-sm font-medium transition'
const rowCls =
  'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-neutral-50 dark:hover:bg-neutral-800/50'

export default function CatalogControls({
  games,
  collections,
  game,
  set,
  sort,
  activeSetName,
}: {
  games: Game[]
  collections: CollectionEntry[]
  game?: string
  set?: string
  sort?: string
  activeSetName?: string
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  const buildQs = (g?: string, s?: string, o?: string) => {
    const p = new URLSearchParams()
    if (g) p.set('game', g)
    if (s) p.set('set', s)
    if (o) p.set('sort', o)
    const str = p.toString()
    return str ? `?${str}` : ''
  }

  const pickGame = (slug?: string) => {
    router.push(`/cartas${buildQs(slug, undefined, sort)}`)
  }

  const pickSet = (key?: string) => {
    setOpen(false)
    router.push(`/cartas${buildQs(undefined, key, sort)}`)
  }

  const groups: { group: string; items: CollectionEntry[] }[] = []
  const gMap = new Map<string, CollectionEntry[]>()
  for (const e of collections) {
    const arr = gMap.get(e.group) ?? []
    arr.push(e)
    gMap.set(e.group, arr)
  }
  for (const [group, items] of gMap) groups.push({ group, items })

  const selectCls =
    'mt-1 w-full rounded-lg border border-neutral-300 bg-surface px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none sm:w-64'

  return (
    <div className="mt-8 space-y-4">
      <div className="flex flex-wrap gap-2">
        <Link
          href={buildQs(undefined, set, sort)}
          onClick={() => pickGame(undefined)}
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
            onClick={() => pickGame(g.slug)}
            className={`${chipCls} ${
              game === g.slug
                ? 'border-neutral-900 bg-[#0d0f14] text-white'
                : 'border-neutral-300 text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <span className="flex items-center gap-1.5">
              {g.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={g.image_url}
                  alt=""
                  className="h-5 w-5 rounded-full object-cover"
                />
              ) : (
                <span>{g.emoji}</span>
              )}
              {g.name}
            </span>
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div ref={panelRef} className="relative sm:w-80">
          <span className="text-xs font-medium text-neutral-500">Colección</span>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="mt-1 flex w-full items-center justify-between gap-2 rounded-lg border border-neutral-300 bg-surface px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          >
            <span className="truncate">
              {activeSetName ?? 'Todas las colecciones'}
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`shrink-0 text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {open && (
            <div className="absolute z-30 mt-2 max-h-[60vh] w-full overflow-y-auto rounded-xl border border-neutral-200 bg-surface shadow-xl">
              <button
                type="button"
                onClick={() => pickSet(undefined)}
                className={`${rowCls} ${
                  !set
                    ? 'bg-indigo-50 font-semibold text-indigo-700 dark:bg-indigo-950/40'
                    : 'text-neutral-600'
                }`}
              >
                Todas las colecciones
              </button>
              {groups.map((g) => (
                <div key={g.group}>
                  <p className="sticky top-0 border-b border-neutral-100 bg-surface px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
                    {g.group}
                  </p>
                  {g.items.map((it) => (
                    <button
                      type="button"
                      key={it.key}
                      onClick={() => pickSet(it.key)}
                      className={`${rowCls} ${
                        set === it.key
                          ? 'bg-indigo-50 font-semibold text-indigo-700 dark:bg-indigo-950/40'
                          : 'text-neutral-600'
                      }`}
                    >
                      {it.code && (
                        <span className="shrink-0 rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-neutral-600 dark:bg-neutral-200 dark:text-neutral-700">
                          {it.code}
                        </span>
                      )}
                      <span className="min-w-0 truncate">{it.name}</span>
                      {it.count > 0 && (
                        <span className="ml-auto shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-500">
                          {it.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <label className="block sm:w-64">
          <span className="text-xs font-medium text-neutral-500">
            Ordenar por
          </span>
          <select
            value={sort ?? ''}
            onChange={(e) =>
              router.push(`/cartas${buildQs(game, set, e.target.value || undefined)}`)
            }
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