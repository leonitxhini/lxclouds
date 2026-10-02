import type { Block, BlockType, DemoDoc, Meta, Theme } from "./types";

export const uid = () => Math.random().toString(36).slice(2, 9);

type BlockOf<T extends BlockType> = Extract<Block, { type: T }>;
const b = <T extends BlockType>(type: T, props: BlockOf<T>["props"]): Block => ({ id: uid(), type, props }) as Block;

const img = (template: string, name: string) => `/demo-assets/${template}/${name}.webp`;

export type TemplateInput = Partial<Meta> & { company: string };

export type Template = {
  id: string;
  name: string;
  industry: string;
  description: string;
  preview: string;
  build: (input: TemplateInput) => DemoDoc;
};

function meta(input: TemplateInput, industry: string): Meta {
  const slug = input.company
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 18);
  return {
    company: input.company,
    industry,
    city: input.city || "60311 Frankfurt am Main",
    phone: input.phone || "+49 69 123 456 78",
    email: input.email || `info@${slug || "firma"}.de`,
    address: input.address || "Musterstraße 12",
  };
}

const hours = (weekday: string, saturday: string, sunday = "geschlossen") => [
  { day: "Montag – Freitag", time: weekday },
  { day: "Samstag", time: saturday },
  { day: "Sonntag", time: sunday },
];

const town = (m: Meta) => m.city.replace(/^\d+\s*/, "");

const contact = (title: string, text: string, h: { day: string; time: string }[]) => b("contact", { title, text, hours: h, form: true });
const footer = (text: string) => b("footer", { text, links: ["Impressum", "Datenschutz", "Kontakt"] });

// ---------------------------------------------------------------- Autovermietung
function rental(input: TemplateInput): DemoDoc {
  const m = meta(input, "Autovermietung");
  const theme: Theme = { primary: "#2F6BFF", mode: "dark", font: "outfit", radius: 16 };
  return {
    meta: m,
    theme,
    blocks: [
      b("nav", { links: ["Flotte", "Leistungen", "Ablauf", "Fragen", "Kontakt"], cta: "Jetzt anfragen" }),
      b("hero", {
        variant: "cover",
        eyebrow: `Autovermietung in ${town(m)}`,
        title: "Ihr Mietwagen.\nIn Minuten reserviert.",
        text: "Gepflegte Fahrzeuge, faire Preise und eine Buchung, die so schnell geht wie eine Nachricht.",
        primary: "Fahrzeug anfragen",
        secondary: "Flotte ansehen",
        image: img("rental", "hero"),
        points: ["Ohne Kilometerbegrenzung", "Abholung am Flughafen", "Buchung per WhatsApp"],
      }),
      b("stats", { items: [{ value: "40+", label: "Fahrzeuge" }, { value: "24/7", label: "erreichbar" }, { value: "3", label: "Standorte" }, { value: "5,0", label: "Bewertung bei Google" }] }),
      b("cards", {
        title: "Unsere Flotte",
        text: "Vom Kompakten für die Stadt bis zur Limousine für den besonderen Anlass.",
        items: [
          { image: img("rental", "c1"), tag: "Premium", title: "BMW 5er", text: "Automatik · Diesel · 5 Sitze", price: "ab 120 € / Tag" },
          { image: img("rental", "c2"), tag: "SUV", title: "Audi Q8", text: "Automatik · Diesel · 5 Sitze", price: "ab 150 € / Tag" },
          { image: img("rental", "c3"), tag: "Limousine", title: "Mercedes C-Klasse", text: "Automatik · Benzin · 5 Sitze", price: "ab 95 € / Tag" },
          { image: img("rental", "c4"), tag: "Kompakt", title: "VW Golf 8", text: "Automatik · Diesel · 5 Sitze", price: "ab 50 € / Tag" },
          { image: img("rental", "g1"), tag: "Luxus", title: "BMW 7er", text: "Automatik · Diesel · 5 Sitze", price: "ab 220 € / Tag" },
          { image: img("rental", "g2"), tag: "SUV", title: "Audi Q7", text: "Automatik · Diesel · 7 Sitze", price: "ab 140 € / Tag" },
        ],
      }),
      b("services", {
        title: "Alles inklusive, nichts versteckt",
        text: "Was bei uns zum Mietwagen dazugehört.",
        items: [
          { icon: "plane", title: "Flughafentransfer", text: "Wir bringen das Fahrzeug zum Terminal und holen es dort wieder ab." },
          { icon: "shield", title: "Vollkasko inklusive", text: "Jedes Fahrzeug ist umfassend versichert – ohne Aufpreis." },
          { icon: "clock", title: "Rund um die Uhr", text: "Fragen, Pannen, Verlängerung: Wir sind jederzeit erreichbar." },
          { icon: "pin", title: "Flexible Rückgabe", text: "An einem Standort abholen, an einem anderen abgeben." },
          { icon: "calendar", title: "Langzeitmiete", text: "Ab einer Woche wird es deutlich günstiger." },
          { icon: "key", title: "Schnelle Übergabe", text: "Unterschreiben, Schlüssel nehmen, losfahren." },
        ],
      }),
      b("steps", {
        title: "In vier Schritten zum Mietwagen",
        items: [
          { title: "Fahrzeug wählen", text: "Suchen Sie sich das passende Auto aus der Flotte aus." },
          { title: "Zeitraum angeben", text: "Abholung, Rückgabe und Ort – mehr brauchen wir nicht." },
          { title: "Anfrage senden", text: "Sie bekommen innerhalb weniger Minuten eine Bestätigung." },
          { title: "Losfahren", text: "Schlüssel übernehmen und starten." },
        ],
      }),
      b("faq", {
        title: "Häufige Fragen",
        items: [
          { q: "Welche Unterlagen brauche ich?", a: "Einen gültigen Führerschein und einen Ausweis oder Reisepass." },
          { q: "Gibt es eine Kilometerbegrenzung?", a: "Nein, alle Fahrzeuge fahren ohne Limit." },
          { q: "Kann ich ins Ausland fahren?", a: "Ja, nach Absprache sind Fahrten in die Nachbarländer möglich." },
        ],
      }),
      b("cta", { title: "Wann brauchen Sie Ihr Fahrzeug?", text: "Schreiben Sie uns Zeitraum und Wunschmodell – wir melden uns sofort.", button: "Jetzt anfragen" }),
      contact("So erreichen Sie uns", "Am schnellsten geht es per Telefon oder WhatsApp.", hours("08–20 Uhr", "09–18 Uhr", "nach Vereinbarung")),
      footer("Mietwagen ohne Umwege."),
    ],
  };
}

