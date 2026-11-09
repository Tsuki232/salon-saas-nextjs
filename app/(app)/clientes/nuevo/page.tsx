import { PageHeader } from "@/components/ui/Misc";
import { ClientForm } from "@/components/app/forms/ClientForm";
import { crearCliente } from "@/lib/actions/clientes";

export default function NuevoClientePage() {
  return (
    <div>
      <PageHeader title="Nuevo cliente" />
      <ClientForm action={crearCliente} />
    </div>
  );
}
