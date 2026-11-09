import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { formatCOP, formatDateEs, formatTimeEs } from "@/lib/utils";
import { staffScope } from "@/lib/permissions";
import { salePaymentLabel } from "@/lib/labels";
import { ArrowLeft, BarChart3, CalendarDays } from "lucide-react";

export default async function ReciboPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireSession();
  const scope = staffScope(session.user);

  const [business, sale] = await Promise.all([
    prisma.business.findUnique({
      where: { id: session.user.businessId },
      select: { name: true, phone: true, address: true, logoUrl: true },
    }),
    prisma.sale.findFirst({
      where: {
        id,
        businessId: session.user.businessId,
        ...(scope ? { staffId: scope } : {}),
      },
      include: { items: true, client: true, staff: true },
    }),
  ]);
  if (!sale) notFound();

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <div className="mb-4 flex flex-col items-center text-center">
          {business?.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={business.logoUrl}
              alt={business.name}
              className="mb-2 h-12 w-12 rounded-xl object-cover ring-1 ring-[var(--surface-border)]"
            />
          )}
          <p className="text-base font-semibold text-[var(--foreground)]">
            {business?.name}
          </p>
          {business?.address && (
            <p className="text-xs text-[var(--muted)]">{business.address}</p>
          )}
          {business?.phone && (
            <p className="text-xs text-[var(--muted)]">{business.phone}</p>
          )}
        </div>

        <div className="mb-4 flex justify-between text-xs text-[var(--muted)]">
          <span>{formatDateEs(sale.createdAt)}</span>
          <span>{formatTimeEs(sale.createdAt)}</span>
        </div>

        {sale.client && (
          <p className="mb-2 text-sm text-[var(--foreground)]/80">
            Cliente: <span className="font-medium">{sale.client.name}</span>
          </p>
        )}
        {sale.staff && (
          <p className="mb-4 text-sm text-[var(--foreground)]/80">
            Atendió: <span className="font-medium">{sale.staff.name}</span>
          </p>
        )}

        <div className="divide-y divide-dashed divide-[var(--surface-border)] border-y border-dashed border-[var(--surface-border)] py-2">
          {sale.items.map((item) => (
            <div key={item.id} className="flex justify-between py-2 text-sm">
              <span className="text-[var(--foreground)]/80">
                {item.quantity} × {item.description}
              </span>
              <span className="font-medium text-[var(--foreground)]">
                {formatCOP(item.subtotal)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between">
          <span className="text-sm font-semibold text-[var(--foreground)]">
            Total
          </span>
          <span className="text-lg font-semibold text-gradient">
            {formatCOP(sale.total)}
          </span>
        </div>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Pago: {salePaymentLabel(sale.paymentMethod)}
        </p>
      </Card>

      <div className="mt-4 flex justify-between">
        <Link
          href="/caja"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-from)] transition-opacity hover:opacity-80"
        >
          <ArrowLeft className="h-4 w-4" />
          Nueva venta
        </Link>
        <ButtonLink
          href={scope ? "/citas" : "/reportes"}
          variant="secondary"
        >
          {scope ? (
            <>
              <CalendarDays className="h-4 w-4" />
              Ver mi agenda
            </>
          ) : (
            <>
              <BarChart3 className="h-4 w-4" />
              Ver reportes
            </>
          )}
        </ButtonLink>
      </div>
    </div>
  );
}