// ---------------------------------------------------------------- Restaurant
function restaurant(input: TemplateInput): DemoDoc {
  const m = meta(input, "Restaurant");
  return {
    meta: m,
    theme: { primary: "#B4532A", mode: "light", font: "playfair", radius: 10 },
    blocks: [
      b("nav", { links: ["Speisekarte", "Über uns", "Galerie", "Kontakt"], cta: "Tisch reservieren" }),
      b("hero", {
        variant: "cover",
        eyebrow: `Restaurant in ${town(m)}`,
        title: "Ehrliche Küche.\nFrisch gekocht.",
        text: "Saisonale Gerichte, hausgemachte Pasta und ein Abend, an den man sich gern erinnert.",
        primary: "Tisch reservieren",
        secondary: "Zur Speisekarte",
        image: img("restaurant", "hero"),
        points: ["Täglich frisch", "Mittagstisch ab 11:30 Uhr", "Auch zum Mitnehmen"],
      }),
      b("about", {
        title: "Mit Liebe zum Detail",
        text: "Seit über zehn Jahren kochen wir mit Zutaten aus der Region und Rezepten, die in der Familie weitergegeben werden. Bei uns kommt nichts aus der Tüte.",
        image: img("restaurant", "about"),
        points: ["Zutaten von Erzeugern aus der Region", "Pasta und Brot aus eigener Herstellung", "Vegetarische und vegane Gerichte"],
        flip: false,
      }),
      b("prices", {
        title: "Aus unserer Karte",
        text: "Eine Auswahl – die ganze Karte gibt es im Restaurant.",
        groups: [
          {
            name: "Vorspeisen",
            items: [
              { name: "Burrata", text: "Tomaten, Basilikum, Olivenöl", price: "12,50 €" },
              { name: "Vitello Tonnato", text: "Kalbfleisch, Thunfischcreme, Kapern", price: "14,00 €" },
              { name: "Tagessuppe", text: "Fragen Sie unser Service-Team", price: "7,50 €" },
            ],
          },
          {
            name: "Hauptgerichte",
            items: [
              { name: "Tagliatelle al Ragù", text: "Hausgemachte Pasta, 6 Stunden geschmort", price: "17,50 €" },
              { name: "Pizza Margherita", text: "San Marzano, Fior di Latte", price: "11,00 €" },
              { name: "Dorade vom Grill", text: "Zitrone, Kräuter, Rosmarinkartoffeln", price: "24,00 €" },
            ],
          },
        ],
      }),
      b("gallery", { title: "Ein Blick in unser Haus", images: [img("restaurant", "g5"), img("restaurant", "g1"), img("restaurant", "g3"), img("restaurant", "g2"), img("restaurant", "g4"), img("restaurant", "g6")] }),
      b("quotes", {
        title: "Das sagen unsere Gäste",
        items: [
          { quote: "Die beste Pasta der Stadt – und ein Service, der sich wirklich Zeit nimmt.", name: "Beispiel-Gast", role: "Bewertung" },
          { quote: "Wir feiern hier jedes Jahr unseren Hochzeitstag. Immer ein schöner Abend.", name: "Beispiel-Gast", role: "Bewertung" },
          { quote: "Unkompliziert, herzlich und richtig lecker.", name: "Beispiel-Gast", role: "Bewertung" },
        ],
      }),
      b("cta", { title: "Reservieren Sie Ihren Tisch", text: "Für heute Abend, das Wochenende oder Ihre Feier.", button: "Tisch reservieren" }),
      contact("Besuchen Sie uns", "Reservierungen nehmen wir telefonisch oder über das Formular entgegen.", hours("11:30–22:30 Uhr", "17–23 Uhr", "12–21 Uhr")),
      footer("Wir freuen uns auf Ihren Besuch."),
    ],
  };
}

