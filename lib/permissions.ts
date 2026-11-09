export const ROLE_OWNER = "OWNER";
export const ROLE_EMPLOYEE = "EMPLOYEE";
export const ROLE_SUPERADMIN = "SUPERADMIN";

/** Rutas que solo el dueño del negocio puede abrir. */
export const OWNER_ONLY_PATHS = [
  "/servicios",
  "/personal",
  "/productos",
  "/reportes",
  "/configuracion",
];

/** Rutas del panel de la plataforma (solo el dueño del SaaS). */
export const SUPERADMIN_PATHS = ["/admin"];

/** El superadmin también manda dentro de su propio negocio. */
export function isOwner(role: string | undefined | null): boolean {
  return role === ROLE_OWNER || role === ROLE_SUPERADMIN;
}

export function isSuperAdmin(role: string | undefined | null): boolean {
  return role === ROLE_SUPERADMIN;
}

function matches(paths: string[], pathname: string): boolean {
  return paths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function isOwnerOnlyPath(pathname: string): boolean {
  return matches(OWNER_ONLY_PATHS, pathname);
}

export function isSuperAdminPath(pathname: string): boolean {
  return matches(SUPERADMIN_PATHS, pathname);
}

/** ¿Este rol puede abrir esta ruta? */
export function canAccessPath(
  role: string | undefined | null,
  pathname: string
): boolean {
  if (isSuperAdminPath(pathname)) return isSuperAdmin(role);
  if (isOwnerOnlyPath(pathname)) return isOwner(role);
  return true;
}

export function roleLabel(role: string): string {
  if (role === ROLE_SUPERADMIN) return "Administrador";
  return role === ROLE_OWNER ? "Dueño" : "Empleado";
}

/** Valor imposible: se usa para que un empleado sin ficha de personal no vea nada. */
const NO_STAFF = "__sin_personal__";

/**
 * Devuelve el staffId al que está limitado el usuario, o null si es el dueño
 * (que no tiene límite). Úsalo para filtrar citas y ventas.
 */
export function staffScope(user: {
  role: string;
  staffId: string | null;
}): string | null {
  if (isOwner(user.role)) return null;
  return user.staffId ?? NO_STAFF;
}
