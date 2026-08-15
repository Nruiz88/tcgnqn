export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Encabezado simulado */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-neutral-100 dark:bg-neutral-800/60" />
        <div className="space-y-2">
          <div className="h-5 w-40 rounded-lg bg-neutral-100 dark:bg-neutral-800/60" />
          <div className="h-3 w-56 rounded bg-neutral-100 dark:bg-neutral-800/60" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-neutral-200 bg-surface p-4 sm:p-5"
          >
            <div className="h-9 w-9 rounded-xl bg-neutral-100 dark:bg-neutral-800/60" />
            <div className="mt-3 h-3 w-20 rounded bg-neutral-100 dark:bg-neutral-800/60" />
            <div className="mt-2 h-6 w-16 rounded bg-neutral-100 dark:bg-neutral-800/60" />
            <div className="mt-2 h-3 w-28 rounded bg-neutral-100 dark:bg-neutral-800/60" />
          </div>
        ))}
      </div>

      {/* Lista */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-2 rounded-2xl border border-neutral-200 bg-surface p-4 lg:col-span-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 rounded-xl p-2">
              <div className="h-12 w-12 rounded-lg bg-neutral-100 dark:bg-neutral-800/60" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/2 rounded bg-neutral-100 dark:bg-neutral-800/60" />
                <div className="h-3 w-2/3 rounded bg-neutral-100 dark:bg-neutral-800/60" />
              </div>
              <div className="h-8 w-24 rounded-lg bg-neutral-100 dark:bg-neutral-800/60" />
            </div>
          ))}
        </div>
        <div className="space-y-2 rounded-2xl border border-neutral-200 bg-surface p-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl p-2.5">
              <div className="h-9 w-9 rounded-lg bg-neutral-100 dark:bg-neutral-800/60" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 rounded bg-neutral-100 dark:bg-neutral-800/60" />
                <div className="h-3 w-16 rounded bg-neutral-100 dark:bg-neutral-800/60" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
