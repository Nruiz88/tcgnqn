import Link from 'next/link'
import { getProducts, getCategories } from '@/lib/data'
import ProductCard from '@/components/product-card'

export const dynamic = 'force-dynamic'

const features = [
  { title: 'Envío seguro', desc: 'Protección rígida y seguimiento en todo el país.', emoji: '📦' },
  { title: 'Cartas verificadas', desc: 'Revisamos calidad y estado antes de enviar.', emoji: '✅' },
  { title: 'Pago coordinado', desc: 'Arreglamos el pago por WhatsApp al confirmar tu pedido.', emoji: '💬' },
  { title: 'Colección curada', desc: 'Solo productos que elegimos para tu binder.', emoji: '⭐' },
]

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>
}) {
  const [{ cat }, categories] = await Promise.all([
    searchParams,
    getCategories(),
  ])

  const activeCategory = cat
    ? categories.find((c) => c.slug === cat)
    : undefined

  const products = activeCategory
    ? (await getProducts()).filter((p) => p.category?.slug === cat)
    : await getProducts()

  const featured = products.slice(0, 8)

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-neutral-950 text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-purple-600/30 blur-3xl" />
        </div>
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-8 px-4 py-20 sm:py-28 md:flex-row md:items-center">
          <div className="max-w-xl flex-1">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
              ✦ Tienda online de cartas coleccionables
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Tu colección empieza{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                acá
              </span>
            </h1>
            <p className="mt-4 text-base text-white/70 sm:text-lg">
              Cartas, sobres y accesorios seleccionados con cuidado. Comprá en
              tres pasos: elegí, dejá tu pedido y coordinamos el pago.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="#productos"
                className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
              >
                Ver productos
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Crear cuenta
              </Link>
            </div>
          </div>
          <div className="hidden flex-1 sm:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <p className="text-3xl">🃏</p>
                <p className="mt-3 text-sm font-semibold">Cartas raras</p>
                <p className="mt-1 text-xs text-white/60">Charizard, Pikachu y más</p>
              </div>
              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <p className="text-3xl">📦</p>
                <p className="mt-3 text-sm font-semibold">Sobres sellados</p>
                <p className="mt-1 text-xs text-white/60">Para abrir o guardar</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <span className="text-2xl">{f.emoji}</span>
              <div>
                <p className="text-sm font-semibold text-neutral-900">{f.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-neutral-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categorías */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Explorá por categoría</h2>
            <p className="mt-1 text-sm text-neutral-500">Lo que tenemos hoy en la tienda</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={activeCategory?.slug === c.slug ? '/' : `/?cat=${c.slug}`}
              className={`group rounded-2xl border p-6 transition hover:shadow-sm ${
                activeCategory?.slug === c.slug
                  ? 'border-neutral-900 bg-neutral-950 text-white'
                  : 'border-neutral-200 bg-white'
              }`}
            >
              <span className="text-3xl">{c.emoji}</span>
              <p className="mt-4 text-sm font-semibold">{c.name}</p>
              <p className="mt-1 text-xs opacity-60">Ver productos →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Productos */}
      <section id="productos" className="mx-auto max-w-6xl px-4 pb-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {activeCategory ? activeCategory.name : 'Productos destacados'}
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              {activeCategory
                ? 'Filtrado por categoría'
                : 'Actualizamos la selección seguido'}
            </p>
          </div>
          {activeCategory && (
            <Link href="/#productos" className="text-sm font-medium text-neutral-900 hover:underline">
              Ver todos
            </Link>
          )}
        </div>
        {featured.length === 0 ? (
          <p className="mt-10 text-center text-neutral-500">
            Todavía no hay productos publicados.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* CTA final */}
      <section className="bg-neutral-950 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center">
          <h2 className="max-w-xl text-2xl font-bold tracking-tight sm:text-3xl">
            ¿No encontrás lo que buscás?
          </h2>
          <p className="max-w-md text-sm text-white/70">
            Pedinos esa carta o producto especial y lo conseguimos para tu colección.
          </p>
          <Link
            href="/login"
            className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
          >
            Hacé tu pedido
          </Link>
        </div>
      </section>
    </div>
  )
}
