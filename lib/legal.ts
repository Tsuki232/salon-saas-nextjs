/**
 * Datos del titular del servicio que aparecen en los documentos legales.
 * Complétalos en `.env` antes de publicar la aplicación.
 *
 *   LEGAL_RAZON_SOCIAL="Your Name or Company"
 *   LEGAL_DOCUMENTO="ID 000000000"
 *   LEGAL_DIRECCION="Street 1 # 2-34, City, Region"
 *   LEGAL_EMAIL="contact@example.com"
 *   LEGAL_TELEFONO="+57 3001234567"
 *   LEGAL_CIUDAD="City, Region"
 */
export const LEGAL = {
  marca: process.env.PLATFORM_NAME || "CitaFácil",
  razonSocial: process.env.LEGAL_RAZON_SOCIAL || "[Pendiente: tu nombre o razón social]",
  documento: process.env.LEGAL_DOCUMENTO || "[Pendiente: NIT o cédula]",
  direccion: process.env.LEGAL_DIRECCION || "[Pendiente: dirección de notificaciones]",
  email: process.env.LEGAL_EMAIL || "[Pendiente: correo de contacto]",
  telefono: process.env.LEGAL_TELEFONO || "[Pendiente: teléfono]",
  ciudad: process.env.LEGAL_CIUDAD || "Popayán, Cauca (Colombia)",
};

/** Fecha de última actualización de los documentos legales. */
export const LEGAL_VIGENCIA = "26 de julio de 2026";

/** ¿Faltan datos por completar? Sirve para avisarle al dueño de la plataforma. */
export function faltanDatosLegales(): boolean {
  return Object.values(LEGAL).some((v) => v.startsWith("[Pendiente"));
}

export const LEGAL_LINKS = [
  { href: "/legal/terminos", label: "Términos y Condiciones" },
  { href: "/legal/privacidad", label: "Política de Privacidad" },
  { href: "/legal/datos", label: "Tratamiento de Datos" },
  { href: "/legal/responsabilidad", label: "Descargo de Responsabilidad" },
];
