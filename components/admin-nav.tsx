'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { isEnabled } from '@/lib/modules'
import { Icon, type IconName } from '@/components/admin-ui'

type NavItem = {
  href: string
  label: string
  icon: IconName
}

type NavGroup = {
  label: string
  items: NavItem[]
}

function groups(): NavGroup[] {
  const nav: NavGroup[] = [
    {
      label: 'Catálogo',
      items: [
        { href: '/admin', label: 'Productos', icon: 'package' },
        { href: '/admin/cartas', label: 'Cartas', icon: 'fileText' },
        { href: '/admin/categories', label: 'Categorías', icon: 'tag' },
        { href: '/admin/games', label: 'Juegos', icon: 'layers' },
      ],
    },
    {
      label: 'Ventas',
      items: [{ href: '/admin/orders', label: 'Pedidos', icon: 'shoppingBag' }],
    },
  ]
  if (isEnabled('coupons')) {
    nav.push({
      label: 'Promociones',
      items: [{ href: '/admin/coupons', label: 'Cupones', icon: 'ticket' }],
    })
  }
  nav.push({
    label: 'Configuración',
    items: [{ href: '/admin/settings', label: 'Configuración', icon: 'share' }],
  })
  return nav
}

export default function AdminNav() {
  const pathname = usePathname()
  const nav = groups()

  return (
    <nav className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-surface p-3 shadow-sm">
      {/* Marca */}
      <Link
        href="/admin"
        className="mb-2 hidden items-center gap-3 rounded-xl px-2 pb-3 pt-1 lg:flex"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 font-display text-lg font-bold text-white shadow-sm shadow-indigo-500/30">
          T
        </span>
        <span className="min-w-0">
          <span className="block font-display text-sm font-bold tracking-tight">
            TCG NQN
          </span>
          <span className="block text-[11px] text-neutral-500">
            Panel de administración
          </span>
        </span>
      </Link>

      {/* Navegación */}
      <div className="flex gap-1 overflow-x-auto pb-1 lg:flex-1 lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0">
        {nav.map((group, i) => (
          <div key={group.label} className="contents lg:block">
            {i > 0 && (
              <span
                aria-hidden
                className="mx-1 w-px shrink-0 self-stretch bg-neutral-200 lg:hidden"
              />
            )}
            <p className="hidden px-3 pb-1.5 pt-4 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 lg:block">
              {group.label}
            </p>
            <div className="flex shrink-0 gap-1 lg:flex-col lg:gap-0.5">
              {group.items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== '/admin' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`flex shrink-0 items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition lg:whitespace-normal ${
                      active
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/25'
                        : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800/50'
                    }`}
                  >
                    <Icon name={item.icon} className="h-[18px] w-[18px] shrink-0" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Pie: volver a la tienda (solo escritorio) */}
      <div className="mt-auto hidden border-t border-neutral-200 pt-3 lg:block">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800/50"
        >
          <Icon name="arrowLeft" className="h-[18px] w-[18px] shrink-0" />
          Volver a la tienda
        </Link>
      </div>
    </nav>
  )
}
