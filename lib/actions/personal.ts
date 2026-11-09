"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/session";
import { isForeignKeyError } from "./helpers";
import { getPlan } from "@/lib/plans";
import { passwordSchema } from "@/lib/password";

export type ActionState = { error?: string } | undefined;

const staffSchema = z.object({
  name: z.string().min(2, "El nombre es muy corto"),
  phone: z.string().optional(),
  colorTag: z.string().optional(),
});

export async function crearStaff(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireOwner();
  const parsed = staffSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  // El plan limita cuánta gente puede atender.
  const business = await prisma.business.findUnique({
    where: { id: session.user.businessId },
    select: { planId: true },
  });
  const plan = getPlan(business?.planId ?? "BASICO");
  if (plan.maxStaff !== null) {
    const actuales = await prisma.staff.count({
      where: { businessId: session.user.businessId },
    });
    if (actuales >= plan.maxStaff) {
      return {
        error: `Tu plan ${plan.label} permite ${plan.maxStaff} ${
          plan.maxStaff === 1 ? "persona" : "personas"
        }. Cambia de plan para agregar más.`,
      };
    }
  }

  await prisma.staff.create({
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone || null,
      colorTag: parsed.data.colorTag || "#7c3aed",
      businessId: session.user.businessId,
    },
  });

  revalidatePath("/personal");
  redirect("/personal");
}

export async function actualizarStaff(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireOwner();
  const parsed = staffSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const result = await prisma.staff.updateMany({
    where: { id, businessId: session.user.businessId },
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone || null,
      colorTag: parsed.data.colorTag || "#7c3aed",
    },
  });
  if (result.count === 0) return { error: "No se encontró el integrante del personal." };

  revalidatePath("/personal");
  redirect("/personal");
}

export async function alternarStaffActivo(id: string, active: boolean) {
  const session = await requireOwner();
  await prisma.staff.updateMany({
    where: { id, businessId: session.user.businessId },
    data: { active },
  });
  revalidatePath("/personal");
}

export async function eliminarStaff(id: string) {
  const session = await requireOwner();

  const staff = await prisma.staff.findFirst({
    where: { id, businessId: session.user.businessId },
    include: { user: true },
  });
  if (!staff) redirect("/personal");
  if (staff.user) redirect("/personal?error=tiene_acceso");

  try {
    await prisma.staff.deleteMany({
      where: { id, businessId: session.user.businessId },
    });
  } catch (err) {
    if (isForeignKeyError(err)) {
      redirect("/personal?error=en_uso");
    }
    throw err;
  }
  revalidatePath("/personal");
  redirect("/personal");
}

const accesoSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: passwordSchema,
});

/** Crea (o actualiza) la cuenta de acceso de un integrante del personal. */
export async function guardarAccesoStaff(
  staffId: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireOwner();
  const businessId = session.user.businessId;

  const parsed = accesoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const password = parsed.data.password;
  const email = parsed.data.email.trim().toLowerCase();

  const staff = await prisma.staff.findFirst({
    where: { id: staffId, businessId },
    include: { user: true },
  });
  if (!staff) return { error: "No se encontró el integrante del personal." };

  // El correo no puede estar tomado por otra cuenta.
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && existing.id !== staff.user?.id) {
    return { error: "Ya existe una cuenta con ese correo." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  if (staff.user) {
    await prisma.user.update({
      where: { id: staff.user.id },
      data: { email, passwordHash, name: staff.name },
    });
  } else {
    await prisma.user.create({
      data: {
        businessId,
        staffId: staff.id,
        name: staff.name,
        email,
        passwordHash,
        role: "EMPLOYEE",
      },
    });
  }

  revalidatePath("/personal");
  redirect("/personal?ok=acceso");
}

export async function quitarAccesoStaff(staffId: string) {
  const session = await requireOwner();

  const staff = await prisma.staff.findFirst({
    where: { id: staffId, businessId: session.user.businessId },
    include: { user: true },
  });
  if (!staff?.user) redirect("/personal");

  // Nunca dejar el negocio sin dueño.
  if (staff.user.role === "OWNER") {
    redirect("/personal?error=es_dueno");
  }

  await prisma.user.delete({ where: { id: staff.user.id } });

  revalidatePath("/personal");
  redirect("/personal?ok=acceso_quitado");
}
