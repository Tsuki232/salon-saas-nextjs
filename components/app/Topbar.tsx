import { cerrarSesion } from "@/lib/actions/auth";
import { roleLabel } from "@/lib/permissions";

export function Topbar({
  businessName,
  userName,
  role,
}: {
  businessName: string;
  userName: string;
  role: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-[var(--foreground)]">
          {businessName}
        </p>
        <p className="text-xs text-[var(--muted)]">
          {userName} · {roleLabel(role)}
        </p>
      </div>
      <form action={cerrarSesion}>
        <button
          type="submit"
          className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          Cerrar sesión
        </button>
      </form>
    </div>
  );
}
