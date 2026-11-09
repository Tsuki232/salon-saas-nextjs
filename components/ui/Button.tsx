import Link from "next/link";
import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

const base =
  "relative inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium px-4 py-2.5 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]";

const variants: Record<Variant, string> = {
  primary:
    "text-white bg-gradient-to-br from-[var(--accent-from)] via-[var(--accent-via)] to-[var(--accent-to)] shadow-lg shadow-[var(--accent-from)]/25 hover:shadow-xl hover:shadow-[var(--accent-from)]/35 hover:-translate-y-0.5",
  secondary:
    "text-[var(--foreground)] glass hover:-translate-y-0.5 hover:shadow-lg",
  danger:
    "text-white bg-gradient-to-br from-red-600 to-rose-600 shadow-lg shadow-red-600/25 hover:shadow-xl hover:-translate-y-0.5",
  ghost: "text-[var(--muted)] hover:bg-[var(--surface)]",
};

export function buttonClasses(variant: Variant = "primary", className = "") {
  return `${base} ${variants[variant]} ${className}`;
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={buttonClasses(variant, className)} {...props} />;
}

export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={buttonClasses(variant, className)}>
      {children}
    </Link>
  );
}
