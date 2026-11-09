import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/session";
import { PageHeader } from "@/components/ui/Misc";
import { StaffForm } from "@/components/app/forms/StaffForm";
import { actualizarStaff } from "@/lib/actions/personal";

export default async function EditarStaffPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireOwner();

  const staff = await prisma.staff.findFirst({
    where: { id, businessId: session.user.businessId },
  });
  if (!staff) notFound();

  return (
    <div>
      <PageHeader title="Editar integrante del personal" />
      <StaffForm action={actualizarStaff.bind(null, id)} defaultValues={staff} />
    </div>
  );
}
