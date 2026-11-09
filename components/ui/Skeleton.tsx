export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-[var(--foreground)]/10 ${className}`}
    />
  );
}

/** Encabezado + tarjetas de métricas + tabla: la forma de casi todas las páginas. */
export function PageSkeleton({
  stats = 4,
  rows = 5,
}: {
  stats?: number;
  rows?: number;
}) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      {stats > 0 && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: stats }).map((_, i) => (
            <div key={i} className="glass rounded-2xl p-5">
              <Skeleton className="mb-3 h-3 w-24" />
              <Skeleton className="h-6 w-28" />
            </div>
          ))}
        </div>
      )}

      <div className="glass overflow-hidden rounded-2xl">
        <div className="border-b border-[var(--surface-border)] px-4 py-3">
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
        <div className="divide-y divide-[var(--surface-border)]">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-4">
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="hidden h-4 w-24 sm:block" />
              <Skeleton className="hidden h-4 w-20 md:block" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
