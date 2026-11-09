"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { staffScope } from "@/lib/permissions";

export type ActionState = { error?: string } | undefined;

const cartItemSchema = z.object({
  type: z.enum(["SERVICE", "PRODUCT"]),
  id: z.string(),
  quantity: z.number().int().min(1),
});

const saleSchema = z.object({
  clientId: z.string().optional(),
  paymentMethod: z.enum(["EFECTIVO", "TARJETA", "TRANSFERENCIA"]),
  appointmentId: z.string().optional(),
  items: z.string().min(1),
});

export async function registrarVenta(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireSession();
  const businessId = session.user.businessId;

  const parsed = saleSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Datos de venta inválidos." };

  let items: z.infer<typeof cartItemSchema>[];
  try {
    items = z.array(cartItemSchema).min(1).parse(JSON.parse(parsed.data.items));
  } catch {
    return { error: "Agrega al menos un producto o servicio a la venta." };
  }

  const serviceIds = [
    ...new Set(items.filter((i) => i.type === "SERVICE").map((i) => i.id)),
  ];
  const productIds = [
    ...new Set(items.filter((i) => i.type === "PRODUCT").map((i) => i.id)),
  ];

  const [services, products] = await Promise.all([
    prisma.service.findMany({ where: { id: { in: serviceIds }, businessId } }),
    prisma.product.findMany({ where: { id: { in: productIds }, businessId } }),
  ]);

  if (services.length !== serviceIds.length || products.length !== productIds.length) {
    return { error: "Uno de los servicios o productos no es válido." };
  }

  for (const item of items) {
    if (item.type === "PRODUCT") {
      const product = products.find((p) => p.id === item.id)!;
      if (product.stock < item.quantity) {
        return { error: `No hay suficiente stock de "${product.name}".` };
      }
    }
  }

  if (parsed.data.clientId) {
    const client = await prisma.client.findFirst({
      where: { id: parsed.data.clientId, businessId },
    });
    if (!client) return { error: "Cliente no válido." };
  }

  const scope = staffScope(session.user);

  let appointment = null;
  if (parsed.data.appointmentId) {
    // Un empleado solo puede cobrar sus propias citas.
    appointment = await prisma.appointment.findFirst({
      where: {
        id: parsed.data.appointmentId,
        businessId,
        ...(scope ? { staffId: scope } : {}),
      },
    });
    if (!appointment) return { error: "Cita no válida." };
    const yaTieneVenta = await prisma.sale.findUnique({
      where: { appointmentId: appointment.id },
    });
    if (yaTieneVenta) return { error: "Esa cita ya fue cobrada." };
  }

  const saleItemsData = items.map((item) => {
    if (item.type === "SERVICE") {
      const s = services.find((s) => s.id === item.id)!;
      return {
        type: "SERVICE" as const,
        description: s.name,
        quantity: item.quantity,
        unitPrice: s.price,
        subtotal: s.price * item.quantity,
        serviceId: s.id,
      };
    }
    const p = products.find((p) => p.id === item.id)!;
    return {
      type: "PRODUCT" as const,
      description: p.name,
      quantity: item.quantity,
      unitPrice: p.price,
      subtotal: p.price * item.quantity,
      productId: p.id,
    };
  });

  const total = saleItemsData.reduce((sum, i) => sum + i.subtotal, 0);

  const sale = await prisma.$transaction(async (tx) => {
    const created = await tx.sale.create({
      data: {
        businessId,
        clientId: parsed.data.clientId || appointment?.clientId || null,
        // Si cobra un empleado, la venta queda a su nombre.
        staffId: appointment?.staffId ?? session.user.staffId ?? null,
        appointmentId: appointment?.id ?? null,
        total,
        paymentMethod: parsed.data.paymentMethod,
        items: { create: saleItemsData },
      },
    });

    for (const item of items) {
      if (item.type === "PRODUCT") {
        await tx.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }

    if (appointment) {
      await tx.appointment.update({
        where: { id: appointment.id },
        data: { status: "COMPLETADA" },
      });
    }

    return created;
  });

  revalidatePath("/caja");
  revalidatePath("/citas");
  revalidatePath("/reportes");
  revalidatePath("/productos");
  redirect(`/caja/recibo/${sale.id}`);
}
