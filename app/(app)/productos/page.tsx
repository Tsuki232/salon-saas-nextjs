import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/session";
import { PageHeader, EmptyState } from "@/components/ui/Misc";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { Plus } from "lucide-react";
import { EditLink, ToggleActiveButton } from "@/components/ui/TableActions";
import { formatCOP } from "@/lib/utils";
import {
  alternarProductoActivo,
  eliminarProducto,
} from "@/lib/actions/productos";

export default async function ProductosPage() {
  const session = await requireOwner();

  const productos = await prisma.product.findMany({
    where: { businessId: session.user.businessId },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Productos"
        description="Productos que vendes en tu negocio (shampoo, tintes, etc.)."
        action={<ButtonLink href="/productos/nuevo">
            <Plus className="h-4 w-4" />
            Nuevo producto
          </ButtonLink>}
      />

      {productos.length === 0 ? (
        <EmptyState
          icon="package"
          title="Aún no tienes productos"
          description="Agrega productos que vendas junto a tus servicios."
          action={<ButtonLink href="/productos/nuevo">
            <Plus className="h-4 w-4" />
            Nuevo producto
          </ButtonLink>}
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl glass animate-fade-in-up">
          <table className="w-full text-sm">
            <thead className="text-left text-[var(--muted)] border-b border-[var(--surface-border)]">
              <tr>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Precio</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--surface-border)]">
              {productos.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-[var(--surface)]">
                  <td className="px-4 py-3 font-medium text-[var(--foreground)]">
                    {p.name}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {formatCOP(p.price)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        p.stock <= 3
                          ? "text-red-500 font-medium"
                          : "text-[var(--muted)]"
                      }
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={p.active ? "CONFIRMADA" : "CANCELADA"}>
                      {p.active ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <EditLink href={`/productos/${p.id}/editar`} />
                      <form
                        action={alternarProductoActivo.bind(null, p.id, !p.active)}
                      >
                        <ToggleActiveButton active={p.active} />
                      </form>
                      <form action={eliminarProducto.bind(null, p.id)}>
                        <DeleteButton />
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
