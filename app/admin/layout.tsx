import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminNav from '@/components/admin-nav'
import AdminBreadcrumb from '@/components/admin-breadcrumb'
import { Icon } from '@/components/admin-ui'

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
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="sr-only">Panel de administración</h1>
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <aside className="lg:w-64 lg:shrink-0">
          <div className="lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)]">
            <AdminNav />
          </div>
        </aside>
        <main className="min-w-0 flex-1">
          <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <AdminBreadcrumb />
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-600 transition hover:border-neutral-400 hover:bg-neutral-100 lg:hidden"
            >
              <Icon name="arrowLeft" className="h-4 w-4" />
              Volver a la tienda
            </Link>
          </header>
          {children}
        </main>
      </div>
    </div>
  )
}
