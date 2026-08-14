'use client'

import { useState } from 'react'
import { toggleWishlist } from '@/lib/actions'

export default function WishlistButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState(false)

  return (
    <form
      action={async () => {
        setLoading(true)
        const fd = new FormData()
        fd.set('product_id', productId)
        await toggleWishlist(fd)
        setActive((a) => !a)
        setLoading(false)
      }}
      className="absolute right-2 top-2 z-10"
    >
      <button
        type="submit"
        aria-label="Guardar en favoritos"
        className={`flex h-8 w-8 items-center justify-center rounded-full border bg-white/90 text-sm backdrop-blur transition hover:scale-110 ${
          active ? 'border-red-200 text-red-500' : 'border-neutral-200 text-neutral-400'
        }`}
      >
        {active ? '♥' : '♡'}
      </button>
      {loading && <span className="sr-only">Guardando…</span>}
    </form>
  )
}
