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
      <h2 className="text-lg font-semibold">Pedidos</h2>
      <div className="mt-4 space-y-4">
        {orders.length === 0 && (
          <p className="text-sm text-neutral-500">No hay pedidos.</p>
        )}
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-lg border border-neutral-200 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium">
                  {order.shipping_name} · {order.shipping_phone}
                </p>
                <p className="text-xs text-neutral-500">
                  {new Date(order.created_at).toLocaleString('es-AR')} ·{' '}
                  {order.shipping_address}
                  {order.shipping_cp && ` (CP ${order.shipping_cp})`}
                </p>
                {order.shipping_label && (
                  <p className="mt-1 text-xs text-neutral-500">
                    Envío: {order.shipping_label}
                    {order.shipping_price > 0 &&
                      ` · ${formatPrice(order.shipping_price)}`}
                  </p>
                )}
                {order.notes && (
                  <p className="mt-1 text-xs text-neutral-500">
                    Notas: {order.notes}
                  </p>
                )}
                <span
                  className={`mt-2 inline-block rounded px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[order.status]}`}
                >
                  {STATUS_LABELS[order.status]}
                </span>
                {order.discount > 0 && (
                  <p className="mt-1 text-xs text-green-700">
                    Descuento aplicado: {formatPrice(order.discount)}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="font-bold">{formatPrice(order.total)}</p>
                <form
                  action={async (formData: FormData) => {
                    'use server'
                    const status = String(formData.get('status')) as OrderStatus
                    await updateOrderStatus(order.id, status)
                    revalidatePath('/admin/orders')
                  }}
                >
                  <select
                    name="status"
                    defaultValue={order.status}
                    onChange={(e) =>
                      e.target.closest('form')?.requestSubmit()
                    }
                    className="mt-1 rounded-md border border-neutral-300 px-2 py-1 text-xs"
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
                    className="mt-2 inline-block rounded-md border border-green-300 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50"
                  >
                    WhatsApp al cliente
                  </a>
                )}
              </div>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-neutral-600">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>
                    {item.product?.name ?? 'Producto'} × {item.quantity}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
