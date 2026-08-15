export type ModuleKey =
  | 'payments.transferencia'
  | 'payments.whatsapp'
  | 'shipping.correo_argentino'
  | 'wishlist'
  | 'coupons'
  | 'orders_notifications'

export const modules: Record<ModuleKey, boolean> = {
  'payments.transferencia': true,
  'payments.whatsapp': !!process.env.NEXT_PUBLIC_WHATSAPP,
  'shipping.correo_argentino':
    !!process.env.CORREO_ARGENTINO_USER_TOKEN &&
    !!process.env.CORREO_ARGENTINO_PASSWORD_TOKEN &&
    !!process.env.CORREO_ARGENTINO_SENDER_CP,
  wishlist: true,
  coupons: process.env.ENABLE_COUPONS === 'true',
  orders_notifications:
    !!process.env.NEXT_PUBLIC_WHATSAPP || !!process.env.SMTP_URL,
}
