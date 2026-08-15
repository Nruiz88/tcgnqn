'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Product } from '@/lib/types'
import { formatPrice } from '@/lib/format'
import { useCart } from '@/lib/cart-context'
import CardArt from '@/components/card-art'
import { isCard } from '@/lib/cards'

export default function QuickViewModal({ product }: { product: Product }) {
  const router = useRouter()
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const cardProduct = isCard(product)

  function close() {
    router.back()
  }

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAdd = () => {
    if (product.stock <= 0) return
    addItem(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const kicker = cardProduct ? product.game?.name ?? 'Carta' : 'Producto'

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button
        aria-label="Cerrar"
        onClick={close}
        className="absolute inset-0 h-full w-full cursor-default bg-black/60 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-surface shadow-2xl sm:rounded-2xl"
      >
        <button
          onClick={close}
          aria-label="Cerrar"
          className="absolute right-3 top-3 z-20 rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-800"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <header className="px-6 pb-3 pt-6 sm:px-6">
          <div className="flex items-start justify-between gap-3 pr-8">
            <div className="min-w-0">
              <h5 className="text-xs uppercase tracking-wide text-neutral-500">
                {kicker}
              </h5>
              <h3 className="mt-1 text-lg font-semibold leading-snug">
                {product.name} · <span>{formatPrice(product.price)}</span>
              </h3>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                product.stock > 0
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
            </span>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-6 py-2">
          <div className="relative overflow-hidden rounded-xl p-4">
            {product.image_url && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image_url}
                  alt=""
                  aria-hidden
                  className="absolute left-0 top-0 h-full w-full scale-[2] object-cover opacity-30 blur-2xl"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/25 to-transparent" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-fuchsia-500/10" />
                <div className="pointer-events-none absolute inset-0 shadow-inner shadow-black/20" />
              </>
            )}
            <div className="relative z-10 mx-auto max-w-[250px] py-2">
              {cardProduct ? (
                <CardArt product={product} showInfo={false} />
              ) : (
                <div className="aspect-square overflow-hidden rounded-xl bg-neutral-100">
                  {product.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                      Sin imagen
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {(cardProduct &&
            (product.card_type ||
              product.set_name ||
              product.condition ||
              product.language)) && (
            <div className="flex flex-wrap gap-1.5">
              {product.card_type && (
                <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600 dark:bg-neutral-200 dark:text-neutral-700">
                  {product.card_type}
                </span>
              )}
              {product.set_name && (
                <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600 dark:bg-neutral-200 dark:text-neutral-700">
                  {product.set_name}
                </span>
              )}
              {product.condition && (
                <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600 dark:bg-neutral-200 dark:text-neutral-700">
                  {product.condition} ·{' '}
                  {product.language ? `Idioma ${product.language}` : ''}
                </span>
              )}
            </div>
          )}

          {product.description && (
            <div className="max-h-36 overflow-y-auto text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {product.description}
            </div>
          )}
        </div>

        <footer className="flex flex-col gap-2 px-6 py-4">
          <button
            onClick={handleAdd}
            disabled={product.stock <= 0}
            className="h-14 w-full rounded-lg bg-black text-lg font-semibold text-white transition hover:bg-[#24272c] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {added ? '✓ Agregado' : product.stock <= 0 ? 'Sin stock' : 'Agregar al carrito'}
          </button>
          <a
            href={`/product/${product.id}`}
            className="text-center text-xs text-neutral-500 transition hover:text-neutral-700"
          >
            Ver página completa →
          </a>
        </footer>
      </div>
    </div>
  )
}