'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { createOrder } from '@/lib/actions'
import { formatPrice } from '@/lib/format'
import { isEnabled } from '@/lib/modules'
import {
  getPaymentMethods,
  buildPaymentInstructions,
  buildWhatsappCheckoutLink,
} from '@/lib/payments'
import type { PaymentMethodId } from '@/lib/payments'

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const methods = getPaymentMethods()
  const [method, setMethod] = useState<PaymentMethodId>(methods[0]?.id ?? 'transferencia')

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">No hay nada para comprar</h1>
      </div>
    )
  }

  const instructions = buildPaymentInstructions(method)

  const handleSubmit = async (formData: FormData) => {
    if (method === 'whatsapp') {
      const link = buildWhatsappCheckoutLink(items, name, phone)
      if (link) {
        window.open(link, '_blank')
        return
      }
    }
    setSubmitting(true)
    setError(null)
    const result = await createOrder(formData)
    if (result?.error) {
      setError(result.error)
      setSubmitting(false)
      return
    }
    clearCart()
    router.push('/order-confirmed')
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <form action={handleSubmit} className="space-y-4 lg:col-span-2">
          <input type="hidden" name="items" value={JSON.stringify(items)} />
          <div>
            <label className="text-sm font-medium">Nombre completo</label>
            <input
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Teléfono / WhatsApp</label>
            <input
              name="phone"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Dirección de envío</label>
            <textarea
              name="address"
              required
              rows={3}
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Método de pago</label>
            <div className="mt-1 space-y-2">
              {methods.map((m) => (
                <label
                  key={m.id}
                  className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer ${
                    method === m.id
                      ? 'border-neutral-900 bg-neutral-50'
                      : 'border-neutral-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value={m.id}
                    checked={method === m.id}
                    onChange={() => setMethod(m.id)}
                    className="mt-1"
                  />
                  <span>
                    <span className="block text-sm font-medium">{m.label}</span>
                    <span className="block text-xs text-neutral-500">
                      {m.description}
                    </span>
                  </span>
                </label>
              ))}
            </div>
            {instructions && (
              <p className="mt-2 whitespace-pre-line rounded-md bg-neutral-50 px-3 py-2 text-xs text-neutral-600">
                {instructions}
              </p>
            )}
          </div>
          {isEnabled('coupons') && (
            <div>
              <label className="text-sm font-medium">
                Cupón de descuento (opcional)
              </label>
              <input
                name="coupon"
                placeholder="BIENVENIDA10"
                className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm uppercase"
              />
            </div>
          )}

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50"
          >
            {method === 'whatsapp'
              ? 'Enviar pedido por WhatsApp'
              : submitting
                ? 'Procesando...'
                : 'Confirmar pedido'}
          </button>
          <p className="text-xs text-neutral-500">
            {method === 'whatsapp'
              ? 'Se abre WhatsApp con el resumen de tu pedido para coordinarlo.'
              : 'El pago se coordina por WhatsApp o transferencia. Te contactaremos para confirmar.'}
          </p>
        </form>

        <div className="h-fit rounded-lg border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold">Resumen del pedido</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.product.id} className="flex justify-between">
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span className="font-medium">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4">
            <span className="font-semibold">Total</span>
            <span className="font-bold">{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
