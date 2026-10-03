/**
 * What the team knows about an industry before talking to a client: who buys, what convinces them, what they
 * search for, which channels work, what the law allows. Texts may use {city} and {client}.
 * Numbers are only given where they are marked as example values for the client to replace.
 */

type Row = [string, string, string];

/** A way to new customers: when to start, what it costs, how much it brings (1–3). Icons: see CHANNEL_ICONS in Folio.tsx. */
export type Channel = { name: string; icon: string; when: "Zuerst" | "Danach" | "Später"; text: string; cost: string; effect: number };
export type Step = { icon: string; title: string; text: string };

export type Playbook = {
  id: string;
  label: string;
  /** main word for domains and searches, singular, lower case ("buchhalter") */
  word: string;
  /** further search words ("buchhaltung", "buchhaltungsbüro") */
  words: string[];
  /** what the business calls its customers */
  customers: string;
  /** the website's main goal, as the "conversion" */
  action: string;
  audiences: { title: string; text: string; tag: string }[];
  usps: { title: string; text: string; tag: string }[];
  positioning: string;
  headlines: { title: string; text: string; tag: string }[];
  sitemap: Row[];
  conversion: { title: string; text: string; tag: string }[];
  /** search term, intent, landing page */
  keywords: Row[];
  /** Google Business Profile: main category and things to fill in */
  gbpCategory: string;
  gbpExtras: string[];
  channels: Channel[];
  /** how a new customer finds the business, in four steps, plus a second way in one line */
  journey: Step[];
  journeyNote: string;
  dos: string[];
  donts: string[];
  /** the legal recommendation in one sentence */
  legalPick: string;
  /** answers in a few words, for the big line of a chapter */
  short: { audience: string; channels: string; legal: string };
  legalExtras: string[];
  contentNeeds: string[];
  questions: string[];
  designs: { name: string; text: string; pros: string[]; cons: string[]; score: number }[];
  /** prices are our suggestion and stay editable in every folio */
  packages: { name: string; text: string; price: string; unit: string; features: string[] }[];
  /** value of one new customer; recurring = per month (bookkeeping), otherwise per sale */
  roi: { value: number; unit: string; text: string; recurring: boolean };
};

// ---------------------------------------------------------------- shared building blocks
const baseSitemap = (extra: Row[]): Row[] => [
  ["Startseite", "Wer, was, für wen – in fünf Sekunden klar; Vertrauenszeichen; ein Hauptknopf", "Anfrage oder Anruf"],
  ...extra,
  ["Über uns", "Gesicht, Werdegang, Haltung – warum man gerade Ihnen vertrauen kann", "Vertrauen"],
  ["Kontakt", "Telefon, WhatsApp, Formular, Anfahrt, Öffnungszeiten", "Anfrage"],
  ["Impressum & Datenschutz", "Pflichtseiten, sauber verlinkt", "Rechtssicherheit"],
];

const baseConversion = [
  { title: "Ein Hauptknopf", text: "Auf jeder Seite derselbe klare nächste Schritt – oben rechts und am Ende jedes Abschnitts.", tag: "Anfrage" },
  { title: "Telefon & WhatsApp mit einem Tipp", text: "Auf dem Handy oben fest sichtbar. Die meisten lokalen Anfragen kommen mobil.", tag: "Mobil" },
  { title: "Kurzes Formular", text: "Name, Kontakt, Anliegen – mehr nicht. Jedes zusätzliche Feld kostet Anfragen.", tag: "Formular" },
  { title: "Vertrauen sichtbar machen", text: "Google-Bewertungen, echte Fotos, Gesicht der Inhaberin oder des Inhabers, Mitgliedschaften.", tag: "Vertrauen" },
];

const baseContent = [
  "Logo als Vektordatei (SVG/PDF), falls vorhanden",
  "Echte Fotos: Inhaber/in, Team, Räume, Arbeit – gern mit Profi-Fotograf",
  "Liste der Leistungen in eigenen Worten",
  "2–3 Kundenstimmen mit Einverständnis",
  "Impressumsangaben und Datenschutz-Ansprechperson",
];

