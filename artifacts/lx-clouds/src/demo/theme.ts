import type { CSSProperties } from "react";
import { skins } from "./skins/palettes";
import type { FontKey, Theme } from "./types";

export const fonts: Record<FontKey, { label: string; heading: string; body: string }> = {
  outfit: { label: "Outfit – modern", heading: '"Outfit", sans-serif', body: '"Outfit", sans-serif' },
  inter: { label: "Inter – sachlich", heading: '"Inter", sans-serif', body: '"Inter", sans-serif' },
  playfair: { label: "Playfair – elegant", heading: '"Playfair Display", serif', body: '"Inter", sans-serif' },
  grotesk: { label: "Grotesk – technisch", heading: '"Space Grotesk", sans-serif', body: '"Inter", sans-serif' },
  anton: { label: "Anton – plakativ", heading: '"Anton", "Arial Narrow", sans-serif', body: '"Inter", sans-serif' },
  fraunces: { label: "Fraunces – editorial", heading: '"Fraunces", serif', body: '"Inter", sans-serif' },
  archivo: { label: "Archivo – kräftig", heading: '"Archivo", sans-serif', body: '"Inter", sans-serif' },
  cormorant: { label: "Cormorant – fein", heading: '"Cormorant Garamond", serif', body: '"Inter", sans-serif' },
  lexend: { label: "Lexend – freundlich", heading: '"Lexend", sans-serif', body: '"Lexend", sans-serif' },
  bricolage: { label: "Bricolage – verspielt", heading: '"Bricolage Grotesque", sans-serif', body: '"Inter", sans-serif' },
};

export const colourPresets = ["#6865FF", "#2F6BFF", "#0EA5E9", "#0F9D7A", "#16A34A", "#EAB308", "#F4511E", "#E11D48", "#DB2777", "#7C3AED", "#111827", "#92400E"];

function channels(hex: string) {
  const h = /^#?([0-9a-f]{6})$/i.exec(hex)?.[1] ?? "6865ff";
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

/** Black or white, whichever reads better on the given colour. */
export function onColour(hex: string) {
  const [r, g, b] = channels(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.45 ? "#14151c" : "#ffffff";
}

/** The CSS variables every block draws from. */
export function themeVars(theme: Theme): CSSProperties {
  const dark = theme.mode === "dark";
  const font = fonts[theme.font] ?? fonts.outfit;
  const skin = theme.skin ? skins[theme.skin] : undefined;
  const c = skin?.[theme.mode] ?? {
    bg: dark ? "#0c0d12" : "#ffffff",
    bg2: dark ? "#13151d" : `color-mix(in srgb, ${theme.primary} 5%, #ffffff)`,
    card: dark ? "#171a24" : "#ffffff",
    fg: dark ? "#f3f4f8" : "#14151c",
    mut: dark ? "#a3a7b7" : "#5b5e6e",
    line: dark ? "rgba(255,255,255,0.11)" : "rgba(20,21,28,0.1)",
    dk: dark ? "#07080b" : "#14151c",
    dkOn: "#f3f4f8",
  };
  return {
    "--p": theme.primary,
    "--p-on": onColour(theme.primary),
    "--bg": c.bg,
    "--bg2": c.bg2,
    "--card": c.card,
    "--fg": c.fg,
    "--mut": c.mut,
    "--line": c.line,
    "--dk": c.dk,
    "--dk-on": c.dkOn,
    "--soft": `color-mix(in srgb, ${theme.primary} ${dark ? 22 : 11}%, ${c.bg})`,
    "--r": `${theme.radius}px`,
    "--r-sm": `${Math.round(theme.radius * 0.6)}px`,
    "--fh": font.heading,
    "--fb": font.body,
    ...skin?.extra,
  } as CSSProperties;
}
