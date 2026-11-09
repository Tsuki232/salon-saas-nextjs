import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/citas/:path*",
    "/clientes/:path*",
    "/servicios/:path*",
    "/personal/:path*",
    "/productos/:path*",
    "/caja/:path*",
    "/reportes/:path*",
    "/configuracion/:path*",
    "/suscripcion/:path*",
    "/admin/:path*",
  ],
};
