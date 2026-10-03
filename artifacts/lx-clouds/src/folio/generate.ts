import { cityShort, getPlaybook, localAreas, type Playbook } from "./playbooks";
import type { Chapter, FolioBlock, FolioDoc, RoleKey } from "./types";

export const fid = () => Math.random().toString(36).slice(2, 9);

export type FolioInput = {
  client: string;
  playbook: string;
  city: string;
  website: string;
  goal: string;
  /** name ideas to compare, e.g. the client's current name and alternatives */
  names: string[];
  competitors: { name: string; url: string }[];
  /** design drafts to look at together, e.g. the images of a design board */
  designs?: { name: string; image: string }[];
  accent: string;
};

/** "60311 Frankfurt am Main" → "Frankfurt am Main" */
export const cityName = (city: string) => city.replace(/^\d{4,5}\s*/, "").trim() || "Ihrer Stadt";
/** "Frankfurt am Main" → "frankfurt" */
export const cityKey = (city: string) => cityName(city).split(/[\s,-]/)[0].toLowerCase();

/** Lower-case ASCII for domains: umlauts spelled out, everything else to hyphens. */
export function domainSlug(text: string, hyphen = true) {
  const s = text
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return hyphen ? s : s.replace(/-/g, "");
}

/** Domain ideas from the name ideas, the industry word and the city – checked live afterwards. */
export function domainIdeas(names: string[], book: Playbook, city: string) {
  const c = domainSlug(cityKey(city));
  const short = cityShort[cityKey(city)];
  const list: string[] = [];
  for (const name of names.slice(0, 4)) {
    const a = domainSlug(name);
    const b = domainSlug(name, false);
    list.push(`${b}.de`, `${a}.de`, `${b}.com`);
    if (list.length < 8) list.push(`${a}-${c}.de`);
  }
  const word = domainSlug(book.word);
  const alt = domainSlug(book.words[0] ?? book.word);
  list.push(`${word}-${c}.de`, `${word}-in-${c}.de`, `${c}er-${word}.de`, `${alt}-${c}.de`);
  if (short) list.push(`${word}-${short}.de`);
  return [...new Set(list.filter((d) => /^[a-z0-9-]+\.[a-z]+$/.test(d) && !d.startsWith("-")))].slice(0, 16);
}

/** A first, honest assessment of a name; refined in the meeting. */
function judgeName(name: string, book: Playbook) {
  const lower = name.toLowerCase();
  const pros: string[] = [];
  const cons: string[] = [];
  let score = 3;
  if ([book.word, ...book.words].some((w) => lower.includes(w.slice(0, 7)))) {
    pros.push("Man versteht sofort, was Sie machen");
    score += 1;
  } else cons.push("Der Name sagt nicht, was Sie machen");
  if (/^[A-ZÄÖÜ]{2,3}\b/.test(name.trim())) {
    cons.push("Abkürzungen sagen Fremden erst einmal nichts");
    score -= 1;
  }
  if (/^(my|mein)/i.test(name.trim())) pros.push("Klingt persönlich");
  if (/^my/i.test(name.trim())) cons.push("Englisch-deutsch gemischt – am Telefon oft falsch geschrieben");
  const length = name.replace(/\s/g, "").length;
  if (length <= 14) pros.push("Kurz und leicht zu merken");
  if (length > 22) {
    cons.push("Lang – schwer zu buchstabieren");
    score -= 1;
  }
  return { pros, cons, score: Math.max(1, Math.min(5, score)) };
}

const fill = (text: string, values: Record<string, string>) => text.replace(/\{(\w+)\}/g, (m, k: string) => values[k] ?? m);
const firstSentence = (text: string) => (/^.*?[.!?](\s|$)/.exec(text)?.[0] ?? text).trim();

function chapter(role: RoleKey, title: string, lead: string, short: string, pick: string, reasons: string[], blocks: FolioBlock[]): Chapter {
  return { id: fid(), role, title, lead, short, pick, reasons, status: "draft", blocks };
}

/** "2.490 €" → 2490 */
const euros = (text: string) => Number(String(text).replace(/[^\d,]/g, "").replace(",", ".")) || 0;

/**
 * The folio for the meeting with the client, in the order you go through it together:
 * the designs, name and web address, how new customers find the business, the competition, what is allowed, plan and costs.
 */
