function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function toDateInputValue(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;
}

export function toTimeInputValue(date: Date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDateEs(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(d);
}

export function formatTimeEs(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

function onlyDigits(phone: string) {
  return phone.replace(/[^0-9]/g, "");
}

export function buildWhatsappReminderLink(params: {
  phone: string;
  clientName: string;
  businessName: string;
  serviceName: string;
  date: Date | string;
  time: Date | string;
}) {
  const digits = onlyDigits(params.phone);
  const withCountryCode = digits.startsWith("57") ? digits : `57${digits}`;
  const message = `Hola ${params.clientName}, te recordamos tu cita en ${params.businessName} para ${params.serviceName} el ${formatDateEs(
    params.date
  )} a las ${formatTimeEs(params.time)}. ¡Te esperamos!`;
  return `https://wa.me/${withCountryCode}?text=${encodeURIComponent(message)}`;
}

export function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
