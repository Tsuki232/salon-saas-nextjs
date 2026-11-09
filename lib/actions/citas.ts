"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { staffScope } from "@/lib/permissions";

export type ActionState = { error?: string } | undefined;

const appointmentSchema = z.object({
  clientId: z.string().min(1, "Selecciona un cliente"),
  staffId: z.string().min(1, "Selecciona un integrante del personal"),
  serviceId: z.string().min(1, "Selecciona un servicio"),
  date: z.string().min(1, "Selecciona una fecha"),
  time: z.string().min(1, "Selecciona una hora"),
  notes: z.string().optional(),
});

async function validarPertenencia(
  businessId: string,
  clientId: string,
  staffId: string,
  serviceId: string
) {
  const [client, staff, service] = await Promise.all([
    prisma.client.findFirst({ where: { id: clientId, businessId } }),
    prisma.staff.findFirst({ where: { id: staffId, businessId } }),
    prisma.service.findFirst({ where: { id: serviceId, businessId } }),
  ]);
  if (!client) return { error: "Cliente no válido." } as const;
  if (!staff) return { error: "Integrante del personal no válido." } as const;
  if (!service) return { error: "Servicio no válido." } as const;
  return { service } as const;
}

async function hayChoqueDeHorario(params: {
  businessId: string;
  staffId: string;
  startTime: Date;
  endTime: Date;
  excludeId?: string;
}) {
  const conflicto = await prisma.appointment.findFirst({
    where: {
      businessId: params.businessId,
      staffId: params.staffId,
      status: { not: "CANCELADA" },
      startTime: { lt: params.endTime },
      endTime: { gt: params.startTime },
      ...(params.excludeId ? { id: { not: params.excludeId } } : {}),
    },
  });
  return !!conflicto;
}

export async function crearCita(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireSession();
  const parsed = appointmentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  // Un empleado solo puede agendar citas para sí mismo.
  const scope = staffScope(session.user);
  if (scope && parsed.data.staffId !== scope) {
    return { error: "Solo puedes agendar citas para ti." };
  }

  const check = await validarPertenencia(
    session.user.businessId,
    parsed.data.clientId,
    parsed.data.staffId,
    parsed.data.serviceId
  );
  if ("error" in check) return { error: check.error };

  const startTime = new Date(`${parsed.data.date}T${parsed.data.time}`);
  if (isNaN(startTime.getTime())) return { error: "Fecha u hora no válida." };
  const endTime = new Date(
    startTime.getTime() + check.service.durationMinutes * 60000
  );

  if (
    await hayChoqueDeHorario({
      businessId: session.user.businessId,
      staffId: parsed.data.staffId,
      startTime,
      endTime,
    })
  ) {
    return {
      error: "Ese integrante del personal ya tiene una cita en ese horario.",
    };
  }

  await prisma.appointment.create({
    data: {
      businessId: session.user.businessId,
      clientId: parsed.data.clientId,
      staffId: parsed.data.staffId,
      serviceId: parsed.data.serviceId,
      startTime,
      endTime,
      notes: parsed.data.notes || null,
    },
  });

  revalidatePath("/citas");
  redirect(`/citas?fecha=${parsed.data.date}`);
}

export async function actualizarCita(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireSession();
  const parsed = appointmentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  // Un empleado solo puede tocar sus propias citas, y dejarlas a su nombre.
  const scope = staffScope(session.user);
  const existing = await prisma.appointment.findFirst({
    where: {
      id,
      businessId: session.user.businessId,
      ...(scope ? { staffId: scope } : {}),
    },
  });
  if (!existing) return { error: "No se encontró la cita." };
  if (scope && parsed.data.staffId !== scope) {
    return { error: "Solo puedes agendar citas para ti." };
  }

  const check = await validarPertenencia(
    session.user.businessId,
    parsed.data.clientId,
    parsed.data.staffId,
    parsed.data.serviceId
  );
  if ("error" in check) return { error: check.error };

  const startTime = new Date(`${parsed.data.date}T${parsed.data.time}`);
  if (isNaN(startTime.getTime())) return { error: "Fecha u hora no válida." };
  const endTime = new Date(
    startTime.getTime() + check.service.durationMinutes * 60000
  );

  if (
    await hayChoqueDeHorario({
      businessId: session.user.businessId,
      staffId: parsed.data.staffId,
      startTime,
      endTime,
      excludeId: id,
    })
  ) {
    return {
      error: "Ese integrante del personal ya tiene una cita en ese horario.",
    };
  }

  await prisma.appointment.update({
    where: { id },
    data: {
      clientId: parsed.data.clientId,
      staffId: parsed.data.staffId,
      serviceId: parsed.data.serviceId,
      startTime,
      endTime,
      notes: parsed.data.notes || null,
    },
  });

  revalidatePath("/citas");
  redirect(`/citas?fecha=${parsed.data.date}`);
}

export async function cambiarEstadoCita(
  id: string,
  status: "PENDIENTE" | "CONFIRMADA" | "COMPLETADA" | "CANCELADA" | "NO_ASISTIO"
) {
  const session = await requireSession();
  const scope = staffScope(session.user);
  await prisma.appointment.updateMany({
    where: {
      id,
      businessId: session.user.businessId,
      ...(scope ? { staffId: scope } : {}),
    },
    data: { status },
  });
  revalidatePath("/citas");
  revalidatePath("/dashboard");
}
