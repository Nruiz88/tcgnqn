import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getMyOrders } from '@/lib/data'
import { formatPrice } from '@/lib/format'
import { signOut } from '@/lib/actions'

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const orders = await getMyOrders()

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mi cuenta</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {profile?.full_name ?? user.email}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {profile?.role === 'admin' && (
            <Link
              href="/admin"
              className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-semibold hover:bg-neutral-100"
            >
              Panel admin
            </Link>
          )}
          <form action={signOut}>
            <button className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-semibold hover:bg-neutral-100">
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>

      <h2 className="mt-10 text-lg font-semibold">Mis pedidos</h2>
      {orders.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-500">
          Todavía no hiciste ningún pedido.{' '}
          <Link href="/" className="underline">
            Ir a la tienda
          </Link>
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-lg border border-neutral-200 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">
                    Pedido #{order.id.slice(0, 8)}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {new Date(order.created_at).toLocaleDateString('es-AR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">
                    {formatPrice(order.total)}
                  </p>
                  <span className="inline-block rounded bg-neutral-100 px-2 py-0.5 text-xs capitalize">
                    {order.status}
                  </span>
                </div>
              </div>
              {order.shipping_label && (
                <p className="mt-2 text-xs text-neutral-500">
                  Envío: {order.shipping_label}
                  {order.shipping_price > 0 &&
                    ` · ${formatPrice(order.shipping_price)}`}
                </p>
              )}
              <ul className="mt-3 space-y-1 text-sm text-neutral-600">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>
                      {item.product?.name ?? 'Producto'} × {item.quantity}
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
