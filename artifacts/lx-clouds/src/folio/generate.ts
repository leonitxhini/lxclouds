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

const priority = { A: "Zuerst", B: "Danach", C: "Später" } as const;

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

    chapter("brand", "Name & Internetadresse", "Welche Adresse ist stark – und warum?", names[0], "Eine kurze Adresse mit .de, die genau zum Namen passt – und die noch frei ist.", ["Kunden tippen sie ohne Nachfragen", "E-Mails kommen sicher bei Ihnen an", "Niemand kann sie Ihnen wegnehmen"], [
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

    chapter("ads", "So finden Sie neue Kunden", `Wo neue ${book.customers} herkommen – das Wichtigste zuerst.`, book.short.channels, "Erst die kostenlosen Wege mit der größten Wirkung, dann Werbung mit kleinem Budget.", ["Kostet am Anfang fast nichts", "Wirkt schon in den ersten Wochen", "Alles wird gemessen"], [
      { id: fid(), type: "table", style: "ranked", title: "Ihre Wege zu neuen Kunden", columns: ["Weg", "Wann", "Was wir tun"], rows: book.channels.slice().sort((a, b) => a[1].localeCompare(b[1])).map((r) => [search(r[0]), priority[r[1] as keyof typeof priority] ?? r[1], search(r[2])]) },
      { id: fid(), type: "cards", title: "Wen wir ansprechen", items: book.audiences.slice(0, 3).map((a) => ({ title: a.title, text: firstSentence(prose(a.text)), tag: a.tag })) },
      { id: fid(), type: "table", title: "Wonach Ihre Kunden bei Google suchen", columns: ["Suchbegriff", "Was dahinter steckt", "Passende Seite"], rows: book.keywords.map((r) => [search(r[0]), prose(r[1]), prose(r[2])]), detail: true },
      { id: fid(), type: "checklist", title: `Google-Profil einrichten (Kategorie „${book.gbpCategory}“)`, items: ["Profil anlegen und bestätigen", "Leistungen und Öffnungszeiten eintragen", "Echte Fotos hochladen", "Nach jedem Auftrag um eine Bewertung bitten", "Jede Bewertung beantworten", ...book.gbpExtras].map((text) => ({ text, who: "Team", done: false })), detail: true },
      { id: fid(), type: "cards", title: "Eigene Seiten für die Umgebung", items: areas.slice(0, 6).map((area) => ({ title: area, text: `Eine eigene Seite für ${book.customers} aus ${area}.`, tag: "Ort" })), detail: true },
    ]),

    chapter("strategy", "Wie die Konkurrenz dasteht", "Wir haben die Websites der Mitbewerber geprüft.", "Hier können Sie vorbeiziehen", prose(book.positioning), book.usps.slice(0, 3).map((u) => prose(u.title)), [
      { id: fid(), type: "audit", title: "Websites im Vergleich (0–100 Punkte)", items: [...(hasSite ? [{ name: "Ihre Website", url: input.website, own: true, result: null }] : []), ...input.competitors.filter((c) => c.url.trim()).map((c) => ({ name: c.name || c.url, url: c.url, own: false, result: null }))] },
    ]),

    chapter("legal", "Was erlaubt ist", "Damit keine Abmahnung den Start verdirbt.", book.short.legal, book.legalPick, ["Schützt vor Abmahnungen", "Wirkt ehrlich und seriös", "Impressum und Datenschutz machen wir"], [
      { id: fid(), type: "rules", title: "Erlaubt und tabu", dos: book.dos.slice(0, 4), donts: book.donts.slice(0, 4) },
      { id: fid(), type: "checklist", title: "Pflichten für die Website", items: ["Impressum nach § 5 DDG", "Datenschutzerklärung", "Statistik ohne Cookies – kein Cookie-Banner nötig", "Schriften lokal eingebunden", "Bildrechte geklärt", ...book.legalExtras].map((text) => ({ text, who: "Team", done: false })), detail: true },
      { id: fid(), type: "text", title: "Hinweis", text: "Diese Übersicht ersetzt keine Rechtsberatung.", detail: true },
    ]),

    chapter("sales", "Ablauf & Kosten", "Was passiert, wann – und was es kostet.", "In 6 Wochen online", "Paket „Wachstum“: genug, um bei Google gefunden zu werden – ohne mehr zu bezahlen als nötig.", ["Fester Preis, keine Überraschungen", "Sie sehen jeden Entwurf vorher", "Danach 3 Monate Begleitung"], [
      {
        id: fid(),
        type: "timeline",
        title: "Der Ablauf",
        items: [
          { when: "Woche 1", title: "Entscheiden", text: "Name, Adresse, Design und Paket." },
          { when: "Woche 2–3", title: "Erster Entwurf", text: "Startseite im gewählten Design – gemeinsam angepasst." },
          { when: "Woche 3–5", title: "Fertig bauen", text: "Alle Seiten, Texte, Google-Profil." },
          { when: "Woche 6", title: "Online", text: "Test, Start, erste Bewertungen sammeln." },
        ],
      },
      { id: fid(), type: "packages", title: "Pakete", items: book.packages.map((p, i) => ({ ...p, price: "", pick: i === 1 })) },
      { id: fid(), type: "roi", title: "Ab wann es sich rechnet", invest: 0, monthly: 0, value: book.roi.value, unit: book.roi.unit, text: book.roi.text, recurring: book.roi.recurring },
      { id: fid(), type: "checklist", title: "Nächste Schritte", items: [{ text: "Entwurf und Adresse festlegen", who: "Gemeinsam", done: false }, { text: "Paket wählen", who: "Sie", done: false }, { text: "Adresse sichern", who: "Wir", done: false }, { text: "Fotos und Texte zusammenstellen", who: "Sie", done: false }] },
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
