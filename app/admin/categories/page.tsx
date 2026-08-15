import { getCategories } from '@/lib/data'
import { createCategory, updateCategory, deleteCategory } from '@/lib/actions'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  return (
    <div>
      <h2 className="text-lg font-semibold">Categorías</h2>

      <form
        action={async (formData: FormData) => {
          'use server'
          await createCategory(formData)
          revalidatePath('/admin/categories')
        }}
        className="mt-4 flex max-w-lg items-end gap-3"
      >
        <div className="flex-1">
          <label className="text-sm font-medium">Nombre</label>
          <input
            name="name"
            required
            placeholder="Ej: Cartas individuales"
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="w-20">
          <label className="text-sm font-medium">Emoji</label>
          <input
            name="emoji"
            placeholder="🃏"
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white"
        >
          Crear
        </button>
      </form>

      <div className="mt-6 max-w-lg space-y-3">
        {categories.length === 0 && (
          <p className="text-sm text-neutral-500">No hay categorías.</p>
        )}
        {categories.map((c) => (
          <form
            key={c.id}
            action={async (formData: FormData) => {
              'use server'
              await updateCategory(c.id, formData)
              revalidatePath('/admin/categories')
            }}
            className="flex items-end gap-3 rounded-lg border border-neutral-200 p-3"
          >
            <div className="w-20">
              <input
                name="emoji"
                defaultValue={c.emoji ?? ''}
                className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
              />
            </div>
            <div className="flex-1">
              <input
                name="name"
                defaultValue={c.name}
                required
                className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
              />
              <p className="mt-1 text-xs text-neutral-400">/{c.slug}</p>
            </div>
            <button
              type="submit"
              className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-100"
            >
              Guardar
            </button>
            <button
              formAction={async () => {
                'use server'
                await deleteCategory(c.id)
                revalidatePath('/admin/categories')
              }}
              className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
            >
              Borrar
            </button>
          </form>
        ))}
      </div>
    </div>
  )
}
