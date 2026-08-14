import Link from 'next/link'

export default function OrderConfirmedPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">¡Pedido confirmado!</h1>
      <p className="mt-3 text-neutral-600">
        Recibimos tu pedido. Te contactaremos por WhatsApp o
        teléfono para coordinar el pago y el envío.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          href="/account"
          className="rounded-md bg-black px-6 py-3 text-sm font-semibold text-white"
        >
          Ver mis pedidos
        </Link>
        <Link
          href="/"
          className="rounded-md border border-neutral-300 px-6 py-3 text-sm font-semibold"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  )
}
