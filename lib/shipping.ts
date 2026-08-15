import { isEnabled } from '@/lib/modules'

// ---------------------------------------------------------------------------
// Tipos públicos
// ---------------------------------------------------------------------------

export type DeliveryType = 'D' | 'S' // D = domicilio, S = sucursal

export type ShippingQuote = {
  service: string // id de servicio, ej. 'correo_argentino_d'
  label: string
  price: number
  estimatedDays: string
  deliveredType: DeliveryType
}

export type ShippingPackage = {
  weightKg: number
  lengthCm?: number
  widthCm?: number
  heightCm?: number
  declaredValue?: number // ARS, opcional
}

export type ShippingDestination = {
  postalCode: string
  street?: string
  streetNumber?: string
  floor?: string
  apartment?: string
  city?: string
  provinceCode?: string
}

export type ShippingLabelOrder = {
  orderId: string // extOrderId, único (idempotencia)
  orderNumber?: string
  recipient: {
    name: string
    email: string
    phone?: string
    cellPhone?: string
  }
  destination: ShippingDestination
  pkg: ShippingPackage
  deliveredType: DeliveryType
  agency?: string // código de sucursal, obligatorio si deliveredType === 'S'
}

export type ShippingLabel = {
  trackingId: string | null
  reference: string
  createdAt: string
}

export interface ShippingGateway {
  id: string
  label: string
  description: string
  enabled: boolean
  quote(
    destination: ShippingDestination,
    pkg: ShippingPackage,
  ): Promise<ShippingQuote[]>
  createLabel(order: ShippingLabelOrder): Promise<ShippingLabel>
  track(trackingId: string): Promise<string | null>
}

// ---------------------------------------------------------------------------
// Cliente API MiCorreo (server-only)
// ---------------------------------------------------------------------------

const API_URL =
  process.env.CORREO_ARGENTINO_API_URL ??
  'https://api.correoargentino.com.ar/micorreo/v1'

const USER_TOKEN = process.env.CORREO_ARGENTINO_USER_TOKEN
const PASSWORD_TOKEN = process.env.CORREO_ARGENTINO_PASSWORD_TOKEN
const ACCOUNT_EMAIL = process.env.CORREO_ARGENTINO_EMAIL
const ACCOUNT_PASSWORD = process.env.CORREO_ARGENTINO_PASSWORD
const CUSTOMER_ID = process.env.CORREO_ARGENTINO_CUSTOMER_ID
const SENDER_CP = process.env.CORREO_ARGENTINO_SENDER_CP

// Dimensiones por defecto del paquete (cm) si el pedido no las especifica.
const PKG_DIMS = (process.env.CORREO_ARGENTINO_PKG_DIMS ?? '30,20,10')
  .split(',')
  .map((n) => Number(n.trim()))

type ApiError = { code?: string | number; message?: string }

let tokenCache: { token: string; expiresAt: number } | null = null
let customerIdCache: string | null = null

async function fetchToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) return tokenCache.token
  if (!USER_TOKEN || !PASSWORD_TOKEN) {
    throw new Error(
      'correo_argentino: faltan CORREO_ARGENTINO_USER_TOKEN y CORREO_ARGENTINO_PASSWORD_TOKEN',
    )
  }
  const basic = Buffer.from(`${USER_TOKEN}:${PASSWORD_TOKEN}`).toString('base64')
  const res = await fetch(`${API_URL}/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${basic}` },
  })
  const data = (await res.json().catch(() => null)) as {
    token?: string
    expires?: string
  } | null
  if (!res.ok || !data?.token) {
    const err = data as ApiError | null
    throw new Error(
      `correo_argentino: error obteniendo token (${res.status}) ${err?.message ?? ''}`.trim(),
    )
  }
  // El JWT expira; lo cacheamos por 50 minutos para no pedirlo en cada cotización.
  tokenCache = { token: data.token, expiresAt: Date.now() + 50 * 60 * 1000 }
  return data.token
}