const baseQuestions = [
  "Welche Kunden sind die besten – und welche wollen Sie nicht mehr?",
  "Wie kommen heute neue Kunden zu Ihnen?",
  "Wie viele neue Kunden pro Monat können Sie zusätzlich gut betreuen?",
  "Gibt es schon ein Logo, Farben oder eine Domain?",
  "Wer pflegt später Inhalte und beantwortet Anfragen?",
];

// ---------------------------------------------------------------- Buchhaltung
const buchhaltung: Playbook = {
  id: "buchhaltung",
  label: "Buchhaltung",
  word: "buchhalter",
  words: ["buchhaltung", "buchhaltungsbüro", "buchhaltungsservice"],
  customers: "Mandanten",
  action: "Termin im Büro",
  audiences: [
    { title: "Kleine Betriebe aus der Umgebung", text: "Handwerk, Gastronomie, Einzelhandel, Pflegedienste. Brauchen laufende Buchhaltung und monatliche Lohnabrechnung – und jemanden in der Nähe, den sie kennen.", tag: "Kernzielgruppe" },
    { title: "Selbstständige & Freiberufler", text: "Wollen die Belege abgeben und keine Fristen mehr im Kopf haben. Schätzen einen festen Ansprechpartner, den sie anrufen oder besuchen können.", tag: "Selbstständige" },
    { title: "Inhaber, die es persönlich wollen", text: "Bringen ihre Belege lieber im Ordner vorbei, als sie hochzuladen. Für sie zählt Vertrauen, ein Gesicht und kurze Wege.", tag: "Vor Ort" },
    { title: "Betriebe mit Steuerberater", text: "Haben schon eine Kanzlei für Jahresabschluss und Steuern, wollen die laufende Buchhaltung aber günstiger und näher abgeben.", tag: "Ergänzung" },
  ],
  usps: [
    { title: "Ihr Buchhalter vor Ort", text: "Ein echtes Büro in {city}: vorbeikommen, Belege abgeben, Fragen am Tisch klären – kein Callcenter, keine anonyme Plattform.", tag: "Vor Ort" },
    { title: "Fester persönlicher Ansprechpartner", text: "Immer dieselbe Person, die Ihren Betrieb kennt – erreichbar am Telefon und im Büro.", tag: "Persönlich" },
    { title: "Belege so, wie es Ihnen passt", text: "Im Ordner vorbeibringen, in den Briefkasten werfen oder auf Wunsch digital schicken.", tag: "Flexibel" },
    { title: "Hand in Hand mit dem Steuerberater", text: "Laufende Buchhaltung hier, Jahresabschluss und Steuern bei der Kanzlei – sauber übergeben, ohne Doppelarbeit.", tag: "Partner" },
  ],
  positioning:
    "Der Buchhalter vor Ort für kleine Betriebe und Selbstständige in {city}: persönlich im Büro, ein fester Ansprechpartner, feste Monatspreise – und in enger Abstimmung mit dem Steuerberater.",
  headlines: [
    { title: "Ihre Buchhaltung in guten Händen – mitten in {city}.", text: "Betont Nähe und Vertrauen – passt zu einem Büro vor Ort.", tag: "Vor Ort" },
    { title: "Zahlen im Griff. Kopf frei.", text: "Kurz und entlastend, gut merkbar.", tag: "Entlastung" },
    { title: "Belege abgeben. Buchhaltung erledigt.", text: "Sehr konkret – ob im Ordner oder digital.", tag: "Konkret" },
  ],
  sitemap: baseSitemap([
    ["Leistungen", "Laufende Buchhaltung und Lohnabrechnung – je mit Ablauf und Nutzen", "Verstehen"],
    ["Büro & Anfahrt", "Fotos vom Büro, Adresse, Öffnungszeiten, Parken, Bus und Bahn", "Vorbeikommen"],
    ["Pakete & Preise", "Drei Pakete nach Belegmenge, was enthalten ist", "Vorqualifizieren"],
    ["Für wen", "Branchen und typische Situationen, je ein kurzer Absatz", "Wiedererkennen"],
    ["So arbeiten wir", "Kennenlernen im Büro → Unterlagen → Start; Belege bringen oder schicken", "Hürden senken"],
    ["Fragen", "Was macht der Buchhalter, was der Steuerberater, Kosten, Wechsel", "Einwände klären"],
  ]),
  conversion: [
    { title: "Anrufen mit einem Tipp", text: "Telefonnummer oben fest sichtbar – die meisten Mandanten rufen zuerst an.", tag: "Hauptweg" },
    { title: "Termin im Büro vereinbaren", text: "Kennenlerntermin direkt auswählen – im Büro oder am Telefon.", tag: "Termin" },
    { title: "Weg ins Büro", text: "Adresse, Karte, Parkplätze, nächste Haltestelle – ein Tipp startet die Navigation.", tag: "Vor Ort" },
    { title: "Vertrauen sichtbar machen", text: "Foto von Ihnen und vom Büro, Google-Bewertungen, Öffnungszeiten.", tag: "Vertrauen" },
  ],
  keywords: [
    ["buchhalter {city}", "Sucht einen Buchhalter vor Ort", "Startseite"],
    ["buchhaltungsbüro {city}", "Sucht ein Büro in der Nähe", "Startseite"],
    ["buchhalter in der nähe", "Mobil, kurz vor dem Anruf", "Google-Profil"],
    ["lohnabrechnung {city}", "Konkreter Bedarf, oft dringend", "Lohnabrechnung"],
    ["buchhaltung auslagern kosten", "Preisinteresse, kurz vor Anfrage", "Pakete & Preise"],
    ["buchhalter für kleine betriebe", "Zielgruppe nennt sich selbst", "Für wen"],
    ["buchhalter oder steuerberater", "Informationssuche, baut Vertrauen auf", "Fragen"],
  ],
  gbpCategory: "Buchhalter",
  gbpExtras: ["Fotos von Büro, Eingang und Schild hochladen – so findet man die Tür", "Öffnungszeiten und Parkmöglichkeiten eintragen", "Leistungen nur so benennen, wie sie nach § 6 StBerG erlaubt sind (keine Steuerberatung)"],
  channels: [
    { name: "Google-Karte", icon: "pin", when: "Zuerst", text: "Wer „Buchhalter {city}“ oder „in der Nähe“ sucht, sieht Ihr Büro auf der Karte – mit Sternen, Telefon und Weg.", cost: "kostenlos", effect: 3 },
    { name: "Steuerberater in der Nähe", icon: "handshake", when: "Zuerst", text: "Kanzleien in der Umgebung geben die laufende Buchhaltung gern ab – und schicken Ihnen Mandanten.", cost: "kostenlos", effect: 3 },
    { name: "Bewertungen sammeln", icon: "star", when: "Zuerst", text: "Jeder zufriedene Mandant gibt eine Bewertung – das stärkste Argument auf der Karte.", cost: "kostenlos", effect: 3 },
    { name: "Website mit Büro & Anfahrt", icon: "globe", when: "Zuerst", text: "Zeigt Ihr Büro, Ihre Leistungen und den Weg zu Ihnen – damit aus Suchenden Besucher werden.", cost: "im Paket", effect: 2 },
    { name: "Schild & Visitenkarten", icon: "store", when: "Danach", text: "Gut sichtbares Schild am Büro, Visitenkarten mit Adresse und QR-Code zur Website.", cost: "einmalig klein", effect: 2 },
    { name: "Unternehmer in der Nachbarschaft", icon: "users", when: "Danach", text: "Gewerbeverein, Handwerkerstammtisch, Läden in der Straße – vorstellen, Karte dalassen.", cost: "kostenlos", effect: 2 },
    { name: "Branchenbücher", icon: "book", when: "Danach", text: "Gelbe Seiten, Das Örtliche, 11880, buchhalterverzeichnis.de – überall dieselbe Adresse.", cost: "kostenlos", effect: 1 },
    { name: "Google-Anzeigen", icon: "megaphone", when: "Später", text: "Kleines Tagesbudget, nur im Umkreis des Büros – erst, wenn Website und Bewertungen stehen.", cost: "z. B. 5 € am Tag", effect: 2 },
  ],
  journey: [
    { icon: "search", title: "Sucht", text: "Ein Handwerker aus der Gegend googelt „Buchhalter {city}“." },
    { icon: "pin", title: "Findet Ihr Büro", text: "Auf der Karte: Ihr Büro, Sterne, Öffnungszeiten." },
    { icon: "globe", title: "Prüft", text: "Auf der Website: Leistungen, Preise, Ihr Gesicht und das Büro." },
    { icon: "phone", title: "Ruft an", text: "Ein Tipp aufs Telefon – Termin im Büro ausgemacht." },
  ],
  journeyNote: "Der zweite Weg: Sein Steuerberater oder ein Nachbarbetrieb empfiehlt Sie – und er kommt direkt vorbei.",
  dos: [
    "Kontieren und Buchen laufender Geschäftsvorfälle (§ 6 Nr. 4 StBerG)",
    "Laufende Lohnabrechnung und Fertigen der Lohnsteuer-Anmeldungen",
    "Sich als „Buchhalter“ bezeichnen und auf diese Befugnisse hinweisen (§ 8 Abs. 4 StBerG)",
    "Zusammenarbeit mit Steuerberatern offen bewerben",
  ],
  donts: [
    "Keine Steuerberatung anbieten oder andeuten",
    "Keinen Jahresabschluss (Bilanz, GuV) bewerben",
    "Keine Umsatzsteuer-Voranmeldungen oder Steuererklärungen anbieten",
    "Kein „steuer“ im Namen oder in der Domain – irreführend",
  ],
  legalPick: "Nur laufende Buchhaltung und Lohnabrechnung bewerben – Steuerberatung, Jahresabschluss und Umsatzsteuer bleiben beim Steuerberater.",
  short: { audience: "Kleine Betriebe aus der Umgebung", channels: "Google-Karte, Steuerberater, Nachbarschaft", legal: "Nur Buchhaltung & Lohn bewerben" },
  legalExtras: ["Hinweis auf die Befugnis nach § 6 Nr. 4 StBerG im Impressum oder auf der Leistungsseite", "Verschwiegenheit und Datensicherheit sichtbar erklären (Mandantendaten)"],
  contentNeeds: [
    ...baseContent,
    "Fotos vom Büro: Eingang, Schild, Schreibtisch, Besprechungsplatz",
    "Adresse, Öffnungszeiten, Parkmöglichkeiten, nächste Haltestelle",
    "Nachweis der Qualifikation (Ausbildung, Berufserfahrung) für die Über-uns-Seite",
    "Preisrahmen oder Pakete, die angeboten werden sollen",
  ],
  questions: [
    ...baseQuestions,
    "Seit wann gibt es das Büro, und wo genau liegt es (Stadtteil, Parken, Bus und Bahn)?",
    "Welche Öffnungszeiten – und wann sind Termine ohne Anmeldung möglich?",
    "Welche Qualifikation liegt vor (Ausbildung, Jahre Berufserfahrung, Bilanzbuchhalter-Prüfung)?",
    "Mit welchen Steuerberatern wird heute schon zusammengearbeitet?",
    "Welche Sprachen außer Deutsch werden angeboten?",
  ],
  designs: [
    { name: "Ruhig & vertrauensvoll", text: "Helle Flächen, ein klares Blau oder Grün, Fotos von Ihnen und dem Büro.", pros: ["Wirkt seriös und zugänglich", "Passt zu älteren und jüngeren Mandanten"], cons: ["Lebt von echten Fotos aus dem Büro"], score: 4 },
    { name: "Warm & persönlich", text: "Sand-, Terrakotta- oder Beerentöne, Serifenschrift, Arbeitsplatz-Fotos.", pros: ["Hebt sich von blauen Kanzlei-Seiten ab", "Betont die persönliche Betreuung"], cons: ["Polarisiert etwas mehr"], score: 4 },
    { name: "Klar & modern", text: "Kontrastreich, große Typografie, eine Akzentfarbe.", pros: ["Wirkt aufgeräumt und zeitgemäß"], cons: ["Kann auf traditionelle Betriebe kühl wirken"], score: 3 },
  ],
  packages: [
    { name: "Start", text: "Für den Auftritt, der Anrufe bringt.", price: "1.490 €", unit: "einmalig · danach 29 € im Monat", features: ["Website mit 5–6 Seiten", "Seite „Büro & Anfahrt“ mit Karte", "Kontaktformular & Terminwunsch", "Google-Karteneintrag eingerichtet", "Impressum & Datenschutz eingebunden"] },
    { name: "Wachstum", text: "Für mehr Sichtbarkeit in der Umgebung.", price: "2.490 €", unit: "einmalig · danach 49 € im Monat", features: ["Alles aus Start", "Preisübersicht nach Belegmenge", "Seiten für Leistungen und Stadtteile", "Bewertungs-Paket (QR-Karte für den Tresen)", "3 Monate Begleitung bei Google"] },
    { name: "Rundum", text: "Für alles aus einer Hand.", price: "3.990 €", unit: "einmalig · danach 99 € im Monat", features: ["Alles aus Wachstum", "Logo & Markenauftritt", "Fotoshooting im Büro", "Visitenkarten & Schild-Entwurf", "Monatliche Pflege & Auswertung"] },
  ],
  roi: { value: 200, unit: "€ Honorar pro Mandant und Monat (Beispielwert)", text: "Laufende Buchhaltung ist ein Monatsgeschäft: ein gewonnener Mandant bringt jeden Monat wieder Umsatz.", recurring: true },
};

