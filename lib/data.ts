import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type {
  Category,
  Coupon,
  Game,
  Order,
  OrderItem,
  Product,
  SiteSettings,
} from '@/lib/types'

export async function getAllProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*), game:games(*)')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as Product[]
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*), game:games(*)')
    .eq('active', true)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as Product[]
}

export type AdminProductsFilter = {
  categorySlug?: string
  query?: string
  gameId?: string
  condition?: string
  language?: string
  status?: 'active' | 'hidden' | 'all'
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'stock_asc'
  page?: number
  pageSize?: number
}

/**
 * Lista paginada de productos para el panel admin, con búsqueda y filtros.
 * Devuelve también el total para armar la paginación.
 */
export async function getAdminProducts(
  filter: AdminProductsFilter = {},
): Promise<{ products: Product[]; total: number }> {
  const supabase = await createClient()
  let query = supabase
    .from('products')
    .select('*, category:categories(*), game:games(*)', { count: 'exact' })

  if (filter.categorySlug) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', filter.categorySlug)
      .single()
    if (cat) query = query.eq('category_id', cat.id)
  }

  const q = filter.query?.trim()
  if (q) {
    // .or() usa comas como separador: se escapan para no romper la sintaxis.
    const safe = q.replace(/,/g, ' ')
    query = query.or(`name.ilike.%${safe}%,description.ilike.%${safe}%`)
  }
  if (filter.gameId) query = query.eq('game_id', filter.gameId)
  if (filter.condition) query = query.eq('condition', filter.condition)
  if (filter.language) query = query.eq('language', filter.language)
  if (filter.status === 'active') query = query.eq('active', true)
  if (filter.status === 'hidden') query = query.eq('active', false)

  switch (filter.sort ?? 'newest') {
    case 'price_asc':
      query = query.order('price', { ascending: true })
      break
    case 'price_desc':
      query = query.order('price', { ascending: false })
      break
    case 'stock_asc':
      query = query.order('stock', { ascending: true })
      break
    default:
      query = query.order('created_at', { ascending: false })
  }

  const pageSize = Math.min(50, Math.max(1, filter.pageSize ?? 20))
  const page = Math.max(1, filter.page ?? 1)
  const from = (page - 1) * pageSize
  query = query.range(from, from + pageSize - 1)

  const { data, count, error } = await query
  if (error) throw new Error(error.message)
  return { products: (data ?? []) as Product[], total: count ?? 0 }
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
  const { data: cat } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', slug)
    .single()
  if (!cat) return []
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*), game:games(*)')
    .eq('active', true)
    .eq('category_id', cat.id)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as Product[]
}

export async function getProductsByGame(slug: string): Promise<Product[]> {
  const supabase = await createClient()
  const { data: game } = await supabase
    .from('games')
    .select('id')
    .eq('slug', slug)
    .single()
  if (!game) return []
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*), game:games(*)')
    .eq('active', true)
    .eq('game_id', game.id)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as Product[]
}

export async function searchProducts(query: string): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*), game:games(*)')
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
    .select('*, category:categories(*), game:games(*)')
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
    .select('product:products(*, category:categories(*), game:games(*))')
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
    .select('*, items:order_items(*, product:products(*, category:categories(*), game:games(*)))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (orders ?? []) as OrderWithItems[]
}

export async function getAllOrders(): Promise<OrderWithItems[]> {
  const supabase = await createClient()
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*, product:products(*, category:categories(*), game:games(*)))')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (orders ?? []) as OrderWithItems[]
}

export async function getMyOrder(
  id: string,
): Promise<OrderWithItems | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*, product:products(*, category:categories(*), game:games(*)))')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()
  if (error) return null
  return data as OrderWithItems
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single()
  if (error) return null
  return data as SiteSettings
}

