import Link from "next/link";
import { Pencil, Eye, EyeOff, KeyRound } from "lucide-react";

const actionClass =
  "inline-flex items-center gap-1.5 text-sm font-medium transition-colors";

export function EditLink({
  href,
  label = "Editar",
}: {
  href: string;
  label?: string;
}) {
  return (
    <Link
      href={href}
      className={`${actionClass} text-[var(--accent-from)] hover:opacity-80`}
    >
      <Pencil className="h-3.5 w-3.5" />
      {label}
    </Link>
  );
}

export function AccessLink({
  href,
  hasAccess,
}: {
  href: string;
  hasAccess: boolean;
}) {
  return (
    <Link
      href={href}
      className={`${actionClass} text-[var(--accent-from)] hover:opacity-80`}
    >
      <KeyRound className="h-3.5 w-3.5" />
      {hasAccess ? "Cambiar acceso" : "Dar acceso"}
    </Link>
  );
}

/** Botón de activar/desactivar dentro de un <form action={...}>. */
export function ToggleActiveButton({ active }: { active: boolean }) {
  const Icon = active ? EyeOff : Eye;
  return (
    <button
      type="submit"
      className={`${actionClass} text-[var(--muted)] hover:text-[var(--foreground)]`}
    >
      <Icon className="h-3.5 w-3.5" />
      {active ? "Desactivar" : "Activar"}
    </button>
  );
}

/** Botón genérico de acción secundaria dentro de un form. */
export function SubmitTextButton({
  icon,
  children,
  tone = "muted",
}: {
  /** Icono ya renderizado, para poder usarlo desde Server Components. */
  icon?: React.ReactNode;
  children: React.ReactNode;
  tone?: "muted" | "danger";
}) {
  return (
    <button
      type="submit"
      className={`${actionClass} [&>svg]:h-3.5 [&>svg]:w-3.5 ${
        tone === "danger"
          ? "text-red-500 hover:text-red-600"
          : "text-[var(--muted)] hover:text-[var(--foreground)]"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
