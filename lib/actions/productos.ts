"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/session";

export type ActionState = { error?: string } | undefined;

const productSchema = z.object({
  name: z.string().min(2, "El nombre es muy corto"),
  price: z.coerce.number().min(0, "El precio no puede ser negativo"),
  stock: z.coerce.number().int().min(0, "El stock no puede ser negativo"),
});

export async function crearProducto(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireOwner();
  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  await prisma.product.create({
    data: { ...parsed.data, businessId: session.user.businessId },
  });

  revalidatePath("/productos");
  redirect("/productos");
}

export async function actualizarProducto(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireOwner();
  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const result = await prisma.product.updateMany({
    where: { id, businessId: session.user.businessId },
    data: parsed.data,
  });
  if (result.count === 0) return { error: "No se encontró el producto." };

  revalidatePath("/productos");
  redirect("/productos");
}

export async function alternarProductoActivo(id: string, active: boolean) {
  const session = await requireOwner();
  await prisma.product.updateMany({
    where: { id, businessId: session.user.businessId },
    data: { active },
  });
  revalidatePath("/productos");
}

export async function eliminarProducto(id: string) {
  const session = await requireOwner();
  await prisma.product.deleteMany({
    where: { id, businessId: session.user.businessId },
  });
  revalidatePath("/productos");
  redirect("/productos");
}
