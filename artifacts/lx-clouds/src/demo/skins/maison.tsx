import { ArrowRight, BadgeCheck, Check, Clock, Facebook, Instagram, Mail, MapPin, Menu, Navigation, Phone, Search, ShoppingBag, Sparkle, Store, User } from "lucide-react";
import { createElement, useContext, useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { renderBase, type SkinProps } from "../blocks";
import { AddItem, BlockContext, Img, ItemTools, T, imageUrl, useEdit } from "../edit";
import type { AboutBlock, CardsBlock, ContactBlock, CtaBlock, DemoDoc, FooterBlock, HeroBlock, NavBlock, Path, QuotesBlock, ServicesBlock, StatsBlock } from "../types";
import { IconPick, Initials, MapArt, Stars, navLinks } from "./kit";

// "Maison": a small concept store. Warm off-white, confident colour blocking (brand colour, tomato, butter yellow, sage),
// friendly geometric headlines, sticker badges and round shapes.

const wrap = "mx-auto w-full max-w-[1320px] px-5 @2xl:px-8";
// (line height comes after the size: a font-size utility would otherwise reset it)
const display = "[font-family:var(--fh)] font-extrabold tracking-[-0.025em]";
const h2 = cn(display, "text-[34px] leading-[1.04] @2xl:text-[42px] @2xl:leading-[1.04] @5xl:text-[50px] @5xl:leading-[1.04]");
const caps = "text-[12px] font-bold uppercase tracking-[0.14em]";
const pill = "inline-flex h-[52px] items-center justify-center gap-2.5 rounded-full bg-(--fg) px-7 text-[15px] font-semibold text-(--bg) transition-[translate,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-14px_var(--fg)]";

const FG = "var(--fg)";
const BLUE = "var(--p)";
const RED = "var(--c2)";

// ---------- headlines whose lines each have their own colour, editable as one text ----------
const escapeHtml = (text: string) => text.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c] ?? c);
const linesHtml = (value: string, colours: string[]) =>
  value
    .split("\n")
    .map((line, i) => `<span style="display:block;color:${colours[i % colours.length]}">${escapeHtml(line)}</span>`)
    .join("");

function ColourLines({ value: given, path, colours, as = "h2", className, placeholder = "Überschrift" }: { value: string | undefined; path: Path; colours: string[]; as?: string; className?: string; placeholder?: string }) {
  const value = given ?? "";
  const edit = useEdit();
  const blockId = useContext(BlockContext);
  const ref = useRef<HTMLElement>(null);
  const html = value ? linesHtml(value, colours) : "";

  // The DOM owns the text while it is being typed; React writes it when the value changes elsewhere.
  useLayoutEffect(() => {
    const el = ref.current;
    if (el && document.activeElement !== el) el.innerHTML = html;
  }, [html, edit]);

  if (!edit) {
    if (!value) return null;
    return createElement(
      as,
      { className },
      value.split("\n").map((line, i) => (
        <span key={i} className="block" style={{ color: colours[i % colours.length] }}>
          {line}
        </span>
      )),
    );
  }

  return createElement(as, {
    ref,
    className: cn(className, "demo-editable"),
    contentEditable: true,
    suppressContentEditableWarning: true,
    spellCheck: false,
    "data-placeholder": placeholder,
    onBlur: (e: { currentTarget: HTMLElement }) => {
      const el = e.currentTarget;
      const next = el.innerText
        .replace(/ /g, " ")
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean)
        .join("\n");
      el.innerHTML = next ? linesHtml(next, colours) : "";
      if (next !== value) edit.set(blockId, path, next);
    },
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
      if (e.key === "Escape") {
        e.currentTarget.innerHTML = html;
        e.currentTarget.blur();
      }
      e.stopPropagation();
    },
    onPaste: (e: { preventDefault: () => void; clipboardData: DataTransfer }) => {
      e.preventDefault();
      document.execCommand("insertText", false, e.clipboardData.getData("text/plain"));
    },
  });
}

// ---------- the shopping bag: products add to it, the navigation shows the count ----------
let bagCount = 0;
const bagListeners = new Set<() => void>();
const bag = {
  add() {
    bagCount += 1;
    bagListeners.forEach((notify) => notify());
  },
  subscribe(listener: () => void) {
    bagListeners.add(listener);
    return () => {
      bagListeners.delete(listener);
    };
  },
  count: () => bagCount,
};
const useBag = () => useSyncExternalStore(bag.subscribe, bag.count);

// ---------- small shared pieces ----------
function Eyebrow({ value, className }: { value: string | undefined; className?: string }) {
  return <T path={["eyebrow"]} value={value} className={cn(caps, "mb-4 block", className)} placeholder="Kurzzeile" />;
}

/** A soft organic colour shape for backgrounds. */
function Blob({ className, style }: { className?: string; style?: CSSProperties }) {
  return <span aria-hidden="true" className={cn("pointer-events-none absolute rounded-[58%_42%_55%_45%/52%_48%_52%_48%]", className)} style={style} />;
}

