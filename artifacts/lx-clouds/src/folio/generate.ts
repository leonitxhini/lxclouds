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
  return [...new Set(list.filter((d) => /^[a-z0-9-]+\.[a-z]+$/.test(d) && !d.startsWith("-")))].slice(0, 18);
}

/** A first, honest assessment of a name; the team refines it in the meeting. */
function judgeName(name: string, book: Playbook) {
  const lower = name.toLowerCase();
  const pros: string[] = [];
  const cons: string[] = [];
  let score = 3;
  const describes = [book.word, ...book.words].some((w) => lower.includes(w.slice(0, 7)));
  if (describes) {
    pros.push("Die Branche steckt im Namen – Fremde verstehen sofort, worum es geht");
    score += 1;
  } else cons.push("Der Name sagt nicht, was angeboten wird – das muss der Untertitel leisten");
  if (/^[A-ZÄÖÜ]{2,3}\b/.test(name.trim())) {
    cons.push("Initialen sagen Fremden nichts – sie müssen erst bekannt werden");
    score -= 1;
  }
  if (/^(my|mein)/i.test(name.trim())) pros.push("Klingt persönlich – genau das Versprechen eines festen Ansprechpartners");
  if (/^my/i.test(name.trim())) cons.push("Englisch-deutsche Mischung – am Telefon oft falsch geschrieben (my/mei/mai)");
  const length = name.replace(/\s/g, "").length;
  if (length <= 14) pros.push("Kurz und gut zu merken");
  if (length > 22) {
    cons.push("Lang – schwer zu buchstabieren und zu tippen");
    score -= 1;
  }
  return { pros, cons, score: Math.max(1, Math.min(5, score)) };
}

const fill = (text: string, values: Record<string, string>) => text.replace(/\{(\w+)\}/g, (m, k: string) => values[k] ?? m);

function chapter(role: RoleKey, title: string, lead: string, pick: string, blocks: FolioBlock[]): Chapter {
  return { id: fid(), role, title, lead, pick, status: "draft", blocks };
}

