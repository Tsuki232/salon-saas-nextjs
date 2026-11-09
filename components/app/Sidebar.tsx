"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Scissors,
  UserCog,
  Package,
  Wallet,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { canAccessPath } from "@/lib/permissions";

const NAV_ITEMS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/dashboard", label: "Panel", icon: LayoutDashboard },
  { href: "/citas", label: "Agenda", icon: CalendarDays },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/servicios", label: "Servicios", icon: Scissors },
  { href: "/personal", label: "Personal", icon: UserCog },
  { href: "/productos", label: "Productos", icon: Package },
  { href: "/caja", label: "Caja", icon: Wallet },
  { href: "/reportes", label: "Reportes", icon: BarChart3 },
  { href: "/configuracion", label: "Configuración", icon: Settings },
];

export function Sidebar({
  role,
  layoutId = "sidebar",
}: {
  role: string;
  layoutId?: string;
}) {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((item) => canAccessPath(role, item.href));

  return (
    <nav className="flex flex-col gap-1 p-3">
      {items.map((item) => {
        const active = pathname?.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "text-[var(--accent-from)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--accent-from)]/15 to-[var(--accent-to)]/15 ring-1 ring-inset ring-[var(--accent-from)]/25"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <Icon className="relative h-[18px] w-[18px] shrink-0" strokeWidth={2} />
            <span className="relative">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
