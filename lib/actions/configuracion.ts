"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/session";
import { CUSTOM_THEME_ID, THEME_PRESETS, isValidHexColor } from "@/lib/themes";

export type ActionState = { error?: string; success?: boolean } | undefined;

const MAX_LOGO_LENGTH = 500_000;

/**
 * Solo imágenes de mapa de bits. Se excluye SVG a propósito: puede contener
 * scripts y se sirve desde nuestro propio dominio.
 */
const ALLOWED_LOGO_PREFIXES = [
  "data:image/png;base64,",
  "data:image/jpeg;base64,",
  "data:image/jpg;base64,",
  "data:image/webp;base64,",
];

const appearanceSchema = z.object({
  themeName: z.string().min(1),
  customPrimary: z.string().optional(),
  customSecondary: z.string().optional(),
  logoUrl: z.string().optional(),
  removeLogo: z.string().optional(),
});

export async function actualizarApariencia(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireOwner();
  const parsed = appearanceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Datos inválidos." };

  const { themeName, customPrimary, customSecondary, logoUrl, removeLogo } =
    parsed.data;

  if (themeName === CUSTOM_THEME_ID) {
    if (!customPrimary || !isValidHexColor(customPrimary)) {
      return { error: "El color primario no es válido." };
    }
    if (!customSecondary || !isValidHexColor(customSecondary)) {
      return { error: "El color secundario no es válido." };
    }
  } else if (!THEME_PRESETS.some((t) => t.id === themeName)) {
    return { error: "Tema no válido." };
  }

  let logoUpdate: { logoUrl?: string | null } = {};
  if (removeLogo === "on") {
    logoUpdate = { logoUrl: null };
  } else if (logoUrl && ALLOWED_LOGO_PREFIXES.some((p) => logoUrl.startsWith(p))) {
    if (logoUrl.length > MAX_LOGO_LENGTH) {
      return {
        error: "El logo es demasiado pesado. Usa una imagen más liviana (máx. 350 KB).",
      };
    }
    logoUpdate = { logoUrl };
  }

  await prisma.business.update({
    where: { id: session.user.businessId },
    data: {
      themeName,
      customPrimary: themeName === CUSTOM_THEME_ID ? customPrimary : null,
      customSecondary: themeName === CUSTOM_THEME_ID ? customSecondary : null,
      ...logoUpdate,
    },
  });

  revalidatePath("/configuracion");
  revalidatePath("/", "layout");
  return { success: true };
}

const schema = z.object({
  name: z.string().min(2, "El nombre es muy corto"),
  phone: z.string().optional(),
  address: z.string().optional(),
  openHour: z.string().min(1, "Selecciona una hora de apertura"),
  closeHour: z.string().min(1, "Selecciona una hora de cierre"),
});

export async function actualizarNegocio(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireOwner();
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  await prisma.business.update({
    where: { id: session.user.businessId },
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone || null,
      address: parsed.data.address || null,
      openHour: parsed.data.openHour,
      closeHour: parsed.data.closeHour,
    },
  });

  revalidatePath("/configuracion");
  revalidatePath("/", "layout");
  return { success: true };
}
