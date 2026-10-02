import { ArrowRight, Check, ChevronDown, Clock, FileCheck, FileText, Lock, Mail, MapPin, Menu, MessageCircle, Phone, Plus, Wrench } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { renderBase, type SkinProps } from "../blocks";
import { AddItem, Img, ItemTools, T, imageUrl, useEdit } from "../edit";
import type { AboutBlock, ContactBlock, CtaBlock, DemoDoc, FaqBlock, FooterBlock, GalleryBlock, HeroBlock, NavBlock, QuotesBlock, ServicesBlock, StatsBlock, StepsBlock } from "../types";
import { BeforeAfter, IconPick, Initials, Stars, navLinks } from "./kit";

// "Werk": sturdy and confident – off-white paper, charcoal, one signal colour, a heavy wide grotesque.

// the design runs wider than the other skins
const wrap = "mx-auto w-full max-w-[1340px] px-5 @2xl:px-8";
// (line height comes after the size: a font-size utility would otherwise reset it)
const display = "[font-family:var(--fh)] font-black uppercase [font-stretch:104%] tracking-[-0.022em]";
const h2 = cn(display, "text-balance text-[31px] leading-[1.04] @2xl:text-[44px] @2xl:leading-[1.02] @6xl:text-[50px] @6xl:leading-[1]");
const label = "text-[12px] font-extrabold uppercase tracking-[0.07em]";
const solid = "inline-flex h-[52px] items-center justify-center gap-2.5 rounded-(--r-sm) bg-(--p) px-6 text-[14.5px] font-bold text-(--p-on) transition-[filter,translate] duration-200 hover:-translate-y-px hover:brightness-110";
const outline = "inline-flex h-[52px] items-center justify-center gap-2.5 rounded-(--r-sm) border-[1.5px] border-(--fg) px-6 text-[14.5px] font-bold text-(--fg) transition-colors duration-200 hover:bg-(--fg) hover:text-(--bg)";
const panel = "rounded-(--r) border border-(--line) bg-(--card)";
const lift = "shadow-[0_24px_50px_-34px_rgba(0,0,0,0.3)]";
const section = "bg-(--bg) py-12 @4xl:py-[68px]";
const circle = "flex size-10 shrink-0 items-center justify-center rounded-full border-[1.5px] border-(--fg) transition-colors duration-200";

function Eyebrow({ value, path = ["eyebrow"] }: { value: string | undefined; path?: string[] }) {
  const edit = useEdit();
  if (!value && !edit) return null;
  return (
    <span className="mb-3.5 flex items-center gap-4">
      <span className="h-1 w-9 shrink-0 rounded-full bg-(--p)" aria-hidden="true" />
      <T path={path} value={value} className={label} placeholder="Kurzzeile" />
    </span>
  );
}

function Head({ eyebrow, title, text, children }: { eyebrow: string | undefined; title: string; text?: string; children?: ReactNode }) {
  const edit = useEdit();
  return (
    <div className="d-rise flex flex-col gap-5 @4xl:flex-row @4xl:items-end @4xl:justify-between @4xl:gap-12">
      <div>
        <Eyebrow value={eyebrow} />
        <T as="h2" path={["title"]} value={title} multiline className={h2} placeholder="Überschrift" />
      </div>
      {(text || children || (edit && text !== undefined)) && (
        <div className="flex shrink-0 flex-col items-start gap-4 @4xl:max-w-[330px] @4xl:pb-1">
          {text !== undefined && <T as="p" path={["text"]} value={text} multiline className="text-[15px] leading-[1.55] text-(--mut)" placeholder="Kurzer Einleitungstext" />}
          {children}
        </div>
      )}
    </div>
  );
}

/** Blueprint lines behind a section, fading out towards the bottom. */
function Blueprint() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 opacity-70 [mask-image:linear-gradient(to_bottom,#000_30%,transparent_95%)]"
      style={{
        backgroundImage: "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
        backgroundSize: "132px 132px",
        backgroundPosition: "center -1px",
      }}
      aria-hidden="true"
    />
  );
}

/** Hand-drawn arrow next to a handwritten note. */
function Squiggle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 44" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M56 5C43 3 22 9 8 34" />
      <path d="M6 20l2 14 13-5" />
    </svg>
  );
}

