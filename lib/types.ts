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

export type Product = {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  stock: number
  active: boolean
  category_id: string | null
  category?: Category | null
  created_at: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'cancelled'

export type Order = {
  id: string
  user_id: string
  total: number
  status: OrderStatus
  shipping_name: string
  shipping_phone: string
  shipping_address: string
  notes: string | null
  created_at: string
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  product?: Product
}

export type CartItem = {
  product: Product
  quantity: number
}
