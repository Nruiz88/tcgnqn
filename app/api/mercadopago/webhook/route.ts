import { NextResponse } from 'next/server'
import { confirmMercadoPagoOrder } from '@/lib/actions'
import { getMercadoPagoCredentials, getPayment } from '@/lib/mercadopago'

/**
 * Webhook de Mercado Pago (notificaciones de pago).
 * Mercado Pago envía POST con { type: 'payment', data: { id } }.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    const paymentId = body?.data?.id ?? body?.payment?.id ?? body?.id
    if (!paymentId) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    const creds = await getMercadoPagoCredentials()
    if (!creds) {
      return NextResponse.json({ ok: false }, { status: 503 })
    }

    // Verificamos el pago contra la API (nunca confiamos en el body).
    const payment = await getPayment(creds.accessToken, String(paymentId))
    if (!payment) {
      return NextResponse.json({ ok: false }, { status: 404 })
    }

    if (payment.status === 'approved' && payment.external_reference) {
      await confirmMercadoPagoOrder(
        payment.external_reference,
        String(payment.id),
      )
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

// Mercado Pago hace un GET de ping al configurar la notificación.
export async function GET() {
  return NextResponse.json({ ok: true })
}
