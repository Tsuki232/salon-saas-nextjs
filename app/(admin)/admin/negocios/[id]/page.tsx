import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/session";
import { PageHeader, FormSuccess, EmptyState } from "@/components/ui/Misc";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { RegistrarPagoForm } from "@/components/app/forms/RegistrarPagoForm";
import { CambiarPlanForm } from "@/components/app/forms/CambiarPlanForm";
import {
  registrarPago,
  cambiarPlan,
  cambiarEstadoNegocio,
  extenderDias,
} from "@/lib/actions/admin";
import { formatCOP, formatDateEs } from "@/lib/utils";
import { getPlan, effectivePrice } from "@/lib/plans";
import { BILLING_METHOD_LABELS } from "@/lib/labels";
import {
  hasAccess,
  daysLeft,
  effectiveStatus,
  STATUS_LABELS,
  STATUS_TONES,
} from "@/lib/subscription";

const OK_MESSAGES: Record<string, string> = {
  pago: "Pago registrado. El negocio quedó activo.",
  plan: "Plan actualizado.",
};

export default async function NegocioAdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string }>;
}) {
  const { id } = await params;
  const { ok } = await searchParams;
  await requireSuperAdmin();

  const negocio = await prisma.business.findUnique({
    where: { id },
    include: {
      users: { select: { name: true, email: true, role: true } },
      payments: { orderBy: { createdAt: "desc" }, take: 20 },
      _count: { select: { staff: true, clients: true, appointments: true, sales: true } },
    },
  });
  if (!negocio) notFound();

  const plan = getPlan(negocio.planId);
  const precio = effectivePrice(negocio);
  const activa = hasAccess(negocio);
  const restantes = daysLeft(negocio);
  const estado = effectiveStatus(negocio);
  const dueno = negocio.users.find((u) => u.role !== "EMPLOYEE");

  return (
    <div>
      <Link
        href="/admin"
        className="mb-3 inline-block text-sm font-medium text-[var(--accent-from)]"
      >
        ← Todos los negocios
      </Link>

      <PageHeader
        title={negocio.name}
        description={dueno ? `${dueno.name} · ${dueno.email}` : undefined}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <form action={extenderDias.bind(null, id, 7)}>
              <button
                type="submit"
                className="rounded-xl glass px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--surface-strong)]"
              >
                +7 días
              </button>
            </form>
            {negocio.subscriptionStatus === "SUSPENDIDA" ? (
              <form action={cambiarEstadoNegocio.bind(null, id, "ACTIVA")}>
                <button
                  type="submit"
                  className="rounded-xl glass px-3 py-2 text-sm font-medium text-emerald-600 transition-colors hover:bg-[var(--surface-strong)] dark:text-emerald-400"
                >
                  Reactivar
                </button>
              </form>
            ) : (
              <form action={cambiarEstadoNegocio.bind(null, id, "SUSPENDIDA")}>
                <button
                  type="submit"
                  className="rounded-xl glass px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-[var(--surface-strong)]"
                >
                  Suspender
                </button>
              </form>
            )}
          </div>
        }
      />

      {ok && OK_MESSAGES[ok] && (
        <div className="mb-4">
          <FormSuccess message={OK_MESSAGES[ok]} />
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-xs text-[var(--muted)]">Estado</p>
          <div className="mt-1">
            <Badge tone={STATUS_TONES[estado]}>
              {STATUS_LABELS[estado] ?? estado}
            </Badge>
          </div>
        </Card>
        <Card delay={0.05}>
          <p className="text-xs text-[var(--muted)]">Vence</p>
          <p className="text-sm font-semibold text-[var(--foreground)]">
            {negocio.paidUntil ? formatDateEs(negocio.paidUntil) : "—"}
          </p>
          <p
            className={`text-xs ${
              restantes < 0 ? "text-red-500" : "text-[var(--muted)]"
            }`}
          >
            {negocio.paidUntil
              ? restantes < 0
                ? `hace ${Math.abs(restantes)} días`
                : `en ${restantes} días`
              : "sin fecha"}
          </p>
        </Card>
        <Card delay={0.1}>
          <p className="text-xs text-[var(--muted)]">Plan {plan.label}</p>
          <p className="text-lg font-semibold text-gradient">
            {formatCOP(precio)}
          </p>
          {negocio.monthlyPrice !== null && (
            <p className="text-xs text-[var(--muted)]">precio acordado</p>
          )}
        </Card>
        <Card delay={0.15}>
          <p className="text-xs text-[var(--muted)]">Uso</p>
          <p className="text-sm text-[var(--foreground)]/80">
            {negocio._count.staff} personal · {negocio._count.clients} clientes
          </p>
          <p className="text-xs text-[var(--muted)]">
            {negocio._count.appointments} citas · {negocio._count.sales} ventas
          </p>
        </Card>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <RegistrarPagoForm
          action={registrarPago.bind(null, id)}
          precioMensual={precio}
        />
        <CambiarPlanForm
          action={cambiarPlan.bind(null, id)}
          planId={negocio.planId}
          monthlyPrice={negocio.monthlyPrice}
        />
      </div>

      <h2 className="mb-3 text-sm font-semibold text-[var(--foreground)]">
        Historial de pagos
      </h2>
      {negocio.payments.length === 0 ? (
        <EmptyState
          title="Sin pagos registrados"
          description={
            activa
              ? "Este negocio está en periodo de prueba."
              : "Registra el primer pago cuando te transfieran."
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl glass">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--surface-border)] text-left text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Medio</th>
                <th className="px-4 py-3 font-medium">Periodo cubierto</th>
                <th className="px-4 py-3 font-medium">Referencia</th>
                <th className="px-4 py-3 font-medium text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--surface-border)]">
              {negocio.payments.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-[var(--surface)]">
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {formatDateEs(p.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {BILLING_METHOD_LABELS[p.method] ?? p.method}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {formatDateEs(p.periodStart)} → {formatDateEs(p.periodEnd)}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {p.reference || "—"}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-[var(--foreground)]">
                    {formatCOP(p.amount)}
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