async function fetchCustomerId(token: string): Promise<string> {
  if (CUSTOMER_ID) return CUSTOMER_ID
  if (customerIdCache) return customerIdCache
  if (!ACCOUNT_EMAIL || !ACCOUNT_PASSWORD) {
    throw new Error(
      'correo_argentino: faltan CORREO_ARGENTINO_EMAIL/PASSWORD o CORREO_ARGENTINO_CUSTOMER_ID',
    )
  }
  const res = await fetch(`${API_URL}/users/validate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: ACCOUNT_EMAIL, password: ACCOUNT_PASSWORD }),
  })
  const data = (await res.json().catch(() => null)) as {
    customerId?: string
    message?: string
  } | null
  if (!res.ok || !data?.customerId) {
    throw new Error(
      `correo_argentino: usuario inválido (${res.status}) ${data?.message ?? ''}`.trim(),
    )
  }
  customerIdCache = data.customerId
  return data.customerId
}

async function apiFetch<T>(
  path: string,
  body: unknown,
): Promise<T> {
  const token = await fetchToken()
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  const data = (await res.json().catch(() => null)) as (T & ApiError) | null
  if (!res.ok) {
    throw new Error(
      `correo_argentino ${path}: (${res.status}) ${data?.message ?? ''}`.trim(),
    )
  }
  return data as T
}

type Rate = {
  deliveredType: 'D' | 'S'
  productType: string
  productName: string
  price: number
  deliveryTimeMin?: string
  deliveryTimeMax?: string
}

type RatesResponse = {
  rates: Rate[]
  validTo?: string
}

type ShippingImportResponse = {
  createdAt: string
}

function pkgDims(pkg: ShippingPackage) {
  return {
    weight: Math.max(1, Math.round(pkg.weightKg * 1000)), // gramos (1–25000)
    length: Math.max(1, pkg.lengthCm ?? PKG_DIMS[0] ?? 30),
    width: Math.max(1, pkg.widthCm ?? PKG_DIMS[1] ?? 20),
    height: Math.max(1, pkg.heightCm ?? PKG_DIMS[2] ?? 10),
  }
}

// ---------------------------------------------------------------------------
// Gateway Correo Argentino (Paq.AR / MiCorreo)
// ---------------------------------------------------------------------------

class CorreoArgentinoGateway implements ShippingGateway {
  id = 'correo_argentino'
  label = 'Correo Argentino'
  description = 'Envío por Paq.AR a domicilio o sucursal'
  enabled =
    isEnabled('shipping.correo_argentino') &&
    Boolean(USER_TOKEN && PASSWORD_TOKEN && SENDER_CP)

  async quote(
    destination: ShippingDestination,
    pkg: ShippingPackage,
  ): Promise<ShippingQuote[]> {
    if (!SENDER_CP) return []
    if (!destination.postalCode) return []
    const token = await fetchToken()
    const customerId = await fetchCustomerId(token)
    // Sin deliveredType: MiCorreo devuelve domicilio (D) y sucursal (S) en un solo request.
    const data = await apiFetch<RatesResponse>('/rates', {
      customerId,
      postalCodeOrigin: SENDER_CP,
      postalCodeDestination: destination.postalCode,
      dimensions: pkgDims(pkg),
    })
    return (data.rates ?? []).map((r) => ({
      service: `correo_argentino_${r.deliveredType.toLowerCase()}`,
      label: `${this.label} — ${r.productName ?? 'Paq.AR'} (${
        r.deliveredType === 'D' ? 'domicilio' : 'sucursal'
      })`,
      price: r.price,
      estimatedDays: formatDays(r.deliveryTimeMin, r.deliveryTimeMax),
      deliveredType: r.deliveredType,
    }))
  }

  async createLabel(order: ShippingLabelOrder): Promise<ShippingLabel> {
    const token = await fetchToken()
    const customerId = await fetchCustomerId(token)
    const dims = pkgDims(order.pkg)
    const shipping: Record<string, unknown> = {
      deliveryType: order.deliveredType,
      agency: order.deliveredType === 'S' ? (order.agency ?? null) : null,
      address:
        order.deliveredType === 'D'
          ? {
              streetName: order.destination.street,
              streetNumber: order.destination.streetNumber,
              floor: order.destination.floor ?? '',
              apartment: order.destination.apartment ?? '',
              city: order.destination.city,
              provinceCode: order.destination.provinceCode,
              postalCode: order.destination.postalCode,
            }
          : null,
      weight: dims.weight,
      declaredValue: order.pkg.declaredValue ?? 1,
      height: dims.height,
      length: dims.length,
      width: dims.width,
    }
    const data = await apiFetch<ShippingImportResponse>('/shipping/import', {
      customerId,
      extOrderId: order.orderId,
      orderNumber: order.orderNumber ?? order.orderId,
      recipient: {
        name: order.recipient.name,
        email: order.recipient.email,
        phone: order.recipient.phone ?? '',
        cellPhone: order.recipient.cellPhone ?? order.recipient.phone ?? '',
      },
      shipping,
    })
    return {
      trackingId: null, // MiCorreo no devuelve el nº de pieza; se ve en el panel/oblea.
      reference: order.orderId,
      createdAt: data.createdAt ?? new Date().toISOString(),
    }
  }

  async track(trackingId: string): Promise<string | null> {
    if (!trackingId) return null
    // El tracking oficial de Correo Argentino exige captcha (no hay API pública
    // estable). Devolvemos la URL del seguimiento para que el cliente consulte.
    return `https://www.correoargentino.com.ar/formularios/seguimiento`
  }
}

