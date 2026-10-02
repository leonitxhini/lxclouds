import type { Block, BlockType, DemoDoc, Meta } from "../types";

export const uid = () => Math.random().toString(36).slice(2, 9);

type BlockOf<T extends BlockType> = Extract<Block, { type: T }>;
/** A block with a fresh id. */
export const b = <T extends BlockType>(type: T, props: BlockOf<T>["props"]): Block => ({ id: uid(), type, props }) as Block;

export const img = (template: string, name: string) => `/demo-assets/${template}/${name}.webp`;

export type TemplateInput = Partial<Meta> & { company: string };

export type Template = {
  id: string;
  name: string;
  industry: string;
  description: string;
  /** capture of the template's first screen */
  preview: string;
  /** a photo without lettering, for cards that put their own title on it */
  photo?: string;
  build: (input: TemplateInput) => DemoDoc;
};

export function meta(input: TemplateInput, industry: string): Meta {
  const slug = input.company
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 18);
  return {
    company: input.company,
    industry,
    city: input.city || "60311 Frankfurt am Main",
    phone: input.phone || "+49 69 123 456 78",
    email: input.email || `info@${slug || "firma"}.de`,
    address: input.address || "Musterstraße 12",
  };
}

export const hours = (weekday: string, saturday: string, sunday = "geschlossen") => [
  { day: "Montag – Freitag", time: weekday },
  { day: "Samstag", time: saturday },
  { day: "Sonntag", time: sunday },
];

/** "60311 Frankfurt am Main" → "Frankfurt am Main" */
export const town = (m: Meta) => m.city.replace(/^\d+\s*/, "");

export const contact = (title: string, text: string, h: { day: string; time: string }[]) => b("contact", { title, text, hours: h, form: true });
export const footer = (text: string) => b("footer", { text, links: ["Impressum", "Datenschutz", "Kontakt"] });