export function generateFolio(input: FolioInput): FolioDoc {
  const book = getPlaybook(input.playbook);
  const city = cityName(input.city);
  const key = cityKey(input.city);
  const prose = (t: string) => fill(t, { city, client: input.client });
  const search = (t: string) => fill(t, { city: key, client: input.client });
  const names = input.names.length ? input.names : [input.client];
  const areas = localAreas[key] ?? ["die wichtigsten Stadtteile", "die Nachbarorte"];
  const hasSite = /\S/.test(input.website);
  const designs = input.designs ?? [];
  const recommended = book.packages[1] ?? book.packages[0];

  const designBlock: FolioBlock = designs.length
    ? { id: fid(), type: "options", title: "Die Entwürfe", items: designs.map((d, i) => ({ name: d.name, text: "", pros: [], cons: [], score: 3, pick: i === 0, image: d.image })) }
    : { id: fid(), type: "options", title: "Gestaltungsrichtungen", items: book.designs.map((d, i) => ({ ...d, pick: i === 0 })) };

  const chapters: Chapter[] = [
    chapter("design", "Ihre Website", "Wir schauen uns die Entwürfe gemeinsam an.", designs[0]?.name ?? book.designs[0].name, "Ein ruhiger, persönlicher Auftritt mit echtem Foto – und auf jeder Seite ein klarer Knopf zur Anfrage.", ["Vertrauen durch ein echtes Gesicht", "Auf dem Handy perfekt bedienbar", `Jede Seite führt zu: ${book.action}`], [
      designBlock,
      { id: fid(), type: "table", title: "Diese Seiten bekommt die Website", columns: ["Seite", "Was dort steht", "Wozu"], rows: book.sitemap.map((r) => r.map(prose)), detail: true },
      { id: fid(), type: "cards", title: "Mögliche Hauptüberschriften", items: book.headlines.map((h) => ({ ...h, title: prose(h.title), text: prose(h.text) })), detail: true },
      { id: fid(), type: "cards", title: "So wird aus Besuchern eine Anfrage", items: book.conversion.map((c) => ({ ...c, text: prose(c.text) })), detail: true },
    ]),

    chapter("brand", "Name & Internetadresse", "Welche Adresse ist stark – und warum?", names[0], "Eine kurze .de-Adresse, die genau zum Namen passt, frei ist und nicht mit fremden Adressen verwechselt wird.", ["Kunden tippen sie ohne Nachfragen", "Name, Adresse und E-Mail aus einem Guss", "Niemand kann sie Ihnen wegnehmen"], [
      { id: fid(), type: "domains", title: "Internetadressen – live geprüft", items: domainIdeas(names, book, input.city).map((domain) => ({ domain, status: "unknown", checked: "", note: "", pick: false })) },
      { id: fid(), type: "options", title: "Die Namen im Vergleich", items: names.map((name, i) => ({ name, text: "", ...judgeName(name, book), pick: i === 0 })) },
      {
        id: fid(),
        type: "cards",
        title: "E-Mail-Adressen",
        detail: true,
        items: [
          { title: "info@ und vorname@", text: "Eine Adresse für Anfragen, eine persönliche für Kunden.", tag: "Adressen" },
          { title: "Nie mehr @gmail.com", text: "Eine eigene Adresse wirkt sofort professioneller.", tag: "Vertrauen" },
          { title: "Kommt sicher an", text: "Richtig eingerichtet, landen Angebote nicht im Spam.", tag: "Technik" },
        ],
      },
    ]),

    chapter("ads", "So finden Sie neue Kunden", `So kommt ein neuer ${book.customers === "Mandanten" ? "Mandant" : "Kunde"} zu Ihnen.`, book.short.channels, "Zuerst gefunden werden, wo Kunden in der Nähe suchen – auf der Google-Karte –, dann Empfehlungen und Nachbarschaft. Werbung erst, wenn alles steht.", ["Kostet am Anfang fast nichts", "Bringt Kunden aus der Umgebung", "Wirkt schon in den ersten Wochen"], [
      { id: fid(), type: "journey", title: "Der Weg zu Ihnen", items: book.journey.map((j) => ({ ...j, text: search(j.text).replace(/„([^“]+)“/, (_, q: string) => `„${q.replace(key, city.split(" ")[0])}“`) })), note: book.journeyNote },
      { id: fid(), type: "channels", title: "Ihre Wege zu neuen Kunden", items: book.channels.map((c) => ({ ...c, text: prose(c.text) })) },
      { id: fid(), type: "cards", title: "Wen wir ansprechen", items: book.audiences.slice(0, 3).map((a) => ({ title: a.title, text: firstSentence(prose(a.text)), tag: a.tag })), detail: true },
      { id: fid(), type: "table", title: "Wonach Ihre Kunden bei Google suchen", columns: ["Suchbegriff", "Was dahinter steckt", "Passende Seite"], rows: book.keywords.map((r) => [search(r[0]), prose(r[1]), prose(r[2])]), detail: true },
      { id: fid(), type: "checklist", title: `Google-Profil einrichten (Kategorie „${book.gbpCategory}“)`, items: ["Profil anlegen und bestätigen", "Leistungen und Öffnungszeiten eintragen", "Echte Fotos hochladen", "Nach jedem Auftrag um eine Bewertung bitten", "Jede Bewertung beantworten", ...book.gbpExtras].map((text) => ({ text, who: "Wir", done: false })), detail: true },
      { id: fid(), type: "cards", title: "Eigene Seiten für die Umgebung", items: areas.slice(0, 6).map((area) => ({ title: area, text: `Eine eigene Seite für ${book.customers} aus ${area}.`, tag: "Ort" })), detail: true },
    ]),

    chapter("strategy", "Wie die Konkurrenz dasteht", "Wer ist gut, wer schwach – und wo ist Ihre Chance?", "Hier können Sie vorbeiziehen", prose(book.positioning), book.usps.slice(0, 3).map((u) => prose(u.title)), [
      { id: fid(), type: "audit", title: "Die Websites im Vergleich", items: [...(hasSite ? [{ name: "Ihre Website", url: input.website, own: true, result: null }] : []), ...input.competitors.filter((c) => c.url.trim()).map((c) => ({ name: c.name || c.url, url: c.url, own: false, result: null }))] },
    ]),

    chapter("sales", "Ablauf & Kosten", "Was passiert, wann – und was es kostet.", `In 2–3 Wochen online · ab ${book.packages[0]?.price ?? "–"}`, `Unsere Empfehlung: Paket „${recommended.name}“ für ${recommended.price} – genug, um bei Google gefunden zu werden, ohne mehr zu bezahlen als nötig.`, ["Fester Preis, keine Überraschungen", "Sie sehen jeden Schritt vorher", "In 2–3 Wochen online"], [
      {
        id: fid(),
        type: "timeline",
        title: "Der Ablauf",
        items: [
          { when: "Woche 1", title: "Entscheiden", text: "Design, Name, Adresse und Paket festlegen – Fotos und Texte sammeln." },
          { when: "Woche 2", title: "Bauen", text: "Die Website entsteht – Sie sehen jeden Zwischenstand und sagen, was anders soll." },
          { when: "Woche 3", title: "Online", text: "Start, Google-Profil, erste Bewertungen – ab jetzt kommen Anfragen." },
        ],
      },
      { id: fid(), type: "packages", title: "Pakete", items: book.packages.map((p) => ({ ...p, pick: p === recommended })) },
      { id: fid(), type: "roi", title: "Ab wann es sich rechnet", invest: euros(recommended.price), monthly: euros(/(\d[\d.]*) €/.exec(recommended.unit)?.[1] ?? "0"), value: book.roi.value, unit: book.roi.unit, text: book.roi.text, recurring: book.roi.recurring },
      { id: fid(), type: "checklist", title: "Nächste Schritte", items: [{ text: "Design und Adresse festlegen", who: "Gemeinsam", done: false }, { text: "Paket wählen", who: "Sie", done: false }, { text: "Adresse sichern", who: "Wir", done: false }, { text: "Fotos und Texte schicken", who: "Sie", done: false }] },
      { id: fid(), type: "checklist", title: "Was wir von Ihnen brauchen", items: book.contentNeeds.map((text) => ({ text, who: "Sie", done: false })), detail: true },
      { id: fid(), type: "checklist", title: "Offene Fragen", items: book.questions.map((text) => ({ text, who: "Sie", done: false })), detail: true },
    ]),
  ];

  return {
    version: 1,
    meta: { client: input.client, industry: book.label, playbook: book.id, city, website: input.website, goal: input.goal, date: new Date().toISOString().slice(0, 10), accent: input.accent || "#6865FF" },
    intro: prose(input.goal || `Ihr Plan für mehr ${book.customers} aus {city}.`),
    chapters,
  };
}
