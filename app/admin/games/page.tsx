import { getGames } from '@/lib/data'
import { createGame, updateGame, deleteGame } from '@/lib/actions'
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
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-xl dark:bg-neutral-800/60">
            {emoji ?? <Icon name="layers" className="h-6 w-6 text-neutral-400" />}
          </span>
        )}
        <div className="min-w-40 flex-1 space-y-2">
          <input
            type="file"
            name="image"
            accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
            className="block w-full text-sm text-neutral-500 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-neutral-700 hover:file:bg-neutral-200 dark:file:bg-neutral-800 dark:file:text-neutral-300"
          />
          <input
            name="image_url"
            defaultValue={imageUrl ?? ''}
            placeholder="o pegá una URL https://..."
            className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-1.5 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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
      <PageHeader
        icon="layers"
        title="Juegos TCG"
        description="Los juegos que aparecen en la tienda y en el marquee"
      />

      {/* Nuevo juego */}
      <SectionCard
        title="Nuevo juego"
        description="Podés subir una imagen o pegar una URL."
      >
        <form
          action={async (formData: FormData) => {
            'use server'
            await createGame(formData)
            revalidatePath('/admin/games')
            revalidatePath('/', 'layout')
          }}
          className="grid gap-4 sm:grid-cols-2"
        >
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
          <div className="sm:col-span-2">
            <button type="submit" className={btnPrimary}>
              <Icon name="plus" className="h-4 w-4" />
              Crear
            </button>
          </div>
        </form>
      </SectionCard>

      {/* Listado */}
      <div className="mt-6 space-y-3">
        {games.length === 0 && (
          <EmptyState
            icon="layers"
            title="No hay juegos todavía"
            description="Creá el primer juego para que aparezca en la tienda."
          />
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
            className="rounded-2xl border border-neutral-200 bg-surface p-5 transition hover:border-neutral-300"
          >
            <div className="flex items-start gap-4">
              {g.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={g.image_url}
                  alt={g.name}
                  className="h-16 w-16 shrink-0 rounded-xl border border-neutral-200 object-cover"
                />
              ) : (
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-2xl dark:bg-neutral-800/60">
                  {g.emoji ?? <Icon name="layers" className="h-7 w-7 text-neutral-400" />}
                </span>
              )}
              <div className="min-w-0 flex-1">
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
                    <ImageInput
                      name={g.name}
                      emoji={g.emoji}
                      imageUrl={g.image_url}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-end gap-2 border-t border-neutral-200 pt-4">
              <button type="submit" className={btnSecondary}>
                <Icon name="check" className="h-3.5 w-3.5" />
                Guardar
              </button>
              <button
                title="Borrar juego"
                formAction={async () => {
                  'use server'
                  await deleteGame(g.id)
                  revalidatePath('/admin/games')
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
