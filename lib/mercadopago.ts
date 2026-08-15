import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'
import type { PaymentSettings } from '@/lib/types'

const MP_API = 'https://api.mercadopago.com'

export type MercadoPagoCredentials = {
  accessToken: string
  publicKey: string | null
}

function isSandboxToken(token: string) {
  return token.startsWith('TEST-')
}

/** Si Mercado Pago está activado como método de pago (lectura pública). */
export async function getMercadoPagoEnabled(): Promise<boolean> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('site_settings')
    .select('mercadopago_enabled')
    .eq('id', 1)
    .single()
  return !!data?.mercadopago_enabled
}

/** Credenciales de Mercado Pago guardadas por el admin (o null si no hay token). */
export async function getMercadoPagoCredentials(): Promise<MercadoPagoCredentials | null> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('payment_settings')
    .select('*')
    .eq('id', 1)
    .single()
  const settings = data as PaymentSettings | null
  const accessToken = settings?.mercadopago_access_token?.trim()
  if (!accessToken) return null
  return {
    accessToken,
    publicKey: settings?.mercadopago_public_key?.trim() || null,
  }
}

export type MercadoPagoPreferenceInput = {
  orderId: string
  title: string
  total: number
}

export async function createPreference(
  accessToken: string,
  input: MercadoPagoPreferenceInput,
): Promise<{ id: string; initPoint: string }> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const body = {
    external_reference: input.orderId,
    statement_descriptor: 'TCG NQN',
    items: [
      {
        id: input.orderId,
        title: input.title,
        description: input.title,
        quantity: 1,
        unit_price: Number(input.total),
        currency_id: 'ARS',
      },
    ],
    back_urls: {
      success: `${siteUrl}/order-confirmed?order=${input.orderId}&mp=success`,
      pending: `${siteUrl}/order-confirmed?order=${input.orderId}&mp=pending`,
      failure: `${siteUrl}/order-confirmed?order=${input.orderId}&mp=failure`,
    },
    auto_return: 'approved',
    notification_url: `${siteUrl}/api/mercadopago/webhook`,
  }

  const res = await fetch(`${MP_API}/checkout/preferences`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  })

  const json = await res.json().catch(() => null)
  if (!res.ok) {
    let message =
      json?.message ?? json?.error ?? `Error de Mercado Pago (${res.status})`
    // Token inválido: Mercado Pago devuelve un mensaje interno poco claro.
    if (
      res.status === 401 ||
      json?.code === 'PA_UNAUTHORIZED_RESULT_FROM_POLICIES'
    ) {
      message =
        'El access token de Mercado Pago no es válido. Revisalo en Panel admin → Configuración.'
    }
    throw new Error(message)
  }
  // Con token de prueba (TEST-) Mercado Pago devuelve sandbox_init_point.
  const initPoint = isSandboxToken(accessToken)
    ? (json?.sandbox_init_point ?? json?.init_point)
    : (json?.init_point ?? json?.sandbox_init_point)
  if (!initPoint) throw new Error('Mercado Pago no devolvió un link de pago')
  return { id: String(json.id), initPoint: String(initPoint) }
}

export async function getPayment(
  accessToken: string,
  paymentId: string,
): Promise<{
  id: number
  status: string
  status_detail: string
  external_reference: string | null
} | null> {
  const res = await fetch(`${MP_API}/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  })
  if (!res.ok) return null
  const json = await res.json().catch(() => null)
  if (!json?.id) return null
  return {
    id: Number(json.id),
    status: String(json.status),
    status_detail: String(json.status_detail ?? ''),
    external_reference: json.external_reference ? String(json.external_reference) : null,
  }
}
