"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/session";
import { addMonths, addDays } from "@/lib/subscription";
import { PLANS } from "@/lib/plans";

export type ActionState = { error?: string; success?: boolean } | undefined;

const pagoSchema = z.object({
  amount: z.coerce.number().min(0, "El monto no puede ser negativo"),
  months: z.coerce.number().int().min(1).max(24),
  method: z.enum(["NEQUI", "TRANSFERENCIA", "EFECTIVO", "WOMPI", "OTRO"]),
  reference: z.string().optional(),
  note: z.string().optional(),
});

/**
 * Registra un pago manual y extiende la suscripción.
 * Si el negocio aún está vigente, los meses se suman a la fecha de vencimiento
 * (no se le quitan días por pagar antes).
 */
export async function registrarPago(
  businessId: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireSuperAdmin();

  const parsed = pagoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { paidUntil: true },
  });
  if (!business) return { error: "No se encontró el negocio." };

  const now = new Date();
  const periodStart =
    business.paidUntil && business.paidUntil > now ? business.paidUntil : now;
  const periodEnd = addMonths(periodStart, parsed.data.months);

  await prisma.$transaction([
    prisma.billingPayment.create({
      data: {
        businessId,
        amount: parsed.data.amount,
        method: parsed.data.method,
        reference: parsed.data.reference || null,
        note: parsed.data.note || null,
        periodStart,
        periodEnd,
      },
    }),
    prisma.business.update({
      where: { id: businessId },
      data: { paidUntil: periodEnd, subscriptionStatus: "ACTIVA" },
    }),
  ]);

  revalidatePath("/admin");
  revalidatePath(`/admin/negocios/${businessId}`);
  redirect(`/admin/negocios/${businessId}?ok=pago`);
}

const planSchema = z.object({
  planId: z.enum(["BASICO", "SALON", "PREMIUM"]),
  monthlyPrice: z.string().optional(),
});

export async function cambiarPlan(
  businessId: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireSuperAdmin();

  const parsed = planSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Plan no válido." };
  if (!PLANS.some((p) => p.id === parsed.data.planId)) {
    return { error: "Plan no válido." };
  }

  const raw = (parsed.data.monthlyPrice ?? "").trim();
  let monthlyPrice: number | null = null;
  if (raw !== "") {
    const n = Number(raw);
    if (!Number.isFinite(n) || n < 0) {
      return { error: "El precio acordado no es válido." };
    }
    monthlyPrice = n;
  }

  await prisma.business.update({
    where: { id: businessId },
    data: { planId: parsed.data.planId, monthlyPrice },
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/negocios/${businessId}`);
  redirect(`/admin/negocios/${businessId}?ok=plan`);
}

export async function cambiarEstadoNegocio(
  businessId: string,
  status: "ACTIVA" | "SUSPENDIDA" | "CANCELADA"
) {
  await requireSuperAdmin();
  await prisma.business.update({
    where: { id: businessId },
    data: { subscriptionStatus: status },
  });
  revalidatePath("/admin");
  revalidatePath(`/admin/negocios/${businessId}`);
}

/** Regala días extra (prueba extendida o cortesía). */
export async function extenderDias(businessId: string, dias: number) {
  await requireSuperAdmin();

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { paidUntil: true, subscriptionStatus: true },
  });
  if (!business) return;

  const now = new Date();
  const base =
    business.paidUntil && business.paidUntil > now ? business.paidUntil : now;

  await prisma.business.update({
    where: { id: businessId },
    data: {
      paidUntil: addDays(base, dias),
      subscriptionStatus:
        business.subscriptionStatus === "SUSPENDIDA" ||
        business.subscriptionStatus === "CANCELADA"
          ? "ACTIVA"
          : business.subscriptionStatus,
    },
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/negocios/${businessId}`);
}
