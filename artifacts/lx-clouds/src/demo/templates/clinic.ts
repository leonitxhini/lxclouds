import type { DemoDoc } from "../types";
import { b, footer, img, meta, town, type TemplateInput } from "./shared";

export function clinic(input: TemplateInput): DemoDoc {
  const m = meta(input, "Praxis");
  const pic = (name: string) => img("clinic", name);
  return {
    meta: m,
    theme: {
      primary: "#1C6B6B",
      mode: "light",
      font: "lexend",
      radius: 24,
      skin: "park",
    },
    blocks: [
      b("nav", {
        links: [
          "Leistungen",
          "Praxis",
          "Praxisteam",
          "Patienteninfos",
          "Kontakt",
        ],
        cta: "Online-Termin",
      }),
      b("hero", {
        variant: "split",
        eyebrow: "Moderne Zahnmedizin in angenehmer Atmosphäre",
        title: "Gesunde Zähne.\nEin gutes Gefühl.",
        text: `Ihre Zahnarztpraxis in ${town(m)} – für moderne Zahnmedizin, individuelle Betreuung und ein Lächeln, das bleibt.`,
        primary: "Termin buchen",
        secondary: "",
        image: pic("n-hero"),
        points: [
          "Wertschätzende, persönliche Betreuung",
          "Moderne, schonende Behandlungsmethoden",
          "Zentral gelegen – gut erreichbar",
        ],
        badge: "Neue Patienten willkommen",
        note: "4,9 von 5 bei Google",
      }),
      b("services", {
        eyebrow: "Unsere Leistungen",
        title: "Zahnmedizin –\nso individuell wie Sie.",
        text: "Von der Vorsorge bis zur ästhetischen Zahnmedizin – wir bieten Ihnen das gesamte Spektrum moderner Zahnheilkunde.",
        button: "Alle Leistungen ansehen",
        items: [
          {
            icon: "shield",
            title: "Prophylaxe",
            text: "Für langfristig gesunde Zähne.",
          },
          {
            icon: "tooth",
            title: "Zahnerhaltung",
            text: "Schonende Behandlung für den Erhalt Ihrer natürlichen Zähne.",
          },
          {
            icon: "sparkles",
            title: "Ästhetische Zahnmedizin",
            text: "Für ein strahlendes, natürliches Lächeln.",
          },
          {
            icon: "gem",
            title: "Zahnersatz",
            text: "Hochwertige, langlebige Lösungen.",
          },
          {
            icon: "smile",
            title: "Kinderzahnmedizin",
            text: "Mit Geduld, Einfühlungsvermögen und Erfahrung.",
          },
        ],
      }),
      b("about", {
        eyebrow: "Ihr Besuch bei uns",
        title: "Entspannt. Persönlich.\nGut betreut.",
        text: "Wir möchten, dass Sie sich von Anfang an bei uns wohlfühlen. Das erwartet Sie bei Ihrem Besuch in unserer Praxis.",
        image: pic("n-waiting"),
        points: [
          "Kurze Wartezeiten durch sorgfältige Terminplanung",
          "Moderne, angenehme Praxisräume",
          "Transparente Abläufe und verständliche Beratung",
          "Auch für Angstpatienten – wir nehmen uns Zeit",
        ],
        flip: false,
        button: "Mehr zur Praxis",
      }),
      b("team", {
        eyebrow: "Unser Praxisteam",
        title: "Kompetent. Engagiert.\nFür Sie da.",
        text: "Ein eingespieltes Team, das zuhört, erklärt und sich Zeit nimmt – bei jedem Termin dieselben vertrauten Gesichter.",
        items: [
          {
            image: pic("n-doc1"),
            name: "Dr. med. dent.\nMaximilian Weber",
            role: "Zahnarzt & Praxisinhaber",
            text: "",
          },
          {
            image: pic("n-hero"),
            name: "Dr. med. dent.\nLaura Hoffmann",
            role: "Zahnärztin",
            text: "",
          },
          {
            image: pic("n-doc2"),
            name: "Dr. med. dent.\nSophie Kramer",
            role: "Zahnärztin",
            text: "",
          },
          {
            image: pic("n-doc3"),
            name: "Dr. med. dent.\nDaniel Roth",
            role: "Oralchirurgie",
            text: "",
          },
        ],
      }),
      b("stats", {
        items: [
          {
            icon: "clock",
            value: "Öffnungszeiten",
            label: "Mo – Fr 08:00 – 18:00 Uhr\nSa nach Vereinbarung",
          },
          {
            icon: "pin",
            value: "Zentrale Lage",
            label:
              "Gut erreichbar mit Bus und Bahn, Parkplätze direkt am Haus.",
          },
          {
            icon: "shield",
            value: "Alle Kassen & Privat",
            label: "Wir behandeln gesetzlich und privat Versicherte.",
          },
          {
            icon: "heart",
            value: "Barrierefrei",
            label: "Ohne Stufen und mit Aufzug zugänglich.",
          },
        ],
      }),
      b("quotes", {
        eyebrow: "Das sagen unsere Patienten",
        title: "Vertrauen durch\nechte Erfahrungen.",
        text: "4,9 von 5 bei Google",
        items: [
          {
            quote:
              "„Ein tolles, herzliches Team und eine sehr moderne Praxis. Ich fühle mich hier rundum gut aufgehoben.“",
            name: "Julia M.",
            role: "vor 2 Wochen",
          },
          {
            quote:
              "„Endlich ein Zahnarzt, bei dem ich keine Angst mehr habe. Alles wird detailliert erklärt und man nimmt sich Zeit.“",
            name: "Markus S.",
            role: "vor 1 Monat",
          },
          {
            quote:
              "„Professionell, freundlich und absolut empfehlenswert – für die ganze Familie!“",
            name: "Sabine K.",
            role: "vor 3 Monaten",
          },
        ],
      }),
      b("faq", {
        eyebrow: "Häufige Fragen",
        title: "Gut informiert\nvon Anfang an.",
        text: "Hier finden Sie Antworten auf die häufigsten Fragen rund um Ihren Besuch in unserer Praxis.",
        items: [
          {
            q: "Nehmen Sie neue Patienten auf?",
            a: "Ja, wir freuen uns über neue Patientinnen und Patienten. Ihren ersten Termin können Sie ganz einfach online oder telefonisch vereinbaren.",
          },
          {
            q: "Welche Versicherungen akzeptieren Sie?",
            a: "Wir behandeln gesetzlich und privat Versicherte.",
          },
          {
            q: "Wie lange dauert ein erster Termin?",
            a: "Planen Sie etwa 45 Minuten ein – für ein Gespräch, die Untersuchung und alle Ihre Fragen.",
          },
          {
            q: "Gibt es Parkmöglichkeiten?",
            a: "Ja, direkt am Haus stehen Parkplätze für unsere Patienten bereit.",
          },
          {
            q: "Was tun bei Zahnarztangst?",
            a: "Sagen Sie es uns einfach. Wir nehmen uns Zeit, erklären jeden Schritt und behandeln besonders behutsam.",
          },
        ],
      }),
      b("contact", {
        eyebrow: "Kontakt",
        title: "Wir freuen uns auf Sie.",
        text: "Wir antworten in der Regel innerhalb eines Werktages.",
        hours: [
          { day: "Mo – Fr", time: "08:00 – 18:00 Uhr" },
          { day: "Sa", time: "nach Vereinbarung" },
        ],
        form: false,
      }),
      footer("Moderne Zahnmedizin. Menschlich. Nah. Kompetent."),
    ],
  };
}
