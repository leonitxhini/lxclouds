import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Clock, Facebook, Instagram, Mail, MapPin, Menu, Phone, Play, Plus } from "lucide-react";
import { createElement, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { renderBase, type SkinProps } from "../blocks";
import { AddItem, Img, ItemTools, T, imageUrl, useEdit } from "../edit";
import type {
  AboutBlock,
  CardsBlock,
  ContactBlock,
  CtaBlock,
  DemoDoc,
  FaqBlock,
  FooterBlock,
  GalleryBlock,
  HeroBlock,
  NavBlock,
  Path,
  PricesBlock,
  QuotesBlock,
  ServicesBlock,
  StatsBlock,
  StepsBlock,
  TeamBlock,
} from "../types";
import { IconPick, Stars, navLinks } from "./kit";

// "Aurelia": soft luxury. Blush backgrounds, a fine serif with italic accents, arches and pills,
// plum for the dark parts and one metallic accent colour.

const wrap = "mx-auto w-full max-w-[1320px] px-5 @2xl:px-8";
const serif = "[font-family:var(--fh)]";
const eyebrowClass = "text-[11.5px] font-medium uppercase tracking-[0.3em] text-(--p)";
// (line height comes after the size: a font-size utility would otherwise reset it)
const h2 = cn(serif, "text-[40px] font-medium leading-[1.04] tracking-[-0.01em] @2xl:text-[50px] @2xl:leading-[1.04] @5xl:text-[62px] @5xl:leading-[1.03]");
/** headline of a section whose text sits in a narrow column beside the content */
const h2side = cn(serif, "text-[40px] font-medium leading-[1.04] tracking-[-0.01em] @2xl:text-[50px] @2xl:leading-[1.04] @5xl:text-[54px] @5xl:leading-[1.04]");
const body = cn(serif, "text-[18px] font-medium leading-[1.45] text-(--fg)/75 @2xl:text-[19px] @2xl:leading-[1.45]");
const pill = "inline-flex h-[52px] items-center justify-center gap-3 rounded-full px-7 text-[14px] font-medium tracking-[0.01em] transition-[filter,translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-14px_rgba(43,22,32,0.55)]";
const pillDark = cn(pill, "bg-(--dk) text-(--dk-on) hover:brightness-125");
const pillGold = cn(pill, "bg-(--p) text-(--p-on) hover:brightness-110");

/** Text between *asterisks* is set as the italic accent: "Schönheit ist ein *Gefühl.*" */
function marked(value: string, emClass: string): ReactNode[] {
  return value.split(/(\*[^*\n]+\*)/g).map((part, i) =>
    part.length > 2 && part.startsWith("*") && part.endsWith("*") ? (
      <em key={i} className={emClass}>
        {part.slice(1, -1)}
      </em>
    ) : (
      part
    ),
  );
}

type RichProps = { value: string | undefined; path: Path; as?: string; className?: string; emClassName?: string; placeholder?: string };

/**
 * A headline with italic accent words. It is shown styled; while editing, clicking it reveals the plain
 * text with its asterisks to type over, and the styled version returns when the field is left.
 */
function Rich({ value, path, as = "h2", className, emClassName = "italic text-(--p)", placeholder = "Überschrift" }: RichProps) {
  const edit = useEdit();
  const text = value ?? "";
  if (!edit) return text ? createElement(as, { className: cn(className, "whitespace-pre-line") }, marked(text, emClassName)) : null;
  return createElement(
    as,
    { className: cn(className, "group/rich relative whitespace-pre-line") },
    <span aria-hidden="true" className={cn("group-focus-within/rich:invisible", !text && "opacity-40")}>
      {text ? marked(text, emClassName) : placeholder}
    </span>,
    <T path={path} value={text} multiline className="absolute inset-0 text-transparent focus:[color:inherit]" placeholder="" />,
  );
}

function Eyebrow({ value, className }: { value: string | undefined; className?: string }) {
  return <T path={["eyebrow"]} value={value} className={cn(eyebrowClass, "mb-5 block", className)} placeholder="Kurzzeile" />;
}

const section = "relative overflow-hidden py-16 @4xl:py-24";

// ---------- nav: lies on top of the hero ----------
function Nav({ block, doc }: { block: NavBlock; doc: DemoDoc }) {
  const { links, cta } = block.props;
  return (
    <header className="absolute inset-x-0 top-0 z-30 text-(--fg)">
      <div className={cn(wrap, "flex h-[76px] items-center justify-between gap-4 @2xl:gap-6")}>
        {doc.theme.logo ? (
          <img src={imageUrl(doc.theme.logo)} alt={doc.meta.company} className="h-9 w-auto max-w-[180px] object-contain" />
        ) : (
          <T meta="company" value={doc.meta.company} className="min-w-0 truncate text-[13px] font-medium uppercase tracking-[0.22em] @2xl:text-[15.5px] @2xl:tracking-[0.34em]" placeholder="Firmenname" />
        )}
        <nav className="hidden items-center gap-9 @5xl:flex">
          {links.map((link, i) => (
            <T key={i} path={["links", i]} value={link} className="text-[14px] text-(--fg)/75 transition-colors hover:text-(--p)" placeholder="Link" />
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <a href="#contact" className={cn(pillDark, "h-10 whitespace-nowrap px-4 text-[13px] @2xl:h-11 @2xl:px-5 @2xl:text-[13.5px]")}>
            <T path={["cta"]} value={cta} placeholder="Button" />
            <ArrowRight className="hidden size-4 @2xl:block" strokeWidth={1.6} aria-hidden="true" />
          </a>
          <span className="flex size-10 items-center justify-center rounded-full border border-(--fg)/20 @2xl:size-11 @5xl:hidden" aria-hidden="true">
            <Menu className="size-5" strokeWidth={1.6} />
          </span>
        </div>
      </div>
    </header>
  );
}

// ---------- hero ----------
function Hero({ block }: { block: HeroBlock }) {
  const edit = useEdit();
  const p = block.props;
  return (
    <section id="top" className="relative isolate overflow-hidden bg-[linear-gradient(105deg,color-mix(in_srgb,var(--dk)_9%,var(--bg2))_0%,var(--bg2)_38%,var(--bg)_100%)]">
      {/* soft arches in the background */}
      <div className="pointer-events-none absolute -left-[9%] top-[14%] -z-10 h-[120%] w-[30%] rounded-t-full bg-(--bg)/45" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-[6%] top-[-30%] -z-10 hidden h-[90%] w-[26%] rounded-b-full bg-(--bg2)/70 @5xl:block" aria-hidden="true" />

      <div className={cn(wrap, "grid gap-10 pt-[112px] @5xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] @5xl:gap-4 @5xl:pt-[76px]")}>
        <div className="@5xl:self-center @5xl:py-20">
          <T path={["eyebrow"]} value={p.eyebrow} className={cn(eyebrowClass, "mb-6 block tracking-[0.4em]")} placeholder="Kurzzeile" />
          <Rich
            as="h1"
            path={["title"]}
            value={p.title}
            className={cn(serif, "text-[52px] font-medium leading-[1] tracking-[-0.015em] @2xl:text-[76px] @2xl:leading-[0.98] @5xl:text-[104px] @5xl:leading-[0.96] @6xl:text-[114px] @6xl:leading-[0.96]")}
            placeholder="Hauptüberschrift"
          />
          <T as="p" path={["text"]} value={p.text} multiline className={cn(body, "mt-7 max-w-[470px]")} placeholder="Worum geht es?" />
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-5">
            <a href="#contact" className={cn(pillDark, "h-14 px-8")}>
              <T path={["primary"]} value={p.primary} placeholder="Button" />
              <ArrowRight className="size-4" strokeWidth={1.6} aria-hidden="true" />
            </a>
            {(p.secondary || edit) && (
              <a href="#gallery" className="group/play flex items-center gap-3.5">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-(--fg)/35 transition-colors duration-300 group-hover/play:border-(--p) group-hover/play:bg-(--p) group-hover/play:text-(--p-on)">
                  <Play className="ml-0.5 size-3.5 fill-current" strokeWidth={0} aria-hidden="true" />
                </span>
                <T path={["secondary"]} value={p.secondary} multiline className={cn(serif, "text-[16.5px] font-medium leading-[1.25]")} placeholder="Zweiter Button" />
              </a>
            )}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[420px] @5xl:mx-0 @5xl:max-w-none @5xl:self-end">
          {/* tall arch with a fine outline */}
          <div className="relative w-[82%] @5xl:mt-10 @5xl:w-[80%]">
            <div className="pointer-events-none absolute -inset-x-[7px] -top-[7px] bottom-0 rounded-t-full border border-b-0 border-(--p)/70" aria-hidden="true" />
            <Img src={p.image} path={["image"]} alt="" eager className="aspect-[5/7] w-full rounded-t-full" imgClassName="object-[center_18%]" />
          </div>
          {(p.badge || p.note || edit) && (
            <div className="absolute bottom-[9%] right-0 w-[58%] max-w-[300px] rounded-[30px] border border-white/70 bg-white/60 px-5 py-6 text-center shadow-[0_30px_60px_-30px_rgba(43,22,32,0.45)] backdrop-blur-2xl backdrop-saturate-150 @2xl:px-7 @2xl:py-8 @5xl:bottom-[13%] @5xl:w-[46%]">
              <CalendarDays className="mx-auto size-6 text-(--dk)" strokeWidth={1.2} aria-hidden="true" />
              <T path={["badge"]} value={p.badge} className={cn(serif, "mt-3 block text-[16px] font-medium leading-[1.2] text-[#2A1620] @2xl:text-[18px] @2xl:leading-[1.2]")} placeholder="Hinweis" />
              <Rich as="p" path={["note"]} value={p.note} className={cn(serif, "mt-1 text-[26px] font-bold leading-[1.1] text-[#2A1620] @2xl:text-[32px] @2xl:leading-[1.1]")} emClassName="not-italic font-medium text-(--p)" placeholder="heute 16:30" />
              <a href="#contact" className={cn(pillGold, "mt-5 h-11 w-full px-4 text-[13.5px]")}>
                {p.primary}
                <ArrowRight className="size-4" strokeWidth={1.6} aria-hidden="true" />
              </a>
            </div>
          )}
          <ul className="absolute right-0 top-[7%] hidden space-y-2.5 text-right @5xl:block" aria-hidden={!edit}>
            {p.points.map((point, i) => (
              <li key={i} className="group/item relative">
                <T path={["points", i]} value={point} className="text-[10.5px] font-medium uppercase tracking-[0.34em] text-(--p)" placeholder="Wort" />
                <ItemTools path={["points"]} index={i} count={p.points.length} />
              </li>
            ))}
            <li>
              <AddItem path={["points"]} item="Wort" label="Wort" />
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

// ---------- shared section head: eyebrow and headline, optionally a side text ----------
function Head({ eyebrow, title, text, className }: { eyebrow: string | undefined; title: string; text?: string; className?: string }) {
  return (
    <div className={cn("d-rise flex flex-col gap-5 @5xl:flex-row @5xl:items-end @5xl:justify-between @5xl:gap-14", className)}>
      <div>
        <Eyebrow value={eyebrow} />
        <Rich path={["title"]} value={title} className={h2} />
      </div>
      {text !== undefined && <T as="p" path={["text"]} value={text} multiline className={cn(body, "max-w-[340px] text-[16.5px] @2xl:text-[16.5px] @5xl:pb-2")} placeholder="Kurzer Einleitungstext" />}
    </div>
  );
}

// ---------- cards: treatments under arches ----------
function Cards({ block }: { block: CardsBlock }) {
  const { eyebrow, title, text, items } = block.props;
  return (
    <section id="offers" className={cn(section, "bg-(--bg)")}>
      <div className={wrap}>
        <Head eyebrow={eyebrow} title={title} text={text} />
        <div className="-mx-5 mt-11 flex snap-x gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] @2xl:mx-0 @2xl:grid @2xl:grid-cols-2 @2xl:gap-x-7 @2xl:gap-y-10 @2xl:overflow-visible @2xl:px-0 @2xl:pb-0 @5xl:grid-cols-4">
          {items.map((item, i) => (
            <article key={i} className="d-rise group/item relative w-[64%] shrink-0 snap-start @2xl:w-auto">
              <div className="relative">
                <Img src={item.image} path={["items", i, "image"]} alt={item.title} className="aspect-[5/6] w-full rounded-t-full" imgClassName="transition-transform duration-[900ms] group-hover/item:scale-[1.06]" />
                <span className="pointer-events-none absolute bottom-3.5 left-3.5 flex size-10 items-center justify-center rounded-full bg-(--card) text-(--fg) shadow-[0_8px_20px_-8px_rgba(43,22,32,0.5)] transition-colors duration-300 group-hover/item:bg-(--p) group-hover/item:text-(--p-on) @2xl:size-11" aria-hidden="true">
                  <ChevronRight className="size-4" strokeWidth={1.6} />
                </span>
              </div>
              <T as="h3" path={["items", i, "title"]} value={item.title} className={cn(serif, "mt-5 block text-[21px] font-semibold leading-[1.15] @2xl:text-[25px] @2xl:leading-[1.15]")} placeholder="Behandlung" />
              <T as="p" path={["items", i, "text"]} value={item.text} multiline className={cn(serif, "mt-1.5 text-[16px] font-medium leading-[1.35] text-(--fg)/70 @2xl:text-[17px] @2xl:leading-[1.35]")} placeholder="Beschreibung" />
              <T path={["items", i, "price"]} value={item.price} className="mt-3 block text-[11px] font-medium uppercase tracking-[0.22em] text-(--p)" placeholder="Preis" />
              <ItemTools path={["items"]} index={i} count={items.length} />
            </article>
          ))}
        </div>
        <div className="mt-6 empty:hidden">
          <AddItem path={["items"]} item={{ image: "", title: "Neue Behandlung", text: "Kurze Beschreibung.", price: "", tag: "" }} label="Behandlung" />
        </div>
      </div>
    </section>
  );
}

// ---------- prices: headline left, the lists as columns with dotted leaders ----------
function Prices({ block }: { block: PricesBlock }) {
  const edit = useEdit();
  const { eyebrow, title, text, button, groups } = block.props;
  return (
    <section id="prices" className={cn(section, "bg-[linear-gradient(100deg,color-mix(in_srgb,var(--dk)_7%,var(--bg2))_0%,var(--bg2)_45%,var(--bg)_100%)]")}>
      <div className="pointer-events-none absolute -right-[5%] bottom-0 h-[82%] w-[22%] rounded-t-full bg-(--bg2)/80" aria-hidden="true" />
      <div className={cn(wrap, "relative grid gap-12 @2xl:grid-cols-2 @5xl:grid-cols-[0.95fr_1fr_1fr] @5xl:gap-0")}>
        <div className="d-rise @2xl:col-span-2 @5xl:col-span-1 @5xl:pr-10">
          <Eyebrow value={eyebrow} />
          <Rich path={["title"]} value={title} className={cn(h2, "@5xl:text-[72px] @5xl:leading-[0.98]")} />
          <T as="p" path={["text"]} value={text} multiline className={cn(body, "mt-6 max-w-[300px]")} placeholder="Kurzer Einleitungstext" />
          {(button || edit) && (
            <a href="#contact" className={cn(pillDark, "mt-8")}>
              <T path={["button"]} value={button} placeholder="Button" />
              <ArrowRight className="size-4" strokeWidth={1.6} aria-hidden="true" />
            </a>
          )}
        </div>
        {groups.map((group, g) => (
          <div key={g} className="d-rise group/item relative border-(--fg)/30 @5xl:border-l @5xl:px-10 @5xl:py-3">
            <T as="h3" path={["groups", g, "name"]} value={group.name} className="block text-[11.5px] font-medium uppercase tracking-[0.3em] text-(--fg)/70" placeholder="Gruppe" />
            <ul className="mt-6 space-y-3.5">
              {group.items.map((item, i) => (
                <li key={i} className="group/item relative">
                  <div className={cn(serif, "flex items-baseline gap-2.5 text-[18px] font-medium leading-[1.25] @2xl:text-[19px] @2xl:leading-[1.25]")}>
                    <T path={["groups", g, "items", i, "name"]} value={item.name} placeholder="Leistung" />
                    <span className="min-w-6 flex-1 -translate-y-[5px] border-b border-dotted border-(--fg)/45" aria-hidden="true" />
                    <T path={["groups", g, "items", i, "price"]} value={item.price} className="shrink-0" placeholder="0 €" />
                  </div>
                  <T path={["groups", g, "items", i, "text"]} value={item.text} className="mt-0.5 block text-[12.5px] text-(--mut)" placeholder="Zusatz" />
                  <ItemTools path={["groups", g, "items"]} index={i} count={group.items.length} />
                </li>
              ))}
            </ul>
            <AddItem path={["groups", g, "items"]} item={{ name: "Neue Leistung", text: "", price: "0 €" }} label="Zeile" className="mt-4" />
            <ItemTools path={["groups"]} index={g} count={groups.length} />
          </div>
        ))}
      </div>
      <div className={cn(wrap, "relative mt-6 empty:hidden")}>
        <AddItem path={["groups"]} item={{ name: "Neue Gruppe", items: [{ name: "Leistung", text: "", price: "0 €" }] }} label="Gruppe" />
      </div>
    </section>
  );
}

// ---------- team: round portraits with a line each ----------
function Team({ block }: { block: TeamBlock }) {
  const { eyebrow, title, text, items } = block.props;
  return (
    <section id="team" className={cn(section, "bg-(--bg)")}>
      <div className={cn(wrap, "grid gap-12 @5xl:grid-cols-[0.82fr_2fr] @5xl:items-center @5xl:gap-10")}>
        <div className="d-rise">
          <Eyebrow value={eyebrow} />
          <Rich path={["title"]} value={title} className={h2side} />
          <T as="p" path={["text"]} value={text} multiline className={cn(body, "mt-6 max-w-[330px]")} placeholder="Kurzer Einleitungstext" />
        </div>
        <div>
          <ul className={cn("grid grid-cols-2 gap-x-5 gap-y-10 @2xl:gap-x-8", items.length >= 4 ? "@2xl:grid-cols-4" : "@2xl:grid-cols-3")}>
            {items.map((item, i) => (
              <li key={i} className="d-rise group/item relative text-center">
                <Img src={item.image} path={["items", i, "image"]} alt={item.name} className="mx-auto aspect-square w-full max-w-[230px] rounded-full" imgClassName="object-[center_22%] transition-transform duration-[900ms] group-hover/item:scale-[1.06]" />
                <T as="h3" path={["items", i, "name"]} value={item.name} className={cn(serif, "mt-5 block text-[24px] font-semibold leading-[1.1] @2xl:text-[27px] @2xl:leading-[1.1]")} placeholder="Name" />
                <T path={["items", i, "role"]} value={item.role} className="mt-2 block text-[10.5px] font-medium uppercase tracking-[0.24em] text-(--fg)/65" placeholder="Aufgabe" />
                <T as="p" path={["items", i, "text"]} value={item.text} multiline className={cn(serif, "mx-auto mt-4 max-w-[220px] text-[16.5px] font-medium italic leading-[1.35] text-(--fg)/75")} placeholder="Ein Satz zur Person" />
                <ItemTools path={["items"]} index={i} count={items.length} />
              </li>
            ))}
          </ul>
          <AddItem path={["items"]} item={{ image: "", name: "Name", role: "Stylistin", text: "„Ein Satz, der zu ihr passt.“" }} label="Person" className="mt-6" />
        </div>
      </div>
    </section>
  );
}

// ---------- gallery: a strip of tall photos next to the headline ----------
function Gallery({ block }: { block: GalleryBlock }) {
  const edit = useEdit();
  const { eyebrow, title, text, note, images } = block.props;
  return (
    <section id="gallery" className={cn(section, "bg-(--bg2)")}>
      <div className={cn(wrap, "grid gap-10 @5xl:grid-cols-[0.82fr_2fr] @5xl:items-center")}>
        <div className="d-rise">
          <Eyebrow value={eyebrow} />
          <Rich path={["title"]} value={title} className={h2side} />
          <T as="p" path={["text"]} value={text} multiline className={cn(body, "mt-6 max-w-[330px]")} placeholder="Kurzer Einleitungstext" />
          {(note || edit) && (
            <span className={cn(pillDark, "mt-8")}>
              <Instagram className="size-[18px]" strokeWidth={1.5} aria-hidden="true" />
              <T path={["note"]} value={note} placeholder="@deinstudio" />
              <ArrowRight className="size-4" strokeWidth={1.6} aria-hidden="true" />
            </span>
          )}
        </div>
        <div>
          <div className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] @2xl:mx-0 @2xl:px-0 @4xl:gap-4 @4xl:overflow-visible">
            {images.map((image, i) => (
              <div key={i} className={cn("d-rise group/item relative w-[44%] shrink-0 snap-start @2xl:w-[30%] @4xl:w-auto @4xl:flex-1", i === 0 && "[&>div]:rounded-l-[120px]")}>
                <Img src={image} path={["images", i]} alt="" className="aspect-[9/17] w-full rounded-(--r)" imgClassName="transition-transform duration-[900ms] group-hover/item:scale-[1.06]" />
                <ItemTools path={["images"]} index={i} count={images.length} />
              </div>
            ))}
          </div>
          <AddItem path={["images"]} item="" label="Bild" className="mt-4" />
        </div>
      </div>
    </section>
  );
}

// ---------- quotes: rating left, cards to flick through on the right ----------
function Quotes({ block }: { block: QuotesBlock }) {
  const edit = useEdit();
  const row = useRef<HTMLDivElement>(null);
  const { eyebrow, title, text, items } = block.props;
  const slide = (by: number) => row.current?.scrollBy({ left: by * (row.current.clientWidth * 0.6), behavior: "smooth" });
  const arrow = "flex size-10 items-center justify-center rounded-full border border-(--fg)/30 transition-colors duration-300 hover:border-(--dk) hover:bg-(--dk) hover:text-(--dk-on)";
  return (
    <section id="quotes" className={cn(section, "bg-(--bg)")}>
      <div className={cn(wrap, "grid gap-10 @5xl:grid-cols-[0.95fr_2fr] @5xl:items-center")}>
        <div className="d-rise">
          <Eyebrow value={eyebrow} />
          <Rich path={["title"]} value={title} className={h2side} />
          {(text || edit) && (
            <div className="mt-6">
              <Stars className="text-[19px] text-(--p)" />
              <T as="p" path={["text"]} value={text} multiline className={cn(serif, "mt-2 text-[18px] font-medium leading-[1.3] text-(--fg)/80")} placeholder="z. B. 5,0 von 5 Sternen bei Google" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <div ref={row} className="-mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] @2xl:mx-0 @2xl:px-0">
            {items.map((item, i) => (
              <figure key={i} className="d-rise group/item relative w-[82%] shrink-0 snap-start rounded-(--r-sm) border border-(--fg)/15 bg-(--card)/70 p-6 @2xl:w-[46%] @5xl:w-[calc((100%-2rem)/3)] @5xl:p-7">
                <Stars className="text-[13px] text-(--p)" />
                <T as="blockquote" path={["items", i, "quote"]} value={item.quote} multiline className={cn(serif, "mt-4 text-[17.5px] font-medium leading-[1.4] text-(--fg)/85")} placeholder="Zitat" />
                <figcaption className="mt-6 text-[13px]">
                  <T path={["items", i, "name"]} value={item.name} className="font-semibold" placeholder="Name" />
                  <T path={["items", i, "role"]} value={item.role} className="ml-2 text-(--mut)" placeholder="Rolle" />
                </figcaption>
                <ItemTools path={["items"]} index={i} count={items.length} />
              </figure>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-2.5">
            <button type="button" className={arrow} onClick={() => slide(-1)} aria-label="Vorherige Stimmen">
              <ChevronLeft className="size-4" strokeWidth={1.6} />
            </button>
            <button type="button" className={arrow} onClick={() => slide(1)} aria-label="Weitere Stimmen">
              <ChevronRight className="size-4" strokeWidth={1.6} />
            </button>
            <AddItem path={["items"]} item={{ quote: "„Hier steht eine Kundenstimme.“", name: "Vorname N.", role: "" }} label="Stimme" className="ml-2" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- contact: booking request ----------
function Contact({ block, doc }: { block: ContactBlock; doc: DemoDoc }) {
  const { eyebrow, title, text, hours, form } = block.props;
  const { meta } = doc;
  const input = cn(serif, "h-12 w-full border-b border-(--fg)/30 bg-transparent text-[18px] font-medium text-(--fg) outline-none transition-colors placeholder:text-(--fg)/45 focus:border-(--p)");
  const row = "flex items-start gap-4";
  const icon = "mt-1 size-[18px] shrink-0 text-(--p)";
  return (
    <section id="contact" className={cn(section, "bg-(--bg2)")}>
      <div className={cn(wrap, "grid gap-12 @5xl:grid-cols-[1fr_1.05fr] @5xl:gap-20")}>
        <div className="d-rise">
          <Eyebrow value={eyebrow} />
          <Rich path={["title"]} value={title} className={h2} />
          <T as="p" path={["text"]} value={text} multiline className={cn(body, "mt-6 max-w-[420px]")} placeholder="Kurzer Einleitungstext" />
          <ul className={cn(serif, "mt-9 space-y-5 text-[18px] font-medium leading-[1.35]")}>
            <li className={row}>
              <MapPin className={icon} strokeWidth={1.4} aria-hidden="true" />
              <span>
                <T meta="address" value={meta.address} className="block" placeholder="Straße und Hausnummer" />
                <T meta="city" value={meta.city} className="block text-(--fg)/65" placeholder="PLZ Ort" />
              </span>
            </li>
            <li className={row}>
              <Phone className={icon} strokeWidth={1.4} aria-hidden="true" />
              <T meta="phone" value={meta.phone} placeholder="Telefon" />
            </li>
            <li className={row}>
              <Mail className={icon} strokeWidth={1.4} aria-hidden="true" />
              <T meta="email" value={meta.email} placeholder="E-Mail" />
            </li>
            <li className={row}>
              <Clock className={icon} strokeWidth={1.4} aria-hidden="true" />
              <span className="w-full max-w-[320px]">
                {hours.map((h, i) => (
                  <span key={i} className="group/item relative flex items-baseline gap-2.5 py-0.5">
                    <T path={["hours", i, "day"]} value={h.day} className="text-(--fg)/65" placeholder="Tag" />
                    <span className="min-w-4 flex-1 -translate-y-[5px] border-b border-dotted border-(--fg)/35" aria-hidden="true" />
                    <T path={["hours", i, "time"]} value={h.time} placeholder="Zeit" />
                    <ItemTools path={["hours"]} index={i} count={hours.length} />
                  </span>
                ))}
                <AddItem path={["hours"]} item={{ day: "Tag", time: "09–18 Uhr" }} label="Zeile" className="mt-2" />
              </span>
            </li>
          </ul>
        </div>
        {form && (
          <form className="d-rise self-start rounded-[30px] border border-white/60 bg-(--card)/80 p-7 shadow-[0_40px_80px_-50px_rgba(43,22,32,0.5)] @2xl:p-10" onSubmit={(e) => e.preventDefault()}>
            <p className={cn(eyebrowClass, "mb-4")}>Wunschtermin anfragen</p>
            <div className="grid gap-x-6 gap-y-2 @2xl:grid-cols-2">
              <input className={input} placeholder="Name" aria-label="Name" />
              <input className={input} placeholder="Telefon" aria-label="Telefon" />
              <select className={cn(input, "appearance-none")} aria-label="Behandlung" defaultValue="">
                <option value="" disabled>
                  Behandlung
                </option>
                <option>Haarschnitt & Styling</option>
                <option>Coloration & Balayage</option>
                <option>Gesichtsbehandlung</option>
                <option>Maniküre & Beauty</option>
              </select>
              <input type="date" className={input} aria-label="Wunschtermin" />
            </div>
            <textarea className={cn(input, "mt-2 h-24 resize-none py-3")} placeholder="Deine Wünsche (optional)" aria-label="Nachricht" />
            <button type="submit" className={cn(pillDark, "mt-7 w-full")}>
              Termin anfragen
              <ArrowRight className="size-4" strokeWidth={1.6} aria-hidden="true" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

// ---------- call to action: dark band with the salon photo ----------
function Cta({ block }: { block: CtaBlock }) {
  const { eyebrow, title, text, button, image } = block.props;
  return (
    <section className="relative isolate overflow-hidden bg-[#3A1F2B] text-[#F8E9E0]">
      <Img src={image} path={["image"]} alt="" chip="tr" className="absolute inset-y-0 right-0 -z-20 h-full w-full bg-transparent @4xl:w-[74%] @4xl:[mask-image:linear-gradient(to_right,transparent,black_42%)]" imgClassName="object-[center_60%]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-[#3A1F2B] via-[#3A1F2B]/85 to-[#3A1F2B]/25 @4xl:via-[#3A1F2B]/35 @4xl:to-transparent" />
      <div className={cn(wrap, "d-rise py-20 @4xl:py-28")}>
        <Eyebrow value={eyebrow} />
        <Rich path={["title"]} value={title} className={cn(h2, "text-[#EBC3BF] @5xl:text-[70px] @5xl:leading-[1]")} emClassName="italic text-(--p)" placeholder="Aufforderung" />
        <T as="p" path={["text"]} value={text} multiline className={cn(serif, "mt-5 max-w-[440px] text-[19px] font-medium leading-[1.4] text-[#F8E9E0]/85")} placeholder="Text" />
        <a href="#contact" className={cn(pillGold, "mt-9 h-14 px-9")}>
          <T path={["button"]} value={button} placeholder="Button" />
          <ArrowRight className="size-4" strokeWidth={1.6} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

// ---------- footer ----------
function Footer({ block, doc }: { block: FooterBlock; doc: DemoDoc }) {
  const { text, links } = block.props;
  const { meta } = doc;
  const contact = doc.blocks.find((b) => b.type === "contact");
  const hours = contact?.type === "contact" ? contact.props.hours : [];
  const heading = cn(serif, "mb-4 block text-[19px] font-semibold");
  const list = cn(serif, "space-y-2 text-[16.5px] font-medium leading-[1.3] opacity-75");
  return (
    <footer className="bg-[color-mix(in_srgb,var(--dk)_88%,black)] pb-8 pt-16 text-(--dk-on)">
      <div className={cn(wrap, "grid gap-10 @2xl:grid-cols-2 @5xl:grid-cols-[1.5fr_0.7fr_1fr_1.1fr]")}>
        <div>
          <T meta="company" value={meta.company} className="block text-[17px] font-medium uppercase tracking-[0.34em]" placeholder="Firmenname" />
          <T as="p" path={["text"]} value={text} multiline className={cn(serif, "mt-5 max-w-[300px] text-[16.5px] font-medium leading-[1.4] opacity-70")} placeholder="Kurzer Satz" />
          <div className="mt-6 flex gap-4 opacity-80" aria-hidden="true">
            <Instagram className="size-5" strokeWidth={1.4} />
            <Facebook className="size-5" strokeWidth={1.4} />
          </div>
        </div>
        <div>
          <span className={heading}>Schnelllinks</span>
          <ul className={list}>
            {navLinks(doc).map((link, i) => (
              <li key={i}>
                <span className="underline decoration-(--dk-on)/30 underline-offset-4">{link}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <span className={heading}>Kontakt</span>
          <ul className={list}>
            <li>{meta.address}</li>
            <li>{meta.city}</li>
            <li className="pt-2">{meta.phone}</li>
            <li>{meta.email}</li>
          </ul>
        </div>
        {hours.length > 0 && (
          <div>
            <span className={heading}>Öffnungszeiten</span>
            <ul className={list}>
              {hours.map((h, i) => (
                <li key={i} className="flex justify-between gap-6">
                  <span>{h.day}</span>
                  <span>{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className={cn(wrap, "mt-14")}>
        <div className="flex flex-col gap-3 border-t border-(--dk-on)/15 pt-6 text-[12.5px] opacity-65 @2xl:flex-row @2xl:items-center @2xl:justify-between">
          <p>
            © {new Date().getFullYear()} {meta.company}. Alle Rechte vorbehalten.
          </p>
          <nav className="flex flex-wrap gap-x-6 gap-y-1">
            {links.map((link, i) => (
              <T key={i} path={["links", i]} value={link} placeholder="Link" />
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

// ---------- further blocks the owner may add, kept in the same language ----------
function Stats({ block }: { block: StatsBlock }) {
  const { items } = block.props;
  return (
    <section className="bg-(--bg) py-12 @4xl:py-16">
      <div className={cn(wrap, "grid grid-cols-2 gap-y-9 @4xl:flex")}>
        {items.map((item, i) => (
          <div key={i} className="d-rise group/item relative border-(--fg)/25 text-center @4xl:flex-1 @4xl:[&:not(:first-child)]:border-l">
            <T path={["items", i, "value"]} value={item.value} className={cn(serif, "block text-[46px] font-medium leading-none text-(--p) @2xl:text-[58px] @2xl:leading-none")} placeholder="100" />
            <T path={["items", i, "label"]} value={item.label} className="mt-3 block text-[10.5px] font-medium uppercase tracking-[0.26em] text-(--fg)/65" placeholder="Bezeichnung" />
            <ItemTools path={["items"]} index={i} count={items.length} />
          </div>
        ))}
      </div>
      <div className={cn(wrap, "mt-5 text-center empty:hidden")}>
        <AddItem path={["items"]} item={{ value: "100", label: "Bezeichnung" }} label="Kennzahl" />
      </div>
    </section>
  );
}

function Services({ block }: { block: ServicesBlock }) {
  const { eyebrow, title, text, items } = block.props;
  return (
    <section id="services" className={cn(section, "bg-(--bg2)")}>
      <div className={wrap}>
        <Head eyebrow={eyebrow} title={title} text={text} />
        <div className="mt-11 grid gap-x-10 gap-y-9 @2xl:grid-cols-2 @5xl:grid-cols-3">
          {items.map((item, i) => (
            <article key={i} className="d-rise group/item relative border-t border-(--fg)/25 pt-6">
              <IconPick name={item.icon} path={["items", i, "icon"]} className="size-12 rounded-full border border-(--p)/60 text-(--p)" iconClassName="size-5" strokeWidth={1.3} />
              <T as="h3" path={["items", i, "title"]} value={item.title} className={cn(serif, "mt-5 block text-[25px] font-semibold leading-[1.15]")} placeholder="Leistung" />
              <T as="p" path={["items", i, "text"]} value={item.text} multiline className={cn(serif, "mt-2 text-[17px] font-medium leading-[1.4] text-(--fg)/70")} placeholder="Beschreibung" />
              <ItemTools path={["items"]} index={i} count={items.length} />
            </article>
          ))}
        </div>
        <div className="mt-6 empty:hidden">
          <AddItem path={["items"]} item={{ icon: "sparkles", title: "Neue Leistung", text: "Kurze Beschreibung." }} label="Leistung" />
        </div>
      </div>
    </section>
  );
}

function About({ block }: { block: AboutBlock }) {
  const edit = useEdit();
  const { eyebrow, title, text, image, points, flip, button } = block.props;
  return (
    <section id="about" className={cn(section, "bg-(--bg)")}>
      <div className={cn(wrap, "grid items-center gap-12 @5xl:grid-cols-2 @5xl:gap-20")}>
        <div className={cn("d-rise relative mx-auto w-full max-w-[460px]", flip && "@5xl:order-2")}>
          <div className="pointer-events-none absolute -inset-x-[7px] -top-[7px] bottom-0 rounded-t-full border border-b-0 border-(--p)/70" aria-hidden="true" />
          <Img src={image} path={["image"]} alt="" className="aspect-[4/5] w-full rounded-t-full" />
        </div>
        <div className="d-rise">
          <Eyebrow value={eyebrow} />
          <Rich path={["title"]} value={title} className={h2} />
          <T as="p" path={["text"]} value={text} multiline className={cn(body, "mt-6")} placeholder="Über das Studio" />
          <ul className={cn(serif, "mt-7 space-y-3 text-[18px] font-medium leading-[1.3]")}>
            {points.map((point, i) => (
              <li key={i} className="group/item relative flex items-baseline gap-4 border-b border-(--fg)/15 pb-3">
                <span className="text-[11px] font-medium tracking-[0.2em] text-(--p) [font-family:var(--fb)]">{String(i + 1).padStart(2, "0")}</span>
                <T path={["points", i]} value={point} placeholder="Punkt" />
                <ItemTools path={["points"]} index={i} count={points.length} />
              </li>
            ))}
          </ul>
          <AddItem path={["points"]} item="Neuer Punkt" label="Punkt" className="mt-4" />
          {(button || edit) && (
            <a href="#contact" className={cn(pillDark, "mt-8")}>
              <T path={["button"]} value={button} placeholder="Button" />
              <ArrowRight className="size-4" strokeWidth={1.6} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

function Steps({ block }: { block: StepsBlock }) {
  const { eyebrow, title, text, items } = block.props;
  return (
    <section id="steps" className={cn(section, "bg-(--bg)")}>
      <div className={wrap}>
        <Head eyebrow={eyebrow} title={title} text={text} />
        <ol className={cn("mt-11 grid gap-x-8 gap-y-9 @2xl:grid-cols-2", items.length >= 4 ? "@5xl:grid-cols-4" : "@5xl:grid-cols-3")}>
          {items.map((item, i) => (
            <li key={i} className="d-rise group/item relative border-t border-(--fg)/25 pt-5">
              <span className={cn(serif, "block text-[52px] font-medium italic leading-none text-(--p)")}>{i + 1}</span>
              <T as="h3" path={["items", i, "title"]} value={item.title} className={cn(serif, "mt-4 block text-[25px] font-semibold leading-[1.15]")} placeholder="Schritt" />
              <T as="p" path={["items", i, "text"]} value={item.text} multiline className={cn(serif, "mt-2 text-[17px] font-medium leading-[1.4] text-(--fg)/70")} placeholder="Beschreibung" />
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

function Faq({ block }: { block: FaqBlock }) {
  const edit = useEdit();
  const { eyebrow, title, text, items } = block.props;
  return (
    <section id="faq" className={cn(section, "bg-(--bg)")}>
      <div className={cn(wrap, "grid gap-10 @5xl:grid-cols-[0.8fr_1.2fr] @5xl:gap-20")}>
        <div className="d-rise">
          <Eyebrow value={eyebrow} />
          <Rich path={["title"]} value={title} className={h2} />
          <T as="p" path={["text"]} value={text} multiline className={cn(body, "mt-6 max-w-[360px]")} placeholder="Kurzer Einleitungstext" />
        </div>
        <div>
          <div className="border-t border-(--fg)/25">
            {items.map((item, i) => (
              <details key={i} open={!!edit || i === 0} className="group/item group/faq relative border-b border-(--fg)/25">
                <summary className={cn(serif, "flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[22px] font-semibold leading-[1.2] [&::-webkit-details-marker]:hidden")}>
                  <T path={["items", i, "q"]} value={item.q} placeholder="Frage" />
                  <Plus className="size-5 shrink-0 text-(--p) transition-transform duration-300 group-open/faq:rotate-45" strokeWidth={1.4} aria-hidden="true" />
                </summary>
                <T as="p" path={["items", i, "a"]} value={item.a} multiline className={cn(serif, "max-w-[560px] pb-6 text-[18px] font-medium leading-[1.45] text-(--fg)/70")} placeholder="Antwort" />
                <ItemTools path={["items"]} index={i} count={items.length} />
              </details>
            ))}
          </div>
          <AddItem path={["items"]} item={{ q: "Neue Frage?", a: "Antwort." }} label="Frage" className="mt-4" />
        </div>
      </div>
    </section>
  );
}

export default function AureliaBlock({ block, doc }: SkinProps) {
  switch (block.type) {
    case "nav":
      return <Nav block={block} doc={doc} />;
    case "hero":
      return <Hero block={block} />;
    case "stats":
      return <Stats block={block} />;
    case "services":
      return <Services block={block} />;
    case "cards":
      return <Cards block={block} />;
    case "about":
      return <About block={block} />;
    case "prices":
      return <Prices block={block} />;
    case "team":
      return <Team block={block} />;
    case "gallery":
      return <Gallery block={block} />;
    case "steps":
      return <Steps block={block} />;
    case "quotes":
      return <Quotes block={block} />;
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
