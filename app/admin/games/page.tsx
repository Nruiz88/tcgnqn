import { getGames } from '@/lib/data'
import { createGame, updateGame, deleteGame } from '@/lib/actions'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

export default async function AdminGamesPage() {
  const games = await getGames()

  return (
    <div>
      <div>
        <h2 className="font-display text-xl font-bold tracking-tight">
          Juegos TCG
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Los juegos que aparecen en la tienda y en el marquee
        </p>
      </div>

      <form
        action={async (formData: FormData) => {
          'use server'
          await createGame(formData)
          revalidatePath('/admin/games')
        }}
        className="mt-6 rounded-2xl border border-neutral-200 bg-surface p-5"
      >
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-16">
            <label className="text-xs font-medium text-neutral-500">Emoji</label>
            <input
              name="emoji"
              placeholder="⚡"
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div className="min-w-40 flex-1">
            <label className="text-xs font-medium text-neutral-500">Nombre</label>
            <input
              name="name"
              required
              placeholder="Ej: Pokémon TCG"
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div className="w-56">
            <label className="text-xs font-medium text-neutral-500">
              Color gradiente
            </label>
            <input
              name="color"
              placeholder="from-amber-400 to-yellow-500"
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
        {games.length === 0 && (
          <p className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-sm text-neutral-500">
            No hay juegos todavía.
          </p>
        )}
        {games.map((g) => (
          <form
            key={g.id}
            action={async (formData: FormData) => {
              'use server'
              await updateGame(g.id, formData)
              revalidatePath('/admin/games')
            }}
            className="flex flex-wrap items-center gap-3 rounded-2xl border border-neutral-200 bg-surface p-4 transition hover:border-neutral-300"
          >
            <div className="w-14">
              <input
                name="emoji"
                defaultValue={g.emoji ?? ''}
                className="w-full rounded-lg border border-neutral-300 px-2 py-1.5 text-sm"
              />
            </div>
            <div className="min-w-40 flex-1">
              <input
                name="name"
                defaultValue={g.name}
                required
                className="w-full rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium"
              />
              <p className="mt-1 text-xs text-neutral-400">/{g.slug}</p>
            </div>
            <div className="w-56">
              <input
                name="color"
                defaultValue={g.color ?? ''}
                placeholder="from-... to-..."
                className="w-full rounded-lg border border-neutral-300 px-2 py-1.5 text-sm"
              />
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
                  await deleteGame(g.id)
                  revalidatePath('/admin/games')
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