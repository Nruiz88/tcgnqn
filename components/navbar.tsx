'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { usePathname } from 'next/navigation'
import { isEnabled } from '@/lib/modules'

export default function Navbar() {
  const { count } = useCart()
  const pathname = usePathname()
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
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-950 text-sm text-white">
            🃏
          </span>
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
        <div className="flex items-center gap-5 sm:gap-6">
          <Link
            href="/"
            className={`text-sm font-medium ${
              pathname === '/'
                ? 'text-neutral-900'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Tienda
          </Link>
          {isEnabled('wishlist') && (
            <Link
              href="/favoritos"
              className={`text-sm font-medium ${
                pathname === '/favoritos'
                  ? 'text-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Favoritos
            </Link>
          )}
          <Link
            href="/cart"
            className={`relative text-sm font-medium ${
              pathname === '/cart'
                ? 'text-neutral-900'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Carrito
            {count > 0 && (
              <span className="absolute -right-4 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-950 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <Link
            href="/account"
            className={`text-sm font-medium ${
              pathname === '/account'
                ? 'text-neutral-900'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Cuenta
          </Link>
        </div>
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
