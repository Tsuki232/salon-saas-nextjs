/**
 * Limitador de intentos en memoria.
 *
 * LIMITACIÓN CONOCIDA: el contador vive en la memoria del proceso. Si mañana
 * despliegas la app en varias instancias, cada una llevará su propia cuenta, y
 * se reinicia cuando el servidor reinicia. Para producción con varias
 * instancias hay que moverlo a Redis o a la base de datos.
 */

type Intento = { conteo: number; expiraEn: number };

const intentos = new Map<string, Intento>();

/** Limpia entradas viejas para que el mapa no crezca sin control. */
function limpiar(ahora: number) {
  for (const [clave, valor] of intentos) {
    if (valor.expiraEn <= ahora) intentos.delete(clave);
  }
}

export type ResultadoLimite = {
  permitido: boolean;
  /** Segundos que faltan para poder reintentar. */
  esperaSegundos: number;
};

export function registrarIntento(
  clave: string,
  maxIntentos = 5,
  ventanaMs = 15 * 60 * 1000
): ResultadoLimite {
  const ahora = Date.now();
  if (intentos.size > 5000) limpiar(ahora);

  const actual = intentos.get(clave);

  if (!actual || actual.expiraEn <= ahora) {
    intentos.set(clave, { conteo: 1, expiraEn: ahora + ventanaMs });
    return { permitido: true, esperaSegundos: 0 };
  }

  if (actual.conteo >= maxIntentos) {
    return {
      permitido: false,
      esperaSegundos: Math.ceil((actual.expiraEn - ahora) / 1000),
    };
  }

  actual.conteo += 1;
  return { permitido: true, esperaSegundos: 0 };
}

/** Se llama tras un login correcto para borrar el contador. */
export function limpiarIntentos(clave: string) {
  intentos.delete(clave);
}
