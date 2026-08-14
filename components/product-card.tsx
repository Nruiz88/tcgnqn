import Link from 'next/link'
import type { Product } from '@/lib/types'
import { formatPrice } from '@/lib/format'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group overflow-hidden rounded-lg border border-neutral-200 bg-white transition-shadow hover:shadow-md"
    >
      <div className="aspect-square w-full overflow-hidden bg-neutral-100">
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
      </div>
      <div className="p-4">
        <h3 className="truncate text-sm font-medium">{product.name}</h3>
        <p className="mt-1 text-sm font-semibold">{formatPrice(product.price)}</p>
      </div>
    </Link>
  )
}
