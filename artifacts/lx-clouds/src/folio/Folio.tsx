import { Check, CircleDashed, Gauge, Loader2, Minus, Plus, RefreshCw, Star, X } from "lucide-react";
import { createContext, useContext, type CSSProperties, type ReactNode } from "react";
import { AddItem, BlockContext, EditContext, ItemTools, T, type EditApi } from "@/demo/edit";
import { onColour } from "@/demo/theme";
import { cn } from "@/lib/utils";
import { roleOrder, roles } from "./roles";
import type { Audit, AuditBlock, Chapter, DomainsBlock, FolioBlock, FolioDoc, OptionsBlock, PackagesBlock, RoiBlock } from "./types";

/** Live checks the editor can run; absent in the read-only views. */
export type FolioTools = {
  checkDomains: (scope: string) => void;
  audit: (scope: string, index?: number) => void;
  psi: (scope: string, index: number) => void;
  /** scopes with a check running */
  busy: Set<string>;
};
const ToolsContext = createContext<FolioTools | null>(null);
const useTools = () => useContext(ToolsContext);
const useScope = () => useContext(BlockContext);

const h2 = "text-[28px] font-semibold leading-[1.1] tracking-[-0.025em] @3xl:text-[36px]";
const h3 = "text-[13px] font-semibold uppercase tracking-[0.12em] text-(--mut)";
const card = "rounded-[16px] border border-(--line) bg-(--card)";
const chip = "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-semibold";

export function folioVars(doc: FolioDoc): CSSProperties {
  const p = doc.meta.accent || "#6865FF";
  return {
    "--p": p,
    "--p-on": onColour(p),
    "--soft": `color-mix(in srgb, ${p} 10%, #ffffff)`,
    "--bg": "#F7F6F2",
    "--card": "#ffffff",
    "--fg": "#12131B",
    "--mut": "#5D6072",
    "--line": "rgba(18,19,27,0.09)",
  } as CSSProperties;
}

function Edit() {
  return useContext(EditContext);
}

// ---------------------------------------------------------------- blocks
function Cards({ b }: { b: Extract<FolioBlock, { type: "cards" }> }) {
  return (
    <div>
      <T as="h3" path={["title"]} value={b.title} className={cn(h3, "mb-3 block")} placeholder="Überschrift" />
      <div className="grid gap-3 @2xl:grid-cols-2 @5xl:grid-cols-3">
        {b.items.map((item, i) => (
          <article key={i} className={cn(card, "group/item relative p-5")}>
            <T path={["items", i, "tag"]} value={item.tag} className={cn(chip, "bg-(--soft) text-(--p)")} placeholder="Stichwort" />
            <T as="h4" path={["items", i, "title"]} value={item.title} className="mt-3 block text-[17px] font-semibold leading-[1.25]" placeholder="Titel" />
            <T as="p" path={["items", i, "text"]} value={item.text} multiline className="mt-1.5 text-[14.5px] leading-[1.55] text-(--mut)" placeholder="Beschreibung" />
            <ItemTools path={["items"]} index={i} count={b.items.length} />
          </article>
        ))}
      </div>
      <AddItem path={["items"]} item={{ title: "Neuer Punkt", text: "", tag: "" }} label="Karte" className="mt-3" />
    </div>
  );
}

