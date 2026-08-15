import { getCategories, getGames } from '@/lib/data'
import ProductForm from '@/components/product-form'

export default async function NewProductPage() {
  const [categories, games] = await Promise.all([getCategories(), getGames()])

  return (
    <div>
      <h2 className="text-lg font-semibold">Nuevo producto</h2>
      <div className="mt-4">
        <ProductForm
          action="create"
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
          games={games.map((g) => ({ id: g.id, name: g.name, emoji: g.emoji }))}
        />
      </div>
    </div>
  )
}
