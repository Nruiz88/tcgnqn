'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart-context'

export default function Navbar() {
  const { count } = useCart()

  return (
    <header className="border-b border-neutral-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          TCG NQN
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-neutral-600">
            Tienda
          </Link>
          <Link
            href="/cart"
            className="relative text-sm font-medium hover:text-neutral-600"
          >
            Carrito
            {count > 0 && (
              <span className="absolute -right-4 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <Link
            href="/account"
            className="text-sm font-medium hover:text-neutral-600"
          >
            Cuenta
          </Link>
        </div>
      </nav>
    </header>
  )
}
