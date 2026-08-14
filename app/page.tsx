import { getProducts } from '@/lib/data'
import ProductCard from '@/components/product-card'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const products = await getProducts()

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold">Tienda</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Cartas y accesorios coleccionables
      </p>
      {products.length === 0 ? (
        <p className="mt-10 text-center text-neutral-500">
          Todavía no hay productos publicados.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
