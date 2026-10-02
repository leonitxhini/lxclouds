import type { DemoDoc } from "../types";
import { b, footer, hours, img, meta, town, type TemplateInput } from "./shared";

export function service(input: TemplateInput): DemoDoc {
  const m = meta(input, "Beratung");
  return {
    meta: m,
    theme: { primary: "#5B4BFF", mode: "light", font: "inter", radius: 18, skin: "klar" },
    blocks: [
      b("nav", { links: ["Leistungen", "Vorgehen", "Preise", "Kunden", "FAQ"], cta: "Erstgespräch buchen" }),
      b("hero", {
        variant: "split",
        eyebrow: `Unternehmensberatung in ${town(m)}`,
        title: "Klarheit schafft\nFreiraum.",
        text: "Wir beraten Unternehmerinnen und Unternehmer in Finanz-, Strategie- und Prozessfragen – für gesunde Zahlen und mehr Zeit für das eigene Geschäft.",
        primary: "Erstgespräch buchen",
        secondary: "Mehr erfahren",
        image: "",
        points: ["Kostenloses Erstgespräch", "Feste Ansprechperson", "Antwort in 24 Stunden"],
        note: "Mehr Zeit\nfür das, was\nwirklich zählt.",
      }),
      b("services", {
        eyebrow: "Unsere Leistungen",
        title: "Ganzheitliche Beratung\nfür nachhaltigen Erfolg.",
        text: "Finanzen, Strategie und smarte Prozesse – alles aus einer Hand. Wir verbinden Fachwissen mit unternehmerischem Denken.",
        // per entry: first line = short description, further lines = checklist
        items: [
          { icon: "chart", title: "Finanzen & Steuern", text: "Strategisch. Digital. Persönlich.\nJahresabschluss und laufende Auswertungen\nLiquiditätsplanung\nVorbereitung von Bankgesprächen" },
          { icon: "compass", title: "Unternehmensberatung", text: "Klare Strategie. Messbare Ergebnisse.\nGeschäfts- und Finanzstrategie\nProzessoptimierung\nBegleitung bei Wachstum und Finanzierung" },
          { icon: "database", title: "Digitale Prozesse", text: "Effizient. Sicher. Zukunftsfähig.\nDigitale Buchhaltung\nAutomatisierte Berichte\nAuswahl und Einführung von Software" },
          { icon: "rocket", title: "Gründungsberatung", text: "Von der Idee zum tragfähigen Unternehmen.\nWahl der Rechtsform\nBusinessplan und Finanzierung\nBehördengänge und Anmeldung" },
          { icon: "handshake", title: "Nachfolge & Übergabe", text: "Gut vorbereitet in die nächste Generation.\nBewertung des Unternehmens\nFahrplan für die Übergabe\nBegleitung der Gespräche" },
        ],
      }),
      b("steps", {
        eyebrow: "So arbeiten wir",
        title: "Ein klarer Prozess.\nMaximaler Mehrwert.",
        text: "Strukturiert, transparent und immer auf Augenhöhe. So wird aus Beratung echter Fortschritt.",
        items: [
          { title: "Erstgespräch", text: "Wir lernen uns kennen und verstehen Ihre Ziele." },
          { title: "Analyse", text: "Wir sehen uns Ihre Situation an und benennen die Hebel." },
          { title: "Strategie", text: "Sie bekommen einen Plan, der zu Ihrem Unternehmen passt." },
          { title: "Umsetzung", text: "Wir begleiten Sie aktiv – bis die Ergebnisse messbar sind." },
        ],
      }),
      // the first entry is the headline of the band
      b("stats", {
        items: [
          { value: "Vertrauen,\ndas Zahlen spricht.", label: `${m.company} in Zahlen` },
          { value: "120+", label: "betreute Unternehmen" },
          { value: "12", label: "Jahre Erfahrung" },
          { value: "24 h", label: "Reaktionszeit" },
          { value: "4,9 / 5", label: "Bewertung bei Google" },
        ],
      }),
      b("quotes", {
        title: "Kundenstimmen",
        text: "4,9 von 5",
        items: [
          { quote: "„Endlich ein Partner, der mitdenkt. Beratung auf Augenhöhe – proaktiv, digital und immer mit Blick aufs große Ganze.“", name: "Daniel K.", role: "Geschäftsführer, Softwareunternehmen", image: img("service", "n-portrait") },
          { quote: "„Wir sparen jede Woche mehrere Stunden. Die Zahlen sind aktuell, und wir wissen jederzeit, wo wir stehen.“", name: "Miriam S.", role: "Inhaberin, Handelsunternehmen" },
          { quote: "„Klare Aussagen, faire Preise, verlässliche Termine. Genau so stellt man sich Zusammenarbeit vor.“", name: "Thomas B.", role: "Geschäftsführer, Handwerksbetrieb" },
        ],
      }),
      b("prices", {
        eyebrow: "Unsere Pakete",
        title: "Transparente Preise.\nKlare Leistungen.",
        text: "Unsere Pakete sind auf unterschiedliche Bedürfnisse zugeschnitten. Individuelle Lösungen sind jederzeit möglich.",
        groups: [
          {
            name: "Basis",
            text: "Für Selbstständige und Start-ups.",
            price: "299 €",
            items: [
              { name: "Laufende Beratung", text: "", price: "" },
              { name: "Jahresauswertung", text: "", price: "" },
              { name: "Digitale Belegablage", text: "", price: "" },
              { name: "Support per E-Mail", text: "", price: "" },
            ],
          },
          {
            name: "Wachstum",
            text: "Für wachsende Unternehmen.",
            price: "599 €",
            featured: true,
            items: [
              { name: "Alle Leistungen aus Basis", text: "", price: "" },
              { name: "Strategiegespräch pro Quartal", text: "", price: "" },
              { name: "Finanz- und Liquiditätsplanung", text: "", price: "" },
              { name: "Bevorzugte Bearbeitung", text: "", price: "" },
            ],
          },
          {
            name: "Premium",
            text: "Für etablierte Unternehmen.",
            price: "1.199 €",
            items: [
              { name: "Alle Leistungen aus Wachstum", text: "", price: "" },
              { name: "Individuelle Strategie-Workshops", text: "", price: "" },
              { name: "Monatliche Auswertungen", text: "", price: "" },
              { name: "Persönliche Ansprechperson", text: "", price: "" },
            ],
          },
        ],
      }),
      b("faq", {
        eyebrow: "FAQ",
        title: "Häufige Fragen.\nSchnelle Antworten.",
        text: "Ihre Frage ist nicht dabei? Schreiben Sie uns – wir antworten innerhalb eines Werktags.",
        items: [
          { q: "Wie läuft das erste Gespräch ab?", a: "Das Erstgespräch ist kostenlos und unverbindlich. Wir sprechen etwa 30 Minuten per Videocall über Ihre Situation, Ihre Ziele und darüber, wie wir Sie am besten unterstützen können." },
          { q: "Welche Unterlagen benötige ich?", a: "Für das Erstgespräch keine. Danach bekommen Sie eine kurze Liste – das meiste lässt sich digital hochladen." },
          { q: "Können Sie eine laufende Betreuung übernehmen?", a: "Ja. Den Wechsel organisieren wir für Sie, inklusive der Abstimmung mit Ihrer bisherigen Beratung." },
          { q: "Wie lange läuft der Vertrag?", a: "Alle Pakete sind monatlich kündbar." },
        ],
      }),
      b("cta", { eyebrow: "Bereit für den nächsten Schritt?", title: "Lassen Sie uns gemeinsam\nPotenziale freisetzen.", text: "Vereinbaren Sie jetzt ein kostenloses Erstgespräch und erfahren Sie, wie wir Ihr Unternehmen voranbringen.", button: "Erstgespräch buchen" }),
      b("contact", { eyebrow: "Kontakt", title: "Sprechen wir\nüber Ihr Vorhaben.", text: "Per Telefon, E-Mail oder direkt über das Formular – Sie erreichen immer eine feste Ansprechperson.", hours: hours("09–18 Uhr", "nach Vereinbarung"), form: true }),
      footer("Beratung mit Klarheit: Finanzen, Strategie und Prozesse aus einer Hand."),
    ],
  };
}
