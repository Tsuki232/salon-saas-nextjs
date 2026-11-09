import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { PageHeader, EmptyState, FormError } from "@/components/ui/Misc";
import { ButtonLink } from "@/components/ui/Button";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { Plus } from "lucide-react";
import { EditLink } from "@/components/ui/TableActions";
import { eliminarCliente } from "@/lib/actions/clientes";

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; q?: string }>;
}) {
  const { error, q } = await searchParams;
  const session = await requireSession();

  const clientes = await prisma.client.findMany({
    where: {
      businessId: session.user.businessId,
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { phone: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Clientes"
        description="La base de clientes de tu negocio."
        action={<ButtonLink href="/clientes/nuevo">
            <Plus className="h-4 w-4" />
            Nuevo cliente
          </ButtonLink>}
      />

      {error === "en_uso" && (
        <div className="mb-4">
          <FormError message="No se puede eliminar: este cliente tiene citas asociadas." />
        </div>
      )}

      <form className="mb-4">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Buscar por nombre o teléfono..."
          className="w-full max-w-sm rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] backdrop-blur-md px-3.5 py-2.5 text-sm outline-none focus:border-[var(--accent-from)]/60 focus:ring-4 focus:ring-[var(--accent-from)]/15"
        />
      </form>

      {clientes.length === 0 ? (
        <EmptyState
          icon="users"
          title={q ? "No se encontraron clientes" : "Aún no tienes clientes"}
          description={
            q
              ? "Prueba con otro nombre o teléfono."
              : "Agrega tu primer cliente para empezar a agendar citas."
          }
          action={
            !q && <ButtonLink href="/clientes/nuevo">
            <Plus className="h-4 w-4" />
            Nuevo cliente
          </ButtonLink>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl glass animate-fade-in-up">
          <table className="w-full text-sm">
            <thead className="text-left text-[var(--muted)] border-b border-[var(--surface-border)]">
              <tr>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Teléfono</th>
                <th className="px-4 py-3 font-medium">Correo</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--surface-border)]">
              {clientes.map((c) => (
                <tr key={c.id} className="transition-colors hover:bg-[var(--surface)]">
                  <td className="px-4 py-3 font-medium text-[var(--foreground)]">
                    <Link
                      href={`/clientes/${c.id}`}
                      className="hover:text-[var(--accent-from)]"
                    >
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {c.phone || "—"}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {c.email || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <EditLink href={`/clientes/${c.id}/editar`} />
                      <form action={eliminarCliente.bind(null, c.id)}>
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
