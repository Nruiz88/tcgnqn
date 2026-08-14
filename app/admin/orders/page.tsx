import { getAllOrders } from '@/lib/data'
import { formatPrice } from '@/lib/format'
import { updateOrderStatus } from '@/lib/actions'
import { revalidatePath } from 'next/cache'
import type { OrderStatus } from '@/lib/types'

export const dynamic = 'force-dynamic'

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  shipped: 'Enviado',
  cancelled: 'Cancelado',
}

export default async function AdminOrdersPage() {
  const orders = await getAllOrders()

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
                </p>
                {order.notes && (
                  <p className="mt-1 text-xs text-neutral-500">
                    Notas: {order.notes}
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
