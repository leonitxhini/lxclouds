import { ArrowRight, CalendarDays, ChevronDown, Clock, Mail, MapPin, Menu, Phone, Users, Wine } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { renderBase, type SkinProps } from "../blocks";
import { AddItem, Img, ItemTools, T, imageUrl, useEdit } from "../edit";
import type { AboutBlock, CardsBlock, ContactBlock, CtaBlock, DemoDoc, FaqBlock, FooterBlock, GalleryBlock, HeroBlock, NavBlock, PricesBlock, QuotesBlock, StatsBlock } from "../types";
import { IconPick, MapArt, Stars, navLinks, wrap } from "./kit";

// "Osteria": warm editorial look – cream paper, forest green bands, one earthy accent,
// a large soft serif and handwritten notes in the margins.

// (line height comes after the size: a font-size utility would otherwise reset it)
const serif = "[font-family:var(--fh)] font-normal tracking-[-0.022em]";
const h2 = cn(serif, "text-[36px] leading-[1.06] @2xl:text-[48px] @2xl:leading-[1.04] @5xl:text-[58px] @5xl:leading-[1.03]");
const caps = "text-[11.5px] font-semibold uppercase tracking-[0.22em]";
const solid = "inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-(--p) px-6 text-[14px] font-medium text-(--p-on) transition-[filter,translate] duration-200 hover:-translate-y-px hover:brightness-110";
const outline = "inline-flex h-11 items-center justify-center gap-2.5 rounded-full border border-(--p)/70 px-5 text-[13.5px] font-medium text-(--p) transition-colors duration-200 hover:bg-(--p) hover:text-(--p-on)";
const script = "d-script text-[21px] leading-[1.3] @2xl:text-[23px] @2xl:leading-[1.3]";
// a warm sand tone for details on the dark green bands; follows the accent colour
const sand = "text-[color-mix(in_srgb,var(--p)_38%,var(--dk-on))]";
const section = "bg-(--bg) py-16 @4xl:py-[92px]";

/** Line drawing of an olive sprig, used as a quiet ornament. */
function Sprig({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 150" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M14 142 C40 110 62 74 92 10" />
      <path d="M33 116 C16 110 8 96 10 82 C26 86 36 98 33 116Z" />
      <path d="M46 96 C64 100 80 92 86 78 C70 72 54 80 46 96Z" />
      <path d="M57 76 C40 70 34 54 38 42 C54 46 62 60 57 76Z" />
      <path d="M70 52 C86 54 100 46 104 32 C90 28 76 36 70 52Z" />
      <path d="M79 34 C66 28 62 16 66 6 C78 10 84 22 79 34Z" />
      <circle cx="26" cy="128" r="4.5" />
      <circle cx="62" cy="88" r="4" />
    </svg>
  );
}

/** Hand-drawn arrow that points from a handwritten note to its subject. */
function Swoosh({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 70 40" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M3 30 C22 6 44 6 64 20" />
      <path d="M54 12 L65 20 L53 27" />
    </svg>
  );
}

function Eyebrow({ value, className }: { value: string | undefined; className?: string }) {
  return <T path={["eyebrow"]} value={value} className={cn(caps, "mb-4 block", className)} placeholder="Kurzzeile" />;
}

function Head({ eyebrow, title, children }: { eyebrow: string | undefined; title: string; children?: ReactNode }) {
  return (
    <div className="d-rise flex flex-col gap-6 @4xl:flex-row @4xl:items-end @4xl:justify-between @4xl:gap-12">
      <div>
        <Eyebrow value={eyebrow} />
        <T as="h2" path={["title"]} value={title} multiline className={h2} placeholder="Überschrift" />
      </div>
      {children}
    </div>
  );
}