// ---------- nav ----------
function Nav({ block, doc }: { block: NavBlock; doc: DemoDoc }) {
  const { links, cta } = block.props;
  const contact = doc.blocks.find((b) => b.type === "contact");
  const hours = contact?.type === "contact" ? contact.props.hours[0] : undefined;
  return (
    <header className="relative z-20 bg-(--bg)">
      <div className={cn(wrap, "flex h-[74px] items-center justify-between gap-2.5 @2xl:gap-5 @5xl:h-[92px]")}>
        {doc.theme.logo ? (
          <img src={imageUrl(doc.theme.logo)} alt={doc.meta.company} className="h-10 w-auto max-w-[190px] object-contain" />
        ) : (
          <span className="flex min-w-0 items-stretch gap-2.5">
            <span className="w-[7px] shrink-0 rounded-[2px] bg-(--p)" aria-hidden="true" />
            <span className="min-w-0">
              <T meta="company" value={doc.meta.company} className={cn(display, "block truncate text-[16.5px] leading-[1] @2xl:text-[25px] @2xl:leading-[1]")} placeholder="Firmenname" />
              <T meta="industry" value={doc.meta.industry} className="mt-1 block text-[9.5px] font-semibold uppercase leading-none tracking-[0.3em] text-(--fg)/80 @2xl:text-[10.5px] @2xl:tracking-[0.36em]" placeholder="Branche" />
            </span>
          </span>
        )}
        <nav className="hidden items-center gap-8 @5xl:flex">
          {links.map((link, i) => (
            <T key={i} path={["links", i]} value={link} className="text-[14.5px] font-medium text-(--fg)/85 transition-colors hover:text-(--p)" placeholder="Link" />
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2 @2xl:gap-3 @6xl:gap-6">
          <span className="hidden items-center gap-3 @6xl:flex">
            <Phone className="size-[19px] fill-(--fg)" strokeWidth={0} aria-hidden="true" />
            <span className="leading-tight">
              <T meta="phone" value={doc.meta.phone} className="block text-[14.5px] font-extrabold" placeholder="Telefon" />
              {hours && (
                <span className="block text-[11.5px] text-(--mut)">
                  {hours.day} {hours.time}
                </span>
              )}
            </span>
          </span>
          <a href="#contact" className={cn(solid, "h-10 whitespace-nowrap px-3 text-[12.5px] @2xl:h-12 @2xl:px-5 @2xl:text-[14.5px]")}>
            <T path={["cta"]} value={cta} placeholder="Button" />
            <ArrowRight className="hidden size-4 @2xl:block" aria-hidden="true" />
          </a>
          <span className="flex size-10 items-center justify-center rounded-(--r-sm) border-[1.5px] border-(--fg) @2xl:size-12 @5xl:hidden" aria-hidden="true">
            <Menu className="size-5" />
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
    <section id="top" className="relative isolate overflow-hidden bg-(--bg)">
      <Blueprint />
      <div className={cn(wrap, "grid gap-10 pb-12 pt-6 @5xl:grid-cols-[0.88fr_1.12fr] @5xl:items-center @5xl:gap-10 @5xl:pb-14 @5xl:pt-0")}>
        <div>
          <Eyebrow value={p.eyebrow} />
          <T
            as="h1"
            path={["title"]}
            value={p.title}
            multiline
            className={cn(display, "text-[44px] leading-[1.02] @2xl:text-[64px] @2xl:leading-[1] @5xl:text-[62px] @5xl:leading-[1] @6xl:text-[72px] @6xl:leading-[1] @7xl:text-[82px] @7xl:leading-[0.99]")}
            placeholder="Hauptüberschrift"
          />
          <T as="p" path={["text"]} value={p.text} multiline className="mt-6 max-w-[470px] text-[16.5px] leading-[1.55] text-(--fg)/80" placeholder="Worum geht es?" />
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#contact" className={solid}>
              <T path={["primary"]} value={p.primary} placeholder="Button" />
              <ArrowRight className="size-[18px]" aria-hidden="true" />
            </a>
            {(p.secondary || edit) && (
              <a href="#projects" className={outline}>
                <T path={["secondary"]} value={p.secondary} placeholder="Zweiter Button" />
              </a>
            )}
          </div>
        </div>

        <div className="relative @5xl:pb-7">
          <Img src={p.image} path={["image"]} alt="" eager chip="tl" className="aspect-[1/0.96] w-full rounded-[calc(var(--r)+10px)] @2xl:aspect-[16/11] @5xl:aspect-[1/0.96]" />
          {(p.note || edit) && (
            <div className="absolute right-4 top-4 flex max-w-[190px] -rotate-[5deg] items-start gap-1 rounded-2xl bg-(--card)/85 py-2 pl-2 pr-4 text-(--fg) shadow-md backdrop-blur @2xl:right-6 @2xl:top-6">
              <Squiggle className="mt-3 w-8 shrink-0" />
              <T path={["note"]} value={p.note} multiline className="d-script text-[19px] leading-[1.15] @2xl:text-[22px] @2xl:leading-[1.15]" placeholder="Notiz" />
            </div>
          )}
          {/* floating offer card */}
          <div className={cn("relative z-10 mx-4 -mt-16 rounded-(--r) bg-(--card) p-5 shadow-[0_30px_60px_-24px_rgba(0,0,0,0.38)] @2xl:mx-10 @2xl:p-6", "@5xl:absolute @5xl:-right-2 @5xl:bottom-0 @5xl:mx-0 @5xl:mt-0 @5xl:w-[348px]")}>
            <div className="flex items-start gap-3.5">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-(--r-sm) bg-(--p)/12 text-(--p)">
                <FileText className="size-6" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <T path={["badge"]} value={p.badge} multiline className="block pt-0.5 text-[19px] font-extrabold leading-[1.18] tracking-[-0.01em]" placeholder="Titel der Karte" />
            </div>
            <ul className="mt-4 space-y-2.5 pr-14">
              {p.points.map((point, i) => (
                <li key={i} className="group/item relative flex items-center gap-3 text-[14.5px]">
                  <Check className="size-[18px] shrink-0 text-(--p)" strokeWidth={2.6} aria-hidden="true" />
                  <T path={["points", i]} value={point} placeholder="Vorteil" />
                  <ItemTools path={["points"]} index={i} count={p.points.length} />
                </li>
              ))}
            </ul>
            <AddItem path={["points"]} item="Neuer Vorteil" label="Vorteil" className="mt-3" />
            <a href="#contact" className="absolute bottom-5 right-5 flex size-[52px] items-center justify-center rounded-full bg-(--p) text-(--p-on) shadow-[0_12px_24px_-10px_var(--p)] transition-transform duration-200 hover:scale-105" aria-label="Zur Anfrage">
              <ArrowRight className="size-5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- stats: the first one is the trust row under the hero, later ones are the dark band ----------
function Stats({ block, doc }: { block: StatsBlock; doc: DemoDoc }) {
  const first = doc.blocks.find((b) => b.type === "stats")?.id === block.id;
  return first ? <TrustRow block={block} /> : <Band block={block} />;
}

const trustIcons = ["award", "settings", "star", "shield"];

function TrustRow({ block }: { block: StatsBlock }) {
  const { items } = block.props;
  return (
    <section className="bg-(--bg) pb-10 @4xl:pb-12">
      <div className={wrap}>
        <div className="grid gap-x-8 gap-y-5 border-t border-(--line) pt-7 @2xl:grid-cols-2 @5xl:flex">
          {items.map((item, i) => (
            <div key={i} className="d-rise group/item relative flex items-center gap-4 @5xl:flex-1">
              <IconPick name={item.icon ?? trustIcons[i % trustIcons.length]} path={["items", i, "icon"]} className="rounded-md" iconClassName="size-8" strokeWidth={1.9} />
              <span className="min-w-0 leading-tight">
                <T path={["items", i, "value"]} value={item.value} className="block text-[15.5px] font-extrabold" placeholder="Stärke" />
                <T path={["items", i, "label"]} value={item.label} className="mt-0.5 block text-[13.5px] text-(--mut)" placeholder="Erläuterung" />
              </span>
              <ItemTools path={["items"]} index={i} count={items.length} />
            </div>
          ))}
        </div>
        <AddItem path={["items"]} item={{ value: "Stärke", label: "Kurze Erläuterung", icon: "check" }} label="Punkt" className="mt-4" />
      </div>
    </section>
  );
}

function Band({ block }: { block: StatsBlock }) {
  const { items } = block.props;
  // an entry with the icon "note" is the handwritten remark at the end of the band, not a figure
  const figures = items.map((item, i) => ({ item, i })).filter(({ item }) => item.icon !== "note");
  const note = items.findIndex((item) => item.icon === "note");
  return (
    <section className="bg-(--bg) py-6 @4xl:py-8">
      <div className={wrap}>
        <div className="d-rise flex flex-col gap-8 rounded-(--r) bg-(--dk) px-7 py-9 text-(--dk-on) @5xl:flex-row @5xl:items-center @5xl:gap-0 @5xl:px-12">
          <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-8 @4xl:flex @4xl:gap-0">
            {figures.map(({ item, i }, n) => (
              <div key={i} className={cn("group/item relative @4xl:flex-1", n > 0 && "@4xl:border-l @4xl:border-white/15 @4xl:pl-9")}>
                <T path={["items", i, "value"]} value={item.value} className={cn(display, "block text-[36px] leading-[1] tracking-[-0.01em] @2xl:text-[44px] @2xl:leading-[1]")} placeholder="100" />
                <T path={["items", i, "label"]} value={item.label} multiline className="mt-2.5 block max-w-[150px] text-[13.5px] leading-[1.4] opacity-75" placeholder="Bezeichnung" />
                <ItemTools path={["items"]} index={i} count={items.length} />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-6 @5xl:pl-4">
            <a href="#contact" className="flex size-14 shrink-0 items-center justify-center rounded-full bg-(--p) text-(--p-on) transition-transform duration-200 hover:scale-105" aria-label="Zur Anfrage">
              <ArrowRight className="size-5" aria-hidden="true" />
            </a>
            {note >= 0 && (
              <span className="group/item relative block -rotate-[4deg]">
                <T path={["items", note, "value"]} value={items[note].value} multiline className="d-script block max-w-[200px] text-center text-[22px] leading-[1.25] opacity-90" placeholder="Notiz" />
                <ItemTools path={["items"]} index={note} count={items.length} />
              </span>
            )}
          </div>
        </div>
        <AddItem path={["items"]} item={{ value: "100", label: "Bezeichnung" }} label="Kennzahl" className="mt-4" />
      </div>
    </section>
  );
}

// ---------- services: numbered cards with a photo in the corner ----------
function Services({ block }: { block: ServicesBlock }) {
  const { eyebrow, title, text, items } = block.props;
  return (
    <section id="services" className={section}>
      <div className={wrap}>
        <Head eyebrow={eyebrow} title={title} text={text} />
        <div className="mt-9 grid gap-4 @2xl:grid-cols-2 @5xl:grid-cols-3 @5xl:gap-5">
          {items.map((item, i) => (
            <article key={i} className={cn(panel, "d-rise group/item relative min-h-[280px] overflow-hidden p-6 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-36px_rgba(0,0,0,0.4)] @5xl:min-h-[318px] @5xl:p-7")}>
              <Img
                src={item.image}
                path={["items", i, "image"]}
                alt=""
                className="absolute right-0 top-0 h-[142px] w-[56%] rounded-bl-[60px] rounded-tr-(--r) @5xl:h-[168px] @5xl:w-[54%] @5xl:rounded-bl-[72px]"
                imgClassName="transition-transform duration-700 group-hover/item:scale-[1.06]"
              />
              <span className={cn(display, "relative block text-[44px] leading-[1] tracking-[-0.01em] @5xl:text-[50px] @5xl:leading-[1]")} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <IconPick name={item.icon} path={["items", i, "icon"]} className="relative mt-5 rounded-md @5xl:mt-7" iconClassName="size-9" strokeWidth={1.7} />
              <div className="relative mt-6 pr-12 @5xl:mt-7">
                <T as="h3" path={["items", i, "title"]} value={item.title} className="block text-[19px] font-extrabold tracking-[-0.01em]" placeholder="Leistung" />
                <T as="p" path={["items", i, "text"]} value={item.text} multiline className="mt-2 max-w-[250px] text-[14.5px] leading-[1.5] text-(--mut)" placeholder="Beschreibung" />
              </div>
              <span className={cn(circle, "absolute bottom-6 right-6 group-hover/item:border-(--p) group-hover/item:bg-(--p) group-hover/item:text-(--p-on)")} aria-hidden="true">
                <ArrowRight className="size-[18px]" />
              </span>
              <ItemTools path={["items"]} index={i} count={items.length} />
            </article>
          ))}
        </div>
        <AddItem path={["items"]} item={{ icon: "wrench", title: "Neue Leistung", text: "Kurze Beschreibung.", image: "" }} label="Leistung" className="mt-5" />
      </div>
    </section>
  );
}

// ---------- about: before / after ----------
function About({ block }: { block: AboutBlock }) {
  const edit = useEdit();
  const { eyebrow, title, text, image, image2, points, button } = block.props;
  return (
    <section id="projects" className={section}>
      <div className={wrap}>
        <Head eyebrow={eyebrow} title={title} text={text}>
          {(button || edit) && (
            <a href="#contact" className="inline-flex items-center gap-2 border-b-2 border-(--p) pb-0.5 text-[14.5px] font-bold">
              <T path={["button"]} value={button} placeholder="Button" />
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          )}
        </Head>
        <BeforeAfter before={image} after={image2} beforePath={["image"]} afterPath={["image2"]} className={cn("d-rise mt-9 aspect-[4/3] w-full rounded-[calc(var(--r)+6px)] @2xl:aspect-[16/8] @5xl:aspect-[16/6.4]", lift)} />
        {(points.length > 0 || edit) && (
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {points.map((point, i) => (
              <li key={i} className="group/item relative flex items-center gap-2.5 text-[14.5px] font-semibold">
                <Check className="size-[18px] shrink-0 text-(--p)" strokeWidth={2.6} aria-hidden="true" />
                <T path={["points", i]} value={point} placeholder="Punkt" />
                <ItemTools path={["points"]} index={i} count={points.length} />
              </li>
            ))}
            <li>
              <AddItem path={["points"]} item="Neuer Punkt" label="Punkt" />
            </li>
          </ul>
        )}
      </div>
    </section>
  );
}

// ---------- steps ----------
const stepIcons = [FileText, MessageCircle, FileCheck, Wrench];

function Steps({ block }: { block: StepsBlock }) {
  const { eyebrow, title, text, items } = block.props;
  return (
    <section id="steps" className={section}>
      <div className={wrap}>
        <Head eyebrow={eyebrow} title={title} text={text} />
        <ol className={cn("mt-10 grid gap-y-7 @2xl:grid-cols-2 @2xl:gap-x-8", items.length >= 4 ? "@6xl:grid-cols-4" : "@5xl:grid-cols-3", "@6xl:gap-x-0")}>
          {items.map((item, i) => {
            const Icon = stepIcons[i % stepIcons.length];
            return (
              <li key={i} className={cn("d-rise group/item relative flex items-start gap-4", i > 0 && "@6xl:border-l @6xl:border-(--line) @6xl:pl-9", "@6xl:pr-7")}>
                <span className={cn("flex size-[68px] shrink-0 items-center justify-center rounded-full bg-(--card)", lift)}>
                  <Icon className="size-8" strokeWidth={1.9} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <span className={cn(display, "block text-[22px] leading-[1]")} aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <T as="h3" path={["items", i, "title"]} value={item.title} className="mt-1.5 block text-[15.5px] font-extrabold" placeholder="Schritt" />
                  <T as="p" path={["items", i, "text"]} value={item.text} multiline className="mt-2 text-[13.5px] leading-[1.5] text-(--mut)" placeholder="Beschreibung" />
                </div>
                {i < items.length - 1 && <ArrowRight className="absolute -right-2.5 top-6 z-10 hidden size-5 bg-(--bg) @6xl:block" strokeWidth={2.2} aria-hidden="true" />}
                <ItemTools path={["items"]} index={i} count={items.length} />
              </li>
            );
          })}
        </ol>
        <AddItem path={["items"]} item={{ title: "Neuer Schritt", text: "Beschreibung." }} label="Schritt" className="mt-5" />
      </div>
    </section>
  );
}

// ---------- quotes ----------
function Quotes({ block }: { block: QuotesBlock }) {
  const { eyebrow, title, text, items } = block.props;
  return (
    <section id="quotes" className={section}>
      <div className={wrap}>
        <Head eyebrow={eyebrow} title={title} text={text} />
        <div className="mt-9 grid gap-4 @4xl:grid-cols-3 @5xl:gap-5">
          {items.map((item, i) => (
            <figure key={i} className={cn(panel, lift, "d-rise group/item relative flex flex-col border-transparent p-6 @5xl:p-7")}>
              <span className={cn(display, "pointer-events-none absolute right-6 top-3 text-[92px] leading-[1] text-(--fg)/12")} aria-hidden="true">
                ”
              </span>
              <span className="flex items-center gap-2.5">
                <Stars className="text-[17px] text-(--p)" />
                <span className="text-[14.5px] font-extrabold">5,0</span>
              </span>
              <T as="blockquote" path={["items", i, "quote"]} value={item.quote} multiline className="mt-4 flex-1 text-[15.5px] leading-[1.55]" placeholder="Zitat" />
              <figcaption className="mt-6 flex items-center gap-3.5">
                <Initials name={item.name} className="size-11 bg-(--p)/14 text-[13.5px] text-(--p)" />
                <span className="leading-tight">
                  <T path={["items", i, "name"]} value={item.name} className="block text-[14.5px] font-extrabold" placeholder="Name" />
                  <T path={["items", i, "role"]} value={item.role} className="mt-0.5 block text-[13px] text-(--mut)" placeholder="Ort" />
                </span>
              </figcaption>
              <ItemTools path={["items"]} index={i} count={items.length} />
            </figure>
          ))}
        </div>
        <AddItem path={["items"]} item={{ quote: "Hier steht eine Kundenstimme.", name: "Vorname N.", role: "Ort" }} label="Stimme" className="mt-5" />
      </div>
    </section>
  );
}

// ---------- gallery ----------
function Gallery({ block }: { block: GalleryBlock }) {
  const { eyebrow, title, text, images } = block.props;
  return (
    <section id="gallery" className={section}>
      <div className={wrap}>
        <Head eyebrow={eyebrow} title={title} text={text} />
        <div className="mt-9 grid grid-cols-2 gap-3 @4xl:grid-cols-4 @4xl:gap-4">
          {images.map((image, i) => (
            <div key={i} className={cn("d-rise group/item relative", i % 6 === 0 && "col-span-2 @4xl:row-span-2")}>
              <Img src={image} path={["images", i]} alt="" className={cn("w-full rounded-(--r)", i % 6 === 0 ? "aspect-[4/3] @4xl:aspect-auto @4xl:h-full" : "aspect-[4/3]")} />
              <ItemTools path={["images"]} index={i} count={images.length} />
            </div>
          ))}
        </div>
        <AddItem path={["images"]} item="" label="Bild" className="mt-5" />
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
      <div className={cn(wrap, "grid gap-9 @5xl:grid-cols-[0.85fr_1.15fr] @5xl:gap-14")}>
        <div className="d-rise">
          <Eyebrow value={eyebrow} />
          <T as="h2" path={["title"]} value={title} multiline className={h2} placeholder="Überschrift" />
          <T as="p" path={["text"]} value={text} multiline className="mt-5 max-w-[380px] text-[15px] leading-[1.55] text-(--mut)" placeholder="Kurzer Einleitungstext" />
        </div>
        <div>
          <div className="space-y-3">
            {items.map((item, i) => (
              <details key={i} open={!!edit || i === 0} className={cn(panel, "group/item group/faq relative px-6")}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[16.5px] font-extrabold [&::-webkit-details-marker]:hidden">
                  <T path={["items", i, "q"]} value={item.q} placeholder="Frage" />
                  <span className={cn(circle, "size-9 group-open/faq:border-(--p) group-open/faq:bg-(--p) group-open/faq:text-(--p-on)")} aria-hidden="true">
                    <Plus className="size-4 transition-transform duration-200 group-open/faq:rotate-45" strokeWidth={2.4} />
                  </span>
                </summary>
                <T as="p" path={["items", i, "a"]} value={item.a} multiline className="max-w-[580px] pb-6 text-[15px] leading-[1.6] text-(--mut)" placeholder="Antwort" />
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

// ---------- call to action ----------
function Cta({ block }: { block: CtaBlock }) {
  const { eyebrow, title, text, button } = block.props;
  return (
    <section className="bg-(--bg) py-6 @4xl:py-8">
      <div className={wrap}>
        <div className="d-rise relative isolate flex flex-col gap-7 overflow-hidden rounded-(--r) bg-(--p) px-7 py-10 text-(--p-on) @4xl:flex-row @4xl:items-center @4xl:justify-between @4xl:px-12 @4xl:py-12">
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-25"
            style={{ backgroundImage: "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)", backgroundSize: "88px 88px" }}
            aria-hidden="true"
          />
          <div>
            <T path={["eyebrow"]} value={eyebrow} className={cn(label, "mb-3 block opacity-85")} placeholder="Kurzzeile" />
            <T as="h2" path={["title"]} value={title} multiline className={h2} placeholder="Aufforderung" />
            <T as="p" path={["text"]} value={text} multiline className="mt-4 max-w-[540px] text-[15.5px] leading-[1.55] opacity-90" placeholder="Text" />
          </div>
          <a href="#contact" className="inline-flex h-14 shrink-0 items-center justify-center gap-2.5 self-start rounded-(--r-sm) bg-(--dk) px-8 text-[14.5px] font-bold text-(--dk-on) transition-transform duration-200 hover:-translate-y-px @4xl:self-center">
            <T path={["button"]} value={button} placeholder="Button" />
            <ArrowRight className="size-[18px]" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

// ---------- contact: request a quote ----------
function Contact({ block, doc }: { block: ContactBlock; doc: DemoDoc }) {
  const edit = useEdit();
  const { eyebrow, title, text, hours, form, image } = block.props;
  const { meta } = doc;
  const input = "h-12 w-full rounded-(--r-sm) border border-(--line) bg-(--bg) px-4 text-[14.5px] text-(--fg) outline-none transition-colors placeholder:text-(--mut)/70 focus:border-(--p) focus:bg-(--card)";
  const fieldLabel = "mb-1.5 block text-[12.5px] font-bold";
  const dot = "flex size-9 shrink-0 items-center justify-center rounded-full bg-(--p)/12 text-(--p)";
  const services = doc.blocks.find((b) => b.type === "services");
  const kinds = services?.type === "services" ? services.props.items.map((i) => i.title) : [];
  return (
    <section id="contact" className="relative isolate overflow-hidden bg-(--bg2) py-14 @4xl:py-20">
      {(image || edit) && (
        <Img
          src={image}
          path={["image"]}
          alt=""
          chip="br"
          className="absolute inset-y-0 right-0 -z-10 hidden w-[30%] bg-transparent [mask-image:linear-gradient(to_right,transparent,#000_70%)] @6xl:block"
          imgClassName={image ? undefined : "hidden"}
        />
      )}
      <div className={cn(wrap, "pointer-events-none grid gap-10 @5xl:grid-cols-[1fr_1fr] @5xl:items-center @5xl:gap-14 @7xl:grid-cols-[1fr_0.86fr_0.2fr] [&>*]:pointer-events-auto")}>
        <div className="d-rise">
          <Eyebrow value={eyebrow} />
          <T as="h2" path={["title"]} value={title} multiline className={cn(display, "text-[32px] leading-[1.04] @2xl:text-[46px] @2xl:leading-[1.02] @5xl:text-[58px] @5xl:leading-[1]")} placeholder="Überschrift" />
          <T as="p" path={["text"]} value={text} multiline className="mt-5 max-w-[460px] text-[15.5px] leading-[1.55] text-(--fg)/80" placeholder="Kurzer Einleitungstext" />
          <ul className="mt-8 space-y-4 text-[15px]">
            <li className="flex items-center gap-3.5">
              <span className={dot}>
                <Phone className="size-4" strokeWidth={2.2} aria-hidden="true" />
              </span>
              <T meta="phone" value={meta.phone} className="font-bold" placeholder="Telefon" />
            </li>
            <li className="flex items-center gap-3.5">
              <span className={dot}>
                <Mail className="size-4" strokeWidth={2.2} aria-hidden="true" />
              </span>
              <T meta="email" value={meta.email} className="font-bold" placeholder="E-Mail" />
            </li>
            <li className="flex items-center gap-3.5">
              <span className={dot}>
                <MapPin className="size-4" strokeWidth={2.2} aria-hidden="true" />
              </span>
              <span>
                <T meta="address" value={meta.address} className="font-bold" placeholder="Straße und Hausnummer" />
                <span aria-hidden="true">, </span>
                <T meta="city" value={meta.city} className="text-(--mut)" placeholder="PLZ Ort" />
              </span>
            </li>
            <li className="flex items-start gap-3.5">
              <span className={dot}>
                <Clock className="size-4" strokeWidth={2.2} aria-hidden="true" />
              </span>
              <span className="w-full max-w-[310px] pt-1.5">
                {hours.map((h, i) => (
                  <span key={i} className="group/item relative flex justify-between gap-6 py-0.5 text-[14.5px]">
                    <T path={["hours", i, "day"]} value={h.day} className="text-(--mut)" placeholder="Tag" />
                    <T path={["hours", i, "time"]} value={h.time} className="font-bold" placeholder="Zeit" />
                    <ItemTools path={["hours"]} index={i} count={hours.length} />
                  </span>
                ))}
                <AddItem path={["hours"]} item={{ day: "Tag", time: "07–17 Uhr" }} label="Zeile" className="mt-2" />
              </span>
            </li>
          </ul>
        </div>

        {form && (
          <form className="d-rise rounded-(--r) bg-(--card) p-6 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.35)] @2xl:p-8" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-4 @2xl:grid-cols-2">
              <label>
                <span className={fieldLabel}>Name *</span>
                <input className={input} placeholder="Ihr Name" />
              </label>
              <label>
                <span className={fieldLabel}>Telefon *</span>
                <input className={input} placeholder="Ihre Telefonnummer" />
              </label>
              <label>
                <span className={fieldLabel}>E-Mail *</span>
                <input className={input} placeholder="Ihre E-Mail-Adresse" />
              </label>
              <label className="relative">
                <span className={fieldLabel}>Projektart *</span>
                <select className={cn(input, "appearance-none pr-10")} defaultValue="">
                  <option value="" disabled>
                    Bitte auswählen
                  </option>
                  {kinds.map((kind, i) => (
                    <option key={i}>{kind}</option>
                  ))}
                  <option>Etwas anderes</option>
                </select>
                <ChevronDown className="pointer-events-none absolute bottom-4 right-4 size-4 text-(--mut)" aria-hidden="true" />
              </label>
            </div>
            <label className="mt-4 block">
              <span className={fieldLabel}>Ihre Nachricht (optional)</span>
              <textarea className={cn(input, "h-28 resize-none py-3")} placeholder="Beschreiben Sie kurz Ihr Vorhaben …" />
            </label>
            <button type="submit" className={cn(solid, "mt-5 w-full")}>
              Angebot jetzt anfragen
              <ArrowRight className="size-[18px]" aria-hidden="true" />
            </button>
            <p className="mt-4 flex items-center gap-2 text-[12.5px] text-(--mut)">
              <Lock className="size-3.5 text-(--p)" strokeWidth={2.2} aria-hidden="true" />
              Ihre Daten werden vertraulich behandelt.
            </p>
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
  const offers = services?.type === "services" ? services.props.items.map((i) => i.title) : [];
  const heading = "mb-4 block text-[14.5px] font-extrabold";
  const list = "space-y-2.5 text-[13.5px] opacity-75";
  return (
    <footer className="bg-(--dk) pb-8 pt-14 text-(--dk-on)">
      <div className={cn(wrap, "grid gap-10 @2xl:grid-cols-2 @5xl:grid-cols-[1.35fr_1fr_1fr_1.25fr]")}>
        <div>
          <span className="flex items-stretch gap-2.5">
            <span className="w-[7px] shrink-0 rounded-[2px] bg-(--p)" aria-hidden="true" />
            <span>
              <T meta="company" value={meta.company} className={cn(display, "block text-[25px] leading-[1]")} placeholder="Firmenname" />
              <T meta="industry" value={meta.industry} className="mt-1 block text-[10.5px] font-semibold uppercase leading-none tracking-[0.36em] opacity-80" placeholder="Branche" />
            </span>
          </span>
          <T as="p" path={["text"]} value={text} multiline className="mt-5 max-w-[250px] text-[13.5px] leading-[1.55] opacity-70" placeholder="Kurzer Satz" />
        </div>
        <div>
          <span className={heading}>Schnellzugriff</span>
          <ul className={list}>
            {navLinks(doc).map((link, i) => (
              <li key={i}>{link}</li>
            ))}
          </ul>
        </div>
        <div>
          <span className={heading}>Leistungen</span>
          <ul className={list}>
            {offers.map((offer, i) => (
              <li key={i}>{offer}</li>
            ))}
          </ul>
        </div>
        <div>
          <span className={heading}>Kontakt</span>
          <ul className="space-y-3.5 text-[13.5px]">
            <li className="flex items-center gap-3">
              <Phone className="size-[18px] shrink-0 text-(--p)" strokeWidth={2} aria-hidden="true" />
              <span className="font-bold">{meta.phone}</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="size-[18px] shrink-0 text-(--p)" strokeWidth={2} aria-hidden="true" />
              <span className="opacity-80">{meta.email}</span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-[18px] shrink-0 text-(--p)" strokeWidth={2} aria-hidden="true" />
              <span className="opacity-80">
                {meta.address}
                <br />
                {meta.city}
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className={cn(wrap, "mt-12")}>
        <div className="flex flex-col gap-3 border-t border-white/12 pt-6 text-[12.5px] opacity-65 @2xl:flex-row @2xl:items-center @2xl:justify-between">
          <p>
            © {new Date().getFullYear()} {meta.company}. Alle Rechte vorbehalten.
          </p>
          <nav className="flex flex-wrap gap-x-7 gap-y-1.5">
            {links.map((link, i) => (
              <T key={i} path={["links", i]} value={link} placeholder="Link" />
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default function WerkBlock({ block, doc }: SkinProps) {
  switch (block.type) {
    case "nav":
      return <Nav block={block} doc={doc} />;
    case "hero":
      return <Hero block={block} />;
    case "stats":
      return <Stats block={block} doc={doc} />;
    case "services":
      return <Services block={block} />;
    case "about":
      return <About block={block} />;
    case "steps":
      return <Steps block={block} />;
    case "quotes":
      return <Quotes block={block} />;
    case "gallery":
      return <Gallery block={block} />;
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
