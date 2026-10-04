import { cityShort } from "./playbooks";
import { domainSlug } from "./generate";
import type { DomainsBlock, FolioDoc } from "./types";

/** good / so-so / weak */
export type Level = 2 | 1 | 0;
export type Criterion = { key: CriterionKey; level: Level; text: string };
export type CriterionKey = "memory" | "phone" | "trust" | "brand" | "confusion" | "future";
export type Strength = { score: number; criteria: Criterion[]; verdict: string };

/** The six questions a marketing person asks about a web address – with their weight and what they mean. */
export const criteria: { key: CriterionKey; label: string; question: string; weight: number }[] = [
  { key: "brand", label: "Passt zur Marke", question: "Sind Name, Adresse und E-Mail gleich? Dann bleibt der Name hängen.", weight: 3 },
  { key: "trust", label: "Vertrauen", question: "Wirkt die Endung für Kunden in Deutschland vertraut?", weight: 2 },
  { key: "confusion", label: "Keine Verwechslung", question: "Gibt es eine fast gleiche Adresse, die jemand anderem gehört?", weight: 2 },
  { key: "memory", label: "Merkbar", question: "Merkt man sie sich nach einmal Hören?", weight: 1 },
  { key: "phone", label: "Telefon-Test", question: "Kann man sie am Telefon sagen, ohne zu buchstabieren?", weight: 1 },
  { key: "future", label: "Wächst mit", question: "Passt sie noch, wenn Sie größer werden oder umziehen?", weight: 1 },
];
const MAX = criteria.reduce((n, c) => n + c.weight * 2, 0);

/** What the folio knows about the client that matters for a web address: the chosen name, other name ideas, the city, taken addresses. */
export function domainContext(doc: FolioDoc) {
  const nameOptions = doc.chapters.flatMap((c) => c.blocks).flatMap((b) => (b.type === "options" && !b.items.some((i) => i.image) ? b.items : []));
  const slug = (n: string) => domainSlug(n, false);
  const chosen = nameOptions.find((o) => o.pick)?.name ?? nameOptions[0]?.name ?? doc.meta.client;
  const taken = new Set(doc.chapters.flatMap((c) => c.blocks).flatMap((b) => (b.type === "domains" ? b.items.filter((d) => d.status === "taken").map((d) => d.domain) : [])));
  const city = slug(doc.meta.city.split(/[\s,]/)[0] ?? "");
  return {
    chosen: slug(chosen),
    chosenLabel: chosen,
    others: nameOptions.filter((o) => o.name !== chosen).map((o) => ({ slug: slug(o.name), label: o.name })),
    cities: [city, cityShort[doc.meta.city.split(/[\s,]/)[0]?.toLowerCase() ?? ""]].filter(Boolean) as string[],
    taken,
  };
}

