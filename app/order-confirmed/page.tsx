import Link from 'next/link'
import { confirmMercadoPagoOrder } from '@/lib/actions'

type MpState = 'success' | 'pending' | 'failure' | null

export default async function OrderConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; mp?: string; payment_id?: string }>
}) {
  const { order, mp, payment_id } = await searchParams

  let mpState: MpState = null
  if (mp === 'success') mpState = 'success'
  else if (mp === 'pending') mpState = 'pending'
  else if (mp === 'failure') mpState = 'failure'

  // Si volvimos de Mercado Pago con pago aprobado, confirmamos el pedido
  // (verificando el pago contra la API de MP, no confiando en la URL).
  if (mpState === 'success' && order) {
    await confirmMercadoPagoOrder(order, payment_id)
  }

  const tone =
    mpState === 'success'
      ? 'bg-green-500/10 text-green-400'
      : mpState === 'pending'
        ? 'bg-amber-500/10 text-amber-500'
        : 'bg-neutral-100 text-neutral-500'

  const title =
    mpState === 'success'
      ? '¡Pago aprobado!'
      : mpState === 'pending'
        ? 'Pago pendiente'
        : mpState === 'failure'
          ? 'El pago no se completó'
          : '¡Pedido confirmado!'

  const description =
    mpState === 'success'
      ? 'Tu pago fue aprobado y tu pedido quedó confirmado automáticamente. Ya estamos preparando tus productos.'
      : mpState === 'pending'
        ? 'Estamos esperando la confirmación del pago por parte de Mercado Pago. En cuanto se acredite, tu pedido quedará confirmado.'
        : mpState === 'failure'
          ? 'El pago no pudo completarse. Tu pedido quedó registrado como pendiente: podés reintentar el pago o coordinarlo por WhatsApp.'
          : 'Recibimos tu pedido. Te contactaremos por WhatsApp o teléfono para coordinar el pago y el envío. Podés seguir su estado desde tu cuenta.'

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:py-20">
      <span
        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${tone}`}
      >
        {mpState === 'success' || mpState === null ? (
          <svg
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          <svg
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
        )}
      </span>
      <h1 className="mt-6 font-display text-2xl font-bold tracking-tight sm:text-3xl">
        {title}
      </h1>
      {order && (
        <p className="mt-2 text-sm text-neutral-500">
          Pedido <span className="font-mono font-semibold">#{order.slice(0, 8)}</span>
        </p>
      )}
      <p className="mt-3 text-neutral-500">{description}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {order && (
          <Link
            href={`/account/orders/${order}`}
            className="rounded-md bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#24272c]"
          >
            Ver detalle del pedido
          </Link>
        )}
        <Link
          href="/account"
          className="rounded-md border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-500 transition hover:border-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
        >
          Ir a mis pedidos
        </Link>
        <Link
          href="/"
          className="rounded-md border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-500 transition hover:border-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  )
}
