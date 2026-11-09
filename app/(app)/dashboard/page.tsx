import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { PageHeader, EmptyState } from "@/components/ui/Misc";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { RevenueBars } from "@/components/app/RevenueBars";
import { QuickActionCard } from "@/components/app/QuickActionCard";
import { TodayAgendaList, type AgendaRow } from "@/components/app/TodayAgendaList";
import { formatTimeEs, toDateInputValue } from "@/lib/utils";
import { staffScope, isOwner } from "@/lib/permissions";
import {
  CalendarDays,
  CalendarPlus,
  Users,
  TrendingUp,
  Clock,
  CircleCheck,
  ArrowRight,
} from "lucide-react";

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export default async function DashboardPage() {
  const session = await requireSession();
  const businessId = session.user.businessId;
  const scope = staffScope(session.user);
  const owner = isOwner(session.user.role);

  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
  const weekAgoStart = new Date(todayStart.getTime() - 6 * 24 * 60 * 60 * 1000);

  const staffFilter = scope ? { staffId: scope } : {};

  const [
    citasHoy,
    ingresosHoy,
    totalClientes,
    totalPendientes,
    ventasSemana,
    citasCompletadasMes,
  ] = await Promise.all([
    prisma.appointment.findMany({
      where: {
        businessId,
        startTime: { gte: todayStart, lt: todayEnd },
        ...staffFilter,
      },
      include: { client: true, service: true, staff: true },
      orderBy: { startTime: "asc" },
    }),
    // Los ingresos del negocio solo los ve el dueño.
    owner
      ? prisma.sale.aggregate({
          where: { businessId, createdAt: { gte: todayStart } },
          _sum: { total: true },
        })
      : null,
    owner ? prisma.client.count({ where: { businessId } }) : null,
    prisma.appointment.count({
      where: {
        businessId,
        status: "PENDIENTE",
        startTime: { gte: todayStart },
        ...staffFilter,
      },
    }),
    owner
      ? prisma.sale.findMany({
          where: { businessId, createdAt: { gte: weekAgoStart } },
          select: { createdAt: true, total: true },
        })
      : null,
    !owner
      ? prisma.appointment.count({
          where: {
            businessId,
            status: "COMPLETADA",
            startTime: { gte: startOfDay(new Date(now.getFullYear(), now.getMonth(), 1)) },
            ...staffFilter,
          },
        })
      : null,
  ]);

  const ventas = ventasSemana ?? [];
  const days = Array.from({ length: 7 }, (_, idx) => {
    const d = new Date(todayStart.getTime() - (6 - idx) * 24 * 60 * 60 * 1000);
    const key = toDateInputValue(d);
    return {
      label: d.toLocaleDateString("es-CO", { weekday: "short" }).replace(".", ""),
      total: ventas
        .filter((s) => toDateInputValue(s.createdAt) === key)
        .reduce((sum, s) => sum + s.total, 0),
    };
  });

  const agendaRows: AgendaRow[] = citasHoy.map((c) => ({
    id: c.id,
    time: formatTimeEs(c.startTime),
    clientId: c.clientId,
    clientName: c.client.name,
    serviceName: c.service.name,
    staffName: c.staff.name,
    staffColor: c.staff.colorTag,
    status: c.status,
  }));

  const stats = owner
    ? [
        {
          label: "Ingresos de hoy",
          value: ingresosHoy?._sum.total ?? 0,
          currency: true,
          icon: TrendingUp,
        },
        {
          label: "Citas de hoy",
          value: citasHoy.length,
          currency: false,
          icon: CalendarDays,
        },
        {
          label: "Citas pendientes por confirmar",
          value: totalPendientes,
          currency: false,
          icon: Clock,
        },
        {
          label: "Clientes registrados",
          value: totalClientes ?? 0,
          currency: false,
          icon: Users,
        },
      ]
    : [
        {
          label: "Mis citas de hoy",
          value: citasHoy.length,
          currency: false,
          icon: CalendarDays,
        },
        {
          label: "Pendientes por confirmar",
          value: totalPendientes,
          currency: false,
          icon: Clock,
        },
        {
          label: "Completadas este mes",
          value: citasCompletadasMes ?? 0,
          currency: false,
          icon: CircleCheck,
        },
      ];

  return (
    <div>
      <PageHeader
        title={`Hola, ${session.user.name ?? ""}`}
        description={
          owner
            ? "Esto es lo que pasa hoy en tu negocio."
            : "Este es tu día de trabajo."
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-5">
        <QuickActionCard
          href="/citas/nueva"
          label="Nueva cita"
          icon="calendar-plus"
          gradient="from-[var(--accent-from)] to-[var(--accent-to)]"
        />
        <QuickActionCard
          href="/caja"
          label="Nueva venta"
          icon="wallet"
          gradient="from-emerald-500 to-teal-500"
          delay={0.05}
        />
        <QuickActionCard
          href="/clientes/nuevo"
          label="Nuevo cliente"
          icon="user-plus"
          gradient="from-sky-500 to-blue-500"
          delay={0.1}
        />
        {owner ? (
          <QuickActionCard
            href="/reportes"
            label="Ver reportes"
            icon="chart"
            gradient="from-amber-500 to-orange-500"
            delay={0.15}
          />
        ) : (
          <QuickActionCard
            href="/citas"
            label="Mi agenda"
            icon="calendar"
            gradient="from-amber-500 to-orange-500"
            delay={0.15}
          />
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} delay={i * 0.05}>
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs text-[var(--muted)]">{s.label}</p>
                <Icon className="h-4 w-4 shrink-0 text-[var(--muted)]" />
              </div>
              <p className="mt-1 text-xl font-semibold text-gradient">
                <AnimatedNumber value={s.value} currency={s.currency} />
              </p>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        {owner && (
          <Card className="lg:col-span-1" delay={0.1}>
            <p className="mb-4 text-sm font-semibold text-[var(--foreground)]">
              Ingresos — últimos 7 días
            </p>
            <RevenueBars days={days} />
          </Card>
        )}

        <div className={owner ? "lg:col-span-2" : "lg:col-span-3"}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              {owner ? "Agenda de hoy" : "Mi agenda de hoy"}
            </h2>
            <Link
              href={`/citas?fecha=${toDateInputValue(now)}`}
              className="group inline-flex items-center gap-1 text-sm font-medium text-[var(--accent-from)]"
            >
              Ver toda la agenda
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          {agendaRows.length === 0 ? (
            <EmptyState
              icon="calendar"
              title="No tienes citas agendadas para hoy"
              action={
                <ButtonLink href="/citas/nueva">
                  <CalendarPlus className="h-4 w-4" />
                  Nueva cita
                </ButtonLink>
              }
            />
          ) : (
            <TodayAgendaList rows={agendaRows} />
          )}
        </div>
      </div>
    </div>
  );
}