function Score({ value, scope, index }: { value: number; scope: string; index: number }) {
  const edit = Edit();
  return (
    <span className="inline-flex gap-1" aria-label={`Bewertung ${value} von 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!edit}
          onClick={() => edit?.set(scope, ["items", index, "score"], n)}
          className={cn("size-2.5 rounded-full", n <= value ? "bg-(--p)" : "bg-(--fg)/12", edit && "cursor-pointer hover:scale-125")}
          aria-label={edit ? `${n} von 5` : undefined}
          tabIndex={edit ? 0 : -1}
        />
      ))}
    </span>
  );
}

function PickToggle({ on, path, label = "Empfehlung", exclusive, count }: { on: boolean; path: (string | number)[]; label?: string; exclusive?: boolean; count?: number }) {
  const edit = Edit();
  const scope = useScope();
  if (!edit) return on ? <span className={cn(chip, "bg-(--p) text-(--p-on)")}><Star className="size-3 fill-current" /> {label}</span> : null;
  return (
    <button
      type="button"
      onClick={() => {
        if (exclusive && count !== undefined && !on) for (let i = 0; i < count; i++) edit.set(scope, ["items", i, "pick"], false);
        edit.set(scope, path, !on);
      }}
      className={cn(chip, "cursor-pointer", on ? "bg-(--p) text-(--p-on)" : "border border-dashed border-(--fg)/25 text-(--mut) hover:border-(--p) hover:text-(--p)")}
    >
      <Star className={cn("size-3", on && "fill-current")} /> {label}
    </button>
  );
}

function List({ items, path, sign, tone, label }: { items: string[]; path: (string | number)[]; sign: "plus" | "minus" | "check" | "x"; tone: string; label: string }) {
  const Icon = { plus: Plus, minus: Minus, check: Check, x: X }[sign];
  return (
    <>
      <ul className="space-y-1.5">
        {items.map((text, i) => (
          <li key={i} className="group/item relative flex gap-2 text-[14px] leading-[1.45]">
            <Icon className={cn("mt-0.5 size-4 shrink-0", tone)} strokeWidth={2.5} aria-hidden="true" />
            <T path={[...path, i]} value={text} className="min-w-0 flex-1" placeholder="Punkt" />
            <ItemTools path={path} index={i} count={items.length} />
          </li>
        ))}
      </ul>
      <AddItem path={path} item="" label={label} className="mt-2" />
    </>
  );
}

function Options({ b }: { b: OptionsBlock }) {
  const scope = useScope();
  return (
    <div>
      <T as="h3" path={["title"]} value={b.title} className={cn(h3, "mb-3 block")} placeholder="Überschrift" />
      <div className="grid gap-3 @3xl:grid-cols-2 @6xl:grid-cols-3">
        {b.items.map((item, i) => (
          <article key={i} className={cn(card, "group/item relative flex flex-col p-5", item.pick && "border-(--p) shadow-[0_0_0_1px_var(--p)]")}>
            <div className="flex items-start justify-between gap-3">
              <T as="h4" path={["items", i, "name"]} value={item.name} className="block text-[19px] font-semibold leading-[1.2] tracking-[-0.01em]" placeholder="Name" />
              <Score value={item.score} scope={scope} index={i} />
            </div>
            <T as="p" path={["items", i, "text"]} value={item.text} multiline className="mt-2 text-[14.5px] leading-[1.55] text-(--mut)" placeholder="Kurze Einschätzung" />
            <div className="mt-4 grid flex-1 gap-4 @2xl:grid-cols-2 @3xl:grid-cols-1 @5xl:grid-cols-2">
              <div>
                <p className="mb-1.5 text-[12px] font-semibold text-emerald-700">Spricht dafür</p>
                <List items={item.pros} path={["items", i, "pros"]} sign="plus" tone="text-emerald-600" label="Pro" />
              </div>
              <div>
                <p className="mb-1.5 text-[12px] font-semibold text-rose-700">Spricht dagegen</p>
                <List items={item.cons} path={["items", i, "cons"]} sign="minus" tone="text-rose-500" label="Contra" />
              </div>
            </div>
            <div className="mt-4">
              <PickToggle on={item.pick} path={["items", i, "pick"]} exclusive count={b.items.length} />
            </div>
            <ItemTools path={["items"]} index={i} count={b.items.length} />
          </article>
        ))}
      </div>
      <AddItem path={["items"]} item={{ name: "Neue Option", text: "", pros: [], cons: [], score: 3, pick: false }} label="Option" className="mt-3" />
    </div>
  );
}

const statusChip = {
  free: ["frei", "bg-emerald-50 text-emerald-700", Check],
  taken: ["vergeben", "bg-rose-50 text-rose-700", X],
  unknown: ["ungeprüft", "bg-(--fg)/[0.06] text-(--mut)", CircleDashed],
} as const;

function Domains({ b }: { b: DomainsBlock }) {
  const tools = useTools();
  const scope = useScope();
  const busy = tools?.busy.has(scope);
  const checked = b.items.filter((d) => d.checked).map((d) => d.checked).sort().at(-1);
  const free = b.items.filter((d) => d.status === "free").length;
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <T as="h3" path={["title"]} value={b.title} className={h3} placeholder="Überschrift" />
        <span className="text-[12.5px] text-(--mut)">
          {checked ? `${free} von ${b.items.length} frei · geprüft am ${new Date(checked).toLocaleDateString("de-DE")} bei der Registry` : "Noch nicht geprüft"}
        </span>
      </div>
      <div className={cn(card, "divide-y divide-(--line) overflow-hidden")}>
        {b.items.map((item, i) => {
          const [label, style, Icon] = statusChip[item.status] ?? statusChip.unknown;
          return (
            <div key={i} className={cn("group/item relative grid items-center gap-x-4 gap-y-1 px-4 py-3 @2xl:grid-cols-[minmax(0,1.1fr)_110px_minmax(0,1.4fr)_auto]", item.pick && "bg-(--soft)")}>
              <T path={["items", i, "domain"]} value={item.domain} className="min-w-0 truncate font-mono text-[14.5px] font-medium" placeholder="domain.de" />
              <span className={cn(chip, "w-fit", style)}>
                <Icon className="size-3" strokeWidth={3} /> {label}
              </span>
              <T path={["items", i, "note"]} value={item.note} className="text-[13.5px] text-(--mut)" placeholder="Anmerkung" />
              <PickToggle on={item.pick} path={["items", i, "pick"]} label="Wahl" />
              <ItemTools path={["items"]} index={i} count={b.items.length} />
            </div>
          );
        })}
      </div>
      {tools && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <AddItem path={["items"]} item={{ domain: "", status: "unknown", checked: "", note: "", pick: false }} label="Domain" />
          <button type="button" onClick={() => tools.checkDomains(scope)} disabled={busy} className={cn(chip, "h-8 cursor-pointer bg-(--fg) px-3.5 text-white disabled:opacity-60")}>
            {busy ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />} Alle live prüfen
          </button>
        </div>
      )}
    </div>
  );
}

// ---------- website check ----------
const checks: { label: string; ok: (a: Audit) => boolean | null; show?: (a: Audit) => string }[] = [
  { label: "Erreichbar", ok: (a) => !a.error && !!a.status && a.status < 400, show: (a) => (a.error ? a.error : `${a.status}`) },
  { label: "Verschlüsselt (HTTPS)", ok: (a) => !!a.https },
  { label: "Lädt schnell", ok: (a) => (a.ms ?? 99999) < 1500, show: (a) => (a.ms ? `${(a.ms / 1000).toFixed(1).replace(".", ",")} s` : "–") },
  { label: "Fürs Handy gebaut", ok: (a) => !!a.viewport },
  { label: "Titel für Google", ok: (a) => (a.title?.length ?? 0) >= 15 && (a.title?.length ?? 0) <= 70 },
  { label: "Beschreibung für Google", ok: (a) => (a.description?.length ?? 0) >= 70 },
  { label: "Eine klare Hauptüberschrift", ok: (a) => a.h1 === 1, show: (a) => `${a.h1 ?? 0}× H1` },
  { label: "Firmendaten für Google", ok: (a) => !!a.localBusiness },
  { label: "Sitemap", ok: (a) => !!a.sitemap },
  { label: "Telefon antippbar", ok: (a) => !!a.phone || !!a.whatsapp },
  { label: "Formular oder Terminbuchung", ok: (a) => (a.forms ?? 0) > 0 || !!a.booking },
  { label: "Bewertungen sichtbar", ok: (a) => !!a.reviews },
  { label: "Impressum", ok: (a) => !!a.impressum },
  { label: "Datenschutz", ok: (a) => !!a.datenschutz },
];

function ScoreRing({ value, size = 46 }: { value: number; size?: number }) {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const tone = value >= 80 ? "#10b981" : value >= 55 ? "#f59e0b" : "#f43f5e";
  return (
    <span className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(18,19,27,0.08)" strokeWidth="5" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={tone} strokeWidth="5" strokeLinecap="round" strokeDasharray={`${(c * value) / 100} ${c}`} />
      </svg>
      <span className="absolute text-[13px] font-bold tabular-nums">{value}</span>
    </span>
  );
}

function AuditTable({ b }: { b: AuditBlock }) {
  const tools = useTools();
  const scope = useScope();
  const edit = Edit();
  const busy = tools?.busy.has(scope);
  if (!b.items.length && !edit) return null;
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <T as="h3" path={["title"]} value={b.title} className={h3} placeholder="Überschrift" />
        {tools && b.items.length > 0 && (
          <button type="button" onClick={() => tools.audit(scope)} disabled={busy} className={cn(chip, "h-8 cursor-pointer bg-(--fg) px-3.5 text-white disabled:opacity-60")}>
            {busy ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />} Alle prüfen
          </button>
        )}
      </div>
      <div className={cn(card, "overflow-x-auto")}>
        <table className="w-full min-w-[560px] border-collapse text-[13.5px]">
          <thead>
            <tr className="border-b border-(--line)">
              <th className="w-[210px] p-3 text-left font-medium text-(--mut)">Prüfpunkt</th>
              {b.items.map((site, i) => (
                <th key={i} className={cn("group/item relative min-w-[150px] p-3 text-left align-top font-normal", site.own && "bg-(--soft)")}>
                  <T path={["items", i, "name"]} value={site.name} className="block text-[14px] font-semibold" placeholder="Name" />
                  <T path={["items", i, "url"]} value={site.url} className="block max-w-[220px] truncate text-[12px] text-(--mut)" placeholder="adresse.de" />
                  <div className="mt-2 flex items-center gap-2">
                    {site.result ? <ScoreRing value={site.result.score ?? 0} /> : <span className="text-[12px] text-(--mut)">noch nicht geprüft</span>}
                    {site.result?.psi && (
                      <span className="text-[11.5px] leading-[1.35] text-(--mut)">
                        Google mobil
                        <br />
                        <b className="text-(--fg)">{site.result.psi.performance}</b> Tempo · <b className="text-(--fg)">{site.result.psi.seo}</b> SEO
                      </span>
                    )}
                  </div>
                  {tools && (
                    <div className="mt-2 flex gap-1">
                      <button type="button" onClick={() => tools.audit(scope, i)} className="rounded-md px-1.5 py-0.5 text-[11.5px] font-medium text-(--p) hover:bg-(--soft)">
                        Prüfen
                      </button>
                      <button type="button" onClick={() => tools.psi(scope, i)} disabled={tools.busy.has(`${scope}:psi:${i}`)} className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11.5px] font-medium text-(--p) hover:bg-(--soft) disabled:opacity-50">
                        {tools.busy.has(`${scope}:psi:${i}`) ? <Loader2 className="size-3 animate-spin" /> : <Gauge className="size-3" />} Google-Messung
                      </button>
                    </div>
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
    </div>
  );
}

function Table({ b }: { b: Extract<FolioBlock, { type: "table" }> }) {
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
  const edit = Edit();
  const scope = useScope();
  const done = b.items.filter((i) => i.done).length;
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <T as="h3" path={["title"]} value={b.title} className={h3} placeholder="Überschrift" />
        {b.items.length > 0 && <span className="text-[12.5px] text-(--mut)">{done} / {b.items.length} erledigt</span>}
      </div>
      <ul className={cn(card, "divide-y divide-(--line)")}>
        {b.items.map((item, i) => (
          <li key={i} className="group/item relative flex items-start gap-3 px-4 py-3">
            <button
              type="button"
              disabled={!edit}
              onClick={() => edit?.set(scope, ["items", i, "done"], !item.done)}
              className={cn("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border", item.done ? "border-(--p) bg-(--p) text-(--p-on)" : "border-(--fg)/25", edit && "cursor-pointer")}
              aria-label={item.done ? "Erledigt" : "Offen"}
              tabIndex={edit ? 0 : -1}
            >
              {item.done && <Check className="size-3.5" strokeWidth={3} />}
            </button>
            <T path={["items", i, "text"]} value={item.text} multiline className={cn("min-w-0 flex-1 text-[14.5px] leading-[1.45]", item.done && "text-(--mut) line-through")} placeholder="Aufgabe" />
            <T path={["items", i, "who"]} value={item.who} className={cn(chip, "shrink-0 bg-(--fg)/[0.06] text-(--mut)")} placeholder="Wer" />
            <ItemTools path={["items"]} index={i} count={b.items.length} />
          </li>
        ))}
      </ul>
      <AddItem path={["items"]} item={{ text: "", who: "Team", done: false }} label="Punkt" className="mt-3" />
    </div>
  );
}

function Timeline({ b }: { b: Extract<FolioBlock, { type: "timeline" }> }) {
  return (
    <div>
      <T as="h3" path={["title"]} value={b.title} className={cn(h3, "mb-4 block")} placeholder="Überschrift" />
      <ol className="relative grid gap-3 @4xl:grid-flow-col @4xl:auto-cols-fr">
        {b.items.map((item, i) => (
          <li key={i} className={cn(card, "group/item relative p-5")}>
            <span className="flex items-center gap-2.5">
              <span className="flex size-7 items-center justify-center rounded-full bg-(--p) text-[12.5px] font-bold text-(--p-on)">{i + 1}</span>
              <T path={["items", i, "when"]} value={item.when} className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-(--p)" placeholder="Wann" />
            </span>
            <T as="h4" path={["items", i, "title"]} value={item.title} className="mt-3 block text-[16.5px] font-semibold" placeholder="Etappe" />
            <T as="p" path={["items", i, "text"]} value={item.text} multiline className="mt-1 text-[14px] leading-[1.5] text-(--mut)" placeholder="Was passiert" />
            <ItemTools path={["items"]} index={i} count={b.items.length} />
          </li>
        ))}
      </ol>
      <AddItem path={["items"]} item={{ when: "", title: "Neue Etappe", text: "" }} label="Etappe" className="mt-3" />
    </div>
  );
}

function Packages({ b }: { b: PackagesBlock }) {
  return (
    <div>
      <T as="h3" path={["title"]} value={b.title} className={cn(h3, "mb-3 block")} placeholder="Überschrift" />
      <div className="grid gap-3 @4xl:grid-cols-3">
        {b.items.map((item, i) => (
          <article key={i} className={cn(card, "group/item relative flex flex-col p-6", item.pick && "border-(--p) bg-(--fg) text-white [--card:#12131B] [--line:rgba(255,255,255,0.12)] [--mut:rgba(255,255,255,0.65)]")}>
            <div className="flex items-start justify-between gap-2">
              <T as="h4" path={["items", i, "name"]} value={item.name} className="block text-[20px] font-semibold" placeholder="Paket" />
              <PickToggle on={item.pick} path={["items", i, "pick"]} exclusive count={b.items.length} />
            </div>
            <T as="p" path={["items", i, "text"]} value={item.text} className="mt-1 text-[14px] text-(--mut)" placeholder="Für wen" />
            <T path={["items", i, "price"]} value={item.price} className="mt-5 block text-[30px] font-semibold tracking-[-0.02em]" placeholder="Preis eintragen" />
            <ul className="mt-5 flex-1 space-y-2 border-t border-(--line) pt-5">
              {item.features.map((f, k) => (
                <li key={k} className="group/item relative flex gap-2 text-[14px] leading-[1.45]">
                  <Check className="mt-0.5 size-4 shrink-0 text-(--p)" strokeWidth={2.5} />
                  <T path={["items", i, "features", k]} value={f} className="min-w-0 flex-1" placeholder="Leistung" />
                  <ItemTools path={["items", i, "features"]} index={k} count={item.features.length} />
                </li>
              ))}
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
        <div className={cn(card, "border-emerald-200 bg-emerald-50/60 p-5")}>
          <p className="mb-3 text-[13px] font-semibold text-emerald-800">Erlaubt & empfohlen</p>
          <List items={b.dos} path={["dos"]} sign="check" tone="text-emerald-600" label="Punkt" />
        </div>
        <div className={cn(card, "border-rose-200 bg-rose-50/60 p-5")}>
          <p className="mb-3 text-[13px] font-semibold text-rose-800">Tabu</p>
          <List items={b.donts} path={["donts"]} sign="x" tone="text-rose-500" label="Punkt" />
        </div>
      </div>
    </div>
  );
}

function TextBlock({ b }: { b: Extract<FolioBlock, { type: "text" }> }) {
  return (
    <div className={cn(card, "p-5 @3xl:p-6")}>
      <T as="h3" path={["title"]} value={b.title} className={cn(h3, "mb-2 block")} placeholder="Überschrift" />
      <T as="p" path={["text"]} value={b.text} multiline className="text-[16px] leading-[1.6]" placeholder="Text" />
    </div>
  );
}

const euro = (n: number) => n.toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

function Roi({ b }: { b: RoiBlock }) {
  const edit = Edit();
  const scope = useScope();
  const field = (key: "invest" | "monthly" | "value", label: string) => (
    <label className="block">
      <span className="text-[12.5px] text-(--mut)">{label}</span>
      {edit ? (
        <input type="number" min={0} step={10} value={b[key] || ""} placeholder="0" onChange={(e) => edit.set(scope, [key], Number(e.target.value) || 0)} className="mt-1 block h-10 w-full rounded-[10px] border border-(--line) bg-white px-3 text-[15px] tabular-nums outline-none focus:border-(--p)" />
      ) : (
        <span className="mt-0.5 block text-[18px] font-semibold tabular-nums">{euro(b[key])}</span>
      )}
    </label>
  );
  const ready = b.invest > 0 && b.value > 0;
  const lines = b.recurring
    ? [1, 2, 3].map((k) => {
        const net = k * b.value - b.monthly;
        return { k, text: net > 0 ? `nach ${Math.max(1, Math.ceil(b.invest / net))} Monaten zurück` : "deckt die laufenden Kosten noch nicht" };
      })
    : [{ k: Math.ceil((b.invest + b.monthly * 12) / Math.max(1, b.value)), text: "decken Investition und ein Jahr laufende Kosten" }];
  return (
    <div className={cn(card, "p-5 @3xl:p-6")}>
      <T as="h3" path={["title"]} value={b.title} className={cn(h3, "mb-2 block")} placeholder="Überschrift" />
      <T as="p" path={["text"]} value={b.text} multiline className="text-[14.5px] leading-[1.55] text-(--mut)" placeholder="Erklärung" />
      <div className="mt-4 grid gap-4 @2xl:grid-cols-3">
        {field("invest", "Einmalige Investition")}
        {field("monthly", "Laufende Kosten pro Monat")}
        {field("value", b.unit)}
      </div>
      {ready ? (
        <ul className="mt-5 grid gap-2 @3xl:grid-cols-3">
          {lines.map((l) => (
            <li key={l.k} className="rounded-[12px] bg-(--soft) p-4">
              <p className="text-[26px] font-semibold leading-none tracking-[-0.02em] text-(--p)">
                {l.k} {b.recurring ? (l.k === 1 ? "Kunde" : "Kunden") : "Aufträge"}
              </p>
              <p className="mt-1.5 text-[13.5px] text-(--mut)">{l.text}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-[13.5px] text-(--mut)">{edit ? "Investition und Wert eintragen – die Rechnung erscheint sofort." : ""}</p>
      )}
    </div>
  );
}

function Block({ block }: { block: FolioBlock }) {
  switch (block.type) {
    case "cards":
      return <Cards b={block} />;
    case "options":
      return <Options b={block} />;
    case "domains":
      return <Domains b={block} />;
    case "audit":
      return <AuditTable b={block} />;
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

export function ChapterView({ chapter, index, number }: { chapter: Chapter; index: number; number: number }) {
  const scope = `chapters.${index}`;
  return (
    <section id={`ch-${chapter.id}`} className="scroll-mt-20 break-before-page">
      <BlockContext.Provider value={scope}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[13px] font-semibold tabular-nums text-(--p)">{String(number).padStart(2, "0")}</span>
          <RoleBadge role={chapter.role} />
        </div>
        <T as="h2" path={["title"]} value={chapter.title} className={cn(h2, "mt-3 block")} placeholder="Kapitel" />
        <T as="p" path={["lead"]} value={chapter.lead} multiline className="mt-2 max-w-[720px] text-[16.5px] leading-[1.55] text-(--mut)" placeholder="Worum es geht" />
        <div className="mt-6 flex gap-4 rounded-[16px] bg-(--fg) p-5 text-white @3xl:p-6">
          <Star className="mt-1 size-5 shrink-0 fill-(--p) text-(--p)" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-white/55">Unsere Empfehlung</p>
            <T as="p" path={["pick"]} value={chapter.pick} multiline className="mt-1 text-[17.5px] font-medium leading-[1.45] @3xl:text-[19px]" placeholder="Die Empfehlung in einem Satz" />
          </div>
        </div>
      </BlockContext.Provider>
      <div className="mt-8 space-y-9">
        {chapter.blocks.map((block, b) => (
          <BlockContext.Provider key={block.id} value={`${scope}.blocks.${b}`}>
            <Block block={block} />
          </BlockContext.Provider>
        ))}
      </div>
    </section>
  );
}

/** Short facts about what each discipline did, from the folio itself – the live checks first. */
export function roleFacts(doc: FolioDoc) {
  const facts: Partial<Record<Chapter["role"], [number, string][]>> = {};
  const add = (role: Chapter["role"], rank: number, text: string) => (facts[role] = [...(facts[role] ?? []), [rank, text]]);
  for (const ch of doc.chapters.filter((c) => !c.hidden)) {
    const r = ch.role;
    for (const b of ch.blocks) {
      if (b.type === "domains" && b.items.length) {
        const checked = b.items.some((d) => d.checked);
        add(r, 0, checked ? `${b.items.length} Domains live geprüft, ${b.items.filter((d) => d.status === "free").length} frei` : `${b.items.length} Domains vorgemerkt`);
      }
      if (b.type === "audit" && b.items.length) {
        const done = b.items.filter((s) => s.result);
        const label = r === "tech" ? (b.items.length === 1 ? "Ihre Website geprüft" : `${b.items.length} Websites geprüft`) : `${b.items.length} Wettbewerber geprüft`;
        add(r, 0, done.length ? label : label.replace("geprüft", "zur Prüfung"));
      }
      if (b.type === "options" && b.items.length) add(r, 1, r === "brand" ? `${b.items.length} Namen verglichen` : `${b.items.length} Gestaltungen bewertet`);
      if (b.type === "table" && b.rows.length) add(r, 1, `${b.rows.length} ${r === "seo" ? "Suchbegriffe" : r === "ads" ? "Kanäle bewertet" : "Seiten geplant"}`);
      if (b.type === "rules" && r === "legal") add(r, 1, `${b.dos.length + b.donts.length} Regeln geprüft`);
      if (b.type === "checklist" && r === "legal") add(r, 2, `${b.items.length} Pflichten`);
      if (b.type === "cards" && r === "strategy" && /zielgruppe/i.test(b.title)) add(r, 1, `${b.items.length} Zielgruppen`);
      if (b.type === "cards" && r === "content" && /überschrift/i.test(b.title)) add(r, 1, `${b.items.length} Überschriften`);
      if (b.type === "checklist" && r === "content") add(r, 2, `${b.items.length} Punkte Material`);
      if (b.type === "cards" && r === "seo" && /lokal/i.test(b.title)) add(r, 2, `${b.items.length} Ortsseiten`);
      if (b.type === "cards" && r === "tech" && /plan/i.test(b.title)) add(r, 1, `${b.items.length} Bausteine geplant`);
      if (b.type === "timeline") add(r, 1, `${b.items.length} Etappen`);
      if (b.type === "checklist" && r === "lead" && /klären/i.test(b.title)) add(r, 2, `${b.items.length} offene Fragen`);
      if (b.type === "packages") add(r, 1, `${b.items.length} Pakete`);
      if (b.type === "roi") add(r, 2, "Rechnung, ab wann es sich lohnt");
    }
  }
  return Object.fromEntries(Object.entries(facts).map(([role, list]) => [role, [...new Set(list.sort((a, b) => a[0] - b[0]).map(([, t]) => t))]])) as Partial<Record<Chapter["role"], string[]>>;
}

export function Cover({ doc }: { doc: FolioDoc }) {
  return (
    <header className="relative overflow-hidden rounded-[24px] bg-(--fg) px-6 py-12 text-white @3xl:px-12 @3xl:py-16">
      <div className="pointer-events-none absolute -right-24 -top-24 size-[420px] rounded-full opacity-40 blur-[90px]" style={{ background: "var(--p)" }} aria-hidden="true" />
      <div className="relative">
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-white/60">Projektmappe</p>
        <BlockContext.Provider value="meta">
          <T as="h1" path={["client"]} value={doc.meta.client} className="mt-4 block text-[40px] font-semibold leading-[1.02] tracking-[-0.035em] @3xl:text-[64px]" placeholder="Kunde" />
          <p className="mt-3 text-[17px] text-white/75">
            <T path={["industry"]} value={doc.meta.industry} placeholder="Branche" /> · <T path={["city"]} value={doc.meta.city} placeholder="Ort" />
          </p>
        </BlockContext.Provider>
        <BlockContext.Provider value="">
          <T as="p" path={["intro"]} value={doc.intro} multiline className="mt-8 max-w-[640px] text-[16.5px] leading-[1.6] text-white/85" placeholder="Einleitung" />
        </BlockContext.Provider>
        <p className="mt-10 flex flex-wrap gap-x-6 gap-y-1 text-[13px] text-white/55">
          <span>Erstellt von lxclouds.com</span>
          <span>Stand {new Date(doc.meta.date).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" })}</span>
        </p>
      </div>
    </header>
  );
}

export function TeamView({ doc }: { doc: FolioDoc }) {
  const facts = roleFacts(doc);
  const used = roleOrder.filter((r) => doc.chapters.some((c) => c.role === r && !c.hidden));
  return (
    <section>
      <p className={h3}>Wer daran gearbeitet hat</p>
      <h2 className={cn(h2, "mt-2")}>Ihr Projektteam</h2>
      <p className="mt-2 max-w-[640px] text-[16px] leading-[1.55] text-(--mut)">Jede Disziplin hat Ihr Vorhaben aus ihrer Sicht geprüft. Die Ergebnisse stehen in den Kapiteln dieser Mappe.</p>
      <ul className="mt-6 grid gap-3 @2xl:grid-cols-2 @5xl:grid-cols-5">
        {used.map((key) => {
          const r = roles[key];
          const Icon = r.icon;
          return (
            <li key={key} className={cn(card, "p-4")}>
              <span className="flex size-9 items-center justify-center rounded-[10px]" style={{ backgroundColor: r.tone }}>
                <Icon className="size-[18px] text-white" />
              </span>
              <p className="mt-3 text-[15px] font-semibold leading-tight">{r.label}</p>
              <p className="mt-1 text-[13px] leading-[1.4] text-(--mut)">{r.task}</p>
              {facts[key]?.slice(0, 2).map((f) => (
                <p key={f} className="mt-2 flex gap-1.5 text-[12.5px] font-medium leading-[1.35] text-(--fg)">
                  <Check className="mt-px size-3.5 shrink-0" style={{ color: r.tone }} strokeWidth={3} />
                  {f}
                </p>
              ))}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function SummaryView({ doc }: { doc: FolioDoc }) {
  const visible = doc.chapters.map((c, i) => [c, i] as const).filter(([c]) => !c.hidden && c.pick.trim());
  return (
    <section>
      <p className={h3}>Das Wichtigste</p>
      <h2 className={cn(h2, "mt-2")}>Unsere Empfehlung auf einen Blick</h2>
      <ol className="mt-6 grid gap-3 @4xl:grid-cols-2">
        {visible.map(([c, i], n) => (
          <li key={c.id} className={cn(card, "flex gap-4 p-5")}>
            <span className="text-[22px] font-semibold tabular-nums leading-none text-(--p)">{String(n + 1).padStart(2, "0")}</span>
            <div className="min-w-0">
              <RoleBadge role={c.role} />
              <a href={`#ch-${c.id}`} className="mt-2 block text-[15.5px] font-semibold hover:text-(--p)">
                {c.title}
              </a>
              <BlockContext.Provider value={`chapters.${i}`}>
                <T as="p" path={["pick"]} value={c.pick} multiline className="mt-1 text-[14.5px] leading-[1.5] text-(--mut)" placeholder="Empfehlung" />
              </BlockContext.Provider>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** The whole folio as one page: cover, team, summary, chapters. Editable when `edit` is given. */
export function FolioView({ doc, edit = null, tools = null, className, children }: { doc: FolioDoc; edit?: EditApi | null; tools?: FolioTools | null; className?: string; children?: ReactNode }) {
  const visible = doc.chapters.map((c, i) => [c, i] as const).filter(([c]) => !c.hidden);
  return (
    <EditContext.Provider value={edit}>
      <ToolsContext.Provider value={tools}>
        <div className={cn("folio @container bg-(--bg) text-(--fg) [font-family:Outfit,sans-serif]", edit && "demo-editing", className)} style={folioVars(doc)}>
          <div className="mx-auto max-w-[1180px] space-y-16 px-4 py-6 @3xl:px-8 @3xl:py-10">
            <Cover doc={doc} />
            <TeamView doc={doc} />
            <SummaryView doc={doc} />
            {visible.map(([chapter, i], n) => (
              <ChapterView key={chapter.id} chapter={chapter} index={i} number={n + 1} />
            ))}
            {children}
          </div>
        </div>
      </ToolsContext.Provider>
    </EditContext.Provider>
  );
}

/** Same context as FolioView, for rendering single pieces (slides). */
export function FolioFrame({ doc, children, className }: { doc: FolioDoc; children: ReactNode; className?: string }) {
  return (
    <EditContext.Provider value={null}>
      <ToolsContext.Provider value={null}>
        <div className={cn("folio @container bg-(--bg) text-(--fg) [font-family:Outfit,sans-serif]", className)} style={folioVars(doc)}>
          {children}
        </div>
      </ToolsContext.Provider>
    </EditContext.Provider>
  );
}
