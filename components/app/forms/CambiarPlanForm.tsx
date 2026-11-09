"use client";

import { useActionState, useState } from "react";
import { Input, Select } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormError } from "@/components/ui/Misc";
import { Card } from "@/components/ui/Card";
import { PLANS, getPlan } from "@/lib/plans";
import { formatCOP } from "@/lib/utils";
import type { ActionState } from "@/lib/actions/admin";

export function CambiarPlanForm({
  action,
  planId,
  monthlyPrice,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  planId: string;
  monthlyPrice: number | null;
}) {
  const [state, formAction] = useActionState(action, undefined);
  const [plan, setPlan] = useState(planId);

  return (
    <Card delay={0.05}>
      <h2 className="mb-4 text-sm font-semibold text-[var(--foreground)]">
        Plan y precio
      </h2>
      <form action={formAction} className="flex flex-col gap-4">
        <Select
          label="Plan"
          name="planId"
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
        >
          {PLANS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label} — {formatCOP(p.monthlyPrice)}/mes
              {p.maxStaff ? ` (hasta ${p.maxStaff})` : " (ilimitado)"}
            </option>
          ))}
        </Select>

        <Input
          label="Precio acordado (opcional)"
          name="monthlyPrice"
          type="number"
          min={0}
          step={1000}
          defaultValue={monthlyPrice ?? ""}
          hint={`Déjalo vacío para cobrar el precio del plan (${formatCOP(
            getPlan(plan).monthlyPrice
          )}).`}
        />

        <FormError message={state?.error} />
        <div>
          <SubmitButton>Guardar plan</SubmitButton>
        </div>
      </form>
    </Card>
  );
}
