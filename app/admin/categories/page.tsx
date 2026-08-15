import { getCategories } from '@/lib/data'
import { createCategory, updateCategory, deleteCategory } from '@/lib/actions'
import { revalidatePath } from 'next/cache'
import {
  Icon,
  PageHeader,
  EmptyState,
  SectionCard,
  inputCls,
  labelCls,
  btnPrimary,
  btnSecondary,
  btnDanger,
} from '@/components/admin-ui'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  return (
    <div>
      <PageHeader
        icon="tag"
        title="Categorías"
        description="Agrupá los productos para que se exploren mejor"
      />

      {/* Nueva categoría */}
      <SectionCard title="Nueva categoría" description="El emoji se muestra junto al nombre en la tienda.">
        <form
          action={async (formData: FormData) => {
            'use server'
            await createCategory(formData)
            revalidatePath('/admin/categories')
          }}
          className="flex flex-wrap items-end gap-3"
        >
          <div className="w-20">
            <label className={labelCls}>Emoji</label>
            <input
              name="emoji"
              placeholder="🃏"
              className={`${inputCls} mt-1 text-center`}
            />
          </div>
          <div className="min-w-40 flex-1">
            <label className={labelCls}>Nombre</label>
            <input
              name="name"
              required
              placeholder="Ej: Cartas individuales"
              className={`${inputCls} mt-1`}
            />
          </div>
          <button type="submit" className={btnPrimary}>
            <Icon name="plus" className="h-4 w-4" />
            Crear
          </button>
        </form>
      </SectionCard>

      {/* Listado */}
      <div className="mt-6 space-y-3">
        {categories.length === 0 && (
          <EmptyState
            icon="tag"
            title="No hay categorías todavía"
            description="Creá la primera categoría para organizar tu catálogo."
          />
        )}
        {categories.map((c) => (
          <form
            key={c.id}
            action={async (formData: FormData) => {
              'use server'
              await updateCategory(c.id, formData)
              revalidatePath('/admin/categories')
            }}
            className="flex flex-wrap items-center gap-3 rounded-2xl border border-neutral-200 bg-surface p-4 transition hover:border-neutral-300"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-xl dark:bg-neutral-800/60">
              {c.emoji ?? <Icon name="tag" className="h-5 w-5 text-neutral-400" />}
            </div>
            <div className="min-w-40 flex-1">
              <input
                name="name"
                defaultValue={c.name}
                required
                className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-1.5 text-sm font-medium transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <p className="mt-1 text-xs text-neutral-400">/{c.slug}</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="submit" className={btnSecondary}>
                <Icon name="check" className="h-3.5 w-3.5" />
                Guardar
              </button>
              <button
                title="Borrar categoría"
                formAction={async () => {
                  'use server'
                  await deleteCategory(c.id)
                  revalidatePath('/admin/categories')
                }}
                className={btnDanger}
              >
                <Icon name="trash" className="h-3.5 w-3.5" />
                Borrar
              </button>
            </div>
          </form>
        ))}
      </div>
    </div>
  )
}
