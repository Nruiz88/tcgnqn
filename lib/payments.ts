import type { CartItem } from '@/lib/types'
import { isEnabled } from '@/lib/modules'
import { whatsappNumber, buildWhatsappLink, cartSummary } from '@/lib/whatsapp'

export type PaymentMethodId = 'transferencia' | 'whatsapp' | 'mercadopago'

export type PaymentMethod = {
  id: PaymentMethodId
  label: string
  description: string
  enabled: boolean
}

const TRANSFER_ALIAS = process.env.NEXT_PUBLIC_TRANSFER_ALIAS
const TRANSFER_INFO = process.env.NEXT_PUBLIC_TRANSFER_INFO

export function getPaymentMethods(): PaymentMethod[] {
  const methods: PaymentMethod[] = [
    {
      id: 'transferencia',
      label: 'Transferencia bancaria',
      description: TRANSFER_ALIAS
        ? `CVU/Alias: ${TRANSFER_ALIAS}`
        : 'Te enviamos los datos de la cuenta al confirmar',
      enabled: isEnabled('payments.transferencia'),
    },
    {
      id: 'whatsapp',
      label: 'Comprar por WhatsApp',
      description: 'Te contactamos y coordinamos el pago',
      enabled: isEnabled('payments.whatsapp') && !!whatsappNumber(),
    },
    {
      id: 'mercadopago',
      label: 'Mercado Pago',
      description: 'Pago online con tarjeta o saldo',
      enabled: isEnabled('payments.mercadopago'),
    },
  ]
  return methods.filter((m) => m.enabled)
}

export function buildPaymentInstructions(
  methodId: PaymentMethodId,
): string | null {
  if (methodId === 'transferencia' && TRANSFER_ALIAS) {
    return `Transferí el total a:\nAlias/CVU: ${TRANSFER_ALIAS}${
      TRANSFER_INFO ? `\n${TRANSFER_INFO}` : ''
    }\n\nDespués avisanos con el comprobante.`
  }
  return null
}

export function buildWhatsappCheckoutLink(
  items: CartItem[],
  customerName: string,
  customerPhone: string,
): string | null {
  const number = whatsappNumber()
  if (!number) return null
  const msg =
    `Hola! Quiero hacer este pedido:\n` +
    `\n${cartSummary(items)}\n` +
    `\nNombre: ${customerName}\nTel: ${customerPhone}`
  return buildWhatsappLink(msg)
}
