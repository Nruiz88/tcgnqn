import type { Product } from '@/lib/types'
import { formatPrice } from '@/lib/format'
import { isEnabled } from '@/lib/modules'
import { LANGUAGE_LABELS, conditionColor } from '@/lib/cards'
import WishlistButton from './wishlist-button'
import QuickViewLink from './quick-view-link'
import QuickAddButton from './quick-add-button'

export default function ProductCard({ product }: { product: Product }) {
  const href = `/product/${product.id}`
  const lowStock = product.stock > 0 && product.stock <= 3
  const outOfStock = product.stock <= 0
  const label =
    product.category?.name ?? product.game?.name ?? 'Producto'
  const language = product.language
    ? LANGUAGE_LABELS[product.language] ?? product.language
    : null

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-xl">
      {isEnabled('wishlist') && <WishlistButton productId={product.id} />}
      <QuickViewLink href={href} className="block">
        <div className="relative aspect-square overflow-hidden bg-neutral-100">
          {product.image_url ? (
            <>
              {/* Halo: imagen desenfocada y saturada detrás del producto */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image_url}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full scale-[1.8] object-cover opacity-40 blur-2xl saturate-150 transition-all duration-500 motion-reduce:transition-none group-hover:scale-[1.5] group-hover:opacity-60"
              />
              {/* Brillo blanco superior */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
              {/* Overlay de marca que se intensifica en hover */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500 to-fuchsia-500 opacity-10 transition-opacity duration-300 group-hover:opacity-25" />
              {/* Sombra interior para dar profundidad */}
              <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_24px_rgba(0,0,0,0.12)]" />
              {/* Imagen principal: se achica, satura y despega en hover */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image_url}
                alt={product.name}
                className="relative z-10 m-auto h-full w-auto max-w-full object-contain transition-all duration-300 motion-reduce:transition-none group-hover:scale-95 group-hover:drop-shadow-xl group-hover:saturate-150"
              />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-neutral-400">
              Sin imagen
            </div>
          )}

          {outOfStock ? (
            <span className="absolute left-3 top-3 z-20 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
              Agotado
            </span>
          ) : lowStock ? (
            <span className="absolute left-3 top-3 z-20 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
              ¡Últimas {product.stock}!
            </span>
          ) : (
            <span className="absolute left-3 top-3 z-20 rounded-full bg-emerald-600/95 px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm">
              {product.stock}u
            </span>
          )}
        </div>

        <div className="p-3.5">
          <p className="truncate text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
            {label}
            {language ? ` · ${language}` : ''}
          </p>
          <h3 className="mt-1 truncate text-sm font-semibold text-neutral-900 transition-colors group-hover:text-indigo-600">
            {product.name}
          </h3>
          {product.description && (
            <p className="mt-1 line-clamp-2 text-xs leading-snug text-neutral-500">
              {product.description}
            </p>
          )}
          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="text-sm font-bold">{formatPrice(product.price)}</p>
            {product.condition && (
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${conditionColor(product.condition)}`}
              >
                {product.condition}
              </span>
            )}
          </div>
        </div>
      </QuickViewLink>
      <div className="border-t border-neutral-200 p-3 pt-2.5">
        <QuickAddButton product={product} className="w-full" />
      </div>
    </div>
  )
}
