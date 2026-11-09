import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { PageHeader, EmptyState } from "@/components/ui/Misc";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCOP, formatDateEs, formatTimeEs } from "@/lib/utils";
import { appointmentStatusLabel, salePaymentLabel } from "@/lib/labels";
import {
  CalendarPlus,
  CalendarDays,
  Pencil,
  Wallet,
  StickyNote,
  ArrowLeft,
} from "lucide-react";

export default async function DetalleClientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireSession();

  const cliente = await prisma.client.findFirst({
    where: { id, businessId: session.user.businessId },
    include: {
      appointments: {
        orderBy: { startTime: "desc" },
        include: { service: true, staff: true },
        take: 20,
      },
      sales: {
        orderBy: { createdAt: "desc" },
        include: { items: true },
        take: 20,
      },
    },
  });
  if (!cliente) notFound();

  const totalGastado = cliente.sales.reduce((sum, s) => sum + s.total, 0);

  return (
    <div>
      <PageHeader
        title={cliente.name}
        description={cliente.phone ?? cliente.email ?? undefined}
        action={
          <div className="flex gap-2">
            <ButtonLink href={`/citas/nueva?clientId=${cliente.id}`}>
              <CalendarPlus className="h-4 w-4" />
              Agendar cita
            </ButtonLink>
            <ButtonLink href={`/clientes/${cliente.id}/editar`} variant="secondary">
              <Pencil className="h-4 w-4" />
              Editar
            </ButtonLink>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs text-[var(--muted)]">Total gastado</p>
            <Wallet className="h-4 w-4 shrink-0 text-[var(--muted)]" />
          </div>
          <p className="mt-1 text-lg font-semibold text-[var(--foreground)]">
            {formatCOP(totalGastado)}
          </p>
        </Card>
        <Card delay={0.05}>
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs text-[var(--muted)]">Citas registradas</p>
            <CalendarDays className="h-4 w-4 shrink-0 text-[var(--muted)]" />
          </div>
          <p className="mt-1 text-lg font-semibold text-[var(--foreground)]">
            {cliente.appointments.length}
          </p>
        </Card>
        <Card delay={0.1}>
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs text-[var(--muted)]">Notas</p>
            <StickyNote className="h-4 w-4 shrink-0 text-[var(--muted)]" />
          </div>
          <p className="mt-1 text-sm text-[var(--foreground)]/80">
            {cliente.notes || "—"}
          </p>
        </Card>
      </div>

      <h2 className="text-sm font-semibold text-[var(--foreground)] mb-3">
        Historial de citas
      </h2>
      {cliente.appointments.length === 0 ? (
        <div className="mb-8">
          <EmptyState icon="calendar" title="Sin citas registradas todavía" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl glass animate-fade-in-up mb-8">
          <table className="w-full text-sm">
            <thead className="text-left text-[var(--muted)] border-b border-[var(--surface-border)]">
              <tr>
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Servicio</th>
                <th className="px-4 py-3 font-medium">Con</th>
                <th className="px-4 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--surface-border)]">
              {cliente.appointments.map((a) => (
                <tr key={a.id} className="transition-colors hover:bg-[var(--surface)]">
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {formatDateEs(a.startTime)} · {formatTimeEs(a.startTime)}
                  </td>
                  <td className="px-4 py-3 text-[var(--foreground)]">
                    {a.service.name}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {a.staff.name}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={a.status}>
                      {appointmentStatusLabel(a.status)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="text-sm font-semibold text-[var(--foreground)] mb-3">
        Historial de compras
      </h2>
      {cliente.sales.length === 0 ? (
        <EmptyState icon="shopping-bag" title="Sin compras registradas todavía" />
      ) : (
        <div className="overflow-x-auto rounded-2xl glass animate-fade-in-up">
          <table className="w-full text-sm">
            <thead className="text-left text-[var(--muted)] border-b border-[var(--surface-border)]">
              <tr>
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Detalle</th>
                <th className="px-4 py-3 font-medium">Pago</th>
                <th className="px-4 py-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--surface-border)]">
              {cliente.sales.map((s) => (
                <tr key={s.id} className="transition-colors hover:bg-[var(--surface)]">
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {formatDateEs(s.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {s.items.map((i) => i.description).join(", ")}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {salePaymentLabel(s.paymentMethod)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-[var(--foreground)]">
                    {formatCOP(s.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6">
        <Link
          href="/clientes"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-from)] transition-opacity hover:opacity-80"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a clientes
        </Link>
      </div>
    </div>
  );
}
