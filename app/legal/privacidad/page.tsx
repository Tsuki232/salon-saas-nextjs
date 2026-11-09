import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalLayout";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = { title: "Política de Privacidad" };

export default function PrivacidadPage() {
  return (
    <LegalPage
      titulo="Política de Privacidad"
      resumen="Cómo recolectamos, usamos y protegemos la información en la Plataforma."
    >
      <h2>1. Quién es responsable</h2>
      <p>
        {LEGAL.razonSocial}, identificado con {LEGAL.documento}, con domicilio en{" "}
        {LEGAL.direccion}, es el responsable del tratamiento de los datos de las
        <strong> cuentas de usuario</strong> de la Plataforma {LEGAL.marca}.
      </p>
      <p>
        Respecto de los <strong>datos de los clientes finales</strong> que cada
        establecimiento registra (nombre, teléfono, historial de citas), el
        establecimiento actúa como <strong>Responsable del Tratamiento</strong> y{" "}
        {LEGAL.marca} actúa únicamente como{" "}
        <strong>Encargado del Tratamiento</strong>, en los términos de la Ley
        1581 de 2012.
      </p>

      <h2>2. Qué información recolectamos</h2>
      <h3>2.1. De los establecimientos usuarios</h3>
      <ul>
        <li>Nombre del negocio, dirección, teléfono y horario de atención.</li>
        <li>Nombre, correo electrónico y contraseña (cifrada) de cada usuario.</li>
        <li>Información de la suscripción y registro de pagos.</li>
      </ul>
      <h3>2.2. Cargada por el establecimiento</h3>
      <ul>
        <li>Datos de sus clientes: nombre, teléfono, correo y notas.</li>
        <li>Citas, servicios prestados, ventas y productos.</li>
        <li>Datos del personal que atiende.</li>
      </ul>
      <h3>2.3. Técnica</h3>
      <ul>
        <li>
          Cookies estrictamente necesarias para mantener la sesión iniciada.
        </li>
        <li>Registros técnicos de acceso para seguridad y diagnóstico.</li>
      </ul>
      <p>
        <strong>
          No recolectamos datos sensibles ni información financiera como números
          de tarjeta.
        </strong>{" "}
        Los pagos de la suscripción se gestionan por canales externos.
      </p>

      <h2>3. Para qué usamos la información</h2>
      <ul>
        <li>Prestar, mantener y mejorar el servicio contratado.</li>
        <li>Autenticar usuarios y proteger las cuentas.</li>
        <li>Gestionar la facturación y el estado de la suscripción.</li>
        <li>
          Enviar comunicaciones operativas (vencimientos, cambios del servicio,
          avisos de seguridad).
        </li>
        <li>Atender solicitudes de soporte.</li>
        <li>Cumplir obligaciones legales.</li>
      </ul>
      <p>
        <strong>
          No vendemos, arrendamos ni comercializamos la información con
          terceros.
        </strong>
      </p>

      <h2>4. Cookies</h2>
      <p>
        La Plataforma usa exclusivamente cookies{" "}
        <strong>técnicas y necesarias</strong> para el funcionamiento de la
        sesión y la preferencia de tema (claro/oscuro). No utilizamos cookies
        publicitarias ni de rastreo de terceros.
      </p>

      <h2>5. Con quién compartimos</h2>
      <p>Solo compartimos información con:</p>
      <ul>
        <li>
          <strong>Proveedores de infraestructura</strong> (alojamiento y base de
          datos), que actúan bajo instrucciones y con obligaciones de
          confidencialidad.
        </li>
        <li>
          <strong>Autoridades competentes</strong>, cuando exista orden judicial
          o requerimiento legal.
        </li>
      </ul>

      <h2>6. Seguridad</h2>
      <p>
        Aplicamos medidas técnicas y organizativas razonables, entre ellas:
      </p>
      <ul>
        <li>Contraseñas almacenadas con cifrado unidireccional (bcrypt).</li>
        <li>Sesiones firmadas y control de acceso por roles.</li>
        <li>
          Aislamiento de la información entre establecimientos: ningún negocio
          puede ver los datos de otro.
        </li>
        <li>Límite de intentos de inicio de sesión.</li>
        <li>Cabeceras de seguridad y transmisión cifrada (HTTPS) en producción.</li>
      </ul>
      <p>
        Ningún sistema es completamente invulnerable. El Proveedor{" "}
        <strong>
          no garantiza seguridad absoluta frente a ataques informáticos
        </strong>
        , pero se compromete a notificar los incidentes que afecten datos
        personales conforme a la normativa vigente.
      </p>

      <h2>7. Conservación</h2>
      <p>
        Conservamos la información mientras la cuenta esté activa y hasta{" "}
        <strong>treinta (30) días calendario</strong> después de terminada la
        relación, salvo que la ley exija un plazo mayor (por ejemplo, para
        soportes contables).
      </p>

      <h2>8. Derechos del titular</h2>
      <p>
        Conforme a la Ley 1581 de 2012, el titular puede conocer, actualizar,
        rectificar y suprimir sus datos, así como revocar la autorización. El
        procedimiento se detalla en la{" "}
        <a href="/legal/datos">Política de Tratamiento de Datos</a>.
      </p>

      <h2>9. Menores de edad</h2>
      <p>
        La Plataforma no está dirigida a menores de edad. Si un establecimiento
        registra datos de un menor como cliente, debe contar con autorización de
        su representante legal y velar por el interés superior del menor.
      </p>

      <h2>10. Contacto</h2>
      <p>
        Consultas sobre privacidad: <strong>{LEGAL.email}</strong> ·{" "}
        {LEGAL.telefono} · {LEGAL.direccion}.
      </p>
    </LegalPage>
  );
}
