import { getCoupons } from '@/lib/data'
import {
  createCoupon,
  toggleCoupon,
  deleteCoupon,
} from '@/lib/actions'
import { revalidatePath } from 'next/cache'
import { requireModule } from '@/lib/modules'
import { formatPrice } from '@/lib/format'

export const dynamic = 'force-dynamic'

export default async function AdminCouponsPage() {
  requireModule('coupons')
  const coupons = await getCoupons()

  return (
    <div>
      <div>
        <h2 className="font-display text-xl font-bold tracking-tight">Cupones</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Códigos de descuento que se aplican en el checkout
        </p>
      </div>

      <form
        action={async (formData: FormData) => {
          'use server'
          await createCoupon(formData)
          revalidatePath('/admin/coupons')
        }}
        className="mt-6 grid max-w-3xl grid-cols-2 gap-4 rounded-2xl border border-neutral-200 bg-surface p-5 sm:grid-cols-3"
      >
        <div>
          <label className="text-xs font-medium text-neutral-500">Código</label>
          <input
            name="code"
            required
            placeholder="BIENVENIDA10"
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm uppercase focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-neutral-500">Tipo</label>
          <select
            name="type"
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          >
            <option value="percent">%</option>
            <option value="fixed">Fijo ($)</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-neutral-500">Valor</label>
          <input
            type="number"
            name="value"
            required
            min={1}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-neutral-500">
            Min. total
          </label>
          <input
            type="number"
            name="min_total"
            min={0}
            placeholder="Opcional"
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-neutral-500">
            Máx. usos
          </label>
          <input
            type="number"
            name="max_uses"
            min={1}
            placeholder="Opcional"
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-neutral-500">Expira</label>
          <input
            type="datetime-local"
            name="expires_at"
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-end sm:col-span-3">
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            + Crear cupón
          </button>
        </div>
      </form>

      <div className="mt-6 max-w-3xl space-y-3">
        {coupons.length === 0 && (
          <p className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-sm text-neutral-500">
            No hay cupones todavía.
          </p>
        )}
        {coupons.map((c) => (
          <div
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-surface p-4 transition hover:border-neutral-300"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-50 px-3 py-2 font-mono text-sm font-bold text-indigo-600">
                {c.code}
              </div>
              <div>
                <p className="text-sm">
                  {c.type === 'percent'
                    ? `${c.value}% OFF`
                    : `${formatPrice(c.value)} OFF`}
                  {c.min_total ? ` · Mín ${formatPrice(c.min_total)}` : ''}
                </p>
                <p className="mt-0.5 text-xs text-neutral-500">
                  Usado {c.used_count}
                  {c.max_uses ? `/${c.max_uses}` : ''}
                  {c.expires_at
                    ? ` · Vence ${new Date(c.expires_at).toLocaleDateString('es-AR')}`
                    : ' · Sin vencimiento'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!c.active && (
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                  Inactivo
                </span>
              )}
              <form
                action={async () => {
                  'use server'
                  await toggleCoupon(c.id, !c.active)
                  revalidatePath('/admin/coupons')
                }}
              >
                <button className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium transition hover:bg-neutral-100">
                  {c.active ? 'Pausar' : 'Activar'}
                </button>
              </form>
              <form
                action={async () => {
                  'use server'
                  await deleteCoupon(c.id)
                  revalidatePath('/admin/coupons')
                }}
              >
                <button className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40">
                  Borrar
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}