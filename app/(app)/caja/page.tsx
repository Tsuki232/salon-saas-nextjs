import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { PageHeader } from "@/components/ui/Misc";
import { CajaForm } from "@/components/app/forms/CajaForm";
import { staffScope } from "@/lib/permissions";

export default async function CajaPage({
  searchParams,
}: {
  searchParams: Promise<{ citaId?: string }>;
}) {
  const { citaId } = await searchParams;
  const session = await requireSession();
  const businessId = session.user.businessId;
  const scope = staffScope(session.user);

  const [services, products, clients, cita] = await Promise.all([
    prisma.service.findMany({
      where: { businessId, active: true },
      orderBy: { name: "asc" },
    }),
    prisma.product.findMany({
      where: { businessId, active: true },
      orderBy: { name: "asc" },
    }),
    prisma.client.findMany({
      where: { businessId },
      orderBy: { name: "asc" },
    }),
    citaId
      ? prisma.appointment.findFirst({
          where: {
            id: citaId,
            businessId,
            ...(scope ? { staffId: scope } : {}),
          },
          include: { service: true, client: true, sale: true },
        })
      : null,
  ]);

  const initialCart =
    cita && !cita.sale
      ? [
          {
            type: "SERVICE" as const,
            id: cita.service.id,
            name: cita.service.name,
            unitPrice: cita.service.price,
            quantity: 1,
          },
        ]
      : [];

  return (
    <div>
      <PageHeader
        title="Caja"
        description={
          cita
            ? `Cobrando la cita de ${cita.client.name}`
            : "Registra una venta de servicios o productos."
        }
      />
      <CajaForm
        services={services}
        products={products}
        clients={clients}
        defaultClientId={cita?.clientId}
        appointmentId={cita && !cita.sale ? cita.id : undefined}
        initialCart={initialCart}
      />
    </div>
  );
}
