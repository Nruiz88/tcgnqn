'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { formatPrice } from '@/lib/format'

export default function CartPage() {
  const { items, total, updateQuantity, removeItem } = useCart()

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Tu carrito está vacío</h1>
        <Link
          href="/"
          className="mt-4 inline-block rounded-md bg-black px-6 py-3 text-sm font-semibold text-white"
        >
          Ir a la tienda
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold">Carrito</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="flex gap-4 rounded-lg border border-neutral-200 p-4"
            >
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded bg-neutral-100">
                {item.product.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                    -
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/product/${item.product.id}`}
                      className="font-medium hover:underline"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-neutral-500">
                      {formatPrice(item.product.price)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-sm text-neutral-400 hover:text-red-600"
                  >
                    Quitar
                  </button>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity - 1)
                    }
                    className="h-8 w-8 rounded border border-neutral-300 hover:bg-neutral-100"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity + 1)
                    }
                    className="h-8 w-8 rounded border border-neutral-300 hover:bg-neutral-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="h-fit rounded-lg border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold">Resumen</h2>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-neutral-600">Total</span>
            <span className="text-lg font-bold">{formatPrice(total)}</span>
          </div>
          <Link
            href="/checkout"
            className="mt-6 block rounded-md bg-black px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Ir a checkout
          </Link>
        </div>
      </div>
    </div>
  )
}
