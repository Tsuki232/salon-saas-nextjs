import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/session";
import { PageHeader } from "@/components/ui/Misc";
import { ServiceForm } from "@/components/app/forms/ServiceForm";
import { actualizarServicio } from "@/lib/actions/servicios";

export default async function EditarServicioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireOwner();

  const servicio = await prisma.service.findFirst({
    where: { id, businessId: session.user.businessId },
  });
  if (!servicio) notFound();

  return (
    <div>
      <PageHeader title="Editar servicio" />
      <ServiceForm
        action={actualizarServicio.bind(null, id)}
        defaultValues={servicio}
      />
    </div>
  );
}
