'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cart-context'
import type { Product } from '@/lib/types'

function CartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )
}

export default function QuickAddButton({
  product,
  className = '',
}: {
  product: Product
  className?: string
}) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const outOfStock = product.stock <= 0

  function handleClick() {
    if (outOfStock) return
    addItem(product, 1)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1200)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={outOfStock}
      aria-label={outOfStock ? 'Sin stock' : 'Agregar al carrito'}
      className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed ${
        added
          ? 'bg-emerald-600 text-white'
          : outOfStock
            ? 'bg-neutral-100 text-neutral-400 dark:bg-neutral-200 dark:text-neutral-500'
            : 'bg-black text-white hover:bg-[#24272c]'
      } ${className}`}
    >
      {added ? (
        <>✓ Agregado</>
      ) : outOfStock ? (
        'Sin stock'
      ) : (
        <>
          <CartIcon className="h-4 w-4" />
          Agregar
        </>
      )}
    </button>
  )
}