/** A marketing person's look at a web address: six criteria, a score 0–10 and a one-line verdict. */
export function domainStrength(domain: string, ctx: ReturnType<typeof domainContext>, status: string): Strength {
  const [label, ...rest] = domain.toLowerCase().split(".");
  const tld = rest.join(".");
  const plain = label.replace(/-/g, "");
  const hyphens = (label.match(/-/g) ?? []).length;
  const hasCity = ctx.cities.some((c) => plain.includes(c));
  const other = ctx.others.find((o) => o.slug && plain.includes(o.slug));
  const exact = !!ctx.chosen && plain === ctx.chosen;
  const contains = !!ctx.chosen && plain.includes(ctx.chosen);
  // a look-alike that belongs to someone else: the same without hyphens, or the same name with another ending
  const lookAlike = [...ctx.taken].find((t) => t !== domain && (t === `${plain}.${tld}` || t.split(".")[0].replace(/-/g, "") === plain));

  const list: Criterion[] = [
    exact
      ? { key: "brand", level: 2, text: `Genau Ihr Name „${ctx.chosenLabel}“ – Name, Adresse und E-Mail aus einem Guss.` }
      : contains
        ? { key: "brand", level: 1, text: "Enthält Ihren Namen, aber mit Zusatz – etwas schwächer im Kopf." }
        : other
          ? { key: "brand", level: 0, text: `Gehört zum anderen Namen „${other.label}“ – nur sinnvoll, wenn Sie diesen Namen wählen.` }
          : { key: "brand", level: 0, text: "Ohne Ihren Namen – Empfehlungen („geh zu …“) führen nicht zu Ihnen." },
    tld === "de"
      ? { key: "trust", level: 2, text: ".de kennt jeder – wirkt deutsch, seriös und lokal." }
      : tld === "com"
        ? { key: "trust", level: 1, text: ".com wirkt international – Kunden hier tippen trotzdem oft .de." }
        : { key: "trust", level: 0, text: `.${tld} ist ungewohnt – wirkt weniger vertrauenswürdig.` },
    lookAlike
      ? { key: "confusion", level: 0, text: `${lookAlike} ist schon vergeben – gehört sie nicht Ihnen, landen Vertipper und E-Mails dort.` }
      : { key: "confusion", level: 2, text: "Keine ähnliche Adresse bei jemand anderem – Anfragen landen sicher bei Ihnen." },
    plain.length <= 12
      ? { key: "memory", level: 2, text: "Kurz – nach einmal Hören gemerkt." }
      : plain.length <= 18
        ? { key: "memory", level: 1, text: "Mittellang – gut, aber nicht auf Anhieb." }
        : { key: "memory", level: 0, text: "Lang – merkt sich kaum jemand." },
    /\d/.test(plain)
      ? { key: "phone", level: 0, text: "Zahlen muss man erklären („die Zahl oder ausgeschrieben?“)." }
      : hyphens === 0
        ? { key: "phone", level: 2, text: "Lässt sich sagen, wie man sie schreibt." }
        : hyphens === 1
          ? { key: "phone", level: 1, text: "Der Bindestrich muss dazugesagt werden („ic Bindestrich …“)." }
          : { key: "phone", level: 0, text: "Mehrere Bindestriche – am Telefon umständlich." },
    hasCity
      ? { key: "future", level: 1, text: "Mit Ort – zeigt, wo Ihr Büro ist, klingt aber eher nach Suchwort als nach Marke." }
      : { key: "future", level: 2, text: "Ohne Ort – bleibt Ihre Marke, auch mit einem zweiten Büro oder nach einem Umzug." },
  ];
  const weight = Object.fromEntries(criteria.map((c) => [c.key, c.weight]));
  const sum = list.reduce((n, c) => n + c.level * weight[c.key], 0);
  const order = criteria.map((c) => c.key);
  list.sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key));

  let verdict: string;
  if (status === "taken") verdict = "Vergeben – nur möglich, wenn der Inhaber verkauft.";
  else if (status === "own" && !list.some((c) => c.level === 0 && (c.key === "brand" || c.key === "confusion"))) verdict = "Gehört Ihnen schon – sofort nutzbar.";
  else {
    const weakest = list.filter((c) => c.level === 0).sort((a, b) => weight[b.key] - weight[a.key])[0];
    if (!weakest) verdict = list.every((c) => c.level === 2) ? "Ideal: kurz, klar, genau Ihr Name." : "Stark – kleine Abstriche, aber eine gute Wahl.";
    else if (weakest.key === "brand") verdict = other ? `Nur für den Namen „${other.label}“ – sonst austauschbar.` : "Austauschbar – ohne Ihren Namen baut sie keine Marke auf.";
    else if (weakest.key === "confusion") verdict = "Gute Adresse – aber eine fast gleiche ist schon vergeben.";
    else if (weakest.key === "trust") verdict = "Endung ungewohnt – wirkt weniger seriös.";
    else if (weakest.key === "memory") verdict = "Zu lang – im Gespräch geht sie verloren.";
    else verdict = "Am Telefon schwer weiterzugeben.";
  }
  // rounded down: a 6.5 is not yet a 7
  return { score: Math.floor((sum / MAX) * 10 + 1e-9), criteria: list, verdict };
}

/** The addresses sorted the way you would talk about them: free and strong first, taken ones last. */
export function rankDomains(block: DomainsBlock, ctx: ReturnType<typeof domainContext>) {
  return block.items
    .map((item, index) => ({ item, index, strength: domainStrength(item.domain, ctx, item.status) }))
    .filter((d) => d.item.domain.trim())
    .sort((a, b) => {
      const rank = (s: string) => (s === "own" ? 0 : s === "free" ? 1 : s === "unknown" ? 2 : 3);
      return rank(a.item.status) - rank(b.item.status) || b.strength.score - a.strength.score || (a.item.domain.endsWith(".de") ? -1 : 1);
    });
}
