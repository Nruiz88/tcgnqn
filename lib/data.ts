import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Order, OrderItem, Product } from '@/lib/types'

export async function getAllProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as Product[]
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as Product[]
}

export async function getProduct(id: string): Promise<Product | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data as Product
}

export type OrderWithItems = Order & { items: OrderItem[] }

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
