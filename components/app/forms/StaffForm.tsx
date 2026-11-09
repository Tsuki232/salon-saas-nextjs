"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormError } from "@/components/ui/Misc";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { ActionState } from "@/lib/actions/personal";

const COLOR_OPTIONS = [
  "#7c3aed",
  "#db2777",
  "#0891b2",
  "#059669",
  "#d97706",
  "#dc2626",
];

export function StaffForm({
  action,
  defaultValues,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: { name: string; phone: string | null; colorTag: string };
}) {
  const [state, formAction] = useActionState(action, undefined);
  const router = useRouter();

  return (
    <Card className="max-w-lg">
      <form action={formAction} className="flex flex-col gap-4">
        <Input
          label="Nombre completo"
          name="name"
          required
          defaultValue={defaultValues?.name}
          placeholder="Ej: María Fernanda López"
        />
        <Input
          label="Teléfono (opcional)"
          name="phone"
          defaultValue={defaultValues?.phone ?? ""}
          placeholder="Ej: 3001234567"
        />
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-[var(--foreground)]/80">
            Color en la agenda
          </span>
          <div className="flex gap-2">
            {COLOR_OPTIONS.map((color) => (
              <label key={color} className="relative cursor-pointer">
                <input
                  type="radio"
                  name="colorTag"
                  value={color}
                  defaultChecked={
                    (defaultValues?.colorTag ?? COLOR_OPTIONS[0]) === color
                  }
                  className="peer sr-only"
                />
                <span
                  className="block h-7 w-7 rounded-full border-2 border-transparent peer-checked:border-[var(--foreground)]"
                  style={{ backgroundColor: color }}
                />
              </label>
            ))}
          </div>
        </div>
        <FormError message={state?.error} />
        <div className="flex gap-3">
          <SubmitButton>Guardar</SubmitButton>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/personal")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
}
