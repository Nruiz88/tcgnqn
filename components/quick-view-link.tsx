'use client'

import Link from 'next/link'

export default function QuickViewLink({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(
            'qv_from',
            window.location.pathname + window.location.search,
          )
        }
      }}
    >
      {children}
    </Link>
  )
}