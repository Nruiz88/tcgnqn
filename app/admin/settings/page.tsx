import { getSiteSettings } from '@/lib/data'
import { updateSiteSettings } from '@/lib/actions'
import { revalidatePath } from 'next/cache'
import type { SocialKey } from '@/lib/types'

export const dynamic = 'force-dynamic'

const socialFields: { key: SocialKey; label: string; placeholder: string }[] = [
  {
    key: 'instagram',
    label: 'Instagram',
    placeholder: 'https://instagram.com/tusuario',
  },
  {
    key: 'facebook',
    label: 'Facebook',
    placeholder: 'https://facebook.com/tupagina',
  },
  { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@usuario' },
  { key: 'x', label: 'X (Twitter)', placeholder: 'https://x.com/usuario' },
  {
    key: 'youtube',
    label: 'YouTube',
    placeholder: 'https://youtube.com/@canal',
  },
  { key: 'discord', label: 'Discord', placeholder: 'https://discord.gg/invitacion' },
]

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings()

  return (
    <div>
      <div>
        <h2 className="font-display text-xl font-bold tracking-tight">
          Redes sociales
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Cargá los links de tus redes. Los que estén completos aparecen en el
          footer de la tienda.
        </p>
      </div>

      <form
        action={async (formData: FormData) => {
          'use server'
          await updateSiteSettings(formData)
          revalidatePath('/admin/settings')
          revalidatePath('/', 'layout')
        }}
        className="mt-6 max-w-xl rounded-2xl border border-neutral-200 bg-surface p-5"
      >
        <div className="space-y-4">
          {socialFields.map((f) => (
            <div key={f.key}>
              <label className="text-xs font-medium text-neutral-500">
                {f.label}
              </label>
              <input
                name={f.key}
                defaultValue={settings?.[f.key] ?? ''}
                placeholder={f.placeholder}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-neutral-400">
          Dejá un campo vacío para no mostrar esa red.
        </p>
        <button
          type="submit"
          className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Guardar redes
        </button>
      </form>
    </div>
  )
}