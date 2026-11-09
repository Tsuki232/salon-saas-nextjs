"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, Scissors } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { ThemeToggle } from "./ThemeToggle";

function BrandHeader({
  businessName,
  logoUrl,
}: {
  businessName: string;
  logoUrl: string | null;
}) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-4">
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt={businessName}
          className="h-9 w-9 shrink-0 rounded-xl object-cover ring-1 ring-[var(--surface-border)]"
        />
      ) : (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] shadow-lg shadow-[var(--accent-from)]/25">
          <Scissors className="h-[18px] w-[18px] text-white" strokeWidth={2.2} />
        </span>
      )}
      <div className="flex min-w-0 flex-col leading-tight">
        <span className="text-base font-semibold text-gradient">
          CitaFácil
        </span>
        {businessName && (
          <span className="truncate text-xs text-[var(--muted)]">
            {businessName}
          </span>
        )}
      </div>
    </div>
  );
}

export function AppShell({
  topbar,
  businessName,
  logoUrl,
  role,
  children,
}: {
  topbar: React.ReactNode;
  businessName: string;
  logoUrl: string | null;
  role: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 border-r border-[var(--surface-border)] glass md:sticky md:top-0 md:block md:h-screen md:rounded-none">
        <BrandHeader businessName={businessName} logoUrl={logoUrl} />
        <Sidebar role={role} layoutId="sidebar-desktop" />
      </aside>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="glass-strong absolute left-0 top-0 h-full w-64 rounded-none"
            >
              <div className="flex items-center justify-between">
                <BrandHeader businessName={businessName} logoUrl={logoUrl} />
                <button
                  onClick={() => setOpen(false)}
                  className="pr-4 text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
                  aria-label="Cerrar menú"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div onClick={() => setOpen(false)}>
                <Sidebar role={role} layoutId="sidebar-mobile" />
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex min-h-screen flex-1 flex-col">
        <div className="glass sticky top-0 z-30 flex items-center gap-3 rounded-none border-x-0 border-t-0 px-4 py-3 md:px-6">
          <button
            onClick={() => setOpen(true)}
            className="text-[var(--foreground)] transition-opacity hover:opacity-70 md:hidden"
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1">{topbar}</div>
          <ThemeToggle />
        </div>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
