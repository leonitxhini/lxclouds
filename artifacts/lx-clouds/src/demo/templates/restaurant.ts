import type { DemoDoc } from "../types";
import { b, footer, hours, img, meta, town, type TemplateInput } from "./shared";

export function restaurant(input: TemplateInput): DemoDoc {
  const m = meta(input, "Restaurant");
  const pic = (name: string) => img("restaurant", name);
  return {
    meta: m,
    theme: { primary: "#A9482A", mode: "light", font: "fraunces", radius: 22, skin: "osteria" },
    blocks: [
      b("nav", { links: ["Start", "Unsere Küche", "Speisekarte", "Galerie", "Kontakt"], cta: "Tisch reservieren" }),
      b("hero", {
        variant: "cover",
        eyebrow: "Italienische Küche\nmit Herz und Seele",
        title: "Buon\nAppetito",
        text: `Frische Zutaten. Echte Rezepte. Eine Hommage an die italienische Lebensart – mitten in ${town(m)}.`,
        primary: "Tisch reservieren",
        secondary: "",
        image: pic("n-hero"),
        points: ["Pasta", "Vino", "Amore"],
        note: "La vita è più buona\ninsieme.",
      }),
      b("stats", {
        items: [
          { icon: "clock", label: "Öffnungszeiten", value: "Di – So\n12:00 – 22:00 Uhr" },
          { icon: "pin", label: "Unsere Adresse", value: `${m.address}\n${m.city}` },
          { icon: "phone", label: "Telefon", value: m.phone },
          { icon: "utensils", label: "Küche", value: "Warme Küche\n12:00 – 21:30 Uhr" },
        ],
      }),
      b("about", {
        eyebrow: "Unsere Küche",
        title: "Mehr als nur\nein Restaurant",
        text: "Ein Ort für gutes Essen, ehrliche Begegnungen und besondere Momente. Wir verbinden traditionelle italienische Rezepte mit frischen, regionalen Zutaten – und einer großen Portion Leidenschaft.",
        image: pic("n-interior"),
        image2: pic("n-chef"),
        points: [],
        flip: false,
        button: "Unsere Geschichte",
        note: "Cucina.\nPersone.\nMomenti.",
      }),
      b("prices", {
        eyebrow: "Speisekarte",
        title: "Italienische Klassiker\nneu interpretiert",
        text: "Eine Liebeserklärung an die Vielfalt Italiens – mit klassischen Gerichten und saisonalen Spezialitäten. Immer frisch, immer mit besten Zutaten.",
        button: "Zur kompletten Speisekarte",
        groups: [
          {
            name: "Antipasti",
            items: [
              { name: "Burrata mit Kirschtomaten", text: "mit Basilikum und nativem Olivenöl", price: "14,50 €" },
              { name: "Vitello Tonnato", text: "dünn geschnittenes Kalbfleisch mit Thunfischsauce", price: "16,50 €" },
              { name: "Gegrillter Oktopus", text: "auf cremiger Cannellini-Bohnen-Creme", price: "17,50 €" },
            ],
          },
          {
            name: "Secondi",
            items: [
              { name: "Saltimbocca alla Romana", text: "Kalb mit Parmaschinken und Salbei", price: "26,50 €" },
              { name: "Branzino alla Griglia", text: "Wolfsbarsch vom Grill mit Kräutern und Zitrone", price: "24,50 €" },
              { name: "Tagliata di Manzo", text: "Rindersteak in Scheiben mit Rucola und Parmesan", price: "28,50 €" },
            ],
          },
          {
            name: "Pasta",
            items: [
              { name: "Tagliatelle al Ragù", text: "hausgemachte Pasta mit traditioneller Bolognese", price: "15,50 €" },
              { name: "Spaghetti Cacio e Pepe", text: "mit Pecorino Romano und schwarzem Pfeffer", price: "14,50 €" },
              { name: "Linguine alle Vongole", text: "mit frischen Venusmuscheln, Knoblauch und Petersilie", price: "18,50 €" },
            ],
          },
          {
            name: "Dolci",
            items: [
              { name: "Tiramisù della Casa", text: "nach traditionellem Rezept", price: "8,50 €" },
              { name: "Panna Cotta", text: "mit saisonalen Beeren", price: "7,50 €" },
              { name: "Affogato al Caffè", text: "Vanilleeis mit heißem Espresso", price: "6,50 €" },
            ],
          },
        ],
      }),
      b("cards", {
        eyebrow: "Unsere Signature Dishes",
        title: "Besondere Gerichte\nfür besondere Momente",
        text: "Stagionale.\nSempre speciale.",
        items: [
          { image: pic("n-dish1"), tag: "Unser Klassiker", title: "Tagliatelle al Tartufo", text: "Hausgemachte Tagliatelle mit frischem Trüffel in Parmesansauce.", price: "22,50 €" },
          { image: pic("n-dish2"), tag: "Beliebtestes Gericht", title: "Linguine alle Vongole", text: "Mit frischen Venusmuscheln, Knoblauch, Weißwein und Petersilie.", price: "18,50 €" },
          { image: pic("n-dish3"), tag: "Saisonal", title: "Burrata di Puglia", text: "Cremige Burrata mit geschmorten Kirschtomaten, Basilikum und Olivenöl.", price: "14,50 €" },
        ],
      }),
      b("gallery", {
        eyebrow: "Galerie",
        title: "Ein kleiner Einblick",
        note: "La dolce vita",
        text: "Mehr Eindrücke auf Instagram",
        images: [pic("n-facade"), pic("n-parmesan"), pic("n-table"), pic("g5"), pic("g1"), pic("g2"), pic("g3")],
      }),
      b("quotes", {
        eyebrow: "Gästestimmen",
        title: "Was unsere Gäste sagen",
        text: "4,8 von 5 bei Google",
        items: [
          { quote: "Ein Stück Italien mitten in der Stadt. Fantastisches Essen, herzlicher Service und eine wundervolle Atmosphäre.", name: "Sophie K.", role: "Abendessen zu zweit" },
          { quote: "Die beste Pasta, die ich seit Langem gegessen habe. Man fühlt sich wie im Urlaub.", name: "Markus B.", role: "Stammgast" },
          { quote: "Authentisch, stilvoll und mit so viel Liebe zum Detail. Wir kommen immer wieder.", name: "Elena R.", role: "Familienfeier" },
        ],
      }),
      b("cta", {
        eyebrow: "Jetzt reservieren",
        title: "Ein Tisch\nwartet auf Sie",
        text: "Ob romantisches Dinner, Abend mit Freunden oder besonderer Anlass – wir freuen uns auf Ihre Reservierung.",
        button: "Tisch reservieren",
      }),
      b("contact", {
        eyebrow: "So finden Sie uns",
        title: "Besuchen Sie uns",
        text: "Reservierungen nehmen wir telefonisch oder online entgegen. Für Feiern und größere Runden rufen Sie uns am besten kurz an.",
        hours: hours("12:00 – 22:00 Uhr", "12:00 – 23:00 Uhr", "12:00 – 21:00 Uhr"),
        form: false,
      }),
      footer("Cucina. Persone. Momenti."),
    ],
  };
}
