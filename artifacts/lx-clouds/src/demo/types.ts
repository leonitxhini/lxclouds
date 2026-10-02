/** A demo website: one JSON document, rendered by DemoSite and edited in the Studio. */

export type FontKey = "outfit" | "inter" | "playfair" | "grotesk";

export type Theme = {
  /** Brand colour as #rrggbb. */
  primary: string;
  mode: "light" | "dark";
  font: FontKey;
  /** Corner radius of cards and buttons in px. */
  radius: number;
  /** Logo image; without one the company name is set as a wordmark. */
  logo?: string;
};

export type Meta = {
  company: string;
  industry: string;
  city: string;
  phone: string;
  email: string;
  address: string;
};

type Base<T extends string, P> = { id: string; type: T; hidden?: boolean; props: P };

export type NavBlock = Base<"nav", { links: string[]; cta: string }>;
export type HeroBlock = Base<
  "hero",
  { variant: "split" | "cover" | "center"; eyebrow: string; title: string; text: string; primary: string; secondary: string; image: string; points: string[] }
>;
export type StatsBlock = Base<"stats", { items: { value: string; label: string }[] }>;
export type ServicesBlock = Base<"services", { title: string; text: string; items: { icon: string; title: string; text: string }[] }>;
export type CardsBlock = Base<"cards", { title: string; text: string; items: { image: string; title: string; text: string; price: string; tag: string }[] }>;
export type AboutBlock = Base<"about", { title: string; text: string; image: string; points: string[]; flip: boolean }>;
export type PricesBlock = Base<"prices", { title: string; text: string; groups: { name: string; items: { name: string; text: string; price: string }[] }[] }>;
export type GalleryBlock = Base<"gallery", { title: string; images: string[] }>;
export type StepsBlock = Base<"steps", { title: string; items: { title: string; text: string }[] }>;
export type QuotesBlock = Base<"quotes", { title: string; items: { quote: string; name: string; role: string }[] }>;
export type FaqBlock = Base<"faq", { title: string; items: { q: string; a: string }[] }>;
export type CtaBlock = Base<"cta", { title: string; text: string; button: string }>;
export type ContactBlock = Base<"contact", { title: string; text: string; hours: { day: string; time: string }[]; form: boolean }>;
export type FooterBlock = Base<"footer", { text: string; links: string[] }>;

export type Block =
  | NavBlock
  | HeroBlock
  | StatsBlock
  | ServicesBlock
  | CardsBlock
  | AboutBlock
  | PricesBlock
  | GalleryBlock
  | StepsBlock
  | QuotesBlock
  | FaqBlock
  | CtaBlock
  | ContactBlock
  | FooterBlock;

export type BlockType = Block["type"];

export type DemoDoc = { meta: Meta; theme: Theme; blocks: Block[] };

/** Where a value sits inside a block's props, e.g. ["items", 2, "title"]. */
export type Path = (string | number)[];
