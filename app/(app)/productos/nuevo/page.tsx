import { PageHeader } from "@/components/ui/Misc";
import { ProductForm } from "@/components/app/forms/ProductForm";
import { crearProducto } from "@/lib/actions/productos";
import { requireOwner } from "@/lib/session";

export default async function NuevoProductoPage() {
  await requireOwner();
  return (
    <div>
      <PageHeader title="Nuevo producto" />
      <ProductForm action={crearProducto} />
    </div>
  );
}
