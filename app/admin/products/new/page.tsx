import { getCategories, getGames } from '@/lib/data'
import ProductForm from '@/components/product-form'

export default async function NewProductPage() {
  const [categories, games] = await Promise.all([getCategories(), getGames()])

  return (
    <div>
      <div>
        <h2 className="font-display text-xl font-bold tracking-tight">
          Nuevo producto
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Completá los datos para sumarlo al catálogo
        </p>
      </div>
      <div className="mt-6">
        <ProductForm
          action="create"
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
          games={games.map((g) => ({ id: g.id, name: g.name, emoji: g.emoji }))}
        />
      </div>
    </div>
  )
}