export function generateFolio(input: FolioInput): FolioDoc {
  const book = getPlaybook(input.playbook);
  const city = cityName(input.city);
  const key = cityKey(input.city);
  const prose = (t: string) => fill(t, { city, client: input.client });
  const search = (t: string) => fill(t, { city: key, client: input.client });
  const names = input.names.length ? input.names : [input.client];
  const areas = localAreas[key] ?? ["die wichtigsten Stadtteile", "die Nachbarorte im Umkreis von 20 km"];
  const hasSite = /\S/.test(input.website);

  const chapters: Chapter[] = [
    chapter("lead", "Ausgangslage & Ziel", "Was wir wissen, was wir erreichen wollen – und was wir noch gemeinsam klären.", prose(input.goal || `Mehr passende ${book.customers} aus {city} – planbar über Google und Empfehlungen.`), [
      {
        id: fid(),
        type: "cards",
        title: "Auf einen Blick",
        items: [
          { title: input.client, text: `${book.label} in ${city}`, tag: "Unternehmen" },
          { title: hasSite ? "Website vorhanden" : "Noch keine Website", text: hasSite ? `${input.website} – im Kapitel Technik geprüft` : "Wir starten ohne Altlasten – ein Vorteil.", tag: "Ausgangslage" },
          { title: `Mehr ${book.customers}`, text: prose(input.goal || "Planbar neue Anfragen, ohne Kaltakquise."), tag: "Ziel" },
        ],
      },
      { id: fid(), type: "checklist", title: "Mit Ihnen zu klären", items: book.questions.map((text) => ({ text, who: "Kunde", done: false })) },
    ]),

    chapter("strategy", "Zielgruppen & Positionierung", `Wer kauft – und warum ausgerechnet bei ${input.client}?`, prose(book.positioning), [
      { id: fid(), type: "cards", title: "Zielgruppen", items: book.audiences.map((a) => ({ ...a, text: prose(a.text) })) },
      { id: fid(), type: "text", title: "Positionierung in einem Satz", text: prose(book.positioning) },
      { id: fid(), type: "cards", title: "Warum Sie – die Argumente", items: book.usps.map((u) => ({ ...u, text: prose(u.text), title: prose(u.title) })) },
      { id: fid(), type: "audit", title: "Wettbewerb im Check", items: input.competitors.filter((c) => c.url.trim()).map((c) => ({ name: c.name || c.url, url: c.url, own: false, result: null })) },
    ]),

    chapter("brand", "Name & Domain", "Wie man Sie findet, sich Sie merkt und Ihnen schreibt.", "Name und Domain müssen zusammenpassen und frei sein – sonst landen Anfragen beim Falschen.", [
      { id: fid(), type: "options", title: "Namensrichtungen", items: names.map((name, i) => ({ name, text: "", ...judgeName(name, book), pick: i === 0 })) },
      { id: fid(), type: "domains", title: "Domains – live geprüft", items: domainIdeas(names, book, input.city).map((domain) => ({ domain, status: "unknown", checked: "", note: "", pick: false })) },
      {
        id: fid(),
        type: "cards",
        title: "E-Mail-Adressen",
        items: [
          { title: "info@ und vorname@", text: "Eine allgemeine Adresse für Anfragen, eine persönliche für laufende Kunden.", tag: "Adressen" },
          { title: "Nie mehr @gmail.com", text: "Eine Adresse mit eigener Domain wirkt sofort professioneller – und ist bei einem Wechsel mitnehmbar.", tag: "Vertrauen" },
          { title: "Zustellbarkeit", text: "SPF, DKIM und DMARC einrichten, damit Angebote nicht im Spam landen.", tag: "Technik" },
        ],
      },
    ]),

    chapter("design", "Design & Nutzerführung", "Wie die Website aussieht, aufgebaut ist und Besucher zur Anfrage führt.", "Ruhig, persönlich, mit echtem Foto – und auf jeder Seite ein klarer nächster Schritt.", [
      { id: fid(), type: "options", title: "Gestaltungsrichtungen", items: book.designs.map((d, i) => ({ ...d, pick: i === 0 })) },
      { id: fid(), type: "table", title: "Seitenaufbau", columns: ["Seite", "Inhalt", "Ziel"], rows: book.sitemap.map((r) => r.map(prose)) },
      { id: fid(), type: "cards", title: "So wird aus Besuchern eine Anfrage", items: book.conversion.map((c) => ({ ...c, text: prose(c.text) })) },
    ]),

    chapter("content", "Botschaften & Inhalte", "Was auf der Website steht – und was wir dafür von Ihnen brauchen.", `Konkret statt allgemein: sagen, für wen, was, wie es abläuft – und was es kostet.`, [
      { id: fid(), type: "cards", title: "Vorschläge für die Hauptüberschrift", items: book.headlines.map((h) => ({ ...h, title: prose(h.title), text: prose(h.text) })) },
      {
        id: fid(),
        type: "rules",
        title: "Schreibregeln für alle Texte",
        dos: ["Sie-Form, kurze Sätze, aktive Verben", "Für wen zuerst, dann was", "Zahlen nur, wenn sie stimmen", `Jede Seite endet mit dem nächsten Schritt: ${book.action}`],
        donts: ["Floskeln wie „kompetent, zuverlässig, innovativ“ ohne Beleg", "Fachsprache ohne Erklärung", "Stockfotos von lächelnden Fremden"],
      },
      { id: fid(), type: "checklist", title: "Was wir von Ihnen brauchen", items: book.contentNeeds.map((text) => ({ text, who: "Kunde", done: false })) },
    ]),

    chapter("seo", "Google & lokale Sichtbarkeit", `Wer in ${city} sucht, soll Sie finden – in der Suche und auf der Karte.`, "Das Google-Unternehmensprofil zuerst: es bringt lokal die meisten Anrufe, kostet nichts und wirkt sofort.", [
      { id: fid(), type: "table", title: "Wonach Ihre Kunden suchen", columns: ["Suchbegriff", "Was dahinter steckt", "Passende Seite"], rows: book.keywords.map((r) => [search(r[0]), prose(r[1]), prose(r[2])]) },
      { id: fid(), type: "checklist", title: `Google-Unternehmensprofil (Kategorie: ${book.gbpCategory})`, items: [...baseGbpItems(), ...book.gbpExtras].map((text) => ({ text, who: "Team", done: false })) },
      { id: fid(), type: "cards", title: "Lokale Seiten mit echtem Inhalt", items: areas.slice(0, 6).map((area) => ({ title: `${book.label} für ${area}`, text: `Eigene Seite mit Anfahrt, typischen ${book.customers} und Fragen aus ${area} – kein kopierter Text.`, tag: "Ortsseite" })) },
    ]),

    chapter("ads", "Kanäle & erste 90 Tage", `Wo neue ${book.customers} herkommen – nach Wirkung sortiert.`, "Erst die kostenlosen Kanäle mit hoher Wirkung, dann bezahlte Reichweite mit kleinem, messbarem Budget.", [
      { id: fid(), type: "table", title: "Kanäle nach Priorität", columns: ["Kanal", "Priorität", "Erster Schritt"], rows: book.channels.map((r) => r.map(search)) },
      {
        id: fid(),
        type: "timeline",
        title: "Die ersten 90 Tage",
        items: [
          { when: "Woche 1–2", title: "Grundlagen", text: "Google-Profil, Verzeichnisse mit identischen Daten, erste Bewertungen von Bestandskunden." },
          { when: "Woche 3–6", title: "Website live", text: "Start mit allen Leistungsseiten, Messung ohne Cookies, Anfragewege getestet." },
          { when: "Woche 7–10", title: "Reichweite", text: "Partner ansprechen, lokale Seiten ergänzen, kleines Anzeigen-Budget testen." },
          { when: "Woche 11–13", title: "Auswerten", text: "Welche Kanäle bringen Anfragen? Budget umschichten, Texte schärfen." },
        ],
      },
    ]),

    chapter("legal", "Recht & Datenschutz", "Was erlaubt ist, was Pflicht ist – damit keine Abmahnung den Start verdirbt.", book.legalPick, [
      { id: fid(), type: "rules", title: `Werbung für ${book.label}: erlaubt und tabu`, dos: book.dos, donts: book.donts },
      { id: fid(), type: "checklist", title: "Pflichten für die Website", items: [...baseLegalItems(), ...book.legalExtras].map((text) => ({ text, who: "Team", done: false })) },
      { id: fid(), type: "text", title: "Hinweis", text: "Diese Übersicht ersetzt keine Rechtsberatung. Bei Zweifeln prüfen wir Texte mit einer Fachanwältin oder einem Fachanwalt." },
    ]),

    chapter("tech", "Technik & Betrieb", "Worauf die Website läuft, wie sie schnell und sicher bleibt – und wie wir Erfolg messen.", "Schnelle, schlanke Seite ohne Baukasten-Ballast; Messung ohne Cookies; Pflege aus einer Hand.", [
      {
        id: fid(),
        type: "cards",
        title: "Der technische Plan",
        items: [
          { title: "Schnell auf dem Handy", text: "Statisch ausgelieferte Seiten über ein weltweites Netz – lädt in unter einer Sekunde.", tag: "Leistung" },
          { title: "Domain & E-Mail getrennt", text: "Domain beim Registrar Ihrer Wahl, E-Mail bei einem eigenen Anbieter – nichts hängt an einem Baukasten.", tag: "Unabhängig" },
          { title: "Messung ohne Cookies", text: "Besucher, Anrufe, Formulare und Terminbuchungen werden gezählt – ohne Banner, datenschutzfreundlich.", tag: "Messbar" },
          { title: "Formulare, die ankommen", text: "Anfragen per E-Mail und als Liste im Kundenportal, mit Spam-Schutz.", tag: "Anfragen" },
          { title: "Sicherheit & Backups", text: "HTTPS, aktuelle Technik, tägliche Sicherung, keine Plugins zum Nachpflegen.", tag: "Sicher" },
          { title: "Pflege", text: "Änderungen per Nachricht, kleine Anpassungen innerhalb von 48 Stunden.", tag: "Service" },
        ],
      },
      ...(hasSite ? [{ id: fid(), type: "audit" as const, title: "Ihre jetzige Website im Check", items: [{ name: input.client, url: input.website, own: true, result: null }] }] : []),
    ]),

    chapter("lead", "Fahrplan", "Von heute bis zur fertigen Website – mit klaren Etappen.", "In vier bis sechs Wochen online, danach drei Monate gemeinsam nachschärfen.", [
      {
        id: fid(),
        type: "timeline",
        title: "Etappen",
        items: [
          { when: "Woche 1", title: "Entscheidungen", text: "Name, Domain, Gestaltungsrichtung und Paket festlegen; Material vom Kunden anfordern." },
          { when: "Woche 2–3", title: "Entwurf", text: "Startseite und eine Leistungsseite im gewählten Design, gemeinsam besprochen und angepasst." },
          { when: "Woche 3–5", title: "Ausbau", text: "Alle Seiten, Texte, Formulare, Google-Profil, Verzeichnisse." },
          { when: "Woche 5–6", title: "Start", text: "Test auf allen Geräten, Domain umstellen, Messung aktiv, Ankündigung an Bestandskunden." },
          { when: "Monat 2–4", title: "Nachschärfen", text: "Anfragen auswerten, Texte und Anzeigen anpassen, Bewertungen sammeln." },
        ],
      },
      { id: fid(), type: "checklist", title: "Nächste Schritte", items: [{ text: "Paket wählen und Auftrag bestätigen", who: "Kunde", done: false }, { text: "Domain sichern", who: "Team", done: false }, { text: "Material zusammenstellen", who: "Kunde", done: false }, { text: "Termin für den ersten Entwurf", who: "Team", done: false }] },
    ]),

    chapter("sales", "Investition", "Was es kostet – und ab wann es sich rechnet.", "Das Paket „Wachstum“: genug, um bei Google sichtbar zu werden, ohne mehr zu bezahlen als nötig.", [
      { id: fid(), type: "packages", title: "Pakete", items: book.packages.map((p, i) => ({ ...p, price: "", pick: i === 1 })) },
      { id: fid(), type: "roi", title: "Ab wann es sich rechnet", invest: 0, monthly: 0, value: book.roi.value, unit: book.roi.unit, text: book.roi.text, recurring: book.roi.recurring },
    ]),
  ];

  return {
    version: 1,
    meta: { client: input.client, industry: book.label, playbook: book.id, city, website: input.website, goal: input.goal, date: new Date().toISOString().slice(0, 10), accent: input.accent || "#6865FF" },
    intro: `Wir haben ${input.client} aus zehn Blickwinkeln betrachtet – von der Zielgruppe über Name, Domain und Design bis zu Google, Recht, Technik und Kosten. Auf den nächsten Seiten steht, was wir empfehlen und warum.`,
    chapters,
  };
}

function baseGbpItems() {
  return [
    "Profil bei Google beanspruchen und bestätigen",
    "Hauptkategorie und passende Nebenkategorien setzen",
    "Leistungen einzeln mit kurzer Beschreibung eintragen",
    "Echte Fotos: Außenansicht, Arbeitsplatz, Team",
    "Öffnungszeiten inkl. Feiertage pflegen",
    "Website-Link mit Kennzeichnung, damit Anfragen messbar sind",
    "Nach jedem Auftrag um eine Bewertung bitten (QR-Karte)",
    "Jede Bewertung beantworten",
  ];
}

function baseLegalItems() {
  return [
    "Impressum nach § 5 DDG, von jeder Seite erreichbar",
    "Datenschutzerklärung passend zu den eingesetzten Diensten",
    "Statistik ohne Cookies – dann entfällt der Cookie-Banner",
    "Schriften lokal einbinden, nicht von Google laden",
    "Formular nur mit nötigen Feldern, verschlüsselt",
    "Bildrechte für jedes Foto dokumentieren",
  ];
}
