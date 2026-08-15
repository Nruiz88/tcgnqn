import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProduct, getProducts } from '@/lib/data'
import { formatPrice } from '@/lib/format'
import AddToCartButton from '@/components/add-to-cart-button'
import CardArt from '@/components/card-art'
import CardTile from '@/components/card-tile'
import ProductCard from '@/components/product-card'
import {
  CONDITION_LABELS,
  LANGUAGE_LABELS,
  conditionColor,
  rarityFor,
  isCard,
} from '@/lib/cards'
import { buildWhatsappLink, whatsappNumber } from '@/lib/whatsapp'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) return { title: 'Producto no encontrado · TCG NQN' }
  return {
    title: `${product.name} · TCG NQN`,
    description:
      product.description ??
      `Comprá ${product.name} en TCG NQN. Envíos protegidos a todo el país.`,
  }
}

function Breadcrumb({ product }: { product: NonNullable<Awaited<ReturnType<typeof getProduct>>> }) {
  const isCardProduct = isCard(product)
  return (
    <nav
      aria-label="Miga de pan"
      className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500"
    >
      <Link href="/" className="transition hover:text-neutral-900 dark:hover:text-neutral-100">
        Inicio
      </Link>
      {product.game?.name && (
        <>
          <span aria-hidden>/</span>
          <Link
            href={
              isCardProduct
                ? `/cartas?game=${product.game.slug}`
                : `/?game=${product.game.slug}`
            }
            className="transition hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            {product.game.name}
          </Link>
        </>
      )}
      {product.set_name && (
        <>
          <span aria-hidden>/</span>
          <Link
            href={`/cartas?set=${encodeURIComponent(product.set_name.trim().toLowerCase())}`}
            className="transition hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            {product.set_name}
          </Link>
        </>
      )}
      <span aria-hidden>/</span>
      <span className="truncate font-medium text-neutral-900 dark:text-neutral-100">
        {product.name}
      </span>
    </nav>
  )
}

function SpecCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-surface p-3">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-medium">{value}</p>
    </div>
  )
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [product, allProducts] = await Promise.all([getProduct(id), getProducts()])
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
  const rarity = rarityFor(product.card_type)
  const outOfStock = product.stock <= 0
  const lowStock = !outOfStock && product.stock <= 3
  const hasWa = Boolean(whatsappNumber())
  const wa = buildWhatsappLink(
    `¡Hola TCG NQN! Tengo una consulta sobre "${product.name}".`,
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Breadcrumb product={product} />

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Imagen */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-neutral-100 p-6 sm:p-10 dark:border-neutral-200 dark:from-neutral-100 dark:to-neutral-200">
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl" />
            <div className="relative z-10 mx-auto max-w-sm">
              {isCardProduct ? (
                <CardArt product={product} showInfo={false} />
              ) : product.image_url ? (
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image_url}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 h-full w-full scale-[1.8] object-cover opacity-40 blur-2xl saturate-150"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500 to-fuchsia-500 opacity-10" />
                  <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_28px_rgba(0,0,0,0.12)]" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="relative z-10 m-auto h-full w-auto max-w-full object-contain"
                  />
                </div>
              ) : (
                <div className="flex aspect-square items-center justify-center rounded-2xl bg-neutral-100 text-sm text-neutral-400">
                  Sin imagen
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Información */}
        <div>
          <div className="flex flex-wrap gap-2">
            {product.game?.name && (
              <Link
                href={
                  isCardProduct
                    ? `/cartas?game=${product.game.slug}`
                    : `/?game=${product.game.slug}`
                }
                className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-200 dark:bg-neutral-200 dark:text-neutral-700"
              >
                {product.game.emoji} {product.game.name}
              </Link>
            )}
            {product.set_name && (
              <Link
                href={`/cartas?set=${encodeURIComponent(product.set_name.trim().toLowerCase())}`}
                className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-200 dark:bg-neutral-200 dark:text-neutral-700"
              >
                {product.set_name}
              </Link>
            )}
            {isCardProduct && product.card_type && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700 dark:bg-neutral-200 dark:text-neutral-700">
                <span className={`h-2 w-2 rounded-full ${rarity.gem}`} />
                {product.card_type}
              </span>
            )}
            {product.language && (
              <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700 dark:bg-neutral-200 dark:text-neutral-700">
                {LANGUAGE_LABELS[product.language] ?? product.language} (
                {product.language})
              </span>
            )}
            {product.condition && (
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${conditionColor(product.condition)}`}
              >
                {product.condition} · {CONDITION_LABELS[product.condition]}
              </span>
            )}
          </div>

          <h1 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <p className="text-3xl font-bold">{formatPrice(product.price)}</p>
            {outOfStock ? (
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                Sin stock
              </span>
            ) : lowStock ? (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                ¡Últimas {product.stock}!
              </span>
            ) : (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                {product.stock} disponibles
              </span>
            )}
          </div>

          {product.description && (
            <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {product.description}
            </p>
          )}

          {/* Especificaciones */}
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {product.game?.name && (
              <SpecCard
                label="Juego"
                value={`${product.game.emoji} ${product.game.name}`}
              />
            )}
            {product.set_name && <SpecCard label="Set / Expansión" value={product.set_name} />}
            {product.category?.name && (
              <SpecCard label="Categoría" value={product.category.name} />
            )}
            {isCardProduct && product.card_type && (
              <SpecCard label="Rareza" value={product.card_type} />
            )}
            {product.condition && (
              <SpecCard
                label="Condición"
                value={`${product.condition} · ${CONDITION_LABELS[product.condition]}`}
              />
            )}
            {product.language && (
              <SpecCard
                label="Idioma"
                value={`${LANGUAGE_LABELS[product.language] ?? product.language} (${product.language})`}
              />
            )}
          </div>

          {/* CTA */}
          <div className="mt-7">
            <AddToCartButton product={product} disabled={outOfStock} />
          </div>

          {hasWa && (
            <Link
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-6 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-100 sm:w-auto"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M17.47 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.21 5.1 4.5.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35zM12.05 21.79h-.01a9.83 9.83 0 0 1-5-1.37l-.36-.21-3.72.98 1-3.63-.24-.37a9.8 9.8 0 0 1-1.5-5.22c0-5.41 4.4-9.81 9.82-9.81 2.62 0 5.09 1.02 6.94 2.88a9.75 9.75 0 0 1 2.87 6.94c0 5.42-4.4 9.82-9.8 9.82zm8.68-18.5A11.7 11.7 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.6 5.95L.08 24l6.3-1.65a11.87 11.87 0 0 0 5.67 1.44c6.55 0 11.89-5.33 11.89-11.89 0-3.18-1.24-6.16-3.5-8.4z" />
              </svg>
              Consultar por WhatsApp
            </Link>
          )}

          {/* Confianza */}
          <div className="mt-7 grid grid-cols-3 gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-200 dark:bg-neutral-100">
            {[
              { icon: '🚚', label: 'Envío protegido' },
              { icon: '✅', label: 'Cartas verificadas' },
              { icon: '💬', label: 'Pago coordinado' },
            ].map((t) => (
              <div key={t.label} className="text-center">
                <span className="text-lg">{t.icon}</span>
                <p className="mt-1 text-[11px] font-medium leading-tight text-neutral-600 dark:text-neutral-400">
                  {t.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {sameSet.length > 0 && (
        <section className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
                Misma colección
              </p>
              <h2 className="mt-2 font-display text-xl font-bold tracking-tight sm:text-2xl">
                Más de {product.set_name}
              </h2>
            </div>
            {product.set_name && (
              <Link
                href={`/cartas?set=${encodeURIComponent(product.set_name.trim().toLowerCase())}`}
                className="hidden shrink-0 text-sm font-semibold text-indigo-600 transition hover:text-indigo-500 sm:inline-block"
              >
                Ver todo →
              </Link>
            )}
          </div>
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
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
                También te puede interesar
              </p>
              <h2 className="mt-2 font-display text-xl font-bold tracking-tight sm:text-2xl">
                Otras cartas de {product.game?.name}
              </h2>
            </div>
            {product.game && (
              <Link
                href={`/cartas?game=${product.game.slug}`}
                className="hidden shrink-0 text-sm font-semibold text-indigo-600 transition hover:text-indigo-500 sm:inline-block"
              >
                Ver todo →
              </Link>
            )}
          </div>
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
