'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { CartItem, OrderStatus } from '@/lib/types'
import { isEnabled } from '@/lib/modules'
import { whatsappNumber, buildWhatsappLink, cartSummary } from '@/lib/whatsapp'

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
  let total = cart.reduce(
    (acc, i) => acc + (priceMap.get(i.product.id) ?? 0) * i.quantity,
    0,
  )

  const couponCode = String(formData.get('coupon') ?? '').trim().toUpperCase()
  let discount = 0
  if (couponCode) {
    const { data: coupon, error: couponError } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode)
      .eq('active', true)
      .single()
    if (!couponError && coupon) {
      const expired =
        coupon.expires_at && new Date(coupon.expires_at) < new Date()
      const maxReached =
        coupon.max_uses != null && coupon.used_count >= coupon.max_uses
      const belowMin = coupon.min_total != null && total < coupon.min_total
      if (!expired && !maxReached && !belowMin) {
        discount =
          coupon.type === 'percent'
            ? (total * Number(coupon.value)) / 100
            : Math.min(Number(coupon.value), total)
        await supabase
          .from('coupons')
          .update({ used_count: coupon.used_count + 1 })
          .eq('id', coupon.id)
      }
    }
  }
  total = Math.max(0, Math.round(total - discount))

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      total,
      discount,
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

  if (isEnabled('orders_notifications')) {
    const number = whatsappNumber()
    if (number) {
      const msg =
        `Nuevo pedido #${order.id.slice(0, 8)}\n` +
        `${name}\n${phone}\n${address}\n` +
        `\n${cartSummary(cart)}\n` +
        `Total: ${total}`
      const link = buildWhatsappLink(msg)
      // Log del link para el admin (o integrar envío automático si aplica)
      console.log('WA notification:', link)
    }
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
  const category_id = String(formData.get('category_id') ?? '')

  const { error } = await supabase.from('products').insert({
    name,
    description: description || null,
    price,
    stock,
    image_url: image_url || null,
    category_id: category_id || null,
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
  const category_id = String(formData.get('category_id') ?? '')

  const { error } = await supabase
    .from('products')
    .update({
      name,
      description: description || null,
      price,
      stock,
      image_url: image_url || null,
      category_id: category_id || null,
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

export async function createCategory(formData: FormData) {
  const supabase = await createClient()
  const name = String(formData.get('name') ?? '').trim()
  const emoji = String(formData.get('emoji') ?? '').trim()
  if (!name) return { error: 'Nombre requerido' }

  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const { error } = await supabase
    .from('categories')
    .insert({ name, slug, emoji: emoji || null })
  if (error) return { error: error.message }
  return { ok: true }
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await createClient()
  const name = String(formData.get('name') ?? '').trim()
  const emoji = String(formData.get('emoji') ?? '').trim()
  if (!name) return { error: 'Nombre requerido' }

  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const { error } = await supabase
    .from('categories')
    .update({ name, slug, emoji: emoji || null })
    .eq('id', id)
  if (error) return { error: error.message }
  return { ok: true }
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) return { error: error.message }
  return { ok: true }
}

export async function toggleWishlist(formData: FormData) {  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const productId = String(formData.get('product_id') ?? '')
  const { data: existing } = await supabase
    .from('wishlist_items')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .single()

  if (existing) {
    await supabase.from('wishlist_items').delete().eq('id', existing.id)
  } else {
    await supabase.from('wishlist_items').insert({
      user_id: user.id,
      product_id: productId,
    })
  }
}

export async function createCoupon(formData: FormData) {
  const supabase = await createClient()
  const code = String(formData.get('code') ?? '').trim().toUpperCase()
  const type = String(formData.get('type') ?? 'percent')
  const value = Number(formData.get('value') ?? 0)
  const min_total = formData.get('min_total')
  const max_uses = formData.get('max_uses')
  const expires_at = formData.get('expires_at')

  if (!code || value <= 0) return { error: 'Código y valor requeridos' }

  const { error } = await supabase.from('coupons').insert({
    code,
    type,
    value,
    min_total: min_total ? Number(min_total) : null,
    max_uses: max_uses ? Number(max_uses) : null,
    expires_at: expires_at ? String(expires_at) : null,
  })
  if (error) return { error: error.message }
  return { ok: true }
}

export async function toggleCoupon(id: string, active: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('coupons')
    .update({ active })
    .eq('id', id)
  if (error) return { error: error.message }
  return { ok: true }
}

export async function deleteCoupon(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('coupons').delete().eq('id', id)
  if (error) return { error: error.message }
  return { ok: true }
}
