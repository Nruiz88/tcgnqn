'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { createOrder, quoteShippingForCheckout } from '@/lib/actions'
import { formatPrice } from '@/lib/format'
import { isEnabled } from '@/lib/modules'
import {
  getPaymentMethods,
  buildPaymentInstructions,
  buildWhatsappCheckoutLink,
} from '@/lib/payments'
import type { PaymentMethodId } from '@/lib/payments'
import type { ShippingQuote } from '@/lib/shipping'

const PICKUP: ShippingQuote = {
  service: 'pickup',
  label: 'Retiro en el local',
  price: 0,
  estimatedDays: 'Coordinamos el día por WhatsApp',
  deliveredType: 'S',
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [quotes, setQuotes] = useState<ShippingQuote[]>([])
  const [shipping, setShipping] = useState<ShippingQuote>(PICKUP)
  const [quoting, setQuoting] = useState(false)
  const methods = getPaymentMethods()
  const [method, setMethod] = useState<PaymentMethodId>(methods[0]?.id ?? 'transferencia')

  const cartWeightKg = Math.max(
    0.5,
    items.reduce((acc, i) => acc + i.quantity * 0.2, 0),
  )

  const fetchQuotes = useCallback(
    async (cp: string) => {
      if (!cp || cp.replace(/\D/g, '').length < 4) {
        setQuotes([])
        setShipping(PICKUP)
        return
      }
      setQuoting(true)
      try {
        const result = await quoteShippingForCheckout(
          cp,
          cartWeightKg,
          total,
        )
        setQuotes(result)
        // Mantener el método elegido si sigue disponible; si no, el primero.
        setShipping((prev) => {
          if (prev && result.some((q) => q.service === prev.service)) {
            return prev
          }
          return result[0] ?? null
        })
      } catch {
        setQuotes([])
        setShipping(PICKUP)
      } finally {
        setQuoting(false)
      }
    },
    [cartWeightKg, total],
  )

  useEffect(() => {
    const t = setTimeout(() => fetchQuotes(postalCode), 400)
    return () => clearTimeout(t)
  }, [postalCode, fetchQuotes])

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">No hay nada para comprar</h1>
      </div>
    )
  }

  const instructions = buildPaymentInstructions(method)
  const shippingPrice = shipping?.price ?? 0
  const grandTotal = total + shippingPrice

  const handleSubmit = async (formData: FormData) => {
    // El método de envío viaja en el form; el server recotiza y valida.
    formData.set('shipping_method', shipping?.service ?? 'pickup')
    formData.set('shipping_cp', postalCode)
    if (method === 'whatsapp') {
      const link = buildWhatsappCheckoutLink(
        items,
        name,
        phone,
        shipping?.label ? `${shipping.label} (${formatPrice(shippingPrice)})` : undefined,
      )
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
            <label className="text-sm font-medium">
              Código postal <span className="text-neutral-400">(para envío)</span>
            </label>
            <input
              inputMode="numeric"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="Ej. 8300"
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Método de envío</label>
            {quoting && (
              <p className="mt-1 text-xs text-neutral-500">
                Cotizando envío...
              </p>
            )}
            {!quoting && quotes.length === 0 && (
              <p className="mt-1 text-xs text-neutral-500">
                Ingresá un código postal para ver las opciones de Correo
                Argentino.
              </p>
            )}
            <div className="mt-1 space-y-2">
              {(quotes.length === 0 ? [PICKUP] : quotes).map((q) => (
                <label
                  key={q.service}
                  className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer ${
                    shipping?.service === q.service
                      ? 'border-neutral-900 bg-neutral-50'
                      : 'border-neutral-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="shipping_service"
                    value={q.service}
                    checked={shipping?.service === q.service}
                    onChange={() => setShipping(q)}
                    className="mt-1"
                  />
                  <span className="flex-1">
                    <span className="block text-sm font-medium">{q.label}</span>
                    <span className="block text-xs text-neutral-500">
                      {q.estimatedDays}
                    </span>
                  </span>
                  <span className="text-sm font-semibold">
                    {q.price === 0 ? 'Gratis' : formatPrice(q.price)}
                  </span>
                </label>
              ))}
            </div>
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
          <div className="mt-4 space-y-2 border-t border-neutral-200 pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Envío</span>
              <span>
                {shipping
                  ? shipping.price === 0
                    ? 'Gratis'
                    : formatPrice(shippingPrice)
                  : '—'}
              </span>
            </div>
            <div className="flex justify-between border-t border-neutral-200 pt-2">
              <span className="font-semibold">Total</span>
              <span className="font-bold">{formatPrice(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
