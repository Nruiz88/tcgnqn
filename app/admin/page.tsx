import Link from 'next/link'
import { getAllProducts, getAllOrders } from '@/lib/data'
import { formatPrice } from '@/lib/format'
import { toggleProduct } from '@/lib/actions'
import { revalidatePath } from 'next/cache'
import type { Product } from '@/lib/types'

export const dynamic = 'force-dynamic'

function stockBadge(stock: number) {
  if (stock <= 0) return { label: 'Agotado', cls: 'bg-red-100 text-red-700' }
  if (stock <= 3)
    return { label: `Últimas ${stock}`, cls: 'bg-amber-100 text-amber-700' }
  return { label: 'Disponible', cls: 'bg-green-100 text-green-700' }
}

export default async function AdminDashboardPage() {
  const [products, orders] = await Promise.all([
    getAllProducts(),
    getAllOrders(),
  ])

  const activeCount = products.filter((p) => p.active).length
  const lowStock = products.filter((p) => p.stock <= 3)
  const pending = orders.filter((o) => o.status === 'pending')
  const revenue = orders
    .filter((o) => o.status === 'confirmed' || o.status === 'shipped')
    .reduce((acc, o) => acc + o.total, 0)

  const stats = [
    {
      label: 'Productos',
      value: products.length,
      sub: `${activeCount} publicados`,
    },
    {
      label: 'Stock bajo',
      value: lowStock.length,
      sub: 'necesitan reposición',
    },
    {
      label: 'Pedidos pendientes',
      value: pending.length,
      sub: 'por confirmar',
    },
    { label: 'Ingresos', value: formatPrice(revenue), sub: 'confirmados + enviados' },
  ]

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight">
            Productos
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Gestioná tu catálogo, stock y publicaciones
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          + Nuevo producto
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-neutral-200 bg-surface p-5"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              {s.label}
            </p>
            <p className="mt-2 truncate font-display text-2xl font-bold tracking-tight">
              {s.value}
            </p>
            <p className="mt-1 text-xs text-neutral-500">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        {products.length === 0 && (
          <p className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-sm text-neutral-500">
            Todavía no hay productos. Creá el primero.
          </p>
        )}
        {products.map((product) => {
          const badge = stockBadge(product.stock)
          return (
            <div
              key={product.id}
              className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-surface p-4 transition hover:border-neutral-300"
            >
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
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
                <p className="truncate font-medium">{product.name}</p>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {formatPrice(product.price)} · Stock: {product.stock}
                  {product.game?.name &&
                    ` · ${product.game.emoji} ${product.game.name}`}
                  {product.category?.name && ` · ${product.category.name}`}
                </p>
              </div>
              <div className="hidden items-center gap-2 sm:flex">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${badge.cls}`}
                >
                  {badge.label}
                </span>
                {!product.active && (
                  <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600">
                    Oculto
                  </span>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <form
                  action={async () => {
                    'use server'
                    await toggleProduct(product.id, !product.active)
                    revalidatePath('/admin')
                  }}
                >
                  <button className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium transition hover:bg-neutral-100">
                    {product.active ? 'Ocultar' : 'Publicar'}
                  </button>
                </form>
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium transition hover:bg-neutral-100"
                >
                  Editar
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}