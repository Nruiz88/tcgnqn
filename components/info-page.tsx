import type { ReactNode } from 'react'

export default function InfoPage({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string
  title: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
        {eyebrow}
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 text-sm leading-relaxed text-neutral-500 sm:text-base">
          {subtitle}
        </p>
      )}
      <div className="mt-8 border-t border-neutral-200 pt-8">{children}</div>
    </div>
  )
}

export function InfoSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="mb-9">
      <h2 className="font-display text-lg font-bold tracking-tight">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-neutral-600">
        {children}
      </div>
    </section>
  )
}