function formatDays(min?: string, max?: string): string {
  if (min && max) return `${min}–${max} días hábiles`
  if (min) return `${min} días hábiles`
  return 'A consultar'
}

// ---------------------------------------------------------------------------
// Gateway retiro en local (fallback cuando no hay credenciales)
// ---------------------------------------------------------------------------

const PICKUP_LOCATION = process.env.NEXT_PUBLIC_PICKUP_LOCATION

class PickupGateway implements ShippingGateway {
  id = 'pickup'
  label = 'Retiro en el local'
  description = PICKUP_LOCATION
    ? `Retirá tu pedido en ${PICKUP_LOCATION}`
    : 'Retirá tu pedido en el local, sin costo de envío'
  enabled = true

  async quote(): Promise<ShippingQuote[]> {
    return [
      {
        service: 'pickup',
        label: this.label,
        price: 0,
        estimatedDays: 'Coordinamos el día por WhatsApp',
        deliveredType: 'S',
      },
    ]
  }

  async createLabel(order: ShippingLabelOrder): Promise<ShippingLabel> {
    return {
      trackingId: null,
      reference: order.orderId,
      createdAt: new Date().toISOString(),
    }
  }

  async track(): Promise<string | null> {
    return null
  }
}

// ---------------------------------------------------------------------------
// Registro y helpers
// ---------------------------------------------------------------------------

export const shippingGateways: ShippingGateway[] = [
  new PickupGateway(), // siempre disponible (fallback)
  new CorreoArgentinoGateway(),
]

export function getShippingGateways(): ShippingGateway[] {
  return shippingGateways.filter((g) => g.enabled)
}

export async function quoteShipping(
  destination: ShippingDestination,
  pkg: ShippingPackage,
): Promise<ShippingQuote[]> {
  const quotes: ShippingQuote[] = []
  for (const gateway of getShippingGateways()) {
    try {
      quotes.push(...(await gateway.quote(destination, pkg)))
    } catch (err) {
      // Si la API falla, seguimos con el resto de gateways (pickup siempre cubre).
      console.error(`[shipping] ${gateway.id}:`, err)
    }
  }
  return quotes
}

export function getTrackingUrl(trackingId: string): string | null {
  return trackingId
    ? 'https://www.correoargentino.com.ar/formularios/seguimiento'
    : null
}
