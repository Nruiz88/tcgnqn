import { getCoupons } from '@/lib/data'
import {
  createCoupon,
  toggleCoupon,
  deleteCoupon,
} from '@/lib/actions'
import { revalidatePath } from 'next/cache'
import { requireModule } from '@/lib/modules'
import { formatPrice } from '@/lib/format'
import {
  Icon,
  PageHeader,
  EmptyState,
  SectionCard,
  inputCls,
  labelCls,
  btnPrimary,
  btnSecondary,
  btnDanger,
} from '@/components/admin-ui'

export const dynamic = 'force-dynamic'

export default async function AdminCouponsPage() {
  requireModule('coupons')
  const coupons = await getCoupons()

  return (
    <div>
      <PageHeader
        icon="ticket"
        title="Cupones"
        description="Códigos de descuento que se aplican en el checkout"
      />

      {/* Nuevo cupón */}
      <SectionCard
        title="Nuevo cupón"
        description="Creá un código para tus clientes."
      >
        <form
          action={async (formData: FormData) => {
            'use server'
            await createCoupon(formData)
            revalidatePath('/admin/coupons')
          }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3"
        >
          <div>
            <label className={labelCls}>Código</label>
            <input
              name="code"
              required
              placeholder="BIENVENIDA10"
              className={`${inputCls} uppercase`}
            />
          </div>
          <div>
            <label className={labelCls}>Tipo</label>
            <select name="type" className={inputCls}>
              <option value="percent">%</option>
              <option value="fixed">Fijo ($)</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Valor</label>
            <input
              type="number"
              name="value"
              required
              min={1}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Min. total</label>
            <input
              type="number"
              name="min_total"
              min={0}
              placeholder="Opcional"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Máx. usos</label>
            <input
              type="number"
              name="max_uses"
              min={1}
              placeholder="Opcional"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Expira</label>
            <input
              type="datetime-local"
              name="expires_at"
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-3">
            <button type="submit" className={btnPrimary}>
              <Icon name="plus" className="h-4 w-4" />
              Crear cupón
            </button>
          </div>
        </form>
      </SectionCard>

      {/* Listado */}
      <div className="mt-6 max-w-3xl space-y-3">
        {coupons.length === 0 && (
          <EmptyState
            icon="ticket"
            title="No hay cupones todavía"
            description="Creá un cupón para ofrecer descuentos en el checkout."
          />
        )}
        {coupons.map((c) => (
          <div
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-surface p-4 transition hover:border-neutral-300"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl border-2 border-dashed border-indigo-400/40 bg-indigo-500/10 px-3 py-2 font-mono text-sm font-bold text-indigo-500">
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
                <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-600 ring-1 ring-inset ring-amber-500/20 dark:text-amber-400">
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
                <button
                  title={c.active ? 'Pausar cupón' : 'Activar cupón'}
                  className={btnSecondary}
                >
                  <Icon
                    name={c.active ? 'pause' : 'play'}
                    className="h-3.5 w-3.5"
                  />
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
                <button title="Borrar cupón" className={btnDanger}>
                  <Icon name="trash" className="h-3.5 w-3.5" />
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
