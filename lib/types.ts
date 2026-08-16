export type Profile = {
  id: string
  full_name: string | null
  phone: string | null
  role: 'customer' | 'admin'
  created_at: string
}

export type Category = {
  id: string
  name: string
  slug: string
  emoji: string | null
  created_at: string
}

export type Game = {
  id: string
  name: string
  slug: string
  emoji: string | null
  color: string | null
  image_url: string | null
  created_at: string
}

export type Product = {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  stock: number
  active: boolean
  featured: boolean
  category_id: string | null
  category?: Category | null
  game_id: string | null
  game?: Game | null
  condition: string | null
  language: string | null
  set_name: string | null
  card_type: string | null
  created_at: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'cancelled'

export type Order = {
  id: string
  user_id: string
  total: number
  discount: number
  status: OrderStatus
  payment_method: string | null
  mp_preference_id: string | null
  mp_payment_id: string | null
  shipping_name: string
  shipping_phone: string
  shipping_address: string
  shipping_method: string | null
  shipping_label: string | null
  shipping_price: number
  shipping_cp: string | null
  shipping_tracking_id: string | null
  shipping_label_reference: string | null
  notes: string | null
  created_at: string
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  product_name: string | null
  product?: Product
}

export type CartItem = {
  product: Product
  quantity: number
}

export type Coupon = {
  id: string
  code: string
  type: 'percent' | 'fixed'
  value: number
  min_total: number | null
  max_uses: number | null
  used_count: number
  expires_at: string | null
  active: boolean
}

export type SiteSettings = {
  id: number
  instagram: string | null
  facebook: string | null
  tiktok: string | null
  x: string | null
  youtube: string | null
  discord: string | null
  mercadopago_enabled: boolean
  updated_at: string
}

export type PaymentSettings = {
  id: number
  mercadopago_access_token: string | null
  mercadopago_public_key: string | null
  updated_at: string
}

export type ShippingSettings = {
  id: number
  correo_user_token: string | null
  correo_password_token: string | null
  correo_email: string | null
  correo_password: string | null
  correo_customer_id: string | null
  correo_sender_cp: string | null
  updated_at: string
}

export type NotificationSettings = {
  id: number
  whatsapp_token: string | null
  whatsapp_phone_id: string | null
  updated_at: string
}

export type SocialKey = keyof Pick<
  SiteSettings,
  'instagram' | 'facebook' | 'tiktok' | 'x' | 'youtube' | 'discord'
>
