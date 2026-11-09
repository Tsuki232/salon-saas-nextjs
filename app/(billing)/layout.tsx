import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { buildThemeStyleTag } from "@/lib/themes";
import { ThemeToggle } from "@/components/app/ThemeToggle";
import { cerrarSesion } from "@/lib/actions/auth";

export default async function BillingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();

  const business = await prisma.business.findUnique({
    where: { id: session.user.businessId },
    select: {
      name: true,
      logoUrl: true,
      themeName: true,
      customPrimary: true,
      customSecondary: true,
    },
  });

  const themeCss = business ? buildThemeStyleTag(business) : "";

  return (
    <>
      {themeCss && <style dangerouslySetInnerHTML={{ __html: themeCss }} />}
      <div className="flex min-h-screen flex-col">
        <header className="glass flex items-center justify-between rounded-none border-x-0 border-t-0 px-4 py-3 md:px-6">
          <div className="flex items-center gap-2.5">
            {business?.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={business.logoUrl}
                alt={business.name}
                className="h-8 w-8 rounded-lg object-cover ring-1 ring-[var(--surface-border)]"
              />
            )}
            <div className="flex flex-col leading-tight">
              <span className="text-base font-semibold text-gradient">
                CitaFácil
              </span>
              <span className="text-xs text-[var(--muted)]">
                {business?.name}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <form action={cerrarSesion}>
              <button
                type="submit"
                className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                Cerrar sesión
              </button>
            </form>
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </>
  );
}
