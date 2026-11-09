import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/session";
import {
  PageHeader,
  EmptyState,
  FormError,
  FormSuccess,
} from "@/components/ui/Misc";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { Plus, KeyRound } from "lucide-react";
import { EditLink, ToggleActiveButton, AccessLink, SubmitTextButton } from "@/components/ui/TableActions";
import {
  alternarStaffActivo,
  eliminarStaff,
  quitarAccesoStaff,
} from "@/lib/actions/personal";

const ERROR_MESSAGES: Record<string, string> = {
  en_uso: "No se puede eliminar: tiene citas asociadas. Desactívalo en su lugar.",
  tiene_acceso:
    "No se puede eliminar: primero quítale el acceso a la aplicación.",
  es_dueno: "No puedes quitarle el acceso al dueño del negocio.",
};

const OK_MESSAGES: Record<string, string> = {
  acceso: "Acceso guardado. Ya puede entrar con ese correo y contraseña.",
  acceso_quitado: "Acceso retirado.",
};

export default async function PersonalPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const { error, ok } = await searchParams;
  const session = await requireOwner();

  const staff = await prisma.staff.findMany({
    where: { businessId: session.user.businessId },
    orderBy: { name: "asc" },
    include: { user: { select: { email: true, role: true } } },
  });

  return (
    <div>
      <PageHeader
        title="Personal"
        description="Los estilistas/empleados que atienden citas y quiénes pueden entrar a la app."
        action={<ButtonLink href="/personal/nuevo">
            <Plus className="h-4 w-4" />
            Nuevo integrante
          </ButtonLink>}
      />

      {error && ERROR_MESSAGES[error] && (
        <div className="mb-4">
          <FormError message={ERROR_MESSAGES[error]} />
        </div>
      )}
      {ok && OK_MESSAGES[ok] && (
        <div className="mb-4">
          <FormSuccess message={OK_MESSAGES[ok]} />
        </div>
      )}

      {staff.length === 0 ? (
        <EmptyState
          icon="user-cog"
          title="Aún no tienes personal registrado"
          description="Agrega a las personas que atienden citas en tu negocio."
          action={<ButtonLink href="/personal/nuevo">
            <Plus className="h-4 w-4" />
            Nuevo integrante
          </ButtonLink>}
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl glass animate-fade-in-up">
          <table className="w-full text-sm">
            <thead className="text-left text-[var(--muted)] border-b border-[var(--surface-border)]">
              <tr>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Teléfono</th>
                <th className="px-4 py-3 font-medium">Acceso a la app</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--surface-border)]">
              {staff.map((s) => (
                <tr key={s.id} className="transition-colors hover:bg-[var(--surface)]">
                  <td className="px-4 py-3 font-medium text-[var(--foreground)]">
                    <span className="flex items-center gap-2">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: s.colorTag }}
                      />
                      {s.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {s.phone || "—"}
                  </td>
                  <td className="px-4 py-3">
                    {s.user ? (
                      <div className="flex flex-col gap-1">
                        <Badge tone={s.user.role === "OWNER" ? "default" : "COMPLETADA"}>
                          {s.user.role === "OWNER" ? "Dueño" : "Empleado"}
                        </Badge>
                        <span className="text-xs text-[var(--muted)]">
                          {s.user.email}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-[var(--muted)]">
                        Sin acceso
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={s.active ? "CONFIRMADA" : "CANCELADA"}>
                      {s.active ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center justify-end gap-3">
                      <EditLink href={`/personal/${s.id}/editar`} />
                      <AccessLink
                        href={`/personal/${s.id}/acceso`}
                        hasAccess={!!s.user}
                      />
                      {s.user && s.user.role !== "OWNER" && (
                        <form action={quitarAccesoStaff.bind(null, s.id)}>
                          <SubmitTextButton icon={<KeyRound />}>
                            Quitar acceso
                          </SubmitTextButton>
                        </form>
                      )}
                      <form
                        action={alternarStaffActivo.bind(null, s.id, !s.active)}
                      >
                        <ToggleActiveButton active={s.active} />
                      </form>
                      <form action={eliminarStaff.bind(null, s.id)}>
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
