"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormError } from "@/components/ui/Misc";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { ActionState } from "@/lib/actions/clientes";

export function ClientForm({
  action,
  defaultValues,
  cancelHref = "/clientes",
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: {
    name: string;
    phone: string | null;
    email: string | null;
    notes: string | null;
  };
  cancelHref?: string;
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
        />
        <Input
          label="Teléfono (WhatsApp)"
          name="phone"
          defaultValue={defaultValues?.phone ?? ""}
          placeholder="Ej: 3001234567"
        />
        <Input
          label="Correo (opcional)"
          name="email"
          type="email"
          defaultValue={defaultValues?.email ?? ""}
        />
        <Textarea
          label="Notas (opcional)"
          name="notes"
          defaultValue={defaultValues?.notes ?? ""}
          placeholder="Preferencias, alergias, etc."
        />
        <FormError message={state?.error} />
        <div className="flex gap-3">
          <SubmitButton>Guardar</SubmitButton>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push(cancelHref)}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
}
