"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/Badge";

export type AgendaRow = {
  id: string;
  time: string;
  clientId: string;
  clientName: string;
  serviceName: string;
  staffName: string;
  staffColor: string;
  status: string;
};

export function TodayAgendaList({ rows }: { rows: AgendaRow[] }) {
  return (
    <div className="flex flex-col gap-2">
      {rows.map((r, i) => (
        <motion.div
          key={r.id}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: i * 0.05 }}
          whileHover={{ x: 2 }}
          className="glass flex items-center gap-4 rounded-xl px-4 py-3"
        >
          <span className="w-16 shrink-0 text-sm font-medium text-[var(--foreground)]">
            {r.time}
          </span>
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: r.staffColor }}
          />
          <Link
            href={`/clientes/${r.clientId}`}
            className="flex-1 truncate text-sm font-medium text-[var(--foreground)] hover:text-[var(--accent-from)]"
          >
            {r.clientName}
          </Link>
          <span className="hidden flex-1 truncate text-sm text-[var(--muted)] sm:block">
            {r.serviceName}
          </span>
          <span className="hidden text-sm text-[var(--muted)] md:block">
            {r.staffName}
          </span>
          <Badge tone={r.status}>{r.status}</Badge>
        </motion.div>
      ))}
    </div>
  );
}
