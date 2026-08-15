'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { CartIcon } from './quick-add-button'
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
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-semibold transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 ${
          added
            ? 'bg-emerald-600 text-white'
            : 'bg-black text-white hover:bg-[#24272c]'
        }`}
      >
        {added ? (
          '✓ Agregado'
        ) : disabled ? (
          'Sin stock'
        ) : (
          <>
            <CartIcon className="h-4 w-4" />
            Agregar al carrito
          </>
        )}
      </button>
      <button
        onClick={() => router.push('/cart')}
        disabled={disabled}
        className="rounded-xl border border-neutral-300 px-6 py-4 text-sm font-semibold transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Ver carrito
      </button>
    </div>
  )
}
