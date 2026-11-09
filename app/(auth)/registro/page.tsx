"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registrarNegocio } from "@/lib/actions/auth";
import { Input } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormError } from "@/components/ui/Misc";
import { Card } from "@/components/ui/Card";

export default function RegistroPage() {
  const [state, formAction] = useActionState(registrarNegocio, undefined);

  return (
    <Card className="glass-strong">
      <h1 className="text-lg font-semibold text-[var(--foreground)] mb-1">
        Crea tu negocio
      </h1>
      <p className="text-sm text-[var(--muted)] mb-5">
        Empieza a gestionar tu agenda en minutos.
      </p>
      <form action={formAction} className="flex flex-col gap-4">
        <Input
          label="Nombre del negocio"
          name="businessName"
          placeholder="Ej: Salón Bella Popayán"
          required
        />
        <Input label="Tu nombre" name="ownerName" required />
        <Input
          label="Teléfono (WhatsApp)"
          name="phone"
          placeholder="Ej: 3001234567"
        />
        <Input
          label="Correo electrónico"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
        <Input
          label="Contraseña"
          name="password"
          type="password"
          required
          minLength={6}
          hint="Mínimo 6 caracteres"
          autoComplete="new-password"
        />
        <FormError message={state?.error} />
        <SubmitButton pendingText="Creando cuenta...">
          Crear mi cuenta
        </SubmitButton>
      </form>
      <p className="text-sm text-[var(--muted)] mt-5 text-center">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/login"
          className="text-[var(--accent-from)] font-medium"
        >
          Inicia sesión
        </Link>
      </p>
    </Card>
  );
}
