/**
 * Textos que ve el usuario para los valores que guardamos en la base de datos.
 * Nunca mostrar el valor crudo (NO_ASISTIO, EFECTIVO...) en pantalla.
 */

export const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  PENDIENTE: "Pendiente",
  CONFIRMADA: "Confirmada",
  COMPLETADA: "Completada",
  CANCELADA: "Cancelada",
  NO_ASISTIO: "No asistió",
};

export const APPOINTMENT_STATUSES = [
  "PENDIENTE",
  "CONFIRMADA",
  "COMPLETADA",
  "CANCELADA",
  "NO_ASISTIO",
] as const;

export const SALE_PAYMENT_LABELS: Record<string, string> = {
  EFECTIVO: "Efectivo",
  TARJETA: "Tarjeta",
  TRANSFERENCIA: "Transferencia",
};

export const BILLING_METHOD_LABELS: Record<string, string> = {
  NEQUI: "Nequi",
  TRANSFERENCIA: "Transferencia",
  EFECTIVO: "Efectivo",
  WOMPI: "Wompi",
  OTRO: "Otro",
};

export function appointmentStatusLabel(status: string): string {
  return APPOINTMENT_STATUS_LABELS[status] ?? status;
}

export function salePaymentLabel(method: string): string {
  return SALE_PAYMENT_LABELS[method] ?? method;
}
