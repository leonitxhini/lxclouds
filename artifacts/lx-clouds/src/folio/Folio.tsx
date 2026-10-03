import { BookOpen, CalendarCheck, Camera, Check, ChevronDown, ChevronLeft, ChevronRight, CircleDashed, Gauge, Globe, Handshake, Loader2, MapPin, Maximize2, Megaphone, Minus, Phone, Plus, RefreshCw, Rocket, Search, Star, Store, Users, X, type LucideIcon } from "lucide-react";
import { Fragment, createContext, useContext, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AddItem, BlockContext, EditContext, ItemTools, T, imageUrl, type EditApi } from "@/demo/edit";
import { onColour } from "@/demo/theme";
import { cn } from "@/lib/utils";
import { roles } from "./roles";
import { criteria, domainContext, rankDomains, type CriterionKey } from "./strength";
import type { Audit, AuditBlock, Chapter, ChannelsBlock, DomainsBlock, FolioBlock, FolioDoc, JourneyBlock, OptionsBlock, PackagesBlock, RoiBlock, TableBlock } from "./types";

/** Live checks the editor can run; absent in the read-only views. */
export type FolioTools = {
  checkDomains: (scope: string) => void;
  audit: (scope: string, index?: number) => void;
  psi: (scope: string, index: number) => void;
  /** scopes with a check running */
  busy: Set<string>;
};
const ToolsContext = createContext<FolioTools | null>(null);
/** Decisions that can be made in the meeting even where texts are not editable (presentation): favourites and choices. */
const ChoiceContext = createContext<EditApi["set"] | null>(null);
const DocContext = createContext<FolioDoc | null>(null);
const useTools = () => useContext(ToolsContext);
const useScope = () => useContext(BlockContext);
const useEditApi = () => useContext(EditContext);
function useChoose() {
  const edit = useEditApi();
  const choose = useContext(ChoiceContext);
  return edit?.set ?? choose;
}

const h2 = "text-[30px] font-semibold leading-[1.08] tracking-[-0.03em] @3xl:text-[42px]";
const h3 = "text-[13px] font-semibold uppercase tracking-[0.12em] text-(--mut)";
const card = "rounded-[18px] border border-(--line) bg-(--card)";
const chip = "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold";

export function folioVars(doc: FolioDoc): CSSProperties {
  const p = doc.meta.accent || "#6865FF";
  return {
    "--p": p,
    "--p-on": onColour(p),
    "--soft": `color-mix(in srgb, ${p} 10%, #ffffff)`,
    "--bg": "#F6F5F1",
    "--card": "#ffffff",
    "--fg": "#12131B",
    "--mut": "#5D6072",
    "--line": "rgba(18,19,27,0.09)",
  } as CSSProperties;
}

function Stars({ value, scope, path }: { value: number; scope?: string; path?: (string | number)[] }) {
  const choose = useChoose();
  const active = !!(choose && scope !== undefined && path);
  return (
    <span className="inline-flex gap-0.5" aria-label={`${value} von 5 Sternen`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" disabled={!active} onClick={() => active && choose!(scope!, path!, n)} className={cn("disabled:cursor-default", active && "cursor-pointer hover:scale-110")} tabIndex={active ? 0 : -1} aria-label={active ? `${n} Sterne` : undefined}>
          <Star className={cn("size-4", n <= value ? "fill-amber-400 text-amber-400" : "fill-(--fg)/10 text-transparent")} />
        </button>
      ))}
    </span>
  );
}

function ListEdit({ items, path, good, label }: { items: string[]; path: (string | number)[]; good: boolean; label: string }) {
  const Icon = good ? Check : X;
  return (
    <>
      <ul className="space-y-1.5">
        {items.map((text, i) => (
          <li key={i} className="group/item relative flex gap-2 text-[14.5px] leading-[1.45]">
            <Icon className={cn("mt-0.5 size-4 shrink-0", good ? "text-emerald-600" : "text-rose-500")} strokeWidth={3} aria-hidden="true" />
            <T path={[...path, i]} value={text} className="min-w-0 flex-1" placeholder="Punkt" />
            <ItemTools path={path} index={i} count={items.length} />
          </li>
        ))}
      </ul>
      <AddItem path={path} item="" label={label} className="mt-2" />
    </>
  );
}

// ---------------------------------------------------------------- designs: look at them together
function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return createPortal(
    <div className="fixed inset-0 z-[95] overflow-auto bg-black/92" onClick={onClose} role="dialog" aria-label={alt}>
      <button type="button" onClick={onClose} className="fixed right-4 top-4 z-10 flex size-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25" aria-label="Schließen">
        <X className="size-5" />
      </button>
      <img src={src} alt={alt} className="mx-auto block min-h-full w-auto max-w-none object-contain p-4 lg:max-w-[min(1800px,96vw)]" />
    </div>,
    document.body,
  );
}

