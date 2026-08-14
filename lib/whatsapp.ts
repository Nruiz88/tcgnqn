import type { CartItem } from '@/lib/types'

export function whatsappNumber(): string | null {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP
  if (!raw) return null
  const digits = raw.replace(/\D/g, '')
  return digits || null
}

export function buildWhatsappLink(message: string): string {
  const number = whatsappNumber()
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export function cartSummary(items: CartItem[]): string {
  const lines = items.map(
    (i) => `• ${i.product.name} x${i.quantity} (${i.quantity * i.product.price})`,
  )
  const total = items.reduce((a, i) => a + i.product.price * i.quantity, 0)
  return [lines.join('\n'), `Total: ${total}`].join('\n')
}
