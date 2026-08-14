'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const { count } = useCart()
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-950 text-sm text-white">
            🃏
          </span>
          <span className="text-lg font-bold tracking-tight">TCG NQN</span>
        </Link>
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
    </header>
  )
}