/** Wordmark that breaks into one word per line, like a shop sign. */
function Wordmark({ doc, className }: { doc: DemoDoc; className?: string }) {
  if (doc.theme.logo) return <img src={imageUrl(doc.theme.logo)} alt={doc.meta.company} className="h-10 w-auto max-w-[170px] object-contain" />;
  // short names stack one word per line; longer ones run on, smaller, over at most two lines
  const stacked = doc.meta.company.trim().split(/\s+/).length <= 2 && doc.meta.company.length <= 16;
  return (
    <T
      meta="company"
      value={doc.meta.company}
      className={cn(
        display,
        "block min-w-[3ch] uppercase tracking-[-0.01em]",
        stacked ? "w-min text-[21px] leading-[0.95]" : "line-clamp-2 max-w-[190px] text-[14px] leading-[1.08] @2xl:max-w-[250px] @2xl:text-[16px] @2xl:leading-[1.08]",
        className,
      )}
      placeholder="Firmenname"
    />
  );
}

// ---------- nav: announcement marquee, wordmark, links, shop icons ----------
function Nav({ block, doc }: { block: NavBlock; doc: DemoDoc }) {
  const edit = useEdit();
  const count = useBag();
  const { links, notice } = block.props;
  const notes = (notice ?? "")
    .split(/\s*[·✦|]\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
  const run = Array.from({ length: 4 }, () => notes).flat();
  const iconButton = "relative flex size-10 items-center justify-center rounded-full transition-colors hover:bg-(--fg)/[0.07]";
  return (
    <header className="bg-(--bg)">
      {(notice || edit) && (
        <div className="overflow-hidden bg-(--p) text-(--p-on)">
          {edit ? (
            <div className={cn(wrap, "py-2.5 text-center text-[13px] font-semibold")}>
              <T path={["notice"]} value={notice} placeholder="Hinweiszeile – mehrere Hinweise mit · trennen" />
            </div>
          ) : (
            <div className="flex w-max [animation:d-marquee_42s_linear_infinite] motion-reduce:[animation:none]">
              {[0, 1].map((half) => (
                <div key={half} className="flex shrink-0 items-center" aria-hidden={half === 1}>
                  {run.map((note, i) => (
                    <span key={i} className="flex items-center gap-7 py-2.5 pl-7 text-[13px] font-semibold whitespace-nowrap">
                      <Sparkle className="size-3 fill-current" aria-hidden="true" />
                      {note}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <div className={cn(wrap, "flex h-[76px] items-center justify-between gap-6")}>
        <Wordmark doc={doc} />
        <nav className="hidden items-center gap-8 @5xl:flex">
          {links.map((link, i) => (
            <T key={i} path={["links", i]} value={link} className="text-[15px] font-semibold transition-colors hover:text-(--p)" placeholder="Link" />
          ))}
        </nav>
        <div className="flex items-center gap-0.5">
          <span className={iconButton} aria-hidden="true">
            <Search className="size-[21px]" strokeWidth={1.9} />
          </span>
          <span className={cn(iconButton, "hidden @2xl:flex")} aria-hidden="true">
            <User className="size-[21px]" strokeWidth={1.9} />
          </span>
          <a href="#offers" className={iconButton} aria-label={`Warenkorb, ${count} Artikel`}>
            <ShoppingBag className="size-[21px]" strokeWidth={1.9} />
            {count > 0 && (
              <span key={count} className="absolute right-0 top-0 flex size-[19px] items-center justify-center rounded-full bg-(--c2) text-[11px] font-bold text-white [animation:d-pop_0.35s_ease-out]">
                {count}
              </span>
            )}
          </a>
          <span className={cn(iconButton, "@5xl:hidden")} aria-hidden="true">
            <Menu className="size-[22px]" strokeWidth={1.9} />
          </span>
        </div>
      </div>
      {/* local keyframes: the count badge pops in */}
      <style>{"@keyframes d-pop{from{scale:.3;opacity:0}60%{scale:1.2}}"}</style>
    </header>
  );
}

// ---------- hero ----------
/** Sticker with a scalloped edge. */
function Sticker({ children, className }: { children: ReactNode; className?: string }) {
  const lobes = 14;
  return (
    <span className={cn("absolute flex items-center justify-center", className)}>
      <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full fill-(--c3) drop-shadow-[0_10px_14px_rgba(60,40,0,0.18)]" aria-hidden="true">
        <circle cx="60" cy="60" r="47" />
        {Array.from({ length: lobes }, (_, i) => {
          const angle = (i / lobes) * Math.PI * 2;
          return <circle key={i} cx={60 + Math.cos(angle) * 46} cy={60 + Math.sin(angle) * 46} r="12.5" />;
        })}
      </svg>
      {children}
    </span>
  );
}

// where the handwritten labels sit on the hero photo, and the little arrow that goes with each
const labelSpots = [
  { box: "left-[0%] top-[39%] @5xl:-left-[3%]", arrow: "M4 6 C 14 4, 22 10, 26 20", head: "M26 20 l-6 -3 M26 20 l2 -7", arrowBox: "ml-auto mt-0.5" },
  { box: "right-[1%] top-[13%]", arrow: "M28 4 C 22 4, 12 10, 6 20", head: "M6 20 l7 -2 M6 20 l-1 -7", arrowBox: "mt-0.5" },
  { box: "left-[38%] top-[79%]", arrow: "M10 26 C 6 18, 12 10, 20 5", head: "M20 5 l-7 0 M20 5 l-2 7", arrowBox: "order-first mx-auto mb-0.5" },
  { box: "left-[2%] top-[84%]", arrow: "M4 20 C 12 22, 22 16, 26 6", head: "M26 6 l-7 2 M26 6 l1 7", arrowBox: "order-first ml-auto mb-0.5" },
];

function Hero({ block }: { block: HeroBlock }) {
  const edit = useEdit();
  const p = block.props;
  return (
    <section id="top" className="relative overflow-hidden bg-(--bg)">
      <div className={cn(wrap, "grid items-center gap-6 pb-12 pt-8 @5xl:grid-cols-[0.8fr_1.2fr] @5xl:gap-2 @5xl:pb-14 @5xl:pt-10")}>
        <div className="relative z-10">
          <T path={["eyebrow"]} value={p.eyebrow} className={cn(caps, "mb-5 block")} placeholder="Kurzzeile" />
          <ColourLines
            as="h1"
            path={["title"]}
            value={p.title}
            colours={[FG, BLUE, FG, RED]}
            className={cn(display, "text-[50px] leading-[1.02] @2xl:text-[68px] @2xl:leading-[1.02] @5xl:text-[80px] @5xl:leading-[1.03] @6xl:text-[88px] @6xl:leading-[1.03]")}
            placeholder="Hauptüberschrift"
          />
          <T as="p" path={["text"]} value={p.text} multiline className="mt-6 max-w-[430px] text-[17px] leading-[1.5] font-medium text-(--fg)/85 @2xl:text-[18.5px]" placeholder="Worum geht es?" />
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href="#offers" className={pill}>
              <T path={["primary"]} value={p.primary} placeholder="Button" />
              <ArrowRight className="size-[18px]" aria-hidden="true" />
            </a>
            {(p.secondary || edit) && (
              <a href="#about" className="text-[15px] font-semibold underline decoration-2 underline-offset-[6px] hover:text-(--p)">
                <T path={["secondary"]} value={p.secondary} placeholder="Zweiter Link" />
              </a>
            )}
          </div>
        </div>

        <div className="relative @5xl:-mr-4">
          <Blob className="right-[4%] top-[6%] h-[88%] w-[62%] bg-(--bg2)" />
          <Img
            src={p.image}
            path={["image"]}
            alt=""
            eager
            chip="br"
            className="relative aspect-[3/2.05] w-full bg-transparent"
            imgClassName="[mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent,black_13%,black_88%,transparent),linear-gradient(to_bottom,transparent,black_7%,black_87%,transparent)]"
          />
          {(p.badge || edit) && (
            <Sticker className="right-[20%] top-[1%] size-[92px] -rotate-[9deg] @2xl:size-[128px] @5xl:size-[142px]">
              <T path={["badge"]} value={p.badge} multiline className={cn(display, "relative max-w-[76%] text-center text-[15px] leading-[1.02] text-[#171717] @2xl:text-[21px] @2xl:leading-[1.02] @5xl:text-[23px] @5xl:leading-[1.02]")} placeholder="Sticker" />
            </Sticker>
          )}
          {p.points.map((point, i) => {
            const spot = labelSpots[i % labelSpots.length];
            return (
              <span key={i} className={cn("group/item absolute z-10 flex max-w-[30%] flex-col", spot.box)}>
                <T path={["points", i]} value={point} multiline className="d-script block text-center text-[13px] leading-[1.25] text-[#171717] @2xl:text-[17px] @2xl:leading-[1.25] @5xl:text-[19px] @5xl:leading-[1.25]" placeholder="Notiz" />
                <svg viewBox="0 0 32 28" className={cn("h-5 w-6 fill-none stroke-[#171717] @2xl:h-7 @2xl:w-8", spot.arrowBox)} strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                  <path d={spot.arrow} />
                  <path d={spot.head} />
                </svg>
                <ItemTools path={["points"]} index={i} count={p.points.length} />
              </span>
            );
          })}
          <div className="absolute bottom-1 left-1">
            <AddItem path={["points"]} item="Produktname" label="Notiz" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- services: category tiles in strong colours ----------
const tileInk = ["#171717", "#ffffff", "#ffffff", "#ffffff"];
const tileBack = ["var(--c3)", "var(--c2)", "var(--c4)", "var(--p)"];

function Services({ block }: { block: ServicesBlock }) {
  const edit = useEdit();
  const { eyebrow, title, text, items } = block.props;
  const hasHead = !!(eyebrow || title || text);
  return (
    <section id="services" className="bg-(--bg) pb-12 @4xl:pb-16">
      <div className={wrap}>
        {hasHead ? (
          <div className="d-rise mb-7">
            <Eyebrow value={eyebrow} />
            <T as="h2" path={["title"]} value={title} className={cn(h2, "block")} placeholder="Überschrift" />
            <T as="p" path={["text"]} value={text} multiline className="mt-3 max-w-[560px] text-[16.5px] leading-[1.55] text-(--mut)" placeholder="Kurzer Einleitungstext" />
          </div>
        ) : (
          // the design has no heading above the tiles; while editing a small field offers to add one
          edit && <T as="h2" path={["title"]} value={title} className="mb-3 block text-[14px] font-semibold text-(--mut)" placeholder="Überschrift über den Kacheln (optional)" />
        )}
        <div className="grid grid-cols-2 gap-3 @2xl:gap-4 @5xl:grid-cols-4">
          {items.map((item, i) => (
            <article key={i} className="d-rise group/item relative aspect-[1/0.98] overflow-hidden rounded-(--r) transition-[translate,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_40px_-26px_rgba(23,23,23,0.5)]" style={{ background: tileBack[i % 4], color: tileInk[i % 4] }}>
              <Img src={item.image} path={["items", i, "image"]} alt="" chip="br" className="absolute inset-0 h-full w-full bg-transparent" imgClassName="object-[82%_100%] transition-transform duration-700 group-hover/item:scale-[1.06]" />
              <a href="#offers" className="relative block p-4 @2xl:p-6">
                <T as="h3" path={["items", i, "title"]} value={item.title} className={cn(display, "block text-[23px] leading-[1.05] @2xl:text-[30px] @2xl:leading-[1.05]")} placeholder="Kategorie" />
                <ArrowRight className="mt-2 size-6 transition-transform duration-300 group-hover/item:translate-x-1.5 @2xl:mt-3 @2xl:size-7" strokeWidth={2.2} aria-hidden="true" />
              </a>
              <ItemTools path={["items"]} index={i} count={items.length} />
            </article>
          ))}
        </div>
        <div className="mt-5 empty:hidden">
          <AddItem path={["items"]} item={{ icon: "bag", title: "Kategorie", text: "", image: "" }} label="Kategorie" />
        </div>
      </div>
    </section>
  );
}

// ---------- cards: bestsellers ----------
const tagStyles = ["bg-(--c3) text-[#171717]", "bg-(--c2) text-white", "bg-(--p) text-(--p-on)", "bg-(--c4) text-white"];
const swatches = [
  ["#1447C8", "#E9DCC9", "#4C6444"],
  ["#F1E6D3", "#EDA596", "#66704A"],
  ["#4C6E4A", "#E8DAC3", "#2C5FC4"],
  ["#D9C7AD", "#2A2A26", "#1447C8"],
];

function Product({ item, i, count }: { item: CardsBlock["props"]["items"][number]; i: number; count: number }) {
  const [added, setAdded] = useState(false);
  const [swatch, setSwatch] = useState(0);
  const add = () => {
    if (added) return;
    bag.add();
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1700);
  };
  return (
    <article className="d-rise group/item relative flex h-full flex-col">
      <div className="relative overflow-hidden rounded-(--r)">
        <Img src={item.image} path={["items", i, "image"]} alt={item.title} className="aspect-[1/0.94] w-full" imgClassName="transition-transform duration-700 group-hover/item:scale-[1.05]" />
        <T path={["items", i, "tag"]} value={item.tag} className={cn("absolute left-3 top-3 rounded-full px-3 py-1 text-[12.5px] font-bold", tagStyles[i % tagStyles.length])} placeholder="Sticker" />
      </div>
      <T as="h3" path={["items", i, "title"]} value={item.title} className="mt-4 block text-[17px] font-bold tracking-[-0.01em]" placeholder="Produkt" />
      <T as="p" path={["items", i, "text"]} value={item.text} className="mt-0.5 flex-1 text-[14.5px] text-(--mut)" placeholder="Beschreibung" />
      <T path={["items", i, "price"]} value={item.price} className="mt-2.5 block text-[17px] font-bold" placeholder="Preis" />
      <div className="mt-3 flex gap-2" role="group" aria-label="Farbe">
        {swatches[i % swatches.length].map((colour, s) => (
          <button key={colour} type="button" onClick={() => setSwatch(s)} aria-label={`Farbe ${s + 1}`} aria-pressed={swatch === s} className={cn("size-[18px] rounded-full border border-(--fg)/15 outline-offset-2 transition-shadow", swatch === s && "ring-2 ring-(--fg) ring-offset-2 ring-offset-(--bg)")} style={{ background: colour }} />
        ))}
      </div>
      <button type="button" onClick={add} className={cn("mt-4 flex h-12 w-full items-center justify-center gap-2.5 rounded-[12px] text-[14.5px] font-semibold transition-[background-color,translate] duration-200 hover:-translate-y-0.5", added ? "bg-(--c4) text-white" : "bg-(--fg) text-(--bg)")}>
        {added ? <Check className="size-[18px]" strokeWidth={2.4} aria-hidden="true" /> : <ShoppingBag className="size-[17px]" strokeWidth={2} aria-hidden="true" />}
        {added ? "Liegt im Warenkorb" : "In den Warenkorb"}
      </button>
      <ItemTools path={["items"]} index={i} count={count} />
    </article>
  );
}

function Cards({ block }: { block: CardsBlock }) {
  const edit = useEdit();
  const { eyebrow, title, text, button, items } = block.props;
  return (
    <section id="offers" className="bg-(--bg) pb-14 pt-2 @4xl:pb-20">
      <div className={wrap}>
        <div className="d-rise flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div>
            <Eyebrow value={eyebrow} />
            <T as="h2" path={["title"]} value={title} className={cn(h2, "block")} placeholder="Überschrift" />
            <T as="p" path={["text"]} value={text} multiline className="mt-2.5 max-w-[520px] text-[16.5px] leading-[1.5] text-(--mut)" placeholder="Kurzer Einleitungstext" />
          </div>
          {(button || edit) && (
            <a href="#offers" className="group/link mb-1.5 inline-flex items-center gap-2 text-[15.5px] font-bold underline decoration-2 underline-offset-[6px] hover:text-(--p)">
              <T path={["button"]} value={button} placeholder="Link" />
              <ArrowRight className="size-[18px] transition-transform group-hover/link:translate-x-1" aria-hidden="true" />
            </a>
          )}
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-9 @2xl:gap-x-5 @5xl:grid-cols-4">
          {items.map((item, i) => (
            <Product key={i} item={item} i={i} count={items.length} />
          ))}
        </div>
        <div className="mt-6 empty:hidden">
          <AddItem path={["items"]} item={{ image: "", title: "Neues Produkt", text: "Material, Größe", price: "0,00 €", tag: "Neu" }} label="Produkt" />
        </div>
      </div>
    </section>
  );
}

// ---------- about: editorial banner ----------
function About({ block }: { block: AboutBlock }) {
  const edit = useEdit();
  const { eyebrow, title, text, image, points, flip, button } = block.props;
  return (
    <section id="about" className="relative isolate overflow-hidden bg-[color-mix(in_srgb,var(--c2)_9%,var(--bg))]">
      <Blob className={cn("-top-24 -z-10 size-[300px] bg-(--c2) @5xl:size-[360px]", flip ? "-right-28" : "-left-28")} />
      <Blob className={cn("-bottom-28 -z-10 size-[250px] rotate-45 bg-(--c3) @5xl:size-[330px]", flip ? "-left-20" : "-right-20")} />
      <div className={cn(wrap, "grid items-center gap-9 py-12 @5xl:grid-cols-2 @5xl:gap-16 @5xl:py-16")}>
        <Img src={image} path={["image"]} alt="" className={cn("d-rise aspect-[16/10] w-full rounded-(--r) shadow-[0_30px_60px_-36px_rgba(23,23,23,0.55)]", flip && "@5xl:order-2")} />
        <div className="d-rise">
          <Eyebrow value={eyebrow} />
          <ColourLines path={["title"]} value={title} colours={[BLUE, FG]} className={cn(display, "text-[40px] leading-[1.02] @2xl:text-[54px] @2xl:leading-[1.02] @5xl:text-[66px] @5xl:leading-[1.02]")} />
          <T as="p" path={["text"]} value={text} multiline className="mt-5 max-w-[500px] text-[17px] leading-[1.55] text-(--fg)/85" placeholder="Über das Unternehmen" />
          {(points.length > 0 || edit) && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {points.map((point, i) => (
                <li key={i} className="group/item relative flex items-center gap-2 rounded-full bg-(--card) px-3.5 py-2 text-[14px] font-semibold shadow-[0_6px_16px_-10px_rgba(23,23,23,0.4)]">
                  <Check className="size-4 text-(--p)" strokeWidth={2.6} aria-hidden="true" />
                  <T path={["points", i]} value={point} placeholder="Punkt" />
                  <ItemTools path={["points"]} index={i} count={points.length} />
                </li>
              ))}
              <li className="self-center">
                <AddItem path={["points"]} item="Neuer Punkt" label="Punkt" />
              </li>
            </ul>
          )}
          {(button || edit) && (
            <a href="#contact" className={cn(pill, "mt-8")}>
              <T path={["button"]} value={button} placeholder="Button" />
              <ArrowRight className="size-[18px]" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

// ---------- stats: the benefits row ----------
const benefitTints = ["color-mix(in srgb, var(--p) 15%, var(--bg))", "color-mix(in srgb, var(--c4) 26%, var(--bg))", "color-mix(in srgb, var(--c2) 20%, var(--bg))", "color-mix(in srgb, var(--c3) 38%, var(--bg))"];
const benefitIcons = ["truck", "box", "store", "gift"];

function Stats({ block }: { block: StatsBlock }) {
  const { items } = block.props;
  return (
    <section className="bg-(--bg) py-9 @4xl:py-12">
      <div className={cn(wrap, "grid gap-7 @4xl:flex")}>
        {items.map((item, i) => (
          <div key={i} className="d-rise group/item relative flex items-center gap-5 border-(--line) @4xl:flex-1 @4xl:justify-center @4xl:[&:not(:first-child)]:border-l @4xl:[&:not(:first-child)]:pl-6">
            <span className="flex size-[68px] shrink-0 rounded-full" style={{ background: benefitTints[i % benefitTints.length] }}>
              <IconPick name={item.icon ?? benefitIcons[i % benefitIcons.length]} path={["items", i, "icon"]} className="size-full rounded-full" iconClassName="size-8" strokeWidth={1.5} />
            </span>
            <div className="min-w-0">
              <T path={["items", i, "value"]} value={item.value} className="block text-[18.5px] font-bold tracking-[-0.01em]" placeholder="Vorteil" />
              <T path={["items", i, "label"]} value={item.label} multiline className="mt-1 block max-w-[230px] text-[14.5px] leading-[1.4] text-(--mut)" placeholder="Kurz erklärt" />
            </div>
            <ItemTools path={["items"]} index={i} count={items.length} />
          </div>
        ))}
      </div>
      <div className={cn(wrap, "mt-4 empty:hidden")}>
        <AddItem path={["items"]} item={{ value: "Neuer Vorteil", label: "Kurz erklärt.", icon: "gift" }} label="Vorteil" />
      </div>
    </section>
  );
}

// ---------- quotes: sage band ----------
function Quotes({ block }: { block: QuotesBlock }) {
  const { eyebrow, title, text, items } = block.props;
  return (
    <section id="quotes" className="relative isolate overflow-hidden bg-[color-mix(in_srgb,var(--c4)_24%,var(--bg))] py-12 @4xl:py-16">
      <Blob className="-bottom-40 -left-24 -z-10 size-[300px] bg-(--c3)" />
      <div className={cn(wrap, "grid items-center gap-9 @5xl:grid-cols-[0.62fr_1fr] @5xl:gap-10")}>
        <div className="d-rise">
          <Eyebrow value={eyebrow} />
          <ColourLines path={["title"]} value={title} colours={[FG, BLUE]} className={cn(display, "text-[36px] leading-[1.04] @2xl:text-[46px] @2xl:leading-[1.04] @5xl:text-[52px] @5xl:leading-[1.04]")} />
          <T as="p" path={["text"]} value={text} multiline className="mt-4 max-w-[380px] text-[15.5px] leading-[1.5] text-(--fg)/75" placeholder="z. B. 4,9 von 5 Sternen" />
        </div>
        <div>
          <div className="grid gap-3 @2xl:grid-cols-3 @2xl:gap-4">
            {items.map((item, i) => (
              <figure key={i} className="d-rise group/item relative flex flex-col rounded-(--r) bg-(--card) p-5 shadow-[0_18px_34px_-26px_rgba(23,23,23,0.5)] @5xl:p-6">
                <Stars className="text-[19px] text-(--c3)" />
                <T as="blockquote" path={["items", i, "quote"]} value={item.quote} multiline className="mt-3.5 flex-1 text-[14.5px] leading-[1.5]" placeholder="Zitat" />
                <figcaption className="mt-5 flex items-center gap-3">
                  {item.image ? <Img src={item.image} path={["items", i, "image"]} alt="" className="size-10 shrink-0 rounded-full" /> : <Initials name={item.name} className="size-10 bg-[color-mix(in_srgb,var(--c2)_22%,var(--bg))] text-[13px]" />}
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5">
                      <T path={["items", i, "name"]} value={item.name} className="text-[14.5px] font-bold" placeholder="Name" />
                      <BadgeCheck className="size-[17px] shrink-0 fill-(--p) text-(--card)" aria-hidden="true" />
                    </span>
                    <T path={["items", i, "role"]} value={item.role} className="block text-[12.5px] text-(--mut)" placeholder="Gekauft: …" />
                  </span>
                </figcaption>
                <ItemTools path={["items"]} index={i} count={items.length} />
              </figure>
            ))}
          </div>
          <AddItem path={["items"]} item={{ quote: "Hier steht eine Kundenstimme.", name: "Vorname N.", role: "Verifizierter Kauf" }} label="Stimme" className="mt-4" />
        </div>
      </div>
    </section>
  );
}

// ---------- call to action: newsletter panel ----------
function Cta({ block, doc }: { block: CtaBlock; doc: DemoDoc }) {
  const { eyebrow, title, text, button } = block.props;
  const [sent, setSent] = useState(false);
  return (
    <section id="newsletter" className="relative isolate overflow-hidden bg-(--p) text-(--p-on)">
      <Blob className="-left-48 -top-32 -z-10 hidden size-[320px] bg-(--c3) @5xl:block" />
      <Blob className="-bottom-32 -right-28 -z-10 size-[210px] rotate-12 bg-(--c2) @5xl:-bottom-28 @5xl:-right-20 @5xl:size-[300px]" />
      <div className={cn(wrap, "d-rise grid items-center gap-8 py-12 @5xl:grid-cols-2 @5xl:gap-14 @5xl:py-16")}>
        <div className="@5xl:pl-10">
          <Eyebrow value={eyebrow} className="opacity-90" />
          <T as="h2" path={["title"]} value={title} multiline className={cn(display, "block text-[34px] leading-[1.05] @2xl:text-[42px] @2xl:leading-[1.05] @5xl:text-[46px] @5xl:leading-[1.05]")} placeholder="Aufforderung" />
        </div>
        <div className="@5xl:pr-16">
          <T as="p" path={["text"]} value={text} multiline className="max-w-[460px] text-[16px] leading-[1.5] opacity-95" placeholder="Text" />
          <form
            className="mt-5 flex max-w-[520px] flex-col gap-2 rounded-[28px] bg-white p-1.5 @2xl:flex-row @2xl:rounded-full"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <input type="email" required placeholder="E-Mail-Adresse" aria-label="E-Mail-Adresse" className="h-12 min-w-0 flex-1 rounded-full bg-transparent px-5 text-[15px] text-[#171717] outline-none placeholder:text-[#171717]/50" />
            <button type="submit" className="flex h-12 shrink-0 items-center justify-center gap-2.5 rounded-full bg-[#171717] px-6 text-[14.5px] font-semibold text-white transition-colors hover:bg-black">
              {sent ? <Check className="size-[18px]" strokeWidth={2.4} aria-hidden="true" /> : null}
              {sent ? "Angemeldet" : <T path={["button"]} value={button} placeholder="Button" />}
              {!sent && <ArrowRight className="size-[18px]" aria-hidden="true" />}
            </button>
          </form>
          <label className="mt-3.5 flex items-start gap-2.5 text-[13px] leading-[1.4] opacity-90">
            <input type="checkbox" className="mt-0.5 size-4 shrink-0 accent-[#171717]" />
            <span>Ja, ich möchte den Newsletter von {doc.meta.company} erhalten.</span>
          </label>
        </div>
      </div>
    </section>
  );
}

// ---------- contact: the shop itself ----------
function Contact({ block, doc }: { block: ContactBlock; doc: DemoDoc }) {
  const edit = useEdit();
  const { eyebrow, title, text, hours, form, image } = block.props;
  const { meta } = doc;
  const info = "rounded-(--r) bg-(--bg2) p-5 @2xl:p-6";
  const input = "h-12 w-full rounded-[12px] border border-(--line) bg-(--card) px-4 text-[15px] text-(--fg) outline-none placeholder:text-(--mut) focus:border-(--p)";
  return (
    <section id="contact" className="bg-(--bg) py-12 @4xl:py-16">
      <div className={cn(wrap, "grid items-stretch gap-6 @5xl:grid-cols-[1.14fr_0.72fr_0.6fr] @5xl:gap-5")}>
        <div className="d-rise flex flex-col justify-center @5xl:pr-4">
          <Eyebrow value={eyebrow} />
          <ColourLines path={["title"]} value={title} colours={[FG, RED]} className={cn(display, "text-[34px] leading-[1.05] @2xl:text-[44px] @2xl:leading-[1.05] @5xl:text-[38px] @5xl:leading-[1.05] @6xl:text-[46px] @6xl:leading-[1.05]")} />
          <T as="p" path={["text"]} value={text} multiline className="mt-5 max-w-[460px] text-[16.5px] leading-[1.55] text-(--fg)/85" placeholder="Kurzer Einleitungstext" />
          <a href="#contact" className={cn(pill, "mt-7 self-start")}>
            Route planen
            <Navigation className="size-[17px]" aria-hidden="true" />
          </a>
        </div>
        {(image !== undefined || edit) && <Img src={image} path={["image"]} alt="" className="d-rise aspect-[4/3] w-full rounded-(--r) @5xl:aspect-auto @5xl:min-h-[380px]" />}
        <div className="d-rise flex flex-col gap-4">
          <div className={cn(info, "space-y-5 text-[14.5px]")}>
            <div className="flex gap-4">
              <MapPin className="mt-0.5 size-6 shrink-0" strokeWidth={1.6} aria-hidden="true" />
              <span>
                <T meta="address" value={meta.address} className="block font-bold" placeholder="Straße und Hausnummer" />
                <T meta="city" value={meta.city} className="block text-(--mut)" placeholder="PLZ Ort" />
              </span>
            </div>
            <div className="flex gap-4">
              <Clock className="mt-0.5 size-6 shrink-0" strokeWidth={1.6} aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="mb-1.5 block font-bold">Unsere Öffnungszeiten</span>
                {hours.map((h, i) => (
                  <span key={i} className="group/item relative flex justify-between gap-4 py-0.5">
                    <T path={["hours", i, "day"]} value={h.day} className="text-(--mut)" placeholder="Tag" />
                    <T path={["hours", i, "time"]} value={h.time} className="text-right font-medium" placeholder="Zeit" />
                    <ItemTools path={["hours"]} index={i} count={hours.length} />
                  </span>
                ))}
                <AddItem path={["hours"]} item={{ day: "Tag", time: "10–18 Uhr" }} label="Zeile" className="mt-2" />
              </span>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-(--line) pt-4">
              <span className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" aria-hidden="true" />
                <T meta="phone" value={meta.phone} className="font-medium" placeholder="Telefon" />
              </span>
              <span className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                <T meta="email" value={meta.email} className="font-medium" placeholder="E-Mail" />
              </span>
            </div>
          </div>
          <MapArt className="min-h-[170px] flex-1 rounded-(--r)" label={meta.address} />
        </div>
      </div>
      {form && (
        <div className={cn(wrap, "mt-6")}>
          <form className="d-rise grid gap-3 rounded-(--r) bg-(--bg2) p-5 @2xl:p-7 @4xl:grid-cols-[1fr_1fr_1.4fr_auto]" onSubmit={(e) => e.preventDefault()}>
            <input className={input} placeholder="Name" aria-label="Name" />
            <input className={input} placeholder="E-Mail" aria-label="E-Mail" />
            <input className={input} placeholder="Deine Nachricht" aria-label="Nachricht" />
            <button type="submit" className={cn(pill, "h-12 px-6 text-[14.5px]")}>
              Senden
              <ArrowRight className="size-[18px]" aria-hidden="true" />
            </button>
          </form>
        </div>
      )}
    </section>
  );
}

// ---------- footer ----------
function Footer({ block, doc }: { block: FooterBlock; doc: DemoDoc }) {
  const { text, links } = block.props;
  const { meta } = doc;
  const heading = "mb-4 block text-[14.5px] font-bold";
  const social = "flex size-9 items-center justify-center rounded-full border border-(--line) transition-colors hover:border-(--fg)";
  return (
    <footer className="border-t border-(--line) bg-(--bg) pb-8 pt-12">
      <div className={cn(wrap, "grid gap-10 @4xl:grid-cols-[1.3fr_0.8fr_1fr_1.3fr]")}>
        <div>
          <Wordmark doc={doc} className="text-[24px]" />
          <T as="p" path={["text"]} value={text} multiline className="mt-4 max-w-[280px] text-[14.5px] leading-[1.5] text-(--mut)" placeholder="Kurzer Satz" />
          <div className="mt-5 flex gap-2" aria-hidden="true">
            <span className={social}>
              <Instagram className="size-[17px]" />
            </span>
            <span className={social}>
              <Facebook className="size-[17px]" />
            </span>
            <span className={social}>
              <Mail className="size-[17px]" />
            </span>
          </div>
        </div>
        <div>
          <span className={heading}>Shop</span>
          <ul className="space-y-2.5 text-[14.5px] text-(--mut)">
            {navLinks(doc).map((link, i) => (
              <li key={i}>{link}</li>
            ))}
          </ul>
        </div>
        <div>
          <span className={heading}>Kontakt</span>
          <ul className="space-y-2.5 text-[14.5px] text-(--mut)">
            <li>{meta.address}</li>
            <li>{meta.city}</li>
            <li>{meta.phone}</li>
            <li>{meta.email}</li>
          </ul>
        </div>
        <div className="flex items-start gap-4 self-start rounded-(--r) bg-(--bg2) p-5 @4xl:border-l-0">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--c4)_30%,var(--bg))]">
            <Store className="size-6" strokeWidth={1.6} aria-hidden="true" />
          </span>
          <p className="text-[14px] leading-[1.5] text-(--mut)">
            <span className="block font-bold text-(--fg)">Online bestellen, im Laden abholen</span>
            Meist schon am selben Tag – wir schreiben dir, sobald alles bereitliegt.
          </p>
        </div>
      </div>
      <div className={cn(wrap, "mt-12")}>
        <div className="flex flex-col gap-4 border-t border-(--line) pt-6 text-[13.5px] text-(--mut) @2xl:flex-row @2xl:items-center @2xl:justify-between">
          <nav className="flex flex-wrap gap-x-7 gap-y-2">
            {links.map((link, i) => (
              <T key={i} path={["links", i]} value={link} className="hover:text-(--fg)" placeholder="Link" />
            ))}
          </nav>
          <span>
            © {new Date().getFullYear()} {meta.company}
          </span>
        </div>
      </div>
    </footer>
  );
}

export default function MaisonBlock({ block, doc }: SkinProps) {
  switch (block.type) {
    case "nav":
      return <Nav block={block} doc={doc} />;
    case "hero":
      return <Hero block={block} />;
    case "services":
      return <Services block={block} />;
    case "cards":
      return <Cards block={block} />;
    case "about":
      return <About block={block} />;
    case "stats":
      return <Stats block={block} />;
    case "quotes":
      return <Quotes block={block} />;
    case "cta":
      return <Cta block={block} doc={doc} />;
    case "contact":
      return <Contact block={block} doc={doc} />;
    case "footer":
      return <Footer block={block} doc={doc} />;
    default:
      return renderBase(block, doc);
  }
}
