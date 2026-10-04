/**
 * A project folio: everything an agency team would work out for a client before building – strategy, name and
 * domain, design, content, Google visibility, channels, legal, technology, plan and offer – as one document.
 */

export type RoleKey = "lead" | "strategy" | "brand" | "design" | "content" | "seo" | "ads" | "legal" | "tech" | "sales";

/** Result of the website check (lib/sitecheck.mjs) plus, optionally, Google's own measurement. */
export type Audit = {
  checked: string;
  url?: string;
  finalUrl?: string;
  status?: number;
  error?: string;
  https?: boolean;
  ms?: number;
  kb?: number;
  title?: string;
  description?: string;
  h1?: number;
  viewport?: boolean;
  lang?: string;
  canonical?: boolean;
  og?: boolean;
  schema?: string[];
  localBusiness?: boolean;
  impressum?: boolean;
  datenschutz?: boolean;
  phone?: boolean;
  email?: boolean;
  whatsapp?: boolean;
  forms?: number;
  booking?: boolean;
  reviews?: boolean;
  images?: number;
  imagesNoAlt?: number;
  noindex?: boolean;
  robots?: boolean;
  sitemap?: boolean;
  jsOnly?: boolean;
  score?: number;
  /** Google PageSpeed Insights, mobile, 0–100 */
  psi?: { performance: number; seo: number; accessibility: number; practices: number; checked: string };
};

/** `detail` blocks stay folded away under "Mehr Details" – the chapter shows only what matters. */
type Base<T extends string, P> = { id: string; type: T; detail?: boolean } & P;

export type CardsBlock = Base<"cards", { title: string; items: { title: string; text: string; tag: string }[] }>;
export type OptionsBlock = Base<"options", { title: string; items: { name: string; text: string; pros: string[]; cons: string[]; score: number; pick: boolean; /** picture of the option, e.g. a design draft */ image?: string }[] }>;
export type DomainsBlock = Base<"domains", { title: string; items: { domain: string; /** own: registered already, by the client */ status: "free" | "taken" | "unknown" | "own"; checked: string; note: string; pick: boolean }[] }>;
export type AuditBlock = Base<"audit", { title: string; items: { name: string; url: string; own: boolean; result: Audit | null; /** who they are, in a few words */ note?: string }[] }>;
export type TableBlock = Base<"table", { title: string; columns: string[]; rows: string[][]; /** "ranked": rows as a numbered list – name, priority (A/B/C), what to do */ style?: "ranked" }>;
/** `status`: a state of affairs (green = already fine, open = still to do) rather than a to-do list – nothing is crossed out */
export type ChecklistBlock = Base<"checklist", { title: string; items: { text: string; who: string; done: boolean }[]; status?: boolean }>;
export type TimelineBlock = Base<"timeline", { title: string; items: { when: string; title: string; text: string }[] }>;
export type PackagesBlock = Base<"packages", { title: string; items: { name: string; price: string; /** under the price, e.g. "einmalig · danach 49 € im Monat" */ unit?: string; text: string; features: string[]; pick: boolean }[] }>;
export type RulesBlock = Base<"rules", { title: string; dos: string[]; donts: string[] }>;
export type TextBlock = Base<"text", { title: string; text: string }>;
/** How a new customer finds the business, step by step. */
export type JourneyBlock = Base<"journey", { title: string; items: { icon: string; title: string; text: string }[]; note: string }>;
/** Ways to new customers: when, what it costs, how much it brings (1–3). */
export type ChannelsBlock = Base<"channels", { title: string; items: { name: string; icon: string; when: "Zuerst" | "Danach" | "Später"; text: string; cost: string; effect: number }[] }>;
/** How quickly the investment pays for itself: euros the client earns per new customer and month. */
export type RoiBlock = Base<"roi", { title: string; invest: number; monthly: number; value: number; unit: string; text: string; /** value is per month (e.g. a bookkeeping client), not per sale */ recurring: boolean }>;

export type FolioBlock = CardsBlock | OptionsBlock | DomainsBlock | AuditBlock | TableBlock | ChecklistBlock | TimelineBlock | PackagesBlock | RulesBlock | TextBlock | RoiBlock | JourneyBlock | ChannelsBlock;
export type FolioBlockType = FolioBlock["type"];

export type Chapter = {
  id: string;
  role: RoleKey;
  title: string;
  /** one short line under the title */
  lead: string;
  /** the answer in a few words, shown big – "IC Buchhaltung · ic-buchhaltung.de" */
  short: string;
  /** the answer as one plain sentence */
  pick: string;
  /** up to three short reasons */
  reasons: string[];
  /** internal progress, not shown to the client */
  status: "draft" | "ready";
  hidden?: boolean;
  blocks: FolioBlock[];
};

export type FolioDoc = {
  version: 1;
  meta: {
    client: string;
    industry: string;
    /** playbook the folio was made from */
    playbook: string;
    city: string;
    website: string;
    goal: string;
    date: string;
    /** brand colour of the presentation */
    accent: string;
  };
  intro: string;
  chapters: Chapter[];
};
