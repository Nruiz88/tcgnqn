import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/data'
import { formatPrice } from '@/lib/format'
import AddToCartButton from '@/components/add-to-cart-button'

export const dynamic = 'force-dynamic'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) notFound()

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-lg bg-neutral-100">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-neutral-400">
              Sin imagen
            </div>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="mt-2 text-xl font-semibold">
            {formatPrice(product.price)}
          </p>
          {product.description && (
            <p className="mt-4 whitespace-pre-line text-sm text-neutral-600">
              {product.description}
            </p>
          )}
          <div className="mt-4">
            {product.stock > 0 ? (
              <p className="text-sm text-neutral-500">
                {product.stock} disponibles
              </p>
            ) : (
              <p className="text-sm font-medium text-red-600">Sin stock</p>
            )}
          </div>
          <AddToCartButton
            product={product}
            disabled={product.stock <= 0}
          />
        </div>
      </div>
    </div>
  )
}
