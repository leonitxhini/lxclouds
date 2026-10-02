import { ImagePlus, Maximize2, MessageSquare, Minimize2, Palette, ThumbsUp, Trash2, Type, type LucideIcon } from "lucide-react";
import { itemStatusLabels, type Board, type BoardItem, type Pin, type PinKind } from "../api";

/** The kinds of remark that can be put on a spot of a design. */
export const pinKinds: Record<PinKind, { label: string; hint: string; icon: LucideIcon; tone: string }> = {
  keep: { label: "Gefällt", hint: "So lassen", icon: ThumbsUp, tone: "#10b981" },
  colour: { label: "Farbe", hint: "Andere Farbe", icon: Palette, tone: "#6865ff" },
  smaller: { label: "Kleiner", hint: "Kleiner machen", icon: Minimize2, tone: "#6865ff" },
  bigger: { label: "Größer", hint: "Größer machen", icon: Maximize2, tone: "#6865ff" },
  image: { label: "Bild", hint: "Anderes Bild", icon: ImagePlus, tone: "#6865ff" },
  text: { label: "Text", hint: "Anderer Text", icon: Type, tone: "#6865ff" },
  remove: { label: "Weg", hint: "Entfernen", icon: Trash2, tone: "#f43f5e" },
  other: { label: "Sonstiges", hint: "Anmerkung", icon: MessageSquare, tone: "#6865ff" },
};
export const pinKindOrder: PinKind[] = ["keep", "colour", "smaller", "bigger", "image", "text", "remove", "other"];
export const kindOf = (pin: Pin): PinKind => pin.kind ?? "other";

/** The aspects of a design that can be taken over on their own: "the logo from this one, the colours from that one". */
export const pickKeys = ["logo", "colours", "type", "images", "layout", "name"] as const;
export type PickKey = (typeof pickKeys)[number];
export const pickLabels: Record<PickKey, string> = { logo: "Logo", colours: "Farben", type: "Schrift", images: "Bilder", layout: "Aufbau", name: "Name" };

export const itemName = (item: BoardItem) => (item.group_name ? `${item.group_name} · ${item.title}` : item.title);

export const euro = (value: number) => value.toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: value % 1 ? 2 : 0 });

export function offerTotals(board: Board) {
  const sum = (unit: "once" | "month") => board.offer.filter((l) => l.unit === unit).reduce((n, l) => n + (l.price || 0), 0);
  return { once: sum("once"), month: sum("month") };
}

/** What a mark asks for, in words. */
export function pinText(pin: Pin) {
  const kind = pinKinds[kindOf(pin)];
  const parts = [kindOf(pin) === "other" ? "" : kind.hint, pin.colour && kindOf(pin) === "colour" ? `→ ${pin.colour.toUpperCase()}` : "", pin.text.trim()];
  return parts.filter(Boolean).join(kindOf(pin) === "other" ? "" : ": ").replace(": →", " →") || "(ohne Text)";
}

/** Everything that was decided, as plain text for the client file or a message. */
export function summaryText(board: Board, items: BoardItem[]) {
  const lines = [`Entwürfe „${board.title}" – Stand ${new Date().toLocaleDateString("de-DE")}`];
  for (const status of ["favorite", "maybe", "out"] as const) {
    const list = items.filter((i) => i.status === status);
    if (list.length) lines.push(`${itemStatusLabels[status]}: ${list.map(itemName).join(", ")}`);
  }
  const picks = pickKeys.map((key) => [key, items.find((i) => i.id === board.picks[key])] as const).filter(([, item]) => item);
  if (picks.length) lines.push("", "Wunsch-Kombination:", ...picks.map(([key, item]) => `  ${pickLabels[key]}: wie ${itemName(item!)}`));
  if (board.notes.trim()) lines.push("", "Allgemein:", board.notes.trim());
  for (const item of items) {
    if (!item.notes.trim() && item.pins.length === 0) continue;
    lines.push("", `${itemName(item)}${item.status ? ` [${itemStatusLabels[item.status]}]` : ""}`);
    if (item.notes.trim()) lines.push(item.notes.trim());
    item.pins.forEach((pin, n) => lines.push(`  ${n + 1}. ${pinText(pin)}${pin.done ? " – erledigt" : ""}`));
  }
  if (board.offer.length) {
    const totals = offerTotals(board);
    lines.push("", "Angebot:", ...board.offer.map((l) => `  ${l.title || "Position"}: ${euro(l.price)}${l.unit === "month" ? " / Monat" : ""}`));
    lines.push(`  Summe einmalig: ${euro(totals.once)}${totals.month ? ` · monatlich: ${euro(totals.month)}` : ""}`);
  }
  if (board.signoff) lines.push("", `Freigegeben von ${board.signoff.name || "Kunde"} am ${new Date(board.signoff.date.replace(" ", "T") + "Z").toLocaleDateString("de-DE")}.`);
  return lines.join("\n");
}
