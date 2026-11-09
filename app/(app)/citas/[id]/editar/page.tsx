import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { PageHeader } from "@/components/ui/Misc";
import { AppointmentForm } from "@/components/app/forms/AppointmentForm";
import { actualizarCita } from "@/lib/actions/citas";
import { toDateInputValue, toTimeInputValue } from "@/lib/utils";
import { staffScope } from "@/lib/permissions";

export default async function EditarCitaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireSession();
  const scope = staffScope(session.user);

  const [cita, clients, staff, services] = await Promise.all([
    prisma.appointment.findFirst({
      where: {
        id,
        businessId: session.user.businessId,
        ...(scope ? { staffId: scope } : {}),
      },
    }),
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
  if (!cita) notFound();

  const start = new Date(cita.startTime);
  const date = toDateInputValue(start);
  const time = toTimeInputValue(start);

  return (
    <div>
      <PageHeader title="Editar cita" />
      <AppointmentForm
        action={actualizarCita.bind(null, id)}
        clients={clients}
        staff={staff}
        services={services}
        defaultValues={{
          clientId: cita.clientId,
          staffId: cita.staffId,
          serviceId: cita.serviceId,
          date,
          time,
          notes: cita.notes,
        }}
      />
    </div>
  );
}
