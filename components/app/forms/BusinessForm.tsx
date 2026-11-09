"use client";

import { useActionState } from "react";
import { Input, Textarea } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormError, FormSuccess } from "@/components/ui/Misc";
import { Card } from "@/components/ui/Card";
import { actualizarNegocio } from "@/lib/actions/configuracion";

export function BusinessForm({
  defaultValues,
}: {
  defaultValues: {
    name: string;
    phone: string | null;
    address: string | null;
    openHour: string;
    closeHour: string;
  };
}) {
  const [state, formAction] = useActionState(actualizarNegocio, undefined);

  return (
    <Card className="max-w-lg">
      <form action={formAction} className="flex flex-col gap-4">
        <Input
          label="Nombre del negocio"
          name="name"
          required
          defaultValue={defaultValues.name}
        />
        <Input
          label="Teléfono / WhatsApp"
          name="phone"
          defaultValue={defaultValues.phone ?? ""}
        />
        <Textarea
          label="Dirección"
          name="address"
          defaultValue={defaultValues.address ?? ""}
          placeholder="Ej: Cra 6 # 5-30, Popayán"
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Hora de apertura"
            name="openHour"
            type="time"
            required
            defaultValue={defaultValues.openHour}
          />
          <Input
            label="Hora de cierre"
            name="closeHour"
            type="time"
            required
            defaultValue={defaultValues.closeHour}
          />
        </div>
        <FormError message={state?.error} />
        <FormSuccess message={state?.success ? "Datos guardados." : undefined} />
        <SubmitButton>Guardar cambios</SubmitButton>
      </form>
    </Card>
  );
}
