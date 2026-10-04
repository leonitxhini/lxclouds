// A meeting: everything prepared for a client on one page – drafts, name & address, what goes on the site,
// ideas for new customers, packages, what we need from him. Opened together with the client; for every
// point you decide together: take it, maybe, or not.

export type Pick = "" | "yes" | "maybe" | "no";
export type Item = { id: string; title: string; text: string; image?: string; tag?: string; price?: string; pick: Pick; note: string };
export type SectionKind = "designs" | "choice" | "list";
export type Section = {
  id: string;
  kind: SectionKind;
  title: string;
  intro: string;
  items: Item[];
  notes: string;
  /** what the three buttons say in a list – e.g. for material: "Hat er / Kommt noch / Brauchen wir nicht" */
  labels?: [string, string, string];
};
export type Todo = { id: string; text: string; who: "Ich" | "Kunde"; done: boolean };
export type MeetingDoc = { v: 2; sections: Section[]; todos: Todo[] };

export const uid = () => Math.random().toString(36).slice(2, 9);
export const defaultLabels: [string, string, string] = ["Nehmen", "Vielleicht", "Nein"];
export const designLabels: [string, string, string] = ["Gefällt", "Vielleicht", "Nein"];
export const labelsOf = (s: Section): [string, string, string] => s.labels ?? (s.kind === "designs" ? designLabels : defaultLabels);

export const isMeeting = (doc: unknown): doc is MeetingDoc => !!doc && typeof doc === "object" && Array.isArray((doc as MeetingDoc).sections);

const item = (title: string, text = "", extra: Partial<Item> = {}): Item => ({ id: uid(), title, text, pick: "", note: "", ...extra });

/** A ready-made start: the usual topics with sensible points, to be adjusted while preparing. */
export function newMeeting(designs: { title: string; image: string }[] = []): MeetingDoc {
  return {
    v: 2,
    sections: [
      { id: uid(), kind: "designs", title: "Die Entwürfe", intro: "Was gefällt – und was nicht?", items: designs.map((d) => item(d.title, "", { image: d.image })), notes: "" },
      { id: uid(), kind: "choice", title: "Name & Internetadresse", intro: "Unter welchem Namen und welcher Adresse läuft die Website?", items: [item("Name · name.de", "Warum diese Adresse passt")], notes: "" },
      {
        id: uid(),
        kind: "list",
        title: "Was auf die Website kommt",
        intro: "Was soll drauf – was brauchen wir nicht?",
        items: [
          item("Leistungen", "Was Sie anbieten, je kurz erklärt"),
          item("Über mich", "Mit Foto – Kunden wollen wissen, mit wem sie es zu tun haben"),
          item("Preise", "Pakete oder ab-Preise"),
          item("Ablauf", "In drei Schritten zum Kunden"),
          item("Anrufen-Knopf", "Ein Tipp auf dem Handy"),
          item("WhatsApp-Knopf", "Direkt in den Chat"),
          item("Termin online buchen", "Kunde wählt selbst einen Termin"),
          item("Anfahrt & Öffnungszeiten", "Mit Karte"),
          item("Google-Bewertungen", "Sterne direkt auf der Seite"),
          item("Fragen & Antworten", "Die Fragen, die immer kommen"),
        ],
        notes: "",
      },
      {
        id: uid(),
        kind: "list",
        title: "Neue Kunden gewinnen",
        intro: "Was machen wir zusätzlich, damit neue Kunden kommen?",
        items: [
          item("Google-Eintrag ausbauen", "Bestätigen, Fotos, Leistungen, Website-Link"),
          item("Bewertungen sammeln", "Zufriedene Kunden direkt fragen"),
          item("Empfehlungs-Partner", "Partner in der Nähe, die Kunden schicken"),
          item("Google-Anzeigen", "Kleines Budget, nur in der Umgebung – später"),
        ],
        notes: "",
      },
      { id: uid(), kind: "choice", title: "Paket", intro: "Was soll es kosten?", items: [item("Start", "Website, Adresse und Hosting", { price: "350 €" }), item("Plus", "Dazu Google SEO, WhatsApp, Terminbuchung", { price: "499 €" })], notes: "" },
      {
        id: uid(),
        kind: "list",
        title: "Was wir von Ihnen brauchen",
        intro: "Was ist schon da, was kommt noch?",
        labels: ["Ist da", "Kommt noch", "Brauchen wir nicht"],
        items: [item("Logo", "Als Datei"), item("Fotos von Ihnen"), item("Fotos vom Büro / Laden"), item("Texte zu den Leistungen", "Stichpunkte reichen"), item("Zugang zum Domain-Anbieter", "Für den Umzug der Adresse")],
        notes: "",
      },
    ],
    todos: [],
  };
}

/** Everything decided, as plain text – to send to the client afterwards. */
export function summaryText(title: string, doc: MeetingDoc) {
  const lines: string[] = [title, ""];
  for (const s of doc.sections) {
    const [yes, maybe] = labelsOf(s);
    const chosen = s.items.filter((i) => i.pick === "yes");
    const open = s.items.filter((i) => i.pick === "maybe");
    if (!chosen.length && !open.length && !s.notes.trim()) continue;
    lines.push(s.title.toUpperCase());
    const line = (i: Item) => `${i.title}${i.price ? ` (${i.price})` : ""}${i.note.trim() ? ` – ${i.note.trim()}` : ""}`;
    chosen.forEach((i) => lines.push(`${s.kind === "choice" ? "Gewählt" : yes}: ${line(i)}`));
    if (open.length) lines.push(`${maybe}: ${open.map(line).join(", ")}`);
    if (s.notes.trim()) lines.push(s.notes.trim());
    lines.push("");
  }
  const todos = doc.todos.filter((t) => t.text.trim());
  if (todos.length) {
    lines.push("NÄCHSTE SCHRITTE");
    todos.forEach((t) => lines.push(`${t.done ? "[x]" : "[ ]"} ${t.text.trim()} (${t.who})`));
  }
  return lines.join("\n").trim();
}
