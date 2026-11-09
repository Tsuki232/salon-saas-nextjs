import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { PageHeader } from "@/components/ui/Misc";
import { AppointmentForm } from "@/components/app/forms/AppointmentForm";
import { crearCita } from "@/lib/actions/citas";
import { toDateInputValue } from "@/lib/utils";
import { staffScope } from "@/lib/permissions";

export default async function NuevaCitaPage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string; fecha?: string }>;
}) {
  const { clientId, fecha } = await searchParams;
  const session = await requireSession();
  const scope = staffScope(session.user);

  const [clients, staff, services] = await Promise.all([
    prisma.client.findMany({
      where: { businessId: session.user.businessId },
      orderBy: { name: "asc" },
    }),
    prisma.staff.findMany({
      where: {
        businessId: session.user.businessId,
        active: true,
        ...(scope ? { id: scope } : {}),
      },
      orderBy: { name: "asc" },
    }),
    prisma.service.findMany({
      where: { businessId: session.user.businessId, active: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div>
      <PageHeader title="Nueva cita" />
      {clients.length === 0 || staff.length === 0 || services.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">
          Antes de agendar necesitas al menos un cliente, un integrante del
          personal y un servicio activo registrados.
        </p>
      ) : (
        <AppointmentForm
          action={crearCita}
          clients={clients}
          staff={staff}
          services={services}
          defaultValues={
            clientId || fecha || scope
              ? {
                  clientId: clientId ?? "",
                  // Un empleado siempre se agenda a sí mismo.
                  staffId: scope ?? "",
                  serviceId: "",
                  date: fecha ?? toDateInputValue(new Date()),
                  time: "09:00",
                  notes: "",
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
