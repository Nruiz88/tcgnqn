'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { generateShippingLabel } from '@/lib/actions'
import type { Order } from '@/lib/types'
import { Icon, inputCls, labelCls, btnPrimary, btnSecondary } from '@/components/admin-ui'

const PROVINCES = [
  { code: 'B', name: 'Buenos Aires' },
  { code: 'C', name: 'CABA' },
  { code: 'K', name: 'Catamarca' },
  { code: 'H', name: 'Chaco' },
  { code: 'U', name: 'Chubut' },
  { code: 'X', name: 'Córdoba' },
  { code: 'W', name: 'Corrientes' },
  { code: 'E', name: 'Entre Ríos' },
  { code: 'P', name: 'Formosa' },
  { code: 'Y', name: 'Jujuy' },
  { code: 'L', name: 'La Pampa' },
  { code: 'F', name: 'La Rioja' },
  { code: 'M', name: 'Mendoza' },
  { code: 'N', name: 'Misiones' },
  { code: 'Q', name: 'Neuquén' },
  { code: 'R', name: 'Río Negro' },
  { code: 'A', name: 'Salta' },
  { code: 'J', name: 'San Juan' },
  { code: 'D', name: 'San Luis' },
  { code: 'Z', name: 'Santa Cruz' },
  { code: 'S', name: 'Santa Fe' },
  { code: 'G', name: 'Santiago del Estero' },
  { code: 'V', name: 'Tierra del Fuego' },
  { code: 'T', name: 'Tucumán' },
]

/** Intenta separar calle/número/piso/depto desde la dirección libre del pedido. */
function parseAddress(raw: string) {
  const s = raw.trim()
  const floor = s.match(/piso\s*(\d+)/i)?.[1] ?? ''
  const apartment =
    s.match(/(?:depto|dep\.?|dpto|apto\.?|departamento)\s*([a-z0-9-]+)/i)?.[1] ??
    ''
  const clean = s
    .replace(/piso\s*\d+/i, '')
    .replace(/(?:depto|dep\.?|dpto|apto\.?|departamento)\s*[a-z0-9-]+/i, '')
    .trim()
  const numberMatch = clean.match(/(\d{1,6})\s*$/)
  const streetNumber = numberMatch?.[1] ?? ''
  const street = numberMatch
    ? clean
        .slice(0, clean.lastIndexOf(numberMatch[1]))
        .replace(/[,\s]+$/, '')
    : clean.replace(/[,\s]+$/, '')
  return { street, streetNumber, floor, apartment }
}

const fieldCls = (className?: string) => `${inputCls} ${className ?? ''}`

