import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/data'
import { formatPrice } from '@/lib/format'
import AddToCartButton from '@/components/add-to-cart-button'
import CardArt from '@/components/card-art'
import { CONDITION_LABELS, LANGUAGE_LABELS, isCard } from '@/lib/cards'

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
        <div className="md:sticky md:top-24 md:self-start">
          {isCard(product) ? (
            <CardArt product={product} showInfo={false} />
          ) : (
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
          )}
        </div>
        <div>
          {product.game?.name && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700">
              {product.game.emoji} {product.game.name}
            </span>
          )}
          <h1 className="mt-2 text-2xl font-bold">{product.name}</h1>
          <p className="mt-2 text-xl font-semibold">
            {formatPrice(product.price)}
          </p>
          {product.description && (
            <p className="mt-4 whitespace-pre-line text-sm text-neutral-600">
              {product.description}
            </p>
          )}
          {product.condition ||
          product.language ||
          product.set_name ||
          product.card_type ? (
            <dl className="mt-6 space-y-2 rounded-2xl border border-neutral-200 bg-surface p-5 text-sm">
              {product.set_name && (
                <div className="flex justify-between gap-4">
                  <dt className="text-neutral-500">Set / Expansión</dt>
                  <dd className="font-medium">{product.set_name}</dd>
                </div>
              )}
              {product.card_type && (
                <div className="flex justify-between gap-4">
                  <dt className="text-neutral-500">Rareza</dt>
                  <dd className="font-medium">{product.card_type}</dd>
                </div>
              )}
              {product.condition && (
                <div className="flex justify-between gap-4">
                  <dt className="text-neutral-500">Condición</dt>
                  <dd className="font-medium">
                    {product.condition} · {CONDITION_LABELS[product.condition]}
                  </dd>
                </div>
              )}
              {product.language && (
                <div className="flex justify-between gap-4">
                  <dt className="text-neutral-500">Idioma</dt>
                  <dd className="font-medium">
                    {LANGUAGE_LABELS[product.language]} ({product.language})
                  </dd>
                </div>
              )}
            </dl>
          ) : null}
          <div className="mt-4">
            {product.stock > 0 ? (
              <p className="text-sm text-neutral-500">
                {product.stock} disponibles
              </p>
            ) : (
              <p className="text-sm font-medium text-red-600 dark:text-red-400">Sin stock</p>
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
