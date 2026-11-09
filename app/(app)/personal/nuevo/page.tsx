import { PageHeader } from "@/components/ui/Misc";
import { StaffForm } from "@/components/app/forms/StaffForm";
import { crearStaff } from "@/lib/actions/personal";
import { requireOwner } from "@/lib/session";

export default async function NuevoStaffPage() {
  await requireOwner();
  return (
    <div>
      <PageHeader title="Nuevo integrante del personal" />
      <StaffForm action={crearStaff} />
    </div>
  );
}
