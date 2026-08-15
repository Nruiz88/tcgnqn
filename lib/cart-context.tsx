'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import type { CartItem, Product } from '@/lib/types'

type CartContextValue = {
  items: CartItem[]
  count: number
  total: number
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'cart'

let cartCache: CartItem[] | null = null
const listeners = new Set<() => void>()

function readCart(): CartItem[] {
  if (cartCache) return cartCache
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    cartCache = stored ? (JSON.parse(stored) as CartItem[]) : []
  } catch {
    // ignore corrupted storage
    cartCache = []
  }
  return cartCache
}

function persistCart(items: CartItem[]) {
  cartCache = items
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // ignore quota errors
  }
  listeners.forEach((l) => l())
}

function subscribeCart(cb: () => void) {
  listeners.add(cb)
  window.addEventListener('storage', cb)
  return () => {
    listeners.delete(cb)
    window.removeEventListener('storage', cb)
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribeCart, readCart, () => [])

  const addItem = useCallback((product: Product, quantity = 1) => {
    const prev = readCart()
    const existing = prev.find((i) => i.product.id === product.id)
    const next = existing
      ? prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        )
      : [...prev, { product, quantity }]
    persistCart(next)
  }, [])

  const removeItem = useCallback((productId: string) => {
    persistCart(readCart().filter((i) => i.product.id !== productId))
  }, [])

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId)
        return
      }
      persistCart(
        readCart().map((i) =>
          i.product.id === productId ? { ...i, quantity } : i,
        ),
      )
    },
    [removeItem],
  )

  const clearCart = useCallback(() => persistCart([]), [])

  const value = useMemo(() => {
    const count = items.reduce((acc, i) => acc + i.quantity, 0)
    const total = items.reduce((acc, i) => acc + i.product.price * i.quantity, 0)
    return { items, count, total, addItem, removeItem, updateQuantity, clearCart }
  }, [items, addItem, removeItem, updateQuantity, clearCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}