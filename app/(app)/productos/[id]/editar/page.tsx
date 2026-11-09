import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/session";
import { PageHeader } from "@/components/ui/Misc";
import { ProductForm } from "@/components/app/forms/ProductForm";
import { actualizarProducto } from "@/lib/actions/productos";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireOwner();

  const producto = await prisma.product.findFirst({
    where: { id, businessId: session.user.businessId },
  });
  if (!producto) notFound();

  return (
    <div>
      <PageHeader title="Editar producto" />
      <ProductForm
        action={actualizarProducto.bind(null, id)}
        defaultValues={producto}
      />
    </div>
  );
}
