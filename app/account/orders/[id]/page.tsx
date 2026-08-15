import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getMyOrder } from '@/lib/data'
import { formatPrice } from '@/lib/format'
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_DESCRIPTIONS,
  ORDER_STATUS_COLORS,
  paymentMethodLabel,
} from '@/lib/orders'
import { whatsappNumber } from '@/lib/whatsapp'

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
    arrowLeft: (
      <>
        <path d="m12 19-7-7 7-7" />
        <path d="M19 12H5" />
      </>
    ),
    package: (
      <>
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
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
    pin: (
      <>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
    phone: (
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
    ),
    message: <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />,
    tag: (
      <>
        <path d="M12.6 2.6A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .6 1.4l8 8a2 2 0 0 0 2.8 0l7-7a2 2 0 0 0 0-2.8Z" />
        <circle cx="7" cy="7" r="1" fill="currentColor" stroke="none" />
      </>
    ),
  }
  return (
    <svg {...svgProps} className={className} aria-hidden>
      {paths[name]}
    </svg>
  )
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = await getMyOrder(id)
  if (!order) notFound()

  const subtotal = order.items.reduce(
    (acc, i) => acc + i.price * i.quantity,
    0,
  )
  const waNumber = whatsappNumber()
  const itemsCount = order.items.reduce((acc, i) => acc + i.quantity, 0)

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
      <Link
        href="/account"
        className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition hover:text-neutral-900 dark:hover:text-neutral-200"
      >
        <Icon name="arrowLeft" className="h-4 w-4" />
        Volver a mi cuenta
      </Link>

      {/* Encabezado */}
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
            Pedido #{order.id.slice(0, 8)}
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {ORDER_STATUS_LABELS[order.status]}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Realizado el{' '}
            {new Date(order.created_at).toLocaleString('es-AR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}{' '}
            · {itemsCount} {itemsCount === 1 ? 'producto' : 'productos'}
          </p>
        </div>
        <span className="font-display text-3xl font-bold tracking-tight">
          {formatPrice(order.total)}
        </span>
      </div>

      {/* Estado */}
      <div
        className={`mt-6 rounded-2xl px-5 py-4 text-sm ring-1 ring-inset ${ORDER_STATUS_COLORS[order.status]}`}
      >
        <span className="font-semibold">
          {ORDER_STATUS_LABELS[order.status]}
        </span>
        <p className="mt-1 text-xs opacity-90">
          {ORDER_STATUS_DESCRIPTIONS[order.status]}
        </p>
      </div>

      {/* Productos */}
      <section className="mt-8">
        <h2 className="font-display text-lg font-bold tracking-tight">
          Productos
        </h2>
        <ul className="mt-4 divide-y divide-neutral-100 rounded-2xl border border-neutral-200 bg-surface px-4 dark:divide-neutral-800/60 sm:px-5">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 py-4">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
                {item.product?.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.product.image_url}
                    alt={item.product?.name ?? 'Producto'}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">
                  {item.product?.name ?? item.product_name ?? 'Producto'}
                </p>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {formatPrice(item.price)} × {item.quantity}
                </p>
              </div>
              <span className="shrink-0 font-semibold">
                {formatPrice(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Resumen */}
      <section className="mt-6">
        <h2 className="font-display text-lg font-bold tracking-tight">
          Resumen
        </h2>
        <dl className="mt-4 space-y-2.5 rounded-2xl border border-neutral-200 bg-surface p-5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-neutral-500">Subtotal</dt>
            <dd className="font-medium">{formatPrice(subtotal)}</dd>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between gap-4 text-green-600 dark:text-green-400">
              <dt>Descuento</dt>
              <dd className="font-medium">−{formatPrice(order.discount)}</dd>
            </div>
          )}
          <div className="flex justify-between gap-4">
            <dt className="text-neutral-500">Envío</dt>
            <dd className="font-medium">
              {order.shipping_price > 0
                ? formatPrice(order.shipping_price)
                : 'Gratis'}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-neutral-500">Método de pago</dt>
            <dd className="font-medium">
              {paymentMethodLabel(order.payment_method)}
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-neutral-200 pt-3 dark:border-neutral-800/60">
            <dt className="font-semibold">Total</dt>
            <dd className="font-display text-lg font-bold tracking-tight">
              {formatPrice(order.total)}
            </dd>
          </div>
        </dl>
      </section>

      {/* Envío */}
      <section className="mt-6">
        <h2 className="font-display text-lg font-bold tracking-tight">
          Datos de entrega
        </h2>
        <dl className="mt-4 space-y-3 rounded-2xl border border-neutral-200 bg-surface p-5 text-sm">
          <div className="flex items-start gap-3">
            <Icon name="truck" className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
            <div>
              <dt className="font-medium">
                {order.shipping_label ?? 'Retiro en el local'}
              </dt>
              <dd className="mt-0.5 text-neutral-500">
                {order.shipping_price > 0
                  ? formatPrice(order.shipping_price)
                  : 'Sin cargo'}
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
            <div>
              <dt className="font-medium">{order.shipping_name}</dt>
              <dd className="mt-0.5 text-neutral-500">
                {order.shipping_address}
                {order.shipping_cp && ` (CP ${order.shipping_cp})`}
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
            <dd className="text-neutral-500">{order.shipping_phone}</dd>
          </div>
          {order.notes && (
            <div className="flex items-start gap-3">
              <Icon name="tag" className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
              <dd className="text-neutral-500">Nota: {order.notes}</dd>
            </div>
          )}
        </dl>
      </section>

      {/* Ayuda */}
      {waNumber && (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-neutral-300 px-6 py-8 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">
            <Icon name="message" className="h-6 w-6" />
          </span>
          <div>
            <p className="font-medium">¿Tenés dudas con este pedido?</p>
            <p className="mt-1 text-sm text-neutral-500">
              Escribinos por WhatsApp y te ayudamos a resolverlo.
            </p>
          </div>
          <a
            href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
              `¡Hola TCG NQN! Tengo una consulta sobre mi pedido #${order.id.slice(0, 8)}.`,
            )}`}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-flex items-center gap-2 rounded-md bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            <Icon name="message" className="h-4 w-4" />
            Consultar por WhatsApp
          </a>
        </div>
      )}
    </div>
  )
}
