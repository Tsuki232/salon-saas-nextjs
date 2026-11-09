"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ButtonLink } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/app/ThemeToggle";
import {
  CalendarCheck,
  MessageCircle,
  Wallet,
  Users,
  BarChart3,
  MapPin,
  Scissors,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

const FEATURES: { title: string; description: string; icon: LucideIcon }[] = [
  {
    icon: CalendarCheck,
    title: "Agenda de citas sin choques",
    description:
      "Organiza las citas por estilista y evita que dos clientes queden agendados en el mismo horario.",
  },
  {
    icon: MessageCircle,
    title: "Recordatorios por WhatsApp",
    description:
      "Envía un recordatorio a tus clientes con un clic y reduce las inasistencias.",
  },
  {
    icon: Wallet,
    title: "Caja y ventas",
    description:
      "Cobra servicios y productos, controla el inventario y genera un recibo al instante.",
  },
  {
    icon: Users,
    title: "Clientes con historial",
    description:
      "Cada cliente tiene su ficha con citas y compras anteriores, para conocerlos mejor.",
  },
  {
    icon: BarChart3,
    title: "Reportes claros",
    description:
      "Ve tus ingresos del día, la semana y el mes, y qué servicios se venden más.",
  },
  {
    icon: MapPin,
    title: "Hecho para Popayán",
    description:
      "Pensado para peluquerías, barberías y spas de la ciudad — simple, en español y en pesos colombianos.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="glass sticky top-0 z-30 rounded-none border-x-0 border-t-0">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] shadow-lg shadow-[var(--accent-from)]/25">
              <Scissors className="h-[18px] w-[18px] text-white" strokeWidth={2.2} />
            </span>
            <span className="text-lg font-semibold text-gradient">CitaFácil</span>
          </span>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              Iniciar sesión
            </Link>
            <ButtonLink href="/registro">Crear mi cuenta</ButtonLink>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-6 py-24 text-center">
          <motion.h1
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl"
          >
            <span className="text-gradient text-outline">
              Gestión simple
            </span>{" "}
            <span className="text-[var(--foreground)]">
              para peluquerías, barberías y spas en Popayán
            </span>
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-5 max-w-xl text-[var(--muted)]"
          >
            Agenda de citas, clientes, caja y reportes en un solo lugar. Sin
            complicaciones, para que le dediques tiempo a tus clientes y no a
            los cuadernos.
          </motion.p>
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex justify-center gap-3"
          >
            <ButtonLink href="/registro">
              Crear mi cuenta gratis
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/login" variant="secondary">
              Ya tengo cuenta
            </ButtonLink>
          </motion.div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.5,
                    delay: (i % 3) * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ y: -4 }}
                  className="glass rounded-2xl p-5"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] shadow-lg shadow-[var(--accent-from)]/20">
                    <f.icon className="h-5 w-5 text-white" strokeWidth={2.2} />
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--foreground)]">
                    {f.title}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {f.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-strong mx-auto max-w-2xl rounded-3xl p-10"
          >
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              Empieza en minutos
            </h2>
            <p className="mt-2 text-[var(--muted)]">
              Crea tu cuenta, agrega tus servicios y tu personal, y ya puedes
              agendar tu primera cita.
            </p>
            <div className="mt-6">
              <ButtonLink href="/registro">
                Crear mi cuenta gratis
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-[var(--surface-border)] py-6 text-center text-xs text-[var(--muted)]">
        CitaFácil — hecho para negocios de Popayán, Cauca.
      </footer>
    </div>
  );
}
