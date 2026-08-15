'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFormStatus } from 'react-dom'
import { updateProfile } from '@/lib/actions'

const inputCls =
  'mt-1 w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'
const labelCls = 'text-xs font-medium text-neutral-500'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-md bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#24272c] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? 'Guardando…' : 'Guardar cambios'}
    </button>
  )
}

export default function ProfileForm({
  initial,
}: {
  initial: { fullName: string; phone: string }
}) {
  const router = useRouter()
  const [message, setMessage] = useState<{
    type: 'ok' | 'error'
    text: string
  } | null>(null)

  return (
    <form
      action={async (formData: FormData) => {
        const result = await updateProfile(formData)
        if (result?.error) {
          setMessage({ type: 'error', text: result.error })
          return
        }
        setMessage({ type: 'ok', text: 'Datos guardados correctamente.' })
        router.refresh()
      }}
      className="space-y-4"
    >
      <div>
        <label className={labelCls}>Nombre completo</label>
        <input
          name="full_name"
          defaultValue={initial.fullName}
          placeholder="Tu nombre y apellido"
          className={inputCls}
        />
      </div>
      <div>
        <label className={labelCls}>Teléfono</label>
        <input
          name="phone"
          defaultValue={initial.phone}
          placeholder="Ej: 299 555 1234"
          className={inputCls}
        />
        <p className="mt-1.5 text-xs text-neutral-500">
          Lo usamos para coordinar la entrega de tus pedidos.
        </p>
      </div>

      {message && (
        <p
          role="status"
          className={`rounded-lg px-3 py-2 text-sm ${
            message.type === 'ok'
              ? 'bg-green-500/10 text-green-600 dark:text-green-400'
              : 'bg-red-500/10 text-red-600 dark:text-red-400'
          }`}
        >
          {message.text}
        </p>
      )}

      <SubmitButton />
    </form>
  )
}