// ---------------------------------------------------------------- Handwerk
function craft(input: TemplateInput): DemoDoc {
  const m = meta(input, "Handwerk");
  return {
    meta: m,
    theme: { primary: "#E8590C", mode: "light", font: "grotesk", radius: 12 },
    blocks: [
      b("nav", { links: ["Leistungen", "Referenzen", "Ablauf", "Kontakt"], cta: "Angebot anfordern" }),
      b("hero", {
        variant: "split",
        eyebrow: `Ihr Handwerksbetrieb in ${town(m)}`,
        title: "Sauber geplant.\nSauber gemacht.",
        text: "Renovierung, Sanierung und Reparaturen aus einer Hand – termintreu, zum Festpreis und mit Gewährleistung.",
        primary: "Kostenloses Angebot",
        secondary: "Unsere Leistungen",
        image: img("craft", "hero"),
        points: ["Festpreis-Angebot", "Meisterbetrieb", "Termin in 48 Stunden"],
      }),
      b("stats", { items: [{ value: "15+", label: "Jahre Erfahrung" }, { value: "800+", label: "Projekte" }, { value: "48 h", label: "bis zum Termin" }, { value: "5 J.", label: "Gewährleistung" }] }),
      b("services", {
        title: "Unsere Leistungen",
        text: "Ein Ansprechpartner für alle Gewerke.",
        items: [
          { icon: "droplets", title: "Bad & Sanitär", text: "Vom tropfenden Hahn bis zum komplett neuen Bad." },
          { icon: "zap", title: "Elektro", text: "Installation, Verteiler, Beleuchtung und Smart Home." },
          { icon: "paint", title: "Maler & Lackierer", text: "Wände, Decken und Fassaden – sauber und abgeklebt." },
          { icon: "ruler", title: "Böden", text: "Parkett, Vinyl und Fliesen fachgerecht verlegt." },
          { icon: "hammer", title: "Innenausbau", text: "Trockenbau, Türen und Einbauten nach Maß." },
          { icon: "wrench", title: "Notdienst", text: "Rohrbruch oder Stromausfall? Wir kommen sofort." },
        ],
      }),
      b("gallery", { title: "Referenzen", images: [img("craft", "g2"), img("craft", "g1"), img("craft", "g5"), img("craft", "g3"), img("craft", "g6"), img("craft", "g4")] }),
      b("steps", {
        title: "So läuft Ihr Projekt",
        items: [
          { title: "Anfrage", text: "Sie schildern kurz, was gemacht werden soll." },
          { title: "Besichtigung", text: "Wir schauen es uns vor Ort an – kostenlos." },
          { title: "Festpreis", text: "Sie erhalten ein verbindliches Angebot." },
          { title: "Umsetzung", text: "Pünktlich, sauber und mit Abnahme." },
        ],
      }),
      b("about", {
        title: "Ein Betrieb, auf den Sie sich verlassen können",
        text: "Wir sind ein eingespieltes Team aus Meistern und Gesellen. Sie haben einen festen Ansprechpartner, der Ihr Projekt vom ersten Termin bis zur Abnahme begleitet.",
        image: img("craft", "about"),
        points: ["Eingetragener Meisterbetrieb", "Eigene Fachkräfte, keine Subunternehmer", "Saubere Baustelle, jeden Tag"],
        flip: true,
      }),
      b("faq", {
        title: "Häufige Fragen",
        items: [
          { q: "Was kostet die Besichtigung?", a: "Nichts. Besichtigung und Angebot sind für Sie kostenlos." },
          { q: "Wie schnell können Sie anfangen?", a: "Kleinere Arbeiten oft innerhalb einer Woche, größere Projekte nach Absprache." },
          { q: "Arbeiten Sie auch für Hausverwaltungen?", a: "Ja, wir betreuen Privatkunden, Vermieter und Verwaltungen." },
        ],
      }),
      b("cta", { title: "Was dürfen wir für Sie erledigen?", text: "Beschreiben Sie Ihr Vorhaben – das Angebot kommt innerhalb von zwei Werktagen.", button: "Angebot anfordern" }),
      contact("Kontakt", "Rufen Sie an oder schreiben Sie uns – wir melden uns am selben Tag.", hours("07–17 Uhr", "nach Vereinbarung")),
      footer("Ihr Meisterbetrieb in der Region."),
    ],
  };
}