// ---------------------------------------------------------------- generic playbook, tuned per industry
function generic(id: string, label: string, word: string, words: string[], customers: string, action: string, special: Partial<Playbook>): Playbook {
  return {
    id,
    label,
    word,
    words,
    customers,
    action,
    audiences: special.audiences ?? [],
    usps: special.usps ?? [
      { title: "Persönlich statt anonym", text: "Ein Gesicht, eine Nummer, schnelle Antworten – das, was große Anbieter nicht bieten.", tag: "Nähe" },
      { title: "Vor Ort in {city}", text: "Kurze Wege und Ortskenntnis sind für lokale Kunden ein echtes Argument.", tag: "Lokal" },
      { title: "Klare Preise", text: "Wer Preise oder Preisrahmen nennt, bekommt mehr und bessere Anfragen.", tag: "Transparent" },
    ],
    positioning: special.positioning ?? `Für Menschen und Betriebe in {city}, die einen verlässlichen ${label}-Anbieter suchen: persönlich, schnell erreichbar, mit klaren Preisen.`,
    headlines: special.headlines ?? [
      { title: `Ihr ${label}-Partner in {city}.`, text: "Klar und lokal – gut für Google und Vertrauen.", tag: "Lokal" },
      { title: "Einfach anfragen. Schnell Antwort.", text: "Betont den leichten Weg zur Anfrage.", tag: "Einfach" },
    ],
    sitemap: special.sitemap ?? baseSitemap([["Leistungen", "Was Sie anbieten, je mit Nutzen und Preisrahmen", "Verstehen"], ["Referenzen", "Echte Beispiele, Fotos, Stimmen", "Vertrauen"], ["Fragen", "Die zehn häufigsten Fragen", "Einwände klären"]]),
    conversion: special.conversion ?? baseConversion,
    keywords: special.keywords ?? [
      [`${word} {city}`, "Sucht einen Anbieter vor Ort", "Startseite"],
      [`${words[0] ?? word} {city}`, "Vergleicht Anbieter", "Leistungen"],
      [`${word} in der nähe`, "Mobil, kurz vor dem Anruf", "Startseite / Google-Profil"],
      [`${word} preise {city}`, "Preisinteresse", "Leistungen"],
    ],
    gbpCategory: special.gbpCategory ?? label,
    gbpExtras: special.gbpExtras ?? [],
    channels: special.channels ?? [
      { name: "Google-Profil", icon: "pin", when: "Zuerst", text: "Auf der Karte gefunden werden – mit Sternen, Telefon und Weg.", cost: "kostenlos", effect: 3 },
      { name: "Bewertungen sammeln", icon: "star", when: "Zuerst", text: "Jeder zufriedene Kunde eine Bewertung – das stärkste Argument bei Google.", cost: "kostenlos", effect: 3 },
      { name: "Empfehlungen", icon: "handshake", when: "Zuerst", text: "Zufriedene Kunden aktiv fragen – mit einer kleinen Empfehlungskarte.", cost: "kostenlos", effect: 3 },
      { name: "Website mit Ortsseiten", icon: "globe", when: "Zuerst", text: "Eigene Seiten für Leistungen und Stadtteile – so findet Google Sie öfter.", cost: "im Paket", effect: 2 },
      { name: "Instagram", icon: "camera", when: "Danach", text: "Zwei Beiträge pro Woche aus dem Alltag – zeigt, wer hinter dem Betrieb steht.", cost: "kostenlos", effect: 2 },
      { name: "Branchenbücher", icon: "book", when: "Danach", text: "Gelbe Seiten, Das Örtliche, 11880 – überall dieselben Daten.", cost: "kostenlos", effect: 1 },
      { name: "Google-Anzeigen", icon: "megaphone", when: "Später", text: "Kleines Tagesbudget auf die wichtigsten Suchbegriffe.", cost: "z. B. 5 € am Tag", effect: 2 },
    ],
    journey: special.journey ?? [
      { icon: "search", title: "Sucht", text: `Jemand googelt „${label} {city}“.` },
      { icon: "pin", title: "Findet Sie", text: "Ihr Google-Profil steht auf der Karte – mit Sternen." },
      { icon: "globe", title: "Prüft", text: "Auf der Website: Leistungen, Preise, echte Fotos." },
      { icon: "calendar", title: "Fragt an", text: `Ein Klick – ${action}.` },
    ],
    journeyNote: special.journeyNote ?? "Der zweite Weg: Ein zufriedener Kunde empfiehlt Sie weiter.",
    dos: special.dos ?? ["Echte Leistungen und Preise klar benennen", "Bewertungen sammeln und beantworten"],
    legalPick: special.legalPick ?? "Pflichtseiten sauber, Datenschutz schlank, Bildrechte geklärt – und nur bewerben, was Sie auch leisten.",
    short: special.short ?? { audience: special.audiences?.[0]?.title ?? "Kunden aus der Region", channels: "Google-Profil & Empfehlungen", legal: "Pflichtseiten & Datenschutz sauber" },
    donts: special.donts ?? ["Keine erfundenen Bewertungen oder Zahlen", "Keine fremden Fotos ohne Rechte"],
    legalExtras: special.legalExtras ?? [],
    contentNeeds: [...baseContent, ...(special.contentNeeds ?? [])],
    questions: [...baseQuestions, ...(special.questions ?? [])],
    designs: special.designs ?? [
      { name: "Klar & hell", text: "Viel Weißraum, eine Markenfarbe, große Fotos.", pros: ["Zeitlos", "Gut lesbar"], cons: ["Braucht starke Fotos"], score: 4 },
      { name: "Kräftig & markant", text: "Große Typografie, Kontraste, Farbflächen.", pros: ["Bleibt im Kopf"], cons: ["Nicht für jede Zielgruppe"], score: 3 },
    ],
    packages: special.packages ?? buchhaltung.packages.map((p) => ({ ...p, features: p.features.filter((f) => !/Preisrechner|Belegmenge/.test(f)) })),
    roi: special.roi ?? { value: 0, unit: "€ Umsatz pro Neukunde (bitte eintragen)", text: "Tragen Sie ein, was ein neuer Kunde im Schnitt bringt – dann zeigt die Rechnung, ab wann sich die Website bezahlt macht.", recurring: false },
  };
}

