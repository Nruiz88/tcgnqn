'use client'

import { useState } from 'react'
import { signIn, signUp } from '@/lib/actions'

export default function AuthForm({
  error,
  registered,
}: {
  error: string | null
  registered: boolean
}) {
  const [mode, setMode] = useState<'login' | 'register'>('login')

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold">
        {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
      </h1>

      {registered && (
        <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          Cuenta creada. Ya podés iniciar sesión.
        </p>
      )}
      {error && (
        <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <form
        action={mode === 'login' ? signIn : signUp}
        className="mt-6 space-y-4"
      >
        {mode === 'register' && (
          <div>
            <label className="text-sm font-medium">Nombre completo</label>
            <input
              name="full_name"
              required
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
        )}
        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            required
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Contraseña</label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#24272c]"
        >
          {mode === 'login' ? 'Ingresar' : 'Registrarme'}
        </button>
      </form>

      <p className="mt-4 text-sm text-neutral-600">
        {mode === 'login' ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}{' '}
        <button
          onClick={() =>
            setMode(mode === 'login' ? 'register' : 'login')
          }
          className="font-medium underline"
        >
          {mode === 'login' ? 'Crear cuenta' : 'Iniciar sesión'}
        </button>
      </p>
    </div>
  )
}
