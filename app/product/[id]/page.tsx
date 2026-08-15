import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProduct, getProducts } from '@/lib/data'
import { formatPrice } from '@/lib/format'
import AddToCartButton from '@/components/add-to-cart-button'
import CardArt from '@/components/card-art'
import CardTile from '@/components/card-tile'
import ProductCard from '@/components/product-card'
import { CONDITION_LABELS, LANGUAGE_LABELS, isCard } from '@/lib/cards'

export const dynamic = 'force-dynamic'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [product, allProducts] = await Promise.all([
    getProduct(id),
    getProducts(),
  ])
  if (!product) notFound()

  const setKey = product.set_name?.trim().toLowerCase()

  const sameSet = setKey
    ? allProducts.filter(
        (p) =>
          p.id !== product.id &&
          p.set_name?.trim().toLowerCase() === setKey,
      )
    : []

  const sameGame = product.game
    ? allProducts.filter(
        (p) =>
          p.id !== product.id &&
          p.game?.slug === product.game?.slug &&
          !sameSet.some((r) => r.id === p.id),
      )
    : []

  const isCardProduct = isCard(product)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="mx-auto max-w-md">
            {isCardProduct ? (
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
        </div>

        <div>
          <div className="flex flex-wrap gap-2">
            {product.game?.name && (
              <Link
                href={
                  isCardProduct
                    ? `/cartas?game=${product.game.slug}`
                    : `/?juego=${product.game.slug}`
                }
                className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-200 dark:bg-neutral-200 dark:text-neutral-700"
              >
                {product.game.emoji} {product.game.name}
              </Link>
            )}
            {product.set_name && (
              <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700 dark:bg-neutral-200 dark:text-neutral-700">
                {product.set_name}
              </span>
            )}
            {product.condition && (
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                {product.condition} · {CONDITION_LABELS[product.condition]}
              </span>
            )}
          </div>

          <h1 className="mt-4 text-2xl font-bold sm:text-3xl">{product.name}</h1>
          <p className="mt-2 text-2xl font-semibold">
            {formatPrice(product.price)}
          </p>

          {product.description && (
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {product.description}
            </p>
          )}

          {(product.game?.name ||
            product.set_name ||
            product.card_type ||
            product.condition ||
            product.language) && (
            <dl className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-surface text-sm">
              {product.game?.name && (
                <div className="flex items-center justify-between gap-4 border-b border-neutral-100 px-5 py-3 last:border-0">
                  <dt className="text-neutral-500">Juego</dt>
                  <dd className="font-medium">
                    {product.game.emoji} {product.game.name}
                  </dd>
                </div>
              )}
              {product.set_name && (
                <div className="flex items-center justify-between gap-4 border-b border-neutral-100 px-5 py-3 last:border-0">
                  <dt className="text-neutral-500">Set / Expansión</dt>
                  <dd className="font-medium">{product.set_name}</dd>
                </div>
              )}
              {product.card_type && (
                <div className="flex items-center justify-between gap-4 border-b border-neutral-100 px-5 py-3 last:border-0">
                  <dt className="text-neutral-500">Rareza</dt>
                  <dd className="font-medium">{product.card_type}</dd>
                </div>
              )}
              {product.condition && (
                <div className="flex items-center justify-between gap-4 border-b border-neutral-100 px-5 py-3 last:border-0">
                  <dt className="text-neutral-500">Condición</dt>
                  <dd className="font-medium">
                    {product.condition} · {CONDITION_LABELS[product.condition]}
                  </dd>
                </div>
              )}
              {product.language && (
                <div className="flex items-center justify-between gap-4 border-b border-neutral-100 px-5 py-3 last:border-0">
                  <dt className="text-neutral-500">Idioma</dt>
                  <dd className="font-medium">
                    {LANGUAGE_LABELS[product.language]} ({product.language})
                  </dd>
                </div>
              )}
            </dl>
          )}

          <div className="mt-6">
            {product.stock > 0 ? (
              <p className="text-sm text-neutral-500">
                {product.stock} disponibles
              </p>
            ) : (
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                Sin stock
              </p>
            )}
          </div>

          <div className="mt-3">
            <AddToCartButton product={product} disabled={product.stock <= 0} />
          </div>
        </div>
      </div>

      {sameSet.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-xl font-bold tracking-tight">
            Más de {product.set_name}
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {sameSet.slice(0, 8).map((p) =>
              isCard(p) ? (
                <CardTile key={p.id} product={p} />
              ) : (
                <ProductCard key={p.id} product={p} />
              ),
            )}
          </div>
        </section>
      )}

      {sameGame.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-bold tracking-tight">
            Otras cartas de {product.game?.name}
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {sameGame.slice(0, 8).map((p) =>
              isCard(p) ? (
                <CardTile key={p.id} product={p} />
              ) : (
                <ProductCard key={p.id} product={p} />
              ),
            )}
          </div>
        </section>
      )}
    </div>
  )
}