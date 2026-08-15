import Link from 'next/link'
import type { Product } from '@/lib/types'
import { formatPrice } from '@/lib/format'
import { isEnabled } from '@/lib/modules'
import WishlistButton from './wishlist-button'

export default function ProductCard({ product }: { product: Product }) {
  const lowStock = product.stock > 0 && product.stock <= 3
  const outOfStock = product.stock <= 0

  return (
    <div className="group relative overflow-hidden rounded-lg border border-neutral-200 bg-surface transition-shadow hover:shadow-md">
      {isEnabled('wishlist') && <WishlistButton productId={product.id} />}
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-neutral-400">
              Sin imagen
            </div>
          )}
          {product.game?.name && (
            <span className="absolute left-2 top-2 rounded-md bg-[#0d0f14]/80 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur">
              {product.game.emoji} {product.game.name}
            </span>
          )}
          {outOfStock && (
            <span className="absolute right-2 top-2 rounded-md bg-red-600 px-2 py-1 text-[10px] font-bold text-white">
              Agotado
            </span>
          )}
          {lowStock && !outOfStock && (
            <span className="absolute right-2 top-2 rounded-md bg-amber-500 px-2 py-1 text-[10px] font-bold text-white">
              ¡Últimas {product.stock}!
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="truncate text-sm font-medium">{product.name}</h3>
          <p className="mt-1 text-sm font-semibold">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </div>
  )
}
