import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCategories, getGames } from '@/lib/data'
import CardForm from '@/components/card-form'

export const dynamic = 'force-dynamic'

export default async function EditCardPage({
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

  const cartasCategoryId = categories.find((c) => c.slug === 'cartas')?.id ?? ''

  return (
    <div>
      <div>
        <h2 className="font-display text-xl font-bold tracking-tight">
          Editar carta
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Actualizá los datos de la carta
        </p>
      </div>
      <div className="mt-6">
        <CardForm
          action="update"
          cartasCategoryId={cartasCategoryId}
          games={games.map((g) => ({ id: g.id, name: g.name, emoji: g.emoji }))}
          initial={{
            id: product.id,
            name: product.name,
            description: product.description,
            price: Number(product.price),
            stock: product.stock,
            image_url: product.image_url,
            game_id: product.game_id,
            condition: product.condition,
            language: product.language,
            set_name: product.set_name,
            card_type: product.card_type,
          }}
        />
      </div>
    </div>
  )
}