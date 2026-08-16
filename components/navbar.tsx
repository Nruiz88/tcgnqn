'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { isEnabled } from '@/lib/modules'

function NavLinks() {
  const { count } = useCart()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const cat = searchParams.get('cat')
  const isHome = pathname === '/'

  const links = [
    { href: '/', label: 'Tienda', active: isHome && !cat },
    { href: '/cartas', label: 'Cartas', active: pathname === '/cartas' },
    {
      href: '/?cat=accesorios',
      label: 'Accesorios',
      active: isHome && cat === 'accesorios',
    },
    ...(isEnabled('wishlist')
      ? [{ href: '/favoritos', label: 'Favoritos', active: pathname === '/favoritos' }]
      : []),
    { href: '/cart', label: 'Carrito', active: pathname === '/cart' },
    { href: '/account', label: 'Cuenta', active: pathname === '/account' },
  ]

  return (
    <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 sm:gap-x-5">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          aria-current={l.active ? 'page' : undefined}
          className={`relative text-sm font-medium transition ${
            l.active
              ? 'text-neutral-900 dark:text-neutral-100'
              : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          {l.label}
          {l.href === '/cart' && count > 0 && (
            <span className="absolute -right-4 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#0d0f14] text-xs font-bold text-white ring-1 ring-white/20">
              {count}
            </span>
          )}
          {l.active && (
            <span className="absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.9)]" />
          )}
        </Link>
      ))}
    </div>
  )
}

export default function Navbar() {
  const router = useRouter()
  const [q, setQ] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const query = q.trim()
    if (!query) return
    router.push(`/buscar?q=${encodeURIComponent(query)}`)
    setQ('')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-surface/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.webp"
            alt="TCG NQN"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="text-lg font-bold tracking-tight">TCG NQN</span>
        </Link>
        <form onSubmit={submit} className="hidden max-w-xs flex-1 md:block">
          <div className="relative">
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar productos…"
              className="w-full rounded-full border border-neutral-300 bg-neutral-50 px-4 py-1.5 text-sm outline-none focus:border-neutral-900"
            />
          </div>
        </form>
        <Suspense
          fallback={
            <div className="flex items-center gap-4 sm:gap-5">
              <span className="text-sm font-medium text-neutral-500">Tienda</span>
              <span className="text-sm font-medium text-neutral-500">Cartas</span>
            </div>
          }
        >
          <NavLinks />
        </Suspense>
      </nav>
      <form onSubmit={submit} className="px-4 pb-3 md:hidden">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar productos…"
          className="w-full rounded-full border border-neutral-300 bg-neutral-50 px-4 py-2 text-sm outline-none focus:border-neutral-900"
        />
      </form>
    </header>
  )
}
