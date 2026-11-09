import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/session";
import { PageHeader } from "@/components/ui/Misc";
import { StaffAccessForm } from "@/components/app/forms/StaffAccessForm";
import { guardarAccesoStaff } from "@/lib/actions/personal";

export default async function AccesoStaffPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireOwner();

  const staff = await prisma.staff.findFirst({
    where: { id, businessId: session.user.businessId },
    include: { user: true },
  });
  if (!staff) notFound();

  return (
    <div>
      <PageHeader
        title={`Acceso de ${staff.name}`}
        description="Cuenta con la que este integrante entra a la aplicación."
      />
      <StaffAccessForm
        action={guardarAccesoStaff.bind(null, id)}
        staffName={staff.name}
        currentEmail={staff.user?.email ?? null}
      />
    </div>
  );
}
