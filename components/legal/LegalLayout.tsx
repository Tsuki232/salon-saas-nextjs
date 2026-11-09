import Link from "next/link";
import { ArrowLeft, Scissors, FileText } from "lucide-react";
import { LEGAL, LEGAL_VIGENCIA, LEGAL_LINKS } from "@/lib/legal";

export function LegalPage({
  titulo,
  resumen,
  children,
}: {
  titulo: string;
  resumen: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="glass sticky top-0 z-30 rounded-none border-x-0 border-t-0">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] shadow-lg shadow-[var(--accent-from)]/25">
              <Scissors className="h-[18px] w-[18px] text-white" strokeWidth={2.2} />
            </span>
            <span className="text-lg font-semibold text-gradient">
              {LEGAL.marca}
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <div className="mb-8">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-from)]/10 px-3 py-1 text-xs font-medium text-[var(--accent-from)] ring-1 ring-inset ring-[var(--accent-from)]/20">
            <FileText className="h-3.5 w-3.5" />
            Documento legal
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">
            {titulo}
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">{resumen}</p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Última actualización: {LEGAL_VIGENCIA} · Vigente desde su
            publicación.
          </p>
        </div>

        <article className="legal-prose">{children}</article>

        <section className="glass mt-10 rounded-2xl p-5">
          <h2 className="mb-2 text-sm font-semibold text-[var(--foreground)]">
            Responsable del servicio
          </h2>
          <ul className="flex flex-col gap-1 text-sm text-[var(--muted)]">
            <li>
              <strong className="text-[var(--foreground)]/80">Titular:</strong>{" "}
              {LEGAL.razonSocial}
            </li>
            <li>
              <strong className="text-[var(--foreground)]/80">
                Identificación:
              </strong>{" "}
              {LEGAL.documento}
            </li>
            <li>
              <strong className="text-[var(--foreground)]/80">
                Domicilio:
              </strong>{" "}
              {LEGAL.direccion}
            </li>
            <li>
              <strong className="text-[var(--foreground)]/80">Correo:</strong>{" "}
              {LEGAL.email}
            </li>
            <li>
              <strong className="text-[var(--foreground)]/80">
                Teléfono:
              </strong>{" "}
              {LEGAL.telefono}
            </li>
          </ul>
        </section>

        <nav className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-[var(--surface-border)] pt-6">
          {LEGAL_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-[var(--accent-from)] transition-opacity hover:opacity-80"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </main>
    </div>
  );
}