// ---------------------------------------------------------------- Friseur & Beauty
function beauty(input: TemplateInput): DemoDoc {
  const m = meta(input, "Friseur & Beauty");
  return {
    meta: m,
    theme: { primary: "#C0396B", mode: "light", font: "playfair", radius: 22 },
    blocks: [
      b("nav", { links: ["Behandlungen", "Preise", "Salon", "Kontakt"], cta: "Termin buchen" }),
      b("hero", {
        variant: "split",
        eyebrow: `Ihr Salon in ${town(m)}`,
        title: "Zeit für Sie.\nSchön gemacht.",
        text: "Schnitt, Farbe und Pflege von Menschen, die ihr Handwerk lieben – in einem Salon, in dem man sich wohlfühlt.",
        primary: "Termin buchen",
        secondary: "Preise ansehen",
        image: img("beauty", "hero"),
        points: ["Online-Terminbuchung", "Beratung inklusive", "Auch ohne Termin"],
      }),
      b("cards", {
        title: "Unsere Behandlungen",
        text: "Für jeden Anlass und jeden Typ.",
        items: [
          { image: img("beauty", "c1"), tag: "Herren", title: "Schnitt & Bart", text: "Waschen, schneiden, stylen – inklusive Bartpflege.", price: "ab 32 €" },
          { image: img("beauty", "c2"), tag: "Damen", title: "Schnitt & Föhnen", text: "Typberatung, Schnitt und Styling.", price: "ab 49 €" },
          { image: img("beauty", "c3"), tag: "Nägel", title: "Maniküre", text: "Pflege, Form und Lack oder Gel.", price: "ab 35 €" },
          { image: img("beauty", "c4"), tag: "Make-up", title: "Tages- & Abend-Make-up", text: "Für Fotos, Feste und Hochzeiten.", price: "ab 55 €" },
        ],
      }),
      b("prices", {
        title: "Preise",
        text: "Alle Preise inklusive Beratung und Pflege.",
        groups: [
          {
            name: "Haare",
            items: [
              { name: "Waschen, Schneiden, Föhnen", text: "Damen", price: "ab 49 €" },
              { name: "Herrenschnitt", text: "inkl. Waschen", price: "ab 28 €" },
              { name: "Farbe / Tönung", text: "je nach Länge", price: "ab 45 €" },
              { name: "Balayage", text: "inkl. Glossing", price: "ab 120 €" },
            ],
          },
          {
            name: "Beauty",
            items: [
              { name: "Maniküre", text: "klassisch", price: "35 €" },
              { name: "Gel-Nägel", text: "Neumodellage", price: "65 €" },
              { name: "Augenbrauen", text: "zupfen & färben", price: "22 €" },
              { name: "Braut-Styling", text: "inkl. Probetermin", price: "ab 180 €" },
            ],
          },
        ],
      }),
      b("about", {
        title: "Ein Team, das zuhört",
        text: "Bevor die Schere zum Einsatz kommt, nehmen wir uns Zeit für Ihre Wünsche. So gehen Sie mit einem Ergebnis nach Hause, das zu Ihnen passt.",
        image: img("beauty", "about"),
        points: ["Ausgebildete Meisterinnen und Stylisten", "Hochwertige Pflegeprodukte", "Regelmäßige Weiterbildungen"],
        flip: false,
      }),
      b("gallery", { title: "Unser Salon", images: [img("beauty", "g2"), img("beauty", "g1"), img("beauty", "c2")] }),
      b("cta", { title: "Lust auf Veränderung?", text: "Buchen Sie Ihren Termin – online oder telefonisch.", button: "Termin buchen" }),
      contact("Termin & Kontakt", "Termine vergeben wir telefonisch, per Nachricht oder direkt im Salon.", hours("09–19 Uhr", "09–16 Uhr")),
      footer("Schön, dass Sie da sind."),
    ],
  };
}

// ---------------------------------------------------------------- Praxis
function clinic(input: TemplateInput): DemoDoc {
  const m = meta(input, "Praxis");
  return {
    meta: m,
    theme: { primary: "#0EA5E9", mode: "light", font: "inter", radius: 16 },
    blocks: [
      b("nav", { links: ["Leistungen", "Praxis", "Ablauf", "Fragen", "Kontakt"], cta: "Termin vereinbaren" }),
      b("hero", {
        variant: "split",
        eyebrow: `Zahnarztpraxis in ${town(m)}`,
        title: "Gut aufgehoben.\nVom ersten Termin an.",
        text: "Moderne Zahnmedizin in ruhiger Atmosphäre – mit Zeit für Ihre Fragen und Behandlungen, die verständlich erklärt werden.",
        primary: "Termin vereinbaren",
        secondary: "Unsere Leistungen",
        image: img("clinic", "hero"),
        points: ["Termine auch kurzfristig", "Alle Kassen und privat", "Barrierefreier Zugang"],
      }),
      b("services", {
        title: "Unsere Leistungen",
        text: "Vorsorge, Behandlung und Ästhetik unter einem Dach.",
        items: [
          { icon: "shield", title: "Vorsorge", text: "Kontrolle und professionelle Zahnreinigung." },
          { icon: "smile", title: "Ästhetik", text: "Bleaching, Veneers und unsichtbare Schienen." },
          { icon: "stethoscope", title: "Zahnerhalt", text: "Füllungen und Wurzelbehandlungen mit moderner Technik." },
          { icon: "sparkles", title: "Implantate", text: "Fester Zahnersatz, sorgfältig geplant." },
          { icon: "heart", title: "Angstpatienten", text: "Behutsame Behandlung, auf Wunsch mit Sedierung." },
          { icon: "users", title: "Kinder", text: "Spielerisch und ohne Angst zum Zahnarzt." },
        ],
      }),
      b("about", {
        title: "Ihre Praxis",
        text: "Unser Team nimmt sich Zeit. Wir erklären jeden Schritt, besprechen Alternativen und Kosten vorab – damit Sie entspannt entscheiden können.",
        image: img("clinic", "about"),
        points: ["Digitale Diagnostik mit geringer Strahlung", "Transparente Kostenpläne", "Erinnerung an Ihre Vorsorgetermine"],
        flip: true,
      }),
      b("gallery", { title: "Ein Blick in die Praxis", images: [img("clinic", "g3"), img("clinic", "g1"), img("clinic", "g2")] }),
      b("steps", {
        title: "Ihr erster Besuch",
        items: [
          { title: "Termin", text: "Telefonisch oder online – oft schon in derselben Woche." },
          { title: "Kennenlernen", text: "Wir besprechen Ihre Anliegen in Ruhe." },
          { title: "Untersuchung", text: "Gründlich und mit verständlicher Erklärung." },
          { title: "Behandlungsplan", text: "Mit klaren Schritten und Kosten." },
        ],
      }),
      b("faq", {
        title: "Häufige Fragen",
        items: [
          { q: "Nehmen Sie neue Patienten auf?", a: "Ja, wir freuen uns über neue Patientinnen und Patienten." },
          { q: "Was tun bei Zahnschmerzen?", a: "Rufen Sie an – Schmerzpatienten bekommen noch am selben Tag einen Termin." },
          { q: "Welche Kassen akzeptieren Sie?", a: "Alle gesetzlichen Kassen und Privatversicherungen." },
        ],
      }),
      b("cta", { title: "Wann dürfen wir Sie begrüßen?", text: "Vereinbaren Sie Ihren Termin telefonisch oder über das Formular.", button: "Termin vereinbaren" }),
      contact("Sprechzeiten & Kontakt", "Für Notfälle erreichen Sie uns auch außerhalb der Sprechzeiten.", hours("08–18 Uhr", "nach Vereinbarung")),
      footer("Ihre Gesundheit in guten Händen."),
    ],
  };
}

