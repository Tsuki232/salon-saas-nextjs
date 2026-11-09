import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/Misc";
import { ButtonLink } from "@/components/ui/Button";
import { formatCOP, formatDateEs } from "@/lib/utils";
import { PLANS, getPlan, effectivePrice } from "@/lib/plans";
import {
  hasAccess,
  daysLeft,
  effectiveStatus,
  STATUS_LABELS,
  STATUS_TONES,
} from "@/lib/subscription";
import { PLATFORM, buildPaymentNoticeLink } from "@/lib/platform";
import { Check, MessageCircle, ArrowLeft, Receipt } from "lucide-react";

export default async function SuscripcionPage() {
  const session = await requireSession();

  const business = await prisma.business.findUnique({
    where: { id: session.user.businessId },
    select: {
      name: true,
      planId: true,
      monthlyPrice: true,
      subscriptionStatus: true,
      paidUntil: true,
      payments: { orderBy: { createdAt: "desc" }, take: 6 },
    },
  });
  if (!business) return null;

  const plan = getPlan(business.planId);
  const precio = effectivePrice(business);
  const activa = hasAccess(business);
  const restantes = daysLeft(business);
  const estado = effectiveStatus(business);

  const avisoLink = buildPaymentNoticeLink({
    businessName: business.name,
    planLabel: plan.label,
    amount: formatCOP(precio),
  });

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Tu plan"
        description={
          activa
            ? "Estado de tu suscripción a CitaFácil."
            : "Renueva para volver a usar CitaFácil. Tus datos están guardados."
        }
      />

      <Card className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-lg font-semibold text-[var(--foreground)]">
                Plan {plan.label}
              </span>
              <Badge tone={STATUS_TONES[estado]}>
                {STATUS_LABELS[estado] ?? estado}
              </Badge>
            </div>
            <p className="text-sm text-[var(--muted)]">{plan.description}</p>
            {business.paidUntil && (
              <p className="mt-2 text-sm text-[var(--foreground)]/80">
                {activa
                  ? `Vigente hasta el ${formatDateEs(business.paidUntil)} (${restantes} días).`
                  : `Venció el ${formatDateEs(business.paidUntil)}.`}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold text-gradient">
              {formatCOP(precio)}
            </p>
            <p className="text-xs text-[var(--muted)]">al mes</p>
          </div>
        </div>
      </Card>

      {!activa && (
        <Card className="mb-6" delay={0.05}>
          <h2 className="mb-3 text-sm font-semibold text-[var(--foreground)]">
            Cómo renovar
          </h2>
          <ol className="flex flex-col gap-3 text-sm text-[var(--foreground)]/80">
            <li>
              <span className="font-medium text-[var(--foreground)]">1.</span>{" "}
              Transfiere{" "}
              <span className="font-semibold text-[var(--accent-from)]">
                {formatCOP(precio)}
              </span>{" "}
              a:
              <div className="mt-2 flex flex-col gap-1 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] p-3 text-sm">
                {PLATFORM.nequi && (
                  <span>
                    <span className="text-[var(--muted)]">Nequi:</span>{" "}
                    <span className="font-medium">{PLATFORM.nequi}</span>
                  </span>
                )}
                {PLATFORM.bank && (
                  <span>
                    <span className="text-[var(--muted)]">Cuenta:</span>{" "}
                    <span className="font-medium">{PLATFORM.bank}</span>
                  </span>
                )}
                {!PLATFORM.nequi && !PLATFORM.bank && (
                  <span className="text-[var(--muted)]">
                    Comunícate con nosotros para conocer los medios de pago.
                  </span>
                )}
              </div>
            </li>
            <li>
              <span className="font-medium text-[var(--foreground)]">2.</span>{" "}
              Envíanos el comprobante.
            </li>
            <li>
              <span className="font-medium text-[var(--foreground)]">3.</span>{" "}
              Activamos tu cuenta y sigues trabajando normal.
            </li>
          </ol>
          {avisoLink && (
            <div className="mt-4">
              <a
                href={avisoLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4" />
                Avisar por WhatsApp que ya pagué
              </a>
            </div>
          )}
        </Card>
      )}

      <h2 className="mb-3 text-sm font-semibold text-[var(--foreground)]">
        Planes disponibles
      </h2>
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {PLANS.map((p, i) => {
          const actual = p.id === business.planId;
          return (
            <Card
              key={p.id}
              delay={i * 0.05}
              className={
                actual ? "ring-2 ring-[var(--accent-from)]/40" : undefined
              }
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold text-[var(--foreground)]">
                  {p.label}
                </span>
                {actual && <Badge tone="COMPLETADA">Tu plan</Badge>}
              </div>
              <p className="text-xl font-semibold text-gradient">
                {formatCOP(p.monthlyPrice)}
              </p>
              <p className="mb-3 text-xs text-[var(--muted)]">al mes</p>
              <ul className="flex flex-col gap-1.5">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-[var(--foreground)]/80"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-from)]" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>

      {business.payments.length > 0 && (
        <>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
            <Receipt className="h-4 w-4 text-[var(--accent-from)]" />
            Tus pagos
          </h2>
          <div className="overflow-x-auto rounded-2xl glass">
            <table className="w-full text-sm">
              <thead className="border-b border-[var(--surface-border)] text-left text-[var(--muted)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 font-medium">Cubre hasta</th>
                  <th className="px-4 py-3 font-medium text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--surface-border)]">
                {business.payments.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3 text-[var(--muted)]">
                      {formatDateEs(p.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-[var(--muted)]">
                      {formatDateEs(p.periodEnd)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-[var(--foreground)]">
                      {formatCOP(p.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activa && (
        <div className="mt-6">
          <ButtonLink href="/dashboard" variant="secondary">
            <ArrowLeft className="h-4 w-4" />
            Volver a la aplicación
          </ButtonLink>
        </div>
      )}
    </div>
  );
}
