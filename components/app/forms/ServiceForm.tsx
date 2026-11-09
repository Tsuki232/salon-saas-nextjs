"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormError } from "@/components/ui/Misc";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { ActionState } from "@/lib/actions/servicios";

export function ServiceForm({
  action,
  defaultValues,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: {
    name: string;
    category: string | null;
    durationMinutes: number;
    price: number;
  };
}) {
  const [state, formAction] = useActionState(action, undefined);
  const router = useRouter();

  return (
    <Card className="max-w-lg">
      <form action={formAction} className="flex flex-col gap-4">
        <Input
          label="Nombre del servicio"
          name="name"
          required
          defaultValue={defaultValues?.name}
          placeholder="Ej: Corte de cabello"
        />
        <Input
          label="Categoría (opcional)"
          name="category"
          defaultValue={defaultValues?.category ?? ""}
          placeholder="Ej: Cabello, Uñas, Piel"
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Duración (minutos)"
            name="durationMinutes"
            type="number"
            min={5}
            step={5}
            required
            defaultValue={defaultValues?.durationMinutes ?? 30}
          />
          <Input
            label="Precio (COP)"
            name="price"
            type="number"
            min={0}
            step={1000}
            required
            defaultValue={defaultValues?.price}
          />
        </div>
        <FormError message={state?.error} />
        <div className="flex gap-3">
          <SubmitButton>Guardar</SubmitButton>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/servicios")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
}
