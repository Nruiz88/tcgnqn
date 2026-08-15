import { getSiteSettings } from '@/lib/data'
import { getMercadoPagoCredentials } from '@/lib/mercadopago'
import { updateMercadoPagoSettings, updateSiteSettings } from '@/lib/actions'
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
  const mp = await getMercadoPagoCredentials()
  const mpTokenHint = mp?.accessToken
    ? `Guardado: ${mp.accessToken.slice(0, 12)}…${mp.accessToken.slice(-4)}`
    : null

  return (
    <div>
      <PageHeader
        icon="share"
        title="Configuración"
        description="Redes sociales del footer y medios de pago del checkout."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Redes sociales">
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

        <SectionCard title="Mercado Pago">
          <form
            action={async (formData: FormData) => {
              'use server'
              await updateMercadoPagoSettings(formData)
              revalidatePath('/admin/settings')
              revalidatePath('/checkout')
            }}
            className="space-y-4"
          >
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-neutral-200 p-3">
              <input
                type="checkbox"
                name="mercadopago_enabled"
                defaultChecked={!!settings?.mercadopago_enabled}
                className="mt-1 h-4 w-4"
              />
              <span>
                <span className="block text-sm font-medium">
                  Activar pago con Mercado Pago
                </span>
                <span className="block text-xs text-neutral-500">
                  Aparece como método de pago en el checkout. Requiere el access
                  token de abajo.
                </span>
              </span>
            </label>

            <div>
              <label className={labelCls}>
                Access token{' '}
                <span className="text-xs font-normal text-neutral-400">
                  (empieza con APP_USR- o TEST-)
                </span>
              </label>
              <div className="relative mt-1">
                <svg
                  {...svgProps}
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  name="mercadopago_access_token"
                  type="password"
                  placeholder={
                    mpTokenHint ? `${mpTokenHint} — dejalo vacío para mantener` : 'APP_USR-...'
                  }
                  className="w-full rounded-lg border border-neutral-300 bg-transparent py-2 pl-9 pr-3 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>
                Public key{' '}
                <span className="text-xs font-normal text-neutral-400">
                  (opcional, para el botón de pago embebido)
                </span>
              </label>
              <input
                name="mercadopago_public_key"
                placeholder={mp?.publicKey ? 'Dejalo vacío para mantener' : 'TEST-... o APP_USR-...'}
                className="mt-1 w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="rounded-lg bg-neutral-50 px-3 py-2 text-xs text-neutral-500">
              <p>
                <strong className="text-neutral-700">Modo prueba:</strong> con
                un token que empiece en <code className="font-mono">TEST-</code>{' '}
                el checkout usa el sandbox de Mercado Pago (tarjetas de prueba)
                y no mueve dinero real.
              </p>
              <p className="mt-1">
                ¿No tenés credenciales? Entrá a tu cuenta de Mercado Pago →
                Desarrollo → Credenciales, y copiá el <em>Access Token</em>.
              </p>
            </div>

            <button type="submit" className={btnPrimary}>
              <Icon name="check" className="h-4 w-4" />
              Guardar Mercado Pago
            </button>
          </form>
        </SectionCard>
      </div>
    </div>
  )
}
