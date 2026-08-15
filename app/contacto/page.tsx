import { buildWhatsappLink, whatsappNumber } from '@/lib/whatsapp'
import Link from 'next/link'

export const metadata = {
  title: 'Contacto · TCG NQN',
}

export default function ContactoPage() {
  const hasWa = Boolean(whatsappNumber())
  const wa = buildWhatsappLink(
    '¡Hola TCG NQN! Tengo una consulta sobre un producto.',
  )

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
        Contacto
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
        Hablemos
      </h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-neutral-500 sm:text-base">
        ¿Dudas sobre una carta, un envío o querés encargar algo puntual? Escribinos
        y te respondemos lo antes posible.
      </p>

      <div className="mt-8 border-t border-neutral-200 pt-8">
        {hasWa && (
          <section className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.47 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.21 5.1 4.5.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35zM12.05 21.79h-.01a9.83 9.83 0 0 1-5-1.37l-.36-.21-3.72.98 1-3.63-.24-.37a9.8 9.8 0 0 1-1.5-5.22c0-5.41 4.4-9.81 9.82-9.81 2.62 0 5.09 1.02 6.94 2.88a9.75 9.75 0 0 1 2.87 6.94c0 5.42-4.4 9.82-9.8 9.82zm8.68-18.5A11.7 11.7 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.6 5.95L.08 24l6.3-1.65a11.87 11.87 0 0 0 5.67 1.44c6.55 0 11.89-5.33 11.89-11.89 0-3.18-1.24-6.16-3.5-8.4z" />
                </svg>
              </span>
              <div>
                <p className="font-semibold">WhatsApp</p>
                <p className="text-sm text-neutral-500">
                  Respuesta rápida, todos los días
                </p>
              </div>
            </div>
            <Link
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0d0f14] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Abrir WhatsApp
            </Link>
          </section>
        )}

        <section className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-lg">
              📍
            </span>
            <div>
              <p className="font-semibold">Tienda física</p>
              <p className="text-sm text-neutral-500">
                Neuquén, Argentina · Retiro coordinado por WhatsApp
              </p>
            </div>
          </div>
        </section>

        <p className="mt-8 text-sm text-neutral-500">
          ¿Querés conocer cómo trabajamos? Leé nuestros{' '}
          <Link href="/terminos" className="font-medium text-indigo-600 hover:underline">
            términos y condiciones
          </Link>{' '}
          y nuestra{' '}
          <Link href="/privacidad" className="font-medium text-indigo-600 hover:underline">
            política de privacidad
          </Link>
          .
        </p>
      </div>
    </div>
  )
}