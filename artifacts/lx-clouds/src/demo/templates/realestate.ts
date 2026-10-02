import type { DemoDoc } from "../types";
import { b, footer, hours, img, meta, town, type TemplateInput } from "./shared";

export function realestate(input: TemplateInput): DemoDoc {
  const m = meta(input, "Immobilien");
  const pic = (name: string) => img("realestate", name);
  return {
    meta: m,
    theme: { primary: "#9A6B43", mode: "light", font: "cormorant", radius: 4, skin: "linden" },
    blocks: [
      b("nav", { links: ["Immobilien", "Verkaufen", "Services", "Über uns", "Ratgeber"], cta: "Kontakt" }),
      b("hero", {
        variant: "cover",
        eyebrow: "Exklusive Immobilien\nfür besondere Lebensentwürfe",
        title: "Mehr als\nein Zuhause.",
        text: "Werte. Wohnkultur. Lebensqualität.",
        primary: "Objekte finden",
        secondary: "",
        image: pic("n-hero"),
        points: [],
        note: "Außergewöhnliche\nImmobilien.\nAußergewöhnliche\nMenschen.",
      }),
      b("stats", {
        items: [
          { value: "320+", label: "Verkaufte Immobilien" },
          { value: "€ 410 Mio.", label: "Vermitteltes Volumen" },
          { value: "98 %", label: "Zufriedene Kunden" },
          { value: "15+", label: "Jahre Erfahrung" },
        ],
      }),
      b("cards", {
        title: "Ausgewählte Immobilien",
        text: "",
        button: "Alle Immobilien ansehen",
        items: [
          { image: pic("n-villa"), tag: `${town(m)}, Hanglage`, title: "Architektenvilla mit Seeblick", text: "Villa · 8 Zimmer · 280 m²", price: "€ 4.950.000" },
          { image: pic("n-penthouse"), tag: `${town(m)}, Zentrum`, title: "Penthouse mit Panoramablick", text: "Penthouse · 4 Zimmer · 185 m²", price: "€ 2.850.000" },
          { image: pic("n-house"), tag: `${town(m)}, Stadtrand`, title: "Zeitlose Eleganz in Bestlage", text: "Einfamilienhaus · 5 Zimmer · 240 m²", price: "€ 3.600.000" },
        ],
      }),
      b("about", {
        eyebrow: "Ihre Immobilie.\nIhr nächstes Kapitel.",
        title: "Immobilie\nverkaufen.",
        text: "Wir begleiten Sie mit Erfahrung, Diskretion und einem Netzwerk aus geprüften Kaufinteressenten zum bestmöglichen Ergebnis.",
        image: pic("n-terrace"),
        points: [],
        flip: false,
        button: "Mehr zum Verkauf",
        note: "Kostenlose Wertermittlung",
      }),
      b("services", {
        title: "Unsere Services",
        text: "",
        button: "Mehr erfahren",
        items: [
          { icon: "gem", title: "Kauf & Vermittlung", text: "Exklusive Immobilien und persönliche Beratung." },
          { icon: "chart", title: "Verkauf", text: "Professionelle Vermarktung mit maximaler Reichweite." },
          { icon: "users", title: "Investment", text: "Zugang zu ausgewählten Anlageimmobilien." },
          { icon: "house", title: "Beratung", text: "Individuelle Strategien für Ihre Immobilienziele." },
        ],
      }),
      b("team", {
        eyebrow: "Menschen machen\nden Unterschied",
        title: "„Immobilien sind\nVertrauenssache.“",
        text: "Mein Team und ich stehen Ihnen mit Leidenschaft, Marktkenntnis und persönlichem Engagement zur Seite – vom ersten Gespräch bis zum erfolgreichen Abschluss.",
        items: [{ image: pic("n-agent"), name: "Sophie Lindner", role: "Inhaberin & Immobilienexpertin", text: "Persönliche Betreuung\nDiskrete Abwicklung\nStarkes Netzwerk" }],
      }),
      b("quotes", {
        title: "Das sagen unsere Kunden",
        text: "Alle Bewertungen ansehen",
        items: [
          { quote: "„Vom ersten Gespräch bis zum Notartermin hervorragend betreut. Professionell, transparent und jederzeit erreichbar.“", name: "Markus W.", role: `Käufer, ${town(m)}` },
          { quote: "„Der Verkauf unserer Immobilie wurde effizient und mit großem Einfühlungsvermögen begleitet. Besser hätte es nicht laufen können.“", name: "Anna & Thomas B.", role: `Verkäufer, ${town(m)}` },
          { quote: "„Absolute Empfehlung! Exzellente Marktkenntnis, diskrete Abwicklung und ein außergewöhnlicher Service.“", name: "Sabine K.", role: "Käuferin" },
        ],
      }),
      b("cta", { eyebrow: "Gemeinsam Großes finden", title: "Lassen Sie uns über\nIhre Immobilienziele sprechen.", text: "", button: "Jetzt Kontakt aufnehmen", image: pic("n-dusk") }),
      b("contact", { eyebrow: "Kontakt", title: "Sprechen\nwir.", text: "Wir melden uns innerhalb eines Werktags – persönlich und unverbindlich.", hours: hours("09–18 Uhr", "10–14 Uhr", "nach Vereinbarung"), form: true }),
      footer("Exklusive Immobilien. Persönliche Beratung. Nachhaltige Werte."),
    ],
  };
}
