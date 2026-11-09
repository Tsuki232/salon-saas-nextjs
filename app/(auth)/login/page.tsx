"use client";

import { useActionState } from "react";
import Link from "next/link";
import { iniciarSesion } from "@/lib/actions/auth";
import { Input } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormError } from "@/components/ui/Misc";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const [state, formAction] = useActionState(iniciarSesion, undefined);

  return (
    <Card className="glass-strong">
      <h1 className="text-lg font-semibold text-[var(--foreground)] mb-1">
        Inicia sesión
      </h1>
      <p className="text-sm text-[var(--muted)] mb-5">
        Entra a la agenda de tu negocio.
      </p>
      <form action={formAction} className="flex flex-col gap-4">
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
          autoComplete="current-password"
        />
        <FormError message={state?.error} />
        <SubmitButton pendingText="Entrando...">Entrar</SubmitButton>
      </form>
      <p className="text-sm text-[var(--muted)] mt-5 text-center">
        ¿Todavía no tienes cuenta?{" "}
        <Link
          href="/registro"
          className="text-[var(--accent-from)] font-medium"
        >
          Regístrate
        </Link>
      </p>
    </Card>
  );
}
