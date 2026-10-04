// A client conversation: you sit down with the client and go through these topics together.
// The topics live here in code; a conversation only stores the answers, so topics can be improved later.

export type Answer = { notes: string; chips: string[]; custom: string[] };
export type Todo = { id: string; text: string; who: "Ich" | "Kunde"; done: boolean };
export type TalkDoc = { answers: Record<string, Answer>; todos: Todo[] };

export type Topic = {
  key: string;
  title: string;
  /** what you ask – a prompt for you, not text for the client */
  questions: string[];
  /** quick answers to tap while he talks */
  chips?: string[];
  /** show the client's design drafts in this topic */
  designs?: boolean;
};

export const topics: Topic[] = [
  {
    key: "geschaeft",
    title: "Sein Geschäft",
    questions: ["Was machen Sie genau – in einem Satz?", "Seit wann, wo, wie viele Leute?", "Was machen Sie anders als andere?"],
  },
  {
    key: "ziel",
    title: "Was soll die Website bringen?",
    questions: ["Was soll passieren, wenn jemand Ihre Website sieht?", "Woran merken Sie in einem halben Jahr, dass sie sich gelohnt hat?"],
    chips: ["Mehr Anrufe", "Mehr Anfragen", "Termine online", "Vertrauen", "Preise erklären", "Weniger Telefon-Fragen", "Mitarbeiter finden"],
  },
  {
    key: "kunden",
    title: "Seine Kunden",
    questions: ["Wer sind Ihre typischen Kunden?", "Wie finden die Sie heute?", "Was fragen die Sie immer wieder?"],
    chips: ["Empfehlung", "Google", "Laufkundschaft", "Stammkunden", "Social Media", "Branchenbuch"],
  },
  {
    key: "inhalte",
    title: "Was auf die Website soll",
    questions: ["Was muss ein neuer Kunde unbedingt erfahren?", "Wollen Sie Preise zeigen?", "Was soll er am Ende tun – anrufen, schreiben, vorbeikommen?"],
    chips: ["Leistungen", "Über mich / uns", "Preise", "Ablauf", "Kontaktformular", "Anrufen-Knopf", "WhatsApp", "Termin buchen", "Anfahrt", "Öffnungszeiten", "Bewertungen", "Fragen & Antworten", "Team", "Bilder", "Mehrsprachig"],
  },
  {
    key: "aussehen",
    title: "Wie es aussehen soll",
    questions: ["Was gefällt Ihnen an den Entwürfen – was gar nicht?", "Gibt es Websites, die Sie gut finden?", "Farben, die passen – oder gar nicht gehen?"],
    chips: ["Modern", "Klassisch", "Persönlich & warm", "Seriös", "Hell", "Dunkel", "Viel Bild", "Wenig Text"],
    designs: true,
  },
  {
    key: "name",
    title: "Name, Domain & E-Mail",
    questions: ["Unter welchem Namen soll die Website laufen?", "Welche Domains haben Sie schon – bei welchem Anbieter?", "Welche E-Mail-Adressen nutzen Sie heute?"],
  },
  {
    key: "material",
    title: "Was er schon hat",
    questions: ["Was können Sie uns geben?", "Was fehlt noch – und wer kümmert sich?"],
    chips: ["Logo", "Fotos von sich", "Fotos vom Büro / Laden", "Texte", "Google-Eintrag", "Social Media", "Visitenkarten"],
  },
  {
    key: "budget",
    title: "Preis & Zeit",
    questions: ["Was ist besprochen – Paket, Preis?", "Bis wann soll es fertig sein?", "Wer entscheidet mit?"],
  },
  {
    key: "sonstiges",
    title: "Sonstiges",
    questions: ["Gibt es noch etwas, das Ihnen wichtig ist?"],
  },
];

export const emptyAnswer = (): Answer => ({ notes: "", chips: [], custom: [] });
export const emptyTalk = (): TalkDoc => ({ answers: {}, todos: [] });
export const answerOf = (doc: TalkDoc, key: string): Answer => ({ ...emptyAnswer(), ...(doc.answers[key] ?? {}) });
export const filled = (a: Answer) => !!(a.notes.trim() || a.chips.length || a.custom.length);
export const todoId = () => Math.random().toString(36).slice(2, 9);

/** Design reactions come from the client's drafts, which keep them themselves. */
export type DesignNote = { title: string; status: string; notes: string };
const reaction: Record<string, string> = { favorite: "gefällt", maybe: "vielleicht", out: "nein" };

/** Everything that was said, as plain text – to read through at the end or send to the client. */
export function summaryText(title: string, doc: TalkDoc, designs: DesignNote[] = []) {
  const lines: string[] = [title, ""];
  for (const t of topics) {
    const a = answerOf(doc, t.key);
    const rated = t.designs ? designs.filter((d) => d.status || d.notes.trim()) : [];
    if (!filled(a) && !rated.length) continue;
    lines.push(t.title.toUpperCase());
    const picked = [...a.chips, ...a.custom];
    if (picked.length) lines.push(picked.join(" · "));
    if (a.notes.trim()) lines.push(a.notes.trim());
    for (const d of rated) lines.push(`– ${d.title}: ${reaction[d.status] ?? "offen"}${d.notes.trim() ? ` – ${d.notes.trim()}` : ""}`);
    lines.push("");
  }
  const open = doc.todos.filter((t) => t.text.trim());
  if (open.length) {
    lines.push("NÄCHSTE SCHRITTE");
    for (const t of open) lines.push(`${t.done ? "[x]" : "[ ]"} ${t.text.trim()} (${t.who})`);
  }
  return lines.join("\n").trim();
}
