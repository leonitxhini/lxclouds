import { ClipboardList, Code2, Handshake, Megaphone, Palette, PenLine, Scale, Search, Sparkles, Target, type LucideIcon } from "lucide-react";
import type { RoleKey } from "./types";

/** The disciplines that work on a folio – roles, not invented people. */
export const roles: Record<RoleKey, { label: string; task: string; icon: LucideIcon; tone: string }> = {
  lead: { label: "Projektleitung", task: "Ziel, Fahrplan und nächste Schritte", icon: ClipboardList, tone: "#6865FF" },
  strategy: { label: "Marketing-Strategie", task: "Zielgruppen, Positionierung, Wettbewerb", icon: Target, tone: "#E0582F" },
  brand: { label: "Marke & Name", task: "Name, Domain, E-Mail-Adressen", icon: Sparkles, tone: "#C2410C" },
  design: { label: "Design & Nutzerführung", task: "Gestaltung, Seitenaufbau, Anfragewege", icon: Palette, tone: "#9333EA" },
  content: { label: "Text & Inhalte", task: "Botschaften, Texte, Material vom Kunden", icon: PenLine, tone: "#0E7490" },
  seo: { label: "SEO & lokale Sichtbarkeit", task: "Google-Suche, Maps, Bewertungen", icon: Search, tone: "#15803D" },
  ads: { label: "Kunden gewinnen", task: "Google, Empfehlungen, Werbung", icon: Megaphone, tone: "#DB2777" },
  legal: { label: "Recht & Datenschutz", task: "Was erlaubt ist, was Pflicht ist", icon: Scale, tone: "#475569" },
  tech: { label: "Entwicklung & Technik", task: "Technik, Hosting, Messung, Pflege", icon: Code2, tone: "#2563EB" },
  sales: { label: "Angebot & Investition", task: "Pakete, Kosten, was es bringt", icon: Handshake, tone: "#0F766E" },
};

export const roleOrder: RoleKey[] = ["lead", "strategy", "brand", "design", "content", "seo", "ads", "legal", "tech", "sales"];
