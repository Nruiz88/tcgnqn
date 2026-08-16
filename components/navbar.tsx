'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { isEnabled } from '@/lib/modules'

const menuIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className="h-5 w-5"
  >
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </svg>
)

const closeIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className="h-5 w-5"
  >
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
)

function LinksFallback() {
  return (
    <div className="flex items-center gap-4 sm:gap-5">
      <span className="text-sm font-medium text-neutral-500">Tienda</span>
      <span className="text-sm font-medium text-neutral-500">Cartas</span>
    </div>
  )
}

function NavLinks({ vertical = false }: { vertical?: boolean }) {
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
    <div
      className={
        vertical
          ? 'flex flex-col gap-1'
          : 'flex flex-wrap items-center justify-end gap-x-4 gap-y-2 sm:gap-x-5'
      }
    >
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          aria-current={l.active ? 'page' : undefined}
          className={`relative text-sm font-medium transition ${
            vertical ? 'flex items-center gap-2.5 rounded-lg px-3 py-2.5' : ''
          } ${
            l.active
              ? vertical
                ? 'bg-indigo-500/10 text-white'
                : 'text-white'
              : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          {vertical && l.active && (
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.9)]" />
          )}
          {l.label}
          {l.href === '/cart' && count > 0 && (
            <span
              className={`absolute flex h-5 w-5 items-center justify-center rounded-full bg-[#0d0f14] text-xs font-bold text-white ring-1 ring-white/20 ${
                vertical
                  ? 'right-3 top-1/2 -translate-y-1/2'
                  : '-right-4 -top-2'
              }`}
            >
              {count}
            </span>
          )}
          {!vertical && l.active && (
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
  const [open, setOpen] = useState(false)

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
        <div className="hidden md:block">
          <Suspense fallback={<LinksFallback />}>
            <NavLinks />
          </Suspense>
        </div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition hover:bg-neutral-100 dark:border-neutral-700/60 dark:text-neutral-300 dark:hover:bg-neutral-800/50 md:hidden"
        >
          {open ? closeIcon : menuIcon}
        </button>
      </nav>

      {/* Menú móvil */}
      <div className={`md:hidden ${open ? 'block' : 'hidden'}`}>
        <div
          className="mx-auto max-w-6xl border-t border-neutral-200 px-4 py-3 dark:border-neutral-700/60"
          onClick={() => setOpen(false)}
        >
          <Suspense fallback={<LinksFallback />}>
            <NavLinks vertical />
          </Suspense>
        </div>
      </div>

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
