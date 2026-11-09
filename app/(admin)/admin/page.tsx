import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/session";
import { PageHeader, EmptyState } from "@/components/ui/Misc";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCOP, formatDateEs } from "@/lib/utils";
import { getPlan, effectivePrice } from "@/lib/plans";
import {
  hasAccess,
  daysLeft,
  effectiveStatus,
  STATUS_LABELS,
  STATUS_TONES,
} from "@/lib/subscription";

export default async function AdminPage() {
  await requireSuperAdmin();

  const negocios = await prisma.business.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      users: {
        where: { role: { in: ["OWNER", "SUPERADMIN"] } },
        select: { email: true },
        take: 1,
      },
      _count: { select: { staff: true, appointments: true, clients: true } },
    },
  });

  const activos = negocios.filter((n) => hasAccess(n));
  const enPrueba = activos.filter((n) => n.subscriptionStatus === "PRUEBA");
  const pagando = activos.filter((n) => n.subscriptionStatus === "ACTIVA");
  const vencidos = negocios.filter((n) => !hasAccess(n));

  // Ingreso recurrente mensual: solo los que realmente pagan.
  const mrr = pagando.reduce((sum, n) => sum + effectivePrice(n), 0);

  const stats = [
    { label: "Negocios registrados", value: String(negocios.length) },
    { label: "Pagando", value: String(pagando.length) },
    { label: "En prueba", value: String(enPrueba.length) },
    { label: "Ingreso mensual", value: formatCOP(mrr) },
  ];

  return (
    <div>
      <PageHeader
        title="Negocios suscritos"
        description="Todos los salones que usan CitaFácil."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Card key={s.label} delay={i * 0.05}>
            <p className="text-xs text-[var(--muted)]">{s.label}</p>
            <p className="text-xl font-semibold text-gradient">{s.value}</p>
          </Card>
        ))}
      </div>

      {vencidos.length > 0 && (
        <p className="mb-4 text-sm text-[var(--muted)]">
          <span className="font-medium text-red-500">{vencidos.length}</span>{" "}
          {vencidos.length === 1
            ? "negocio está sin acceso"
            : "negocios están sin acceso"}{" "}
          (vencidos o suspendidos).
        </p>
      )}

      {negocios.length === 0 ? (
        <EmptyState title="Todavía no hay negocios registrados" />
      ) : (
        <div className="overflow-x-auto rounded-2xl glass animate-fade-in-up">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--surface-border)] text-left text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3 font-medium">Negocio</th>
                <th className="px-4 py-3 font-medium">Plan</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Vence</th>
                <th className="px-4 py-3 font-medium">Uso</th>
                <th className="px-4 py-3 font-medium text-right">Mensual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--surface-border)]">
              {negocios.map((n) => {
                const estado = effectiveStatus(n);
                const restantes = daysLeft(n);
                return (
                  <tr
                    key={n.id}
                    className="transition-colors hover:bg-[var(--surface)]"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/negocios/${n.id}`}
                        className="font-medium text-[var(--foreground)] hover:text-[var(--accent-from)]"
                      >
                        {n.name}
                      </Link>
                      <p className="text-xs text-[var(--muted)]">
                        {n.users[0]?.email ?? "sin dueño"}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-[var(--muted)]">
                      {getPlan(n.planId).label}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={STATUS_TONES[estado]}>
                        {STATUS_LABELS[estado] ?? estado}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-[var(--muted)]">
                      {n.paidUntil ? (
                        <>
                          {formatDateEs(n.paidUntil)}
                          <span
                            className={`block text-xs ${
                              restantes < 0
                                ? "text-red-500"
                                : restantes <= 5
                                  ? "text-amber-500"
                                  : "text-[var(--muted)]"
                            }`}
                          >
                            {restantes < 0
                              ? `hace ${Math.abs(restantes)} días`
                              : `en ${restantes} días`}
                          </span>
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--muted)]">
                      {n._count.staff} personal · {n._count.clients} clientes
                      <span className="block">
                        {n._count.appointments} citas
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-[var(--foreground)]">
                      {formatCOP(effectivePrice(n))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
