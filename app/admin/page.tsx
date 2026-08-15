import Link from 'next/link'
import { getAllProducts } from '@/lib/data'
import { formatPrice } from '@/lib/format'
import { toggleProduct } from '@/lib/actions'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const products = await getAllProducts()

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Productos</h2>
        <Link
          href="/admin/products/new"
          className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white"
        >
          Nuevo producto
        </Link>
      </div>

      <div className="mt-4 space-y-3">
        {products.length === 0 && (
          <p className="text-sm text-neutral-500">No hay productos.</p>
        )}
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between rounded-lg border border-neutral-200 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded bg-neutral-100">
                {product.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-neutral-500">
                  {formatPrice(product.price)} · Stock: {product.stock}
                  {product.game?.name && ` · ${product.game.emoji} ${product.game.name}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!product.active && (
                <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                  Oculto
                </span>
              )}
              <form
                action={async () => {
                  'use server'
                  await toggleProduct(product.id, !product.active)
                  revalidatePath('/admin')
                }}
              >
                <button className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-100">
                  {product.active ? 'Ocultar' : 'Publicar'}
                </button>
              </form>
              <Link
                href={`/admin/products/${product.id}/edit`}
                className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-100"
              >
                Editar
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
