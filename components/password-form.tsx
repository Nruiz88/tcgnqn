'use client'

import { useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { updatePassword } from '@/lib/actions'

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
      {pending ? 'Actualizando…' : 'Actualizar contraseña'}
    </button>
  )
}

export default function PasswordForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [message, setMessage] = useState<{
    type: 'ok' | 'error'
    text: string
  } | null>(null)

  return (
    <form
      ref={formRef}
      action={async (formData: FormData) => {
        const result = await updatePassword(formData)
        if (result?.error) {
          setMessage({ type: 'error', text: result.error })
          return
        }
        setMessage({ type: 'ok', text: 'Contraseña actualizada correctamente.' })
        formRef.current?.reset()
      }}
      className="space-y-4"
    >
      <div>
        <label className={labelCls}>Nueva contraseña</label>
        <input
          type="password"
          name="password"
          required
          minLength={6}
          autoComplete="new-password"
          className={inputCls}
        />
      </div>
      <div>
        <label className={labelCls}>Confirmar contraseña</label>
        <input
          type="password"
          name="confirm"
          required
          minLength={6}
          autoComplete="new-password"
          className={inputCls}
        />
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
