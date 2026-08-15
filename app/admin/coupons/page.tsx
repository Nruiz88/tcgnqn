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
      <h2 className="text-lg font-semibold">Cupones</h2>

      <form
        action={async (formData: FormData) => {
          'use server'
          await createCoupon(formData)
          revalidatePath('/admin/coupons')
        }}
        className="mt-4 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4"
      >
        <div>
          <label className="text-sm font-medium">Código</label>
          <input
            name="code"
            required
            placeholder="BIENVENIDA10"
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Tipo</label>
          <select
            name="type"
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          >
            <option value="percent">%</option>
            <option value="fixed">Fijo ($)</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Valor</label>
          <input
            type="number"
            name="value"
            required
            min={1}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Min. total</label>
          <input
            type="number"
            name="min_total"
            min={0}
            placeholder="Opcional"
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Máx. usos</label>
          <input
            type="number"
            name="max_uses"
            min={1}
            placeholder="Opcional"
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Expira</label>
          <input
            type="datetime-local"
            name="expires_at"
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white"
          >
            Crear
          </button>
        </div>
      </form>

      <div className="mt-8 max-w-2xl space-y-3">
        {coupons.length === 0 && (
          <p className="text-sm text-neutral-500">No hay cupones.</p>
        )}
        {coupons.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between rounded-lg border border-neutral-200 p-4"
          >
            <div>
              <p className="font-medium">
                {c.code}
                {!c.active && (
                  <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                    Inactivo
                  </span>
                )}
              </p>
              <p className="mt-1 text-sm text-neutral-500">
                {c.type === 'percent' ? `${c.value}%` : formatPrice(c.value)} ·{' '}
                {c.min_total ? `Mín ${formatPrice(c.min_total)} · ` : ''}
                Usado {c.used_count}
                {c.max_uses ? `/${c.max_uses}` : ''}
                {c.expires_at ? ` · Vence ${new Date(c.expires_at).toLocaleDateString('es-AR')}` : ''}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <form
                action={async () => {
                  'use server'
                  await toggleCoupon(c.id, !c.active)
                  revalidatePath('/admin/coupons')
                }}
              >
                <button className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-100">
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
                <button className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40">
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
