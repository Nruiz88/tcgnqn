import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isEnabled } from '@/lib/modules'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold">Panel de administración</h1>
      <nav className="mt-4 flex gap-6 border-b border-neutral-200 pb-4">
        <a href="/admin" className="text-sm font-medium hover:text-neutral-600">
          Productos
        </a>
        <a
          href="/admin/orders"
          className="text-sm font-medium hover:text-neutral-600"
        >
          Pedidos
        </a>
        <a
          href="/admin/categories"
          className="text-sm font-medium hover:text-neutral-600"
        >
          Categorías
        </a>
        <a
          href="/admin/games"
          className="text-sm font-medium hover:text-neutral-600"
        >
          Juegos
        </a>
        {isEnabled('coupons') && (
          <a
            href="/admin/coupons"
            className="text-sm font-medium hover:text-neutral-600"
          >
            Cupones
          </a>
        )}
      </nav>
      <div className="mt-6">{children}</div>
    </div>
  )
}