// ---------------------------------------------------------------- Immobilien
function realestate(input: TemplateInput): DemoDoc {
  const m = meta(input, "Immobilien");
  return {
    meta: m,
    theme: { primary: "#0F766E", mode: "light", font: "playfair", radius: 8 },
    blocks: [
      b("nav", { links: ["Objekte", "Leistungen", "Über uns", "Kontakt"], cta: "Bewertung anfragen" }),
      b("hero", {
        variant: "cover",
        eyebrow: `Immobilien in ${town(m)} und Umgebung`,
        title: "Das richtige Zuhause.\nDer richtige Preis.",
        text: "Wir begleiten Verkauf, Kauf und Vermietung – persönlich, diskret und mit genauer Kenntnis des lokalen Markts.",
        primary: "Immobilie bewerten lassen",
        secondary: "Aktuelle Objekte",
        image: img("realestate", "hero"),
        points: ["Kostenlose Wertermittlung", "Geprüfte Interessenten", "Ein fester Ansprechpartner"],
      }),
      b("stats", { items: [{ value: "320+", label: "vermittelte Objekte" }, { value: "12", label: "Jahre am Markt" }, { value: "38 Tage", label: "bis zum Verkauf" }, { value: "98 %", label: "Weiterempfehlung" }] }),
      b("cards", {
        title: "Aktuelle Objekte",
        text: "Eine Auswahl aus unserem Angebot.",
        items: [
          { image: img("realestate", "c1"), tag: "Kauf", title: "Stadthaus mit Garten", text: "5 Zimmer · 168 m² · Baujahr 2019", price: "689.000 €" },
          { image: img("realestate", "c2"), tag: "Kauf", title: "Neubau-Wohnung", text: "3 Zimmer · 92 m² · Balkon", price: "415.000 €" },
          { image: img("realestate", "c3"), tag: "Miete", title: "Loft im Zentrum", text: "2 Zimmer · 74 m² · möbliert", price: "1.450 € / Monat" },
          { image: img("realestate", "c4"), tag: "Kauf", title: "Villa am Stadtrand", text: "7 Zimmer · 280 m² · Pool", price: "1.250.000 €" },
        ],
      }),
      b("services", {
        title: "Was wir für Sie tun",
        text: "Vom ersten Gespräch bis zum Notartermin.",
        items: [
          { icon: "chart", title: "Wertermittlung", text: "Ein realistischer Marktpreis auf Basis aktueller Verkäufe." },
          { icon: "camera", title: "Vermarktung", text: "Professionelle Fotos, Exposé und Reichweite auf allen Portalen." },
          { icon: "users", title: "Besichtigungen", text: "Wir prüfen Interessenten und führen alle Termine durch." },
          { icon: "briefcase", title: "Verhandlung", text: "Wir verhandeln in Ihrem Sinne und sichern den besten Preis." },
          { icon: "check", title: "Abwicklung", text: "Kaufvertrag, Notar und Übergabe – wir kümmern uns." },
          { icon: "house", title: "Vermietung", text: "Solvente Mieter und rechtssichere Verträge." },
        ],
      }),
      b("about", {
        title: "Persönlich statt anonym",
        text: "Wir kennen die Lagen, die Preise und die Menschen hier. Deshalb beraten wir ehrlich – auch wenn das bedeutet, zu einem späteren Verkauf zu raten.",
        image: img("realestate", "about"),
        points: ["Inhabergeführt und unabhängig", "Zertifizierte Immobilienbewertung", "Provision nur bei Erfolg"],
        flip: false,
      }),
      b("gallery", { title: "Einblicke", images: [img("realestate", "g3"), img("realestate", "g1"), img("realestate", "g2")] }),
      b("cta", { title: "Was ist Ihre Immobilie wert?", text: "Die Bewertung ist kostenlos und unverbindlich.", button: "Bewertung anfragen" }),
      contact("Sprechen wir", "Wir melden uns innerhalb eines Werktags.", hours("09–18 Uhr", "10–14 Uhr")),
      footer("Ihr Makler vor Ort."),
    ],
  };
}

