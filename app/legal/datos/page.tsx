import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalLayout";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = { title: "Tratamiento de Datos Personales" };

export default function DatosPage() {
  return (
    <LegalPage
      titulo="Política de Tratamiento de Datos Personales"
      resumen="Documento exigido por la Ley 1581 de 2012 y el Decreto 1074 de 2015 (Colombia)."
    >
      <h2>1. Marco legal</h2>
      <p>
        La presente política se adopta en cumplimiento de la{" "}
        <strong>Ley 1581 de 2012</strong>, el{" "}
        <strong>Decreto 1074 de 2015</strong> (que compiló el Decreto 1377 de
        2013) y demás normas concordantes sobre protección de datos personales
        en Colombia, así como del derecho fundamental de{" "}
        <em>habeas data</em> consagrado en el artículo 15 de la Constitución
        Política.
      </p>

      <h2>2. Responsable y Encargado</h2>
      <p>
        <strong>Responsable frente a los datos de cuentas de usuario:</strong>{" "}
        {LEGAL.razonSocial}, {LEGAL.documento}, domicilio {LEGAL.direccion},
        correo {LEGAL.email}, teléfono {LEGAL.telefono}.
      </p>
      <p>
        <strong>Encargado frente a los datos de clientes finales:</strong>{" "}
        {LEGAL.marca} trata los datos de los clientes del establecimiento
        únicamente siguiendo sus instrucciones. Cada establecimiento es el
        Responsable de esos datos y debe contar con la autorización de sus
        titulares.
      </p>

      <h2>3. Finalidades del tratamiento</h2>
      <ul>
        <li>Prestar el servicio de gestión de agenda y ventas contratado.</li>
        <li>Identificar y autenticar a los usuarios.</li>
        <li>Gestionar la relación contractual, facturación y cobro.</li>
        <li>
          Enviar comunicaciones operativas relacionadas con el servicio.
        </li>
        <li>Atender peticiones, quejas y reclamos.</li>
        <li>Cumplir obligaciones legales y requerimientos de autoridades.</li>
        <li>
          Generar estadísticas internas <strong>agregadas y anonimizadas</strong>{" "}
          para mejorar el producto.
        </li>
      </ul>

      <h2>4. Autorización</h2>
      <p>
        Al crear una cuenta y marcar la casilla de aceptación, el usuario otorga
        autorización <strong>previa, expresa e informada</strong> para el
        tratamiento de sus datos conforme a esta política.
      </p>
      <p>
        El establecimiento usuario declara que{" "}
        <strong>
          cuenta con la autorización de sus propios clientes para registrar sus
          datos
        </strong>{" "}
        en la Plataforma, y mantendrá indemne al Proveedor frente a
        reclamaciones derivadas del incumplimiento de este deber.
      </p>

      <h2>5. Derechos de los titulares</h2>
      <p>Conforme al artículo 8 de la Ley 1581 de 2012, el titular puede:</p>
      <ul>
        <li>
          Conocer, actualizar y rectificar sus datos personales.
        </li>
        <li>
          Solicitar prueba de la autorización otorgada, salvo las excepciones
          legales.
        </li>
        <li>
          Ser informado sobre el uso que se ha dado a sus datos personales.
        </li>
        <li>
          Presentar quejas ante la{" "}
          <strong>Superintendencia de Industria y Comercio (SIC)</strong> por
          infracciones a la ley.
        </li>
        <li>
          Revocar la autorización y/o solicitar la supresión del dato, cuando no
          exista deber legal o contractual de conservarlo.
        </li>
        <li>Acceder de forma gratuita a sus datos personales.</li>
      </ul>

      <h2>6. Procedimiento para consultas y reclamos</h2>
      <h3>6.1. Canal de atención</h3>
      <p>
        Las solicitudes se reciben en el correo{" "}
        <strong>{LEGAL.email}</strong> o por escrito en {LEGAL.direccion},
        indicando: nombre completo, documento de identidad, descripción clara de
        la solicitud y datos de contacto para la respuesta.
      </p>
      <h3>6.2. Términos de respuesta</h3>
      <ul>
        <li>
          <strong>Consultas:</strong> se atienden en un término máximo de{" "}
          <strong>diez (10) días hábiles</strong>, prorrogable por cinco (5)
          días hábiles más, informando los motivos.
        </li>
        <li>
          <strong>Reclamos:</strong> se atienden en un término máximo de{" "}
          <strong>quince (15) días hábiles</strong>, prorrogable por ocho (8)
          días hábiles más, informando los motivos.
        </li>
        <li>
          Si el reclamo está incompleto, se requerirá al interesado dentro de
          los cinco (5) días siguientes para que lo subsane. Transcurridos dos
          (2) meses sin respuesta, se entenderá desistido.
        </li>
      </ul>

      <h2>7. Medidas de seguridad</h2>
      <p>
        Se aplican medidas técnicas, humanas y administrativas razonables para
        preservar la <strong>confidencialidad, integridad y disponibilidad</strong>{" "}
        de la información y evitar su adulteración, pérdida, consulta o acceso
        no autorizado.
      </p>

      <h2>8. Transferencia y transmisión internacional</h2>
      <p>
        La infraestructura de alojamiento puede estar ubicada fuera de Colombia.
        En tal caso, el Proveedor exigirá a sus proveedores estándares de
        protección equivalentes a los previstos en la ley colombiana, conforme
        al artículo 26 de la Ley 1581 de 2012.
      </p>

      <h2>9. Vigencia de las bases de datos</h2>
      <p>
        Los datos se conservarán mientras subsista la relación contractual y por
        el término adicional necesario para cumplir obligaciones legales,
        contables y de defensa judicial.
      </p>

      <h2>10. Registro Nacional de Bases de Datos</h2>
      <p>
        El Proveedor evaluará y, cuando resulte legalmente exigible según su
        naturaleza jurídica y el volumen de activos, realizará el registro de
        sus bases de datos ante el{" "}
        <strong>Registro Nacional de Bases de Datos (RNBD)</strong> de la
        Superintendencia de Industria y Comercio.
      </p>

      <h2>11. Vigencia</h2>
      <p>
        Esta política rige desde su publicación y podrá ser actualizada; los
        cambios sustanciales se comunicarán por los canales habituales.
      </p>
    </LegalPage>
  );
}
