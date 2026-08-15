import CheckoutForm from '@/components/checkout-form'
import { getPaymentMethods } from '@/lib/payments'
import {
  getMercadoPagoEnabled,
  getMercadoPagoCredentials,
} from '@/lib/mercadopago'

export const dynamic = 'force-dynamic'

export default async function CheckoutPage() {
  // Mercado Pago se activa/desactiva desde el panel admin (vive en la DB).
  // Solo se ofrece si está activado Y hay credenciales cargadas.
  const [mercadopagoEnabled, creds] = await Promise.all([
    getMercadoPagoEnabled(),
    getMercadoPagoCredentials(),
  ])
  const methods = getPaymentMethods(
    mercadopagoEnabled && !!creds?.accessToken,
  )

  return <CheckoutForm methods={methods} />
}
