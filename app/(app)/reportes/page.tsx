import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/session";
import { PageHeader, EmptyState } from "@/components/ui/Misc";
import { Card } from "@/components/ui/Card";
import { formatCOP } from "@/lib/utils";
import { TrendingUp, CalendarRange, CalendarCheck } from "lucide-react";

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export default async function ReportesPage() {
  const session = await requireOwner();
  const businessId = session.user.businessId;

  const now = new Date();
  const todayStart = startOfDay(now);
  const weekStart = new Date(todayStart.getTime() - 6 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [ingresosHoy, ingresosSemana, ingresosMes, citasCompletadasMes, topServicios, topStaffRaw] =
    await Promise.all([
      prisma.sale.aggregate({
        where: { businessId, createdAt: { gte: todayStart } },
        _sum: { total: true },
      }),
      prisma.sale.aggregate({
        where: { businessId, createdAt: { gte: weekStart } },
        _sum: { total: true },
      }),
      prisma.sale.aggregate({
        where: { businessId, createdAt: { gte: monthStart } },
        _sum: { total: true },
      }),
      prisma.appointment.count({
        where: {
          businessId,
          status: "COMPLETADA",
          startTime: { gte: monthStart },
        },
      }),
      prisma.saleItem.groupBy({
        by: ["description"],
        where: {
          type: "SERVICE",
          sale: { businessId, createdAt: { gte: monthStart } },
        },
        _sum: { subtotal: true, quantity: true },
        orderBy: { _sum: { subtotal: "desc" } },
        take: 5,
      }),
      prisma.sale.groupBy({
        by: ["staffId"],
        where: { businessId, createdAt: { gte: monthStart }, staffId: { not: null } },
        _sum: { total: true },
        orderBy: { _sum: { total: "desc" } },
        take: 5,
      }),
    ]);

  const staffIds = topStaffRaw.map((s) => s.staffId!).filter(Boolean);
  const staffRecords = staffIds.length
    ? await prisma.staff.findMany({ where: { id: { in: staffIds } } })
    : [];
  const topStaff = topStaffRaw.map((s) => ({
    name: staffRecords.find((st) => st.id === s.staffId)?.name ?? "—",
    total: s._sum.total ?? 0,
  }));

  const stats = [
    {
      label: "Ingresos hoy",
      value: formatCOP(ingresosHoy._sum.total ?? 0),
      icon: TrendingUp,
    },
    {
      label: "Últimos 7 días",
      value: formatCOP(ingresosSemana._sum.total ?? 0),
      icon: CalendarRange,
    },
    {
      label: "Este mes",
      value: formatCOP(ingresosMes._sum.total ?? 0),
      icon: CalendarRange,
    },
    {
      label: "Citas completadas (mes)",
      value: String(citasCompletadasMes),
      icon: CalendarCheck,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Reportes"
        description="Un vistazo rápido al desempeño de tu negocio."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} delay={i * 0.05}>
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs text-[var(--muted)]">{s.label}</p>
                <Icon className="h-4 w-4 shrink-0 text-[var(--muted)]" />
              </div>
              <p className="mt-1 text-xl font-semibold text-gradient">
                {s.value}
              </p>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-sm font-semibold text-[var(--foreground)]">
            Servicios más vendidos (este mes)
          </h2>
          {topServicios.length === 0 ? (
            <EmptyState icon="scissors" title="Sin ventas de servicios este mes" />
          ) : (
            <div className="overflow-hidden rounded-2xl glass animate-fade-in-up">
              <table className="w-full text-sm">
                <thead className="text-left text-[var(--muted)] border-b border-[var(--surface-border)]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Servicio</th>
                    <th className="px-4 py-3 font-medium">Cantidad</th>
                    <th className="px-4 py-3 font-medium text-right">
                      Ingresos
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--surface-border)]">
                  {topServicios.map((s) => (
                    <tr key={s.description} className="transition-colors hover:bg-[var(--surface)]">
                      <td className="px-4 py-3 text-[var(--foreground)]">
                        {s.description}
                      </td>
                      <td className="px-4 py-3 text-[var(--muted)]">
                        {s._sum.quantity ?? 0}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-[var(--foreground)]">
                        {formatCOP(s._sum.subtotal ?? 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-[var(--foreground)]">
            Personal con más ingresos (este mes)
          </h2>
          {topStaff.length === 0 ? (
            <EmptyState icon="user-cog" title="Sin ventas asociadas a personal este mes" />
          ) : (
            <div className="overflow-hidden rounded-2xl glass animate-fade-in-up">
              <table className="w-full text-sm">
                <thead className="text-left text-[var(--muted)] border-b border-[var(--surface-border)]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Integrante</th>
                    <th className="px-4 py-3 font-medium text-right">
                      Ingresos generados
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--surface-border)]">
                  {topStaff.map((s, i) => (
                    <tr key={i} className="transition-colors hover:bg-[var(--surface)]">
                      <td className="px-4 py-3 text-[var(--foreground)]">{s.name}</td>
                      <td className="px-4 py-3 text-right font-medium text-[var(--foreground)]">
                        {formatCOP(s.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
