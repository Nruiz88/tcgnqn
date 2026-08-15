import Link from 'next/link'
import { searchProducts } from '@/lib/data'
import ProductCard from '@/components/product-card'
import CardTile from '@/components/card-tile'
import { isCard } from '@/lib/cards'

export const dynamic = 'force-dynamic'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q = '' } = await searchParams
  const query = q.trim()
  const products = query ? await searchProducts(query) : []

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold">Búsqueda</h1>
      <p className="mt-1 text-sm text-neutral-500">
        {query
          ? `${products.length} resultado(s) para "${query}"`
          : 'Escribí algo para buscar'}
      </p>

      {query && products.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) =>
            isCard(product) ? (
              <CardTile key={product.id} product={product} />
            ) : (
              <ProductCard key={product.id} product={product} />
            ),
          )}
        </div>
      ) : (
        query && (
          <div className="mt-16 text-center">
            <p className="text-3xl">🔍</p>
            <p className="mt-3 text-neutral-500">
              No encontramos nada para “{query}”.
            </p>
            <Link href="/" className="mt-4 inline-block text-sm font-medium underline">
              Volver a la tienda
            </Link>
          </div>
        )
      )}
    </div>
  )
}
