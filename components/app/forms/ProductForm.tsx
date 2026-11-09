"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormError } from "@/components/ui/Misc";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { ActionState } from "@/lib/actions/productos";

export function ProductForm({
  action,
  defaultValues,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: { name: string; price: number; stock: number };
}) {
  const [state, formAction] = useActionState(action, undefined);
  const router = useRouter();

  return (
    <Card className="max-w-lg">
      <form action={formAction} className="flex flex-col gap-4">
        <Input
          label="Nombre del producto"
          name="name"
          required
          defaultValue={defaultValues?.name}
          placeholder="Ej: Shampoo 250ml"
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Precio (COP)"
            name="price"
            type="number"
            min={0}
            step={500}
            required
            defaultValue={defaultValues?.price}
          />
          <Input
            label="Stock disponible"
            name="stock"
            type="number"
            min={0}
            step={1}
            required
            defaultValue={defaultValues?.stock ?? 0}
          />
        </div>
        <FormError message={state?.error} />
        <div className="flex gap-3">
          <SubmitButton>Guardar</SubmitButton>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/productos")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
}
