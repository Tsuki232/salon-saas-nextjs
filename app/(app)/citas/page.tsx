import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { PageHeader, EmptyState } from "@/components/ui/Misc";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StatusSelect } from "@/components/app/StatusSelect";
import { DateJumpInput } from "@/components/app/DateJumpInput";
import { staffScope } from "@/lib/permissions";
import { appointmentStatusLabel } from "@/lib/labels";
import { EditLink } from "@/components/ui/TableActions";
import {
  CalendarDays,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Wallet,
  MessageCircle,
} from "lucide-react";
import {
  formatCOP,
  formatDateEs,
  formatTimeEs,
  toDateInputValue,
  buildWhatsappReminderLink,
} from "@/lib/utils";

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

export default async function CitasPage({
  searchParams,
}: {
  searchParams: Promise<{ fecha?: string }>;
}) {
  const { fecha } = await searchParams;
  const session = await requireSession();
  const scope = staffScope(session.user);

  const fechaSeleccionada = fecha ?? toDateInputValue(new Date());
  const dayStart = new Date(`${fechaSeleccionada}T00:00:00`);
  const dayEnd = addDays(dayStart, 1);

  const [business, citas] = await Promise.all([
    prisma.business.findUnique({
      where: { id: session.user.businessId },
      select: { name: true },
    }),
    prisma.appointment.findMany({
      where: {
        businessId: session.user.businessId,
        startTime: { gte: dayStart, lt: dayEnd },
        ...(scope ? { staffId: scope } : {}),
      },
      include: { client: true, staff: true, service: true, sale: true },
      orderBy: { startTime: "asc" },
    }),
  ]);

  const anterior = toDateInputValue(addDays(dayStart, -1));
  const siguiente = toDateInputValue(addDays(dayStart, 1));
  const esHoy = fechaSeleccionada === toDateInputValue(new Date());

  const navLinkClass =
    "inline-flex items-center gap-1.5 rounded-xl glass px-3 py-1.5 text-sm transition-colors hover:bg-[var(--surface-strong)]";

  return (
    <div>
      <PageHeader
        title={scope ? "Mi agenda" : "Agenda"}
        description={formatDateEs(dayStart)}
        action={
          <ButtonLink href="/citas/nueva">
            <CalendarPlus className="h-4 w-4" />
            Nueva cita
          </ButtonLink>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Link href={`/citas?fecha=${anterior}`} className={navLinkClass}>
          <ChevronLeft className="h-4 w-4" />
          Día anterior
        </Link>
        {!esHoy && (
          <Link href="/citas" className={navLinkClass}>
            <CalendarDays className="h-4 w-4" />
            Hoy
          </Link>
        )}
        <Link href={`/citas?fecha=${siguiente}`} className={navLinkClass}>
          Día siguiente
          <ChevronRight className="h-4 w-4" />
        </Link>
        <div className="ml-auto">
          <DateJumpInput defaultValue={fechaSeleccionada} />
        </div>
      </div>

      {citas.length === 0 ? (
        <EmptyState
          icon="calendar"
          title="No hay citas para este día"
          description="Agenda una nueva cita para este día."
          action={
            <ButtonLink href={`/citas/nueva?fecha=${fechaSeleccionada}`}>
              <CalendarPlus className="h-4 w-4" />
              Nueva cita
            </ButtonLink>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl glass animate-fade-in-up">
          <table className="w-full text-sm">
            <thead className="text-left text-[var(--muted)] border-b border-[var(--surface-border)]">
              <tr>
                <th className="px-4 py-3 font-medium">Hora</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Servicio</th>
                <th className="px-4 py-3 font-medium">Con</th>
                <th className="px-4 py-3 font-medium">Precio</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--surface-border)]">
              {citas.map((c) => (
                <tr key={c.id} className="transition-colors hover:bg-[var(--surface)]">
                  <td className="px-4 py-3 text-[var(--muted)] whitespace-nowrap">
                    {formatTimeEs(c.startTime)}
                  </td>
                  <td className="px-4 py-3 font-medium text-[var(--foreground)]">
                    <Link
                      href={`/clientes/${c.clientId}`}
                      className="hover:text-[var(--accent-from)]"
                    >
                      {c.client.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {c.service.name}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    <span className="flex items-center gap-1.5">
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: c.staff.colorTag }}
                      />
                      {c.staff.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {formatCOP(c.service.price)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1.5">
                      <Badge tone={c.status}>
                        {appointmentStatusLabel(c.status)}
                      </Badge>
                      <StatusSelect id={c.id} status={c.status} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-end gap-1.5 text-right">
                      <div className="flex items-center gap-3">
                        <EditLink href={`/citas/${c.id}/editar`} />
                        {c.sale ? (
                          <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Cobrada
                          </span>
                        ) : (
                          <Link
                            href={`/caja?citaId=${c.id}`}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--foreground)]/80 transition-colors hover:text-[var(--foreground)]"
                          >
                            <Wallet className="h-3.5 w-3.5" />
                            Cobrar
                          </Link>
                        )}
                      </div>
                      {c.client.phone && (
                        <a
                          href={buildWhatsappReminderLink({
                            phone: c.client.phone,
                            clientName: c.client.name,
                            businessName: business?.name ?? "",
                            serviceName: c.service.name,
                            date: c.startTime,
                            time: c.startTime,
                          })}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 transition-colors hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          Recordatorio por WhatsApp
                        </a>
                      )}
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
