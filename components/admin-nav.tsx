'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { isEnabled } from '@/lib/modules'

function Icon({ path }: { path: React.ReactNode }) {
  return (
    <svg
      className="h-[18px] w-[18px] shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {path}
    </svg>
  )
}

const iconPaths = {
  products: (
    <>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </>
  ),
  orders: (
    <>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </>
  ),
  categories: (
    <>
      <path d="M12.6 2.6A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .6 1.4l8 8a2 2 0 0 0 2.8 0l7-7a2 2 0 0 0 0-2.8Z" />
      <circle cx="7" cy="7" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  games: (
    <>
      <path d="m12 2 8 4.5-8 4.5-8-4.5Z" />
      <path d="m4 11.5 8 4.5 8-4.5" />
      <path d="m4 16.5 8 4.5 8-4.5" />
    </>
  ),
  coupons: (
    <>
      <path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4Z" />
      <path d="M13 5v2" />
      <path d="M13 11v2" />
      <path d="M13 17v2" />
    </>
  ),
}

type NavItem = {
  href: string
  label: string
  icon: keyof typeof iconPaths
}

function items(): NavItem[] {
  const nav: NavItem[] = [
    { href: '/admin', label: 'Productos', icon: 'products' },
    { href: '/admin/orders', label: 'Pedidos', icon: 'orders' },
    { href: '/admin/categories', label: 'Categorías', icon: 'categories' },
    { href: '/admin/games', label: 'Juegos', icon: 'games' },
  ]
  if (isEnabled('coupons')) {
    nav.push({ href: '/admin/coupons', label: 'Cupones', icon: 'coupons' })
  }
  return nav
}

export default function AdminNav() {
  const pathname = usePathname()
  const nav = items()

  return (
    <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-neutral-200 bg-surface p-2 lg:flex-col lg:overflow-visible">
      {nav.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== '/admin' && pathname.startsWith(item.href))
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              active
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            <Icon path={iconPaths[item.icon]} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}