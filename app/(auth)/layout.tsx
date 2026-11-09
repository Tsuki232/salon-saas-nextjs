import Link from "next/link";
import { ThemeToggle } from "@/components/app/ThemeToggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <Link
        href="/"
        className="mb-6 text-lg font-semibold text-gradient"
      >
        CitaFácil
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
