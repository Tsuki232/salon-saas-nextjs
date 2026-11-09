import { z } from "zod";

export const MIN_PASSWORD_LENGTH = 8;

/**
 * Política mínima de contraseñas: 8 caracteres, con letras y números.
 * No exigimos símbolos para no complicarle la vida al dueño de un salón,
 * pero sí evitamos "123456" y similares.
 */
export const passwordSchema = z
  .string()
  .min(
    MIN_PASSWORD_LENGTH,
    `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`
  )
  .refine((v) => /[a-zA-Z]/.test(v), {
    message: "La contraseña debe incluir al menos una letra",
  })
  .refine((v) => /[0-9]/.test(v), {
    message: "La contraseña debe incluir al menos un número",
  });

export const PASSWORD_HINT = `Mínimo ${MIN_PASSWORD_LENGTH} caracteres, con letras y números.`;
