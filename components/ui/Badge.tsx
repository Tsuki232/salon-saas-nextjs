import {
  Clock,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  UserX,
  type LucideIcon,
} from "lucide-react";

const colors: Record<string, string> = {
  PENDIENTE:
    "bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-1 ring-inset ring-amber-500/30",
  CONFIRMADA:
    "bg-blue-500/15 text-blue-600 dark:text-blue-400 ring-1 ring-inset ring-blue-500/30",
  COMPLETADA:
    "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/30",
  CANCELADA:
    "bg-neutral-500/15 text-neutral-500 dark:text-neutral-400 ring-1 ring-inset ring-neutral-500/25",
  NO_ASISTIO:
    "bg-red-500/15 text-red-600 dark:text-red-400 ring-1 ring-inset ring-red-500/30",
  default:
    "bg-[var(--accent-from)]/15 text-[var(--accent-from)] ring-1 ring-inset ring-[var(--accent-from)]/30",
};

const icons: Record<string, LucideIcon> = {
  PENDIENTE: Clock,
  CONFIRMADA: CalendarCheck,
  COMPLETADA: CheckCircle2,
  CANCELADA: XCircle,
  NO_ASISTIO: UserX,
};

export function Badge({
  children,
  tone = "default",
  withIcon = true,
}: {
  children: React.ReactNode;
  tone?: string;
  withIcon?: boolean;
}) {
  const Icon = withIcon ? icons[tone] : undefined;
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-sm ${
        colors[tone] ?? colors.default
      }`}
    >
      {Icon && <Icon className="h-3 w-3 shrink-0" strokeWidth={2.4} />}
      {children}
    </span>
  );
}
