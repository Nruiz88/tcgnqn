import Link from 'next/link'
import { getWishlist } from '@/lib/data'
import ProductCard from '@/components/product-card'
import CardTile from '@/components/card-tile'
import { requireModule } from '@/lib/modules'
import { isCard } from '@/lib/cards'

export const dynamic = 'force-dynamic'

export default async function WishlistPage() {
  requireModule('wishlist')
  const products = await getWishlist()

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold">Mis favoritos</h1>
      <p className="mt-1 text-sm text-neutral-500">
        {products.length
          ? `${products.length} producto(s) guardados`
          : 'Todavía no guardaste nada'}
      </p>

      {products.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-3xl">♡</p>
          <p className="mt-3 text-neutral-500">
            Tocá el corazón en un producto para guardarlo acá.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm font-medium underline"
          >
            Ir a la tienda
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) =>
            isCard(product) ? (
              <CardTile key={product.id} product={product} />
            ) : (
              <ProductCard key={product.id} product={product} />
            ),
          )}
        </div>
      )}
    </div>
  )
}
