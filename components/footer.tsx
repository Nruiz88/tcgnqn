import Link from 'next/link'
import Image from 'next/image'
import { getGames } from '@/lib/data'
import { isEnabled } from '@/lib/modules'
import { buildWhatsappLink, whatsappNumber } from '@/lib/whatsapp'

const linkCls = 'text-sm text-neutral-500 transition hover:text-neutral-900'
const headCls = 'text-xs font-semibold uppercase tracking-widest text-neutral-400'

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

  return (
    <footer className="relative border-t border-neutral-200 bg-surface">
      <div className="mx-auto max-w-6xl px-4 pb-8 pt-12">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:grid-cols-5">
          <div className="col-span-2 sm:col-span-3 md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.webp"
                alt="TCG NQN"
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover"
              />
              <span className="text-lg font-bold tracking-tight">TCG NQN</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-500">
              Cartas individuales, boosters y accesorios coleccionables. Elegí tus
              cartas, dejá tu pedido y coordinamos la entrega en Neuquén o a todo
              el país.
            </p>
            {hasWa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0d0f14] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-green-400"
                >
                  <path d="M17.47 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.21 5.1 4.5.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35zM12.05 21.79h-.01a9.83 9.83 0 0 1-5-1.37l-.36-.21-3.72.98 1-3.63-.24-.37a9.8 9.8 0 0 1-1.5-5.22c0-5.41 4.4-9.81 9.82-9.81 2.62 0 5.09 1.02 6.94 2.88a9.75 9.75 0 0 1 2.87 6.94c0 5.42-4.4 9.82-9.8 9.82zm8.68-18.5A11.7 11.7 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.6 5.95L.08 24l6.3-1.65a11.87 11.87 0 0 0 5.67 1.44c6.55 0 11.89-5.33 11.89-11.89 0-3.18-1.24-6.16-3.5-8.4z" />
                </svg>
                Escribinos por WhatsApp
              </a>
            )}
          </div>

          <div>
            <p className={headCls}>Tienda</p>
            <ul className="mt-4 space-y-2.5">
              {shopLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkCls}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={headCls}>Juegos</p>
            <ul className="mt-4 space-y-2.5">
              {games.map((g) => (
                <li key={g.id}>
                  <Link
                    href={`/cartas?game=${g.slug}`}
                    className={`${linkCls} inline-flex items-center gap-1.5`}
                  >
                    {g.emoji && <span>{g.emoji}</span>}
                    {g.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={headCls}>Ayuda</p>
            <ul className="mt-4 space-y-2.5">
              {helpLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkCls}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-neutral-100 pt-6 sm:flex-row">
          <p className="text-xs text-neutral-400">
            © {new Date().getFullYear()} TCG NQN · Neuquén, Argentina
          </p>
          <p className="text-xs text-neutral-400">
            Pagos coordinados por WhatsApp o transferencia
          </p>
        </div>
      </div>
    </footer>
  )
}