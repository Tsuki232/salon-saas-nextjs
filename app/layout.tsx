import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/app/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CitaFácil — Gestión para peluquerías y spas en Popayán",
    template: "%s · CitaFácil",
  },
  description:
    "Agenda de citas, clientes, caja y reportes para peluquerías, barberías y spas en Popayán, Cauca.",
  applicationName: "CitaFácil",
  keywords: [
    "agenda peluquería",
    "software salón de belleza",
    "citas barbería",
    "Popayán",
    "Cauca",
    "Colombia",
  ],
  openGraph: {
    title: "CitaFácil — Gestión para peluquerías y spas en Popayán",
    description:
      "Agenda de citas, clientes, caja y reportes en un solo lugar. Hecho para negocios de Popayán.",
    locale: "es_CO",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f6fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0a12" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <div className="bg-blobs" aria-hidden="true">
            <span className="blob-3" />
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
