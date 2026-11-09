import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SLUG = "salon-bella-popayan";

async function main() {
  const existing = await prisma.business.findUnique({ where: { slug: SLUG } });
  if (existing) {
    const businessId = existing.id;
    await prisma.billingPayment.deleteMany({ where: { businessId } });
    await prisma.saleItem.deleteMany({ where: { sale: { businessId } } });
    await prisma.sale.deleteMany({ where: { businessId } });
    await prisma.appointment.deleteMany({ where: { businessId } });
    await prisma.client.deleteMany({ where: { businessId } });
    await prisma.staff.deleteMany({ where: { businessId } });
    await prisma.service.deleteMany({ where: { businessId } });
    await prisma.product.deleteMany({ where: { businessId } });
    await prisma.user.deleteMany({ where: { businessId } });
    await prisma.business.delete({ where: { id: businessId } });
  }

  const passwordHash = await bcrypt.hash(process.env.SEED_DEMO_PASSWORD ?? "change-me-demo", 10);

  const business = await prisma.business.create({
    data: {
      name: "Salón Demo",
      slug: SLUG,
      phone: "3001234567",
      address: "Calle 1 # 2-34, Ciudad Ejemplo",
      openHour: "08:00",
      closeHour: "19:00",
      planId: "SALON",
      subscriptionStatus: "ACTIVA",
      paidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      users: {
        create: {
          name: "María Fernanda Rojas",
          email: "demo@example.com",
          passwordHash,
          role: "OWNER",
        },
      },
    },
  });

  const [camila, andres, laura] = await Promise.all([
    prisma.staff.create({
      data: { businessId: business.id, name: "Camila Rojas", phone: "3001234567", colorTag: "#7c3aed" },
    }),
    prisma.staff.create({
      data: { businessId: business.id, name: "Andrés Muñoz", phone: "3001234567", colorTag: "#0891b2" },
    }),
    prisma.staff.create({
      data: { businessId: business.id, name: "Laura Díaz", phone: "3001234567", colorTag: "#db2777" },
    }),
  ]);

  const services = await Promise.all([
    prisma.service.create({
      data: { businessId: business.id, name: "Corte de cabello", category: "Cabello", durationMinutes: 30, price: 25000 },
    }),
    prisma.service.create({
      data: { businessId: business.id, name: "Corte + barba", category: "Cabello", durationMinutes: 45, price: 35000 },
    }),
    prisma.service.create({
      data: { businessId: business.id, name: "Tinte", category: "Cabello", durationMinutes: 90, price: 80000 },
    }),
    prisma.service.create({
      data: { businessId: business.id, name: "Manicure", category: "Uñas", durationMinutes: 40, price: 20000 },
    }),
    prisma.service.create({
      data: { businessId: business.id, name: "Pedicure", category: "Uñas", durationMinutes: 45, price: 25000 },
    }),
    prisma.service.create({
      data: { businessId: business.id, name: "Alisado / keratina", category: "Cabello", durationMinutes: 150, price: 150000 },
    }),
  ]);
  const [corte, corteBarba, tinte, manicure, pedicure] = services;

  const clients = await Promise.all([
    prisma.client.create({ data: { businessId: business.id, name: "Diana Marcela Paz", phone: "3001234567" } }),
    prisma.client.create({ data: { businessId: business.id, name: "Juan Pablo Hoyos", phone: "3001234567" } }),
    prisma.client.create({ data: { businessId: business.id, name: "Sofía Realpe", phone: "3001234567" } }),
    prisma.client.create({ data: { businessId: business.id, name: "Carlos Andrés Muñoz", phone: "3001234567" } }),
    prisma.client.create({ data: { businessId: business.id, name: "Valentina Ipuz", phone: "3001234567" } }),
  ]);
  const [diana, juanPablo, sofia, carlos, valentina] = clients;

  await prisma.product.createMany({
    data: [
      { businessId: business.id, name: "Shampoo 250ml", price: 18000, stock: 12 },
      { businessId: business.id, name: "Acondicionador 250ml", price: 18000, stock: 10 },
      { businessId: business.id, name: "Cera para peinar", price: 22000, stock: 6 },
      { businessId: business.id, name: "Tinte profesional", price: 35000, stock: 2 },
    ],
  });

  function todayAt(hour: number, minute = 0) {
    const d = new Date();
    d.setHours(hour, minute, 0, 0);
    return d;
  }
  function addMinutes(date: Date, minutes: number) {
    return new Date(date.getTime() + minutes * 60000);
  }

  const citaCompletadaInicio = todayAt(9, 0);
  const citaCompletada = await prisma.appointment.create({
    data: {
      businessId: business.id,
      clientId: diana.id,
      staffId: camila.id,
      serviceId: corte.id,
      startTime: citaCompletadaInicio,
      endTime: addMinutes(citaCompletadaInicio, corte.durationMinutes),
      status: "COMPLETADA",
    },
  });
  await prisma.sale.create({
    data: {
      businessId: business.id,
      clientId: diana.id,
      staffId: camila.id,
      appointmentId: citaCompletada.id,
      total: corte.price,
      paymentMethod: "EFECTIVO",
      items: {
        create: {
          type: "SERVICE",
          description: corte.name,
          quantity: 1,
          unitPrice: corte.price,
          subtotal: corte.price,
          serviceId: corte.id,
        },
      },
    },
  });

  const confirmadaInicio = todayAt(11, 30);
  await prisma.appointment.create({
    data: {
      businessId: business.id,
      clientId: juanPablo.id,
      staffId: andres.id,
      serviceId: corteBarba.id,
      startTime: confirmadaInicio,
      endTime: addMinutes(confirmadaInicio, corteBarba.durationMinutes),
      status: "CONFIRMADA",
    },
  });

  const pendienteInicio = todayAt(15, 0);
  await prisma.appointment.create({
    data: {
      businessId: business.id,
      clientId: sofia.id,
      staffId: laura.id,
      serviceId: manicure.id,
      startTime: pendienteInicio,
      endTime: addMinutes(pendienteInicio, manicure.durationMinutes),
      status: "PENDIENTE",
    },
  });

  const tarde = todayAt(16, 30);
  await prisma.appointment.create({
    data: {
      businessId: business.id,
      clientId: carlos.id,
      staffId: camila.id,
      serviceId: tinte.id,
      startTime: tarde,
      endTime: addMinutes(tarde, tinte.durationMinutes),
      status: "PENDIENTE",
    },
  });

  const manana = addMinutes(todayAt(10, 0), 24 * 60);
  await prisma.appointment.create({
    data: {
      businessId: business.id,
      clientId: valentina.id,
      staffId: laura.id,
      serviceId: pedicure.id,
      startTime: manana,
      endTime: addMinutes(manana, pedicure.durationMinutes),
      status: "PENDIENTE",
    },
  });

  console.log("Datos demo creados. Inicia sesión con demo@example.com / demo1234");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
