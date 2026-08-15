import Link from 'next/link'
import { getAllProducts, getCategories } from '@/lib/data'
import { formatPrice } from '@/lib/format'
import { toggleProduct, deleteProduct } from '@/lib/actions'
import { revalidatePath } from 'next/cache'
import { CONDITION_LABELS, LANGUAGE_LABELS, conditionColor } from '@/lib/cards'

export const dynamic = 'force-dynamic'

export default async function AdminCartasPage() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ])
  const cartasId = categories.find((c) => c.slug === 'cartas')?.id
  const cards = products.filter((p) => p.category?.slug === 'cartas')

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight">
            Cartas individuales
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            {cards.length} cartas en la sección Singles
          </p>
        </div>
        <Link
          href={cartasId ? '/admin/cartas/new' : '/admin/categories'}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          + Nueva carta
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {cards.length === 0 && (
          <p className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-sm text-neutral-500">
            No hay cartas cargadas. Creá la primera.
          </p>
        )}
        {cards.map((card) => (
          <div
            key={card.id}
            className="flex flex-wrap items-center gap-4 rounded-2xl border border-neutral-200 bg-surface p-4 transition hover:border-neutral-300"
          >
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
              {card.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={card.image_url}
                  alt={card.name}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{card.name}</p>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                {card.game?.name && (
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600">
                    {card.game.emoji} {card.game.name}
                  </span>
                )}
                {card.condition && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${conditionColor(card.condition)}`}
                    title={CONDITION_LABELS[card.condition]}
                  >
                    {card.condition}
                  </span>
                )}
                {card.language && (
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600">
                    {card.language} · {LANGUAGE_LABELS[card.language]}
                  </span>
                )}
                {card.card_type && (
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600">
                    {card.card_type}
                  </span>
                )}
                {card.set_name && (
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600">
                    {card.set_name}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-neutral-500">
                {formatPrice(card.price)} · Stock: {card.stock}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {!card.active && (
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                  Oculto
                </span>
              )}
              <form
                action={async () => {
                  'use server'
                  await toggleProduct(card.id, !card.active)
                  revalidatePath('/admin/cartas')
                }}
              >
                <button className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium transition hover:bg-neutral-100">
                  {card.active ? 'Ocultar' : 'Publicar'}
                </button>
              </form>
              <Link
                href={`/admin/cartas/${card.id}/edit`}
                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium transition hover:bg-neutral-100"
              >
                Editar
              </Link>
              <form
                action={async () => {
                  'use server'
                  await deleteProduct(card.id)
                  revalidatePath('/admin/cartas')
                }}
              >
                <button className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40">
                  Borrar
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}