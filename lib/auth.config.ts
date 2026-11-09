import { NextResponse } from "next/server";
import type { NextAuthConfig } from "next-auth";
import { canAccessPath } from "@/lib/permissions";

const PROTECTED_PATHS = [
  "/dashboard",
  "/citas",
  "/clientes",
  "/servicios",
  "/personal",
  "/productos",
  "/caja",
  "/reportes",
  "/configuracion",
  "/suscripcion",
  "/admin",
];

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    // El middleware decodifica el JWT, así que copiamos el rol a la sesión
    // para poder decidir permisos antes de llegar a la página.
    session: ({ session, token }) => {
      if (session.user) {
        session.user.businessId = token.businessId as string;
        session.user.role = token.role as string;
        session.user.staffId = (token.staffId as string | null) ?? null;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected = PROTECTED_PATHS.some((p) =>
        nextUrl.pathname.startsWith(p)
      );
      if (!isProtected) return true;
      if (!isLoggedIn) return false;

      // Un empleado que intenta entrar a una sección del dueño vuelve al panel.
      if (!canAccessPath(auth?.user?.role, nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
