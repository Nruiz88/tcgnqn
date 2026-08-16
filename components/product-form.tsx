'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createProduct, updateProduct } from '@/lib/actions'
import {
  Icon,
  inputCls,
  labelCls,
  btnPrimary,
  btnSecondary,
  type IconName,
} from '@/components/admin-ui'

function Section({
  icon,
  title,
  children,
}: {
  icon: IconName
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="border-b border-neutral-100 pb-6 last:border-0 last:pb-0 dark:border-neutral-800/60">
      <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
        <Icon name={icon} className="h-3.5 w-3.5" />
        {title}
      </h3>
      <div className="mt-4">{children}</div>
    </section>
  )
}

export default function ProductForm({
  initial,
  action,
  categories,
  games,
  defaultCategoryId,
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
  defaultCategoryId?: string | null
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
      className="max-w-2xl space-y-6 rounded-2xl border border-neutral-200 bg-surface p-6"
    >
      <Section icon="info" title="Información básica">
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Nombre</label>
            <input
              name="name"
              required
              defaultValue={initial?.name}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Descripción</label>
            <textarea
              name="description"
              rows={4}
              defaultValue={initial?.description ?? ''}
              className={inputCls}
            />
          </div>
        </div>
      </Section>

      <Section icon="dollar" title="Precio y stock">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Precio (ARS)</label>
            <div className="relative mt-1">
              <Icon
                name="dollar"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
              />
              <input
                type="number"
                name="price"
                required
                min={0}
                defaultValue={initial?.price ?? 0}
                className={`${inputCls} pl-9`}
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Stock</label>
            <input
              type="number"
              name="stock"
              required
              min={0}
              defaultValue={initial?.stock ?? 0}
              className={inputCls}
            />
          </div>
        </div>
      </Section>

      <Section icon="image" title="Imagen">
        <div>
          <label className={labelCls}>URL de imagen</label>
          <div className="relative mt-1">
            <Icon
              name="image"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
            />
            <input
              name="image_url"
              placeholder="https://..."
              defaultValue={initial?.image_url ?? ''}
              className={`${inputCls} pl-9`}
            />
          </div>
          <p className="mt-1.5 text-xs text-neutral-400">
            Pegá una URL directa a la imagen del producto.
          </p>
        </div>
      </Section>

      <Section icon="folder" title="Organización">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Categoría</label>
            <select
              name="category_id"
              defaultValue={initial?.category_id ?? defaultCategoryId ?? ''}
              className={inputCls}
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
            <label className={labelCls}>Juego</label>
            <select
              name="game_id"
              defaultValue={initial?.game_id ?? ''}
              className={inputCls}
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
        </div>
      </Section>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className={btnPrimary}>
          <Icon name={action === 'create' ? 'plus' : 'check'} className="h-4 w-4" />
          {action === 'create' ? 'Crear producto' : 'Guardar cambios'}
        </button>
        <Link href="/admin" className={btnSecondary}>
          <Icon name="x" className="h-3.5 w-3.5" />
          Cancelar
        </Link>
      </div>
    </form>
  )
}
