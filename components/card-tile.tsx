import type { Product } from '@/lib/types'
import { isEnabled } from '@/lib/modules'
import WishlistButton from './wishlist-button'
import CardArt from './card-art'
import QuickAddButton from './quick-add-button'

export default function CardTile({ product }: { product: Product }) {
  const href = `/product/${product.id}`
  return (
    <div className="group relative">
      {isEnabled('wishlist') && <WishlistButton productId={product.id} />}
      <CardArt product={product} imageHref={href} bodyHref={href} />
      <QuickAddButton product={product} className="mt-2 w-full" />
    </div>
  )
}
