import { getGames } from '@/lib/data'
import { createGame, updateGame, deleteGame } from '@/lib/actions'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

export default async function AdminGamesPage() {
  const games = await getGames()

  return (
    <div>
      <h2 className="text-lg font-semibold">Juegos TCG</h2>

      <form
        action={async (formData: FormData) => {
          'use server'
          await createGame(formData)
          revalidatePath('/admin/games')
        }}
        className="mt-4 flex max-w-lg items-end gap-3"
      >
        <div className="flex-1">
          <label className="text-sm font-medium">Nombre</label>
          <input
            name="name"
            required
            placeholder="Ej: Pokémon TCG"
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="w-16">
          <label className="text-sm font-medium">Emoji</label>
          <input
            name="emoji"
            placeholder="⚡"
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="w-40">
          <label className="text-sm font-medium">Color gradiente</label>
          <input
            name="color"
            placeholder="from-amber-400 to-yellow-500"
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

      <div className="mt-6 max-w-2xl space-y-3">
        {games.length === 0 && (
          <p className="text-sm text-neutral-500">No hay juegos.</p>
        )}
        {games.map((g) => (
          <form
            key={g.id}
            action={async (formData: FormData) => {
              'use server'
              await updateGame(g.id, formData)
              revalidatePath('/admin/games')
            }}
            className="flex items-end gap-3 rounded-lg border border-neutral-200 p-3"
          >
            <div className="w-16">
              <input
                name="emoji"
                defaultValue={g.emoji ?? ''}
                className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
              />
            </div>
            <div className="flex-1">
              <input
                name="name"
                defaultValue={g.name}
                required
                className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
              />
              <p className="mt-1 text-xs text-neutral-400">/{g.slug}</p>
            </div>
            <div className="w-48">
              <input
                name="color"
                defaultValue={g.color ?? ''}
                placeholder="from-... to-..."
                className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
              />
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
                await deleteGame(g.id)
                revalidatePath('/admin/games')
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
