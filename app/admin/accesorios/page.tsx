import { Suspense } from 'react'
import Link from 'next/link'
import { getAdminProducts, getCategories, getGames } from '@/lib/data'
import { formatPrice } from '@/lib/format'
import { toggleProduct, toggleFeatured, deleteProduct } from '@/lib/actions'
import { revalidatePath } from 'next/cache'
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

export default async function AdminAccesoriosPage({
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
      categorySlug: 'accesorios',
      query: firstString(sp.q) ?? '',
      gameId: firstString(sp.game) ?? '',
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

  const accesoriosId = categories.find((c) => c.slug === 'accesorios')?.id
  const products = result.products
  const pageCount = Math.max(1, Math.ceil(result.total / PAGE_SIZE))

  return (
    <div>
      <PageHeader
        icon="folder"
        title="Accesorios"
        description={`${result.total} accesorios en la sección`}
      >
        <Link
          href={
            accesoriosId
              ? `/admin/products/new?cat=${accesoriosId}`
              : '/admin/categories'
          }
          className={btnPrimary}
        >
          <Icon name="plus" className="h-4 w-4" />
          Nuevo accesorio
        </Link>
      </PageHeader>

      <Suspense fallback={null}>
        <AdminProductsToolbar
          total={result.total}
          pageCount={pageCount}
          games={games}
          nounSingular="accesorio"
          nounPlural="accesorios"
        />
      </Suspense>

      <div className="mt-4 rounded-2xl border border-neutral-200 bg-surface p-2">
        {products.length === 0 && (
          <div className="p-2">
            <EmptyState
              icon="folder"
              title={
                result.total === 0
                  ? 'No hay accesorios cargados'
                  : 'Sin resultados para esos filtros'
              }
              description={
                result.total === 0
                  ? 'Cargá el primer accesorio para sumarlo a la sección.'
                  : 'Probá con otra búsqueda o quitá algún filtro.'
              }
              action={
                result.total === 0 ? (
                  <Link
                    href={
                      accesoriosId
                        ? `/admin/products/new?cat=${accesoriosId}`
                        : '/admin/categories'
                    }
                    className={btnPrimary}
                  >
                    <Icon name="plus" className="h-4 w-4" />
                    Nuevo accesorio
                  </Link>
                ) : undefined
              }
            />
          </div>
        )}
        <div className="space-y-1">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-wrap items-center gap-4 rounded-xl p-2.5 transition hover:bg-neutral-50 dark:hover:bg-neutral-800/40 sm:p-3"
            >
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800/60">
                {product.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-medium">{product.name}</p>
                  {product.featured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600 ring-1 ring-inset ring-amber-500/20 dark:text-amber-400">
                      <Icon name="star" className="h-3 w-3 fill-amber-400 text-amber-400" />
                      Destacado
                    </span>
                  )}
                  {!product.active && (
                    <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600 ring-1 ring-inset ring-amber-500/20 dark:text-amber-400">
                      Oculto
                    </span>
                  )}
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  {product.game?.name && (
                    <span className={tagCls}>
                      {product.game.emoji} {product.game.name}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-neutral-500">
                  {formatPrice(product.price)} · Stock: {product.stock}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <form
                  action={async () => {
                    'use server'
                    await toggleFeatured(product.id, !product.featured)
                    revalidatePath('/admin/accesorios')
                  }}
                >
                  <button
                    title={
                      product.featured
                        ? 'Quitar de destacados'
                        : 'Destacar en la home'
                    }
                    className={`${btnSecondary} ${
                      product.featured
                        ? '!border-amber-400/60 !text-amber-600 dark:!text-amber-400'
                        : ''
                    }`}
                  >
                    <Icon
                      name="star"
                      className={`h-3.5 w-3.5 ${
                        product.featured ? 'fill-amber-400 text-amber-400' : ''
                      }`}
                    />
                    <span className="hidden sm:inline">
                      {product.featured ? 'Destacado' : 'Destacar'}
                    </span>
                  </button>
                </form>
                <form
                  action={async () => {
                    'use server'
                    await toggleProduct(product.id, !product.active)
                    revalidatePath('/admin/accesorios')
                  }}
                >
                  <button
                    title={product.active ? 'Ocultar producto' : 'Publicar producto'}
                    className={btnSecondary}
                  >
                    <Icon
                      name={product.active ? 'eyeOff' : 'eye'}
                      className="h-3.5 w-3.5"
                    />
                    <span className="hidden sm:inline">
                      {product.active ? 'Ocultar' : 'Publicar'}
                    </span>
                  </button>
                </form>
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className={btnSecondary}
                >
                  <Icon name="pencil" className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Editar</span>
                </Link>
                <form
                  action={async () => {
                    'use server'
                    await deleteProduct(product.id)
                    revalidatePath('/admin/accesorios')
                  }}
                >
                  <button title="Borrar accesorio" className={btnDanger}>
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
