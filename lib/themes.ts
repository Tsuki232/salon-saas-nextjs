export type ThemeVars = {
  accentFrom: string;
  accentVia: string;
  accentTo: string;
  blob1: string;
  blob2: string;
  blob3: string;
};

export type ThemePreset = {
  id: string;
  label: string;
  light: ThemeVars;
  dark: ThemeVars;
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "violeta",
    label: "Violeta",
    light: {
      accentFrom: "#7c3aed",
      accentVia: "#a855f7",
      accentTo: "#ec4899",
      blob1: "#a855f7",
      blob2: "#ec4899",
      blob3: "#60a5fa",
    },
    dark: {
      accentFrom: "#a855f7",
      accentVia: "#c084fc",
      accentTo: "#f472b6",
      blob1: "#7c3aed",
      blob2: "#db2777",
      blob3: "#2563eb",
    },
  },
  {
    id: "esmeralda",
    label: "Esmeralda",
    light: {
      accentFrom: "#059669",
      accentVia: "#10b981",
      accentTo: "#06b6d4",
      blob1: "#34d399",
      blob2: "#22d3ee",
      blob3: "#a3e635",
    },
    dark: {
      accentFrom: "#10b981",
      accentVia: "#34d399",
      accentTo: "#67e8f9",
      blob1: "#059669",
      blob2: "#0891b2",
      blob3: "#65a30d",
    },
  },
  {
    id: "oceano",
    label: "Océano",
    light: {
      accentFrom: "#0284c7",
      accentVia: "#0ea5e9",
      accentTo: "#6366f1",
      blob1: "#38bdf8",
      blob2: "#818cf8",
      blob3: "#22d3ee",
    },
    dark: {
      accentFrom: "#38bdf8",
      accentVia: "#7dd3fc",
      accentTo: "#a5b4fc",
      blob1: "#0284c7",
      blob2: "#4f46e5",
      blob3: "#0e7490",
    },
  },
  {
    id: "atardecer",
    label: "Atardecer",
    light: {
      accentFrom: "#ea580c",
      accentVia: "#f97316",
      accentTo: "#ec4899",
      blob1: "#fb923c",
      blob2: "#f472b6",
      blob3: "#fbbf24",
    },
    dark: {
      accentFrom: "#fb923c",
      accentVia: "#fbbf24",
      accentTo: "#f472b6",
      blob1: "#ea580c",
      blob2: "#db2777",
      blob3: "#d97706",
    },
  },
  {
    id: "rosa",
    label: "Rosa",
    light: {
      accentFrom: "#db2777",
      accentVia: "#ec4899",
      accentTo: "#f43f5e",
      blob1: "#f472b6",
      blob2: "#fb7185",
      blob3: "#f9a8d4",
    },
    dark: {
      accentFrom: "#ec4899",
      accentVia: "#f472b6",
      accentTo: "#fb7185",
      blob1: "#db2777",
      blob2: "#e11d48",
      blob3: "#be185d",
    },
  },
  {
    id: "bosque",
    label: "Bosque",
    light: {
      accentFrom: "#15803d",
      accentVia: "#16a34a",
      accentTo: "#65a30d",
      blob1: "#4ade80",
      blob2: "#a3e635",
      blob3: "#34d399",
    },
    dark: {
      accentFrom: "#22c55e",
      accentVia: "#4ade80",
      accentTo: "#a3e635",
      blob1: "#15803d",
      blob2: "#4d7c0f",
      blob3: "#065f46",
    },
  },
  {
    id: "dorado",
    label: "Dorado",
    light: {
      accentFrom: "#b45309",
      accentVia: "#d97706",
      accentTo: "#f59e0b",
      blob1: "#fbbf24",
      blob2: "#fb923c",
      blob3: "#fde047",
    },
    dark: {
      accentFrom: "#f59e0b",
      accentVia: "#fbbf24",
      accentTo: "#fde047",
      blob1: "#b45309",
      blob2: "#c2410c",
      blob3: "#a16207",
    },
  },
  {
    id: "medianoche",
    label: "Medianoche",
    light: {
      accentFrom: "#4338ca",
      accentVia: "#4f46e5",
      accentTo: "#6366f1",
      blob1: "#818cf8",
      blob2: "#60a5fa",
      blob3: "#a78bfa",
    },
    dark: {
      accentFrom: "#6366f1",
      accentVia: "#818cf8",
      accentTo: "#a5b4fc",
      blob1: "#4338ca",
      blob2: "#1d4ed8",
      blob3: "#5b21b6",
    },
  },
  {
    id: "coral",
    label: "Coral",
    light: {
      accentFrom: "#dc2626",
      accentVia: "#f97316",
      accentTo: "#fb923c",
      blob1: "#f87171",
      blob2: "#fb923c",
      blob3: "#fbbf24",
    },
    dark: {
      accentFrom: "#f87171",
      accentVia: "#fb923c",
      accentTo: "#fbbf24",
      blob1: "#dc2626",
      blob2: "#c2410c",
      blob3: "#b91c1c",
    },
  },
  {
    id: "menta",
    label: "Menta",
    light: {
      accentFrom: "#0d9488",
      accentVia: "#14b8a6",
      accentTo: "#06b6d4",
      blob1: "#2dd4bf",
      blob2: "#22d3ee",
      blob3: "#5eead4",
    },
    dark: {
      accentFrom: "#14b8a6",
      accentVia: "#2dd4bf",
      accentTo: "#67e8f9",
      blob1: "#0d9488",
      blob2: "#0e7490",
      blob3: "#0f766e",
    },
  },
  {
    id: "grafito",
    label: "Grafito",
    light: {
      accentFrom: "#334155",
      accentVia: "#475569",
      accentTo: "#64748b",
      blob1: "#94a3b8",
      blob2: "#cbd5e1",
      blob3: "#a1a1aa",
    },
    dark: {
      accentFrom: "#64748b",
      accentVia: "#94a3b8",
      accentTo: "#cbd5e1",
      blob1: "#334155",
      blob2: "#1e293b",
      blob3: "#475569",
    },
  },
  {
    id: "cereza",
    label: "Cereza",
    light: {
      accentFrom: "#a21caf",
      accentVia: "#c026d3",
      accentTo: "#e11d48",
      blob1: "#e879f9",
      blob2: "#fb7185",
      blob3: "#f0abfc",
    },
    dark: {
      accentFrom: "#c026d3",
      accentVia: "#e879f9",
      accentTo: "#fb7185",
      blob1: "#a21caf",
      blob2: "#9f1239",
      blob3: "#86198f",
    },
  },
];

