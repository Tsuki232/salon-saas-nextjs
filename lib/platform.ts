/**
 * Datos de la plataforma (tuyos, como dueño del SaaS).
 *
 * Se leen de variables de entorno para que no queden quemados en el código.
 * Defínelas en `.env`:
 *   PLATFORM_NAME="CitaFácil"
 *   PLATFORM_NEQUI="3001234567"
 *   PLATFORM_BANK="Bank Savings 000-0000000-00"
 *   PLATFORM_WHATSAPP="3001234567"
 */
export const PLATFORM = {
  name: process.env.PLATFORM_NAME || "CitaFácil",
  nequi: process.env.PLATFORM_NEQUI || "",
  bank: process.env.PLATFORM_BANK || "",
  whatsapp: process.env.PLATFORM_WHATSAPP || "",
};

/** Link de WhatsApp para que el negocio avise que ya pagó. */
export function buildPaymentNoticeLink(params: {
  businessName: string;
  planLabel: string;
  amount: string;
}): string | null {
  if (!PLATFORM.whatsapp) return null;
  const msg = `Hola, soy de ${params.businessName}. Acabo de pagar el plan ${params.planLabel} (${params.amount}) de ${PLATFORM.name}. Adjunto el comprobante.`;
  return `https://wa.me/${PLATFORM.whatsapp}?text=${encodeURIComponent(msg)}`;
}
