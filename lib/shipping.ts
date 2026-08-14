import { isEnabled } from '@/lib/modules'

export type ShippingQuote = {
  service: string
  price: number
  estimatedDays: string
}

export interface ShippingGateway {
  id: string
  label: string
  enabled: boolean
  quote(destination: string, weightKg: number): Promise<ShippingQuote[]>
  createLabel(orderId: string): Promise<string>
  track(trackingId: string): Promise<string | null>
}

class CorreoArgentinoGateway implements ShippingGateway {
  id = 'correo_argentino'
  label = 'Correo Argentino'
  enabled = isEnabled('shipping.correo_argentino')

  async quote(): Promise<ShippingQuote[]> {
    // Placeholder: se implementa con la API de cotización cuando haya credenciales.
    return []
  }

  async createLabel(): Promise<string> {
    throw new Error('correo_argentino: credenciales no configuradas')
  }

  async track(): Promise<string | null> {
    return null
  }
}

export const shippingGateways: ShippingGateway[] = [
  new CorreoArgentinoGateway(),
]

export function getShippingGateways(): ShippingGateway[] {
  return shippingGateways.filter((g) => g.enabled)
}
