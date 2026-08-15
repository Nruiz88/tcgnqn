import Link from 'next/link'
import { getAllProducts, getAllOrders } from '@/lib/data'
import { formatPrice } from '@/lib/format'
import { toggleProduct } from '@/lib/actions'
import { revalidatePath } from 'next/cache'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/orders'
import { Icon, btnSecondary, type IconName } from '@/components/admin-ui'

export const dynamic = 'force-dynamic'

function stockBadge(stock: number) {
  if (stock <= 0)
    return {
      label: 'Agotado',
      cls: 'bg-red-500/10 text-red-600 ring-red-500/20 dark:text-red-400',
    }
  if (stock <= 3)
    return {
      label: `Últimas ${stock}`,
      cls: 'bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:text-amber-400',
    }
  return {
    label: 'Disponible',
    cls: 'bg-green-500/10 text-green-600 ring-green-500/20 dark:text-green-400',
  }
}

const badgeCls = (color: string) =>
  `inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${color}`

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

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 5)

  const stats: {
    label: string
    value: string | number
    sub: string
    icon: IconName
    tint: string
  }[] = [
    {
      label: 'Productos',
      value: products.length,
      sub: `${activeCount} publicados`,
      icon: 'package',
      tint: 'bg-indigo-500/10 text-indigo-400',
    },
    {
      label: 'Stock bajo',
      value: lowStock.length,
      sub: 'necesitan reposición',
      icon: 'alert',
      tint: 'bg-amber-500/10 text-amber-400',
    },
    {
      label: 'Pedidos pendientes',
      value: pending.length,
      sub: 'por confirmar',
      icon: 'shoppingBag',
      tint: 'bg-blue-500/10 text-blue-400',
    },
    {
      label: 'Ingresos',
      value: formatPrice(revenue),
      sub: 'confirmados + enviados',
      icon: 'dollar',
      tint: 'bg-green-500/10 text-green-400',
    },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-200">
            Panel de control
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            ¡Hola de nuevo! 👋
          </h2>
          <p className="mt-1.5 max-w-xl text-sm text-indigo-100">
            Gestioná tu catálogo, stock y pedidos desde un solo lugar.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-700"
            >
              <Icon name="plus" className="h-4 w-4" />
              Nuevo producto
            </Link>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-700"
            >
              <Icon name="clock" className="h-4 w-4" />
              Pedidos pendientes ({pending.length})
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-neutral-200 bg-surface p-4 sm:p-5"
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.tint}`}
            >
              <Icon name={s.icon} className="h-5 w-5" />
            </span>
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-neutral-500">
              {s.label}
            </p>
            <p className="mt-1 truncate font-display text-2xl font-bold tracking-tight">
              {s.value}
            </p>
            <p className="mt-0.5 text-xs text-neutral-500">{s.sub}</p>
          </div>
        ))}
      </section>

      {/* Distribución en dos columnas */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Productos */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <h2 className="font-display text-lg font-bold tracking-tight">
                Productos
              </h2>
              <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-600 dark:bg-neutral-800/60 dark:text-neutral-400">
                {products.length}
              </span>
            </div>
            <Link
              href="/admin/products/new"
              className={btnSecondary}
            >
              <Icon name="plus" className="h-4 w-4" />
              Agregar
            </Link>
          </div>

          <div className="mt-4 rounded-2xl border border-neutral-200 bg-surface p-2">
            {products.length === 0 && (
              <div className="p-2">
                <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-neutral-300 px-6 py-12 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 dark:bg-neutral-800/60">
                    <Icon name="package" className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="font-medium">Todavía no hay productos</p>
                    <p className="mt-1 text-sm text-neutral-500">
                      Creá el primero para empezar a vender.
                    </p>
                  </div>
                  <Link
                    href="/admin/products/new"
                    className="mt-1 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                  >
                    <Icon name="plus" className="h-4 w-4" />
                    Crear producto
                  </Link>
                </div>
              </div>
            )}
            <div className="space-y-1">
              {products.map((product) => {
                const badge = stockBadge(product.stock)
                return (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 rounded-xl p-2.5 transition hover:bg-neutral-50 dark:hover:bg-neutral-800/40 sm:p-3"
                  >
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800/60">
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
                      <p className="mt-0.5 truncate text-xs text-neutral-500">
                        {formatPrice(product.price)} · Stock: {product.stock}
                        {product.game?.name &&
                          ` · ${product.game.emoji} ${product.game.name}`}
                        {product.category?.name && ` · ${product.category.name}`}
                      </p>
                    </div>
                    <div className="hidden items-center gap-2 sm:flex">
                      <span className={badgeCls(badge.cls)}>{badge.label}</span>
                      {!product.active && (
                        <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600 ring-1 ring-inset ring-neutral-200 dark:bg-neutral-800/60 dark:text-neutral-400">
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
                        <button
                          title={
                            product.active ? 'Ocultar producto' : 'Publicar producto'
                          }
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
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Panel lateral */}
        <aside className="space-y-6">
          <section className="rounded-2xl border border-neutral-200 bg-surface p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                  <Icon name="shoppingBag" className="h-4 w-4" />
                </span>
                <h3 className="font-display text-sm font-bold tracking-tight">
                  Pedidos recientes
                </h3>
              </div>
              <Link
                href="/admin/orders"
                className="inline-flex items-center gap-1 text-xs font-medium text-indigo-500 transition hover:text-indigo-400"
              >
                Ver todos
                <Icon name="arrowLeft" className="h-3.5 w-3.5 rotate-180" />
              </Link>
            </div>

            <div className="mt-3 space-y-1">
              {recentOrders.length === 0 && (
                <p className="rounded-xl border border-dashed border-neutral-300 p-6 text-center text-xs text-neutral-500">
                  No hay pedidos todavía.
                </p>
              )}
              {recentOrders.map((o) => (
                <Link
                  key={o.id}
                  href="/admin/orders"
                  className="flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-xs font-bold text-indigo-400">
                    {o.shipping_name.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {o.shipping_name}
                    </span>
                    <span className="block text-xs text-neutral-500">
                      {new Date(o.created_at).toLocaleDateString('es-AR')}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block text-sm font-semibold">
                      {formatPrice(o.total)}
                    </span>
                    <span
                      className={`mt-0.5 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${ORDER_STATUS_COLORS[o.status]}`}
                    >
                      {ORDER_STATUS_LABELS[o.status]}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-surface p-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                <Icon name="alert" className="h-4 w-4" />
              </span>
              <h3 className="font-display text-sm font-bold tracking-tight">
                Stock bajo
              </h3>
            </div>

            <div className="mt-3 space-y-1">
              {lowStock.length === 0 && (
                <p className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 p-6 text-center text-xs text-neutral-500">
                  <Icon
                    name="check"
                    className="h-4 w-4 text-green-500"
                  />
                  Todo el stock está en orden
                </p>
              )}
              {lowStock.slice(0, 6).map((p) => {
                const badge = stockBadge(p.stock)
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-3 rounded-xl p-2.5"
                  >
                    <span className="min-w-0 truncate text-sm font-medium">
                      {p.name}
                    </span>
                    <span className={badgeCls(badge.cls)}>{badge.label}</span>
                  </div>
                )
              })}
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
