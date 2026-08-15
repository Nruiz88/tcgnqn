import { getAllOrders } from '@/lib/data'
import { formatPrice } from '@/lib/format'
import { isEnabled } from '@/lib/modules'
import { whatsappNumber } from '@/lib/whatsapp'
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  paymentMethodLabel,
} from '@/lib/orders'
import { Icon, PageHeader, EmptyState } from '@/components/admin-ui'
import OrderStatusSelect from '@/components/order-status-select'

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
  const orders = await getAllOrders()
  const waEnabled = isEnabled('orders_notifications')
  const storeNumber = whatsappNumber()

  const pendingCount = orders.filter((o) => o.status === 'pending').length
  const revenue = orders
    .filter((o) => o.status === 'confirmed' || o.status === 'shipped')
    .reduce((acc, o) => acc + o.total, 0)

  const summary = [
    {
      label: 'Pedidos totales',
      value: orders.length,
      icon: 'shoppingBag',
      tint: 'bg-indigo-500/10 text-indigo-400',
    },
    {
      label: 'Pendientes',
      value: pendingCount,
      icon: 'clock',
      tint: 'bg-amber-500/10 text-amber-400',
    },
    {
      label: 'Ingresos (conf. + enviados)',
      value: formatPrice(revenue),
      icon: 'dollar',
      tint: 'bg-green-500/10 text-green-400',
    },
  ] as const

  return (
    <div>
      <PageHeader
        icon="shoppingBag"
        title="Pedidos"
        description="Cambiá el estado para mantener a tus clientes al día"
      />

      {/* Resumen */}
      <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
        {summary.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-neutral-200 bg-surface p-4"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              {s.label}
            </p>
            <p className="mt-1.5 flex items-center gap-2 font-display text-xl font-bold tracking-tight sm:text-2xl">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-md ${s.tint}`}
              >
                <Icon name={s.icon} className="h-3.5 w-3.5" />
              </span>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {orders.length === 0 && (
          <EmptyState
            icon="inbox"
            title="No hay pedidos todavía"
            description="Cuando un cliente complete la compra, el pedido va a aparecer acá."
          />
        )}
        {orders.map((order) => (
          <div
            key={order.id}
            className="overflow-hidden rounded-2xl border border-neutral-200 bg-surface"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 bg-neutral-50/60 p-5 dark:bg-neutral-900/40">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-sm shadow-indigo-500/25">
                  {order.shipping_name.slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">
                    {order.shipping_name} · {order.shipping_phone}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {new Date(order.created_at).toLocaleString('es-AR')} ·{' '}
                    {order.shipping_address}
                    {order.shipping_cp && ` (CP ${order.shipping_cp})`}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${ORDER_STATUS_COLORS[order.status]}`}
                >
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
                {order.payment_method && order.payment_method !== 'manual' && (
                  <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600 ring-1 ring-inset ring-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:ring-neutral-700">
                    Pago: {paymentMethodLabel(order.payment_method)}
                  </span>
                )}
                <span className="font-display text-lg font-bold tracking-tight">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>

            <div className="p-5">
              <ul className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {order.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-4 py-2 text-sm text-neutral-600 first:pt-0 last:pb-0"
                  >
                    <span className="min-w-0 truncate">
                      {item.product?.name ?? 'Producto'}
                      <span className="ml-1.5 text-xs text-neutral-500">
                        × {item.quantity}
                      </span>
                    </span>
                    <span className="shrink-0 font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              {order.shipping_label && (
                <p className="mt-3 text-xs text-neutral-500">
                  Envío: {order.shipping_label}
                  {order.shipping_price > 0 &&
                    ` · ${formatPrice(order.shipping_price)}`}
                </p>
              )}
              {order.discount > 0 && (
                <p className="mt-1 text-xs font-medium text-green-600 dark:text-green-400">
                  Descuento aplicado: −{formatPrice(order.discount)}
                </p>
              )}
              {order.notes && (
                <p className="mt-2 rounded-xl bg-neutral-50 px-3 py-2 text-xs text-neutral-600 dark:bg-neutral-800/50">
                  Notas: {order.notes}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-neutral-200 pt-4">
                <OrderStatusSelect
                  orderId={order.id}
                  currentStatus={order.status}
                />
                {waEnabled && order.shipping_phone && storeNumber && (
                  <a
                    href={`https://wa.me/${order.shipping_phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${order.shipping_name}! Tu pedido en TCG NQN está ${ORDER_STATUS_LABELS[order.status].toLowerCase()}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-auto inline-flex items-center gap-2 rounded-lg border border-green-300 px-3 py-1.5 text-sm font-medium text-green-600 transition hover:bg-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/60 dark:text-green-400 dark:hover:bg-green-950/40"
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z" />
                    </svg>
                    WhatsApp al cliente
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
