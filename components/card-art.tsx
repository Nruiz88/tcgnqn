'use client'

import { useRef } from 'react'
import type { Product } from '@/lib/types'
import { formatPrice } from '@/lib/format'
import { LANGUAGE_LABELS, conditionColor, rarityFor } from '@/lib/cards'
import QuickViewLink from './quick-view-link'

export default function CardArt({
  product,
  showInfo = true,
  imageHref,
  bodyHref,
}: {
  product: Product
  showInfo?: boolean
  imageHref?: string
  bodyHref?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const rarity = rarityFor(product.card_type)
  const lowStock = product.stock > 0 && product.stock <= 3
  const outOfStock = product.stock <= 0

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    el.style.setProperty('--rx', `${(0.5 - py) * 10}deg`)
    el.style.setProperty('--ry', `${(px - 0.5) * 14}deg`)
    el.style.setProperty('--gx', `${px * 100}%`)
    el.style.setProperty('--gy', `${py * 100}%`)
  }

  function resetTilt() {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  const header = (
    <div className="px-3 pb-2 pt-3">
      <p className="truncate text-sm font-bold leading-snug">{product.name}</p>
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-1.5 text-[11px] font-medium text-neutral-500">
          <span
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${rarity.gem} shadow`}
          />
          <span className="truncate">{product.card_type ?? 'Carta'}</span>
        </span>
        {product.language && (
          <span className="shrink-0 rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-600 dark:bg-neutral-200 dark:text-neutral-700">
            {LANGUAGE_LABELS[product.language] ?? product.language}
          </span>
        )}
      </div>
    </div>
  )

  const image = (
    <div
      className="relative mx-3 overflow-hidden rounded-lg bg-neutral-100"
      style={{ aspectRatio: '5 / 7' }}
    >
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
      {rarity.holo && (
        <>
          <div className="holo-tint" />
          <div className="holo-overlay" />
        </>
      )}
      {outOfStock ? (
        <span className="absolute bottom-2 right-2 rounded-md bg-red-600 px-2 py-1 text-[10px] font-bold text-white">
          Agotado
        </span>
      ) : lowStock ? (
        <span className="absolute bottom-2 right-2 rounded-md bg-amber-500 px-2 py-1 text-[10px] font-bold text-white">
          ¡Últimas {product.stock}!
        </span>
      ) : null}
    </div>
  )

  const info = (
    <div className="px-3 py-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-base font-bold">{formatPrice(product.price)}</span>
        {product.condition && (
          <span
            className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${conditionColor(product.condition)}`}
          >
            {product.condition}
          </span>
        )}
      </div>
      {product.set_name && (
        <p className="mt-1 truncate text-[11px] text-neutral-500">
          {product.set_name}
        </p>
      )}
    </div>
  )

  const cardBody = (
    <>
      {header}
      {image}
      {showInfo && info}
    </>
  )

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={resetTilt}
      className="card-tilt group relative"
    >
      <div
        className={`rounded-2xl bg-gradient-to-br p-[2.5px] shadow-lg transition-shadow duration-300 group-hover:shadow-xl ${rarity.border}`}
      >
        <div className="overflow-hidden rounded-[14px] bg-surface">
          {imageHref ? (
            <QuickViewLink href={imageHref} className="block">
              {cardBody}
            </QuickViewLink>
          ) : bodyHref ? (
            <a href={bodyHref} className="block">
              {cardBody}
            </a>
          ) : (
            cardBody
          )}
        </div>
      </div>
    </div>
  )
}