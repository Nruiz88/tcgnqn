import { getGames } from '@/lib/data'
import { createGame, updateGame, deleteGame } from '@/lib/actions'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

const inputCls =
  'mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none'
const labelCls = 'text-xs font-medium text-neutral-500'

function ImageInput({
  name,
  emoji,
  imageUrl,
}: {
  name: string
  emoji?: string | null
  imageUrl?: string | null
}) {
  return (
    <div>
      <label className={labelCls}>Imagen</label>
      <div className="mt-1 flex flex-wrap items-center gap-3">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={name}
            className="h-14 w-14 shrink-0 rounded-xl border border-neutral-200 object-cover"
          />
        ) : (
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-xl">
            {emoji ?? '🖼️'}
          </span>
        )}
        <div className="min-w-40 flex-1 space-y-2">
          <input
            type="file"
            name="image"
            accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
            className="block w-full text-sm text-neutral-500 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-neutral-700 hover:file:bg-neutral-200"
          />
          <input
            name="image_url"
            defaultValue={imageUrl ?? ''}
            placeholder="o pegá una URL https://..."
            className="w-full rounded-lg border border-neutral-300 px-3 py-1.5 text-sm"
          />
        </div>
      </div>
    </div>
  )
}

export default async function AdminGamesPage() {
  const games = await getGames()

  return (
    <div>
      <div>
        <h2 className="font-display text-xl font-bold tracking-tight">
          Juegos TCG
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Los juegos que aparecen en la tienda y en el marquee. Podés subir una
          imagen o pegar una URL.
        </p>
      </div>

      <form
        action={async (formData: FormData) => {
          'use server'
          await createGame(formData)
          revalidatePath('/admin/games')
          revalidatePath('/', 'layout')
        }}
        className="mt-6 rounded-2xl border border-neutral-200 bg-surface p-5"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Emoji</label>
            <input name="emoji" placeholder="⚡" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Nombre</label>
            <input
              name="name"
              required
              placeholder="Ej: Pokémon TCG"
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Color gradiente</label>
            <input
              name="color"
              placeholder="from-amber-400 to-yellow-500"
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-2">
            <ImageInput name="Nuevo juego" />
          </div>
        </div>
        <button
          type="submit"
          className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          + Crear
        </button>
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
              revalidatePath('/', 'layout')
            }}
            className="rounded-2xl border border-neutral-200 bg-surface p-4 transition hover:border-neutral-300"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Emoji</label>
                <input
                  name="emoji"
                  defaultValue={g.emoji ?? ''}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Nombre</label>
                <input
                  name="name"
                  defaultValue={g.name}
                  required
                  className={inputCls}
                />
                <p className="mt-1 text-xs text-neutral-400">/{g.slug}</p>
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Color gradiente</label>
                <input
                  name="color"
                  defaultValue={g.color ?? ''}
                  placeholder="from-... to-..."
                  className={inputCls}
                />
              </div>
              <div className="sm:col-span-2">
                <ImageInput name={g.name} emoji={g.emoji} imageUrl={g.image_url} />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
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