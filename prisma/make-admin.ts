/**
 * Convierte una cuenta existente en superadmin de la plataforma.
 *
 * Uso:
 *   npm run make-admin -- tu@correo.com
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Falta el correo.\n  npm run make-admin -- tu@correo.com");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(
      `No existe ninguna cuenta con el correo "${email}".\n` +
        "Regístrate primero en la app y vuelve a correr este comando."
    );
    process.exit(1);
  }

  await prisma.user.update({
    where: { email },
    data: { role: "SUPERADMIN" },
  });

  console.log(`Listo. "${email}" ahora es superadmin.`);
  console.log("Cierra sesión y vuelve a entrar para ver el panel en /admin");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
