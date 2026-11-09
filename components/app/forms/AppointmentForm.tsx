"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormError } from "@/components/ui/Misc";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { ActionState } from "@/lib/actions/citas";
import { formatCOP, toDateInputValue } from "@/lib/utils";

type Option = { id: string; name: string };
type StaffOption = Option & { colorTag?: string };
type ServiceOption = Option & { durationMinutes: number; price: number };

export function AppointmentForm({
  action,
  clients,
  staff,
  services,
  defaultValues,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  clients: Option[];
  staff: StaffOption[];
  services: ServiceOption[];
  defaultValues?: {
    clientId: string;
    staffId: string;
    serviceId: string;
    date: string;
    time: string;
    notes: string | null;
  };
}) {
  const [state, formAction] = useActionState(action, undefined);
  const router = useRouter();
  const [serviceId, setServiceId] = useState(defaultValues?.serviceId ?? "");
  const [staffId, setStaffId] = useState(defaultValues?.staffId ?? "");

  const today = toDateInputValue(new Date());

  return (
    <Card className="max-w-2xl">
      <form action={formAction} className="flex flex-col gap-5">
        <Select
          label="Cliente"
          name="clientId"
          required
          defaultValue={defaultValues?.clientId ?? ""}
        >
          <option value="" disabled>
            Selecciona un cliente
          </option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-[var(--foreground)]/80">
            Servicio
          </span>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {services.map((s) => (
              <label key={s.id} className="relative cursor-pointer">
                <input
                  type="radio"
                  name="serviceId"
                  value={s.id}
                  required
                  checked={serviceId === s.id}
                  onChange={() => setServiceId(s.id)}
                  className="peer sr-only"
                />
                <span className="block rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] p-3 text-left transition-all peer-checked:border-[var(--accent-from)] peer-checked:bg-[var(--accent-from)]/10 peer-checked:ring-2 peer-checked:ring-[var(--accent-from)]/30 hover:border-[var(--accent-via)]/60">
                  <span className="block text-sm font-medium text-[var(--foreground)]">
                    {s.name}
                  </span>
                  <span className="mt-0.5 block text-xs text-[var(--muted)]">
                    {s.durationMinutes} min · {formatCOP(s.price)}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-[var(--foreground)]/80">
            Atiende
          </span>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {staff.map((s) => (
              <label key={s.id} className="relative cursor-pointer">
                <input
                  type="radio"
                  name="staffId"
                  value={s.id}
                  required
                  checked={staffId === s.id}
                  onChange={() => setStaffId(s.id)}
                  className="peer sr-only"
                />
                <span className="flex items-center gap-2 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] p-3 text-left transition-all peer-checked:border-[var(--accent-from)] peer-checked:bg-[var(--accent-from)]/10 peer-checked:ring-2 peer-checked:ring-[var(--accent-from)]/30 hover:border-[var(--accent-via)]/60">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: s.colorTag ?? "#7c3aed" }}
                  />
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {s.name}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Fecha"
            name="date"
            type="date"
            required
            defaultValue={defaultValues?.date ?? today}
          />
          <Input
            label="Hora"
            name="time"
            type="time"
            required
            defaultValue={defaultValues?.time ?? "09:00"}
          />
        </div>

        <Textarea
          label="Notas (opcional)"
          name="notes"
          defaultValue={defaultValues?.notes ?? ""}
        />

        <FormError message={state?.error} />
        <div className="flex gap-3">
          <SubmitButton>Guardar cita</SubmitButton>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/citas")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
}
