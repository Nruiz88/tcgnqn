'use client'

import { useRouter } from 'next/navigation'
import { updateOrderStatus } from '@/lib/actions'
import type { OrderStatus } from '@/lib/types'
import { Icon } from '@/components/admin-ui'

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'confirmed', label: 'Confirmado' },
  { value: 'shipped', label: 'Enviado' },
  { value: 'cancelled', label: 'Cancelado' },
]

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string
  currentStatus: OrderStatus
}) {
  const router = useRouter()

  async function handleChange(status: OrderStatus) {
    const result = await updateOrderStatus(orderId, status)
    if (result?.error) {
      alert(result.error)
      return
    }
    router.refresh()
  }

  return (
    <>
      <label
        htmlFor={`order-status-${orderId}`}
        className="mr-2 text-xs font-medium text-neutral-500"
      >
        Estado
      </label>
      <span className="relative inline-block align-middle">
        <select
          id={`order-status-${orderId}`}
          defaultValue={currentStatus}
          onChange={(e) => handleChange(e.target.value as OrderStatus)}
          className="appearance-none rounded-lg border border-neutral-300 bg-transparent py-1.5 pl-3 pr-9 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <Icon
          name="chevronDown"
          className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
        />
      </span>
    </>
  )
}