export default function ShippingLabelForm({ order }: { order: Order }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{
    trackingId: string | null
    reference: string
    notifySent: boolean
    notifyLink: string | null
  } | null>(null)
  const [deliveryType, setDeliveryType] = useState<'D' | 'S'>('D')

  const parsed = parseAddress(order.shipping_address ?? '')
  const hasLabel = !!order.shipping_label_reference

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setResult(null)
    const res = await generateShippingLabel(order.id, new FormData(e.currentTarget))
    setSubmitting(false)
    if (res?.error) {
      setError(res.error)
      return
    }
    setResult({
      trackingId: res.trackingId ?? null,
      reference: res.reference ?? '',
      notifySent: res.notifySent ?? false,
      notifyLink: res.notifyLink ?? null,
    })
    router.refresh()
  }

  return (
    <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50/60 p-4 dark:bg-neutral-900/30">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
            <Icon name="package" className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-medium">
              {hasLabel ? 'Guía Correo Argentino generada' : 'Guía Correo Argentino'}
            </p>
            <p className="text-xs text-neutral-500">
              {hasLabel
                ? `Referencia: ${order.shipping_label_reference}`
                : 'Generá la guía para despachar este pedido'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={btnSecondary}
        >
          <Icon
            name={open ? 'chevronDown' : 'pencil'}
            className="h-3.5 w-3.5"
          />
          {hasLabel ? (open ? 'Cerrar' : 'Regenerar') : open ? 'Cerrar' : 'Generar guía'}
        </button>
      </div>

      {hasLabel && !open && (
        <p className="mt-3 text-xs text-neutral-600">
          {order.shipping_tracking_id
            ? `Tracking: ${order.shipping_tracking_id}`
            : 'El número de pieza se ve en el panel de MiCorreo.'}{' '}
          <a
            href="https://www.correoargentino.com.ar/formularios/seguimiento"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-indigo-500 hover:text-indigo-400"
          >
            Seguimiento del envío →
          </a>
        </p>
      )}

      {open && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Destinatario</label>
              <input
                name="name"
                defaultValue={order.shipping_name ?? ''}
                required
                className={fieldCls()}
              />
            </div>
            <div>
              <label className={labelCls}>Teléfono</label>
              <input
                name="phone"
                defaultValue={order.shipping_phone ?? ''}
                className={fieldCls()}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>
                Email del destinatario
                <span className="ml-1 text-neutral-400">
                  (si lo dejás vacío usamos el de la cuenta del cliente)
                </span>
              </label>
              <input name="email" type="email" className={fieldCls()} />
            </div>
          </div>

          <div>
            <span className={labelCls}>Tipo de entrega</span>
            <div className="mt-1.5 flex gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="delivery_type"
                  value="D"
                  checked={deliveryType === 'D'}
                  onChange={() => setDeliveryType('D')}
                />
                A domicilio
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="delivery_type"
                  value="S"
                  checked={deliveryType === 'S'}
                  onChange={() => setDeliveryType('S')}
                />
                A sucursal
              </label>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className={labelCls}>Calle</label>
              <input
                name="street"
                defaultValue={parsed.street}
                required={deliveryType === 'D'}
                className={fieldCls()}
              />
            </div>
            <div>
              <label className={labelCls}>Número</label>
              <input
                name="street_number"
                defaultValue={parsed.streetNumber}
                className={fieldCls()}
              />
            </div>
            <div>
              <label className={labelCls}>Piso</label>
              <input name="floor" defaultValue={parsed.floor} className={fieldCls()} />
            </div>
            <div>
              <label className={labelCls}>Departamento</label>
              <input
                name="apartment"
                defaultValue={parsed.apartment}
                className={fieldCls()}
              />
            </div>
            <div>
              <label className={labelCls}>Ciudad</label>
              <input name="city" className={fieldCls()} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelCls}>Provincia</label>
              <select name="province" className={fieldCls()}>
                <option value="">Seleccioná…</option>
                {PROVINCES.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Código postal</label>
              <input
                name="postal_code"
                defaultValue={order.shipping_cp ?? ''}
                required
                className={fieldCls()}
              />
            </div>
            <div>
              <label className={labelCls}>Peso (kg)</label>
              <input
                name="weight_kg"
                type="number"
                inputMode="decimal"
                step="0.1"
                min="0.1"
                defaultValue="0.5"
                className={fieldCls()}
              />
            </div>
            {deliveryType === 'S' && (
              <div className="sm:col-span-3">
                <label className={labelCls}>
                  Código de sucursal{' '}
                  <span className="text-neutral-400">
                    (buscá en micorreo.correoargentino.com.ar)
                  </span>
                </label>
                <input name="agency" required className={fieldCls()} />
              </div>
            )}
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-400">
              {error}
            </p>
          )}
          {result && (
            <div className="rounded-lg bg-green-50 px-3 py-2 text-xs text-green-700 dark:bg-green-950/40 dark:text-green-400">
              <p>
                Guía generada. Referencia: {result.reference || '—'}
                {result.trackingId
                  ? ` · Tracking: ${result.trackingId}`
                  : ''}
              </p>
              {result.notifySent ? (
                <p className="mt-1">
                  ✅ Aviso de envío enviado por WhatsApp al cliente
                </p>
              ) : result.notifyLink ? (
                <p className="mt-1">
                  <a
                    href={result.notifyLink}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-green-800 underline dark:text-green-300"
                  >
                    Enviar aviso por WhatsApp al cliente →
                  </a>
                </p>
              ) : null}
            </div>
          )}

          <div className="flex items-center gap-2">
            <button type="submit" disabled={submitting} className={btnPrimary}>
              <Icon name="package" className="h-4 w-4" />
              {submitting ? 'Generando…' : 'Generar guía'}
            </button>
            <span className="text-xs text-neutral-500">
              La guía queda registrada en MiCorreo; la referencia se guarda en el
              pedido.
            </span>
          </div>
        </form>
      )}
    </div>
  )
}
