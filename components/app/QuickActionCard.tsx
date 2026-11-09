"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { Icon, type IconName } from "@/components/ui/iconRegistry";

export function QuickActionCard({
  href,
  label,
  icon,
  gradient,
  delay = 0,
}: {
  href: string;
  label: string;
  /** Nombre del icono: los componentes no cruzan la frontera servidor→cliente. */
  icon: IconName;
  gradient: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -3 }}
    >
      <Link
        href={href}
        className="glass group flex items-center gap-3 rounded-2xl p-4 transition-shadow hover:shadow-xl"
      >
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
        >
          <Icon name={icon} className="h-5 w-5 text-white" />
        </span>
        <span className="flex-1 text-sm font-medium text-[var(--foreground)]">
          {label}
        </span>
        <ChevronRight className="h-4 w-4 text-[var(--muted)] transition-transform group-hover:translate-x-0.5" />
      </Link>
    </motion.div>
  );
}
