"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { isForeignKeyError } from "./helpers";

export type ActionState = { error?: string } | undefined;

const clientSchema = z.object({
  name: z.string().min(2, "El nombre es muy corto"),
  phone: z.string().optional(),
  email: z.string().optional(),
  notes: z.string().optional(),
});

export async function crearCliente(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireSession();
  const parsed = clientSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  await prisma.client.create({
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone || null,
      email: parsed.data.email || null,
      notes: parsed.data.notes || null,
      businessId: session.user.businessId,
    },
  });

  revalidatePath("/clientes");
  redirect("/clientes");
}

export async function actualizarCliente(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireSession();
  const parsed = clientSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const result = await prisma.client.updateMany({
    where: { id, businessId: session.user.businessId },
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone || null,
      email: parsed.data.email || null,
      notes: parsed.data.notes || null,
    },
  });
  if (result.count === 0) return { error: "No se encontró el cliente." };

  revalidatePath("/clientes");
  revalidatePath(`/clientes/${id}`);
  redirect("/clientes");
}

export async function eliminarCliente(id: string) {
  const session = await requireSession();
  try {
    await prisma.client.deleteMany({
      where: { id, businessId: session.user.businessId },
    });
  } catch (err) {
    if (isForeignKeyError(err)) {
      redirect("/clientes?error=en_uso");
    }
    throw err;
  }
  revalidatePath("/clientes");
  redirect("/clientes");
}
