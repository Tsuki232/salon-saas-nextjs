"use client";

import {
  CalendarDays,
  CalendarPlus,
  Wallet,
  UserPlus,
  Users,
  BarChart3,
  Scissors,
  Package,
  UserCog,
  ShoppingBag,
  Building2,
} from "lucide-react";

/**
 * Los componentes de icono no se pueden pasar como prop de un Server Component
 * a un Client Component (React no los puede serializar). Por eso los
 * componentes cliente reciben el *nombre* del icono y lo resuelven aquí.
 */
export const ICONS = {
  calendar: CalendarDays,
  "calendar-plus": CalendarPlus,
  wallet: Wallet,
  "user-plus": UserPlus,
  users: Users,
  chart: BarChart3,
  scissors: Scissors,
  package: Package,
  "user-cog": UserCog,
  "shopping-bag": ShoppingBag,
  business: Building2,
} as const;

export type IconName = keyof typeof ICONS;

export function Icon({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  const Cmp = ICONS[name];
  if (!Cmp) return null;
  return <Cmp className={className} strokeWidth={2.2} />;
}
