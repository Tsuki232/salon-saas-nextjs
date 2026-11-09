"use client";

import { useActionState, useState } from "react";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormError } from "@/components/ui/Misc";
import { Card } from "@/components/ui/Card";
import { formatCOP } from "@/lib/utils";
import type { ActionState } from "@/lib/actions/admin";

export function RegistrarPagoForm({
  action,
  precioMensual,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  precioMensual: number;
}) {
  const [state, formAction] = useActionState(action, undefined);
  const [meses, setMeses] = useState(1);
  const [monto, setMonto] = useState(precioMensual);
  const [montoTocado, setMontoTocado] = useState(false);

  function cambiarMeses(n: number) {
    setMeses(n);
    // Mientras no toquen el monto a mano, lo calculamos por ellos.
    if (!montoTocado) setMonto(precioMensual * n);
  }

  return (
    <Card>
      <h2 className="mb-1 text-sm font-semibold text-[var(--foreground)]">
        Registrar pago
      </h2>
      <p className="mb-4 text-xs text-[var(--muted)]">
        Los meses se suman a la fecha de vencimiento actual, así que no pierde
        días por pagar antes.
      </p>
      <form action={formAction} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Meses"
            name="months"
            value={String(meses)}
            onChange={(e) => cambiarMeses(Number(e.target.value))}
          >
            {[1, 2, 3, 6, 12].map((m) => (
              <option key={m} value={m}>
                {m} {m === 1 ? "mes" : "meses"}
              </option>
            ))}
          </Select>
          <Input
            label="Monto recibido (COP)"
            name="amount"
            type="number"
            min={0}
            step={1000}
            required
            value={monto}
            onChange={(e) => {
              setMontoTocado(true);
              setMonto(Number(e.target.value));
            }}
            hint={`Sugerido: ${formatCOP(precioMensual * meses)}`}
          />
        </div>

        <Select label="Medio de pago" name="method" defaultValue="NEQUI">
          <option value="NEQUI">Nequi</option>
          <option value="TRANSFERENCIA">Transferencia bancaria</option>
          <option value="EFECTIVO">Efectivo</option>
          <option value="WOMPI">Wompi</option>
          <option value="OTRO">Otro</option>
        </Select>

        <Input
          label="Referencia (opcional)"
          name="reference"
          placeholder="Nº de transacción o comprobante"
        />
        <Textarea label="Nota (opcional)" name="note" />

        <FormError message={state?.error} />
        <div>
          <SubmitButton pendingText="Registrando...">
            Registrar pago y activar
          </SubmitButton>
        </div>
      </form>
    </Card>
  );
}
