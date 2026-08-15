import type { Product } from '@/lib/types'
import { isEnabled } from '@/lib/modules'
import WishlistButton from './wishlist-button'
import CardArt from './card-art'

export default function CardTile({ product }: { product: Product }) {
  const href = `/product/${product.id}`
  return (
    <div className="group relative">
      {isEnabled('wishlist') && <WishlistButton productId={product.id} />}
      <CardArt product={product} imageHref={href} bodyHref={href} />
    </div>
  )
}