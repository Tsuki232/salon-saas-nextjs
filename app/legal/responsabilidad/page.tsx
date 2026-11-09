import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalLayout";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = { title: "Descargo de Responsabilidad" };

export default function ResponsabilidadPage() {
  return (
    <LegalPage
      titulo="Descargo de Responsabilidad"
      resumen="Alcance y límites de la responsabilidad del Proveedor sobre el uso de la Plataforma."
    >
      <h2>1. Naturaleza de la herramienta</h2>
      <p>
        {LEGAL.marca} es una <strong>herramienta de apoyo administrativo</strong>.
        No constituye asesoría contable, tributaria, jurídica, financiera ni
        sanitaria. Las decisiones que el establecimiento tome con base en la
        información de la Plataforma son de su exclusiva responsabilidad.
      </p>

      <h2>2. Servicio «tal como está»</h2>
      <p>
        El servicio se presta <strong>«tal como está» y «según
        disponibilidad»</strong>. Dentro de los límites que permite la ley
        colombiana, el Proveedor no otorga garantías implícitas de idoneidad
        para un propósito particular, ni garantiza que la Plataforma esté libre
        de errores o interrupciones.
      </p>

      <h2>3. Exactitud de la información</h2>
      <p>
        La información mostrada (agendas, ingresos, inventarios, reportes)
        proviene de los datos que <strong>el propio usuario registra</strong>.
        El Proveedor no verifica su exactitud y{" "}
        <strong>
          no responde por errores de digitación, omisiones ni por decisiones
          tomadas con base en datos mal ingresados
        </strong>
        .
      </p>

      <h2>4. Obligaciones tributarias y contables</h2>
      <p>
        Los recibos que genera la Plataforma son{" "}
        <strong>comprobantes internos de venta</strong> y{" "}
        <strong>
          no constituyen factura electrónica ni documento equivalente
        </strong>{" "}
        ante la DIAN. Cada establecimiento es el único responsable de cumplir
        sus obligaciones de facturación, declaración y pago de impuestos
        conforme al Estatuto Tributario colombiano.
      </p>

      <h2>5. Datos de clientes finales</h2>
      <p>
        El establecimiento es el <strong>Responsable del Tratamiento</strong> de
        los datos de sus clientes. Declara contar con las autorizaciones
        exigidas por la Ley 1581 de 2012 y{" "}
        <strong>
          mantendrá indemne al Proveedor frente a cualquier reclamación,
          sanción o investigación
        </strong>{" "}
        derivada del uso indebido de esos datos o de la falta de autorización.
      </p>

      <h2>6. Comunicaciones por WhatsApp</h2>
      <p>
        La Plataforma únicamente <strong>prepara un mensaje</strong> que el
        usuario decide enviar desde su propia cuenta de WhatsApp. El Proveedor
        no envía mensajes en nombre del usuario, no almacena conversaciones y no
        responde por el contenido enviado ni por el cumplimiento de las
        políticas de WhatsApp o de las normas sobre comunicaciones comerciales
        no solicitadas.
      </p>

      <h2>7. Copias de seguridad</h2>
      <p>
        El Proveedor realiza esfuerzos razonables para respaldar la información,
        pero <strong>no garantiza la recuperación total</strong> ante fallas
        catastróficas. Se recomienda al usuario exportar y conservar copias
        propias de su información crítica.
      </p>

      <h2>8. Servicios de terceros</h2>
      <p>
        La Plataforma puede apoyarse en proveedores externos de alojamiento,
        conectividad o pagos. El Proveedor no responde por interrupciones,
        fallas o incumplimientos atribuibles a esos terceros.
      </p>

      <h2>9. Fuerza mayor</h2>
      <p>
        El Proveedor no será responsable por incumplimientos derivados de
        eventos de fuerza mayor o caso fortuito, incluyendo fallas eléctricas o
        de telecomunicaciones, ataques informáticos, desastres naturales,
        conmoción interna o actos de autoridad.
      </p>

      <h2>10. Límite de responsabilidad</h2>
      <p>
        En la máxima medida permitida por la ley, la responsabilidad total del
        Proveedor <strong>no excederá el valor pagado por el usuario en los
        tres (3) meses anteriores</strong> al hecho generador. No se responde
        por lucro cesante, pérdida de clientela ni daños indirectos.
      </p>
      <p>
        Estas limitaciones <strong>no excluyen</strong> la responsabilidad por
        dolo o culpa grave, ni los derechos irrenunciables del consumidor
        reconocidos por la Ley 1480 de 2011.
      </p>

      <h2>11. Contacto</h2>
      <p>
        Para reclamaciones o aclaraciones: {LEGAL.email} · {LEGAL.telefono}.
      </p>
    </LegalPage>
  );
}
