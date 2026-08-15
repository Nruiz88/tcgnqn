import { getCategories } from '@/lib/data'
import { createCategory, updateCategory, deleteCategory } from '@/lib/actions'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  return (
    <div>
      <div>
        <h2 className="font-display text-xl font-bold tracking-tight">
          Categorías
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Agrupá los productos para que se exploren mejor
        </p>
      </div>

      <form
        action={async (formData: FormData) => {
          'use server'
          await createCategory(formData)
          revalidatePath('/admin/categories')
        }}
        className="mt-6 rounded-2xl border border-neutral-200 bg-surface p-5"
      >
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-20">
            <label className="text-xs font-medium text-neutral-500">Emoji</label>
            <input
              name="emoji"
              placeholder="🃏"
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div className="min-w-40 flex-1">
            <label className="text-xs font-medium text-neutral-500">Nombre</label>
            <input
              name="name"
              required
              placeholder="Ej: Cartas individuales"
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            + Crear
          </button>
        </div>
      </form>

      <div className="mt-6 space-y-3">
        {categories.length === 0 && (
          <p className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-sm text-neutral-500">
            No hay categorías todavía.
          </p>
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
            <div className="w-16">
              <input
                name="emoji"
                defaultValue={c.emoji ?? ''}
                className="w-full rounded-lg border border-neutral-300 px-2 py-1.5 text-sm"
              />
            </div>
            <div className="min-w-40 flex-1">
              <input
                name="name"
                defaultValue={c.name}
                required
                className="w-full rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium"
              />
              <p className="mt-1 text-xs text-neutral-400">/{c.slug}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium transition hover:bg-neutral-100"
              >
                Guardar
              </button>
              <button
                formAction={async () => {
                  'use server'
                  await deleteCategory(c.id)
                  revalidatePath('/admin/categories')
                }}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
              >
                Borrar
              </button>
            </div>
          </form>
        ))}
      </div>
    </div>
  )
}