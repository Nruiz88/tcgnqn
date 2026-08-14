'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { CartItem, OrderStatus } from '@/lib/types'

export async function signIn(formData: FormData) {
  const supabase = await createClient()
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/account')
}

export async function signUp(formData: FormData) {
  const supabase = await createClient()
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const fullName = String(formData.get('full_name') ?? '')

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  })
  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  if (data.user) {
    await supabase.from('profiles').upsert({
      id: data.user.id,
      full_name: fullName,
      role: 'customer',
    })
  }

  redirect('/login?registered=true')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function createOrder(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const name = String(formData.get('name') ?? '')
  const phone = String(formData.get('phone') ?? '')
  const address = String(formData.get('address') ?? '')
  const notes = String(formData.get('notes') ?? '')
  const rawItems = String(formData.get('items') ?? '')

  let cart: CartItem[] = []
  try {
    cart = JSON.parse(rawItems)
  } catch {
    return { error: 'Carrito inválido' }
  }
  if (cart.length === 0) return { error: 'El carrito está vacío' }

  const productIds = cart.map((i) => i.product.id)
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, price')
    .in('id', productIds)
  if (productsError || !products) return { error: 'Error de productos' }

  const priceMap = new Map(products.map((p) => [p.id, p.price]))
  const total = cart.reduce(
    (acc, i) => acc + (priceMap.get(i.product.id) ?? 0) * i.quantity,
    0,
  )

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      total,
      status: 'pending',
      shipping_name: name,
      shipping_phone: phone,
      shipping_address: address,
      notes: notes || null,
    })
    .select()
    .single()
  if (orderError || !order) return { error: 'No se pudo crear el pedido' }

  const { error: itemsError } = await supabase.from('order_items').insert(
    cart.map((i) => ({
      order_id: order.id,
      product_id: i.product.id,
      quantity: i.quantity,
      price: priceMap.get(i.product.id) ?? 0,
    })),
  )
  if (itemsError) return { error: 'No se pudo guardar los ítems' }

  for (const item of cart) {
    await supabase.rpc('decrement_stock', {
      product_id: item.product.id,
      qty: item.quantity,
    })
  }

  redirect(`/order-confirmed?order=${order.id}`)
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient()
  const name = String(formData.get('name') ?? '')
  const description = String(formData.get('description') ?? '')
  const price = Number(formData.get('price') ?? 0)
  const stock = Number(formData.get('stock') ?? 0)
  const image_url = String(formData.get('image_url') ?? '')

  const { error } = await supabase.from('products').insert({
    name,
    description: description || null,
    price,
    stock,
    image_url: image_url || null,
    active: true,
  })
  if (error) return { error: error.message }
  return { ok: true }
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient()
  const name = String(formData.get('name') ?? '')
  const description = String(formData.get('description') ?? '')
  const price = Number(formData.get('price') ?? 0)
  const stock = Number(formData.get('stock') ?? 0)
  const image_url = String(formData.get('image_url') ?? '')

  const { error } = await supabase
    .from('products')
    .update({
      name,
      description: description || null,
      price,
      stock,
      image_url: image_url || null,
    })
    .eq('id', id)
  if (error) return { error: error.message }
  return { ok: true }
}

export async function toggleProduct(id: string, active: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('products')
    .update({ active })
    .eq('id', id)
  if (error) return { error: error.message }
  return { ok: true }
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
  if (error) return { error: error.message }
  return { ok: true }
}
