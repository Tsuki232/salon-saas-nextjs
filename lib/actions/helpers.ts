import { Prisma } from "@prisma/client";

export function isForeignKeyError(err: unknown) {
  return (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    (err.code === "P2003" || err.code === "P2014")
  );
}
