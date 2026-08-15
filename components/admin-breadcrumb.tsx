'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@/components/admin-ui'

const LABELS: [RegExp, string][] = [
  [/^\/admin\/cartas\/new/, 'Cartas / Nueva carta'],
  [/^\/admin\/cartas\/.+\/edit/, 'Cartas / Editar carta'],
  [/^\/admin\/cartas/, 'Cartas'],
  [/^\/admin\/products\/new/, 'Productos / Nuevo producto'],
  [/^\/admin\/products\/.+\/edit/, 'Productos / Editar producto'],
  [/^\/admin\/orders/, 'Pedidos'],
  [/^\/admin\/categories/, 'Categorías'],
  [/^\/admin\/games/, 'Juegos'],
  [/^\/admin\/coupons/, 'Cupones'],
  [/^\/admin\/settings/, 'Configuración'],
  [/^\/admin/, 'Productos'],
]

export default function AdminBreadcrumb() {
  const pathname = usePathname()
  const match = LABELS.find(([re]) => re.test(pathname))
  const section = match?.[1] ?? 'Panel'

  return (
    <nav aria-label="Migajas de pan" className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-neutral-500">
      <Link
        href="/admin"
        className="flex shrink-0 items-center gap-1.5 transition hover:text-neutral-900 dark:hover:text-neutral-200"
      >
        <Icon name="sparkles" className="h-3.5 w-3.5 text-indigo-500" />
        Admin
      </Link>
      <span aria-hidden className="shrink-0 text-neutral-400">
        /
      </span>
      <span className="truncate text-neutral-400">{section}</span>
    </nav>
  )
}
