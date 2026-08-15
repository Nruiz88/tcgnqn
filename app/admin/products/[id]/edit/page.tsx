import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCategories, getGames } from '@/lib/data'
import ProductForm from '@/components/product-form'

export const dynamic = 'force-dynamic'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const [categories, games, { data: product }] = await Promise.all([
    getCategories(),
    getGames(),
    supabase.from('products').select('*').eq('id', id).single(),
  ])
  if (!product) notFound()

  return (
    <div>
      <div>
        <h2 className="font-display text-xl font-bold tracking-tight">
          Editar producto
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Actualizá los datos del producto
        </p>
      </div>
      <div className="mt-6">
        <ProductForm
          action="update"
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
          games={games.map((g) => ({ id: g.id, name: g.name, emoji: g.emoji }))}
          initial={{
            id: product.id,
            name: product.name,
            description: product.description,
            price: Number(product.price),
            stock: product.stock,
            image_url: product.image_url,
            category_id: product.category_id,
            game_id: product.game_id,
          }}
        />
      </div>
    </div>
  )
}
