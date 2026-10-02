import type { Block, BlockType } from "./types";
import { rental } from "./templates/rental";
import { restaurant } from "./templates/restaurant";
import { craft } from "./templates/craft";
import { beauty } from "./templates/beauty";
import { clinic } from "./templates/clinic";
import { realestate } from "./templates/realestate";
import { shop } from "./templates/shop";
import { service } from "./templates/service";
import { b, hours, img, uid, type Template, type TemplateInput } from "./templates/shared";

export { uid };
export type { Template, TemplateInput };

// The preview is a capture of the template's first screen (scratch script previews.mjs).
export const templates: Template[] = [
  { id: "rental", name: "Autovermietung", industry: "Autovermietung", description: "Dunkel und kantig: Plakatschrift, Buchungsleiste, Flotte mit Preisen, Vorteile als Bento-Raster.", preview: img("rental", "preview"), photo: img("rental", "n-hero"), build: rental },
  { id: "restaurant", name: "Restaurant", industry: "Gastronomie", description: "Warm und editorial: Serifen, drehendes Reservierungs-Siegel, Speisekarte mit Punktlinien, Galerie.", preview: img("restaurant", "preview"), photo: img("restaurant", "n-hero"), build: restaurant },
  { id: "craft", name: "Handwerk", industry: "Handwerk", description: "Kräftig und klar: nummerierte Leistungen, Vorher-Nachher-Regler, Ablauf, Angebotsformular.", preview: img("craft", "preview"), photo: img("craft", "n-hero"), build: craft },
  { id: "beauty", name: "Friseur & Beauty", industry: "Friseur & Beauty", description: "Weich und luxuriös: Bogenformen, Behandlungen, Preisliste, Team, Terminkarte.", preview: img("beauty", "preview"), photo: img("beauty", "n-hero"), build: beauty },
  { id: "clinic", name: "Praxis", industry: "Gesundheit", description: "Hell und ruhig: Online-Termin-Auswahl, Leistungen, Team, Sprechzeiten, Fragen.", preview: img("clinic", "preview"), photo: img("clinic", "n-hero"), build: clinic },
  { id: "realestate", name: "Immobilien", industry: "Immobilien", description: "Architektonisch: Objektsuche auf dem Titelbild, Objekte mit Preis, Wertermittlung, Maklerprofil.", preview: img("realestate", "preview"), photo: img("realestate", "n-hero"), build: realestate },
  { id: "shop", name: "Shop", industry: "Handel", description: "Farbig und verspielt: Laufband, Kategorien, Bestseller mit Warenkorb, Newsletter, Laden vor Ort.", preview: img("shop", "preview"), photo: img("shop", "n-hero"), build: shop },
  { id: "service", name: "Dienstleister", industry: "Dienstleistung", description: "Hell und gläsern: schwebende Karten, Leistungs-Bento, Ablauf, Pakete mit Preisen, Fragen.", preview: img("service", "preview"), build: service },
];

export const getTemplate = (id: string) => templates.find((t) => t.id === id);

const set = (template: string, ...list: string[]) => list.map((n) => img(template, n));
/** The photos that ship with the templates, for the image picker's library. */
export const stockImages: { label: string; images: string[] }[] = [
  { label: "Autovermietung", images: set("rental", "n-hero", "n-car1", "n-car2", "n-car3", "n-road", "n-pass", "n-interior", "n-key", "n-airport", "hero", "about", "c1", "c2", "c3", "c4", "g1", "g2") },
  { label: "Restaurant", images: set("restaurant", "n-hero", "n-dish1", "n-dish2", "n-dish3", "n-chef", "n-interior", "n-facade", "n-parmesan", "n-table", "hero", "about", "g1", "g2", "g3", "g4", "g5", "g6") },
  { label: "Handwerk", images: set("craft", "n-hero", "n-before", "n-after", "n-tiling", "n-painting", "n-living", "n-plans", "n-niche", "n-tap", "hero", "about", "g1", "g2", "g3", "g4", "g5", "g6") },
  { label: "Friseur & Beauty", images: set("beauty", "n-hero", "n-hair", "n-colour", "n-facial", "n-nails", "n-salon", "n-team1", "n-team2", "n-team3", "hero", "about", "c1", "c2", "c3", "c4", "g1", "g2") },
  { label: "Praxis", images: set("clinic", "n-hero", "n-waiting", "n-doc1", "n-doc2", "n-doc3", "hero", "about", "g1", "g2", "g3", "g4") },
  { label: "Immobilien", images: set("realestate", "n-hero", "n-villa", "n-penthouse", "n-house", "n-agent", "n-terrace", "n-dusk", "n-altbau", "n-townhouse", "hero", "about", "c1", "c2", "c3", "c4", "g1", "g2", "g3") },
  { label: "Shop", images: set("shop", "n-hero", "n-vase", "n-candle", "n-cushion", "n-mug", "n-blanket", "n-board", "n-lamp", "n-bowls", "n-towels", "n-deko", "n-table", "n-store", "hero", "about", "c1", "c2", "c3", "c4", "c5", "c6") },
  { label: "Dienstleister", images: set("service", "n-portrait", "hero", "about", "g1", "g2", "g3", "g4") },
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
    case "team":
      return b("team", { title: "Unser Team", text: "Die Menschen hinter dem Unternehmen.", items: [{ image: "", name: "Name", role: "Aufgabe", text: "" }, { image: "", name: "Name", role: "Aufgabe", text: "" }, { image: "", name: "Name", role: "Aufgabe", text: "" }] });
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
  team: "Team",
  contact: "Kontakt",
  footer: "Fußzeile",
};
