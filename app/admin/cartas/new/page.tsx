import Link from 'next/link'
import { getCategories, getGames } from '@/lib/data'
import CardForm from '@/components/card-form'
import { Icon, PageHeader, btnSecondary } from '@/components/admin-ui'

export const dynamic = 'force-dynamic'

export default async function NewCardPage() {
  const [categories, games] = await Promise.all([getCategories(), getGames()])
  const cartasCategoryId = categories.find((c) => c.slug === 'cartas')?.id ?? ''

  return (
    <div>
      <PageHeader
        icon="plus"
        title="Nueva carta"
        description="Cargá una carta individual con sus datos TCG"
      >
        <Link href="/admin/cartas" className={btnSecondary}>
          <Icon name="arrowLeft" className="h-4 w-4" />
          Volver
        </Link>
      </PageHeader>
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
