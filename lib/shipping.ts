import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ShippingSettings } from '@/lib/types'

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
// Credenciales de MiCorreo (panel admin → tabla shipping_settings, con
// fallback a .env.local). Se cachean 60s; el admin panel las invalida al guardar.
// ---------------------------------------------------------------------------

type CorreoCredentials = {
  userToken: string | null
  passwordToken: string | null
  email: string | null
  password: string | null
  customerId: string | null
  senderCp: string | null
}

const ENV_CREDENTIALS: CorreoCredentials = {
  userToken: process.env.CORREO_ARGENTINO_USER_TOKEN ?? null,
  passwordToken: process.env.CORREO_ARGENTINO_PASSWORD_TOKEN ?? null,
  email: process.env.CORREO_ARGENTINO_EMAIL ?? null,
  password: process.env.CORREO_ARGENTINO_PASSWORD ?? null,
  customerId: process.env.CORREO_ARGENTINO_CUSTOMER_ID ?? null,
  senderCp: process.env.CORREO_ARGENTINO_SENDER_CP ?? null,
}

let credsCache: CorreoCredentials | null = null
let credsCacheAt = 0

async function getCorreoCredentials(): Promise<CorreoCredentials> {
  if (credsCache && Date.now() - credsCacheAt < 60_000) return credsCache
  const creds = { ...ENV_CREDENTIALS }
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('shipping_settings')
      .select('*')
      .eq('id', 1)
      .single()
    if (data) {
      const s = data as ShippingSettings
      creds.userToken = s.correo_user_token?.trim() || creds.userToken
      creds.passwordToken =
        s.correo_password_token?.trim() || creds.passwordToken
      creds.email = s.correo_email?.trim() || creds.email
      creds.password = s.correo_password?.trim() || creds.password
      creds.customerId = s.correo_customer_id?.trim() || creds.customerId
      creds.senderCp = s.correo_sender_cp?.trim() || creds.senderCp
    }
  } catch {
    // Tabla ausente (migración sin aplicar) o error de red: quedan las de env.
  }
  credsCache = creds
  credsCacheAt = Date.now()
  return creds
}

/** Invalida la caché de credenciales (se llama al guardar en el panel admin). */
export function invalidateCorreoCredentialsCache() {
  credsCache = null
  credsCacheAt = 0
}

/** ¿Está configurado el envío por Correo Argentino? (panel admin o env). */
export async function isCorreoArgentinoConfigured(): Promise<boolean> {
  const c = await getCorreoCredentials()
  return !!(c.userToken && c.passwordToken && c.senderCp)
}

/** Lectura directa (sin caché) de lo guardado, para el panel admin. */
export async function getShippingSettingsRow(): Promise<ShippingSettings | null> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('shipping_settings')
      .select('*')
      .eq('id', 1)
      .single()
    return (data as ShippingSettings | null) ?? null
  } catch {
    return null
  }
}

/** Gateway de Correo Argentino si hay credenciales, o null. */
export async function getCorreoArgentinoGateway(): Promise<ShippingGateway | null> {
  const c = await getCorreoCredentials()
  if (!c.userToken || !c.passwordToken || !c.senderCp) return null
  return new CorreoArgentinoGateway()
}

// ---------------------------------------------------------------------------
// Cliente API MiCorreo (server-only)
// ---------------------------------------------------------------------------

const API_URL =
  process.env.CORREO_ARGENTINO_API_URL ??
  'https://api.correoargentino.com.ar/micorreo/v1'

// Dimensiones por defecto del paquete (cm) si el pedido no las especifica.
const PKG_DIMS = (process.env.CORREO_ARGENTINO_PKG_DIMS ?? '30,20,10')
  .split(',')
  .map((n) => Number(n.trim()))

type ApiError = { code?: string | number; message?: string }

let tokenCache: { token: string; expiresAt: number } | null = null
let customerIdCache: string | null = null

async function fetchToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) return tokenCache.token
  const creds = await getCorreoCredentials()
  if (!creds.userToken || !creds.passwordToken) {
    throw new Error(
      'correo_argentino: faltan el usuario y password token (configuralos en Panel admin → Configuración)',
    )
  }
  const basic = Buffer.from(
    `${creds.userToken}:${creds.passwordToken}`,
  ).toString('base64')
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
  const creds = await getCorreoCredentials()
  if (creds.customerId) return creds.customerId
  if (customerIdCache) return customerIdCache
  if (!creds.email || !creds.password) {
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
    body: JSON.stringify({ email: creds.email, password: creds.password }),
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
  // Solo se instancia cuando hay credenciales (getCorreoArgentinoGateway).
  enabled = true

  async quote(
    destination: ShippingDestination,
    pkg: ShippingPackage,
  ): Promise<ShippingQuote[]> {
    const creds = await getCorreoCredentials()
    if (!creds.senderCp) return []
    if (!destination.postalCode) return []
    const token = await fetchToken()
    const customerId = await fetchCustomerId(token)
    // Sin deliveredType: MiCorreo devuelve domicilio (D) y sucursal (S) en un solo request.
    const data = await apiFetch<RatesResponse>('/rates', {
      customerId,
      postalCodeOrigin: creds.senderCp,
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

export async function getShippingGateways(): Promise<ShippingGateway[]> {
  const gateways: ShippingGateway[] = [new PickupGateway()] // siempre disponible (fallback)
  const correo = await getCorreoArgentinoGateway()
  if (correo) gateways.push(correo)
  return gateways
}

export async function quoteShipping(
  destination: ShippingDestination,
  pkg: ShippingPackage,
): Promise<ShippingQuote[]> {
  const quotes: ShippingQuote[] = []
  for (const gateway of await getShippingGateways()) {
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
