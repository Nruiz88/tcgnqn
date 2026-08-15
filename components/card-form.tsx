'use client'

import { useRouter } from 'next/navigation'
import { createProduct, updateProduct } from '@/lib/actions'
import { CONDITIONS, CONDITION_LABELS, LANGUAGES, LANGUAGE_LABELS, CARD_TYPES } from '@/lib/cards'
import { ALL_POKEMON_SETS } from '@/lib/pokemon-sets'

const inputCls =
  'mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none'
const labelCls = 'text-xs font-medium text-neutral-500'

type CardInitial = {
  id: string
  name: string
  description: string | null
  price: number
  stock: number
  image_url: string | null
  game_id: string | null
  condition: string | null
  language: string | null
  set_name: string | null
  card_type: string | null
}

export default function CardForm({
  initial,
  action,
  cartasCategoryId,
  games,
}: {
  initial?: CardInitial
  action: 'create' | 'update'
  cartasCategoryId: string
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
        router.push('/admin/cartas')
        router.refresh()
      }}
      className="max-w-lg space-y-5 rounded-2xl border border-neutral-200 bg-surface p-6"
    >
      <input type="hidden" name="category_id" value={cartasCategoryId} />

      <div>
        <label className={labelCls}>Nombre de la carta</label>
        <input
          name="name"
          required
          placeholder="Charizard V (Evoluciones Brillantes)"
          defaultValue={initial?.name}
          className={inputCls}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
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
        <div>
          <label className={labelCls}>Set / Expansión</label>
          <input
            name="set_name"
            list="pokemon-sets"
            placeholder="Prismatic Evolutions"
            defaultValue={initial?.set_name ?? ''}
            className={inputCls}
          />
          <datalist id="pokemon-sets">
            {ALL_POKEMON_SETS.map((s) => (
              <option key={s.code} value={s.name} />
            ))}
          </datalist>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>Condición</label>
          <select
            name="condition"
            defaultValue={initial?.condition ?? ''}
            className={inputCls}
          >
            <option value="">—</option>
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c} · {CONDITION_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Idioma</label>
          <select
            name="language"
            defaultValue={initial?.language ?? ''}
            className={inputCls}
          >
            <option value="">—</option>
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l} · {LANGUAGE_LABELS[l]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Rareza</label>
          <select
            name="card_type"
            defaultValue={initial?.card_type ?? ''}
            className={inputCls}
          >
            <option value="">—</option>
            {CARD_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Precio (ARS)</label>
          <input
            type="number"
            name="price"
            required
            min={0}
            defaultValue={initial?.price ?? 0}
            className={inputCls}
          />
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
      <div>
        <label className={labelCls}>URL de imagen</label>
        <input
          name="image_url"
          placeholder="https://..."
          defaultValue={initial?.image_url ?? ''}
          className={inputCls}
        />
      </div>
      <div>
        <label className={labelCls}>Descripción</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={initial?.description ?? ''}
          className={inputCls}
        />
      </div>
      <button
        type="submit"
        className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        {action === 'create' ? 'Crear carta' : 'Guardar cambios'}
      </button>
    </form>
  )
}