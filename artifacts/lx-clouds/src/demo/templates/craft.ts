import type { DemoDoc } from "../types";
import { b, footer, hours, img, meta, town, type TemplateInput } from "./shared";

export function craft(input: TemplateInput): DemoDoc {
  const m = meta(input, "Handwerk");
  const pic = (name: string) => img("craft", name);
  return {
    meta: m,
    theme: { primary: "#FF5A1F", mode: "light", font: "archivo", radius: 18, skin: "werk" },
    blocks: [
      b("nav", { links: ["Leistungen", "Projekte", "Ablauf", "Bewertungen"], cta: "Angebot anfragen" }),
      b("hero", {
        variant: "split",
        eyebrow: "Bad- & Wohnraumsanierung aus einer Hand",
        title: "Echtes\nHandwerk\nfür ein\nschöneres\nZuhause.",
        text: "Wir sanieren Bäder, renovieren Wohnräume und setzen individuelle Lösungen um – zuverlässig, sauber und mit Liebe zum Detail.",
        primary: "Kostenloses Angebot anfragen",
        secondary: "Unsere Projekte ansehen",
        image: pic("n-hero"),
        badge: "Kostenloses\nAngebot in 24 h",
        points: ["Unverbindlich", "Transparente Preise", "Persönliche Beratung"],
        note: "Handwerk,\ndas bleibt.",
      }),
      b("stats", {
        items: [
          { icon: "award", value: "Meisterbetrieb", label: "Qualität mit Brief und Siegel" },
          { icon: "settings", value: "Eigenes Team", label: `Fest angestellt, aus ${town(m)}` },
          { icon: "star", value: "5,0 Sterne", label: "Bewertung bei Google" },
        ],
      }),
      b("services", {
        eyebrow: "Unsere Leistungen",
        title: "Alles für Ihr Zuhause.",
        text: "Von der Badsanierung bis zur kompletten Wohnraumrenovierung – das volle Leistungsspektrum aus einer Hand.",
        items: [
          { icon: "bath", title: "Badsanierung", text: "Moderne Bäder, die begeistern – funktional, stilvoll und langlebig.", image: pic("hero") },
          { icon: "grid", title: "Fliesenarbeiten", text: "Präzision bis ins Detail – für zeitlose Schönheit.", image: pic("n-tiling") },
          { icon: "paint", title: "Malerarbeiten", text: "Frische Räume mit Charakter – sauber und hochwertig.", image: pic("n-painting") },
          { icon: "house", title: "Wohnraumsanierung", text: "Mehr Wohnqualität – individuell nach Ihren Wünschen.", image: pic("n-living") },
          { icon: "settings", title: "Komplettsanierung", text: "Planung und Umsetzung aus einer Hand.", image: pic("n-plans") },
          { icon: "bulb", title: "Individuelle Lösungen", text: "Besondere Ideen für besondere Räume.", image: pic("n-niche") },
        ],
      }),
      b("about", {
        eyebrow: "Vorher / Nachher",
        title: "Aus alt mach wow.",
        text: "Echte Ergebnisse statt Versprechen. Ziehen Sie den Regler und sehen Sie selbst, was aus einem Bad werden kann.",
        image: pic("n-before"),
        image2: pic("n-after"),
        points: [],
        flip: false,
      }),
      b("steps", {
        eyebrow: "So einfach geht's",
        title: "Ihr Projekt in 4 Schritten.",
        text: "Transparent, persönlich, effizient. So wird aus Ihrer Idee ein schönes Zuhause.",
        items: [
          { title: "Anfrage stellen", text: "Unverbindlich und in wenigen Minuten." },
          { title: "Beratung vor Ort", text: "Wir besprechen Ihre Wünsche persönlich." },
          { title: "Angebot erhalten", text: "Transparent und fair – in 24 Stunden." },
          { title: "Umsetzung starten", text: "Zuverlässig, sauber und termingerecht." },
        ],
      }),
      b("stats", {
        items: [
          { value: "250+", label: "Erfolgreich umgesetzte Projekte" },
          { value: "15", label: "Jahre Erfahrung in der Region" },
          { value: "24 h", label: "bis zu Ihrem Angebot" },
          { value: "5 J.", label: "Gewährleistung auf unsere Arbeit" },
          { icon: "note", value: "Regionale Qualität.\nEhrliche Arbeit.", label: "" },
        ],
      }),
      b("quotes", {
        eyebrow: "Kundenstimmen",
        title: "Das sagen unsere Kunden.",
        text: "Die meisten Aufträge bekommen wir durch Empfehlung – das ist uns das liebste Lob.",
        items: [
          { quote: "„Unser neues Bad ist ein Traum! Von der Beratung bis zur Umsetzung war alles perfekt. Das Team arbeitet sehr professionell und sauber.“", name: "Familie Weber", role: town(m) },
          { quote: "„Zuverlässig, ehrlich und top Qualität. Man merkt sofort, dass hier echte Profis am Werk sind. Wir würden jederzeit wieder beauftragen.“", name: "Thomas K.", role: "Wohnungssanierung" },
          { quote: "„Die Komplettsanierung unseres Hauses wurde termingerecht und in hervorragender Qualität umgesetzt. Klare Empfehlung!“", name: "Sandra L.", role: "Komplettsanierung" },
        ],
      }),
      b("contact", {
        eyebrow: "Jetzt anfragen",
        title: "Kostenloses\nAngebot in 24 h.",
        text: "Schildern Sie uns Ihr Projekt – wir melden uns innerhalb von 24 Stunden mit einem unverbindlichen Angebot bei Ihnen.",
        hours: hours("07–17 Uhr", "nach Vereinbarung"),
        form: true,
        image: pic("n-tap"),
      }),
      footer("Bäder. Räume. Lebensqualität."),
    ],
  };
}
