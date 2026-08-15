import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getMyOrders, getWishlist } from '@/lib/data'
import { formatPrice } from '@/lib/format'
import { signOut } from '@/lib/actions'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/orders'
import { whatsappNumber } from '@/lib/whatsapp'
import ProfileForm from '@/components/profile-form'
import PasswordForm from '@/components/password-form'

export const dynamic = 'force-dynamic'

const svgProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

function Icon({ name, className = 'h-4 w-4' }: { name: string; className?: string }) {
  const paths: Record<string, React.ReactNode> = {
    user: (
      <>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    lock: (
      <>
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>
    ),
    package: (
      <>
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
      </>
    ),
    heart: (
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </>
    ),
    truck: (
      <>
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
        <path d="M15 18H9" />
        <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
        <circle cx="17" cy="18" r="2" />
        <circle cx="7" cy="18" r="2" />
      </>
    ),
    message: <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />,
    mail: (
      <>
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </>
    ),
    chevron: <path d="m6 9 6 6 6-6" />,
  }
  return (
    <svg {...svgProps} className={className} aria-hidden>
      {paths[name]}
    </svg>
  )
}

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? '')
      .join('') || 'U'
  )
}

export default async function AccountPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profile, orders, wishlist] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    getMyOrders(),
    getWishlist(),
  ])

  const fullName = profile.data?.full_name ?? ''
  const phone = profile.data?.phone ?? ''
  const isAdmin = profile.data?.role === 'admin'
  const memberSince = profile.data?.created_at
    ? new Date(profile.data.created_at).toLocaleDateString('es-AR', {
        month: 'long',
        year: 'numeric',
      })
    : null

  const inProgress = orders.filter(
    (o) => o.status === 'pending' || o.status === 'confirmed',
  ).length
  const waNumber = whatsappNumber()

  const stats = [
    { label: 'Pedidos', value: orders.length, icon: 'package', href: '#pedidos' },
    { label: 'En curso', value: inProgress, icon: 'clock', href: '#pedidos' },
    { label: 'Favoritos', value: wishlist.length, icon: 'heart', href: '/favoritos' },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 font-display text-2xl font-bold text-white shadow-sm shadow-indigo-500/30">
            {initials(fullName || user.email)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl font-bold tracking-tight">
                {fullName || 'Mi cuenta'}
              </h1>
              {isAdmin && (
                <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-500 ring-1 ring-inset ring-indigo-500/20">
                  Admin
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-neutral-500">
              {user.email}
              {memberSince && ` · Miembro desde ${memberSince}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-md border border-indigo-300 px-4 py-2 text-sm font-semibold text-indigo-500 transition hover:bg-indigo-500/10"
            >
              <Icon name="lock" className="h-4 w-4" />
              Panel admin
            </Link>
          )}
          <form action={signOut}>
            <button className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-500 transition hover:border-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200">
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>

      {/* Métricas */}
      <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl border border-neutral-200 bg-surface p-4 transition hover:border-neutral-300 sm:p-5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <Icon name={s.icon} className="h-5 w-5" />
            </span>
            <p className="mt-3 font-display text-2xl font-bold tracking-tight">
              {s.value}
            </p>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              {s.label}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Pedidos */}
        <section id="pedidos" className="lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <h2 className="font-display text-lg font-bold tracking-tight">
              Mis pedidos
            </h2>
            <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-600 dark:bg-neutral-800/60 dark:text-neutral-400">
              {orders.length}
            </span>
          </div>

          <div className="mt-4 space-y-4">
            {orders.length === 0 && (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-neutral-300 px-6 py-14 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 dark:bg-neutral-800/60">
                  <Icon name="package" className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-medium">Todavía no hiciste ningún pedido</p>
                  <p className="mt-1 text-sm text-neutral-500">
                    Explorá el catálogo y hacé tu primera compra.
                  </p>
                </div>
                <Link
                  href="/"
                  className="mt-1 inline-flex items-center gap-2 rounded-md bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#24272c]"
                >
                  Ir a la tienda
                </Link>
              </div>
            )}

            {orders.map((order) => {
              const itemsCount = order.items.reduce(
                (acc, i) => acc + i.quantity,
                0,
              )
              return (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="block overflow-hidden rounded-2xl border border-neutral-200 bg-surface transition hover:border-neutral-300"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 p-4 sm:p-5">
                    <div>
                      <p className="font-medium">
                        Pedido #{order.id.slice(0, 8)}
                      </p>
                      <p className="mt-0.5 text-xs text-neutral-500">
                        {new Date(order.created_at).toLocaleDateString(
                          'es-AR',
                          {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          },
                        )}{' '}
                        · {itemsCount}{' '}
                        {itemsCount === 1 ? 'producto' : 'productos'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${ORDER_STATUS_COLORS[order.status]}`}
                      >
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                      <span className="font-display text-lg font-bold tracking-tight">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>

                  <ul className="divide-y divide-neutral-100 px-4 dark:divide-neutral-800/60 sm:px-5">
                    {order.items.slice(0, 3).map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center gap-3 py-2.5"
                      >
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800/60">
                          {item.product?.image_url && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.product.image_url}
                              alt={item.product?.name ?? 'Producto'}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <span className="min-w-0 flex-1 truncate text-sm">
                          {item.product?.name ??
                            item.product_name ??
                            'Producto'}
                          <span className="ml-1.5 text-xs text-neutral-500">
                            × {item.quantity}
                          </span>
                        </span>
                        <span className="shrink-0 text-sm font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {order.items.length > 3 && (
                    <p className="px-4 pb-1 text-xs text-neutral-500 sm:px-5">
                      + {order.items.length - 3} ítems más
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 p-4 sm:px-5">
                    <p className="text-xs text-neutral-500">
                      {order.shipping_label ?? 'Retiro en el local'}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-indigo-500 transition hover:text-indigo-400">
                      Ver detalle
                      <Icon name="chevron" className="h-4 w-4 rotate-180" />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Panel lateral */}
        <aside className="space-y-6">
          <section className="rounded-2xl border border-neutral-200 bg-surface p-5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                <Icon name="user" className="h-4 w-4" />
              </span>
              <h2 className="font-display text-sm font-bold tracking-tight">
                Mi perfil
              </h2>
            </div>
            <div className="mt-4">
              <label className="text-xs font-medium text-neutral-500">
                Email
              </label>
              <p className="mt-1 flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50/50 px-3 py-2 text-sm text-neutral-500 dark:bg-neutral-800/40">
                <Icon name="mail" className="h-4 w-4 shrink-0" />
                {user.email}
              </p>
            </div>
            <div className="mt-4">
              <ProfileForm initial={{ fullName: fullName, phone: phone }} />
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-surface p-5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                <Icon name="lock" className="h-4 w-4" />
              </span>
              <h2 className="font-display text-sm font-bold tracking-tight">
                Seguridad
              </h2>
            </div>
            <div className="mt-4">
              <PasswordForm />
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-surface p-5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                <Icon name="truck" className="h-4 w-4" />
              </span>
              <h2 className="font-display text-sm font-bold tracking-tight">
                Ayuda
              </h2>
            </div>
            <ul className="mt-4 space-y-1 text-sm">
              <li>
                <Link
                  href="/favoritos"
                  className="flex items-center gap-2 rounded-lg px-2 py-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800/50"
                >
                  <Icon name="heart" className="h-4 w-4" />
                  Mis favoritos
                </Link>
              </li>
              <li>
                <Link
                  href="/envios"
                  className="flex items-center gap-2 rounded-lg px-2 py-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800/50"
                >
                  <Icon name="truck" className="h-4 w-4" />
                  Envíos y devoluciones
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="flex items-center gap-2 rounded-lg px-2 py-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800/50"
                >
                  <Icon name="message" className="h-4 w-4" />
                  Contacto
                </Link>
              </li>
              {waNumber && (
                <li>
                  <a
                    href={`https://wa.me/${waNumber}?text=${encodeURIComponent('¡Hola TCG NQN! Tengo una consulta.')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-lg px-2 py-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800/50"
                  >
                    <Icon name="message" className="h-4 w-4" />
                    WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  )
}