// ---------------------------------------------------------------- Shop
function shop(input: TemplateInput): DemoDoc {
  const m = meta(input, "Shop");
  return {
    meta: m,
    theme: { primary: "#111827", mode: "light", font: "grotesk", radius: 6 },
    blocks: [
      b("nav", { links: ["Neu", "Bestseller", "Über uns", "Kontakt"], cta: "Zum Shop" }),
      b("hero", {
        variant: "split",
        eyebrow: "Neue Kollektion",
        title: "Stücke, die bleiben.",
        text: "Ausgewählte Mode und Accessoires – gut gemacht, fair kalkuliert und in zwei Tagen bei Ihnen.",
        primary: "Jetzt entdecken",
        secondary: "Bestseller",
        image: img("shop", "hero"),
        points: ["Kostenloser Versand ab 50 €", "30 Tage Rückgabe", "Sicher bezahlen"],
      }),
      b("cards", {
        title: "Bestseller",
        text: "Was gerade am häufigsten bestellt wird.",
        items: [
          { image: img("shop", "c1"), tag: "Sneaker", title: "Runner One", text: "Leicht, bequem, in vier Farben.", price: "129 €" },
          { image: img("shop", "c2"), tag: "Taschen", title: "City Bag", text: "Echtes Leder, handgenäht.", price: "189 €" },
          { image: img("shop", "c3"), tag: "Uhren", title: "Classic Gold", text: "Edelstahl, Saphirglas.", price: "249 €" },
          { image: img("shop", "c4"), tag: "Accessoires", title: "Sonnenbrille Havana", text: "UV 400, inklusive Etui.", price: "79 €" },
          { image: img("shop", "c5"), tag: "Taschen", title: "Satchel Grey", text: "Platz für Laptop und Alltag.", price: "159 €" },
          { image: img("shop", "c6"), tag: "Uhren", title: "Chrono Sport", text: "Chronograph mit Lederband.", price: "219 €" },
        ],
      }),
      b("services", {
        title: "Einkaufen ohne Risiko",
        text: "",
        items: [
          { icon: "truck", title: "Schneller Versand", text: "Bis 14 Uhr bestellt, am selben Tag verschickt." },
          { icon: "check", title: "30 Tage Rückgabe", text: "Passt nicht? Kostenlos zurückschicken." },
          { icon: "card", title: "Sichere Zahlung", text: "Karte, PayPal, Klarna und Rechnung." },
        ],
      }),
      b("about", {
        title: "Klein, persönlich, mit Anspruch",
        text: "Wir sind kein Konzern. Jedes Produkt im Shop haben wir selbst ausgesucht und getestet – und wenn Sie eine Frage haben, antwortet ein Mensch.",
        image: img("shop", "about"),
        points: ["Ausgewählte Hersteller", "Persönliche Beratung per Chat und Telefon", "Versand in recycelter Verpackung"],
        flip: true,
      }),
      b("quotes", {
        title: "Kundenstimmen",
        items: [
          { quote: "Schnelle Lieferung und die Qualität ist besser als auf den Fotos.", name: "Beispiel-Kundin", role: "Bewertung" },
          { quote: "Rückgabe hat problemlos funktioniert. Bestelle wieder.", name: "Beispiel-Kunde", role: "Bewertung" },
          { quote: "Tolle Beratung per Chat, genau das Richtige gefunden.", name: "Beispiel-Kundin", role: "Bewertung" },
        ],
      }),
      b("cta", { title: "10 % auf die erste Bestellung", text: "Melden Sie sich zum Newsletter an und sichern Sie sich Ihren Gutschein.", button: "Gutschein sichern" }),
      contact("Fragen zur Bestellung?", "Unser Kundenservice hilft gern weiter.", hours("09–18 Uhr", "10–14 Uhr")),
      footer("Gut ausgesucht. Schnell geliefert."),
    ],
  };
}