export const CUSTOM_THEME_ID = "personalizado";

const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;

export function isValidHexColor(value: string): boolean {
  return HEX_COLOR_RE.test(value);
}

export function getThemePreset(id: string): ThemePreset {
  return THEME_PRESETS.find((t) => t.id === id) ?? THEME_PRESETS[0];
}

export function resolveThemeVars(business: {
  themeName: string;
  customPrimary: string | null;
  customSecondary: string | null;
}): { light: ThemeVars; dark: ThemeVars } {
  if (
    business.themeName === CUSTOM_THEME_ID &&
    business.customPrimary &&
    business.customSecondary &&
    isValidHexColor(business.customPrimary) &&
    isValidHexColor(business.customSecondary)
  ) {
    const primary = business.customPrimary;
    const secondary = business.customSecondary;
    const vars: ThemeVars = {
      accentFrom: primary,
      accentVia: secondary,
      accentTo: secondary,
      blob1: primary,
      blob2: secondary,
      blob3: primary,
    };
    return { light: vars, dark: vars };
  }

  const preset = getThemePreset(business.themeName);
  return { light: preset.light, dark: preset.dark };
}

function varsToCss(vars: ThemeVars): string {
  return `--accent-from:${vars.accentFrom};--accent-via:${vars.accentVia};--accent-to:${vars.accentTo};--blob-1:${vars.blob1};--blob-2:${vars.blob2};--blob-3:${vars.blob3};`;
}

export function buildThemeStyleTag(business: {
  themeName: string;
  customPrimary: string | null;
  customSecondary: string | null;
}): string {
  const { light, dark } = resolveThemeVars(business);
  return `:root{${varsToCss(light)}} .dark{${varsToCss(dark)}}`;
}
