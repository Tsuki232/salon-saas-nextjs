"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/session";
import { isForeignKeyError } from "./helpers";

export type ActionState = { error?: string } | undefined;

const serviceSchema = z.object({
  name: z.string().min(2, "El nombre es muy corto"),
  category: z.string().optional(),
  durationMinutes: z.coerce
    .number()
    .int()
    .min(5, "La duración mínima es 5 minutos"),
  price: z.coerce.number().min(0, "El precio no puede ser negativo"),
});

export async function crearServicio(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireOwner();
  const parsed = serviceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  await prisma.service.create({
    data: {
      name: parsed.data.name,
      category: parsed.data.category || null,
      durationMinutes: parsed.data.durationMinutes,
      price: parsed.data.price,
      businessId: session.user.businessId,
    },
  });

  revalidatePath("/servicios");
  redirect("/servicios");
}

export async function actualizarServicio(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireOwner();
  const parsed = serviceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const result = await prisma.service.updateMany({
    where: { id, businessId: session.user.businessId },
    data: {
      name: parsed.data.name,
      category: parsed.data.category || null,
      durationMinutes: parsed.data.durationMinutes,
      price: parsed.data.price,
    },
  });
  if (result.count === 0) return { error: "No se encontró el servicio." };

  revalidatePath("/servicios");
  redirect("/servicios");
}

export async function alternarServicioActivo(id: string, active: boolean) {
  const session = await requireOwner();
  await prisma.service.updateMany({
    where: { id, businessId: session.user.businessId },
    data: { active },
  });
  revalidatePath("/servicios");
}

export async function eliminarServicio(id: string) {
  const session = await requireOwner();
  try {
    await prisma.service.deleteMany({
      where: { id, businessId: session.user.businessId },
    });
  } catch (err) {
    if (isForeignKeyError(err)) {
      redirect("/servicios?error=en_uso");
    }
    throw err;
  }
  revalidatePath("/servicios");
  redirect("/servicios");
}
