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
      <h2 className="text-lg font-semibold">Editar producto</h2>
      <div className="mt-4">
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
