import { redirect } from "next/navigation";
import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app/AppShell";
import { Topbar } from "@/components/app/Topbar";
import { buildThemeStyleTag } from "@/lib/themes";
import { hasAccess, daysLeft } from "@/lib/subscription";
import { isSuperAdmin } from "@/lib/permissions";
import { TrialBanner } from "@/components/app/TrialBanner";

export default async function AppLayout({
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
      subscriptionStatus: true,
      paidUntil: true,
    },
  });

  // El candado: si la suscripción venció, no se entra a la app.
  // El superadmin nunca se queda por fuera.
  if (business && !isSuperAdmin(session.user.role) && !hasAccess(business)) {
    redirect("/suscripcion");
  }

  const themeCss = business ? buildThemeStyleTag(business) : "";
  const restantes = business ? daysLeft(business) : 0;
  const enPrueba = business?.subscriptionStatus === "PRUEBA";

  return (
    <>
      {themeCss && <style dangerouslySetInnerHTML={{ __html: themeCss }} />}
      <AppShell
        businessName={business?.name ?? ""}
        logoUrl={business?.logoUrl ?? null}
        role={session.user.role}
        topbar={
          <Topbar
            businessName={business?.name ?? ""}
            userName={session.user.name ?? ""}
            role={session.user.role}
          />
        }
      >
        {business && (enPrueba || restantes <= 5) && (
          <TrialBanner enPrueba={enPrueba} diasRestantes={restantes} />
        )}
        {children}
      </AppShell>
    </>
  );
}
