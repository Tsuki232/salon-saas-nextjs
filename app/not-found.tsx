import Link from "next/link";
import { Scissors, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] shadow-lg shadow-[var(--accent-from)]/25">
        <Scissors className="h-6 w-6 text-white" strokeWidth={2.2} />
      </span>
      <p className="text-5xl font-semibold text-gradient">404</p>
      <h1 className="mt-3 text-xl font-semibold text-[var(--foreground)]">
        No encontramos esta página
      </h1>
      <p className="mt-2 max-w-sm text-sm text-[var(--muted)]">
        Puede que el enlace esté mal escrito o que el registro que buscabas ya
        no exista.
      </p>
      <Link
        href="/dashboard"
        className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[var(--accent-from)] via-[var(--accent-via)] to-[var(--accent-to)] px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-[var(--accent-from)]/25 transition-all hover:-translate-y-0.5 hover:shadow-xl"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al panel
      </Link>
    </div>
  );
}
