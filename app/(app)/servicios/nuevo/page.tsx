import { PageHeader } from "@/components/ui/Misc";
import { ServiceForm } from "@/components/app/forms/ServiceForm";
import { crearServicio } from "@/lib/actions/servicios";
import { requireOwner } from "@/lib/session";

export default async function NuevoServicioPage() {
  await requireOwner();
  return (
    <div>
      <PageHeader title="Nuevo servicio" />
      <ServiceForm action={crearServicio} />
    </div>
  );
}