const rental = generic("rental", "Autovermietung", "autovermietung", ["mietwagen", "auto mieten"], "Kunden", "Buchungsanfrage", {
  audiences: [
    { title: "Privatkunden für Urlaub & Umzug", text: "Vergleichen Preise, buchen kurzfristig, oft mobil.", tag: "Kern" },
    { title: "Geschäftskunden", text: "Brauchen Ersatzwagen und Langzeitmiete, legen Wert auf Rechnung und Verlässlichkeit.", tag: "Umsatz" },
    { title: "Flughafen- und Bahnreisende", text: "Wollen Übergabe am Terminal, entscheiden in Minuten.", tag: "Schnell" },
  ],
  keywords: [["autovermietung {city}", "Sucht Anbieter", "Startseite"], ["mietwagen {city}", "Will buchen", "Flotte"], ["auto mieten {city} flughafen", "Konkreter Bedarf", "Flughafen"], ["transporter mieten {city}", "Umzug", "Transporter"]],
  gbpCategory: "Autovermietung",
  roi: { value: 0, unit: "€ Umsatz pro Buchung (bitte eintragen)", text: "Tragen Sie den durchschnittlichen Umsatz einer Buchung ein.", recurring: false },
});
const restaurant = generic("restaurant", "Restaurant", "restaurant", ["essen gehen", "italienisch essen"], "Gäste", "Tischreservierung", {
  audiences: [
    { title: "Paare & Freunde am Abend", text: "Entscheiden über Fotos, Bewertungen und Speisekarte.", tag: "Kern" },
    { title: "Mittagsgäste aus Büros", text: "Wollen schnell wissen: Mittagstisch, Preis, Wartezeit.", tag: "Mittag" },
    { title: "Feiern & Firmenessen", text: "Planen Wochen vorher, brauchen Ansprechpartner und Menüs.", tag: "Umsatz" },
  ],
  keywords: [["restaurant {city}", "Sucht Ort", "Startseite"], ["italiener {city}", "Küche gewählt", "Speisekarte"], ["mittagstisch {city}", "Mittag", "Mittagstisch"], ["restaurant für feiern {city}", "Event", "Feiern"]],
  gbpCategory: "Restaurant",
  legalExtras: ["Allergenkennzeichnung auf der Speisekarte (LMIV)", "Preisangaben inkl. MwSt."],
});
const craft = generic("craft", "Handwerk", "handwerker", ["badsanierung", "renovierung"], "Kunden", "Angebotsanfrage", {
  audiences: [
    { title: "Eigenheimbesitzer", text: "Planen Bad oder Renovierung, vergleichen drei Angebote, wollen Referenzen sehen.", tag: "Kern" },
    { title: "Vermieter & Hausverwaltungen", text: "Brauchen Zuverlässigkeit und Termintreue, oft wiederkehrend.", tag: "Wiederkehrend" },
  ],
  keywords: [["badsanierung {city}", "Konkretes Projekt", "Bad"], ["handwerker {city}", "Sucht Betrieb", "Startseite"], ["fliesenleger {city}", "Gewerk", "Fliesen"], ["renovierung {city} kosten", "Preisinteresse", "Leistungen"]],
  gbpCategory: "Handwerker",
  legalExtras: ["Eintragung in die Handwerksrolle angeben", "Gewährleistung korrekt darstellen"],
});
const beauty = generic("beauty", "Friseur & Beauty", "friseur", ["kosmetik", "beauty salon"], "Kundinnen und Kunden", "Terminbuchung", {
  keywords: [["friseur {city}", "Sucht Salon", "Startseite"], ["balayage {city}", "Konkreter Wunsch", "Leistungen"], ["kosmetikstudio {city}", "Behandlung", "Kosmetik"]],
  gbpCategory: "Friseursalon",
  legalExtras: ["Preisangaben vollständig (PAngV)"],
});
const clinic = generic("clinic", "Praxis", "praxis", ["zahnarzt", "arzt"], "Patientinnen und Patienten", "Terminanfrage", {
  keywords: [["zahnarzt {city}", "Sucht Praxis", "Startseite"], ["zahnarzt angstpatienten {city}", "Konkretes Bedürfnis", "Angstpatienten"], ["zahnarzt notdienst {city}", "Dringend", "Notfall"]],
  gbpCategory: "Zahnarzt",
  dos: ["Sachlich über Leistungen informieren", "Qualifikationen und Schwerpunkte nennen"],
  legalPick: "Sachlich informieren, keine Heilversprechen – so bleibt die Website berufsrechtlich sauber.",
  donts: ["Keine Heilversprechen (Heilmittelwerbegesetz)", "Keine Vorher-Nachher-Bilder bei operativen Eingriffen", "Keine Patientenbewertungen mit Heilversprechen zitieren"],
  legalExtras: ["Berufsrechtliche Angaben im Impressum (Kammer, Berufsbezeichnung, Berufsordnung)"],
});
const realestate = generic("realestate", "Immobilien", "immobilienmakler", ["immobilien", "haus verkaufen"], "Kundinnen und Kunden", "Wertermittlung", {
  keywords: [["immobilienmakler {city}", "Sucht Makler", "Startseite"], ["haus verkaufen {city}", "Verkaufsabsicht", "Verkaufen"], ["immobilienbewertung {city}", "Wert wissen", "Wertermittlung"]],
  gbpCategory: "Immobilienmakler",
  legalExtras: ["Erlaubnis nach § 34c GewO im Impressum", "Pflichtangaben zum Energieausweis in Anzeigen"],
});
const shop = generic("shop", "Shop", "shop", ["laden", "geschenke"], "Kundinnen und Kunden", "Kauf oder Besuch", {
  keywords: [["concept store {city}", "Sucht Laden", "Startseite"], ["geschenke {city}", "Anlass", "Geschenke"], ["wohnaccessoires online", "Kaufabsicht", "Shop"]],
  gbpCategory: "Geschäft",
  legalExtras: ["Widerrufsbelehrung, AGB, Versandkosten, Grundpreise", "Button-Lösung „zahlungspflichtig bestellen“"],
});
const service = generic("service", "Dienstleistung", "berater", ["beratung", "dienstleister"], "Kunden", "Erstgespräch", {
  keywords: [["unternehmensberatung {city}", "Sucht Berater", "Startseite"], ["berater für kleine unternehmen", "Zielgruppe", "Leistungen"]],
  gbpCategory: "Unternehmensberater",
});

