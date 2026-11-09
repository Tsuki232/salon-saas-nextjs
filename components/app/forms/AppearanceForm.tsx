"use client";

import { useActionState, useRef, useState } from "react";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormError, FormSuccess } from "@/components/ui/Misc";
import { Card } from "@/components/ui/Card";
import { actualizarApariencia } from "@/lib/actions/configuracion";
import { THEME_PRESETS, CUSTOM_THEME_ID } from "@/lib/themes";

const MAX_LOGO_BYTES = 350 * 1024;

export function AppearanceForm({
  defaultValues,
}: {
  defaultValues: {
    themeName: string;
    customPrimary: string | null;
    customSecondary: string | null;
    logoUrl: string | null;
  };
}) {
  const [state, formAction] = useActionState(actualizarApariencia, undefined);
  const [themeName, setThemeName] = useState(defaultValues.themeName);
  const [primary, setPrimary] = useState(
    defaultValues.customPrimary ?? "#7c3aed"
  );
  const [secondary, setSecondary] = useState(
    defaultValues.customSecondary ?? "#ec4899"
  );
  const [logoPreview, setLogoPreview] = useState<string | null>(
    defaultValues.logoUrl
  );
  const [removeLogo, setRemoveLogo] = useState(false);
  const [logoError, setLogoError] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_LOGO_BYTES) {
      setLogoError("La imagen es muy pesada. Usa un archivo de máximo 350 KB.");
      return;
    }
    setLogoError(undefined);
    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result as string);
      setRemoveLogo(false);
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveLogo() {
    setRemoveLogo(true);
    setLogoPreview(null);
    setLogoError(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <Card className="max-w-2xl">
      <form action={formAction} className="flex flex-col gap-6">
        <input type="hidden" name="themeName" value={themeName} />
        {themeName === CUSTOM_THEME_ID && (
          <>
            <input type="hidden" name="customPrimary" value={primary} />
            <input type="hidden" name="customSecondary" value={secondary} />
          </>
        )}
        {!removeLogo && logoPreview && logoPreview.startsWith("data:") && (
          <input type="hidden" name="logoUrl" value={logoPreview} />
        )}
        {removeLogo && <input type="hidden" name="removeLogo" value="on" />}

        <div>
          <p className="mb-3 text-sm font-medium text-[var(--foreground)]/80">
            Tema de color
          </p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {THEME_PRESETS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setThemeName(t.id)}
                className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 transition-all ${
                  themeName === t.id
                    ? "border-[var(--foreground)]/60 ring-2 ring-[var(--foreground)]/20"
                    : "border-[var(--surface-border)] hover:border-[var(--foreground)]/30"
                }`}
              >
                <span
                  className="h-8 w-full rounded-lg"
                  style={{
                    background: `linear-gradient(135deg, ${t.light.accentFrom}, ${t.light.accentVia}, ${t.light.accentTo})`,
                  }}
                />
                <span className="text-xs text-[var(--foreground)]">
                  {t.label}
                </span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setThemeName(CUSTOM_THEME_ID)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 transition-all ${
                themeName === CUSTOM_THEME_ID
                  ? "border-[var(--foreground)]/60 ring-2 ring-[var(--foreground)]/20"
                  : "border-[var(--surface-border)] hover:border-[var(--foreground)]/30"
              }`}
            >
              <span
                className="h-8 w-full rounded-lg"
                style={{
                  background: `linear-gradient(135deg, ${primary}, ${secondary})`,
                }}
              />
              <span className="text-xs text-[var(--foreground)]">
                Personalizado
              </span>
            </button>
          </div>
        </div>

        {themeName === CUSTOM_THEME_ID && (
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-[var(--foreground)]/80">
                Color primario
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primary}
                  onChange={(e) => setPrimary(e.target.value)}
                  className="h-10 w-14 rounded-lg border border-[var(--surface-border)] bg-transparent"
                />
                <span className="text-xs text-[var(--muted)]">{primary}</span>
              </div>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-[var(--foreground)]/80">
                Color secundario
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={secondary}
                  onChange={(e) => setSecondary(e.target.value)}
                  className="h-10 w-14 rounded-lg border border-[var(--surface-border)] bg-transparent"
                />
                <span className="text-xs text-[var(--muted)]">
                  {secondary}
                </span>
              </div>
            </label>
          </div>
        )}

        <div>
          <p className="mb-3 text-sm font-medium text-[var(--foreground)]/80">
            Logo del negocio
          </p>
          <div className="flex items-center gap-4">
            {logoPreview && !removeLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoPreview}
                alt="Logo"
                className="h-16 w-16 rounded-xl object-cover ring-1 ring-[var(--surface-border)]"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-dashed border-[var(--surface-border)] text-center text-[10px] text-[var(--muted)]">
                Sin logo
              </div>
            )}
            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-xs text-[var(--muted)] file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--surface)] file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-[var(--foreground)]"
              />
              {logoPreview && !removeLogo && (
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="text-left text-xs font-medium text-red-500 hover:text-red-600"
                >
                  Quitar logo
                </button>
              )}
            </div>
          </div>
          {logoError && (
            <p className="mt-2 text-xs text-red-500">{logoError}</p>
          )}
        </div>

        <FormError message={state?.error} />
        <FormSuccess
          message={state?.success ? "Apariencia actualizada." : undefined}
        />
        <div>
          <SubmitButton>Guardar apariencia</SubmitButton>
        </div>
      </form>
    </Card>
  );
}
