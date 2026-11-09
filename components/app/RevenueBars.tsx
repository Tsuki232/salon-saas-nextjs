"use client";

import { motion } from "motion/react";
import { formatCOP } from "@/lib/utils";

export function RevenueBars({
  days,
}: {
  days: { label: string; total: number }[];
}) {
  const max = Math.max(1, ...days.map((d) => d.total));

  return (
    <div className="flex items-end justify-between gap-2 h-36">
      {days.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-28 w-full items-end justify-center">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(4, (d.total / max) * 100)}%` }}
              transition={{
                duration: 0.6,
                delay: i * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              title={formatCOP(d.total)}
              className="w-full max-w-8 rounded-t-lg bg-gradient-to-t from-[var(--accent-from)] to-[var(--accent-to)] shadow-lg shadow-[var(--accent-from)]/20"
            />
          </div>
          <span className="text-[10px] uppercase text-[var(--muted)]">
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}
