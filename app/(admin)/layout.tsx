import Link from "next/link";
import { requireSuperAdmin } from "@/lib/session";
import { ThemeToggle } from "@/components/app/ThemeToggle";
import { cerrarSesion } from "@/lib/actions/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSuperAdmin();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="glass flex items-center justify-between rounded-none border-x-0 border-t-0 px-4 py-3 md:px-6">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex flex-col leading-tight">
            <span className="text-base font-semibold text-gradient">
              CitaFácil
            </span>
            <span className="text-xs text-[var(--muted)]">
              Panel de la plataforma
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
          >
            Mi negocio
          </Link>
          <span className="hidden text-xs text-[var(--muted)] sm:block">
            {session.user.name}
          </span>
          <form action={cerrarSesion}>
            <button
              type="submit"
              className="text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
            >
              Cerrar sesión
            </button>
          </form>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  );
}