export const playbooks: Playbook[] = [buchhaltung, rental, restaurant, craft, beauty, clinic, realestate, shop, service];
export const getPlaybook = (id: string) => playbooks.find((p) => p.id === id) ?? service;

/** Districts and neighbouring towns that deserve their own local page. */
export const localAreas: Record<string, string[]> = {
  frankfurt: ["Sachsenhausen", "Bornheim", "Nordend", "Westend", "Bockenheim", "Ostend", "Höchst", "Offenbach", "Eschborn", "Bad Homburg", "Bad Vilbel", "Neu-Isenburg"],
  berlin: ["Mitte", "Prenzlauer Berg", "Charlottenburg", "Kreuzberg", "Neukölln", "Spandau", "Potsdam"],
  hamburg: ["Altona", "Eimsbüttel", "Winterhude", "Wandsbek", "Harburg", "Norderstedt"],
  münchen: ["Schwabing", "Maxvorstadt", "Sendling", "Pasing", "Bogenhausen", "Unterschleißheim"],
  köln: ["Ehrenfeld", "Nippes", "Deutz", "Lindenthal", "Kalk", "Leverkusen"],
};

/** Short forms people use for a city, for domain ideas. */
export const cityShort: Record<string, string> = { frankfurt: "ffm", münchen: "muc", hamburg: "hh", berlin: "ber", köln: "koeln", düsseldorf: "ddorf" };
