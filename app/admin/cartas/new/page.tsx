import { getCategories, getGames } from '@/lib/data'
import CardForm from '@/components/card-form'

export const dynamic = 'force-dynamic'

export default async function NewCardPage() {
  const [categories, games] = await Promise.all([getCategories(), getGames()])
  const cartasCategoryId = categories.find((c) => c.slug === 'cartas')?.id ?? ''

  return (
    <div>
      <div>
        <h2 className="font-display text-xl font-bold tracking-tight">
          Nueva carta
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Cargá una carta individual con sus datos TCG
        </p>
      </div>
      <div className="mt-6">
        <CardForm
          action="create"
          cartasCategoryId={cartasCategoryId}
          games={games.map((g) => ({ id: g.id, name: g.name, emoji: g.emoji }))}
        />
      </div>
    </div>
  )
}