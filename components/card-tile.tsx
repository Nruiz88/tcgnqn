import Link from 'next/link'
import type { Product } from '@/lib/types'
import { isEnabled } from '@/lib/modules'
import WishlistButton from './wishlist-button'
import CardArt from './card-art'

export default function CardTile({ product }: { product: Product }) {
  return (
    <div className="group relative">
      {isEnabled('wishlist') && <WishlistButton productId={product.id} />}
      <Link href={`/product/${product.id}`} className="block">
        <CardArt product={product} />
      </Link>
    </div>
  )
}