// ---------------------------------------------------------------- Dienstleister
function service(input: TemplateInput): DemoDoc {
  const m = meta(input, "Dienstleistung");
  return {
    meta: m,
    theme: { primary: "#6865FF", mode: "light", font: "outfit", radius: 18 },
    blocks: [
      b("nav", { links: ["Leistungen", "Über uns", "Ablauf", "Fragen", "Kontakt"], cta: "Erstgespräch" }),
      b("hero", {
        variant: "center",
        eyebrow: `Beratung aus ${town(m)}`,
        title: "Weniger Aufwand.\nMehr Ergebnis.",
        text: "Wir nehmen Ihnen ab, was Zeit kostet – zuverlässig, verständlich und mit einem festen Ansprechpartner.",
        primary: "Kostenloses Erstgespräch",
        secondary: "Leistungen ansehen",
        image: img("service", "hero"),
        points: ["Antwort innerhalb von 24 Stunden", "Feste Preise", "Monatlich kündbar"],
      }),
      b("stats", { items: [{ value: "250+", label: "Kunden" }, { value: "10", label: "Jahre Erfahrung" }, { value: "24 h", label: "Reaktionszeit" }, { value: "4,9", label: "Bewertung" }] }),
      b("services", {
        title: "Was wir für Sie übernehmen",
        text: "Wählen Sie, was Sie brauchen – wir kümmern uns um den Rest.",
        items: [
          { icon: "briefcase", title: "Beratung", text: "Eine klare Analyse und konkrete nächste Schritte." },
          { icon: "chart", title: "Planung", text: "Ziele, Zahlen und ein realistischer Zeitplan." },
          { icon: "users", title: "Umsetzung", text: "Wir setzen um – Sie behalten den Überblick." },
          { icon: "shield", title: "Betreuung", text: "Laufende Begleitung mit festen Ansprechpartnern." },
          { icon: "zap", title: "Digitalisierung", text: "Abläufe, die heute Papier brauchen, laufen morgen automatisch." },
          { icon: "check", title: "Qualität", text: "Dokumentiert, nachvollziehbar, geprüft." },
        ],
      }),
      b("about", {
        title: "Wir arbeiten so, wie wir selbst betreut werden möchten",
        text: "Kein Fachchinesisch, keine versteckten Kosten. Sie wissen jederzeit, woran wir arbeiten, was es kostet und was als Nächstes passiert.",
        image: img("service", "about"),
        points: ["Ein fester Ansprechpartner", "Transparente Monatsberichte", "Erreichbar, wenn es darauf ankommt"],
        flip: false,
      }),
      b("steps", {
        title: "So starten wir",
        items: [
          { title: "Erstgespräch", text: "30 Minuten, kostenlos und unverbindlich." },
          { title: "Angebot", text: "Schriftlich, mit festem Preis." },
          { title: "Start", text: "Innerhalb einer Woche legen wir los." },
          { title: "Begleitung", text: "Regelmäßige Abstimmung und Berichte." },
        ],
      }),
      b("quotes", {
        title: "Das sagen unsere Kunden",
        items: [
          { quote: "Endlich jemand, der einfach macht und sich meldet, bevor wir nachfragen müssen.", name: "Beispiel-Kunde", role: "Geschäftsführer" },
          { quote: "Wir sparen jede Woche mehrere Stunden. Die Zusammenarbeit ist unkompliziert.", name: "Beispiel-Kundin", role: "Inhaberin" },
          { quote: "Klare Aussagen, faire Preise, verlässliche Termine.", name: "Beispiel-Kunde", role: "Leiter Verwaltung" },
        ],
      }),
      b("faq", {
        title: "Häufige Fragen",
        items: [
          { q: "Was kostet das Erstgespräch?", a: "Nichts. Es ist kostenlos und unverbindlich." },
          { q: "Wie lange läuft der Vertrag?", a: "Sie können monatlich kündigen." },
          { q: "Arbeiten Sie auch vor Ort?", a: "Ja, in der Region kommen wir gern zu Ihnen." },
        ],
      }),
      b("cta", { title: "Lernen wir uns kennen", text: "Ein kurzes Gespräch zeigt, ob wir zusammenpassen.", button: "Erstgespräch vereinbaren" }),
      contact("Kontakt", "Schreiben Sie uns – wir melden uns innerhalb von 24 Stunden.", hours("09–18 Uhr", "geschlossen")),
      footer("Ihr Partner für das Tagesgeschäft."),
    ],
  };
}

export const templates: Template[] = [
  { id: "rental", name: "Autovermietung", industry: "Autovermietung", description: "Dunkler Premium-Auftritt mit Flotte, Preisen und Buchungsanfrage.", preview: img("rental", "hero"), build: rental },
  { id: "restaurant", name: "Restaurant", industry: "Gastronomie", description: "Stimmungsvoller Auftritt mit Speisekarte, Galerie und Reservierung.", preview: img("restaurant", "hero"), build: restaurant },
  { id: "craft", name: "Handwerk", industry: "Handwerk", description: "Leistungen, Referenzen und Angebotsanfrage für Handwerksbetriebe.", preview: img("craft", "hero"), build: craft },
  { id: "beauty", name: "Friseur & Beauty", industry: "Friseur & Beauty", description: "Eleganter Salon-Auftritt mit Behandlungen, Preisliste und Terminbuchung.", preview: img("beauty", "hero"), build: beauty },
  { id: "clinic", name: "Praxis", industry: "Gesundheit", description: "Ruhiger, vertrauenswürdiger Auftritt für Arzt- und Zahnarztpraxen.", preview: img("clinic", "hero"), build: clinic },
  { id: "realestate", name: "Immobilien", industry: "Immobilien", description: "Objekte, Leistungen und Wertermittlung für Makler.", preview: img("realestate", "hero"), build: realestate },
  { id: "shop", name: "Shop", industry: "Handel", description: "Produkte mit Preisen, Vorteilen und Kundenstimmen.", preview: img("shop", "hero"), build: shop },
  { id: "service", name: "Dienstleister", industry: "Dienstleistung", description: "Universeller Auftritt für Berater, Agenturen und Dienstleister.", preview: img("service", "hero"), build: service },
];

