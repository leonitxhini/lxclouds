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
  action: "Erstgespräch",
  audiences: [
    { title: "Selbstständige & Freiberufler", text: "Kreative, Berater, Therapeuten, IT-Freelancer. Wollen Belege loswerden und keine Fristen mehr im Kopf haben. Entscheiden schnell, wenn Preis und Ablauf klar sind.", tag: "Kernzielgruppe" },
    { title: "Kleine Betriebe mit Angestellten", text: "Handwerk, Gastronomie, Einzelhandel, Pflegedienste. Brauchen laufende Buchhaltung und monatliche Lohnabrechnung – zuverlässig, termingerecht.", tag: "Lohnabrechnung" },
    { title: "Gründerinnen & Gründer, junge GmbHs", text: "Starten gerade und wollen es von Anfang an richtig machen. Suchen online, vergleichen Preise, schätzen digitale Abläufe.", tag: "Wachstum" },
    { title: "Betriebe mit Steuerberater", text: "Haben schon eine Kanzlei für Jahresabschluss und Steuern, wollen die laufende Buchhaltung aber günstiger und näher auslagern.", tag: "Ergänzung" },
  ],
  usps: [
    { title: "Fester persönlicher Ansprechpartner", text: "Kein Callcenter, keine wechselnden Sachbearbeiter. Der wichtigste Unterschied zu großen Online-Anbietern.", tag: "Persönlich" },
    { title: "Digital ohne Papierchaos", text: "Belege per Foto oder Upload, Bankanbindung, monatlich sauber gebucht – für den Steuerberater vorbereitet.", tag: "Digital" },
    { title: "Klare Pakete statt Stundenzettel", text: "Feste Monatspreise nach Belegmenge. Wer den Preis kennt, fragt eher an.", tag: "Transparent" },
    { title: "Hand in Hand mit dem Steuerberater", text: "Laufende Buchhaltung hier, Jahresabschluss und Steuern bei der Kanzlei – sauber übergeben, ohne Doppelarbeit.", tag: "Partner" },
  ],
  positioning:
    "Für Selbstständige und kleine Betriebe in {city}, die ihre laufende Buchhaltung und Lohnabrechnung abgeben wollen: persönlich betreut, digital organisiert, zu festen Monatspreisen – und in enger Abstimmung mit ihrem Steuerberater.",
  headlines: [
    { title: "Belege rein. Buchhaltung erledigt.", text: "Kurz, konkret, verspricht Entlastung. Passt zu digitalen Selbstständigen.", tag: "Entlastung" },
    { title: "Ihre Buchhaltung in guten Händen – in {city}.", text: "Betont Vertrauen und Nähe. Gut für ältere Betriebsinhaber.", tag: "Vertrauen" },
    { title: "Mehr Zeit für Ihr Unternehmen.", text: "Nutzen statt Leistung. Funktioniert breit, ist aber austauschbar – nur mit starkem Untertitel.", tag: "Nutzen" },
  ],
  sitemap: baseSitemap([
    ["Leistungen", "Laufende Buchhaltung, Lohnabrechnung, digitale Belegverwaltung – je mit Ablauf und Nutzen", "Verstehen"],
    ["Pakete & Preise", "Drei Pakete nach Belegmenge, was enthalten ist, was nicht", "Vorqualifizieren"],
    ["Für wen", "Branchen und typische Situationen, je ein kurzer Absatz", "Wiedererkennen"],
    ["So arbeiten wir", "Erstgespräch → Unterlagen → Start, digitale Belegübergabe", "Hürden senken"],
    ["Fragen", "Was darf ein Buchhalter, was macht der Steuerberater, Kosten, Wechsel", "Einwände klären"],
  ]),
  conversion: [
    { title: "„Erstgespräch vereinbaren“", text: "15–20 Minuten per Telefon oder Video, Termin direkt online wählbar.", tag: "Hauptweg" },
    { title: "Preisrechner nach Belegen", text: "Drei Fragen (Belege pro Monat, Mitarbeiter, Branche) → passendes Paket. Qualifiziert vor und senkt die Hemmschwelle.", tag: "Besonders" },
    ...baseConversion.slice(1),
  ],
  keywords: [
    ["buchhalter {city}", "Sucht einen Anbieter vor Ort", "Startseite"],
    ["buchhaltungsbüro {city}", "Vergleicht Anbieter", "Startseite"],
    ["buchhaltungsservice {city}", "Will auslagern", "Leistungen"],
    ["lohnabrechnung {city}", "Konkreter Bedarf, oft dringend", "Lohnabrechnung"],
    ["buchhaltung auslagern kosten", "Preisinteresse, kurz vor Anfrage", "Pakete & Preise"],
    ["buchhalter für selbstständige", "Zielgruppe nennt sich selbst", "Für wen"],
    ["buchhalter oder steuerberater", "Informationssuche, baut Vertrauen auf", "Fragen / Ratgeber"],
    ["belege digital einreichen buchhaltung", "Ablauf-Frage", "So arbeiten wir"],
  ],
  gbpCategory: "Buchhalter",
  gbpExtras: ["Nebenkategorie „Buchhaltungsdienst“ prüfen", "Leistungen nur so benennen, wie sie nach § 6 StBerG erlaubt sind (keine Steuerberatung)"],
  channels: [
    { name: "Google-Profil", icon: "pin", when: "Zuerst", text: "Wer „Buchhalter {city}“ sucht, sieht Sie auf der Karte – mit Sternen, Telefon und Weg.", cost: "kostenlos", effect: 3 },
    { name: "Steuerberater als Partner", icon: "handshake", when: "Zuerst", text: "Kanzleien geben die laufende Buchhaltung gern ab – und empfehlen Sie an ihre Mandanten weiter.", cost: "kostenlos", effect: 3 },
    { name: "Bewertungen sammeln", icon: "star", when: "Zuerst", text: "Jeder zufriedene Mandant gibt eine Bewertung – das stärkste Argument bei Google.", cost: "kostenlos", effect: 3 },
    { name: "Website mit Ortsseiten", icon: "globe", when: "Zuerst", text: "Eigene Seiten für Lohnabrechnung, Selbstständige und die Stadtteile – so findet Google Sie öfter.", cost: "im Paket", effect: 2 },
    { name: "Branchenbücher", icon: "book", when: "Danach", text: "Gelbe Seiten, Das Örtliche, 11880, buchhalterverzeichnis.de – überall dieselben Daten.", cost: "kostenlos", effect: 1 },
    { name: "Gründer-Netzwerke", icon: "rocket", when: "Danach", text: "IHK-Gründertage und Coworking-Spaces – dort sitzen die Mandanten von morgen.", cost: "kostenlos", effect: 2 },
    { name: "Google-Anzeigen", icon: "megaphone", when: "Später", text: "Kleines Tagesbudget auf „Buchhalter {city}“ – erst, wenn Website und Bewertungen stehen.", cost: "z. B. 5 € am Tag", effect: 2 },
    { name: "LinkedIn", icon: "users", when: "Später", text: "Ein praktischer Tipp im Monat – hält Sie bei Gründern im Gedächtnis.", cost: "kostenlos", effect: 1 },
  ],
  journey: [
    { icon: "search", title: "Sucht", text: "Ein Handwerker googelt „Buchhalter {city}“." },
    { icon: "pin", title: "Findet Sie", text: "Ihr Google-Profil steht auf der Karte – mit Sternen." },
    { icon: "globe", title: "Prüft", text: "Auf der Website: Preise, Ablauf und Ihr Gesicht." },
    { icon: "calendar", title: "Fragt an", text: "Ein Klick – das Erstgespräch ist gebucht." },
  ],
  journeyNote: "Der zweite Weg: Sein Steuerberater empfiehlt Sie – und er ruft direkt an.",
  dos: [
    "Kontieren und Buchen laufender Geschäftsvorfälle (§ 6 Nr. 4 StBerG)",
    "Laufende Lohnabrechnung und Fertigen der Lohnsteuer-Anmeldungen",
    "Sich als „Buchhalter“ bezeichnen und auf diese Befugnisse hinweisen (§ 8 Abs. 4 StBerG)",
    "Digitale Belegverwaltung, Vorbereitung der Unterlagen für den Steuerberater",
    "Zusammenarbeit mit Steuerberatern offen bewerben",
  ],
  donts: [
    "Keine Steuerberatung anbieten oder andeuten",
    "Keinen Jahresabschluss (Bilanz, GuV) bewerben",
    "Keine Umsatzsteuer-Voranmeldungen oder Steuererklärungen anbieten",
    "Keine Einrichtung der Buchführung / des Kontenrahmens bewerben",
    "Kein „steuer“ im Namen oder in der Domain – irreführend",
    "Keine Texte von Mitbewerbern übernehmen, die mehr versprechen – sogenannte Überschusswerbung kann abgemahnt und mit Bußgeld belegt werden",
  ],
  legalPick: "Nur laufende Buchhaltung und Lohnabrechnung bewerben – Steuerberatung, Jahresabschluss und Umsatzsteuer bleiben beim Steuerberater.",
  short: { audience: "Selbstständige & kleine Betriebe", channels: "Google-Profil, Steuerberater, Empfehlungen", legal: "Nur Buchhaltung & Lohn bewerben" },
  legalExtras: ["Hinweis auf die Befugnis nach § 6 Nr. 4 StBerG im Impressum oder auf der Leistungsseite", "Auftragsverarbeitungsverträge für Belege-Portal und Cloud-Speicher", "Verschwiegenheit und Datensicherheit sichtbar erklären (Mandantendaten)"],
  contentNeeds: [
    ...baseContent,
    "Nachweis der Qualifikation (kaufmännische Ausbildung, Berufserfahrung) für die Über-uns-Seite",
    "Eingesetzte Programme (z. B. DATEV, Lexware, sevDesk) – nur wenn tatsächlich genutzt",
    "Preisrahmen oder Pakete, die der Kunde anbieten möchte",
  ],
  questions: [
    ...baseQuestions,
    "Welche Qualifikation liegt vor (Ausbildung, Jahre Berufserfahrung, Bilanzbuchhalter-Prüfung)?",
    "Mit welchen Steuerberatern wird heute schon zusammengearbeitet?",
    "Welche Sprachen außer Deutsch werden angeboten?",
    "Welche Software wird genutzt (DATEV, Lexware, sevDesk …)?",
  ],
  designs: [
    { name: "Ruhig & vertrauensvoll", text: "Helle Flächen, ein klares Blau oder Grün, viel Weißraum, echtes Foto der Person.", pros: ["Wirkt seriös und zugänglich", "Passt zu älteren und jüngeren Mandanten"], cons: ["Kann austauschbar wirken, wenn das Foto fehlt"], score: 4 },
    { name: "Warm & persönlich", text: "Sand-, Terrakotta- oder Beerentöne, Serifenschrift, Arbeitsplatz-Fotos.", pros: ["Hebt sich deutlich von blauen Kanzlei-Seiten ab", "Betont die persönliche Betreuung"], cons: ["Weniger „technisch“, digitale Abläufe extra zeigen"], score: 4 },
    { name: "Klar & digital", text: "Kontrastreich, große Typografie, Schwarz-Weiß mit einer Akzentfarbe.", pros: ["Spricht Gründer und digitale Selbstständige an"], cons: ["Kann auf traditionelle Betriebe kühl wirken"], score: 3 },
  ],
  packages: [
    { name: "Start", text: "Für den Auftritt, der Anfragen bringt.", price: "1.490 €", unit: "einmalig · danach 29 € im Monat", features: ["Website mit 5–6 Seiten", "Mobil optimiert, schnell", "Kontaktformular & Terminbuchung", "Google-Unternehmensprofil eingerichtet", "Impressum & Datenschutz eingebunden"] },
    { name: "Wachstum", text: "Für mehr Sichtbarkeit bei Google.", price: "2.490 €", unit: "einmalig · danach 49 € im Monat", features: ["Alles aus Start", "Preisrechner nach Belegmenge", "Leistungs- und Stadtteilseiten", "Bewertungs-Kit (QR-Karte, Vorlage)", "3 Monate Begleitung bei Google"] },
    { name: "Rundum", text: "Für alles aus einer Hand.", price: "3.990 €", unit: "einmalig · danach 99 € im Monat", features: ["Alles aus Wachstum", "Logo & Markenauftritt", "Fotoshooting-Planung", "Monatliche Pflege & Auswertung", "Anzeigen-Start mit Budgetberatung"] },
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
