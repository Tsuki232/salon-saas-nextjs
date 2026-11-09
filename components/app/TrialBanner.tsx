import Link from "next/link";

export function TrialBanner({
  enPrueba,
  diasRestantes,
}: {
  enPrueba: boolean;
  diasRestantes: number;
}) {
  const urgente = diasRestantes <= 3;

  const texto = enPrueba
    ? diasRestantes === 1
      ? "Te queda 1 día de prueba gratis."
      : `Te quedan ${diasRestantes} días de prueba gratis.`
    : diasRestantes === 1
      ? "Tu plan vence mañana."
      : `Tu plan vence en ${diasRestantes} días.`;

  return (
    <div
      className={`mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3 backdrop-blur-sm ${
        urgente
          ? "border-red-500/30 bg-red-500/10"
          : "border-amber-500/30 bg-amber-500/10"
      }`}
    >
      <p
        className={`text-sm font-medium ${
          urgente
            ? "text-red-600 dark:text-red-400"
            : "text-amber-700 dark:text-amber-400"
        }`}
      >
        {texto}
      </p>
      <Link
        href="/suscripcion"
        className="text-sm font-semibold text-[var(--accent-from)] hover:opacity-80"
      >
        Ver mi plan →
      </Link>
    </div>
  );
}
