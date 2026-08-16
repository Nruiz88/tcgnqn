import Link from 'next/link'
import { getCategories, getGames } from '@/lib/data'
import ProductForm from '@/components/product-form'
import { Icon, PageHeader, btnSecondary } from '@/components/admin-ui'

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>
}) {
  const [{ cat }, categories, games] = await Promise.all([
    searchParams,
    getCategories(),
    getGames(),
  ])

  const defaultCategoryId = categories.find((c) => c.id === cat)?.id

  return (
    <div>
      <PageHeader
        icon="plus"
        title="Nuevo producto"
        description="Completá los datos para sumarlo al catálogo"
      >
        <Link href="/admin" className={btnSecondary}>
          <Icon name="arrowLeft" className="h-4 w-4" />
          Volver
        </Link>
      </PageHeader>
      <div className="mt-6">
        <ProductForm
          action="create"
          defaultCategoryId={defaultCategoryId}
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
          games={games.map((g) => ({ id: g.id, name: g.name, emoji: g.emoji }))}
        />
      </div>
    </div>
  )
}
