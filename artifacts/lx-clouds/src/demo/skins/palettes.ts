import type { SkinKey } from "../types";

/** The fixed colours of a design language. The brand colour (--p) stays the user's choice. */
export type Palette = {
  bg: string;
  bg2: string;
  card: string;
  fg: string;
  mut: string;
  line: string;
  /** dark bands: info strips, call-to-action panels, footers */
  dk: string;
  dkOn: string;
};

type SkinInfo = { label: string; light: Palette; dark: Palette; /** further fixed colours, as CSS variables */ extra?: Record<string, string> };

const onDark = "rgba(255,255,255,0.11)";

export const skins: Record<SkinKey, SkinInfo> = {
  noir: {
    label: "Noir – dunkel, kantig",
    dark: { bg: "#0A0C0B", bg2: "#0E1110", card: "#121615", fg: "#F1F3EE", mut: "#9DA39E", line: onDark, dk: "#060707", dkOn: "#F1F3EE" },
    light: { bg: "#F3F4F0", bg2: "#E9EBE5", card: "#FFFFFF", fg: "#0D0F0E", mut: "#5A605B", line: "rgba(13,15,14,0.13)", dk: "#0A0C0B", dkOn: "#F1F3EE" },
  },
  osteria: {
    label: "Osteria – warm, editorial",
    light: { bg: "#F5EDDF", bg2: "#EFE4D1", card: "#FBF6EC", fg: "#1D3023", mut: "#5E6A5E", line: "rgba(29,48,35,0.15)", dk: "#1E3A2B", dkOn: "#F5EDDF" },
    dark: { bg: "#14231B", bg2: "#192B21", card: "#1E3327", fg: "#F5EDDF", mut: "#B5BCA9", line: "rgba(245,237,223,0.15)", dk: "#0E1A13", dkOn: "#F5EDDF" },
  },
  werk: {
    label: "Werk – kräftig, klar",
    light: { bg: "#F5F4F0", bg2: "#ECEBE6", card: "#FFFFFF", fg: "#151515", mut: "#55565A", line: "rgba(21,21,21,0.12)", dk: "#161616", dkOn: "#F5F4F0" },
    dark: { bg: "#121212", bg2: "#181818", card: "#1E1E1E", fg: "#F5F4F0", mut: "#A6A6A1", line: onDark, dk: "#0A0A0A", dkOn: "#F5F4F0" },
  },
  aurelia: {
    label: "Aurelia – weich, luxuriös",
    light: { bg: "#FBF3EC", bg2: "#F6E7DB", card: "#FFFAF5", fg: "#2A1620", mut: "#6E5A5F", line: "rgba(42,22,32,0.14)", dk: "#2B1620", dkOn: "#F8E9E0" },
    dark: { bg: "#22121A", bg2: "#2B1620", card: "#331C27", fg: "#F8E9E0", mut: "#C9B4B4", line: "rgba(248,233,224,0.15)", dk: "#170B11", dkOn: "#F8E9E0" },
  },
  park: {
    label: "Park – hell, ruhig",
    light: { bg: "#FFFFFF", bg2: "#EFF8F5", card: "#FFFFFF", fg: "#0F2E3A", mut: "#55707A", line: "rgba(15,46,58,0.1)", dk: "#16505A", dkOn: "#EAF6F3" },
    dark: { bg: "#0C1F25", bg2: "#102830", card: "#14313A", fg: "#EAF6F3", mut: "#9DB8BC", line: onDark, dk: "#081619", dkOn: "#EAF6F3" },
  },
  linden: {
    label: "Linden – architektonisch",
    light: { bg: "#F7F2E9", bg2: "#EFE8DB", card: "#FCF9F3", fg: "#16130F", mut: "#6A6257", line: "rgba(22,19,15,0.13)", dk: "#171512", dkOn: "#F7F2E9" },
    dark: { bg: "#14120F", bg2: "#1B1814", card: "#211D18", fg: "#F3ECE0", mut: "#B3A999", line: onDark, dk: "#0C0B09", dkOn: "#F3ECE0" },
  },
  maison: {
    label: "Maison – farbig, verspielt",
    light: { bg: "#FBF6EC", bg2: "#F3ECDD", card: "#FFFFFF", fg: "#171717", mut: "#5C5A55", line: "rgba(23,23,23,0.12)", dk: "#171717", dkOn: "#FBF6EC" },
    dark: { bg: "#151515", bg2: "#1B1B1B", card: "#222222", fg: "#FBF6EC", mut: "#B0ADA5", line: onDark, dk: "#0C0C0C", dkOn: "#FBF6EC" },
    extra: { "--c2": "#F0563B", "--c3": "#F7CF47", "--c4": "#7E9A77" },
  },
  klar: {
    label: "Klar – hell, gläsern",
    light: { bg: "#F6F7FB", bg2: "#EEF0F8", card: "#FFFFFF", fg: "#0F1230", mut: "#5A5F7A", line: "rgba(15,18,48,0.09)", dk: "#0F1230", dkOn: "#FFFFFF" },
    dark: { bg: "#0B0D1E", bg2: "#101330", card: "#151938", fg: "#EEF0FF", mut: "#A3A8CC", line: onDark, dk: "#070817", dkOn: "#EEF0FF" },
  },
};
