import Link from 'next/link'
import Image from 'next/image'
import { getGames, getSiteSettings } from '@/lib/data'
import { isEnabled } from '@/lib/modules'
import { buildWhatsappLink, whatsappNumber } from '@/lib/whatsapp'
import type { SocialKey } from '@/lib/types'

const headCls = 'text-[11px] font-semibold uppercase tracking-widest text-neutral-500'
const linkCls =
  'group inline-flex items-center gap-1 text-sm text-neutral-500 transition hover:text-white'

const trust = [
  {
    icon: '🚚',
    title: 'Envíos protegidos',
    desc: 'Toploaders y sobres acolchados',
    box: 'from-indigo-500/25 to-violet-500/10 ring-indigo-500/30 shadow-indigo-500/20',
  },
  {
    icon: '💬',
    title: 'Pago coordinado',
    desc: 'WhatsApp o transferencia',
    box: 'from-violet-500/25 to-fuchsia-500/10 ring-violet-500/30 shadow-violet-500/20',
  },
  {
    icon: '✅',
    title: 'Cartas originales',
    desc: 'Verificadas una por una',
    box: 'from-emerald-500/25 to-teal-500/10 ring-emerald-500/30 shadow-emerald-500/20',
  },
  {
    icon: '🛡️',
    title: 'Cambios en 48 hs',
    desc: 'Si algo no te convence',
    box: 'from-amber-500/25 to-orange-500/10 ring-amber-500/30 shadow-amber-500/20',
  },
]

const strokeIcon = (path: React.ReactNode) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    {path}
  </svg>
)

const fillIcon = (path: React.ReactNode) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    {path}
  </svg>
)

const socialMeta: { key: SocialKey; label: string; icon: React.ReactNode }[] = [
  {
    key: 'instagram',
    label: 'Instagram',
    icon: strokeIcon(
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </>,
    ),
  },
  {
    key: 'facebook',
    label: 'Facebook',
    icon: strokeIcon(
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
    ),
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    icon: fillIcon(
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />,
    ),
  },
  {
    key: 'x',
    label: 'X',
    icon: fillIcon(
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />,
    ),
  },
  {
    key: 'youtube',
    label: 'YouTube',
    icon: fillIcon(
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />,
    ),
  },
  {
    key: 'discord',
    label: 'Discord',
    icon: fillIcon(
      <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.865-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.319 13.58.099 18.058a.082.082 0 0 0 .031.056c2.053 1.507 4.041 2.422 5.993 3.029a.078.078 0 0 0 .084-.027c.462-.63.873-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 12.13 12.13 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .078-.011c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.291a.077.077 0 0 1-.007.128c-.598.343-1.22.645-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028c1.962-.607 3.95-1.522 6.003-3.03a.077.077 0 0 0 .031-.055c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />,
    ),
  },
]

export default async function Footer() {
  const [games, settings] = await Promise.all([
    getGames(),
    getSiteSettings(),
  ])
  const hasWa = Boolean(whatsappNumber())
  const wa = buildWhatsappLink(
    '¡Hola TCG NQN! Quería hacer una consulta sobre un producto.',
  )

  const socials = socialMeta
    .map((s) => ({ ...s, href: settings?.[s.key] ?? '' }))
    .filter((s) => s.href)

  const shopLinks = [
    { href: '/', label: 'Tienda' },
    { href: '/cartas', label: 'Cartas' },
    { href: '/buscar', label: 'Buscar' },
  ]
  if (isEnabled('wishlist')) shopLinks.push({ href: '/favoritos', label: 'Favoritos' })

  const helpLinks = [
    { href: '/envios', label: 'Envíos y devoluciones' },
    { href: '/terminos', label: 'Términos y condiciones' },
    { href: '/privacidad', label: 'Política de privacidad' },
    { href: '/contacto', label: 'Contacto' },
  ]

  const methods = ['Efectivo', 'Transferencia', 'WhatsApp']

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#0d0f14] text-white">
      {/* Glow decorativo superior */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(55%_100%_at_50%_0%,rgba(99,102,241,0.14),transparent)]" />
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/80 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4">
        {/* Confianza */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-6 border-b border-white/10 py-10 sm:grid-cols-4">
          {trust.map((t) => (
            <div key={t.title} className="group flex items-start gap-3">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-lg shadow-lg ring-1 ring-inset transition-transform duration-300 group-hover:scale-110 ${t.box}`}
              >
                {t.icon}
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{t.title}</p>
                <p className="mt-0.5 text-xs text-neutral-500">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Columnas */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-12 sm:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo.webp"
                alt="TCG NQN"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover ring-1 ring-white/20"
              />
              <span className="font-display text-xl font-bold tracking-tight text-white">
                TCG NQN
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-500">
              Cartas individuales, boosters y accesorios coleccionables en
              Neuquén. Elegí tus cartas, dejá tu pedido y lo coordinamos por
              WhatsApp.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-400 hover:to-fuchsia-400"
              >
                ¿Buscás una carta puntual?
              </Link>
              {hasWa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
                >
                  <span className="text-green-400">WhatsApp</span>
                </a>
              )}
            </div>
          </div>

          <div>
            <p className={headCls}>Tienda</p>
            <ul className="mt-4 space-y-3">
              {shopLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkCls}>
                    {l.label}
                    <span className="opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={headCls}>Juegos</p>
            <ul className="mt-4 space-y-3">
              {games.map((g) => (
                <li key={g.id}>
                  <Link href={`/cartas?game=${g.slug}`} className={linkCls}>
                    {g.emoji && <span className="text-sm">{g.emoji}</span>}
                    {g.name}
                    <span className="opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={headCls}>Ayuda</p>
            <ul className="mt-4 space-y-3">
              {helpLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkCls}>
                    {l.label}
                    <span className="opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={headCls}>Contacto</p>
            <ul className="mt-4 space-y-3 text-sm text-neutral-500">
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>Neuquén, Argentina</span>
              </li>
              <li className="flex items-start gap-2">
                <span>🕑</span>
                <span>Lun a Sáb · 10 a 20 hs</span>
              </li>
              {hasWa && (
                <li>
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
                  >
                    +549 WhatsApp
                  </a>
                </li>
              )}
              {socials.length > 0 && (
                <li>
                  <p className={headCls}>Redes</p>
                  <div className="mt-3 flex items-center gap-2">
                    {socials.map((s) => (
                      <a
                        key={s.key}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-neutral-500 transition hover:border-white/40 hover:text-white"
                      >
                        {s.icon}
                      </a>
                    ))}
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 sm:flex-row">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} TCG NQN · Neuquén, Argentina · Todos los
            derechos reservados
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-neutral-500">Medios de pago:</span>
            {methods.map((m) => (
              <span
                key={m}
                className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-medium text-neutral-500"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
