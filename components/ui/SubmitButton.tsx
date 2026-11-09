"use client";

import { useFormStatus } from "react-dom";
import { buttonClasses } from "./Button";

export function SubmitButton({
  children,
  pendingText = "Guardando...",
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode;
  pendingText?: string;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={buttonClasses(variant, className)}
    >
      {pending ? pendingText : children}
    </button>
  );
}
