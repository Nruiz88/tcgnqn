import { Suspense } from 'react'
import Link from 'next/link'
import { getAdminProducts, getCategories, getGames } from '@/lib/data'
import { formatPrice } from '@/lib/format'
import { toggleProduct, deleteProduct } from '@/lib/actions'
import { revalidatePath } from 'next/cache'
import { CONDITION_LABELS, LANGUAGE_LABELS, conditionColor } from '@/lib/cards'
import {
  Icon,
  PageHeader,
  EmptyState,
  btnPrimary,
  btnSecondary,
  btnDanger,
} from '@/components/admin-ui'
import AdminProductsToolbar from '@/components/admin-products-toolbar'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 20

const tagCls =
  'inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600 ring-1 ring-inset ring-neutral-200 dark:bg-neutral-800/60 dark:text-neutral-400 dark:ring-neutral-700/60'

function firstString(
  v: string | string[] | undefined,
): string | undefined {
  return typeof v === 'string' ? v : undefined
}

export default async function AdminCartasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams

  const status = firstString(sp.estado)
  const sort = firstString(sp.sort)
  const [categories, games, result] = await Promise.all([
    getCategories(),
    getGames(),
    getAdminProducts({
      categorySlug: 'cartas',
      query: firstString(sp.q) ?? '',
      gameId: firstString(sp.game) ?? '',
      condition: firstString(sp.cond) ?? '',
      language: firstString(sp.lang) ?? '',
      status:
        status === 'active' || status === 'hidden'
          ? status
          : undefined,
      sort: ['price_asc', 'price_desc', 'stock_asc'].includes(sort ?? '')
        ? (sort as 'price_asc' | 'price_desc' | 'stock_asc')
        : undefined,
      page: Math.max(1, Number(sp.page) || 1),
      pageSize: PAGE_SIZE,
    }),
  ])

  const cartasId = categories.find((c) => c.slug === 'cartas')?.id
  const cards = result.products
  const pageCount = Math.max(1, Math.ceil(result.total / PAGE_SIZE))

  return (
    <div>
      <PageHeader
        icon="fileText"
        title="Cartas individuales"
        description={`${result.total} cartas en la sección Singles`}
      >
        <Link
          href={cartasId ? '/admin/cartas/new' : '/admin/categories'}
          className={btnPrimary}
        >
          <Icon name="plus" className="h-4 w-4" />
          Nueva carta
        </Link>
      </PageHeader>

      <Suspense fallback={null}>
        <AdminProductsToolbar
          total={result.total}
          pageCount={pageCount}
          games={games}
        />
      </Suspense>

      <div className="mt-4 rounded-2xl border border-neutral-200 bg-surface p-2">
        {cards.length === 0 && (
          <div className="p-2">
            <EmptyState
              icon="fileText"
              title={
                result.total === 0
                  ? 'No hay cartas cargadas'
                  : 'Sin resultados para esos filtros'
              }
              description={
                result.total === 0
                  ? 'Cargá la primera carta para sumarla a la sección Singles.'
                  : 'Probá con otra búsqueda o quitá algún filtro.'
              }
              action={
                result.total === 0 ? (
                  <Link
                    href={cartasId ? '/admin/cartas/new' : '/admin/categories'}
                    className={btnPrimary}
                  >
                    <Icon name="plus" className="h-4 w-4" />
                    Nueva carta
                  </Link>
                ) : undefined
              }
            />
          </div>
        )}
        <div className="space-y-1">
          {cards.map((card) => (
            <div
              key={card.id}
              className="flex flex-wrap items-center gap-4 rounded-xl p-2.5 transition hover:bg-neutral-50 dark:hover:bg-neutral-800/40 sm:p-3"
            >
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800/60">
                {card.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={card.image_url}
                    alt={card.name}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-medium">{card.name}</p>
                  {!card.active && (
                    <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600 ring-1 ring-inset ring-amber-500/20 dark:text-amber-400">
                      Oculto
                    </span>
                  )}
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  {card.game?.name && (
                    <span className={tagCls}>
                      {card.game.emoji} {card.game.name}
                    </span>
                  )}
                  {card.condition && (
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${conditionColor(card.condition)}`}
                      title={CONDITION_LABELS[card.condition]}
                    >
                      {card.condition}
                    </span>
                  )}
                  {card.language && (
                    <span className={tagCls}>
                      {card.language} · {LANGUAGE_LABELS[card.language]}
                    </span>
                  )}
                  {card.card_type && (
                    <span className={tagCls}>{card.card_type}</span>
                  )}
                  {card.set_name && (
                    <span className={tagCls}>{card.set_name}</span>
                  )}
                </div>
                <p className="mt-1 text-xs text-neutral-500">
                  {formatPrice(card.price)} · Stock: {card.stock}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <form
                  action={async () => {
                    'use server'
                    await toggleProduct(card.id, !card.active)
                    revalidatePath('/admin/cartas')
                  }}
                >
                  <button
                    title={card.active ? 'Ocultar carta' : 'Publicar carta'}
                    className={btnSecondary}
                  >
                    <Icon
                      name={card.active ? 'eyeOff' : 'eye'}
                      className="h-3.5 w-3.5"
                    />
                    <span className="hidden sm:inline">
                      {card.active ? 'Ocultar' : 'Publicar'}
                    </span>
                  </button>
                </form>
                <Link
                  href={`/admin/cartas/${card.id}/edit`}
                  className={btnSecondary}
                >
                  <Icon name="pencil" className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Editar</span>
                </Link>
                <form
                  action={async () => {
                    'use server'
                    await deleteProduct(card.id)
                    revalidatePath('/admin/cartas')
                  }}
                >
                  <button title="Borrar carta" className={btnDanger}>
                    <Icon name="trash" className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Borrar</span>
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
