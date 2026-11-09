import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { PageHeader } from "@/components/ui/Misc";
import { ClientForm } from "@/components/app/forms/ClientForm";
import { actualizarCliente } from "@/lib/actions/clientes";

export default async function EditarClientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireSession();

  const cliente = await prisma.client.findFirst({
    where: { id, businessId: session.user.businessId },
  });
  if (!cliente) notFound();

  return (
    <div>
      <PageHeader title="Editar cliente" />
      <ClientForm
        action={actualizarCliente.bind(null, id)}
        defaultValues={cliente}
        cancelHref={`/clientes/${id}`}
      />
    </div>
  );
}
