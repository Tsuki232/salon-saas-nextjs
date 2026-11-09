/**
 * Catálogo de planes de la plataforma.
 *
 * Para cambiar precios solo edita `monthlyPrice` aquí. Si a un negocio le
 * negociaste otro precio, guárdalo en `Business.monthlyPrice` y ese manda.
 */

export type PlanDefinition = {
  id: "BASICO" | "SALON" | "PREMIUM";
  label: string;
  /** Precio mensual sugerido en COP. */
  monthlyPrice: number;
  /** Máximo de integrantes del personal. null = ilimitado. */
  maxStaff: number | null;
  description: string;
  features: string[];
};

export const PLANS: PlanDefinition[] = [
  {
    id: "BASICO",
    label: "Básico",
    monthlyPrice: 49000,
    maxStaff: 1,
    description: "Para quien trabaja solo/a.",
    features: [
      "1 persona atendiendo",
      "Agenda y clientes ilimitados",
      "Caja y recibos",
      "Recordatorios por WhatsApp",
    ],
  },
  {
    id: "SALON",
    label: "Salón",
    monthlyPrice: 89000,
    maxStaff: 5,
    description: "Para salones con equipo.",
    features: [
      "Hasta 5 personas atendiendo",
      "Cuenta propia para cada empleado",
      "Reportes de ingresos",
      "Inventario de productos",
    ],
  },
  {
    id: "PREMIUM",
    label: "Premium",
    monthlyPrice: 149000,
    maxStaff: null,
    description: "Para salones grandes.",
    features: [
      "Personal ilimitado",
      "Colores y logo propios",
      "Reportes completos",
      "Soporte prioritario",
    ],
  },
];

export const DEFAULT_PLAN_ID = "BASICO";

/** Días de prueba gratis al registrarse. */
export const TRIAL_DAYS = 14;

export function getPlan(id: string): PlanDefinition {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}

/** Precio que realmente paga un negocio (el acordado, o el del plan). */
export function effectivePrice(business: {
  planId: string;
  monthlyPrice: number | null;
}): number {
  return business.monthlyPrice ?? getPlan(business.planId).monthlyPrice;
}
