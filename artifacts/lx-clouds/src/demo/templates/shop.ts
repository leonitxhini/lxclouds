import type { DemoDoc } from "../types";
import { b, img, meta, town, type TemplateInput } from "./shared";

export function shop(input: TemplateInput): DemoDoc {
  const m = meta(input, "Shop");
  const pic = (name: string) => img("shop", name);
  return {
    meta: m,
    theme: { primary: "#1447C8", mode: "light", font: "bricolage", radius: 16, skin: "maison" },
    blocks: [
      b("nav", {
        links: ["Shop", "Wohnen", "Küche", "Textilien", "Deko", "Journal"],
        cta: "",
        notice: "Kostenloser Versand ab 50 € · Kleine Dinge. Großes Zuhause. · Jetzt neu: unsere Herbstkollektion",
      }),
      b("hero", {
        variant: "split",
        eyebrow: "Schönere Alltage",
        title: "Für ein\nZuhause,\ndas sich\ngut anfühlt.",
        text: "Zeitlose Produkte für ein Leben mit mehr Wärme, Persönlichkeit und Leichtigkeit.",
        primary: "Jetzt entdecken",
        secondary: "",
        image: pic("n-hero"),
        points: ["Keramikvase\nLéa", "Leinenkissen\nRiviera", "Duftkerze\nSoleil"],
        badge: "Neu\nim Shop",
      }),
      b("services", {
        title: "",
        text: "",
        items: [
          { icon: "bulb", title: "Wohnen", text: "", image: pic("n-lamp") },
          { icon: "utensils", title: "Küche", text: "", image: pic("n-bowls") },
          { icon: "heart", title: "Textilien", text: "", image: pic("n-towels") },
          { icon: "flower", title: "Deko", text: "", image: pic("n-deko") },
        ],
      }),
      b("cards", {
        title: "Unsere Bestseller",
        text: "",
        button: "Alle Produkte ansehen",
        items: [
          { image: pic("n-vase"), tag: "Bestseller", title: "Vase Léa", text: "Keramik, verschiedene Farben", price: "49,00 €" },
          { image: pic("n-candle"), tag: "Neu", title: "Duftkerze Soleil", text: "Natürliches Wachs, 220 g", price: "28,00 €" },
          { image: pic("n-cushion"), tag: "", title: "Leinenkissen Riviera", text: "100 % Leinen, 50 × 50 cm", price: "59,00 €" },
          { image: pic("n-mug"), tag: "", title: "Becher Noa", text: "Steinzeug, 300 ml", price: "18,00 €" },
        ],
      }),
      b("about", {
        eyebrow: "Unsere Philosophie",
        title: "Handverlesen.\nFair gemacht.",
        text: "Wir glauben an besondere Dinge, die lange bleiben. Deshalb wählen wir jedes Produkt mit Sorgfalt aus – zeitlos im Design, fair in der Herstellung und gut für ein bewussteres Zuhause.",
        image: pic("n-table"),
        points: [],
        flip: false,
        button: "Mehr über uns",
      }),
      b("stats", {
        items: [
          { icon: "truck", value: "Versand in 48 h", label: "Schnell und sorgfältig verpackt." },
          { icon: "box", value: "30 Tage Rückgabe", label: "Ganz entspannt und unkompliziert." },
          { icon: "store", value: "Abholung im Laden", label: `Online bestellen und in ${town(m)} abholen.` },
        ],
      }),
      b("quotes", {
        eyebrow: "Das sagen unsere Kund:innen",
        title: "Lieblingsstücke.\nEchte Geschichten.",
        items: [
          { quote: "Wunderschöne Produkte, super schneller Versand und ein liebevoll verpacktes Paket. Man spürt, wie viel Herzblut dahinter steckt!", name: "Laura M.", role: "Vase Léa" },
          { quote: "Endlich ein Concept Store, der schönes Design mit echten Werten verbindet. Meine neue Lieblingskerze!", name: "Tobias K.", role: "Duftkerze Soleil" },
          { quote: "Tolle Auswahl, faire Marken und ein richtig schöner Laden. Ich kaufe nur noch hier.", name: "Jana S.", role: "Leinenkissen Riviera" },
        ],
      }),
      b("cta", {
        eyebrow: "Bleib inspiriert",
        title: "Unser Newsletter\nfür mehr gute Dinge.",
        text: "Neuheiten, Interior-Inspirationen und exklusive Angebote – direkt in dein Postfach.",
        button: "Jetzt anmelden",
      }),
      b("contact", {
        eyebrow: `Unser Laden in ${town(m)}`,
        title: "Schau vorbei.\nWir freuen uns auf dich.",
        text: "In unserem Concept Store findest du eine kuratierte Auswahl unserer Lieblingsprodukte – zum Anfassen, Ausprobieren und Mitnehmen.",
        hours: [
          { day: "Mo – Fr", time: "10 – 19 Uhr" },
          { day: "Sa", time: "10 – 18 Uhr" },
          { day: "So", time: "geschlossen" },
        ],
        form: false,
        image: pic("n-store"),
      }),
      b("footer", { text: "Schönes für ein gutes Zuhause.", links: ["Impressum", "Datenschutz", "AGB", "Versand & Rückgabe"] }),
    ],
  };
}
