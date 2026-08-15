import type { OrderStatus } from '@/lib/types'

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  shipped: 'Enviado',
  cancelled: 'Cancelado',
}

export const ORDER_STATUS_DESCRIPTIONS: Record<OrderStatus, string> = {
  pending:
    'Estamos revisando tu pedido. Te contactaremos por WhatsApp o teléfono para coordinar el pago y el envío.',
  confirmed:
    'Tu pedido fue confirmado. Ya estamos preparando tus productos.',
  shipped: 'Tu pedido está en camino. ¡Quedate atento a la entrega!',
  cancelled:
    'Tu pedido fue cancelado. Si tenés dudas, escribinos por WhatsApp.',
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:text-amber-400',
  confirmed: 'bg-blue-500/10 text-blue-600 ring-blue-500/20 dark:text-blue-400',
  shipped: 'bg-green-500/10 text-green-600 ring-green-500/20 dark:text-green-400',
  cancelled: 'bg-red-500/10 text-red-600 ring-red-500/20 dark:text-red-400',
}

export function paymentMethodLabel(
  method: string | null | undefined,
): string {
  switch (method) {
    case 'mercadopago':
      return 'Mercado Pago'
    case 'transferencia':
      return 'Transferencia'
    case 'whatsapp':
      return 'WhatsApp'
    default:
      return 'Manual'
  }
}
