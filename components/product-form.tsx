'use client'

import { useRouter } from 'next/navigation'
import { createProduct, updateProduct } from '@/lib/actions'

export default function ProductForm({
  initial,
  action,
  categories,
  games,
}: {
  initial?: {
    id: string
    name: string
    description: string | null
    price: number
    stock: number
    image_url: string | null
    category_id: string | null
    game_id: string | null
  }
  action: 'create' | 'update'
  categories: { id: string; name: string }[]
  games: { id: string; name: string; emoji: string | null }[]
}) {
  const router = useRouter()

  return (
    <form
      action={async (formData: FormData) => {
        const result =
          action === 'create'
            ? await createProduct(formData)
            : await updateProduct(initial!.id, formData)
        if (result?.error) {
          alert(result.error)
          return
        }
        router.push('/admin')
        router.refresh()
      }}
      className="max-w-lg space-y-4"
    >
      <div>
        <label className="text-sm font-medium">Nombre</label>
        <input
          name="name"
          required
          defaultValue={initial?.name}
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Descripción</label>
        <textarea
          name="description"
          rows={4}
          defaultValue={initial?.description ?? ''}
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Precio (ARS)</label>
          <input
            type="number"
            name="price"
            required
            min={0}
            defaultValue={initial?.price ?? 0}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Stock</label>
          <input
            type="number"
            name="stock"
            required
            min={0}
            defaultValue={initial?.stock ?? 0}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">URL de imagen</label>
        <input
          name="image_url"
          placeholder="https://..."
          defaultValue={initial?.image_url ?? ''}
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Categoría</label>
        <select
          name="category_id"
          defaultValue={initial?.category_id ?? ''}
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        >
          <option value="">Sin categoría</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium">Juego</label>
        <select
          name="game_id"
          defaultValue={initial?.game_id ?? ''}
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        >
          <option value="">Sin juego</option>
          {games.map((g) => (
            <option key={g.id} value={g.id}>
              {g.emoji ? `${g.emoji} ` : ''}
              {g.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="rounded-md bg-black px-6 py-3 text-sm font-semibold text-white"
      >
        {action === 'create' ? 'Crear producto' : 'Guardar cambios'}
      </button>
    </form>
  )
}
