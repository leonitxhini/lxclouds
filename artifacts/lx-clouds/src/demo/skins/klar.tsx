import { ArrowLeft, ArrowRight, CalendarDays, Check, Clock, Mail, MapPin, Menu, Minus, Phone, Plus, Star, TrendingUp, Video } from "lucide-react";
import { createElement, useContext, useLayoutEffect, useRef, useState, type CSSProperties, type ClipboardEvent, type FocusEvent, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { renderBase, type SkinProps } from "../blocks";
import { AddItem, BlockContext, Img, ItemTools, T, imageUrl, useEdit } from "../edit";
import type { ContactBlock, CtaBlock, DemoDoc, FaqBlock, FooterBlock, HeroBlock, NavBlock, Path, PricesBlock, QuotesBlock, ServicesBlock, StatsBlock, StepsBlock } from "../types";
import { IconPick, Initials, MapArt, Stars, navLinks, wrap } from "./kit";

// "Klar": light, glassy, SaaS-grade clarity. Everything coloured is derived from the brand colour (--p),
// so recolouring the demo recolours the gradients, glows and illustrations with it.

// (line height comes after the size: a font-size utility would otherwise reset it)
const h2 = "[font-family:var(--fh)] text-[30px] font-bold leading-[1.12] tracking-[-0.032em] @2xl:text-[38px] @2xl:leading-[1.1] @5xl:text-[44px] @5xl:leading-[1.1]";
const lead = "text-[15.5px] leading-[1.65] text-(--mut)";
const label = "text-[11px] font-semibold uppercase tracking-[0.14em]";
const section = "relative bg-(--bg) py-14 @4xl:py-[84px]";
const card = "rounded-(--r) border border-(--line) bg-(--card)";
const button = "inline-flex h-12 items-center justify-center gap-2.5 whitespace-nowrap rounded-(--r-sm) px-5 text-[14px] font-semibold transition-[translate,box-shadow,filter] duration-200 hover:-translate-y-0.5";
const ghost = cn(button, "border border-(--line) bg-(--card) text-(--fg) hover:border-(--p)/40");
const round = "flex size-10 shrink-0 items-center justify-center rounded-full border border-(--line) bg-(--card) text-(--fg) shadow-[0_6px_16px_-10px_rgba(15,18,48,0.5)] transition-colors duration-200";

const violet = "color-mix(in srgb, var(--p) 62%, #A855F7)";
const cyan = "color-mix(in srgb, var(--p) 45%, #22D3EE)";
const accentFill: CSSProperties = { backgroundImage: `linear-gradient(135deg, var(--p), ${violet})`, boxShadow: "0 14px 30px -14px color-mix(in srgb, var(--p) 80%, transparent)" };
const glowShadow: CSSProperties = { boxShadow: "0 30px 70px -42px color-mix(in srgb, var(--p) 60%, transparent), 0 2px 6px -3px rgba(15,18,48,0.08)" };
const glass: CSSProperties = { background: "color-mix(in srgb, var(--card) 74%, transparent)", boxShadow: "0 34px 70px -38px color-mix(in srgb, var(--p) 70%, transparent), 0 2px 8px -4px rgba(15,18,48,0.1)" };
const accentText: CSSProperties = { backgroundImage: `linear-gradient(95deg, var(--p), ${violet})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" };

// ---------- text that is edited line by line (titles with an accent line, checklists inside one text field) ----------
type EProps = { value: string; onCommit: (next: string) => void; as?: string; className?: string; style?: CSSProperties; placeholder?: string };

/** One editable line; the block decides what a changed or emptied line means. */
function E({ value, onCommit, as = "span", className, style, placeholder = "Text" }: EProps) {
  const edit = useEdit();
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (el && document.activeElement !== el && el.innerText !== value) el.innerText = value;
  }, [value, edit]);
  if (!edit) return value ? createElement(as, { className, style }, value) : null;
  return createElement(as, {
    ref,
    className: cn(className, "demo-editable"),
    contentEditable: true,
    suppressContentEditableWarning: true,
    spellCheck: false,
    "data-placeholder": placeholder,
    onBlur: (e: FocusEvent<HTMLElement>) => {
      const next = e.currentTarget.innerText
        .replace(/ /g, " ")
        .replace(/\s*\n\s*/g, " ")
        .trim();
      if (next !== value) onCommit(next);
    },
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.currentTarget.blur();
      }
      if (e.key === "Escape") {
        e.currentTarget.innerText = value;
        e.currentTarget.blur();
      }
      e.stopPropagation();
    },
    onPaste: (e: ClipboardEvent<HTMLElement>) => {
      e.preventDefault();
      document.execCommand("insertText", false, e.clipboardData.getData("text/plain"));
    },
  });
}

/** A text field of the block, split into its lines; an emptied line disappears. */
function useLines(path: Path, value: string) {
  const edit = useEdit();
  const blockId = useContext(BlockContext);
  const lines = value.split("\n");
  const write = (next: string[]) => edit?.set(blockId, path, next.join("\n"));
  return {
    lines,
    set: (i: number, text: string) => write(text ? lines.map((l, k) => (k === i ? text : l)) : lines.filter((_, k) => k !== i)),
    /** like set, but an emptied line stays as an empty line (keeps the lines after it in place) */
    keep: (i: number, text: string) => write(lines.map((l, k) => (k === i ? text : l))),
    add: (text: string) => write([...lines, text]),
  };
}

function AddLine({ onClick, label: text, className }: { onClick: () => void; label: string; className?: string }) {
  if (!useEdit()) return null;
  return (
    <button type="button" onClick={onClick} className={cn("inline-flex items-center gap-1.5 rounded-full border border-dashed border-(--p)/50 px-3 py-1 text-[12px] font-medium text-(--p) [font-family:Outfit,sans-serif] hover:bg-(--soft)", className)}>
      <Plus className="size-3.5" aria-hidden="true" />
      {text}
    </button>
  );
}

// ---------- shared pieces ----------
function Eyebrow({ value, path = ["eyebrow"], className }: { value: string | undefined; path?: Path; className?: string }) {
  const edit = useEdit();
  if (!value && !edit) return null;
  return (
    <span className={cn("mb-4 flex items-center gap-2 text-(--p)", className)}>
      <span className="flex size-[14px] shrink-0 items-center justify-center rounded-[4px] bg-current" aria-hidden="true">
        <span className="size-[5px] rounded-[1.5px] bg-(--card)" />
      </span>
      <T path={path} value={value} className={label} placeholder="Kurzzeile" />
    </span>
  );
}

function Head({ eyebrow, title, text, children }: { eyebrow: string | undefined; title: string; text?: string; children?: ReactNode }) {
  return (
    <div className="d-rise grid gap-5 @4xl:grid-cols-2 @4xl:gap-14">
      <div>
        <Eyebrow value={eyebrow} />
        <T as="h2" path={["title"]} value={title} multiline className={h2} placeholder="Überschrift" />
      </div>
      <div className="flex flex-col items-start gap-5 @4xl:pt-[34px]">
        {text !== undefined && <T as="p" path={["text"]} value={text} multiline className={cn(lead, "max-w-[460px]")} placeholder="Kurzer Einleitungstext" />}
        {children}
      </div>
    </div>
  );
}

function Mark({ doc, className }: { doc: DemoDoc; className?: string }) {
  if (doc.theme.logo) return <img src={imageUrl(doc.theme.logo)} alt="" className={cn("h-9 w-auto max-w-[140px] object-contain", className)} />;
  return (
    <span className={cn("relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-[10px] text-[17px] font-extrabold text-(--p-on)", className)} style={accentFill} aria-hidden="true">
      <span className="absolute -right-2 -top-2 size-6 rounded-full bg-white/25" />
      <span className="relative">{(doc.meta.company.trim()[0] ?? "•").toUpperCase()}</span>
    </span>
  );
}

// ---------- nav: floating glass bar on top of the hero ----------
function Nav({ block, doc }: { block: NavBlock; doc: DemoDoc }) {
  const { links, cta } = block.props;
  return (
    <header className="absolute inset-x-0 top-0 z-30 px-3 pt-3 @2xl:px-6 @2xl:pt-5">
      <div className="mx-auto flex h-[64px] w-full max-w-[1200px] items-center justify-between gap-5 rounded-full border border-(--line) pl-3.5 pr-2.5 backdrop-blur-xl" style={glass}>
        <span className="flex min-w-0 items-center gap-3">
          <Mark doc={doc} />
          <span className="min-w-0 leading-none">
            <T meta="company" value={doc.meta.company} className="block truncate text-[16.5px] font-bold tracking-[-0.02em] text-(--fg)" placeholder="Firmenname" />
            <T meta="industry" value={doc.meta.industry} className="mt-1 hidden text-[11.5px] text-(--mut) @2xl:block" placeholder="Branche" />
          </span>
        </span>
        <nav className="hidden items-center gap-8 @5xl:flex">
          {links.map((link, i) => (
            <T key={i} path={["links", i]} value={link} className="text-[13.5px] font-medium text-(--fg)/75 transition-colors hover:text-(--p)" placeholder="Link" />
          ))}
        </nav>
        <span className="flex shrink-0 items-center gap-2">
          <a href="#contact" className={cn(button, "hidden h-11 rounded-full border border-(--line) bg-(--card) px-4 text-[13px] text-(--fg) shadow-[0_8px_20px_-12px_rgba(15,18,48,0.45)] @md:inline-flex @2xl:px-5")}>
            <T path={["cta"]} value={cta} placeholder="Button" />
            <ArrowRight className="hidden size-4 @2xl:block" aria-hidden="true" />
          </a>
          <span className="flex size-11 items-center justify-center rounded-full border border-(--line) bg-(--card) text-(--fg) @5xl:hidden" aria-hidden="true">
            <Menu className="size-[18px]" />
          </span>
        </span>
      </div>
    </header>
  );
}

// ---------- hero ----------
const floatCss = `
@keyframes klar-float { 50% { translate: 0 -10px; } }
@media (prefers-reduced-motion: no-preference) {
  .klar-float { animation: klar-float 7s ease-in-out infinite; }
}`;

const plan = ["Erstgespräch", "Analyse", "Strategie", "Umsetzung", "Auswertung"];
const weekdays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const bars = [16, 22, 30, 41, 55, 73, 94];

/** The hero's picture: three glass cards of a fictional client portal. Decorative, but they react. */
function HeroVisual({ note }: { note: string | undefined }) {
  const edit = useEdit();
  const [done, setDone] = useState([true, true, true, false, false]);
  const [days] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    return Array.from({ length: 14 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return { day: date.getDate(), free: date > today && i % 7 < 5 };
    });
  });
  const [picked, setPicked] = useState(() => days.findIndex((d) => d.free));
  const panel = "klar-float absolute rounded-[calc(var(--r)*0.9)] border border-(--card) p-3.5 backdrop-blur-xl @2xl:p-[18px]";

  return (
    <div className="relative mx-auto aspect-[10/11.4] w-full max-w-[580px] text-(--fg) @2xl:aspect-[10/9.4] @5xl:mr-0">
      <style>{floatCss}</style>

      {/* development */}
      <div className={cn(panel, "left-0 top-[3%] w-[54%]")} style={glass}>
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[11px] font-semibold @2xl:text-[12.5px]">Entwicklung</span>
          <span className="flex items-center gap-1 rounded-full bg-(--card) px-2 py-1 text-[9.5px] font-semibold text-(--p) @2xl:text-[10.5px]">
            <TrendingUp className="size-3" aria-hidden="true" />
            Wachstum
          </span>
        </div>
        <p className="mt-2.5 text-[19px] font-bold leading-none tracking-[-0.03em] @2xl:text-[26px] @2xl:leading-none">+ 18 %</p>
        <p className="mt-1.5 text-[10px] text-(--mut) @2xl:text-[11px]">zum Vorjahr</p>
        <div className="mt-3 flex h-[52px] items-end gap-[6%] @2xl:h-[78px]">
          {bars.map((height, i) => (
            <span key={i} className="flex-1 rounded-t-[5px] transition-[height] duration-700" style={{ height: `${height}%`, background: `linear-gradient(to top, color-mix(in srgb, var(--p) ${18 + i * 13}%, transparent), color-mix(in srgb, var(--p) ${8 + i * 9}%, transparent))` }} />
          ))}
        </div>
      </div>

      {/* checklist */}
      <div className={cn(panel, "right-0 top-0 w-[42%] [animation-delay:-2.4s]")} style={glass}>
        <span className="text-[11px] font-semibold @2xl:text-[12.5px]">Ihr Fahrplan</span>
        <ul className="mt-2.5 space-y-2 @2xl:mt-3.5 @2xl:space-y-3">
          {plan.map((step, i) => (
            <li key={step}>
              <button type="button" onClick={() => setDone((list) => list.map((v, k) => (k === i ? !v : v)))} aria-pressed={done[i]} className="flex w-full items-center gap-2 text-left text-[10.5px] @2xl:gap-2.5 @2xl:text-[12px]">
                <span className={cn("flex size-[15px] shrink-0 items-center justify-center rounded-[5px] border transition-colors @2xl:size-[17px]", done[i] ? "border-transparent text-(--p-on)" : "border-(--line) bg-(--card)")} style={done[i] ? accentFill : undefined}>
                  {done[i] && <Check className="size-2.5" strokeWidth={3.5} aria-hidden="true" />}
                </span>
                <span className={cn("truncate", !done[i] && "text-(--mut)")}>{step}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* booking */}
      <div className={cn(panel, "left-[6%] top-[49%] w-[70%] [animation-delay:-4.6s] @2xl:left-[8%] @2xl:top-[45%] @2xl:w-[66%]")} style={glass}>
        <div className="flex items-center gap-2.5">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-[8px] text-(--p-on) @2xl:size-8" style={accentFill}>
            <CalendarDays className="size-3.5 @2xl:size-4" aria-hidden="true" />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[11.5px] font-semibold @2xl:text-[13px]">Erstgespräch buchen</span>
            <span className="block truncate text-[9.5px] text-(--mut) @2xl:text-[10.5px]">Kostenlos &amp; unverbindlich</span>
          </span>
        </div>
        <div className="mt-3 grid grid-cols-7 gap-y-1 text-center text-[9.5px] @2xl:mt-4 @2xl:gap-y-1.5 @2xl:text-[11px]">
          {weekdays.map((d) => (
            <span key={d} className="font-medium text-(--mut)">
              {d}
            </span>
          ))}
          {days.map((d, i) => (
            <button
              key={i}
              type="button"
              disabled={!d.free}
              onClick={() => setPicked(i)}
              aria-pressed={picked === i}
              aria-label={`Tag ${d.day}`}
              className={cn("mx-auto flex size-[22px] items-center justify-center rounded-[7px] transition-colors @2xl:size-7", picked === i ? "font-semibold text-(--p-on)" : d.free ? "hover:bg-(--soft)" : "text-(--mut)/50")}
              style={picked === i ? accentFill : undefined}
            >
              {d.day}
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between gap-2 rounded-[10px] border border-(--line) bg-(--card)/70 py-1 pl-2.5 pr-1 @2xl:mt-4">
          <span className="flex min-w-0 items-center gap-1.5 text-[10px] text-(--mut) @2xl:text-[11.5px]">
            <Video className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">30 Min. Videocall</span>
          </span>
          <a href="#contact" className="flex size-7 shrink-0 items-center justify-center rounded-[8px] text-(--p-on) @2xl:size-8" style={accentFill} aria-label="Termin anfragen">
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>

      {(note || edit) && (
        <div className="absolute bottom-[9%] right-0 w-[24%] -rotate-6 text-(--p)">
          <T path={["note"]} value={note} multiline className="d-script block text-[13px] leading-[1.45] @2xl:text-[17px] @2xl:leading-[1.45]" placeholder="Notiz" />
          <svg viewBox="0 0 60 44" className="ml-auto mt-1 h-7 w-10 @2xl:h-9 @2xl:w-12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M52 4C50 22 36 34 10 34" />
            <path d="M19 26L9 34l11 6" />
          </svg>
        </div>
      )}
    </div>
  );
}

function Hero({ block }: { block: HeroBlock }) {
  const edit = useEdit();
  const p = block.props;
  const title = useLines(["title"], p.title);
  return (
    <section id="top" className="relative isolate overflow-hidden bg-(--bg)">
      {/* gradient mesh */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <span className="absolute right-[-10%] top-[6%] h-[600px] w-[700px] rounded-full opacity-55 blur-[90px]" style={{ background: `radial-gradient(closest-side, ${violet}, transparent)` }} />
        <span className="absolute right-[16%] top-[28%] h-[420px] w-[460px] rounded-full opacity-45 blur-[80px]" style={{ background: `radial-gradient(closest-side, ${cyan}, transparent)` }} />
        <span className="absolute left-[-14%] top-[-18%] h-[420px] w-[520px] rounded-full opacity-[0.14] blur-[90px]" style={{ background: "radial-gradient(closest-side, var(--p), transparent)" }} />
        <span className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-(--bg) to-transparent" />
      </div>

      <div className={cn(wrap, "grid items-center gap-12 pb-14 pt-[118px] @5xl:grid-cols-[1.02fr_1fr] @5xl:gap-8 @5xl:pb-24 @5xl:pt-[158px]")}>
        <div>
          <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-(--p)/15 bg-(--soft) px-3 py-1.5 text-(--p)">
            <span className="flex size-[14px] shrink-0 items-center justify-center rounded-[4px] bg-current" aria-hidden="true">
              <span className="size-[5px] rounded-[1.5px] bg-(--card)" />
            </span>
            <T path={["eyebrow"]} value={p.eyebrow} className="truncate text-[12px] font-medium" placeholder="Kurzzeile" />
          </span>

          <h1 className="mt-6 [font-family:var(--fh)] text-[42px] font-bold leading-[1.05] tracking-[-0.04em] @2xl:text-[58px] @2xl:leading-[1.03] @5xl:text-[68px] @5xl:leading-[1.03]">
            {title.lines.map((line, i) => {
              const accent = i === title.lines.length - 1 && title.lines.length > 1;
              // while editing the accent line is plain coloured text: a clipped gradient would vanish behind the focus highlight
              return <E key={i} value={line} onCommit={(text) => title.set(i, text)} className={cn("block pb-[0.04em]", accent && edit && "text-(--p)")} style={accent && !edit ? accentText : undefined} placeholder="Überschrift" />;
            })}
          </h1>
          <AddLine onClick={() => title.add("Neue Zeile")} label="Zeile" className="mt-3" />

          <T as="p" path={["text"]} value={p.text} multiline className="mt-6 max-w-[500px] text-[16.5px] leading-[1.65] text-(--mut)" placeholder="Worum geht es?" />

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#contact" className={cn(button, "text-(--p-on)")} style={accentFill}>
              <T path={["primary"]} value={p.primary} placeholder="Button" />
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            {(p.secondary || edit) && (
              <a href="#services" className={ghost}>
                <T path={["secondary"]} value={p.secondary} placeholder="Zweiter Button" />
              </a>
            )}
          </div>

          <ul className="mt-10 flex flex-wrap gap-2.5">
            {p.points.map((point, i) => (
              <li key={i} className="group/item relative flex items-center gap-2 rounded-full border border-(--line) py-2 pl-2.5 pr-4 text-[13px] font-medium text-(--fg)/85 backdrop-blur" style={{ background: "color-mix(in srgb, var(--card) 70%, transparent)" }}>
                <span className="flex size-[18px] shrink-0 items-center justify-center rounded-full bg-(--soft) text-(--p)">
                  <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                </span>
                <T path={["points", i]} value={point} placeholder="Vorteil" />
                <ItemTools path={["points"]} index={i} count={p.points.length} />
              </li>
            ))}
            <li className="self-center">
              <AddItem path={["points"]} item="Neuer Vorteil" label="Vorteil" />
            </li>
          </ul>
        </div>

        <HeroVisual note={p.note} />
      </div>
    </section>
  );
}

// ---------- services: bento of glass cards ----------
/** Small drawings for the first three cards; they take their colour from --p. */
function Illustration({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="pointer-events-none relative mx-auto mt-8 h-[200px] w-full max-w-[300px] @5xl:h-[250px]" aria-hidden="true">
        <span className="absolute inset-x-2 bottom-0 top-4 rounded-full opacity-55 blur-[42px]" style={{ background: `radial-gradient(closest-side, ${violet}, transparent)` }} />
        {[
          { cls: "right-2 top-1 rotate-[9deg] opacity-80", lines: [70, 88, 60, 80, 46, 72] },
          { cls: "left-3 top-9 -rotate-[4deg]", lines: [56, 90, 76, 84, 62, 78] },
        ].map((sheet, k) => (
          <span key={k} className={cn("absolute block h-[158px] w-[136px] rounded-[14px] border border-(--card) p-4 backdrop-blur-md @5xl:h-[196px] @5xl:w-[164px] @5xl:p-5", sheet.cls)} style={glass}>
            <span className="mb-3 block size-5 rounded-[6px]" style={accentFill} />
            {sheet.lines.map((w, i) => (
              <span key={i} className="mb-2 block h-[5px] rounded-full bg-(--p)/20 @5xl:mb-3" style={{ width: `${w}%` }} />
            ))}
          </span>
        ))}
      </div>
    );
  }
  if (index === 1) {
    return (
      <svg viewBox="0 0 220 110" className="pointer-events-none mt-auto h-[104px] w-[62%] shrink-0 self-end" aria-hidden="true">
        <defs>
          <linearGradient id="klar-peak" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--p)" stopOpacity="0.75" />
            <stop offset="1" stopColor="var(--p)" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path d="M0 110L52 58l24 20 38-58 44 52 22-18 40 56z" fill="url(#klar-peak)" opacity="0.45" />
        <path d="M40 110l74-90 74 90z" fill="url(#klar-peak)" />
        <path d="M114 20V2" stroke="var(--p)" strokeWidth="2" strokeLinecap="round" />
        <path d="M114 3h17l-5 5.5 5 5.5h-17z" fill="var(--p)" />
      </svg>
    );
  }
  if (index === 2) {
    return (
      <div className="pointer-events-none relative mt-auto h-[104px] w-[62%] shrink-0 self-end" aria-hidden="true">
        <span className="absolute bottom-0 left-0 block h-[78px] w-[74%] rounded-[12px] border border-(--line) bg-(--bg) p-3">
          {[64, 88, 52, 76].map((w, i) => (
            <span key={i} className="mb-2 block h-[5px] rounded-full bg-(--p)/20" style={{ width: `${w}%` }} />
          ))}
        </span>
        <span className="absolute right-0 top-0 flex h-9 w-[58%] items-center justify-end gap-2 rounded-[11px] border border-(--card) px-2.5 backdrop-blur-md" style={glass}>
          <span className="h-[5px] flex-1 rounded-full bg-(--p)/20" />
          <span className="flex h-5 w-9 items-center justify-end rounded-full p-0.5" style={accentFill}>
            <span className="size-4 rounded-full bg-white" />
          </span>
        </span>
      </div>
    );
  }
  return null;
}

function ServiceCard({ item, index, count }: { item: ServicesBlock["props"]["items"][number]; index: number; count: number }) {
  const text = useLines(["items", index, "text"], item.text);
  const [sub, ...checks] = text.lines;
  const tall = index === 0;
  return (
    <article className={cn(card, "d-rise group/item relative flex flex-col overflow-hidden p-6 transition-[border-color,translate] duration-300 hover:-translate-y-1 hover:border-(--p)/35 @2xl:p-7", tall && "@5xl:row-span-2")} style={glowShadow}>
      <div className="flex items-start gap-4">
        <span className="rounded-[13px]" style={accentFill}>
          <IconPick name={item.icon} path={["items", index, "icon"]} className="size-11 rounded-[13px] text-(--p-on)" iconClassName="size-5" strokeWidth={1.9} />
        </span>
        <div className="min-w-0 pt-0.5">
          <T as="h3" path={["items", index, "title"]} value={item.title} className="block text-[18px] font-bold leading-[1.2] tracking-[-0.02em] [font-family:var(--fh)]" placeholder="Leistung" />
          <E as="p" value={sub ?? ""} onCommit={(next) => text.keep(0, next)} className="mt-1 text-[13.5px] text-(--mut)" placeholder="Kurzbeschreibung" />
        </div>
      </div>
      <ul className="mt-6 space-y-2.5">
        {checks.map((line, k) => (
          <li key={k} className="flex items-start gap-2.5 text-[14px] leading-[1.45] text-(--fg)/85">
            <Check className="mt-[3px] size-3.5 shrink-0 text-(--p)" strokeWidth={2.6} aria-hidden="true" />
            <E value={line} onCommit={(next) => text.set(k + 1, next)} placeholder="Punkt" />
          </li>
        ))}
      </ul>
      <AddLine onClick={() => text.add("Neuer Punkt")} label="Punkt" className="mt-3 self-start" />
      <div className={cn("flex flex-1 items-end justify-between gap-4 pt-7", tall && "flex-col items-stretch")}>
        <span className={cn(round, "group-hover/item:border-transparent group-hover/item:bg-(--p) group-hover/item:text-(--p-on)", tall && "self-start")} aria-hidden="true">
          <ArrowRight className="size-4" />
        </span>
        <Illustration index={index} />
      </div>
      <ItemTools path={["items"]} index={index} count={count} />
    </article>
  );
}

function Services({ block }: { block: ServicesBlock }) {
  const { eyebrow, title, text, items } = block.props;
  return (
    <section id="services" className={section}>
      <div className={wrap}>
        <Head eyebrow={eyebrow} title={title} text={text} />
        <div className="mt-11 grid gap-4 @2xl:grid-cols-2 @5xl:grid-cols-3 @5xl:gap-5">
          {items.map((item, i) => (
            <ServiceCard key={i} item={item} index={i} count={items.length} />
          ))}
        </div>
        <div className="mt-5 empty:hidden">
          <AddItem path={["items"]} item={{ icon: "star", title: "Neue Leistung", text: "Kurz und klar beschrieben.\nErster Punkt\nZweiter Punkt" }} label="Leistung" />
        </div>
      </div>
    </section>
  );
}

// ---------- steps: connected timeline ----------
function Steps({ block }: { block: StepsBlock }) {
  const { eyebrow, title, text, items } = block.props;
  return (
    <section id="steps" className={section}>
      <div className={wrap}>
        <Head eyebrow={eyebrow} title={title} text={text} />
        <ol className="mt-12 grid gap-8 @4xl:grid-flow-col @4xl:auto-cols-fr @4xl:gap-6">
          {items.map((item, i) => (
            <li key={i} className="d-rise group/item relative flex gap-5 @4xl:block @4xl:text-center">
              {i < items.length - 1 && (
                <>
                  <span className="absolute left-[calc(50%+34px)] right-[calc(-50%+34px-1.5rem)] top-[22px] hidden h-px bg-gradient-to-r from-(--p)/60 to-(--p)/15 @4xl:block" aria-hidden="true" />
                  <span className="absolute bottom-[-2rem] left-[22px] top-[52px] w-px bg-(--p)/25 @4xl:hidden" aria-hidden="true" />
                </>
              )}
              <span
                className={cn("relative z-10 flex size-[46px] shrink-0 items-center justify-center rounded-full text-[13px] font-bold @4xl:mx-auto", i === 0 ? "text-(--p-on)" : "border border-(--p)/35 bg-(--card) text-(--p)")}
                style={i === 0 ? { ...accentFill, boxShadow: "0 0 0 7px color-mix(in srgb, var(--p) 14%, transparent), 0 14px 30px -12px color-mix(in srgb, var(--p) 80%, transparent)" } : undefined}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 pt-1.5 @4xl:pt-6">
                <T as="h3" path={["items", i, "title"]} value={item.title} className="block text-[17px] font-bold tracking-[-0.02em] [font-family:var(--fh)]" placeholder="Schritt" />
                <T as="p" path={["items", i, "text"]} value={item.text} multiline className="mt-1.5 text-[14px] leading-[1.55] text-(--mut) @4xl:mx-auto @4xl:max-w-[230px]" placeholder="Beschreibung" />
              </div>
              <ItemTools path={["items"]} index={i} count={items.length} />
            </li>
          ))}
        </ol>
        <div className="mt-6 empty:hidden">
          <AddItem path={["items"]} item={{ title: "Neuer Schritt", text: "Beschreibung." }} label="Schritt" />
        </div>
      </div>
    </section>
  );
}

// ---------- stats: light gradient band. The first entry is the band's headline (label = small line, value = headline). ----------
function Stats({ block }: { block: StatsBlock }) {
  const { items } = block.props;
  const [head, ...numbers] = items;
  return (
    <section className="bg-(--bg) py-5 @4xl:py-8">
      <div className={wrap}>
        <div
          className="d-rise relative grid items-center gap-9 overflow-hidden rounded-(--r) border border-(--line) px-6 py-9 @4xl:px-12 @4xl:py-11 @5xl:grid-cols-[0.82fr_1.5fr]"
          style={{ backgroundImage: `linear-gradient(105deg, color-mix(in srgb, var(--p) 9%, var(--card)), color-mix(in srgb, ${cyan} 15%, var(--card)) 48%, color-mix(in srgb, ${violet} 17%, var(--card)))` }}
        >
          {head && (
            <div>
              <Eyebrow value={head.label} path={["items", 0, "label"]} className="mb-3" />
              <T as="h2" path={["items", 0, "value"]} value={head.value} multiline className="[font-family:var(--fh)] text-[28px] font-bold leading-[1.12] tracking-[-0.03em] @2xl:text-[34px] @2xl:leading-[1.1]" placeholder="Überschrift" />
            </div>
          )}
          <div>
            <div className="grid grid-cols-2 gap-y-8 @4xl:flex">
              {numbers.map((item, i) => (
                <div key={i} className="group/item relative border-(--fg)/10 @4xl:flex-1 @4xl:px-7 @4xl:[&:not(:first-child)]:border-l">
                  <T path={["items", i + 1, "value"]} value={item.value} className="block text-[30px] font-bold leading-none tracking-[-0.035em] [font-family:var(--fh)] @2xl:text-[36px] @2xl:leading-none" placeholder="100" />
                  <T path={["items", i + 1, "label"]} value={item.label} multiline className="mt-2.5 block max-w-[130px] text-[13px] leading-[1.4] text-(--mut)" placeholder="Bezeichnung" />
                  <ItemTools path={["items"]} index={i + 1} count={items.length} />
                </div>
              ))}
            </div>
            <AddItem path={["items"]} item={{ value: "100", label: "Bezeichnung" }} label="Kennzahl" className="mt-5" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- quotes: one large testimonial at a time ----------
function Quotes({ block }: { block: QuotesBlock }) {
  const edit = useEdit();
  const { title, text, items } = block.props;
  const [at, setAt] = useState(0);
  const index = Math.min(at, items.length - 1);
  const item = items[index];
  const step = (by: number) => setAt((index + by + items.length) % items.length);
  const arrow = cn(round, "hover:border-(--p)/40 hover:text-(--p) disabled:opacity-40");
  return (
    <section id="quotes" className="bg-(--bg) py-5 @4xl:py-8">
      <div className={wrap}>
        <div className={cn(card, "d-rise relative px-5 py-7 @2xl:px-8 @4xl:px-[88px] @4xl:py-10")} style={glowShadow}>
          {item && (
            <figure className="group/item relative grid items-center gap-9 @4xl:grid-cols-[minmax(0,300px)_1fr] @4xl:gap-12">
              <div className="relative mx-auto w-full max-w-[300px]">
                {item.image || edit ? (
                  <Img key={index} src={item.image} path={["items", index, "image"]} alt={item.name} className="aspect-square w-full rounded-[calc(var(--r)*0.8)]" />
                ) : (
                  <Initials name={item.name} className="aspect-square w-full rounded-[calc(var(--r)*0.8)] bg-(--soft) text-[64px] text-(--p)" />
                )}
                {(text || edit) && (
                  <span className="absolute -bottom-4 right-3 flex items-center gap-2.5 rounded-[12px] border border-(--line) bg-(--card) px-3.5 py-2.5 shadow-[0_14px_30px_-16px_rgba(15,18,48,0.45)]">
                    <span className="flex size-7 items-center justify-center rounded-[8px] bg-(--soft) text-(--p)">
                      <Star className="size-3.5 fill-current" strokeWidth={0} aria-hidden="true" />
                    </span>
                    <span className="leading-tight">
                      <T path={["text"]} value={text} className="block text-[12.5px] font-semibold" placeholder="4,9 von 5" />
                      <Stars className="mt-0.5 text-[10px] text-(--p)" />
                    </span>
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <Eyebrow value={title} path={["title"]} />
                <T key={`q${index}`} as="blockquote" path={["items", index, "quote"]} value={item.quote} multiline className="[font-family:var(--fh)] text-[20px] font-medium leading-[1.4] tracking-[-0.02em] @2xl:text-[25px] @2xl:leading-[1.4] @5xl:text-[28px] @5xl:leading-[1.38]" placeholder="Zitat" />
                <figcaption className="mt-6">
                  <T key={`n${index}`} path={["items", index, "name"]} value={item.name} className="block text-[15px] font-bold" placeholder="Name" />
                  <T key={`r${index}`} path={["items", index, "role"]} value={item.role} className="mt-0.5 block text-[13.5px] text-(--mut)" placeholder="Rolle" />
                </figcaption>
              </div>
              <ItemTools path={["items"]} index={index} count={items.length} />
            </figure>
          )}

          {items.length > 1 && (
            <div className="mt-10 flex items-center justify-center gap-4 @4xl:mt-9">
              <button type="button" onClick={() => step(-1)} className={cn(arrow, "@4xl:absolute @4xl:left-6 @4xl:top-1/2 @4xl:-translate-y-1/2")} aria-label="Vorherige Kundenstimme">
                <ArrowLeft className="size-4" aria-hidden="true" />
              </button>
              <div className="flex items-center gap-2">
                {items.map((_, i) => (
                  <button key={i} type="button" onClick={() => setAt(i)} aria-label={`Kundenstimme ${i + 1}`} aria-pressed={i === index} className={cn("h-2 rounded-full transition-[width,background-color] duration-300", i === index ? "w-6 bg-(--p)" : "w-2 bg-(--fg)/15 hover:bg-(--fg)/30")} />
                ))}
              </div>
              <button type="button" onClick={() => step(1)} className={cn(arrow, "@4xl:absolute @4xl:right-6 @4xl:top-1/2 @4xl:-translate-y-1/2")} aria-label="Nächste Kundenstimme">
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          )}
          <div className="mt-5 text-center empty:hidden">
            <AddItem path={["items"]} item={{ quote: "Hier steht eine Kundenstimme.", name: "Vorname N.", role: "Kunde" }} label="Stimme" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- prices: package cards ----------
function Prices({ block }: { block: PricesBlock }) {
  const edit = useEdit();
  const blockId = useContext(BlockContext);
  const { eyebrow, title, text, groups } = block.props;
  const [yearly, setYearly] = useState(false);
  return (
    <section id="prices" className={section}>
      <div className={wrap}>
        <div className="d-rise grid gap-6 @5xl:grid-cols-[1fr_1fr_auto] @5xl:items-end @5xl:gap-10">
          <div>
            <Eyebrow value={eyebrow} />
            <T as="h2" path={["title"]} value={title} multiline className={h2} placeholder="Überschrift" />
          </div>
          <T as="p" path={["text"]} value={text} multiline className={cn(lead, "max-w-[420px] @5xl:pb-1.5")} placeholder="Kurzer Einleitungstext" />
          <div className="flex self-start justify-self-start rounded-full border border-(--line) bg-(--card) p-1 @5xl:self-end" role="group" aria-label="Abrechnung">
            {["Monatlich", "Jährlich"].map((name, i) => {
              const active = yearly === (i === 1);
              return (
                <button key={name} type="button" onClick={() => setYearly(i === 1)} aria-pressed={active} className={cn("h-9 rounded-full px-4 text-[13px] font-semibold transition-colors", active ? "text-(--p-on)" : "text-(--mut) hover:text-(--fg)")} style={active ? accentFill : undefined}>
                  {name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-11 grid items-start gap-5 @4xl:grid-cols-3">
          {groups.map((group, g) => (
            <article
              key={g}
              className={cn(card, "d-rise group/item relative flex flex-col p-6 @2xl:p-7", group.featured && "border-(--p)/60 @4xl:-mt-3 @4xl:pb-10 @4xl:pt-10")}
              style={group.featured ? { boxShadow: "0 0 0 4px color-mix(in srgb, var(--p) 10%, transparent), 0 40px 80px -44px color-mix(in srgb, var(--p) 75%, transparent)" } : glowShadow}
            >
              {group.featured && (
                <span className="absolute -top-3 right-6 flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold text-(--p-on)" style={accentFill}>
                  <Star className="size-3 fill-current" strokeWidth={0} aria-hidden="true" />
                  Beliebt
                </span>
              )}
              <T as="h3" path={["groups", g, "name"]} value={group.name} className="block text-[19px] font-bold tracking-[-0.02em] [font-family:var(--fh)]" placeholder="Paket" />
              <T as="p" path={["groups", g, "text"]} value={group.text} className="mt-1 text-[13.5px] text-(--mut)" placeholder="Für wen ist das Paket?" />
              <p className="mt-6 flex flex-wrap items-baseline gap-x-2">
                <T path={["groups", g, "price"]} value={group.price} className="text-[34px] font-bold leading-none tracking-[-0.035em] [font-family:var(--fh)]" placeholder="0 €" />
                <span className="text-[13px] text-(--mut)">{yearly ? "/ Monat bei jährlicher Zahlung" : "/ Monat"}</span>
              </p>
              <ul className="mt-6 space-y-3 border-t border-(--line) pt-6">
                {group.items.map((item, i) => (
                  <li key={i} className="group/item relative flex items-start gap-2.5 text-[14px] leading-[1.45]">
                    <Check className="mt-[3px] size-3.5 shrink-0 text-(--p)" strokeWidth={2.6} aria-hidden="true" />
                    <T path={["groups", g, "items", i, "name"]} value={item.name} placeholder="Leistung" />
                    <ItemTools path={["groups", g, "items"]} index={i} count={group.items.length} />
                  </li>
                ))}
              </ul>
              <AddItem path={["groups", g, "items"]} item={{ name: "Weitere Leistung", text: "", price: "" }} label="Leistung" className="mt-4 self-start" />
              <a href="#contact" className={cn(group.featured ? cn(button, "text-(--p-on)") : ghost, "mt-7 w-full")} style={group.featured ? accentFill : undefined}>
                Jetzt starten
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
              {edit && (
                <button type="button" onClick={() => edit.set(blockId, ["groups", g, "featured"], !group.featured)} className="mt-3 self-center text-[12px] font-medium text-(--p) underline underline-offset-4 [font-family:Outfit,sans-serif]">
                  {group.featured ? "Hervorhebung entfernen" : "Als beliebt hervorheben"}
                </button>
              )}
              <ItemTools path={["groups"]} index={g} count={groups.length} />
            </article>
          ))}
        </div>
        <div className="mt-5 empty:hidden">
          <AddItem path={["groups"]} item={{ name: "Neues Paket", text: "Für wen ist das Paket?", price: "0 €", items: [{ name: "Leistung", text: "", price: "" }] }} label="Paket" />
        </div>
      </div>
    </section>
  );
}

// ---------- faq ----------
function Faq({ block }: { block: FaqBlock }) {
  const edit = useEdit();
  const { eyebrow, title, text, items } = block.props;
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className={section}>
      <div className={cn(wrap, "grid gap-10 @5xl:grid-cols-[0.8fr_1.2fr] @5xl:gap-16")}>
        <div className="d-rise">
          <Eyebrow value={eyebrow} />
          <T as="h2" path={["title"]} value={title} multiline className={h2} placeholder="Überschrift" />
          <T as="p" path={["text"]} value={text} multiline className={cn(lead, "mt-5 max-w-[380px]")} placeholder="Kurzer Einleitungstext" />
          <a href="#contact" className={cn(ghost, "mt-7")}>
            Frage stellen
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>
        <div>
          <div className={cn(card, "d-rise divide-y divide-(--line) px-5 @2xl:px-7")} style={glowShadow}>
            {items.map((item, i) => {
              const shown = !!edit || open === i;
              return (
                <div key={i} className="group/item relative">
                  <div className="flex items-center justify-between gap-4 py-5">
                    {/* while editing the question is a text field, so only the round button toggles */}
                    {edit ? (
                      <T path={["items", i, "q"]} value={item.q} className="text-[16px] font-semibold tracking-[-0.01em]" placeholder="Frage" />
                    ) : (
                      <button type="button" onClick={() => setOpen(shown ? -1 : i)} aria-expanded={shown} className="flex-1 text-left text-[16px] font-semibold tracking-[-0.01em]">
                        {item.q}
                      </button>
                    )}
                    <button type="button" onClick={() => setOpen(shown ? -1 : i)} tabIndex={-1} aria-hidden="true" className={cn("flex size-7 shrink-0 items-center justify-center rounded-full border transition-colors", shown ? "border-transparent bg-(--soft) text-(--p)" : "border-(--line) text-(--mut)")}>
                      {shown ? <Minus className="size-3.5" /> : <Plus className="size-3.5" />}
                    </button>
                  </div>
                  {shown && <T as="p" path={["items", i, "a"]} value={item.a} multiline className="max-w-[580px] pb-6 text-[14.5px] leading-[1.65] text-(--mut)" placeholder="Antwort" />}
                  <ItemTools path={["items"]} index={i} count={items.length} />
                </div>
              );
            })}
          </div>
          <AddItem path={["items"]} item={{ q: "Neue Frage?", a: "Antwort." }} label="Frage" className="mt-4" />
        </div>
      </div>
    </section>
  );
}

// ---------- call to action: gradient panel ----------
function Cta({ block }: { block: CtaBlock }) {
  const { eyebrow, title, text, button: buttonText } = block.props;
  return (
    <section className="bg-(--bg) py-5 @4xl:py-8">
      <div className={wrap}>
        <div
          className="d-rise relative isolate grid items-center gap-7 overflow-hidden rounded-(--r) px-6 py-10 text-white @4xl:px-12 @4xl:py-14 @5xl:grid-cols-[1.45fr_1fr_auto] @5xl:gap-10"
          style={{ backgroundImage: `linear-gradient(115deg, ${cyan}, var(--p) 38%, color-mix(in srgb, var(--p) 72%, #1E1B4B) 100%)`, boxShadow: "0 40px 80px -44px color-mix(in srgb, var(--p) 90%, transparent)" }}
        >
          <svg viewBox="0 0 1200 300" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 -z-10 h-full w-full" aria-hidden="true">
            <path d="M0 210C220 110 380 290 620 190S1020 40 1200 130V300H0z" fill="#fff" opacity="0.08" />
            <path d="M0 260C260 160 420 320 700 230S1040 120 1200 200V300H0z" fill="#fff" opacity="0.07" />
            <circle cx="1040" cy="30" r="190" fill="#fff" opacity="0.07" />
          </svg>
          <div>
            <span className="mb-3 flex items-center gap-2 text-white/85 empty:hidden">
              <T path={["eyebrow"]} value={eyebrow} className={label} placeholder="Kurzzeile" />
            </span>
            <T as="h2" path={["title"]} value={title} multiline className="[font-family:var(--fh)] text-[28px] font-bold leading-[1.14] tracking-[-0.03em] @2xl:text-[34px] @2xl:leading-[1.12]" placeholder="Aufforderung" />
          </div>
          <T as="p" path={["text"]} value={text} multiline className="max-w-[420px] text-[15px] leading-[1.6] text-white/85" placeholder="Text" />
          <a href="#contact" className={cn(button, "h-[52px] justify-self-start bg-white px-6 text-[#0F1230] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.5)]")}>
            <T path={["button"]} value={buttonText} placeholder="Button" />
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

// ---------- contact ----------
function Contact({ block, doc }: { block: ContactBlock; doc: DemoDoc }) {
  const { eyebrow, title, text, hours, form } = block.props;
  const { meta } = doc;
  const input = "h-12 w-full rounded-(--r-sm) border border-(--line) bg-(--bg) px-4 text-[14.5px] text-(--fg) outline-none transition-[border-color,box-shadow] placeholder:text-(--mut) focus:border-(--p) focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--p)_14%,transparent)]";
  const tile = "flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-(--soft) text-(--p)";
  const row = "flex items-start gap-4";
  return (
    <section id="contact" className={section}>
      <div className={cn(wrap, "grid gap-12 @5xl:grid-cols-2 @5xl:gap-16")}>
        <div className="d-rise">
          <Eyebrow value={eyebrow} />
          <T as="h2" path={["title"]} value={title} multiline className={h2} placeholder="Überschrift" />
          <T as="p" path={["text"]} value={text} multiline className={cn(lead, "mt-5 max-w-[420px]")} placeholder="Kurzer Einleitungstext" />
          <ul className="mt-9 grid gap-6 text-[14.5px] @2xl:grid-cols-2">
            <li className={row}>
              <span className={tile}>
                <MapPin className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <T meta="address" value={meta.address} className="block font-semibold" placeholder="Straße und Hausnummer" />
                <T meta="city" value={meta.city} className="block text-(--mut)" placeholder="PLZ Ort" />
              </span>
            </li>
            <li className={row}>
              <span className={tile}>
                <Phone className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <T meta="phone" value={meta.phone} className="block font-semibold" placeholder="Telefon" />
                <span className="block text-(--mut)">Telefon</span>
              </span>
            </li>
            <li className={row}>
              <span className={tile}>
                <Mail className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <T meta="email" value={meta.email} className="block break-all font-semibold" placeholder="E-Mail" />
                <span className="block text-(--mut)">E-Mail</span>
              </span>
            </li>
            <li className={cn(row, "@2xl:col-span-2")}>
              <span className={tile}>
                <Clock className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <span className="min-w-0 max-w-[330px] flex-1">
                {hours.map((h, i) => (
                  <span key={i} className="group/item relative flex justify-between gap-4 py-0.5">
                    <T path={["hours", i, "day"]} value={h.day} className="text-(--mut)" placeholder="Tag" />
                    <T path={["hours", i, "time"]} value={h.time} className="font-semibold" placeholder="Zeit" />
                    <ItemTools path={["hours"]} index={i} count={hours.length} />
                  </span>
                ))}
                <AddItem path={["hours"]} item={{ day: "Tag", time: "09–18 Uhr" }} label="Zeile" className="mt-2" />
              </span>
            </li>
          </ul>
          <MapArt className="mt-9 h-[190px] rounded-(--r) border border-(--line)" label={meta.address} />
        </div>
        {form && (
          <form className={cn(card, "d-rise space-y-3 self-start p-6 @2xl:p-9")} style={glowShadow} onSubmit={(e) => e.preventDefault()}>
            <p className="text-[19px] font-bold tracking-[-0.02em] [font-family:var(--fh)]">Erstgespräch anfragen</p>
            <p className="pb-3 text-[13.5px] text-(--mut)">Kostenlos und unverbindlich – wir melden uns innerhalb eines Werktags.</p>
            <div className="grid gap-3 @2xl:grid-cols-2">
              <input className={input} placeholder="Name" aria-label="Name" />
              <input className={input} placeholder="Unternehmen" aria-label="Unternehmen" />
            </div>
            <div className="grid gap-3 @2xl:grid-cols-2">
              <input className={input} placeholder="E-Mail" aria-label="E-Mail" />
              <input className={input} placeholder="Telefon" aria-label="Telefon" />
            </div>
            <textarea className={cn(input, "h-32 resize-none py-3")} placeholder="Worum geht es?" aria-label="Nachricht" />
            <button type="submit" className={cn(button, "w-full text-(--p-on)")} style={accentFill}>
              Anfrage senden
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

// ---------- footer ----------
function Footer({ block, doc }: { block: FooterBlock; doc: DemoDoc }) {
  const { text, links } = block.props;
  const { meta } = doc;
  const services = doc.blocks.find((b) => b.type === "services");
  const offers = services?.type === "services" ? services.props.items.map((item) => item.title) : [];
  const heading = "mb-4 block text-[13px] font-bold text-(--fg)";
  const list = "space-y-2.5 text-[13.5px] text-(--mut)";
  return (
    <footer className="border-t border-(--line) bg-(--bg) pb-8 pt-14">
      <div className={cn(wrap, "grid gap-10 @2xl:grid-cols-2 @5xl:grid-cols-[1.5fr_1fr_1fr_1fr_1.2fr]")}>
        <div className="@2xl:col-span-2 @5xl:col-span-1">
          <span className="flex items-center gap-3">
            <Mark doc={doc} />
            <T meta="company" value={meta.company} className="text-[17px] font-bold tracking-[-0.02em]" placeholder="Firmenname" />
          </span>
          <T as="p" path={["text"]} value={text} multiline className="mt-4 max-w-[260px] text-[13.5px] leading-[1.6] text-(--mut)" placeholder="Kurzer Satz" />
        </div>
        {offers.length > 0 && (
          <div>
            <span className={heading}>Leistungen</span>
            <ul className={list}>
              {offers.slice(0, 6).map((name, i) => (
                <li key={i}>{name}</li>
              ))}
            </ul>
          </div>
        )}
        <div>
          <span className={heading}>Navigation</span>
          <ul className={list}>
            {navLinks(doc).map((link, i) => (
              <li key={i}>{link}</li>
            ))}
          </ul>
        </div>
        <div>
          <span className={heading}>Rechtliches</span>
          <ul className={list}>
            {links.map((link, i) => (
              <li key={i}>
                <T path={["links", i]} value={link} placeholder="Link" />
              </li>
            ))}
          </ul>
        </div>
        <div>
          <span className={heading}>Kontakt</span>
          <ul className={list}>
            <li>{meta.address}</li>
            <li>{meta.city}</li>
            <li>{meta.phone}</li>
            <li className="break-all">{meta.email}</li>
          </ul>
        </div>
      </div>
      <p className={cn(wrap, "mt-12 text-[12.5px] text-(--mut)")}>
        <span className="block border-t border-(--line) pt-6">
          © {new Date().getFullYear()} {meta.company}. Alle Rechte vorbehalten.
        </span>
      </p>
    </footer>
  );
}

export default function KlarBlock({ block, doc }: SkinProps) {
  switch (block.type) {
    case "nav":
      return <Nav block={block} doc={doc} />;
    case "hero":
      return <Hero block={block} />;
    case "services":
      return <Services block={block} />;
    case "steps":
      return <Steps block={block} />;
    case "stats":
      return <Stats block={block} />;
    case "quotes":
      return <Quotes block={block} />;
    case "prices":
      return <Prices block={block} />;
    case "faq":
      return <Faq block={block} />;
    case "cta":
      return <Cta block={block} />;
    case "contact":
      return <Contact block={block} doc={doc} />;
    case "footer":
      return <Footer block={block} doc={doc} />;
    default:
      return renderBase(block, doc);
  }
}
