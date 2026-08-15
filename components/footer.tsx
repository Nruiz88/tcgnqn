import Link from 'next/link'
import Image from 'next/image'
import { getGames } from '@/lib/data'
import { isEnabled } from '@/lib/modules'
import { buildWhatsappLink, whatsappNumber } from '@/lib/whatsapp'

const headCls = 'text-xs font-semibold uppercase tracking-widest text-neutral-400'
const linkCls =
  'group inline-flex items-center gap-1 text-sm text-neutral-500 transition hover:text-neutral-900'

const trust = [
  {
    icon: '🚚',
    title: 'Envíos protegidos',
    desc: 'Toploaders y sobres acolchados',
  },
  {
    icon: '💬',
    title: 'Pago coordinado',
    desc: 'WhatsApp o transferencia',
  },
  {
    icon: '✅',
    title: 'Cartas originales',
    desc: 'Verificadas una por una',
  },
  {
    icon: '🛡️',
    title: 'Cambios en 48 hs',
    desc: 'Si algo no te convence',
  },
]

export default async function Footer() {
  const games = await getGames()
  const hasWa = Boolean(whatsappNumber())
  const wa = buildWhatsappLink(
    '¡Hola TCG NQN! Quería hacer una consulta sobre un producto.',
  )

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
    <footer className="relative border-t border-neutral-200 bg-surface">
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-amber-500" />

      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-2 gap-x-6 gap-y-6 border-b border-neutral-100 py-10 sm:grid-cols-4">
          {trust.map((t) => (
            <div key={t.title} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-lg">
                {t.icon}
              </span>
              <div>
                <p className="text-sm font-semibold">{t.title}</p>
                <p className="mt-0.5 text-xs text-neutral-500">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-12 sm:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo.webp"
                alt="TCG NQN"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="font-display text-xl font-bold tracking-tight">
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
                className="inline-flex items-center gap-2 rounded-full bg-[#0d0f14] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                ¿Buscás una carta puntual?
              </Link>
              {hasWa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-semibold transition hover:bg-neutral-100"
                >
                  <span className="text-green-500">WhatsApp</span>
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
                    className="text-sm font-medium text-indigo-600 hover:underline"
                  >
                    +549 WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-neutral-100 py-6 sm:flex-row">
          <p className="text-xs text-neutral-400">
            © {new Date().getFullYear()} TCG NQN · Neuquén, Argentina · Todos los
            derechos reservados
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-neutral-400">Medios de pago:</span>
            {methods.map((m) => (
              <span
                key={m}
                className="rounded-full border border-neutral-200 px-3 py-1 text-[11px] font-medium text-neutral-500"
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