import Link from 'next/link'

export default async function OrderConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>
}) {
  const { order } = await searchParams

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:py-20">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">
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
      </span>
      <h1 className="mt-6 font-display text-2xl font-bold tracking-tight sm:text-3xl">
        ¡Pedido confirmado!
      </h1>
      {order && (
        <p className="mt-2 text-sm text-neutral-500">
          Pedido <span className="font-mono font-semibold">#{order.slice(0, 8)}</span>
        </p>
      )}
      <p className="mt-3 text-neutral-500">
        Recibimos tu pedido. Te contactaremos por WhatsApp o teléfono para
        coordinar el pago y el envío. Podés seguir su estado desde tu cuenta.
      </p>
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