export const getTemplate = (id: string) => templates.find((t) => t.id === id);

const names = (...list: string[]) => ["hero", "about", ...list];
/** The photos that ship with the templates, for the image picker's library. */
export const stockImages: { label: string; images: string[] }[] = [
  { label: "Autovermietung", images: names("c1", "c2", "c3", "c4", "g1", "g2").map((n) => img("rental", n)) },
  { label: "Restaurant", images: names("g1", "g2", "g3", "g4", "g5", "g6").map((n) => img("restaurant", n)) },
  { label: "Handwerk", images: names("g1", "g2", "g3", "g4", "g5", "g6").map((n) => img("craft", n)) },
  { label: "Friseur & Beauty", images: names("c1", "c2", "c3", "c4", "g1", "g2").map((n) => img("beauty", n)) },
  { label: "Praxis", images: names("g1", "g2", "g3", "g4").map((n) => img("clinic", n)) },
  { label: "Immobilien", images: names("c1", "c2", "c3", "c4", "g1", "g2", "g3").map((n) => img("realestate", n)) },
  { label: "Shop", images: names("c1", "c2", "c3", "c4", "c5", "c6").map((n) => img("shop", n)) },
  { label: "Dienstleister", images: names("g1", "g2", "g3", "g4").map((n) => img("service", n)) },
];

/** A fresh block of the given type with neutral starter content, for "add section". */
export function blankBlock(type: BlockType): Block {
  switch (type) {
    case "nav":
      return b("nav", { links: ["Leistungen", "Über uns", "Kontakt"], cta: "Kontakt" });
    case "hero":
      return b("hero", { variant: "split", eyebrow: "Kurzzeile", title: "Ihre Überschrift", text: "Ein Satz, der erklärt, worum es geht.", primary: "Jetzt anfragen", secondary: "", image: "", points: ["Vorteil eins", "Vorteil zwei"] });
    case "stats":
      return b("stats", { items: [{ value: "100+", label: "Kunden" }, { value: "10", label: "Jahre" }, { value: "24 h", label: "Reaktionszeit" }] });
    case "services":
      return b("services", { title: "Leistungen", text: "Was wir anbieten.", items: [{ icon: "star", title: "Leistung", text: "Kurze Beschreibung." }, { icon: "check", title: "Leistung", text: "Kurze Beschreibung." }, { icon: "zap", title: "Leistung", text: "Kurze Beschreibung." }] });
    case "cards":
      return b("cards", { title: "Angebote", text: "", items: [{ image: "", tag: "Neu", title: "Eintrag", text: "Beschreibung", price: "ab 0 €" }, { image: "", tag: "Neu", title: "Eintrag", text: "Beschreibung", price: "ab 0 €" }, { image: "", tag: "Neu", title: "Eintrag", text: "Beschreibung", price: "ab 0 €" }] });
    case "about":
      return b("about", { title: "Über uns", text: "Ein paar Sätze über das Unternehmen.", image: "", points: ["Punkt eins", "Punkt zwei"], flip: false });
    case "prices":
      return b("prices", { title: "Preise", text: "", groups: [{ name: "Gruppe", items: [{ name: "Eintrag", text: "", price: "0 €" }, { name: "Eintrag", text: "", price: "0 €" }] }] });
    case "gallery":
      return b("gallery", { title: "Galerie", images: ["", "", ""] });
    case "steps":
      return b("steps", { title: "So funktioniert es", items: [{ title: "Schritt eins", text: "Beschreibung." }, { title: "Schritt zwei", text: "Beschreibung." }, { title: "Schritt drei", text: "Beschreibung." }] });
    case "quotes":
      return b("quotes", { title: "Kundenstimmen", items: [{ quote: "Hier steht eine Kundenstimme.", name: "Name", role: "Kunde" }] });
    case "faq":
      return b("faq", { title: "Häufige Fragen", items: [{ q: "Eine Frage?", a: "Die Antwort." }] });
    case "cta":
      return b("cta", { title: "Bereit?", text: "Ein Satz, der zum Handeln einlädt.", button: "Jetzt anfragen" });
    case "contact":
      return b("contact", { title: "Kontakt", text: "So erreichen Sie uns.", hours: hours("09–18 Uhr", "geschlossen"), form: true });
    case "footer":
      return b("footer", { text: "", links: ["Impressum", "Datenschutz"] });
  }
}

export const blockLabels: Record<BlockType, string> = {
  nav: "Navigation",
  hero: "Hero",
  stats: "Kennzahlen",
  services: "Leistungen",
  cards: "Karten mit Bild",
  about: "Über uns",
  prices: "Preisliste",
  gallery: "Galerie",
  steps: "Ablauf",
  quotes: "Kundenstimmen",
  faq: "Fragen",
  cta: "Aufruf",
  contact: "Kontakt",
  footer: "Fußzeile",
};
