/**
 * The demo designs shown on the home page ("what we build"). Each one is a built-in template of the
 * Studio and can be opened live at /d/vorlage-<id>. Names are invented for the demos.
 * `h` / `hm` are the heights of the captures in public/showcase (scratch script showcase.mjs writes them).
 */
export const designs = [
  { id: "rental", demoName: "Kavaro Rent", accent: "#C6F135", h: 4324, hm: 2600 },
  { id: "restaurant", demoName: "Osteria Vialuna", accent: "#C4623F", h: 4215, hm: 2600 },
  { id: "craft", demoName: "Wohnwerk", accent: "#FF5A1F", h: 3622, hm: 2600 },
  { id: "beauty", demoName: "Studio Aurelle", accent: "#C79A5B", h: 4133, hm: 2600 },
  { id: "clinic", demoName: "Zahnwerk am Park", accent: "#3FB6A8", h: 3706, hm: 2600 },
  { id: "realestate", demoName: "Arvelle", accent: "#B98452", h: 4107, hm: 2600 },
  { id: "shop", demoName: "Maison Olvi", accent: "#3D6BFF", h: 3155, hm: 2600 },
  { id: "service", demoName: "Klarion", accent: "#7B6CFF", h: 4442, hm: 2600 },
] as const;

export type DesignId = (typeof designs)[number]["id"];

/** Width of the desktop / phone captures in px. */
export const shotWidth = { desktop: 1100, phone: 390 };

export const demoUrl = (id: DesignId) => `/d/vorlage-${id}`;
