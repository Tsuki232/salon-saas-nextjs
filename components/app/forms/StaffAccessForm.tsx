"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormError } from "@/components/ui/Misc";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { ActionState } from "@/lib/actions/personal";

export function StaffAccessForm({
  action,
  staffName,
  currentEmail,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  staffName: string;
  currentEmail: string | null;
}) {
  const [state, formAction] = useActionState(action, undefined);
  const router = useRouter();

  return (
    <Card className="max-w-lg">
      <p className="mb-4 text-sm text-[var(--muted)]">
        {currentEmail
          ? `Actualiza el correo o la contraseña con la que ${staffName} entra a la app.`
          : `Crea un usuario para que ${staffName} entre a la app y vea únicamente su propia agenda.`}
      </p>
      <form action={formAction} className="flex flex-col gap-4">
        <Input
          label="Correo de acceso"
          name="email"
          type="email"
          required
          defaultValue={currentEmail ?? ""}
          placeholder="Ej: camila@salonbella.co"
          autoComplete="off"
        />
        <Input
          label={currentEmail ? "Nueva contraseña" : "Contraseña"}
          name="password"
          type="password"
          required
          minLength={6}
          hint="Mínimo 6 caracteres. Compártesela para que pueda entrar."
          autoComplete="new-password"
        />

        <div className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] p-3 text-xs text-[var(--muted)]">
          Como <strong className="text-[var(--foreground)]">empleado</strong>{" "}
          podrá ver su agenda, sus clientes y cobrar en caja. No verá reportes,
          ingresos del negocio, ni la configuración.
        </div>

        <FormError message={state?.error} />
        <div className="flex gap-3">
          <SubmitButton>
            {currentEmail ? "Actualizar acceso" : "Dar acceso"}
          </SubmitButton>
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
