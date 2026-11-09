import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/session";
import { PageHeader, EmptyState, FormError } from "@/components/ui/Misc";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { Plus } from "lucide-react";
import { EditLink, ToggleActiveButton } from "@/components/ui/TableActions";
import { formatCOP } from "@/lib/utils";
import {
  alternarServicioActivo,
  eliminarServicio,
} from "@/lib/actions/servicios";

export default async function ServiciosPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const session = await requireOwner();

  const servicios = await prisma.service.findMany({
    where: { businessId: session.user.businessId },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Servicios"
        description="El catálogo de servicios que ofrece tu negocio."
        action={<ButtonLink href="/servicios/nuevo">
            <Plus className="h-4 w-4" />
            Nuevo servicio
          </ButtonLink>}
      />

      {error === "en_uso" && (
        <div className="mb-4">
          <FormError message="No se puede eliminar: este servicio tiene citas asociadas. Desactívalo en su lugar." />
        </div>
      )}

      {servicios.length === 0 ? (
        <EmptyState
          icon="scissors"
          title="Aún no tienes servicios"
          description="Agrega tu primer servicio (por ejemplo: Corte de cabello, Manicure, Tinte)."
          action={<ButtonLink href="/servicios/nuevo">
            <Plus className="h-4 w-4" />
            Nuevo servicio
          </ButtonLink>}
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl glass animate-fade-in-up">
          <table className="w-full text-sm">
            <thead className="text-left text-[var(--muted)] border-b border-[var(--surface-border)]">
              <tr>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Categoría</th>
                <th className="px-4 py-3 font-medium">Duración</th>
                <th className="px-4 py-3 font-medium">Precio</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--surface-border)]">
              {servicios.map((s) => (
                <tr key={s.id} className="transition-colors hover:bg-[var(--surface)]">
                  <td className="px-4 py-3 font-medium text-[var(--foreground)]">
                    {s.name}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {s.category || "—"}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {s.durationMinutes} min
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {formatCOP(s.price)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={s.active ? "CONFIRMADA" : "CANCELADA"}>
                      {s.active ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <EditLink href={`/servicios/${s.id}/editar`} />
                      <form
                        action={alternarServicioActivo.bind(
                          null,
                          s.id,
                          !s.active
                        )}
                      >
                        <ToggleActiveButton active={s.active} />
                      </form>
                      <form action={eliminarServicio.bind(null, s.id)}>
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
