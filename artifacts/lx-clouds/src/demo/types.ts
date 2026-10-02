/** A demo website: one JSON document, rendered by DemoSite and edited in the Studio. */

export type FontKey = "outfit" | "inter" | "playfair" | "grotesk" | "anton" | "fraunces" | "archivo" | "cormorant" | "lexend" | "bricolage";

/** A design language: its own layouts, colours and type treatment for every block. */
export type SkinKey = "noir" | "osteria" | "werk" | "aurelia" | "park" | "linden" | "maison" | "klar";

export type Theme = {
  /** Brand colour as #rrggbb. */
  primary: string;
  mode: "light" | "dark";
  font: FontKey;
  /** Corner radius of cards and buttons in px. */
  radius: number;
  /** Logo image; without one the company name is set as a wordmark. */
  logo?: string;
  /** Design language of the demo; without one the plain default blocks are used. */
  skin?: SkinKey;
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

// Fields marked optional are used by some design languages only; every block renders without them.
export type NavBlock = Base<"nav", { links: string[]; cta: string; /** announcement line above the navigation */ notice?: string }>;
export type HeroBlock = Base<
  "hero",
  {
    variant: "split" | "cover" | "center";
    eyebrow: string;
    title: string;
    text: string;
    primary: string;
    secondary: string;
    image: string;
    points: string[];
    /** sticker, round badge or the title of the floating card */
    badge?: string;
    /** handwritten or side note */
    note?: string;
  }
>;
export type StatsBlock = Base<"stats", { items: { value: string; label: string; icon?: string }[] }>;
export type ServicesBlock = Base<"services", { eyebrow?: string; title: string; text: string; button?: string; items: { icon: string; title: string; text: string; image?: string }[] }>;
export type CardsBlock = Base<"cards", { eyebrow?: string; title: string; text: string; button?: string; items: { image: string; title: string; text: string; price: string; tag: string }[] }>;
export type AboutBlock = Base<"about", { eyebrow?: string; title: string; text: string; image: string; image2?: string; points: string[]; flip: boolean; button?: string; note?: string }>;
export type PricesBlock = Base<
  "prices",
  { eyebrow?: string; title: string; text: string; button?: string; groups: { name: string; text?: string; price?: string; featured?: boolean; items: { name: string; text: string; price: string }[] }[] }
>;
export type GalleryBlock = Base<"gallery", { eyebrow?: string; title: string; text?: string; note?: string; images: string[] }>;
export type StepsBlock = Base<"steps", { eyebrow?: string; title: string; text?: string; items: { title: string; text: string }[] }>;
export type QuotesBlock = Base<"quotes", { eyebrow?: string; title: string; text?: string; items: { quote: string; name: string; role: string; image?: string }[] }>;
export type FaqBlock = Base<"faq", { eyebrow?: string; title: string; text?: string; items: { q: string; a: string }[] }>;
export type CtaBlock = Base<"cta", { eyebrow?: string; title: string; text: string; button: string; image?: string }>;
export type TeamBlock = Base<"team", { eyebrow?: string; title: string; text: string; items: { image: string; name: string; role: string; text: string }[] }>;
export type ContactBlock = Base<"contact", { eyebrow?: string; title: string; text: string; hours: { day: string; time: string }[]; form: boolean; image?: string }>;
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
  | TeamBlock
  | ContactBlock
  | FooterBlock;

export type BlockType = Block["type"];

export type DemoDoc = { meta: Meta; theme: Theme; blocks: Block[] };

/** Where a value sits inside a block's props, e.g. ["items", 2, "title"]. */
export type Path = (string | number)[];
