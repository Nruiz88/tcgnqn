import { getSiteSettings } from '@/lib/data'
import { updateSiteSettings } from '@/lib/actions'
import { revalidatePath } from 'next/cache'
import type { SocialKey } from '@/lib/types'
import {
  Icon,
  PageHeader,
  SectionCard,
  labelCls,
  btnPrimary,
} from '@/components/admin-ui'

const socialFields: {
  key: SocialKey
  label: string
  placeholder: string
  color: string
  icon: React.ReactNode
}[] = [
  {
    key: 'instagram',
    label: 'Instagram',
    placeholder: 'https://instagram.com/tusuario',
    color: 'text-pink-500',
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M16 11.37a4 4 0 1 1-7.9 1.26 4 4 0 0 1 7.9-1.26Z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </>
    ),
  },
  {
    key: 'facebook',
    label: 'Facebook',
    placeholder: 'https://facebook.com/tupagina',
    color: 'text-blue-500',
    icon: (
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    ),
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    placeholder: 'https://tiktok.com/@usuario',
    color: 'text-neutral-300',
    icon: <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />,
  },
  {
    key: 'x',
    label: 'X (Twitter)',
    placeholder: 'https://x.com/usuario',
    color: 'text-neutral-400',
    icon: (
      <>
        <line x1="4" y1="4" x2="20" y2="20" />
        <line x1="20" y1="4" x2="4" y2="20" />
      </>
    ),
  },
  {
    key: 'youtube',
    label: 'YouTube',
    placeholder: 'https://youtube.com/@canal',
    color: 'text-red-500',
    icon: (
      <>
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
      </>
    ),
  },
  {
    key: 'discord',
    label: 'Discord',
    placeholder: 'https://discord.gg/invitacion',
    color: 'text-indigo-400',
    icon: <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />,
  },
]

const svgProps = {
  className: 'h-4 w-4',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings()

  return (
    <div>
      <PageHeader
        icon="share"
        title="Redes sociales"
        description="Cargá los links de tus redes. Los que estén completos aparecen en el footer de la tienda."
      />

      <SectionCard title="Links de tus redes">
        <form
          action={async (formData: FormData) => {
            'use server'
            await updateSiteSettings(formData)
            revalidatePath('/admin/settings')
            revalidatePath('/', 'layout')
          }}
          className="space-y-4"
        >
          {socialFields.map((f) => (
            <div key={f.key}>
              <label className={labelCls}>{f.label}</label>
              <div className="relative mt-1">
                <svg
                  {...svgProps}
                  className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${f.color}`}
                >
                  {f.icon}
                </svg>
                <input
                  name={f.key}
                  defaultValue={settings?.[f.key] ?? ''}
                  placeholder={f.placeholder}
                  className="w-full rounded-lg border border-neutral-300 bg-transparent py-2 pl-9 pr-3 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          ))}
          <p className="text-xs text-neutral-400">
            Dejá un campo vacío para no mostrar esa red.
          </p>
          <button type="submit" className={btnPrimary}>
            <Icon name="check" className="h-4 w-4" />
            Guardar redes
          </button>
        </form>
      </SectionCard>
    </div>
  )
}
