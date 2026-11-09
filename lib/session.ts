import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { isOwner, isSuperAdmin } from "@/lib/permissions";

export async function requireSession() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session;
}

/** Igual que requireSession, pero solo deja pasar al dueño del negocio. */
export async function requireOwner() {
  const session = await requireSession();
  if (!isOwner(session.user.role)) redirect("/dashboard");
  return session;
}

/** Solo el dueño de la plataforma (tú). */
export async function requireSuperAdmin() {
  const session = await requireSession();
  if (!isSuperAdmin(session.user.role)) redirect("/dashboard");
  return session;
}
