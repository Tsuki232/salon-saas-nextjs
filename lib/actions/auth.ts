"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import { signIn, signOut } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { trialEndDate } from "@/lib/subscription";
import { registrarIntento, limpiarIntentos } from "@/lib/rateLimit";
import { passwordSchema } from "@/lib/password";

export type AuthActionState = { error?: string } | undefined;

const registroSchema = z.object({
  businessName: z.string().min(2, "El nombre del negocio es muy corto"),
  ownerName: z.string().min(2, "Tu nombre es muy corto"),
  email: z.string().email("Correo inválido"),
  password: passwordSchema,
  phone: z.string().optional(),
  aceptaTerminos: z.string().refine((v) => v === "on", {
    message: "Debes aceptar los términos y la política de datos.",
  }),
});

export async function registrarNegocio(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = registroSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const { businessName, ownerName, password, phone } = parsed.data;
  // Normalizamos el correo para que "Juan@X.com" y "juan@x.com" sean el mismo.
  const email = parsed.data.email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Ya existe una cuenta con ese correo." };
  }

  const base = slugify(businessName) || "negocio";
  let slug = base;
  let suffix = 1;
  while (await prisma.business.findUnique({ where: { slug } })) {
    slug = `${base}-${suffix++}`;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.business.create({
    data: {
      name: businessName,
      slug,
      phone: phone || null,
      // Arranca con la prueba gratis corriendo.
      subscriptionStatus: "PRUEBA",
      paidUntil: trialEndDate(),
      users: {
        create: { name: ownerName, email, passwordHash, role: "OWNER" },
      },
    },
  });

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  } catch (err) {
    if (err instanceof AuthError) {
      return {
        error: "Cuenta creada. Ve a iniciar sesión con tu correo y contraseña.",
      };
    }
    throw err;
  }
}

export async function iniciarSesion(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  // Freno a la fuerza bruta: 5 intentos fallidos por correo cada 15 minutos.
  const limite = registrarIntento(`login:${email}`);
  if (!limite.permitido) {
    const minutos = Math.ceil(limite.esperaSegundos / 60);
    return {
      error: `Demasiados intentos fallidos. Espera ${minutos} ${
        minutos === 1 ? "minuto" : "minutos"
      } e inténtalo de nuevo.`,
    };
  }

  try {
    await signIn("credentials", {
      email,
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
  } catch (err) {
    if (err instanceof AuthError) {
      // Mensaje genérico a propósito: no revelamos si el correo existe.
      return { error: "Correo o contraseña incorrectos." };
    }
    // signIn lanza NEXT_REDIRECT cuando el ingreso fue correcto.
    limpiarIntentos(`login:${email}`);
    throw err;
  }
}

export async function cerrarSesion() {
  await signOut({ redirectTo: "/" });
}