function Gallery({ b }: { b: OptionsBlock }) {
  const scope = useScope();
  const choose = useChoose();
  const edit = useEditApi();
  const [index, setIndex] = useState(() => Math.max(0, b.items.findIndex((i) => i.pick)));
  const [zoom, setZoom] = useState(false);
  const i = Math.min(index, b.items.length - 1);
  const item = b.items[i];
  if (!item) return null;
  const go = (by: number) => setIndex((i + by + b.items.length) % b.items.length);
  const favourites = b.items.filter((x) => x.pick).length;
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <T as="h3" path={["title"]} value={b.title} className={h3} placeholder="Überschrift" />
        <span className="text-[13px] text-(--mut)">
          {i + 1} von {b.items.length}
          {favourites ? ` · ${favourites} ${favourites === 1 ? "Favorit" : "Favoriten"}` : ""}
        </span>
      </div>
      <div className="grid gap-4 @5xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="relative overflow-hidden rounded-[18px] border border-(--line) bg-[#0e0f15]">
          {item.image ? (
            <button type="button" onClick={() => setZoom(true)} className="group block w-full cursor-zoom-in" aria-label={`${item.name} groß ansehen`}>
              <img src={imageUrl(item.image)} alt={item.name} className="mx-auto block max-h-[72vh] w-full object-contain" />
              <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-[12px] font-medium text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                <Maximize2 className="size-3.5" /> Groß ansehen
              </span>
            </button>
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center text-white/40">Kein Bild</div>
          )}
          {b.items.length > 1 && (
            <>
              <button type="button" onClick={() => go(-1)} className="absolute left-3 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#12131B] shadow-lg hover:bg-white" aria-label="Vorheriger Entwurf">
                <ChevronLeft className="size-6" />
              </button>
              <button type="button" onClick={() => go(1)} className="absolute right-3 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#12131B] shadow-lg hover:bg-white" aria-label="Nächster Entwurf">
                <ChevronRight className="size-6" />
              </button>
            </>
          )}
        </div>

        <div className={cn(card, "flex flex-col p-5")}>
          <T as="h4" path={["items", i, "name"]} value={item.name} className="block text-[22px] font-semibold leading-[1.2] tracking-[-0.02em]" placeholder="Name" />
          <div className="mt-2">
            <Stars value={item.score} scope={scope} path={["items", i, "score"]} />
          </div>
          <T as="p" path={["items", i, "text"]} value={item.text} multiline className="mt-3 text-[15.5px] leading-[1.5]" placeholder="Unser Eindruck in einem Satz" />
          {(item.pros.length > 0 || edit) && (
            <div className="mt-4">
              <p className="mb-1.5 text-[12.5px] font-semibold text-emerald-700">Stark</p>
              <ListEdit items={item.pros} path={["items", i, "pros"]} good label="Stärke" />
            </div>
          )}
          {(item.cons.length > 0 || edit) && (
            <div className="mt-4">
              <p className="mb-1.5 text-[12.5px] font-semibold text-rose-700">Schwächer</p>
              <ListEdit items={item.cons} path={["items", i, "cons"]} good={false} label="Schwäche" />
            </div>
          )}
          <div className="mt-auto pt-5">
            {choose ? (
              <button type="button" onClick={() => choose(scope, ["items", i, "pick"], !item.pick)} aria-pressed={item.pick} className={cn("flex h-12 w-full items-center justify-center gap-2 rounded-full text-[15px] font-semibold transition-colors", item.pick ? "bg-amber-400 text-black" : "border-2 border-(--fg)/15 hover:border-amber-400")}>
                <Star className={cn("size-5", item.pick && "fill-current")} />
                {item.pick ? "Favorit" : "Als Favorit markieren"}
              </button>
            ) : (
              item.pick && (
                <span className="flex h-12 items-center justify-center gap-2 rounded-full bg-amber-400 text-[15px] font-semibold text-black">
                  <Star className="size-5 fill-current" /> Unsere Empfehlung
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {b.items.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
          {b.items.map((x, k) => (
            <button key={k} type="button" onClick={() => setIndex(k)} aria-current={k === i} title={x.name} className={cn("relative h-[74px] w-[100px] shrink-0 overflow-hidden rounded-[10px] border-2 bg-[#0e0f15] transition-[border-color,opacity]", k === i ? "border-(--p)" : "border-transparent opacity-60 hover:opacity-100")}>
              {x.image && <img src={imageUrl(x.image)} alt="" loading="lazy" className="h-full w-full object-cover object-top" />}
              {x.pick && <Star className="absolute right-1 top-1 size-4 fill-amber-400 text-amber-400 drop-shadow" />}
            </button>
          ))}
        </div>
      )}
      {zoom && item.image && <Lightbox src={imageUrl(item.image)} alt={item.name} onClose={() => setZoom(false)} />}
    </div>
  );
}

/** Options without pictures – e.g. names – side by side. */
function Compare({ b }: { b: OptionsBlock }) {
  const scope = useScope();
  const choose = useChoose();
  return (
    <div>
      <T as="h3" path={["title"]} value={b.title} className={cn(h3, "mb-3 block")} placeholder="Überschrift" />
      <div className="grid gap-3 @3xl:grid-cols-2 @6xl:grid-cols-3">
        {b.items.map((item, i) => (
          <article key={i} className={cn(card, "group/item relative flex flex-col p-5", item.pick && "border-(--p) shadow-[0_0_0_1.5px_var(--p)]")}>
            <div className="flex items-start justify-between gap-3">
              <T as="h4" path={["items", i, "name"]} value={item.name} className="block text-[21px] font-semibold leading-[1.2] tracking-[-0.015em]" placeholder="Name" />
              <Stars value={item.score} scope={scope} path={["items", i, "score"]} />
            </div>
            <T as="p" path={["items", i, "text"]} value={item.text} multiline className="mt-1.5 text-[14.5px] leading-[1.5] text-(--mut)" placeholder="Kurz gesagt" />
            <div className="mt-4 space-y-3">
              <ListEdit items={item.pros} path={["items", i, "pros"]} good label="Pro" />
              <ListEdit items={item.cons} path={["items", i, "cons"]} good={false} label="Contra" />
            </div>
            <div className="mt-auto pt-4">
              {choose ? (
                <button type="button" onClick={() => choose(scope, ["items", i, "pick"], !item.pick)} className={cn(chip, "cursor-pointer", item.pick ? "bg-(--p) text-(--p-on)" : "border border-dashed border-(--fg)/25 text-(--mut) hover:border-(--p)")}>
                  <Star className={cn("size-3", item.pick && "fill-current")} /> {item.pick ? "Unsere Wahl" : "Wählen"}
                </button>
              ) : (
                item.pick && (
                  <span className={cn(chip, "bg-(--p) text-(--p-on)")}>
                    <Star className="size-3 fill-current" /> Unsere Empfehlung
                  </span>
                )
              )}
            </div>
            <ItemTools path={["items"]} index={i} count={b.items.length} />
          </article>
        ))}
      </div>
      <AddItem path={["items"]} item={{ name: "Neue Option", text: "", pros: [], cons: [], score: 3, pick: false }} label="Option" className="mt-3" />
    </div>
  );
}

// ---------------------------------------------------------------- web addresses: a marketing check
const statusChip = {
  free: ["frei", "bg-emerald-50 text-emerald-700", Check],
  taken: ["vergeben", "bg-rose-50 text-rose-700", X],
  unknown: ["ungeprüft", "bg-(--fg)/[0.06] text-(--mut)", CircleDashed],
} as const;

const levelDot = ["bg-rose-500", "bg-amber-400", "bg-emerald-500"];
const levelIcon = [X, Minus, Check];
const levelTone = ["text-rose-600", "text-amber-600", "text-emerald-600"];
const shortLabel: Record<CriterionKey, string> = { brand: "Marke", trust: "Vertrauen", confusion: "Verwechslung", memory: "Merkbar", phone: "Telefon", future: "Zukunft" };

function StrengthBar({ score, muted }: { score: number; muted?: boolean }) {
  const tone = muted ? "bg-(--fg)/20" : score >= 7 ? "bg-emerald-500" : score >= 5 ? "bg-amber-400" : "bg-rose-400";
  return (
    <span className="flex items-center gap-2">
      <span className="flex gap-[3px]" aria-hidden="true">
        {Array.from({ length: 10 }, (_, k) => (
          <span key={k} className={cn("h-2.5 w-[7px] rounded-[2px]", k < score ? tone : "bg-(--fg)/10")} />
        ))}
      </span>
      <span className="text-[13px] font-semibold tabular-nums">{score}/10</span>
    </span>
  );
}

function Domains({ b }: { b: DomainsBlock }) {
  const doc = useContext(DocContext)!;
  const tools = useTools();
  const scope = useScope();
  const choose = useChoose();
  const edit = useEditApi();
  const [all, setAll] = useState(false);
  const ctx = domainContext(doc);
  const ranked = rankDomains(b, ctx);
  const top = ranked.find((d) => d.item.pick) ?? ranked.find((d) => d.item.status === "free") ?? ranked[0];
  const rest = ranked.filter((d) => d !== top);
  const shown = all ? rest : rest.slice(0, 8);
  const checked = b.items.map((d) => d.checked).filter(Boolean).sort().at(-1);
  const busy = tools?.busy.has(scope);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <T as="h3" path={["title"]} value={b.title} className={h3} placeholder="Überschrift" />
        <span className="flex items-center gap-2 text-[12.5px] text-(--mut)">
          {checked ? `Geprüft am ${new Date(checked).toLocaleDateString("de-DE")} direkt bei der Vergabestelle` : "Noch nicht geprüft"}
          {tools && (
            <button type="button" onClick={() => tools.checkDomains(scope)} disabled={busy} className={cn(chip, "h-8 cursor-pointer bg-(--fg) px-3.5 text-white disabled:opacity-60")}>
              {busy ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />} Jetzt prüfen
            </button>
          )}
        </span>
      </div>

      {top && (
        <div className="rounded-[22px] border-2 border-(--p) bg-white p-6 @3xl:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.12em] text-(--p)">
                <Star className="size-4 fill-amber-400 text-amber-400" /> {top.item.pick ? "Unsere Wahl" : "Die stärkste freie Adresse"}
              </p>
              <p className="mt-2 break-all font-mono text-[30px] font-semibold leading-[1.1] @3xl:text-[44px]">{top.item.domain}</p>
              <p className="mt-2 text-[16px] font-medium">{top.strength.verdict}</p>
            </div>
            <div className="flex flex-col items-start gap-2 @3xl:items-end">
              <span className={cn(chip, "px-3 py-1.5 text-[13px]", top.item.status === "free" ? "bg-emerald-500 text-white" : top.item.status === "taken" ? "bg-rose-500 text-white" : "bg-(--fg)/10 text-(--mut)")}>
                {top.item.status === "free" ? "✓ frei – jetzt sichern" : top.item.status === "taken" ? "vergeben" : "noch prüfen"}
              </span>
              <StrengthBar score={top.strength.score} />
            </div>
          </div>
          <p className="mt-6 text-[12.5px] font-semibold uppercase tracking-[0.12em] text-(--mut)">Der Marketing-Check</p>
          <ul className="mt-3 grid gap-3 @3xl:grid-cols-2">
            {top.strength.criteria.map((c) => {
              const Icon = levelIcon[c.level];
              return (
                <li key={c.key} className="flex gap-3 rounded-[14px] bg-(--bg) p-3.5">
                  <span className={cn("mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-white", levelDot[c.level])}>
                    <Icon className="size-3.5" strokeWidth={3} />
                  </span>
                  <span>
                    <span className="block text-[14.5px] font-semibold">{criteria.find((x) => x.key === c.key)?.label}</span>
                    <span className="mt-0.5 block text-[14px] leading-[1.45] text-(--mut)">{c.text}</span>
                  </span>
                </li>
              );
            })}
          </ul>
          {top.item.note && (
            <p className="mt-4 rounded-[14px] bg-(--soft) px-4 py-3 text-[15px] leading-[1.45]">
              <b className="text-(--p)">Unser Plan: </b>
              {top.item.note}
            </p>
          )}
        </div>
      )}

      <p className="mb-3 mt-8 text-[12.5px] font-semibold uppercase tracking-[0.12em] text-(--mut)">Die Alternativen im Vergleich</p>
      <div className={cn(card, "overflow-x-auto")}>
        <table className="w-full min-w-[880px] border-collapse text-[14px]">
          <thead>
            <tr className="border-b border-(--line) text-left">
              <th className="p-3 font-medium text-(--mut)">Adresse</th>
              {criteria.map((c) => (
                <th key={c.key} className="p-2 text-center text-[12px] font-medium text-(--mut)" title={c.question}>
                  {shortLabel[c.key]}
                </th>
              ))}
              <th className="p-3 font-medium text-(--mut)">Stärke</th>
              <th className="p-3 font-medium text-(--mut)">Fazit</th>
              {choose && <th />}
            </tr>
          </thead>
          <tbody>
            {shown.map(({ item, index, strength }) => {
              const taken = item.status === "taken";
              const [label, style, Icon] = statusChip[item.status] ?? statusChip.unknown;
              return (
                <tr key={index} className={cn("border-b border-(--line) last:border-0", taken && "bg-(--fg)/[0.025]")}>
                  <td className="min-w-[230px] p-3">
                    <span className={cn("block whitespace-nowrap font-mono text-[14.5px] font-medium", taken && "text-(--mut) line-through decoration-(--fg)/30")}>{item.domain}</span>
                    <span className={cn(chip, "mt-1 px-2 py-0.5 text-[11px]", style)}>
                      <Icon className="size-3" strokeWidth={3} /> {label}
                    </span>
                  </td>
                  {criteria.map((c) => {
                    const crit = strength.criteria.find((x) => x.key === c.key)!;
                    return (
                      <td key={c.key} className="p-2 text-center" title={crit.text}>
                        <span className={cn("inline-block size-3.5 rounded-full", taken ? "bg-(--fg)/15" : levelDot[crit.level])} aria-label={`${c.label}: ${crit.text}`} />
                      </td>
                    );
                  })}
                  <td className="p-3">
                    <StrengthBar score={strength.score} muted={taken} />
                  </td>
                  <td className="p-3 text-[13.5px] leading-[1.4] text-(--mut)">{item.note || strength.verdict}</td>
                  {choose && (
                    <td className="p-3">
                      {!taken && (
                        <button type="button" onClick={() => b.items.forEach((_, k) => choose(scope, ["items", k, "pick"], k === index))} className={cn(chip, "cursor-pointer whitespace-nowrap border border-dashed border-(--fg)/25 text-(--mut) hover:border-(--p) hover:text-(--p)")}>
                          <Star className="size-3" /> Wählen
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-(--mut)">
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-emerald-500" /> gut</span>
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-amber-400" /> geht so</span>
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-rose-500" /> schwach</span>
          <span>· Punkte antippen oder darüberfahren für die Begründung</span>
        </p>
        {rest.length > 8 && (
          <button type="button" onClick={() => setAll(!all)} className="text-[13.5px] font-medium text-(--p) hover:underline">
            {all ? "Weniger zeigen" : `Alle ${rest.length + 1} Adressen zeigen`}
          </button>
        )}
      </div>

      <Details title="So bewerten wir eine Adresse">
        <ul className="grid gap-3 @3xl:grid-cols-2">
          {criteria.map((c) => (
            <li key={c.key} className={cn(card, "p-4")}>
              <p className="text-[15px] font-semibold">
                {c.label} <span className="text-[12.5px] font-normal text-(--mut)">· zählt {c.weight === 3 ? "dreifach" : c.weight === 2 ? "doppelt" : "einfach"}</span>
              </p>
              <p className="mt-1 text-[14px] text-(--mut)">{c.question}</p>
            </li>
          ))}
        </ul>
      </Details>

      {edit && (
        <Details title="Adressen bearbeiten und Anmerkungen" count={b.items.length}>
          <div className={cn(card, "divide-y divide-(--line)")}>
            {b.items.map((item, i) => (
              <div key={i} className="group/item relative grid gap-2 px-4 py-2.5 @3xl:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
                <T path={["items", i, "domain"]} value={item.domain} className="font-mono text-[14px]" placeholder="adresse.de" />
                <T path={["items", i, "note"]} value={item.note} className="text-[13.5px] text-(--mut)" placeholder="Anmerkung, z. B. „bei Strato reserviert“" />
                <ItemTools path={["items"]} index={i} count={b.items.length} />
              </div>
            ))}
          </div>
          <AddItem path={["items"]} item={{ domain: "", status: "unknown", checked: "", note: "", pick: false }} label="Adresse" className="mt-3" />
        </Details>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- new customers: the way to you, the channels
const CHANNEL_ICONS: Record<string, LucideIcon> = { pin: MapPin, handshake: Handshake, star: Star, globe: Globe, book: BookOpen, rocket: Rocket, megaphone: Megaphone, users: Users, camera: Camera, search: Search, calendar: CalendarCheck, phone: Phone, store: Store };
const iconFor = (key: string) => CHANNEL_ICONS[key] ?? Star;

function Journey({ b }: { b: JourneyBlock }) {
  const editing = !!useEditApi();
  return (
    <div>
      <T as="h3" path={["title"]} value={b.title} className={cn(h3, "mb-4 block")} placeholder="Überschrift" />
      <ol className="grid gap-3 @4xl:grid-cols-4">
        {b.items.map((step, i) => {
          const Icon = iconFor(step.icon);
          return (
            <li key={i} className="group/item relative">
              <div className={cn(card, "h-full p-5")}>
                <span className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-[14px] bg-(--soft) text-(--p)">
                    <Icon className="size-6" strokeWidth={1.8} />
                  </span>
                  <span className="text-[28px] font-semibold leading-none text-(--fg)/10">{i + 1}</span>
                </span>
                <T as="h4" path={["items", i, "title"]} value={step.title} className="mt-4 block text-[19px] font-semibold" placeholder="Schritt" />
                <T as="p" path={["items", i, "text"]} value={step.text} multiline className="mt-1 text-[15px] leading-[1.45] text-(--mut)" placeholder="Was passiert" />
              </div>
              {i < b.items.length - 1 && (
                <span className="absolute -right-[13px] top-1/2 z-10 hidden size-6 -translate-y-1/2 items-center justify-center rounded-full bg-(--p) text-(--p-on) shadow @4xl:flex" aria-hidden="true">
                  <ChevronRight className="size-4" strokeWidth={3} />
                </span>
              )}
              <ItemTools path={["items"]} index={i} count={b.items.length} />
            </li>
          );
        })}
      </ol>
      {(b.note || editing) && (
        <p className="mt-3 flex items-center gap-3 rounded-[14px] border border-dashed border-(--p)/40 bg-(--soft) px-4 py-3 text-[15px]">
          <Handshake className="size-5 shrink-0 text-(--p)" />
          <T path={["note"]} value={b.note} className="min-w-0 flex-1" placeholder="Der zweite Weg" />
        </p>
      )}
    </div>
  );
}

const columns: { when: ChannelsBlock["items"][number]["when"]; label: string; hint: string; tone: string }[] = [
  { when: "Zuerst", label: "Zuerst", hint: "ab Woche 1", tone: "bg-emerald-500 text-white" },
  { when: "Danach", label: "Danach", hint: "im ersten Monat", tone: "bg-amber-400 text-black" },
  { when: "Später", label: "Später", hint: "wenn alles läuft", tone: "bg-(--fg)/80 text-white" },
];

function Channels({ b }: { b: ChannelsBlock }) {
  const choose = useChoose();
  const scope = useScope();
  return (
    <div>
      <T as="h3" path={["title"]} value={b.title} className={cn(h3, "mb-4 block")} placeholder="Überschrift" />
      <div className="grid gap-4 @4xl:grid-cols-3">
        {columns.map((col) => {
          const items = b.items.map((item, index) => ({ item, index })).filter(({ item }) => item.when === col.when);
          return (
            <div key={col.when} className="rounded-[20px] bg-(--fg)/[0.035] p-3">
              <p className="mb-3 flex items-center gap-2 px-1">
                <span className={cn(chip, col.tone)}>{col.label}</span>
                <span className="text-[13px] text-(--mut)">{col.hint}</span>
              </p>
              <ul className="space-y-2.5">
                {items.map(({ item, index }) => {
                  const Icon = iconFor(item.icon);
                  const free = /kostenlos|im paket|klein/i.test(item.cost);
                  return (
                    <li key={index} className={cn(card, "group/item relative p-4")}>
                      <div className="flex items-start gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-(--soft) text-(--p)">
                          <Icon className="size-5" strokeWidth={1.8} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <T as="h4" path={["items", index, "name"]} value={item.name} className="block text-[16.5px] font-semibold leading-tight" placeholder="Weg" />
                          <T as="p" path={["items", index, "text"]} value={item.text} multiline className="mt-1 text-[14px] leading-[1.45] text-(--mut)" placeholder="Was es bringt" />
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-2 border-t border-(--line) pt-3">
                        <T path={["items", index, "cost"]} value={item.cost} className={cn(chip, free ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800")} placeholder="Kosten" />
                        <span className="flex items-center gap-1.5 text-[12px] text-(--mut)">
                          Wirkung
                          {[1, 2, 3].map((n) => (
                            <button
                              key={n}
                              type="button"
                              disabled={!choose}
                              onClick={() => choose?.(scope, ["items", index, "effect"], n)}
                              className={cn("h-3 w-4 rounded-[3px]", n <= item.effect ? "bg-(--p)" : "bg-(--fg)/10", choose && "cursor-pointer")}
                              aria-label={choose ? `Wirkung ${n} von 3` : undefined}
                              tabIndex={choose ? 0 : -1}
                            />
                          ))}
                        </span>
                      </div>
                      <ItemTools path={["items"]} index={index} count={b.items.length} />
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
      <AddItem path={["items"]} item={{ name: "Neuer Weg", icon: "star", when: "Danach", text: "", cost: "kostenlos", effect: 2 }} label="Weg" className="mt-3" />
    </div>
  );
}

// ---------------------------------------------------------------- competition: who is good, who is weak, why
const checks: { label: string; ok: (a: Audit) => boolean | null; show?: (a: Audit) => string }[] = [
  { label: "Erreichbar", ok: (a) => !a.error && !!a.status && a.status < 400, show: (a) => (a.error ? a.error : `${a.status}`) },
  { label: "Verschlüsselt (HTTPS)", ok: (a) => !!a.https },
  { label: "Lädt schnell", ok: (a) => (a.ms ?? 99999) < 1500, show: (a) => (a.ms ? `${(a.ms / 1000).toFixed(1).replace(".", ",")} s` : "–") },
  { label: "Fürs Handy gebaut", ok: (a) => !!a.viewport },
  { label: "Titel für Google", ok: (a) => (a.title?.length ?? 0) >= 15 && (a.title?.length ?? 0) <= 70 },
  { label: "Beschreibung für Google", ok: (a) => (a.description?.length ?? 0) >= 70 },
  { label: "Firmendaten für Google", ok: (a) => !!a.localBusiness },
  { label: "Telefon antippbar", ok: (a) => !!a.phone || !!a.whatsapp },
  { label: "Formular oder Terminbuchung", ok: (a) => (a.forms ?? 0) > 0 || !!a.booking },
  { label: "Bewertungen sichtbar", ok: (a) => !!a.reviews },
  { label: "Impressum", ok: (a) => !!a.impressum },
  { label: "Datenschutz", ok: (a) => !!a.datenschutz },
];


function AuditTable({ b }: { b: AuditBlock }) {
  const tools = useTools();
  const scope = useScope();
  return (
    <>
      <div className={cn(card, "overflow-x-auto")}>
        <table className="w-full min-w-[560px] border-collapse text-[13.5px]">
          <thead>
            <tr className="border-b border-(--line)">
              <th className="w-[200px] p-3 text-left font-medium text-(--mut)">Prüfpunkt</th>
              {b.items.map((site, i) => (
                <th key={i} className={cn("group/item relative min-w-[140px] p-3 text-left align-top font-normal", site.own && "bg-(--soft)")}>
                  <T path={["items", i, "name"]} value={site.name} className="block text-[14px] font-semibold" placeholder="Name" />
                  <T path={["items", i, "url"]} value={site.url} className="block max-w-[200px] truncate text-[12px] text-(--mut)" placeholder="adresse.de" />
                  {site.result?.psi && (
                    <span className="mt-1 block text-[11.5px] text-(--mut)">
                      Google mobil: <b className="text-(--fg)">{site.result.psi.performance}</b> Tempo · <b className="text-(--fg)">{site.result.psi.seo}</b> SEO
                    </span>
                  )}
                  {tools && (
                    <button type="button" onClick={() => tools.psi(scope, i)} disabled={tools.busy.has(`${scope}:psi:${i}`)} className="mt-1 inline-flex items-center gap-1 rounded-md py-0.5 text-[11.5px] font-medium text-(--p) hover:underline disabled:opacity-50">
                      {tools.busy.has(`${scope}:psi:${i}`) ? <Loader2 className="size-3 animate-spin" /> : <Gauge className="size-3" />} Google-Messung
                    </button>
                  )}
                  <ItemTools path={["items"]} index={i} count={b.items.length} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {checks.map((check) => (
              <tr key={check.label} className="border-b border-(--line) last:border-0">
                <td className="p-3 text-(--mut)">{check.label}</td>
                {b.items.map((site, i) => {
                  const a = site.result;
                  const ok = a ? check.ok(a) : null;
                  return (
                    <td key={i} className={cn("p-3", site.own && "bg-(--soft)")}>
                      {ok === null ? (
                        <span className="text-(--mut)">–</span>
                      ) : (
                        <span className={cn("inline-flex items-center gap-1.5 font-medium", ok ? "text-emerald-700" : "text-rose-600")}>
                          {ok ? <Check className="size-4" strokeWidth={3} /> : <X className="size-4" strokeWidth={3} />}
                          {check.show && a ? <span className="text-[12.5px] font-normal text-(--mut)">{check.show(a)}</span> : null}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddItem path={["items"]} item={{ name: "Neue Website", url: "", own: false, result: null }} label="Website" className="mt-3" />
    </>
  );
}

// ---------------------------------------------------------------- the plain blocks

/** What a website does well or badly, in words a client understands – most important first. */
const traits: { ok: (a: Audit) => boolean; good: string; bad: string; chance: (n: number, m: number) => string }[] = [
  { ok: (a) => !!a.reviews, good: "Zeigt Bewertungen", bad: "Keine Bewertungen sichtbar", chance: (n, m) => `${n} von ${m} zeigen keine Bewertungen – Ihre Google-Sterne kommen bei Ihnen gleich nach oben.` },
  { ok: (a) => (a.forms ?? 0) > 0 || !!a.booking, good: "Anfrage direkt online", bad: "Kein Formular, keine Terminbuchung", chance: (n, m) => `${n} von ${m} haben keine Online-Anfrage – bei Ihnen: Termin mit einem Klick.` },
  { ok: (a) => !!a.phone || !!a.whatsapp, good: "Anruf mit einem Tipp", bad: "Telefon nicht antippbar", chance: (n, m) => `${n} von ${m} lassen sich am Handy nicht direkt anrufen – bei Ihnen ein Tipp.` },
  { ok: (a) => !!a.localBusiness, good: "Firmendaten für Google hinterlegt", bad: "Keine Firmendaten für Google", chance: (n, m) => `${n} von ${m} geben Google keine Firmendaten – Ihre Seite bekommt sie, das hilft auf der Karte.` },
  { ok: (a) => (a.ms ?? 99999) < 1500, good: "Lädt schnell", bad: "Lädt langsam", chance: (n, m) => `${n} von ${m} laden langsam – Ihre Seite öffnet sich in unter einer Sekunde.` },
  { ok: (a) => !!a.viewport, good: "Gut auf dem Handy", bad: "Nicht fürs Handy gebaut", chance: (n, m) => `${n} von ${m} sind nicht fürs Handy gebaut.` },
  { ok: (a) => (a.description?.length ?? 0) >= 70 && (a.title?.length ?? 0) >= 15, good: "Bei Google gut beschrieben", bad: "Bei Google schwach beschrieben", chance: (n, m) => `${n} von ${m} sind bei Google schwach beschrieben.` },
  { ok: (a) => !!a.https, good: "Sicher verschlüsselt", bad: "Nicht verschlüsselt", chance: (n, m) => `${n} von ${m} sind nicht verschlüsselt.` },
  { ok: (a) => !!a.impressum && !!a.datenschutz, good: "Impressum & Datenschutz da", bad: "Pflichtangaben fehlen", chance: (n, m) => `${n} von ${m} fehlen Pflichtangaben.` },
];

const verdictOf = (score: number) => (score >= 85 ? ["Starker Mitbewerber", "text-emerald-700 bg-emerald-50"] : score >= 70 ? ["Solide, mit Lücken", "text-amber-800 bg-amber-50"] : ["Schwach aufgestellt", "text-rose-700 bg-rose-50"]);

function Competition({ b }: { b: AuditBlock }) {
  const tools = useTools();
  const scope = useScope();
  const busy = tools?.busy.has(scope);
  const sites = b.items.map((site, index) => ({ site, index, score: site.result?.score ?? -1 })).sort((x, y) => y.score - x.score);
  const rivals = sites.filter((s) => !s.site.own && s.site.result && !s.site.result.error);
  const chances = traits
    .map((t) => ({ t, n: rivals.filter((s) => !t.ok(s.site.result!)).length }))
    .filter((c) => c.n > 0 && c.n >= Math.ceil(rivals.length / 3))
    .sort((x, y) => y.n - x.n)
    .slice(0, 3);
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <T as="h3" path={["title"]} value={b.title} className={h3} placeholder="Überschrift" />
        {tools && b.items.length > 0 && (
          <button type="button" onClick={() => tools.audit(scope)} disabled={busy} className={cn(chip, "h-8 cursor-pointer bg-(--fg) px-3.5 text-white disabled:opacity-60")}>
            {busy ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />} Jetzt prüfen
          </button>
        )}
      </div>

      {chances.length > 0 && (
        <div className="mb-5 grid gap-3 @4xl:grid-cols-3">
          {chances.map(({ t, n }) => (
            <div key={t.bad} className="rounded-[18px] bg-(--p) p-5 text-(--p-on)">
              <p className="text-[34px] font-semibold leading-none tracking-[-0.02em]">
                {n} <span className="text-[18px] font-medium opacity-75">von {rivals.length}</span>
              </p>
              <p className="mt-2 text-[15px] font-medium leading-[1.4]">{t.chance(n, rivals.length).replace(/^\d+ von \d+ /, "")}</p>
            </div>
          ))}
        </div>
      )}

      <ol className="space-y-3">
        {sites.map(({ site, index, score }, rank) => {
          const a = site.result;
          const [label, tone] = verdictOf(score);
          const good = a ? traits.filter((t) => t.ok(a)).slice(0, 3) : [];
          const bad = a ? traits.filter((t) => !t.ok(a)).slice(0, 3) : [];
          return (
            <li key={index} className={cn(card, "group/item relative grid gap-4 p-5 @4xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)]", site.own && "border-(--p) shadow-[0_0_0_1.5px_var(--p)]")}>
              <div className="flex gap-4">
                <span className="text-[22px] font-semibold tabular-nums leading-none text-(--fg)/25">{rank + 1}</span>
                <div className="min-w-0 flex-1">
                  <T as="h4" path={["items", index, "name"]} value={site.name} className={cn("block text-[17px] font-semibold leading-tight", site.own && "text-(--p)")} placeholder="Name" />
                  <T path={["items", index, "note"]} value={site.note} className="mt-0.5 block text-[13.5px] text-(--mut)" placeholder="Wer ist das? (optional)" />
                  {score >= 0 ? (
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <span className="text-[30px] font-semibold leading-none tabular-nums">{score}</span>
                      <span className="h-2 w-24 overflow-hidden rounded-full bg-(--fg)/[0.08]">
                        <span className={cn("block h-full rounded-full", site.own ? "bg-(--p)" : score >= 85 ? "bg-emerald-500" : score >= 70 ? "bg-amber-400" : "bg-rose-400")} style={{ width: `${score}%` }} />
                      </span>
                      {!site.own && <span className={cn(chip, tone)}>{label}</span>}
                      {site.own && a?.noindex && <span className={cn(chip, "bg-(--soft) text-(--p)")}>Vorschau – noch für Google gesperrt</span>}
                    </div>
                  ) : (
                    <p className="mt-3 text-[13.5px] text-(--mut)">{a?.error ?? "Noch nicht geprüft"}</p>
                  )}
                </div>
              </div>
              <div>
                <p className="mb-1.5 text-[12.5px] font-semibold text-emerald-700">Macht gut</p>
                <ul className="space-y-1">
                  {good.map((t) => (
                    <li key={t.good} className="flex gap-2 text-[14.5px]">
                      <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" strokeWidth={3} /> {t.good}
                    </li>
                  ))}
                  {!good.length && <li className="text-[14px] text-(--mut)">–</li>}
                </ul>
              </div>
              <div>
                <p className="mb-1.5 text-[12.5px] font-semibold text-rose-700">Schwach</p>
                <ul className="space-y-1">
                  {bad.map((t) => (
                    <li key={t.bad} className="flex gap-2 text-[14.5px]">
                      <X className="mt-0.5 size-4 shrink-0 text-rose-500" strokeWidth={3} /> {t.bad}
                    </li>
                  ))}
                  {!bad.length && a && <li className="text-[14px] text-(--mut)">Keine Schwachstelle in den Grundlagen</li>}
                </ul>
              </div>
              <ItemTools path={["items"]} index={index} count={b.items.length} />
            </li>
          );
        })}
      </ol>
      <p className="mt-2 text-[12.5px] text-(--mut)">Punkte 0–100: wie gut eine Website die Grundlagen erfüllt – schnell, fürs Handy, bei Google gut beschrieben, Kontakt mit einem Tipp, Vertrauen.</p>
      <Details title="Alle Prüfpunkte einzeln" count={checks.length}>
        <AuditTable b={b} />
      </Details>
    </div>
  );
}

// ---------------------------------------------------------------- the plain blocks
function Cards({ b }: { b: Extract<FolioBlock, { type: "cards" }> }) {
  return (
    <div>
      <T as="h3" path={["title"]} value={b.title} className={cn(h3, "mb-3 block")} placeholder="Überschrift" />
      <div className="grid gap-3 @2xl:grid-cols-2 @5xl:grid-cols-3">
        {b.items.map((item, i) => (
          <article key={i} className={cn(card, "group/item relative p-5")}>
            <T path={["items", i, "tag"]} value={item.tag} className={cn(chip, "bg-(--soft) text-(--p)")} placeholder="Stichwort" />
            <T as="h4" path={["items", i, "title"]} value={item.title} className="mt-3 block text-[17px] font-semibold leading-[1.25]" placeholder="Titel" />
            <T as="p" path={["items", i, "text"]} value={item.text} multiline className="mt-1.5 text-[14.5px] leading-[1.5] text-(--mut)" placeholder="Beschreibung" />
            <ItemTools path={["items"]} index={i} count={b.items.length} />
          </article>
        ))}
      </div>
      <AddItem path={["items"]} item={{ title: "Neuer Punkt", text: "", tag: "" }} label="Karte" className="mt-3" />
    </div>
  );
}

const whenTone: Record<string, string> = { Zuerst: "bg-emerald-500 text-white", Danach: "bg-amber-400 text-black", Später: "bg-(--fg)/10 text-(--mut)" };

function Table({ b }: { b: TableBlock }) {
  if (b.style === "ranked") {
    return (
      <div>
        <T as="h3" path={["title"]} value={b.title} className={cn(h3, "mb-3 block")} placeholder="Überschrift" />
        <ol className="grid gap-2.5 @4xl:grid-cols-2">
          {b.rows.map((row, r) => (
            <li key={r} className={cn(card, "group/item relative flex gap-4 p-4")}>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-(--fg) text-[15px] font-semibold text-white">{r + 1}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <T as="h4" path={["rows", r, 0]} value={row[0]} className="text-[16.5px] font-semibold" placeholder="Weg" />
                  <T path={["rows", r, 1]} value={row[1]} className={cn(chip, whenTone[row[1]] ?? "bg-(--soft) text-(--p)")} placeholder="Wann" />
                </div>
                <T as="p" path={["rows", r, 2]} value={row[2]} multiline className="mt-1 text-[14.5px] leading-[1.45] text-(--mut)" placeholder="Was wir tun" />
              </div>
              <ItemTools path={["rows"]} index={r} count={b.rows.length} />
            </li>
          ))}
        </ol>
        <AddItem path={["rows"]} item={["", "Danach", ""]} label="Weg" className="mt-3" />
      </div>
    );
  }
  return (
    <div>
      <T as="h3" path={["title"]} value={b.title} className={cn(h3, "mb-3 block")} placeholder="Überschrift" />
      <div className={cn(card, "overflow-x-auto")}>
        <table className="w-full min-w-[520px] border-collapse text-[14px]">
          <thead>
            <tr className="border-b border-(--line) text-left">
              {b.columns.map((col, c) => (
                <th key={c} className="p-3 font-medium text-(--mut)">
                  <T path={["columns", c]} value={col} placeholder="Spalte" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {b.rows.map((row, r) => (
              <tr key={r} className="group/item relative border-b border-(--line) last:border-0">
                {b.columns.map((_, c) => (
                  <td key={c} className={cn("p-3 align-top leading-[1.45]", c === 0 && "font-medium")}>
                    <T path={["rows", r, c]} value={row[c] ?? ""} multiline placeholder="–" />
                    {c === b.columns.length - 1 && <ItemTools path={["rows"]} index={r} count={b.rows.length} />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddItem path={["rows"]} item={b.columns.map(() => "")} label="Zeile" className="mt-3" />
    </div>
  );
}

function Checklist({ b }: { b: Extract<FolioBlock, { type: "checklist" }> }) {
  const choose = useChoose();
  const scope = useScope();
  return (
    <div>
      <T as="h3" path={["title"]} value={b.title} className={cn(h3, "mb-3 block")} placeholder="Überschrift" />
      <ul className={cn(card, "divide-y divide-(--line)")}>
        {b.items.map((item, i) => (
          <li key={i} className="group/item relative flex items-start gap-3 px-4 py-3">
            <button
              type="button"
              disabled={!choose}
              onClick={() => choose?.(scope, ["items", i, "done"], !item.done)}
              className={cn("mt-0.5 flex size-5 shrink-0 items-center justify-center border", b.status ? "rounded-full" : "rounded-md", item.done ? (b.status ? "border-emerald-500 bg-emerald-500 text-white" : "border-(--p) bg-(--p) text-(--p-on)") : "border-(--fg)/25", choose && "cursor-pointer")}
              aria-label={item.done ? "Erledigt" : "Offen"}
              tabIndex={choose ? 0 : -1}
            >
              {item.done && <Check className="size-3.5" strokeWidth={3} />}
            </button>
            <T path={["items", i, "text"]} value={item.text} multiline className={cn("min-w-0 flex-1 text-[15px] leading-[1.45]", item.done && !b.status && "text-(--mut) line-through")} placeholder="Aufgabe" />
            <T path={["items", i, "who"]} value={item.who} className={cn(chip, "shrink-0 bg-(--fg)/[0.06] text-(--mut)")} placeholder="Wer" />
            <ItemTools path={["items"]} index={i} count={b.items.length} />
          </li>
        ))}
      </ul>
      <AddItem path={["items"]} item={{ text: "", who: "Wir", done: false }} label="Punkt" className="mt-3" />
    </div>
  );
}

function Timeline({ b }: { b: Extract<FolioBlock, { type: "timeline" }> }) {
  return (
    <div>
      <T as="h3" path={["title"]} value={b.title} className={cn(h3, "mb-3 block")} placeholder="Überschrift" />
      <ol className="grid gap-3 @4xl:grid-flow-col @4xl:auto-cols-fr">
        {b.items.map((item, i) => (
          <li key={i} className={cn(card, "group/item relative p-5")}>
            <span className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-full bg-(--p) text-[14px] font-bold text-(--p-on)">{i + 1}</span>
              <T path={["items", i, "when"]} value={item.when} className="text-[13px] font-semibold uppercase tracking-[0.08em] text-(--p)" placeholder="Wann" />
            </span>
            <T as="h4" path={["items", i, "title"]} value={item.title} className="mt-3 block text-[18px] font-semibold" placeholder="Schritt" />
            <T as="p" path={["items", i, "text"]} value={item.text} multiline className="mt-1 text-[14.5px] leading-[1.5] text-(--mut)" placeholder="Was passiert" />
            <ItemTools path={["items"]} index={i} count={b.items.length} />
          </li>
        ))}
      </ol>
      <AddItem path={["items"]} item={{ when: "", title: "Neuer Schritt", text: "" }} label="Schritt" className="mt-3" />
    </div>
  );
}

function Packages({ b }: { b: PackagesBlock }) {
  const scope = useScope();
  const choose = useChoose();
  return (
    <div>
      <T as="h3" path={["title"]} value={b.title} className={cn(h3, "mb-3 block")} placeholder="Überschrift" />
      <div className="grid gap-3 @4xl:grid-cols-3">
        {b.items.map((item, i) => (
          <article key={i} className={cn(card, "group/item relative flex flex-col p-6", item.pick && "border-(--fg) bg-(--fg) text-white [--line:rgba(255,255,255,0.12)] [--mut:rgba(255,255,255,0.65)]")}>
            <div className="flex items-start justify-between gap-2">
              <T as="h4" path={["items", i, "name"]} value={item.name} className="block text-[21px] font-semibold" placeholder="Paket" />
              {choose ? (
                <button type="button" onClick={() => b.items.forEach((_, k) => choose(scope, ["items", k, "pick"], k === i && !item.pick))} className={cn(chip, "cursor-pointer", item.pick ? "bg-(--p) text-(--p-on)" : "border border-dashed border-current/30 opacity-70")}>
                  <Star className={cn("size-3", item.pick && "fill-current")} /> {item.pick ? "Empfohlen" : "Empfehlen"}
                </button>
              ) : (
                item.pick && (
                  <span className={cn(chip, "bg-(--p) text-(--p-on)")}>
                    <Star className="size-3 fill-current" /> Empfohlen
                  </span>
                )
              )}
            </div>
            <T as="p" path={["items", i, "text"]} value={item.text} className="mt-1 text-[14.5px] text-(--mut)" placeholder="Für wen" />
            <T path={["items", i, "price"]} value={item.price} className="mt-5 block text-[34px] font-semibold tracking-[-0.02em]" placeholder="Preis eintragen" />
            <T path={["items", i, "unit"]} value={item.unit} className="mt-0.5 block text-[13.5px] text-(--mut)" placeholder="einmalig · danach … im Monat" />
            <ul className="mt-5 flex-1 space-y-2 border-t border-(--line) pt-5">
              {item.features.map((f, k) => {
                // "Alles aus Start" is not a feature of its own: show it as the base, and what this package adds below it
                const base = k === 0 && /^alles aus/i.test(f);
                const extra = i > 0 && /^alles aus/i.test(item.features[0] ?? "") && k > 0;
                const more = i > 0 ? amount(item.price) - amount(b.items[i - 1].price) : 0;
                return (
                  <Fragment key={k}>
                    <li className={cn("group/item relative flex gap-2 text-[14.5px] leading-[1.45]", base && "rounded-[10px] bg-(--fg)/[0.06] px-3 py-2 font-medium")}>
                      {extra ? <Plus className="mt-0.5 size-4 shrink-0 text-(--p)" strokeWidth={3} /> : <Check className={cn("mt-0.5 size-4 shrink-0", base ? "text-(--mut)" : "text-(--p)")} strokeWidth={2.5} />}
                      <T path={["items", i, "features", k]} value={f} className="min-w-0 flex-1" placeholder="Leistung" />
                      <ItemTools path={["items", i, "features"]} index={k} count={item.features.length} />
                    </li>
                    {base && <li className="pt-2 text-[12.5px] font-semibold uppercase tracking-[0.1em] text-(--p)">{more > 0 ? `Dazu – für ${euro(more)} mehr` : "Dazu"}</li>}
                  </Fragment>
                );
              })}
            </ul>
            <AddItem path={["items", i, "features"]} item="" label="Leistung" className="mt-3" />
            <ItemTools path={["items"]} index={i} count={b.items.length} />
          </article>
        ))}
      </div>
    </div>
  );
}

function Rules({ b }: { b: Extract<FolioBlock, { type: "rules" }> }) {
  return (
    <div>
      <T as="h3" path={["title"]} value={b.title} className={cn(h3, "mb-3 block")} placeholder="Überschrift" />
      <div className="grid gap-3 @3xl:grid-cols-2">
        <div className={cn(card, "border-emerald-200 bg-emerald-50/70 p-5")}>
          <p className="mb-3 text-[15px] font-semibold text-emerald-800">Erlaubt</p>
          <ListEdit items={b.dos} path={["dos"]} good label="Punkt" />
        </div>
        <div className={cn(card, "border-rose-200 bg-rose-50/70 p-5")}>
          <p className="mb-3 text-[15px] font-semibold text-rose-800">Tabu</p>
          <ListEdit items={b.donts} path={["donts"]} good={false} label="Punkt" />
        </div>
      </div>
    </div>
  );
}

function TextBlock({ b }: { b: Extract<FolioBlock, { type: "text" }> }) {
  return (
    <div className={cn(card, "p-5")}>
      <T as="h3" path={["title"]} value={b.title} className={cn(h3, "mb-2 block")} placeholder="Überschrift" />
      <T as="p" path={["text"]} value={b.text} multiline className="text-[15.5px] leading-[1.6]" placeholder="Text" />
    </div>
  );
}

const euro = (n: number) => n.toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
/** "1.490 €" → 1490 */
const amount = (price: string) => Number(price.replace(/[^\d]/g, "")) || 0;

function Roi({ b }: { b: RoiBlock }) {
  const edit = useEditApi();
  const scope = useScope();
  const ready = b.invest > 0 && b.value > 0;
  if (!ready && !edit) return null;
  const field = (key: "invest" | "monthly" | "value", label: string) => (
    <label className="block">
      <span className="text-[12.5px] text-(--mut)">{label}</span>
      <input type="number" min={0} step={10} value={b[key] || ""} placeholder="0" onChange={(e) => edit?.set(scope, [key], Number(e.target.value) || 0)} className="mt-1 block h-10 w-full rounded-[10px] border border-(--line) bg-white px-3 text-[15px] tabular-nums outline-none focus:border-(--p)" />
    </label>
  );
  const months = (k: number) => {
    const net = k * b.value - b.monthly;
    return net > 0 ? Math.max(1, Math.ceil(b.invest / net)) : 0;
  };
  const span = (n: number) => (n ? (n === 1 ? "einem Monat" : `${n} Monaten`) : "–");
  const plain = (n: number) => (n ? (n === 1 ? "1 Monat" : `${n} Monate`) : "–");
  // a small investment is already paid by one new client – say so instead of the two-client example
  const k = months(1) && months(1) <= 6 ? 1 : 2;
  return (
    <div className={cn(card, "p-5 @3xl:p-6")}>
      <T as="h3" path={["title"]} value={b.title} className={cn(h3, "mb-2 block")} placeholder="Überschrift" />
      {ready &&
        (b.recurring ? (
          <p className="text-[22px] font-semibold leading-[1.3] tracking-[-0.01em] @3xl:text-[26px]">
            {k === 1 ? "Schon mit" : "Mit"} <span className="text-(--p)">{k === 1 ? "einem neuen Kunden" : "2 neuen Kunden"}</span> hat sich alles nach <span className="text-(--p)">{span(months(k))}</span> bezahlt gemacht.
          </p>
        ) : (
          <p className="text-[22px] font-semibold leading-[1.3] tracking-[-0.01em] @3xl:text-[26px]">
            Nach <span className="text-(--p)">{Math.ceil((b.invest + b.monthly * 12) / b.value)} Aufträgen</span> hat sich alles für ein Jahr bezahlt gemacht.
          </p>
        ))}
      <T as="p" path={["text"]} value={b.text} multiline className="mt-2 text-[14px] leading-[1.5] text-(--mut)" placeholder="Erklärung" />
      {edit && (
        <div className="mt-4 grid gap-4 @2xl:grid-cols-3">
          {field("invest", "Einmalige Investition (€)")}
          {field("monthly", "Laufende Kosten pro Monat (€)")}
          {field("value", b.unit)}
        </div>
      )}
      {ready && !b.recurring ? null : ready && (
        <p className="mt-3 text-[13.5px] text-(--mut)">
          Investition {euro(b.invest)}
          {b.monthly ? ` + ${euro(b.monthly)} im Monat` : ""} · gerechnet mit {euro(b.value)} pro Kunde und Monat · mit 1 Kunden: {plain(months(1))}, mit 3 Kunden: {plain(months(3))}
        </p>
      )}
    </div>
  );
}

function Block({ block }: { block: FolioBlock }) {
  switch (block.type) {
    case "cards":
      return <Cards b={block} />;
    case "options":
      return block.items.some((i) => i.image) ? <Gallery b={block} /> : <Compare b={block} />;
    case "domains":
      return <Domains b={block} />;
    case "audit":
      return <Competition b={block} />;
    case "journey":
      return <Journey b={block} />;
    case "channels":
      return <Channels b={block} />;
    case "table":
      return <Table b={block} />;
    case "checklist":
      return <Checklist b={block} />;
    case "timeline":
      return <Timeline b={block} />;
    case "packages":
      return <Packages b={block} />;
    case "rules":
      return <Rules b={block} />;
    case "text":
      return <TextBlock b={block} />;
    case "roi":
      return <Roi b={block} />;
  }
}

function Details({ title, count, children }: { title: string; count?: number; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4 print:hidden">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="inline-flex items-center gap-2 rounded-full border border-(--line) bg-white px-4 py-2 text-[13.5px] font-medium text-(--mut) transition-colors hover:border-(--p) hover:text-(--fg)">
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
        {title}
        {count !== undefined && <span className="text-(--mut)/70">({count})</span>}
      </button>
      {open && <div className="mt-4 space-y-8">{children}</div>}
    </div>
  );
}

// ---------------------------------------------------------------- pages
export function RoleBadge({ role, className }: { role: Chapter["role"]; className?: string }) {
  const r = roles[role];
  const Icon = r.icon;
  return (
    <span className={cn(chip, "bg-white text-(--fg) shadow-[0_0_0_1px_var(--line)]", className)}>
      <span className="flex size-4 items-center justify-center rounded-full" style={{ backgroundColor: r.tone }}>
        <Icon className="size-2.5 text-white" strokeWidth={2.5} />
      </span>
      {r.label}
    </span>
  );
}

export function ChapterView({ chapter, index, number, total }: { chapter: Chapter; index: number; number: number; total: number }) {
  const scope = `chapters.${index}`;
  const editing = !!useEditApi();
  // folios made before the short answers existed simply show none
  const reasons = chapter.reasons ?? [];
  const main = chapter.blocks.map((b, i) => [b, i] as const).filter(([b]) => !b.detail);
  const details = chapter.blocks.map((b, i) => [b, i] as const).filter(([b]) => b.detail);
  // a chapter that starts with pictures shows them first – you look at them together before talking about them
  const pictures = main[0]?.[0].type === "options" && main[0][0].items.some((i) => i.image) ? main[0] : null;
  const rest = pictures ? main.slice(1) : main;
  const renderMain = (list: typeof main) =>
    list.map(([block, b]) => (
      <BlockContext.Provider key={block.id} value={`${scope}.blocks.${b}`}>
        <Block block={block} />
      </BlockContext.Provider>
    ));
  return (
    <section id={`ch-${chapter.id}`} className="scroll-mt-20 break-before-page">
      <BlockContext.Provider value={scope}>
        <p className="text-[13px] font-semibold text-(--p)">
          Schritt {number} von {total}
        </p>
        <T as="h2" path={["title"]} value={chapter.title} className={cn(h2, "mt-1 block")} placeholder="Kapitel" />
        <T as="p" path={["lead"]} value={chapter.lead} className="mt-2 block text-[17px] text-(--mut)" placeholder="Worum es geht" />
      </BlockContext.Provider>
      {pictures && <div className="mt-6">{renderMain([pictures])}</div>}
      <BlockContext.Provider value={scope}>
        <div className={cn("rounded-[22px] bg-(--fg) p-6 text-white @3xl:p-8", pictures ? "mt-8" : "mt-6")}>
          <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.12em] text-white/55">
            <Star className="size-4 fill-amber-400 text-amber-400" /> Unsere Empfehlung
          </p>
          <T as="p" path={["short"]} value={chapter.short} className="mt-2 block text-[26px] font-semibold leading-[1.15] tracking-[-0.02em] @3xl:text-[34px]" placeholder="In wenigen Worten" />
          <T as="p" path={["pick"]} value={chapter.pick} multiline className="mt-2 max-w-[780px] text-[16px] leading-[1.5] text-white/75" placeholder="Die Empfehlung in einem Satz" />
          {(reasons.length > 0 || editing) && (
            <ul className="mt-5 grid gap-2 @3xl:grid-cols-3">
              {reasons.map((r, i) => (
                <li key={i} className="group/item relative flex gap-2 rounded-[12px] bg-white/[0.07] px-3.5 py-2.5 text-[14.5px] leading-[1.4]">
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" strokeWidth={3} />
                  <T path={["reasons", i]} value={r} className="min-w-0 flex-1" placeholder="Grund" />
                  <ItemTools path={["reasons"]} index={i} count={reasons.length} />
                </li>
              ))}
              <li className="empty:hidden">
                <AddItem path={["reasons"]} item="" label="Grund" />
              </li>
            </ul>
          )}
        </div>
      </BlockContext.Provider>

      {rest.length > 0 && <div className="mt-8 space-y-10">{renderMain(rest)}</div>}
      {details.length > 0 && (
        <Details title="Mehr Details" count={details.length}>
          {details.map(([block, b]) => (
            <BlockContext.Provider key={block.id} value={`${scope}.blocks.${b}`}>
              <Block block={block} />
            </BlockContext.Provider>
          ))}
        </Details>
      )}
    </section>
  );
}

/** What was looked at, in numbers a client understands. */
export function checkedFacts(doc: FolioDoc) {
  const blocks = doc.chapters.filter((c) => !c.hidden).flatMap((c) => c.blocks);
  const facts: string[] = [];
  const designs = blocks.find((b) => b.type === "options" && b.items.some((i) => i.image));
  if (designs?.type === "options") facts.push(`${designs.items.length} Entwürfe`);
  const domains = blocks.filter((b) => b.type === "domains").flatMap((b) => (b.type === "domains" ? b.items : []));
  if (domains.length) facts.push(`${domains.length} Internetadressen geprüft`);
  const sites = blocks.filter((b) => b.type === "audit").flatMap((b) => (b.type === "audit" ? b.items : []));
  if (sites.length) facts.push(`${sites.length} Websites verglichen`);
  return facts;
}

export function Cover({ doc }: { doc: FolioDoc }) {
  const facts = checkedFacts(doc);
  return (
    <header className="relative overflow-hidden rounded-[26px] bg-(--fg) px-6 py-12 text-white @3xl:px-12 @3xl:py-16">
      <div className="pointer-events-none absolute -right-24 -top-24 size-[460px] rounded-full opacity-45 blur-[100px]" style={{ background: "var(--p)" }} aria-hidden="true" />
      <div className="relative">
        <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-white/60">Ihr Plan</p>
        <BlockContext.Provider value="meta">
          <T as="h1" path={["client"]} value={doc.meta.client} className="mt-4 block text-[42px] font-semibold leading-[1.02] tracking-[-0.035em] @3xl:text-[68px]" placeholder="Kunde" />
          <p className="mt-3 text-[18px] text-white/70">
            <T path={["industry"]} value={doc.meta.industry} placeholder="Branche" /> · <T path={["city"]} value={doc.meta.city} placeholder="Ort" />
          </p>
        </BlockContext.Provider>
        <BlockContext.Provider value="">
          <T as="p" path={["intro"]} value={doc.intro} multiline className="mt-8 max-w-[640px] text-[19px] leading-[1.5] text-white/90" placeholder="Worum es geht" />
        </BlockContext.Provider>
        {facts.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-2">
            {facts.map((f) => (
              <li key={f} className="flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-[13.5px]">
                <Check className="size-3.5 text-emerald-400" strokeWidth={3} /> {f}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-10 text-[13px] text-white/50">
          lxclouds.com · Stand {new Date(doc.meta.date).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>
    </header>
  );
}

export function SummaryView({ doc }: { doc: FolioDoc }) {
  const visible = doc.chapters.map((c, i) => [c, i] as const).filter(([c]) => !c.hidden);
  return (
    <section>
      <h2 className={h2}>Das Wichtigste auf einen Blick</h2>
      <ol className="mt-6 grid gap-3 @3xl:grid-cols-2 @5xl:grid-cols-3">
        {visible.map(([c, i], n) => {
          const r = roles[c.role];
          const Icon = r.icon;
          return (
            <li key={c.id}>
              <a href={`#ch-${c.id}`} className={cn(card, "flex h-full flex-col p-5 transition-[border-color] hover:border-(--p)")}>
                <span className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-[9px]" style={{ backgroundColor: r.tone }}>
                    <Icon className="size-4 text-white" />
                  </span>
                  <span className="text-[13.5px] font-medium text-(--mut)">
                    {n + 1}. {c.title}
                  </span>
                </span>
                <BlockContext.Provider value={`chapters.${i}`}>
                  <T as="p" path={["short"]} value={c.short} className="mt-3 block text-[20px] font-semibold leading-[1.25] tracking-[-0.01em]" placeholder="Kurz" />
                </BlockContext.Provider>
              </a>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/** The whole folio as one page: cover, overview, chapters. Editable when `edit` is given. */
export function FolioView({ doc, edit = null, tools = null, className, children }: { doc: FolioDoc; edit?: EditApi | null; tools?: FolioTools | null; className?: string; children?: ReactNode }) {
  const visible = doc.chapters.map((c, i) => [c, i] as const).filter(([c]) => !c.hidden);
  return (
    <EditContext.Provider value={edit}>
      <ToolsContext.Provider value={tools}>
        <DocContext.Provider value={doc}>
          <div className={cn("folio @container bg-(--bg) text-(--fg) [font-family:Outfit,sans-serif]", edit && "demo-editing", className)} style={folioVars(doc)}>
            <div className="mx-auto max-w-[1180px] space-y-20 px-4 py-6 @3xl:px-8 @3xl:py-10">
              <Cover doc={doc} />
              <SummaryView doc={doc} />
              {visible.map(([chapter, i], n) => (
                <ChapterView key={chapter.id} chapter={chapter} index={i} number={n + 1} total={visible.length} />
              ))}
              {children}
            </div>
          </div>
        </DocContext.Provider>
      </ToolsContext.Provider>
    </EditContext.Provider>
  );
}

/** Read-only context for rendering single pieces (slides); `choose` allows favourites and choices in the meeting. */
export function FolioFrame({ doc, children, className, choose = null }: { doc: FolioDoc; children: ReactNode; className?: string; choose?: EditApi["set"] | null }) {
  return (
    <EditContext.Provider value={null}>
      <ToolsContext.Provider value={null}>
        <ChoiceContext.Provider value={choose}>
          <DocContext.Provider value={doc}>
            <div className={cn("folio @container bg-(--bg) text-(--fg) [font-family:Outfit,sans-serif]", className)} style={folioVars(doc)}>
              {children}
            </div>
          </DocContext.Provider>
        </ChoiceContext.Provider>
      </ToolsContext.Provider>
    </EditContext.Provider>
  );
}
