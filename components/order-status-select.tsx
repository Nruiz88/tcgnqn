'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateOrderStatus } from '@/lib/actions'
import type { OrderStatus } from '@/lib/types'
import { ORDER_STATUS_LABELS } from '@/lib/orders'
import { Icon } from '@/components/admin-ui'

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string
  currentStatus: OrderStatus
}) {
  const router = useRouter()
  const [notifyLink, setNotifyLink] = useState<string | null>(null)

  async function handleChange(status: OrderStatus) {
    const result = await updateOrderStatus(orderId, status)
    if (result?.error) {
      alert(result.error)
      return
    }
    setNotifyLink(result?.notifyLink ?? null)
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
          {(Object.entries(ORDER_STATUS_LABELS) as [OrderStatus, string][]).map(
            ([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ),
          )}
        </select>
        <Icon
          name="chevronDown"
          className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
        />
      </span>
      {notifyLink && (
        <a
          href={notifyLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-green-700"
        >
          Enviar aviso de envío por WhatsApp
        </a>
      )}
    </>
  )
}
