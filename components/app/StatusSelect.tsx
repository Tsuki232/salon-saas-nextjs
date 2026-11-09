"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { cambiarEstadoCita } from "@/lib/actions/citas";
import {
  APPOINTMENT_STATUSES,
  appointmentStatusLabel,
} from "@/lib/labels";

export function StatusSelect({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <span className="relative inline-flex items-center">
      <select
        value={status}
        disabled={isPending}
        aria-label="Cambiar estado de la cita"
        onChange={(e) =>
          startTransition(() =>
            cambiarEstadoCita(
              id,
              e.target.value as (typeof APPOINTMENT_STATUSES)[number]
            )
          )
        }
        className="cursor-pointer rounded-lg glass py-1 pl-2 pr-6 text-xs text-[var(--foreground)] outline-none transition-opacity disabled:opacity-50"
      >
        {APPOINTMENT_STATUSES.map((s) => (
          <option key={s} value={s}>
            {appointmentStatusLabel(s)}
          </option>
        ))}
      </select>
      {isPending && (
        <Loader2 className="pointer-events-none absolute right-1.5 h-3 w-3 animate-spin text-[var(--muted)]" />
      )}
    </span>
  );
}
