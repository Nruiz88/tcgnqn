export type ModuleKey =
  | 'payments.transferencia'
  | 'payments.whatsapp'
  | 'payments.mercadopago'
  | 'shipping.correo_argentino'
  | 'wishlist'
  | 'coupons'
  | 'orders_notifications'

export const modules: Record<ModuleKey, boolean> = {
  'payments.transferencia': true,
  'payments.whatsapp': !!process.env.NEXT_PUBLIC_WHATSAPP,
  'payments.mercadopago': false,
  'shipping.correo_argentino': !!process.env.CORREO_ARGENTINO_API_KEY,
  wishlist: true,
  coupons: process.env.ENABLE_COUPONS === 'true',
  orders_notifications:
    !!process.env.NEXT_PUBLIC_WHATSAPP || !!process.env.SMTP_URL,
}
