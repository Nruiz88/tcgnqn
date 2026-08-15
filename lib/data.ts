import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Category, Coupon, Game, Order, OrderItem, Product } from '@/lib/types'

export async function getAllProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*), games(*)')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as Product[]
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*), games(*)')
    .eq('active', true)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as Product[]
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')
  if (error) throw new Error(error.message)
  return (data ?? []) as Category[]
}

export async function getGames(): Promise<Game[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .order('name')
  if (error) throw new Error(error.message)
  return (data ?? []) as Game[]
}

export async function getProductsByCategory(
  slug: string,
): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*), games(*)')
    .eq('active', true)
    .eq('categories.slug', slug)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as Product[]
}

export async function getProductsByGame(slug: string): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*), games(*)')
    .eq('active', true)
    .eq('games.slug', slug)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as Product[]
}

export async function searchProducts(query: string): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*), games(*)')
    .eq('active', true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    .limit(24)
  if (error) throw new Error(error.message)
  return (data ?? []) as Product[]
}

export async function getProduct(id: string): Promise<Product | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*), games(*)')
    .eq('id', id)
    .single()
  if (error) return null
  return data as Product
}

export async function getCoupons(): Promise<Coupon[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as Coupon[]
}

export type OrderWithItems = Order & { items: OrderItem[] }

export async function getWishlist(): Promise<Product[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('wishlist_items')
    .select('product(*, categories(*), games(*))')
    .eq('user_id', user.id)
  if (error) throw new Error(error.message)
  const items = (data ?? []) as unknown as { product: Product | null }[]
  return items.map((w) => w.product).filter((p): p is Product => !!p)
}

export async function getMyOrders(): Promise<OrderWithItems[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*, order_items(*, product(*))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (orders ?? []) as OrderWithItems[]
}

export async function getAllOrders(): Promise<OrderWithItems[]> {
  const supabase = await createClient()
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*, order_items(*, product(*))')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (orders ?? []) as OrderWithItems[]
}

