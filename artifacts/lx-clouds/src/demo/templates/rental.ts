import type { DemoDoc } from "../types";
import { b, footer, hours, img, meta, town, type TemplateInput } from "./shared";

export function rental(input: TemplateInput): DemoDoc {
  const m = meta(input, "Autovermietung");
  const pic = (name: string) => img("rental", name);
  return {
    meta: m,
    theme: { primary: "#C6F135", mode: "dark", font: "anton", radius: 14, skin: "noir" },
    blocks: [
      b("nav", { links: ["Fahrzeuge", "Vorteile", "So funktioniert's", "Fragen"], cta: "Jetzt buchen" }),
      b("hero", {
        variant: "cover",
        eyebrow: `Premium-Autovermietung in ${town(m)}`,
        title: "Besondere\nMomente\nfahren anders",
        text: "Exklusive Fahrzeuge, faire Preise und eine Buchung, die so schnell geht wie eine Nachricht.",
        primary: "Fahrzeug finden",
        secondary: "",
        image: pic("n-hero"),
        points: ["Premium-Fahrzeuge", "Flexible Abholung", "Rundum versichert"],
        note: "Mehr als mieten.\nEin Gefühl.",
      }),
      b("stats", {
        items: [
          { value: "40+", label: "Fahrzeuge in der Flotte" },
          { value: "3", label: "Standorte in der Region" },
          { value: "5,0", label: "Bewertung bei Google" },
          { value: "24/7", label: "Persönlicher Support" },
        ],
      }),
      b("cards", {
        eyebrow: "Unsere Fahrzeuge",
        title: "Die perfekte Wahl\nfür jede Reise",
        text: "Sportwagen, SUV oder Limousine – unsere handverlesene Flotte bietet für jeden Anlass das passende Fahrzeug.",
        button: "Alle Fahrzeuge ansehen",
        items: [
          { image: pic("n-car1"), tag: "Sportwagen", title: "Porsche 911 Carrera", text: "4 Sitze · 2 Koffer · Automatik", price: "ab 299 € / Tag" },
          { image: pic("n-car2"), tag: "SUV", title: "Mercedes-Benz G-Klasse", text: "5 Sitze · 4 Koffer · Automatik", price: "ab 349 € / Tag" },
          { image: pic("n-car3"), tag: "Coupé", title: "BMW M4 Competition", text: "4 Sitze · 2 Koffer · Automatik", price: "ab 249 € / Tag" },
        ],
      }),
      b("services", {
        eyebrow: "Ihre Vorteile",
        title: "Mehr als nur\neine Autovermietung",
        text: "Erstklassige Fahrzeuge, verbunden mit einem Service, der keine Wünsche offen lässt.",
        button: "Alle Vorteile entdecken",
        items: [
          { icon: "compass", title: "Fahrfreiheit\nohne Grenzen", text: "Ob Wochenendtrip oder große Tour – Sie bestimmen das Ziel.", image: pic("n-pass") },
          { icon: "gem", title: "Exklusive Fahrzeugauswahl", text: "Nur gepflegte Modelle der besten Marken." },
          { icon: "umbrella", title: "Rundum versichert", text: "Vollkasko ist bei jeder Fahrt inklusive." },
          { icon: "pin", title: "Flexible Standorte", text: "Abholung und Rückgabe dort, wo es Ihnen passt." },
          { icon: "star", title: "Transparente Preise", text: "Keine versteckten Kosten. Immer fair und klar." },
          { icon: "users", title: "Persönlicher\nPremium-Service", text: "Unser Team ist rund um die Uhr für Sie da.", image: pic("n-interior") },
        ],
      }),
      b("steps", {
        eyebrow: "So einfach geht's",
        title: "In 3 Schritten\nzur Traumfahrt",
        items: [
          { title: "Fahrzeug wählen", text: "Entdecken Sie die Flotte und finden Sie Ihr Wunschfahrzeug." },
          { title: "Buchung abschließen", text: "Schnell, sicher und flexibel – in wenigen Minuten." },
          { title: "Losfahren & genießen", text: "Schlüssel übernehmen und unvergessliche Momente erleben." },
        ],
      }),
      b("quotes", {
        eyebrow: "Das sagen unsere Kunden",
        title: "Echte Erlebnisse.\nEchte Begeisterung",
        text: "5,0 von 5 bei Google",
        items: [
          { quote: "Vom Buchungsprozess bis zur Rückgabe alles reibungslos. Der 911 war ein Traum – und der Service unglaublich persönlich.", name: "Maximilian K.", role: "Wochenendmiete" },
          { quote: "Die Fahrzeugauswahl ist beeindruckend, die Übergabe am Flughafen hat keine fünf Minuten gedauert. Jederzeit wieder.", name: "Sophie L.", role: "Geschäftsreise" },
          { quote: "Top Fahrzeuge, faire Preise und ein Team, das wirklich mitdenkt. Für uns die erste Wahl.", name: "Daniel M.", role: "Stammkunde" },
        ],
      }),
      b("faq", {
        eyebrow: "Gut zu wissen",
        title: "Häufige\nFragen",
        text: "Die wichtigsten Antworten vor der Buchung. Alles andere klären wir gern persönlich.",
        items: [
          { q: "Welche Unterlagen brauche ich?", a: "Einen gültigen Führerschein und einen Ausweis oder Reisepass." },
          { q: "Gibt es eine Kilometerbegrenzung?", a: "Im Tagespreis sind 250 Kilometer enthalten, Pakete mit mehr Kilometern buchen Sie einfach dazu." },
          { q: "Kann ich ins Ausland fahren?", a: "Ja, nach Absprache sind Fahrten in die Nachbarländer möglich." },
          { q: "Wie läuft die Übergabe ab?", a: "Am Standort, am Flughafen oder direkt vor Ihrer Tür – Sie wählen bei der Buchung." },
        ],
      }),
      b("cta", { eyebrow: "Bereit für die Straße", title: "Bereit für\nIhr nächstes Abenteuer?", text: "Schreiben Sie uns Zeitraum und Wunschmodell – wir melden uns sofort.", button: "Jetzt buchen", image: pic("n-road") }),
      b("contact", { eyebrow: "Kontakt", title: "So erreichen\nSie uns", text: "Am schnellsten geht es per Telefon oder WhatsApp.", hours: hours("08–20 Uhr", "09–18 Uhr", "nach Vereinbarung"), form: true }),
      footer("Exklusive Fahrzeuge. Maximale Freiheit. Mehr als eine Autovermietung."),
    ],
  };
}
