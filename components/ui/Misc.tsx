"use client";

import { motion } from "motion/react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Icon, type IconName } from "@/components/ui/iconRegistry";

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-2 rounded-xl bg-red-500/10 border border-red-500/25 text-red-600 dark:text-red-400 text-sm px-3.5 py-2.5 backdrop-blur-sm"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </motion.div>
  );
}

export function FormSuccess({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-sm px-3.5 py-2.5 backdrop-blur-sm"
    >
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </motion.div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  /** Nombre del icono: los componentes no cruzan la frontera servidor→cliente. */
  icon?: IconName;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="glass flex flex-col items-center justify-center gap-2 rounded-2xl border-dashed py-16 text-center"
    >
      {icon && (
        <span className="mb-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-from)]/10 ring-1 ring-inset ring-[var(--accent-from)]/20">
          <Icon name={icon} className="h-5 w-5 text-[var(--accent-from)]" />
        </span>
      )}
      <p className="text-sm font-medium text-[var(--foreground)]">{title}</p>
      {description && (
        <p className="max-w-sm text-sm text-[var(--muted)]">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </motion.div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-wrap items-center justify-between gap-3 mb-6"
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] text-outline">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-[var(--muted)] mt-1">{description}</p>
        )}
      </div>
      {action}
    </motion.div>
  );
}
