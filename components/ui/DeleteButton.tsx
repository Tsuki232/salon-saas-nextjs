"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Trash2, Loader2 } from "lucide-react";
import { ConfirmDialog } from "./ConfirmDialog";

export function DeleteButton({
  confirmTitle = "¿Eliminar este registro?",
  confirmMessage = "Esta acción no se puede deshacer.",
  label = "Eliminar",
}: {
  confirmTitle?: string;
  confirmMessage?: string;
  label?: string;
}) {
  const { pending } = useFormStatus();
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  return (
    <>
      <button
        type="button"
        disabled={pending}
        onClick={(e) => {
          formRef.current = e.currentTarget.form;
          setOpen(true);
        }}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-red-500 transition-colors hover:text-red-600 disabled:opacity-50"
      >
        {pending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Trash2 className="h-3.5 w-3.5" />
        )}
        {pending ? "Eliminando..." : label}
      </button>
      <ConfirmDialog
        open={open}
        title={confirmTitle}
        description={confirmMessage}
        pending={pending}
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          setOpen(false);
          formRef.current?.requestSubmit();
        }}
      />
    </>
  );
}