// ---------- nav: lies on top of the hero photo ----------
function Nav({ block, doc }: { block: NavBlock; doc: DemoDoc }) {
  const { links, cta } = block.props;
  return (
    <header className="absolute inset-x-0 top-0 z-30 bg-gradient-to-b from-(--bg)/80 to-transparent text-(--fg)">
      <div className={cn(wrap, "flex h-[84px] items-center justify-between gap-3 @2xl:gap-6 @4xl:h-[92px]")}>
        {doc.theme.logo ? (
          <img src={imageUrl(doc.theme.logo)} alt={doc.meta.company} className="h-10 w-auto max-w-[180px] object-contain" />
        ) : (
          <span className="flex min-w-0 flex-col">
            <span className="text-[8.5px] font-semibold uppercase leading-none tracking-[0.34em] opacity-75 @2xl:text-[9.5px]">{doc.meta.industry}</span>
            <T meta="company" value={doc.meta.company} className={cn(serif, "mt-1 truncate text-[19px] uppercase leading-[1.1] tracking-[0.05em] @2xl:text-[27px] @2xl:leading-[1.05] @2xl:tracking-[0.07em]")} placeholder="Firmenname" />
          </span>
        )}
        <nav className="hidden items-center gap-8 @5xl:flex">
          {links.map((link, i) => (
            <T key={i} path={["links", i]} value={link} className={cn("text-[14.5px] font-medium transition-colors hover:text-(--p)", i === 0 && "text-(--p)")} placeholder="Link" />
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <a href="#reserve" className={cn(solid, "h-10 whitespace-nowrap px-4 text-[13px] @2xl:h-11 @2xl:px-5 @2xl:text-[13.5px]")}>
            <T path={["cta"]} value={cta} placeholder="Button" />
            <ArrowRight className="hidden size-4 @2xl:block" aria-hidden="true" />
          </a>
          <span className="flex size-10 items-center justify-center rounded-full border border-(--fg)/20 @2xl:size-11 @5xl:hidden" aria-hidden="true">
            <Menu className="size-5" />
          </span>
        </div>
      </div>
    </header>
  );
}

// ---------- hero ----------
/** Round badge with text running around its edge; the ring turns slowly. */
function Badge({ ring, children }: { ring: string; children: ReactNode }) {
  return (
    <a
      href="#reserve"
      className="group/badge relative flex size-[148px] items-center justify-center rounded-full bg-(--p) text-(--p-on) shadow-[0_24px_50px_-18px_color-mix(in_srgb,var(--p)_75%,transparent)] transition-transform duration-300 hover:scale-[1.04] @4xl:size-[196px]"
    >
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full [animation:d-spin_32s_linear_infinite] motion-reduce:[animation:none]" aria-hidden="true">
        <defs>
          <path id="osteria-ring" d="M100 100 m-82 0 a82 82 0 1 1 164 0 a82 82 0 1 1 -164 0" />
        </defs>
        <text fill="currentColor" fontSize="11.5" fontWeight="600" letterSpacing="4.2" opacity="0.85" style={{ textTransform: "uppercase" }}>
          <textPath href="#osteria-ring" textLength="508" lengthAdjust="spacing">
            {ring}
          </textPath>
        </text>
      </svg>
      <span className="pointer-events-none absolute inset-[26px] rounded-full border border-current opacity-25" aria-hidden="true" />
      <span className="relative flex max-w-[58%] flex-col items-center gap-2 text-center">
        <span className="text-[11.5px] font-semibold uppercase leading-[1.35] tracking-[0.16em] @4xl:text-[13.5px] @4xl:leading-[1.35]">{children}</span>
        <ArrowRight className="size-4 transition-transform duration-300 group-hover/badge:translate-x-1 @4xl:size-5" aria-hidden="true" />
      </span>
    </a>
  );
}

function Hero({ block, doc }: { block: HeroBlock; doc: DemoDoc }) {
  const edit = useEdit();
  const p = block.props;
  const lines = p.title.split("\n");
  const ring = `${doc.meta.company} · ${doc.meta.industry} · ${doc.meta.company} · ${doc.meta.industry} · `;
  return (
    <section id="top" className="relative isolate overflow-hidden bg-(--bg) pb-10 @4xl:pb-[92px]">
      <div className={cn(wrap, "relative z-10 pt-[112px] @4xl:pt-[150px]")}>
        <div className="max-w-[600px]">
          <T path={["eyebrow"]} value={p.eyebrow} multiline className={cn(caps, "block max-w-[280px] leading-[1.75]")} placeholder="Kurzzeile" />
          {/* the last line of the headline takes the accent colour */}
          <h1 className={cn(serif, "relative mt-4 text-[68px] leading-[0.94] tracking-[-0.03em] @2xl:text-[104px] @2xl:leading-[0.94] @5xl:text-[128px] @5xl:leading-[0.92] @6xl:text-[158px] @6xl:leading-[0.9]")}>
            {edit ? (
              <T path={["title"]} value={p.title} multiline placeholder="Hauptüberschrift" />
            ) : (
              lines.map((line, i) => (
                <span key={i} className={cn("block", lines.length > 1 && i === lines.length - 1 && "text-(--p)")}>
                  {line}
                </span>
              ))
            )}
          </h1>
          <T as="p" path={["text"]} value={p.text} multiline className="mt-6 max-w-[380px] text-[15.5px] leading-[1.65] text-(--fg)/85" placeholder="Worum geht es?" />
          <div className="mt-8 flex items-center gap-4">
            <span className="h-px w-8 bg-(--fg)/35" aria-hidden="true" />
            <ul className="flex flex-wrap items-center gap-x-3 gap-y-1">
              {p.points.map((point, i) => (
                <li key={i} className={cn(caps, "group/item relative flex items-center gap-3 text-(--fg)/75")}>
                  {i > 0 && <span aria-hidden="true">·</span>}
                  <T path={["points", i]} value={point} placeholder="Wort" />
                  <ItemTools path={["points"]} index={i} count={p.points.length} />
                </li>
              ))}
              <li>
                <AddItem path={["points"]} item="Wort" label="Wort" />
              </li>
            </ul>
            <span className="hidden h-px w-16 bg-(--fg)/35 @2xl:block" aria-hidden="true" />
          </div>
        </div>
      </div>

      {(p.note || edit) && (
        <div className="absolute left-[30%] top-[138px] z-10 hidden -rotate-[7deg] @6xl:block">
          <T path={["note"]} value={p.note} multiline className={cn(script, "block text-(--fg)/80")} placeholder="Handschriftliche Notiz" />
          <Swoosh className="ml-28 mt-0.5 w-14 rotate-[24deg] text-(--fg)/55" />
        </div>
      )}

      {/* the photo: on wide layouts behind the text, faded into the paper on its left edge */}
      <div className="relative mt-8 @4xl:static @4xl:mt-0">
        <Img
          src={p.image}
          path={["image"]}
          alt=""
          eager
          chip="tr"
          className="aspect-[5/4] w-full bg-transparent [mask-image:linear-gradient(to_bottom,transparent,#000_16%)] @4xl:absolute @4xl:inset-y-0 @4xl:right-0 @4xl:-z-10 @4xl:aspect-auto @4xl:w-[88%] @4xl:[mask-image:linear-gradient(to_right,transparent_4%,#000_30%)]"
          imgClassName="object-[68%_center] @4xl:object-[100%_16%]"
        />
        <div className="absolute bottom-6 left-5 z-10 @4xl:bottom-[128px] @4xl:left-auto @4xl:right-[11%]">
          <Badge ring={ring}>
            <T path={["primary"]} value={p.primary} placeholder="Button" />
          </Badge>
        </div>
      </div>
    </section>
  );
}

// ---------- stats: the dark green info strip that overlaps the hero ----------
function Stats({ block }: { block: StatsBlock }) {
  const { items } = block.props;
  const fallback = ["clock", "pin", "phone", "utensils"];
  return (
    <section className="relative z-10 -mt-10 rounded-t-[calc(var(--r)*1.9)] bg-(--dk) text-(--dk-on) @4xl:-mt-[92px]">
      <div className={cn(wrap, "grid grid-cols-1 gap-y-7 py-9 @2xl:grid-cols-2 @5xl:flex @5xl:py-11")}>
        {items.map((item, i) => (
          <div key={i} className="group/item relative flex items-start gap-4 border-(--dk-on)/15 @5xl:flex-1 @5xl:px-9 @5xl:first:pl-2 @5xl:[&:not(:first-child)]:border-l">
            <IconPick name={item.icon ?? fallback[i % fallback.length]} path={["items", i, "icon"]} className={cn("mt-0.5 rounded-full", sand)} iconClassName="size-9" strokeWidth={1.2} />
            <div className="min-w-0">
              <T path={["items", i, "label"]} value={item.label} className={cn(caps, "block text-[10.5px]", sand)} placeholder="Bezeichnung" />
              <T path={["items", i, "value"]} value={item.value} multiline className="mt-2.5 block text-[14.5px] leading-[1.55]" placeholder="Angabe" />
            </div>
            <ItemTools path={["items"]} index={i} count={items.length} />
          </div>
        ))}
      </div>
      <div className={cn(wrap, "pb-5 empty:hidden")}>
        <AddItem path={["items"]} item={{ icon: "star", value: "Angabe", label: "Bezeichnung" }} label="Angabe" />
      </div>
    </section>
  );
}

// ---------- about: photo collage with organic shapes ----------
function About({ block }: { block: AboutBlock }) {
  const edit = useEdit();
  const { eyebrow, title, text, image, image2, points, flip, button, note } = block.props;
  return (
    <section id="about" className={section}>
      <div className={cn(wrap, "grid items-center gap-12 @5xl:grid-cols-[1.08fr_1fr] @5xl:gap-20")}>
        <div className={cn("d-rise relative mx-auto aspect-[1/0.94] w-full max-w-[580px]", flip && "@5xl:order-2")}>
          <Img src={image} path={["image"]} alt="" className="absolute left-0 top-0 h-[66%] w-[56%] [border-radius:46%_54%_40%_60%/38%_44%_56%_62%]" />
          <span className="absolute left-[50%] top-[1%] z-10 flex size-[19%] items-center justify-center rounded-full bg-(--dk) text-(--dk-on) shadow-[0_0_0_7px_var(--bg)]" aria-hidden="true">
            <Wine className={cn("size-[42%]", sand)} strokeWidth={1.2} />
          </span>
          <Img
            src={image2}
            path={["image2"]}
            alt=""
            className="absolute bottom-[8%] right-0 h-[66%] w-[50%] shadow-[0_0_0_9px_var(--bg)] [border-radius:52%_48%_58%_42%/44%_40%_60%_56%]"
            imgClassName="grayscale-[0.85]"
          />
          {(note || edit) && <T path={["note"]} value={note} multiline className={cn(script, "absolute bottom-[3%] left-[9%] block -rotate-[9deg] text-(--fg)/75")} placeholder="Notiz" />}
          <Sprig className="absolute bottom-0 right-[40%] hidden w-[13%] rotate-[18deg] text-(--fg)/55 @2xl:block" />
        </div>
        <div className="d-rise">
          <Eyebrow value={eyebrow} />
          <T as="h2" path={["title"]} value={title} multiline className={h2} placeholder="Überschrift" />
          <T as="p" path={["text"]} value={text} multiline className="mt-6 max-w-[470px] text-[15.5px] leading-[1.7] text-(--fg)/85" placeholder="Über das Haus" />
          {(points.length > 0 || edit) && (
            <ul className="mt-6 space-y-2.5">
              {points.map((point, i) => (
                <li key={i} className="group/item relative flex items-start gap-3 text-[15px]">
                  <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-(--p)" aria-hidden="true" />
                  <T path={["points", i]} value={point} placeholder="Punkt" />
                  <ItemTools path={["points"]} index={i} count={points.length} />
                </li>
              ))}
              <li>
                <AddItem path={["points"]} item="Neuer Punkt" label="Punkt" />
              </li>
            </ul>
          )}
          {(button || edit) && (
            <a href="#prices" className={cn(solid, "mt-8")}>
              <T path={["button"]} value={button} placeholder="Button" />
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

// ---------- prices: the menu, two columns with dotted leaders ----------
function Prices({ block }: { block: PricesBlock }) {
  const edit = useEdit();
  const { eyebrow, title, text, button, groups } = block.props;
  return (
    <section id="prices" className={cn(section, "@4xl:pt-10")}>
      <div className={wrap}>
        <Head eyebrow={eyebrow} title={title}>
          <div className="flex flex-col items-start gap-5 @4xl:max-w-[360px] @4xl:pb-2">
            <T as="p" path={["text"]} value={text} multiline className="text-[15px] leading-[1.65] text-(--fg)/85" placeholder="Kurzer Einleitungstext" />
            {(button || edit) && (
              <a href="#reserve" className={outline}>
                <T path={["button"]} value={button} placeholder="Button" />
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            )}
          </div>
        </Head>
        <div className="mt-12 grid gap-x-20 gap-y-11 @4xl:grid-cols-2">
          {groups.map((group, g) => (
            <div key={g} className="d-rise group/item relative">
              <T as="h3" path={["groups", g, "name"]} value={group.name} className={cn(caps, "block border-b border-(--line) pb-3 text-[11px]")} placeholder="Gruppe" />
              <ul className="mt-4 space-y-4">
                {group.items.map((item, i) => (
                  <li key={i} className="group/item relative">
                    <div className="flex items-baseline gap-3">
                      <T path={["groups", g, "items", i, "name"]} value={item.name} className={cn(serif, "text-[19px] leading-[1.25] tracking-[-0.01em]")} placeholder="Gericht" />
                      <span className="h-1 min-w-6 flex-1 -translate-y-[3px] text-(--fg)/45 bg-[radial-gradient(circle,currentColor_1px,transparent_1.3px)] [background-size:7px_4px] bg-repeat-x" aria-hidden="true" />
                      <T path={["groups", g, "items", i, "price"]} value={item.price} className="shrink-0 text-[15px] font-medium tabular-nums" placeholder="0,00 €" />
                    </div>
                    <T path={["groups", g, "items", i, "text"]} value={item.text} className="mt-1 block text-[13.5px] text-(--mut)" placeholder="Beschreibung" />
                    <ItemTools path={["groups", g, "items"]} index={i} count={group.items.length} />
                  </li>
                ))}
              </ul>
              <AddItem path={["groups", g, "items"]} item={{ name: "Neues Gericht", text: "Zutaten", price: "0,00 €" }} label="Gericht" className="mt-4" />
              <ItemTools path={["groups"]} index={g} count={groups.length} />
            </div>
          ))}
        </div>
        <div className="mt-6 empty:hidden">
          <AddItem path={["groups"]} item={{ name: "Neue Gruppe", items: [{ name: "Gericht", text: "Zutaten", price: "0,00 €" }] }} label="Gruppe" />
        </div>
      </div>
    </section>
  );
}

// ---------- cards: signature dishes ----------
function Cards({ block }: { block: CardsBlock }) {
  const edit = useEdit();
  const { eyebrow, title, text, items } = block.props;
  return (
    <section id="offers" className={cn(section, "@4xl:pt-6")}>
      <div className={wrap}>
        <Head eyebrow={eyebrow} title={title}>
          {(text || edit) && (
            <div className="flex items-start gap-2 @4xl:pb-3 @4xl:pr-8">
              <T path={["text"]} value={text} multiline className={cn(script, "block -rotate-[8deg] text-(--fg)/80")} placeholder="Notiz" />
              <Swoosh className="mt-6 hidden w-12 rotate-[62deg] text-(--fg)/55 @4xl:block" />
            </div>
          )}
        </Head>
        <div className="mt-10 grid gap-x-5 gap-y-10 @2xl:grid-cols-2 @5xl:grid-cols-3">
          {items.map((item, i) => (
            <article key={i} className="d-rise group/item relative">
              <div className="relative">
                <Img src={item.image} path={["items", i, "image"]} alt={item.title} className="aspect-[16/11] w-full rounded-(--r)" imgClassName="transition-transform duration-700 group-hover/item:scale-105" />
                <T
                  path={["items", i, "tag"]}
                  value={item.tag}
                  className="absolute -bottom-3 left-5 z-10 rounded-full bg-(--card) px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] shadow-[0_6px_16px_-8px_rgba(0,0,0,0.35)]"
                  placeholder="Etikett"
                />
              </div>
              <div className="px-2 pt-8">
                <T as="h3" path={["items", i, "title"]} value={item.title} className={cn(serif, "block text-[25px] leading-[1.15]")} placeholder="Gericht" />
                <T as="p" path={["items", i, "text"]} value={item.text} multiline className="mt-2.5 max-w-[310px] text-[14.5px] leading-[1.6] text-(--fg)/80" placeholder="Beschreibung" />
                <T path={["items", i, "price"]} value={item.price} className="mt-3.5 block text-[15.5px] font-semibold tabular-nums" placeholder="0,00 €" />
              </div>
              <ItemTools path={["items"]} index={i} count={items.length} />
            </article>
          ))}
        </div>
        <div className="mt-6 empty:hidden">
          <AddItem path={["items"]} item={{ image: "", title: "Neues Gericht", text: "Kurze Beschreibung.", price: "0,00 €", tag: "Neu" }} label="Gericht" />
        </div>
      </div>
    </section>
  );
}

// ---------- gallery: a strip of photos with varied corners ----------
const corners = ["rounded-tl-[42%]", "", "", "", "", "", "rounded-tr-[42%] rounded-br-[26%]"];

function Gallery({ block }: { block: GalleryBlock }) {
  const edit = useEdit();
  const { eyebrow, title, text, note, images } = block.props;
  // on wide layouts the fifth and sixth photo share one column
  const half = (i: number) => (i % 7 === 4 && i + 1 < images.length) || i % 7 === 5;
  // in the two-column phone grid an odd number of photos starts with one wide photo
  const wide = (i: number) => i === 0 && images.length % 2 === 1;
  return (
    <section id="gallery" className={cn(section, "@4xl:pt-6")}>
      <div className={wrap}>
        <Head eyebrow={eyebrow} title={title}>
          <div className="flex flex-1 flex-wrap items-end justify-between gap-5 @4xl:pb-2 @4xl:pl-2">
            {(note || edit) && (
              <span className="flex items-center gap-3">
                <Swoosh className="hidden w-12 -scale-x-100 rotate-[160deg] text-(--fg)/55 @4xl:block" />
                <T path={["note"]} value={note} className={cn(script, "block -rotate-[5deg] text-(--fg)/80")} placeholder="Notiz" />
              </span>
            )}
            {(text || edit) && (
              <a href="#contact" className={cn(outline, "ml-auto")}>
                <T path={["text"]} value={text} placeholder="Link-Text" />
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            )}
          </div>
        </Head>
      </div>
      <div className="mx-auto mt-10 grid max-w-[1320px] grid-cols-2 gap-2.5 px-4 @4xl:h-[330px] @4xl:auto-cols-fr @4xl:grid-flow-col @4xl:grid-cols-none @4xl:grid-rows-2 @4xl:gap-3">
        {images.map((image, i) => (
          <div key={i} className={cn("d-rise group/item relative", wide(i) && "col-span-2 @4xl:col-span-1", !half(i) && "@4xl:row-span-2")}>
            <Img src={image} path={["images", i]} alt="" className={cn("w-full rounded-(--r) @4xl:aspect-auto @4xl:h-full", wide(i) ? "aspect-[16/10]" : "aspect-[4/5]", corners[i % corners.length])} imgClassName="transition-transform duration-700 group-hover/item:scale-105" />
            <ItemTools path={["images"]} index={i} count={images.length} />
          </div>
        ))}
      </div>
      <div className={cn(wrap, "mt-5 empty:hidden")}>
        <AddItem path={["images"]} item="" label="Bild" />
      </div>
    </section>
  );
}

// ---------- quotes ----------
function Quotes({ block }: { block: QuotesBlock }) {
  const edit = useEdit();
  const { eyebrow, title, text, items } = block.props;
  return (
    <section id="quotes" className={cn(section, "@4xl:pt-6")}>
      <div className={wrap}>
        <Head eyebrow={eyebrow} title={title}>
          {(text || edit) && (
            <span className="inline-flex h-11 items-center gap-3 self-start rounded-full border border-(--p)/60 px-5 text-[13.5px] font-medium text-(--p) @4xl:self-end">
              <Stars className="text-[13px]" />
              <T path={["text"]} value={text} placeholder="z. B. 4,8 von 5 bei Google" />
            </span>
          )}
        </Head>
        <div className="mt-10 grid gap-4 @4xl:grid-cols-3 @4xl:gap-5">
          {items.map((item, i) => (
            <figure key={i} className="d-rise group/item relative rounded-(--r) border border-(--line) bg-(--card)/60 p-7 @2xl:p-8">
              <Stars className="text-[15px] text-(--p)" />
              <T as="blockquote" path={["items", i, "quote"]} value={item.quote} multiline className="mt-4 text-[15.5px] leading-[1.65]" placeholder="Zitat" />
              <figcaption className="mt-5 text-[13.5px] text-(--mut)">
                <T path={["items", i, "name"]} value={item.name} className="font-medium text-(--fg)" placeholder="Name" />
                <span aria-hidden="true"> · </span>
                <T path={["items", i, "role"]} value={item.role} placeholder="Anlass" />
              </figcaption>
              <ItemTools path={["items"]} index={i} count={items.length} />
            </figure>
          ))}
        </div>
        <div className="mt-5 empty:hidden">
          <AddItem path={["items"]} item={{ quote: "Hier steht eine Gästestimme.", name: "Vorname N.", role: "Gast" }} label="Stimme" />
        </div>
      </div>
    </section>
  );
}

// ---------- faq ----------
function Faq({ block }: { block: FaqBlock }) {
  const edit = useEdit();
  const { eyebrow, title, text, items } = block.props;
  return (
    <section id="faq" className={section}>
      <div className={cn(wrap, "grid gap-10 @5xl:grid-cols-[0.85fr_1.15fr] @5xl:gap-20")}>
        <div className="d-rise">
          <Eyebrow value={eyebrow} />
          <T as="h2" path={["title"]} value={title} multiline className={h2} placeholder="Überschrift" />
          <T as="p" path={["text"]} value={text} multiline className="mt-5 max-w-[380px] text-[15px] leading-[1.65] text-(--fg)/85" placeholder="Kurzer Einleitungstext" />
        </div>
        <div>
          <div className="border-t border-(--line)">
            {items.map((item, i) => (
              <details key={i} open={!!edit || i === 0} className="group/item group/faq relative border-b border-(--line)">
                <summary className={cn(serif, "flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[21px] leading-[1.25] tracking-[-0.01em] [&::-webkit-details-marker]:hidden")}>
                  <T path={["items", i, "q"]} value={item.q} placeholder="Frage" />
                  <ChevronDown className="size-5 shrink-0 text-(--p) transition-transform duration-200 group-open/faq:rotate-180" aria-hidden="true" />
                </summary>
                <T as="p" path={["items", i, "a"]} value={item.a} multiline className="max-w-[560px] pb-6 text-[15px] leading-[1.65] text-(--fg)/80" placeholder="Antwort" />
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

// ---------- call to action: the reservation panel ----------
const times = ["12:00", "12:30", "13:00", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"];

function Cta({ block }: { block: CtaBlock }) {
  const { eyebrow, title, text, button } = block.props;
  const fieldLabel = "mb-1.5 block text-[12.5px] font-medium text-(--fg)";
  const field = "h-12 w-full appearance-none rounded-[14px] border border-(--line) bg-(--bg) pl-11 pr-9 text-[14.5px] text-(--fg) outline-none transition-colors focus:border-(--p)";
  const icon = "pointer-events-none absolute left-4 top-1/2 size-[17px] -translate-y-1/2 text-(--fg)/70";
  const chevron = "pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-(--mut)";
  return (
    <section id="reserve" className="bg-(--bg) px-0 pb-4 pt-6 @4xl:pb-6">
      <div className="relative overflow-hidden rounded-[calc(var(--r)*1.9)] bg-(--dk) text-(--dk-on)">
        <div className={cn(wrap, "grid items-center gap-10 py-14 @5xl:grid-cols-[1.2fr_1fr] @5xl:gap-16 @5xl:py-[72px]")}>
          <div className="d-rise relative">
            <T path={["eyebrow"]} value={eyebrow} className={cn(caps, "mb-5 block", sand)} placeholder="Kurzzeile" />
            <T as="h2" path={["title"]} value={title} multiline className={cn(serif, "max-w-[460px] text-[42px] leading-[1.03] @2xl:text-[58px] @2xl:leading-[1.02] @5xl:text-[66px] @5xl:leading-[1]")} placeholder="Aufforderung" />
            <T as="p" path={["text"]} value={text} multiline className="mt-6 max-w-[430px] text-[15.5px] leading-[1.65] opacity-85" placeholder="Text" />
            <div className={cn("pointer-events-none absolute -right-2 top-2 hidden @6xl:block", sand)} aria-hidden="true">
              <Sprig className="ml-10 w-16 rotate-[24deg] opacity-70" />
            </div>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="d-rise rounded-(--r) bg-(--card) p-6 text-(--fg) shadow-[0_30px_70px_-30px_rgba(0,0,0,0.55)] @2xl:p-8">
            <div className="grid gap-4 @2xl:grid-cols-2">
              <label className="block">
                <span className={fieldLabel}>Datum</span>
                <span className="relative block">
                  <CalendarDays className={icon} aria-hidden="true" />
                  <input type="date" className={cn(field, "pr-3")} aria-label="Datum" />
                </span>
              </label>
              <label className="block">
                <span className={fieldLabel}>Uhrzeit</span>
                <span className="relative block">
                  <Clock className={icon} aria-hidden="true" />
                  <select className={field} aria-label="Uhrzeit" defaultValue="19:00">
                    {times.map((time) => (
                      <option key={time}>{time}</option>
                    ))}
                  </select>
                  <ChevronDown className={chevron} aria-hidden="true" />
                </span>
              </label>
            </div>
            <label className="mt-4 block">
              <span className={fieldLabel}>Personen</span>
              <span className="relative block">
                <Users className={icon} aria-hidden="true" />
                <select className={field} aria-label="Personen" defaultValue="2 Personen">
                  {["1 Person", "2 Personen", "3 Personen", "4 Personen", "5 Personen", "6 Personen", "Mehr als 6"].map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
                <ChevronDown className={chevron} aria-hidden="true" />
              </span>
            </label>
            <button type="submit" className={cn(solid, "mt-6 w-full")}>
              <T path={["button"]} value={button} placeholder="Button" />
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

// ---------- contact ----------
function Contact({ block, doc }: { block: ContactBlock; doc: DemoDoc }) {
  const { eyebrow, title, text, hours, form } = block.props;
  const { meta } = doc;
  const row = "flex items-start gap-4";
  const ico = cn("mt-0.5 size-[22px] shrink-0 text-(--p)");
  const input = "h-12 w-full rounded-[14px] border border-(--line) bg-(--bg) px-4 text-[14.5px] text-(--fg) outline-none transition-colors placeholder:text-(--mut) focus:border-(--p)";
  return (
    <section id="contact" className={section}>
      <div className={cn(wrap, "grid items-center gap-12 @5xl:grid-cols-[1fr_1.05fr] @5xl:gap-20")}>
        <div className="d-rise">
          <Eyebrow value={eyebrow} />
          <T as="h2" path={["title"]} value={title} multiline className={h2} placeholder="Überschrift" />
          <T as="p" path={["text"]} value={text} multiline className="mt-5 max-w-[420px] text-[15.5px] leading-[1.65] text-(--fg)/85" placeholder="Kurzer Einleitungstext" />
          <ul className="mt-9 space-y-6 text-[15px]">
            <li className={row}>
              <MapPin className={ico} strokeWidth={1.4} aria-hidden="true" />
              <span>
                <T meta="address" value={meta.address} className="block font-medium" placeholder="Straße und Hausnummer" />
                <T meta="city" value={meta.city} className="block text-(--mut)" placeholder="PLZ Ort" />
              </span>
            </li>
            <li className={row}>
              <Phone className={ico} strokeWidth={1.4} aria-hidden="true" />
              <T meta="phone" value={meta.phone} className="font-medium" placeholder="Telefon" />
            </li>
            <li className={row}>
              <Mail className={ico} strokeWidth={1.4} aria-hidden="true" />
              <T meta="email" value={meta.email} className="font-medium" placeholder="E-Mail" />
            </li>
            <li className={row}>
              <Clock className={ico} strokeWidth={1.4} aria-hidden="true" />
              <span className="w-full max-w-[330px]">
                {hours.map((h, i) => (
                  <span key={i} className="group/item relative flex items-baseline gap-3 py-0.5">
                    <T path={["hours", i, "day"]} value={h.day} className="text-(--mut)" placeholder="Tag" />
                    <span className="h-1 min-w-4 flex-1 -translate-y-[3px] text-(--fg)/40 bg-[radial-gradient(circle,currentColor_1px,transparent_1.3px)] [background-size:7px_4px] bg-repeat-x" aria-hidden="true" />
                    <T path={["hours", i, "time"]} value={h.time} className="font-medium" placeholder="Zeit" />
                    <ItemTools path={["hours"]} index={i} count={hours.length} />
                  </span>
                ))}
                <AddItem path={["hours"]} item={{ day: "Tag", time: "12–22 Uhr" }} label="Zeile" className="mt-2" />
              </span>
            </li>
          </ul>
        </div>
        {form ? (
          <form className="d-rise space-y-3 rounded-(--r) border border-(--line) bg-(--card) p-6 @2xl:p-8" onSubmit={(e) => e.preventDefault()}>
            <p className={cn(serif, "mb-5 text-[24px] leading-[1.2]")}>Schreiben Sie uns</p>
            <div className="grid gap-3 @2xl:grid-cols-2">
              <input className={input} placeholder="Name" aria-label="Name" />
              <input className={input} placeholder="Telefon" aria-label="Telefon" />
            </div>
            <input className={input} placeholder="E-Mail" aria-label="E-Mail" />
            <textarea className={cn(input, "h-32 resize-none py-3")} placeholder="Ihre Nachricht" aria-label="Nachricht" />
            <button type="submit" className={cn(solid, "w-full")}>
              Nachricht senden
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </form>
        ) : (
          <div className="d-rise relative">
            <MapArt label={meta.company} className="aspect-[5/4] w-full [border-radius:calc(var(--r)*5)_var(--r)_calc(var(--r)*5)_var(--r)] border border-(--line)" />
            <Sprig className="absolute -bottom-6 -left-4 hidden w-14 -rotate-[20deg] text-(--fg)/50 @2xl:block" />
          </div>
        )}
      </div>
    </section>
  );
}

// ---------- footer ----------
function Footer({ block, doc }: { block: FooterBlock; doc: DemoDoc }) {
  const edit = useEdit();
  const { text, links } = block.props;
  const { meta } = doc;
  const round = "flex size-10 items-center justify-center rounded-full border border-(--fg)/20 transition-colors hover:border-(--p) hover:text-(--p)";
  return (
    <footer className="bg-(--bg) pb-9 pt-12 text-(--fg)">
      <div className={cn(wrap, "flex flex-col gap-9 @5xl:flex-row @5xl:items-center @5xl:justify-between")}>
        <div>
          <span className="block text-[9.5px] font-semibold uppercase leading-none tracking-[0.34em] opacity-75">{meta.industry}</span>
          <T meta="company" value={meta.company} className={cn(serif, "mt-1 block text-[28px] uppercase leading-[1.1] tracking-[0.07em]")} placeholder="Firmenname" />
          {(text || edit) && <T path={["text"]} value={text} className={cn(script, "mt-2 block -rotate-[3deg] text-(--fg)/75")} placeholder="Kurzer Satz" />}
        </div>
        <nav className="flex flex-wrap gap-x-7 gap-y-2 text-[14.5px] font-medium">
          {navLinks(doc).map((link, i) => (
            <span key={i} className="transition-colors hover:text-(--p)">
              {link}
            </span>
          ))}
        </nav>
        <div className="flex items-center gap-2.5">
          <a href={`tel:${meta.phone.replace(/[^+\d]/g, "")}`} className={round} aria-label="Anrufen">
            <Phone className="size-[17px]" strokeWidth={1.6} aria-hidden="true" />
          </a>
          <a href={`mailto:${meta.email}`} className={round} aria-label="E-Mail schreiben">
            <Mail className="size-[17px]" strokeWidth={1.6} aria-hidden="true" />
          </a>
          <a href="#contact" className={round} aria-label="Anfahrt">
            <MapPin className="size-[17px]" strokeWidth={1.6} aria-hidden="true" />
          </a>
          <Sprig className="ml-3 hidden w-11 rotate-[14deg] text-(--fg)/55 @2xl:block" />
        </div>
      </div>
      <div className={cn(wrap, "mt-9")}>
        <div className="flex flex-col gap-3 border-t border-(--line) pt-6 text-[12.5px] text-(--mut) @2xl:flex-row @2xl:items-center @2xl:justify-between">
          <p>
            © {new Date().getFullYear()} {meta.company}. Alle Rechte vorbehalten.
          </p>
          <ul className="flex flex-wrap gap-x-7 gap-y-1">
            {links.map((link, i) => (
              <li key={i}>
                <T path={["links", i]} value={link} placeholder="Link" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default function OsteriaBlock({ block, doc }: SkinProps) {
  switch (block.type) {
    case "nav":
      return <Nav block={block} doc={doc} />;
    case "hero":
      return <Hero block={block} doc={doc} />;
    case "stats":
      return <Stats block={block} />;
    case "about":
      return <About block={block} />;
    case "prices":
      return <Prices block={block} />;
    case "cards":
      return <Cards block={block} />;
    case "gallery":
      return <Gallery block={block} />;
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
