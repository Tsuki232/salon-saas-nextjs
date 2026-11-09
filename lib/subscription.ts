import { TRIAL_DAYS } from "@/lib/plans";

export type SubscriptionFields = {
  subscriptionStatus: string;
  paidUntil: Date | null;
};

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

export function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export function trialEndDate(from: Date = new Date()): Date {
  return addDays(from, TRIAL_DAYS);
}

/** Días que faltan para que venza (negativo si ya venció). */
export function daysLeft(business: SubscriptionFields): number {
  if (!business.paidUntil) return -1;
  const ms = business.paidUntil.getTime() - Date.now();
  return Math.ceil(ms / (24 * 60 * 60 * 1000));
}

/**
 * ¿El negocio puede usar la aplicación?
 * Suspendida o cancelada bloquean siempre; prueba y activa dependen de la fecha.
 */
export function hasAccess(business: SubscriptionFields): boolean {
  if (
    business.subscriptionStatus === "SUSPENDIDA" ||
    business.subscriptionStatus === "CANCELADA"
  ) {
    return false;
  }
  if (!business.paidUntil) return false;
  return business.paidUntil.getTime() > Date.now();
}

/** Estado real, recalculado contra la fecha (la BD puede estar desactualizada). */
export function effectiveStatus(business: SubscriptionFields): string {
  if (
    business.subscriptionStatus === "SUSPENDIDA" ||
    business.subscriptionStatus === "CANCELADA"
  ) {
    return business.subscriptionStatus;
  }
  if (!hasAccess(business)) return "VENCIDA";
  return business.subscriptionStatus;
}

export const STATUS_LABELS: Record<string, string> = {
  PRUEBA: "Prueba gratis",
  ACTIVA: "Activa",
  VENCIDA: "Vencida",
  SUSPENDIDA: "Suspendida",
  CANCELADA: "Cancelada",
};

/** Tono del Badge para cada estado. */
export const STATUS_TONES: Record<string, string> = {
  PRUEBA: "CONFIRMADA",
  ACTIVA: "COMPLETADA",
  VENCIDA: "NO_ASISTIO",
  SUSPENDIDA: "NO_ASISTIO",
  CANCELADA: "CANCELADA",
};
