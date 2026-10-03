import { domainSlug } from "./generate";
import { getPlaybook } from "./playbooks";
import type { DomainsBlock, FolioDoc } from "./types";

export type Strength = { score: number; good: string[]; bad: string[] };

/** What the folio knows about the client that matters for a web address: the chosen name, other name ideas, the industry, the city, taken addresses. */
export function domainContext(doc: FolioDoc) {
  const book = getPlaybook(doc.meta.playbook);
  const nameOptions = doc.chapters.flatMap((c) => c.blocks).flatMap((b) => (b.type === "options" && !b.items.some((i) => i.image) ? b.items : []));
  const slug = (n: string) => domainSlug(n, false);
  const chosen = nameOptions.find((o) => o.pick)?.name ?? nameOptions[0]?.name ?? doc.meta.client;
  const taken = new Set(doc.chapters.flatMap((c) => c.blocks).flatMap((b) => (b.type === "domains" ? b.items.filter((d) => d.status === "taken").map((d) => d.domain) : [])));
  return {
    chosen: slug(chosen),
    chosenLabel: chosen,
    others: nameOptions.filter((o) => o.name !== chosen).map((o) => ({ slug: slug(o.name), label: o.name })),
    words: [book.word, ...book.words].map((w) => slug(w).slice(0, 7)),
    city: slug(doc.meta.city.split(/[\s,]/)[0] ?? ""),
    taken,
  };
}

/**
 * How strong a web address is, 0–10, with the reasons in plain words:
 * fit to the chosen name (up to 4), ending (.de 3, .com 0), shortness (up to 2), no hyphen (1),
 * minus points when the same address without hyphens belongs to someone else or for numbers.
 */
export function domainStrength(domain: string, ctx: ReturnType<typeof domainContext>): Strength {
  const good: string[] = [];
  const bad: string[] = [];
  let score = 0;
  const [label, ...rest] = domain.toLowerCase().split(".");
  const tld = rest.join(".");
  const plain = label.replace(/-/g, "");
  const hyphens = (label.match(/-/g) ?? []).length;

  // fit to the name
  const other = ctx.others.find((o) => o.slug && plain.includes(o.slug));
  if (ctx.chosen && plain === ctx.chosen) {
    score += 4;
    good.push("Passt genau zu Ihrem Namen");
  } else if (ctx.chosen && plain.includes(ctx.chosen)) {
    score += 3;
    good.push("Enthält Ihren Namen");
  } else if (other && plain === other.slug) {
    score += 2;
    bad.push(`Passt zum anderen Namen „${other.label}“`);
  } else if (other) {
    score += 1;
    bad.push(`Enthält den anderen Namen „${other.label}“`);
  } else bad.push("Hat nichts mit Ihrem Namen zu tun");

  // ending
  if (tld === "de") {
    score += 3;
    good.push("Endung .de – die kennt in Deutschland jeder");
  } else if (tld === "com") bad.push("Endung .com – in Deutschland nur zweite Wahl");
  else bad.push(`Endung .${tld} – ungewohnt`);

  // length
  if (plain.length <= 12) {
    score += 2;
    good.push("Kurz – schnell getippt");
  } else if (plain.length <= 18) {
    score += 1;
    good.push("Gut zu tippen");
  } else bad.push(plain.length > 24 ? "Lang – leicht vertippt" : "Recht lang");

  // hyphens
  if (hyphens === 0) {
    score += 1;
    good.push("Ohne Bindestrich – am Telefon leicht zu sagen");
  } else if (hyphens === 1) bad.push("Mit Bindestrich – muss man dazusagen");
  else bad.push("Mehrere Bindestriche – umständlich");
  if (hyphens > 0 && ctx.taken.has(`${plain}.${tld}`)) {
    score -= 1;
    bad.push(`${plain}.${tld} gehört schon jemand anderem – wer den Bindestrich vergisst, landet dort`);
  }

  if (ctx.words.some((w) => w && plain.includes(w))) good.push("Man sieht sofort, worum es geht");
  if (ctx.city && plain.includes(ctx.city)) good.push("Zeigt: lokal vor Ort");
  if (/\d/.test(plain)) {
    score -= 1;
    bad.push("Zahlen werden oft falsch getippt");
  }

  return { score: Math.max(0, Math.min(10, score)), good, bad };
}

/** The addresses sorted the way you would talk about them: free and strong first, taken ones last. */
export function rankDomains(block: DomainsBlock, ctx: ReturnType<typeof domainContext>) {
  return block.items
    .map((item, index) => ({ item, index, strength: domainStrength(item.domain, ctx) }))
    .filter((d) => d.item.domain.trim())
    .sort((a, b) => {
      const rank = (s: string) => (s === "free" ? 0 : s === "unknown" ? 1 : 2);
      return rank(a.item.status) - rank(b.item.status) || b.strength.score - a.strength.score;
    });
}
