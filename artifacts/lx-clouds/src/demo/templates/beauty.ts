import type { DemoDoc } from "../types";
import { b, footer, hours, img, meta, town, type TemplateInput } from "./shared";

// Headlines of this design set words between *asterisks* as the italic accent.
export function beauty(input: TemplateInput): DemoDoc {
  const m = meta(input, "Friseur & Beauty");
  const pic = (name: string) => img("beauty", name);
  return {
    meta: m,
    theme: { primary: "#A37B45", mode: "light", font: "cormorant", radius: 18, skin: "aurelia" },
    blocks: [
      b("nav", { links: ["Leistungen", "Preise", "Team", "Impressionen", "Kontakt"], cta: "Termin buchen" }),
      b("hero", {
        variant: "split",
        eyebrow: "Beauty Hair Selfcare",
        title: "Schönheit\nist ein *Gefühl.*",
        text: `${m.company} ist mehr als ein Friseursalon – es ist ein Ort in ${town(m)}, an dem du dich gesehen, verstanden und strahlend schön fühlst.`,
        primary: "Termin buchen",
        secondary: "Unser Studio\nentdecken",
        image: pic("n-hero"),
        points: ["More", "than", "hair"],
        badge: "Nächster freier Termin:",
        note: "*heute* 16:30",
      }),
      b("cards", {
        eyebrow: "Unsere Leistungen",
        title: "Zeit für das, was *dich* strahlen lässt.",
        text: "Hochwertige Behandlungen, individuelle Beratung und ganz viel Gefühl – für deine natürliche Schönheit.",
        items: [
          { image: pic("n-hair"), tag: "", title: "Haarschnitte & Styling", text: "Individuell, typgerecht, besonders.", price: "" },
          { image: pic("n-colour"), tag: "", title: "Coloration & Balayage", text: "Natürlich glänzend. Ausdrucksstark.", price: "" },
          { image: pic("n-facial"), tag: "", title: "Gesichtsbehandlungen", text: "Reine Pflege. Sichtbare Ergebnisse.", price: "" },
          { image: pic("n-nails"), tag: "", title: "Maniküre & Beauty", text: "Kleine Details. Große Wirkung.", price: "" },
        ],
      }),
      b("prices", {
        eyebrow: "Preisliste",
        title: "Qualität,\ndie bleibt.",
        text: "Transparente Preise, höchste Qualität und ein Erlebnis, das weit über den Moment hinausgeht.",
        button: "Termin buchen",
        groups: [
          {
            name: "Haar",
            items: [
              { name: "Waschen & Föhnen", text: "", price: "ab 38 €" },
              { name: "Haarschnitt Damen", text: "", price: "ab 68 €" },
              { name: "Haarschnitt Herren", text: "", price: "ab 42 €" },
              { name: "Coloration", text: "", price: "ab 78 €" },
              { name: "Balayage", text: "", price: "ab 120 €" },
              { name: "Glossing", text: "", price: "ab 48 €" },
              { name: "Haarpflege-Treatment", text: "", price: "ab 28 €" },
            ],
          },
          {
            name: "Beauty",
            items: [
              { name: "Gesichtsbehandlung Classic", text: "", price: "78 €" },
              { name: "Gesichtsbehandlung Deluxe", text: "", price: "98 €" },
              { name: "Wimpern färben", text: "", price: "22 €" },
              { name: "Augenbrauen-Styling", text: "", price: "28 €" },
              { name: "Maniküre", text: "", price: "38 €" },
              { name: "Pediküre", text: "", price: "48 €" },
              { name: "Make-up (Tageslook)", text: "", price: "68 €" },
            ],
          },
        ],
      }),
      b("team", {
        eyebrow: "Unser Team",
        title: "Menschen,\ndie Schönheit\n*leben.*",
        text: "Unser Team vereint Erfahrung, Kreativität und echte Leidenschaft – für Ergebnisse, die von Herzen kommen.",
        items: [
          { image: pic("n-team1"), name: "Elena", role: "Inhaberin & Stylistin", text: "„Schönheit bedeutet für mich, du selbst zu sein.“" },
          { image: pic("n-team2"), name: "Lena", role: "Coloristin", text: "„Farben erzählen Geschichten – ich helfe dir, deine zu finden.“" },
          { image: pic("n-team3"), name: "Sofia", role: "Beauty-Expertin", text: "„Wahre Schönheit beginnt mit gesunder Haut.“" },
        ],
      }),
      b("gallery", {
        eyebrow: "Impressionen",
        title: "Einblicke\nin unsere Welt.",
        text: "Aktuelle Looks, Vorher-Nachher-Verwandlungen und besondere Momente aus dem Studio.",
        note: "@deinstudio",
        images: [pic("n-hair"), pic("n-salon"), pic("n-team3"), pic("n-nails"), pic("n-colour")],
      }),
      b("quotes", {
        eyebrow: "Bewertungen",
        title: "Echte Menschen.\nEchte Ergebnisse.",
        text: "5,0 von 5 Sternen\nbei Google",
        items: [
          { quote: "„Ich war noch nie so zufrieden! Das Team ist unglaublich herzlich und professionell. Man fühlt sich vom ersten Moment an wohl.“", name: "Julia M.", role: "" },
          { quote: "„Wunderschönes Ambiente, tolle Beratung und ein Ergebnis, das meine Erwartungen übertroffen hat.“", name: "Carina S.", role: "" },
          { quote: "„Für mich ein kleiner Luxus im Alltag. Hier stimmt einfach alles – Atmosphäre, Team, Ergebnis.“", name: "Marie K.", role: "" },
          { quote: "„Endlich eine Coloristin, die zuhört. Mein Balayage sieht auch nach Wochen noch aus wie am ersten Tag.“", name: "Anna T.", role: "" },
        ],
      }),
      b("contact", {
        eyebrow: "Termin & Kontakt",
        title: "Dein Termin\nbei *uns.*",
        text: "Schreib uns deinen Wunschtermin – wir melden uns noch am selben Tag mit einer Bestätigung.",
        hours: hours("09–20 Uhr", "09–16 Uhr"),
        form: true,
      }),
      b("cta", { eyebrow: "Dein Moment", title: "Bereit für\ndeine Auszeit?", text: "Buche jetzt deinen Termin und erlebe Beauty, die mehr ist als nur ein Look – sie ist ein Gefühl.", button: "Termin buchen", image: pic("n-salon") }),
      footer("Ein Salon für alle, die Schönheit bewusst erleben möchten. Persönlich. Hochwertig. Mit ganz viel Herz."),
    ],
  };
}
