import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalLayout";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = { title: "Términos y Condiciones" };

export default function TerminosPage() {
  return (
    <LegalPage
      titulo="Términos y Condiciones de Uso"
      resumen={`Condiciones que rigen el uso de la plataforma ${LEGAL.marca}.`}
    >
      <h2>1. Aceptación</h2>
      <p>
        Estos Términos y Condiciones regulan el acceso y uso de la plataforma{" "}
        <strong>{LEGAL.marca}</strong> (en adelante, «la Plataforma»), de
        titularidad de {LEGAL.razonSocial}, identificado con{" "}
        {LEGAL.documento}, con domicilio en {LEGAL.direccion} (en adelante, «el
        Proveedor»).
      </p>
      <p>
        Al registrarse, acceder o utilizar la Plataforma, el usuario declara que
        ha leído, entendido y aceptado íntegramente estos Términos. Si no está
        de acuerdo, debe abstenerse de usar la Plataforma.
      </p>

      <h2>2. Descripción del servicio</h2>
      <p>
        La Plataforma es un software de gestión ofrecido bajo modalidad SaaS
        (software como servicio) que permite a establecimientos de belleza
        administrar agendas, clientes, servicios, inventario, caja y reportes.
      </p>
      <p>
        El Proveedor entrega una <strong>licencia de uso limitada, revocable,
        no exclusiva e intransferible</strong>, restringida al establecimiento
        contratante y a las personas que éste autorice. No se transfiere la
        propiedad del software.
      </p>

      <h2>3. Cuenta y credenciales</h2>
      <ul>
        <li>
          El usuario es el único responsable de la veracidad de los datos que
          registra.
        </li>
        <li>
          Las credenciales son <strong>personales e intransferibles</strong>. El
          usuario responde por toda actividad realizada con su cuenta.
        </li>
        <li>
          El usuario debe notificar de inmediato al Proveedor cualquier uso no
          autorizado de su cuenta.
        </li>
        <li>
          El titular de la cuenta es responsable de los accesos que otorgue a
          sus empleados y de revocarlos cuando corresponda.
        </li>
      </ul>

      <h2>4. Planes, pagos y renovación</h2>
      <ul>
        <li>
          El servicio se presta bajo <strong>suscripción periódica</strong>{" "}
          según el plan contratado y las tarifas vigentes publicadas en la
          Plataforma.
        </li>
        <li>
          Los valores están expresados en <strong>pesos colombianos (COP)</strong>{" "}
          e incluyen los impuestos que resulten aplicables conforme a la
          legislación colombiana.
        </li>
        <li>
          El acceso se habilita una vez verificado el pago. El{" "}
          <strong>incumplimiento en el pago suspende el acceso</strong> a la
          Plataforma, sin que ello implique pérdida inmediata de la información
          almacenada.
        </li>
        <li>
          El Proveedor podrá modificar las tarifas notificando al usuario con al
          menos <strong>treinta (30) días calendario</strong> de anticipación.
          El usuario podrá terminar el contrato si no acepta las nuevas
          condiciones.
        </li>
        <li>
          Salvo disposición legal en contrario, los pagos efectuados por
          períodos ya iniciados no son reembolsables.
        </li>
      </ul>

      <h2>5. Período de prueba</h2>
      <p>
        El Proveedor puede ofrecer un período de prueba gratuito. Durante éste,
        el servicio se presta <strong>«tal como está»</strong>, sin garantía
        alguna, y el Proveedor podrá modificarlo o suspenderlo en cualquier
        momento.
      </p>

      <h2>6. Obligaciones del usuario</h2>
      <p>El usuario se obliga a:</p>
      <ul>
        <li>
          Usar la Plataforma conforme a la ley colombiana, la moral y el orden
          público.
        </li>
        <li>
          <strong>
            Obtener de sus propios clientes la autorización previa, expresa e
            informada
          </strong>{" "}
          para el tratamiento de los datos personales que registre en la
          Plataforma, conforme a la Ley 1581 de 2012.
        </li>
        <li>
          No usar la Plataforma para enviar comunicaciones no solicitadas (spam)
          ni para fines contrarios a la ley.
        </li>
        <li>
          No intentar acceder a cuentas o datos de otros establecimientos, ni
          vulnerar los mecanismos de seguridad.
        </li>
        <li>
          No realizar ingeniería inversa, descompilar, copiar ni revender el
          software.
        </li>
        <li>Mantener actualizada su información de contacto y facturación.</li>
      </ul>

      <h2>7. Propiedad intelectual</h2>
      <p>
        El software, la marca, el diseño, el código fuente y toda la
        documentación son propiedad exclusiva del Proveedor y están protegidos
        por la Decisión Andina 351 de 1993, la Ley 23 de 1982 y demás normas
        aplicables sobre derechos de autor.
      </p>
      <p>
        <strong>
          La información y los datos que el usuario carga en la Plataforma son
          de su propiedad.
        </strong>{" "}
        El usuario otorga al Proveedor una licencia limitada para alojarlos y
        procesarlos con el único fin de prestar el servicio.
      </p>

      <h2>8. Disponibilidad del servicio</h2>
      <p>
        El Proveedor realizará esfuerzos razonables para mantener la Plataforma
        disponible, pero <strong>no garantiza disponibilidad ininterrumpida</strong>.
        El servicio puede verse afectado por mantenimientos programados, fallas
        de terceros proveedores (alojamiento, conectividad, energía) o eventos
        de fuerza mayor.
      </p>
      <p>
        El Proveedor podrá realizar mantenimientos que impliquen suspensión
        temporal, procurando avisar con antelación cuando sea posible.
      </p>

      <h2>9. Limitación de responsabilidad</h2>
      <p>
        En la máxima medida permitida por la legislación colombiana, la
        responsabilidad total y acumulada del Proveedor frente al usuario por
        cualquier concepto{" "}
        <strong>
          no excederá el valor efectivamente pagado por el usuario durante los
          tres (3) meses anteriores
        </strong>{" "}
        al hecho que genera la reclamación.
      </p>
      <p>
        El Proveedor no responde por lucro cesante, pérdida de clientela, daño
        reputacional ni perjuicios indirectos o consecuenciales.
      </p>
      <p>
        Esta limitación <strong>no aplica</strong> en casos de dolo o culpa
        grave del Proveedor, ni respecto de derechos irrenunciables reconocidos
        al consumidor por la Ley 1480 de 2011, cuando ésta resulte aplicable.
      </p>

      <h2>10. Terminación</h2>
      <ul>
        <li>
          El usuario puede terminar la suscripción en cualquier momento
          notificando al Proveedor; el servicio continuará hasta el fin del
          período pagado.
        </li>
        <li>
          El Proveedor puede suspender o terminar el servicio por
          incumplimiento de estos Términos, uso fraudulento o mora en el pago,
          previa comunicación al usuario cuando ello sea posible.
        </li>
        <li>
          Terminado el contrato, el usuario podrá solicitar una copia de su
          información dentro de los <strong>treinta (30) días calendario</strong>{" "}
          siguientes. Vencido ese plazo, el Proveedor podrá eliminarla de forma
          definitiva.
        </li>
      </ul>

      <h2>11. Modificaciones</h2>
      <p>
        El Proveedor podrá modificar estos Términos. Los cambios sustanciales se
        informarán por correo electrónico o dentro de la Plataforma. El uso
        continuado después de la notificación constituye aceptación.
      </p>

      <h2>12. Ley aplicable y solución de controversias</h2>
      <p>
        Estos Términos se rigen por las leyes de la{" "}
        <strong>República de Colombia</strong>. Las partes procurarán resolver
        de buena fe cualquier controversia mediante arreglo directo dentro de
        los treinta (30) días siguientes. De no lograrse, se someterán a los
        jueces competentes de {LEGAL.ciudad}.
      </p>

      <h2>13. Contacto</h2>
      <p>
        Para cualquier consulta relacionada con estos Términos: {LEGAL.email} ·{" "}
        {LEGAL.telefono}.
      </p>
    </LegalPage>
  );
}
