'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch {}
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 transition hover:bg-neutral-100"
    >
      {dark ? (
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm4.9 2.1a1 1 0 0 1 0 1.4l-.7.7a1 1 0 1 1-1.4-1.4l.7-.7a1 1 0 0 1 1.4 0Zm3.1 4.9a1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1Zm-14 0a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1Zm1.6 5.9a1 1 0 0 1 1.4 0l.7.7a1 1 0 1 1-1.4 1.4l-.7-.7a1 1 0 0 1 0-1.4Zm8.4 0a1 1 0 0 1 0 1.4l-.7.7a1 1 0 1 1-1.4-1.4l.7-.7a1 1 0 0 1 1.4 0ZM10 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-4a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm4.9 2.1a1 1 0 0 1 0 1.4l-.7.7a1 1 0 1 1-1.4-1.4l.7-.7a1 1 0 0 1 1.4 0ZM5 10a5 5 0 0 1 10 0v2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-2Zm1 4h8v.5A2.5 2.5 0 0 1 11.5 17h-3A2.5 2.5 0 0 1 6 14.5V14Z" />
        </svg>
      ) : (
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.3 12.4A8 8 0 1 1 7.6 2.7a.75.75 0 0 1 .5 1.25A5.75 5.75 0 0 0 16.5 12a.75.75 0 0 1 .8.4Z" />
        </svg>
      )}
    </button>
  )
}