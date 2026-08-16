'use client'

import { useEffect, useState } from 'react'
import { parseAsInteger, useQueryState } from 'nuqs'
import {
  CONDITIONS,
  CONDITION_LABELS,
  LANGUAGES,
  LANGUAGE_LABELS,
} from '@/lib/cards'
import type { Game } from '@/lib/types'
import { Icon } from '@/components/admin-ui'

const selectCls =
  'rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'

function pagesList(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '…')[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  if (start > 2) pages.push('…')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total - 1) pages.push('…')
  pages.push(total)
  return pages
}

export default function AdminProductsToolbar({
  total,
  pageCount,
  games,
  nounSingular = 'carta',
  nounPlural = 'cartas',
}: {
  total: number
  pageCount: number
  games: Game[]
  nounSingular?: string
  nounPlural?: string
}) {
  const [q, setQ] = useQueryState('q', { defaultValue: '', history: 'replace' })
  const [game, setGame] = useQueryState('game', {
    defaultValue: '',
    history: 'replace',
  })
  const [cond, setCond] = useQueryState('cond', {
    defaultValue: '',
    history: 'replace',
  })
  const [lang, setLang] = useQueryState('lang', {
    defaultValue: '',
    history: 'replace',
  })
  const [estado, setEstado] = useQueryState('estado', {
    defaultValue: '',
    history: 'replace',
  })
  const [sort, setSort] = useQueryState('sort', {
    defaultValue: '',
    history: 'replace',
  })
  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(1).withOptions({ history: 'replace' }),
  )

  // Búsqueda con debounce: cada cambio de texto actualiza la URL (y al server).
  const [input, setInput] = useState(q)
  useEffect(() => {
    const t = setTimeout(() => {
      if (input !== q) {
        setQ(input || null)
        setPage(1)
      }
    }, 350)
    return () => clearTimeout(t)
  }, [input, q, setQ, setPage])

  async function changeFilter(
    setter: (v: string | null) => Promise<unknown>,
    value: string,
  ) {
    await setter(value || null)
    await setPage(1)
  }

  const hasFilters = !!(q || game || cond || lang || estado || sort)
  const current = Math.min(page, Math.max(1, pageCount))

  return (
    <div className="mt-6 rounded-2xl border border-neutral-200 bg-surface p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1 basis-64">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Buscar por nombre o descripción…"
            className="w-full rounded-lg border border-neutral-300 bg-transparent py-2 pl-9 pr-3 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <select
          value={game}
          onChange={(e) => changeFilter(setGame, e.target.value)}
          className={selectCls}
        >
          <option value="">Todos los juegos</option>
          {games.map((g) => (
            <option key={g.id} value={g.id}>
              {g.emoji} {g.name}
            </option>
          ))}
        </select>

        <select
          value={cond}
          onChange={(e) => changeFilter(setCond, e.target.value)}
          className={selectCls}
        >
          <option value="">Toda condición</option>
          {CONDITIONS.map((c) => (
            <option key={c} value={c}>
              {c} · {CONDITION_LABELS[c]}
            </option>
          ))}
        </select>

        <select
          value={lang}
          onChange={(e) => changeFilter(setLang, e.target.value)}
          className={selectCls}
        >
          <option value="">Todos los idiomas</option>
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {l} · {LANGUAGE_LABELS[l]}
            </option>
          ))}
        </select>

        <select
          value={estado}
          onChange={(e) => changeFilter(setEstado, e.target.value)}
          className={selectCls}
        >
          <option value="">Publicadas y ocultas</option>
          <option value="active">Solo publicadas</option>
          <option value="hidden">Solo ocultas</option>
        </select>

        <select
          value={sort}
          onChange={(e) => changeFilter(setSort, e.target.value)}
          className={selectCls}
        >
          <option value="">Más recientes</option>
          <option value="price_asc">Precio: menor a mayor</option>
          <option value="price_desc">Precio: mayor a menor</option>
          <option value="stock_asc">Stock: menor a mayor</option>
        </select>

        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setQ(null)
              setGame(null)
              setCond(null)
              setLang(null)
              setEstado(null)
              setSort(null)
              setPage(1)
              setInput('')
            }}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-neutral-500 transition hover:text-red-500"
          >
            <Icon name="x" className="h-4 w-4" />
            Limpiar
          </button>
        )}
      </div>

      {/* Paginación + contador */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-4">
        <p className="text-xs text-neutral-500">
          {total === 0
            ? 'Sin resultados'
            : `${total} ${total === 1 ? nounSingular : nounPlural}${
                pageCount > 1
                  ? ` · página ${current} de ${pageCount}`
                  : ''
              }`}
        </p>
        {pageCount > 1 && (
          <nav className="flex items-center gap-1" aria-label="Paginación">
            <button
              type="button"
              disabled={current <= 1}
              onClick={() => setPage(current - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 disabled:opacity-40 disabled:hover:bg-transparent dark:hover:bg-neutral-800/50"
              aria-label="Página anterior"
            >
              ‹
            </button>
            {pagesList(current, pageCount).map((p, i) =>
              p === '…' ? (
                <span
                  key={`ellipsis-${i}`}
                  className="px-1 text-sm text-neutral-400"
                >
                  …
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  aria-current={p === current ? 'page' : undefined}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition ${
                    p === current
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/25'
                      : 'text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800/50'
                  }`}
                >
                  {p}
                </button>
              ),
            )}
            <button
              type="button"
              disabled={current >= pageCount}
              onClick={() => setPage(current + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 disabled:opacity-40 disabled:hover:bg-transparent dark:hover:bg-neutral-800/50"
              aria-label="Página siguiente"
            >
              ›
            </button>
          </nav>
        )}
      </div>
    </div>
  )
}
