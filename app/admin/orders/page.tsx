import { getAllOrders } from '@/lib/data'
import { formatPrice } from '@/lib/format'
import { updateOrderStatus } from '@/lib/actions'
import { revalidatePath } from 'next/cache'
import type { OrderStatus } from '@/lib/types'
import { isEnabled } from '@/lib/modules'
import { whatsappNumber } from '@/lib/whatsapp'

export const dynamic = 'force-dynamic'

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  shipped: 'Enviado',
  cancelled: 'Cancelado',
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default async function AdminOrdersPage() {
  const orders = await getAllOrders()
  const waEnabled = isEnabled('orders_notifications')
  const storeNumber = whatsappNumber()

  return (
    <div>
      <div>
        <h2 className="font-display text-xl font-bold tracking-tight">Pedidos</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Cambiá el estado para mantener a tus clientes al día
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {orders.length === 0 && (
          <p className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-sm text-neutral-500">
            No hay pedidos todavía.
          </p>
        )}
        {orders.map((order) => (
          <div
            key={order.id}
            className="overflow-hidden rounded-2xl border border-neutral-200 bg-surface"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-sm font-semibold text-neutral-600">
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
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[order.status]}`}
                >
                  {STATUS_LABELS[order.status]}
                </span>
                <span className="font-display text-lg font-bold tracking-tight">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>

            <div className="p-5">
              <ul className="space-y-1.5 text-sm text-neutral-600">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between gap-4">
                    <span>
                      {item.product?.name ?? 'Producto'} × {item.quantity}
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
                <p className="mt-1 text-xs text-green-700 dark:text-green-400">
                  Descuento aplicado: −{formatPrice(order.discount)}
                </p>
              )}
              {order.notes && (
                <p className="mt-2 rounded-xl bg-neutral-50 px-3 py-2 text-xs text-neutral-600">
                  Notas: {order.notes}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-neutral-200 pt-4">
                <form
                  action={async (formData: FormData) => {
                    'use server'
                    const status = String(
                      formData.get('status'),
                    ) as OrderStatus
                    await updateOrderStatus(order.id, status)
                    revalidatePath('/admin/orders')
                  }}
                >
                  <label className="mr-2 text-xs font-medium text-neutral-500">
                    Estado
                  </label>
                  <select
                    name="status"
                    defaultValue={order.status}
                    onChange={(e) => e.target.closest('form')?.requestSubmit()}
                    className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm"
                  >
                    {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </form>
                {waEnabled && order.shipping_phone && storeNumber && (
                  <a
                    href={`https://wa.me/${order.shipping_phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${order.shipping_name}! Tu pedido en TCG NQN está ${STATUS_LABELS[order.status].toLowerCase()}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-auto inline-block rounded-lg border border-green-300 px-3 py-1.5 text-sm font-medium text-green-700 transition hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950/40"
                  >
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