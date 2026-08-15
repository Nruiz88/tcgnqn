import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'
import type { NotificationSettings } from '@/lib/types'

// ---------------------------------------------------------------------------
// Notificaciones al cliente (aviso de envío / cambio de estado)
//
// Canal 1 (automático): WhatsApp Cloud API oficial de Meta. Las credenciales
//   se cargan en Panel admin → Configuración (tabla notification_settings),
//   con fallback a WHATSAPP_TOKEN / WHATSAPP_PHONE_ID en .env.local.
// Canal 2 (fallback): link wa.me con el mensaje listo para que el admin
//   lo mande en un toque. Se devuelve al caller para mostrarlo en la UI.
// ---------------------------------------------------------------------------

export const TRACKING_URL =
  'https://www.correoargentino.com.ar/formularios/seguimiento'

type WhatsAppCredentials = {
  token: string | null
  phoneId: string | null
}

let credsCache: WhatsAppCredentials | null = null
let credsCacheAt = 0

async function getWhatsAppCredentials(): Promise<WhatsAppCredentials> {
  if (credsCache && Date.now() - credsCacheAt < 60_000) return credsCache
  const creds: WhatsAppCredentials = {
    token: process.env.WHATSAPP_TOKEN ?? null,
    phoneId: process.env.WHATSAPP_PHONE_ID ?? null,
  }
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('id', 1)
      .single()
    if (data) {
      const s = data as NotificationSettings
      creds.token = s.whatsapp_token?.trim() || creds.token
      creds.phoneId = s.whatsapp_phone_id?.trim() || creds.phoneId
    }
  } catch {
    // Tabla ausente (migración sin aplicar) o error de red: quedan las de env.
  }
  credsCache = creds
  credsCacheAt = Date.now()
  return creds
}

/** Invalida la caché de credenciales (se llama al guardar en el panel admin). */
export function invalidateWhatsAppCredentialsCache() {
  credsCache = null
  credsCacheAt = 0
}

/** ¿Hay credenciales para enviar avisos automáticos por la Cloud API? */
export async function hasWhatsAppApi(): Promise<boolean> {
  const c = await getWhatsAppCredentials()
  return !!(c.token && c.phoneId)
}

/** Lectura directa (sin caché) de lo guardado, para el panel admin. */
export async function getNotificationSettingsRow(): Promise<NotificationSettings | null> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('id', 1)
      .single()
    return (data as NotificationSettings | null) ?? null
  } catch {
    return null
  }
}

/** Normaliza un teléfono argentino a formato E.164 (requerido por la API). */
function toE164(raw: string): string | null {
  const d = (raw ?? '').replace(/\D/g, '')
  if (!d) return null
  if (d.startsWith('549')) return `+${d}`
  if (d.startsWith('54') && d.length >= 12) return `+${d}`
  return `+549${d}`
}

async function sendWhatsAppApi(to: string, body: string): Promise<boolean> {
  const creds = await getWhatsAppCredentials()
  if (!creds.token || !creds.phoneId) return false
  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${creds.phoneId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${creds.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body },
        }),
        cache: 'no-store',
      },
    )
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error(`[notifications] WhatsApp API ${res.status}: ${detail}`)
      return false
    }
    return true
  } catch (e) {
    console.error('[notifications] WhatsApp API error:', e)
    return false
  }
}

export type OrderEventNotification = {
  orderId: string
  customerName: string
  customerPhone: string
  statusLabel: string // ej. 'en camino', 'confirmado'
  trackingReference?: string | null
  trackingUrl?: string | null
}

function buildMessage(n: OrderEventNotification): string {
  const url = n.trackingUrl ? `\nSeguimiento: ${n.trackingUrl}` : ''
  const ref = n.trackingReference ? `\nReferencia: ${n.trackingReference}` : ''
  return (
    `¡Hola ${n.customerName || ''}! 👋\n` +
    `Tu pedido #${n.orderId.slice(0, 8)} de TCG NQN está ${n.statusLabel.toLowerCase()}. 🚚` +
    url +
    ref +
    '\n¡Gracias por comprar!'
  )
}

/**
 * Avisa al cliente por WhatsApp.
 * Devuelve `{ sent, link }`: `sent` indica si se mandó automáticamente por la
 * Cloud API; `link` es el wa.me listo para enviar (fallback o si falló la API).
 */
export async function notifyOrderEvent(
  n: OrderEventNotification,
): Promise<{ sent: boolean; link: string | null }> {
  const msg = buildMessage(n)

  if (await hasWhatsAppApi()) {
    const to = toE164(n.customerPhone)
    if (to) {
      const ok = await sendWhatsAppApi(to, msg)
      if (ok) return { sent: true, link: null }
    }
  }

  const digits = (n.customerPhone ?? '').replace(/\D/g, '')
  if (digits) {
    const link = `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`
    console.log('[notifications] aviso listo (sin Cloud API):', link)
    return { sent: false, link }
  }
  return { sent: false, link: null }
}
