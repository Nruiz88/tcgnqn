'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import type { Product } from '@/lib/types'

export default function AddToCartButton({
  product,
  disabled = false,
}: {
  product: Product
  disabled?: boolean
}) {
  const { addItem } = useCart()
  const router = useRouter()
  const [added, setAdded] = useState(false)

  const handleClick = () => {
    addItem(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="mt-6 flex gap-3">
      <button
        onClick={handleClick}
        disabled={disabled}
        className="flex-1 rounded-md bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#24272c] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {added ? '✓ Agregado' : disabled ? 'Sin stock' : 'Agregar al carrito'}
      </button>
      <button
        onClick={() => router.push('/cart')}
        disabled={disabled}
        className="rounded-md border border-neutral-300 px-6 py-3 text-sm font-semibold transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Ver carrito
      </button>
    </div>
  )
}
