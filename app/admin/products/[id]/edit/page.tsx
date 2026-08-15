import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCategories, getGames } from '@/lib/data'
import ProductForm from '@/components/product-form'
import { Icon, PageHeader, btnSecondary } from '@/components/admin-ui'

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
      <PageHeader
        icon="pencil"
        title="Editar producto"
        description="Actualizá los datos del producto"
      >
        <Link href="/admin" className={btnSecondary}>
          <Icon name="arrowLeft" className="h-4 w-4" />
          Volver
        </Link>
      </PageHeader>
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
