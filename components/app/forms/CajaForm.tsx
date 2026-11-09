"use client";

import { useActionState, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus, Trash2, ShoppingCart, Scissors, Package } from "lucide-react";
import { Select } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormError } from "@/components/ui/Misc";
import { Card } from "@/components/ui/Card";
import { formatCOP } from "@/lib/utils";
import { registrarVenta } from "@/lib/actions/caja";

type Priceable = { id: string; name: string; price: number };
type ProductOption = Priceable & { stock: number };

type CartItem = {
  type: "SERVICE" | "PRODUCT";
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
};

const PAYMENT_METHODS = [
  { value: "EFECTIVO", label: "Efectivo", gradient: "from-emerald-500 to-teal-500" },
  { value: "TARJETA", label: "Tarjeta", gradient: "from-sky-500 to-blue-500" },
  { value: "TRANSFERENCIA", label: "Transferencia", gradient: "from-[var(--accent-from)] to-[var(--accent-to)]" },
] as const;

export function CajaForm({
  services,
  products,
  clients,
  defaultClientId,
  appointmentId,
  initialCart = [],
}: {
  services: Priceable[];
  products: ProductOption[];
  clients: { id: string; name: string }[];
  defaultClientId?: string;
  appointmentId?: string;
  initialCart?: CartItem[];
}) {
  const [cart, setCart] = useState<CartItem[]>(initialCart);
  const [paymentMethod, setPaymentMethod] = useState<string>("EFECTIVO");
  const [state, formAction] = useActionState(registrarVenta, undefined);

  const total = useMemo(
    () => cart.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    [cart]
  );

  function addItem(type: "SERVICE" | "PRODUCT", item: Priceable) {
    setCart((prev) => {
      const existing = prev.find((i) => i.type === type && i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.type === type && i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [
        ...prev,
        { type, id: item.id, name: item.name, unitPrice: item.price, quantity: 1 },
      ];
    });
  }

  function updateQuantity(type: string, id: string, quantity: number) {
    setCart((prev) =>
      prev.map((i) =>
        i.type === type && i.id === id
          ? { ...i, quantity: Math.max(1, quantity) }
          : i
      )
    );
  }

  function removeItem(type: string, id: string) {
    setCart((prev) => prev.filter((i) => !(i.type === type && i.id === id)));
  }

  return (
    <form action={formAction} className="flex flex-col gap-6 lg:flex-row">
      <input type="hidden" name="items" value={JSON.stringify(cart)} />
      {appointmentId && (
        <input type="hidden" name="appointmentId" value={appointmentId} />
      )}

      <div className="flex-1 flex flex-col gap-5">
        {services.length > 0 && (
          <Card>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
              <Scissors className="h-4 w-4 text-[var(--accent-from)]" />
              Servicios
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {services.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => addItem("SERVICE", s)}
                  className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] p-3 text-left transition-all hover:border-[var(--accent-via)]/60 hover:-translate-y-0.5 active:scale-[0.97]"
                >
                  <span className="flex items-center gap-1.5 text-sm font-medium text-[var(--foreground)]">
                    <Plus className="h-3.5 w-3.5 shrink-0 text-[var(--accent-from)]" />
                    {s.name}
                  </span>
                  <span className="mt-0.5 block text-xs text-[var(--muted)]">
                    {formatCOP(s.price)}
                  </span>
                </button>
              ))}
            </div>
          </Card>
        )}

        {products.length > 0 && (
          <Card delay={0.05}>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
              <Package className="h-4 w-4 text-[var(--accent-from)]" />
              Productos
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {products.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => addItem("PRODUCT", p)}
                  className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] p-3 text-left transition-all hover:border-[var(--accent-via)]/60 hover:-translate-y-0.5 active:scale-[0.97]"
                >
                  <span className="flex items-center gap-1.5 text-sm font-medium text-[var(--foreground)]">
                    <Plus className="h-3.5 w-3.5 shrink-0 text-[var(--accent-from)]" />
                    {p.name}
                  </span>
                  <span className="mt-0.5 block text-xs text-[var(--muted)]">
                    {formatCOP(p.price)} · {p.stock} en stock
                  </span>
                </button>
              ))}
            </div>
          </Card>
        )}

        <Card delay={0.1}>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
            <ShoppingCart className="h-4 w-4 text-[var(--accent-from)]" />
            Venta actual
          </h2>
          <div className="divide-y divide-[var(--surface-border)]">
            <AnimatePresence initial={false}>
              {cart.length === 0 && (
                <p className="py-6 text-center text-sm text-[var(--muted)]">
                  Toca un servicio o producto para agregarlo a la venta.
                </p>
              )}
              {cart.map((item) => (
                <motion.div
                  key={`${item.type}:${item.id}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {item.name}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      {formatCOP(item.unitPrice)} c/u
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.type, item.id, Number(e.target.value))
                      }
                      className="w-16 rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] px-2 py-1 text-sm"
                    />
                    <span className="w-24 text-right text-sm font-medium text-[var(--foreground)]">
                      {formatCOP(item.unitPrice * item.quantity)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.type, item.id)}
                      aria-label={`Quitar ${item.name}`}
                      className="inline-flex items-center gap-1 text-sm text-red-500 transition-colors hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Quitar
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Card>
      </div>

      <Card className="w-full lg:w-80 lg:sticky lg:top-20 lg:self-start">
        <h2 className="mb-4 text-sm font-semibold text-[var(--foreground)]">
          Cobrar
        </h2>
        <div className="flex flex-col gap-4">
          <Select
            label="Cliente (opcional)"
            name="clientId"
            defaultValue={defaultClientId ?? ""}
          >
            <option value="">Sin cliente</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-[var(--foreground)]/80">
              Método de pago
            </span>
            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_METHODS.map((m) => (
                <label key={m.value} className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={m.value}
                    checked={paymentMethod === m.value}
                    onChange={() => setPaymentMethod(m.value)}
                    className="peer sr-only"
                  />
                  <span className="flex flex-col items-center gap-1.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] py-3 text-center transition-all peer-checked:border-[var(--accent-from)] peer-checked:bg-[var(--accent-from)]/10 peer-checked:ring-2 peer-checked:ring-[var(--accent-from)]/30">
                    <span
                      className={`h-3 w-3 rounded-full bg-gradient-to-br ${m.gradient}`}
                    />
                    <span className="text-[11px] font-medium text-[var(--foreground)]">
                      {m.label}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[var(--surface-border)] pt-4">
            <span className="text-sm font-medium text-[var(--muted)]">Total</span>
            <span className="text-xl font-semibold text-gradient">
              {formatCOP(total)}
            </span>
          </div>

          <FormError message={state?.error} />
          <SubmitButton pendingText="Cobrando...">Cobrar venta</SubmitButton>
        </div>
      </Card>
    </form>
  );
}
