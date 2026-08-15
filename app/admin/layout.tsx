import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminNav from '@/components/admin-nav'

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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="lg:w-60 lg:shrink-0">
          <div className="lg:sticky lg:top-24">{<AdminNav />}</div>
        </aside>
        <main className="min-w-0 flex-1">
          <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
                Administración
              </p>
              <h1 className="mt-1 font-display text-3xl font-bold tracking-tight">
                Panel de administración
              </h1>
            </div>
            <Link
              href="/"
              className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-600 transition hover:border-neutral-400 hover:bg-neutral-100"
            >
              ← Volver a la tienda
            </Link>
          </header>
          {children}
        </main>
      </div>
    </div>
  )
}