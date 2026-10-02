import { ArrowRight, CalendarDays, Car, ChevronDown, Clock, FileText, LifeBuoy, Mail, MapPin, Menu, Phone, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { renderBase, type SkinProps } from "../blocks";
import { AddItem, Img, ItemTools, T, imageUrl, useEdit } from "../edit";
import { icons } from "../icons";
import type { CardsBlock, ContactBlock, CtaBlock, DemoDoc, FaqBlock, FooterBlock, HeroBlock, NavBlock, QuotesBlock, ServicesBlock, StatsBlock, StepsBlock } from "../types";
import { IconPick, Initials, Stars, navLinks, wrap } from "./kit";

// "Noir": cinematic dark theme with a poster typeface and one loud accent colour.

// (line height comes after the size: a font-size utility would otherwise reset it)
const display = "[font-family:var(--fh)] uppercase tracking-[0.01em]";
const h2 = cn(display, "text-[40px] leading-[1] @2xl:text-[54px] @2xl:leading-[1] @5xl:text-[64px] @5xl:leading-[1]");
const label = "text-[11.5px] font-semibold uppercase tracking-[0.16em]";
const solid = "inline-flex h-12 items-center justify-center gap-3 rounded-(--r-sm) bg-(--p) px-6 text-[12.5px] font-bold uppercase tracking-[0.1em] text-(--p-on) transition-[filter,translate] duration-200 hover:-translate-y-px hover:brightness-110";
const outline = "inline-flex h-12 items-center justify-center gap-3 rounded-(--r-sm) border border-(--fg)/25 px-6 text-[12.5px] font-bold uppercase tracking-[0.1em] text-(--fg) transition-colors duration-200 hover:border-(--p) hover:text-(--p)";
const panel = "rounded-(--r) border border-(--line) bg-(--card)";
const Dot = () => (
  <span className="text-(--p)" aria-hidden="true">
    .
  </span>
);

function Eyebrow({ value, className }: { value: string | undefined; className?: string }) {
  const edit = useEdit();
  if (!value && !edit) return null;
  return (
    <span className={cn("mb-4 flex items-center gap-3.5", className)}>
      <span className="h-[2px] w-8 bg-(--p)" aria-hidden="true" />
      <T path={["eyebrow"]} value={value} className={cn(label, "opacity-80")} placeholder="Kurzzeile" />
    </span>
  );
}

function Head({ eyebrow, title, text, children }: { eyebrow: string | undefined; title: string; text?: string; children?: ReactNode }) {
  return (
    <div className="d-rise flex flex-col gap-6 @4xl:flex-row @4xl:items-end @4xl:justify-between @4xl:gap-12">
      <div>
        <Eyebrow value={eyebrow} />
        <h2 className={h2}>
          <T path={["title"]} value={title} multiline placeholder="Überschrift" />
          <Dot />
        </h2>
      </div>
      <div className="flex flex-col items-start gap-5 @4xl:max-w-[340px] @4xl:pb-1.5">
        {text !== undefined && <T as="p" path={["text"]} value={text} multiline className="text-[15px] leading-[1.6] text-(--mut)" placeholder="Kurzer Einleitungstext" />}
        {children}
      </div>
    </div>
  );
}

function HeadButton({ value }: { value: string | undefined }) {
  const edit = useEdit();
  if (!value && !edit) return null;
  return (
    <a href="#contact" className={outline}>
      <T path={["button"]} value={value} placeholder="Button" />
      <ArrowRight className="size-4" aria-hidden="true" />
    </a>
  );
}

const section = "border-t border-(--line) bg-(--bg) py-16 @4xl:py-24";

// ---------- nav: lies on top of the hero image ----------
function Nav({ block, doc }: { block: NavBlock; doc: DemoDoc }) {
  const { links, cta } = block.props;
  return (
    <header className="absolute inset-x-0 top-0 z-30 bg-gradient-to-b from-black/70 to-transparent text-[#F1F3EE]">
      <div className={cn(wrap, "flex h-[84px] items-center justify-between gap-6")}>
        {doc.theme.logo ? (
          <img src={imageUrl(doc.theme.logo)} alt={doc.meta.company} className="h-9 w-auto max-w-[180px] object-contain" />
        ) : (
          <T meta="company" value={doc.meta.company} className={cn("line-clamp-2 min-w-0 font-extrabold uppercase tracking-[0.02em]", doc.meta.company.length > 16 ? "text-[13px] leading-[1.2] @2xl:text-[17px] @2xl:leading-[1.2]" : "text-[19px] leading-[1.15] @2xl:text-[21px] @2xl:leading-[1.15]")} placeholder="Firmenname" />
        )}
        <nav className="hidden shrink-0 items-center gap-9 @5xl:flex">
          {links.map((link, i) => (
            <T key={i} path={["links", i]} value={link} className={cn(label, "text-white/80 transition-colors hover:text-(--p)")} placeholder="Link" />
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-3">
          <a href="#contact" className={cn(solid, "h-11 whitespace-nowrap px-4 @2xl:px-5")}>
            <T path={["cta"]} value={cta} placeholder="Button" />
            <ArrowRight className="hidden size-4 @2xl:block" aria-hidden="true" />
          </a>
          <span className="flex size-11 items-center justify-center rounded-(--r-sm) border border-white/20 @5xl:hidden" aria-hidden="true">
            <Menu className="size-5" />
          </span>
        </div>
      </div>
    </header>
  );
}

// ---------- hero ----------
const pointIcons = ["gem", "pin", "shield", "clock"];
function PointIcon({ index }: { index: number }) {
  const Icon = icons[pointIcons[index % pointIcons.length]];
  return <Icon className="size-6 shrink-0 text-(--p)" strokeWidth={1.5} aria-hidden="true" />;
}
const field = "h-6 w-full bg-transparent text-[13.5px] text-white/90 outline-none [color-scheme:dark] placeholder:text-white/45";

function Hero({ block }: { block: HeroBlock }) {
  const edit = useEdit();
  const p = block.props;
  return (
    <section id="top" className="relative isolate overflow-hidden bg-[#070808] text-[#F1F3EE]">
      <Img src={p.image} path={["image"]} alt="" eager chip="br" className="absolute inset-0 -z-20 h-full w-full bg-transparent" imgClassName="object-[72%_center] @5xl:object-center" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-[#070808] via-[#070808]/70 to-transparent @5xl:via-[#070808]/35" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-(--bg) to-transparent" />

      <div className={cn(wrap, "pb-10 pt-[128px] @4xl:pb-14 @4xl:pt-[150px]")}>
        <div className="max-w-[660px]">
          <span className="mb-5 flex items-center gap-3.5">
            <span className="h-[2px] w-8 bg-(--p)" aria-hidden="true" />
            <T path={["eyebrow"]} value={p.eyebrow} className={cn(label, "text-white/75")} placeholder="Kurzzeile" />
          </span>
          <h1 className={cn(display, "text-[54px] leading-[1] text-[#E9EBE6] @2xl:text-[76px] @2xl:leading-[0.98] @5xl:text-[94px] @5xl:leading-[0.98]")}>
            <T path={["title"]} value={p.title} multiline placeholder="Hauptüberschrift" />
            <Dot />
          </h1>
          <T as="p" path={["text"]} value={p.text} multiline className="mt-6 max-w-[430px] text-[15.5px] leading-[1.6] text-white/75" placeholder="Worum geht es?" />
          <ul className="mt-7 flex flex-wrap gap-x-7 gap-y-4">
            {p.points.map((point, i) => (
              <li key={i} className="group/item relative flex items-center gap-3 border-white/15 text-[13.5px] font-medium text-white/90 @2xl:[&:not(:first-child)]:border-l @2xl:[&:not(:first-child)]:pl-7">
                <PointIcon index={i} />
                <T path={["points", i]} value={point} placeholder="Vorteil" />
                <ItemTools path={["points"]} index={i} count={p.points.length} />
              </li>
            ))}
            <li>
              <AddItem path={["points"]} item="Neuer Vorteil" label="Vorteil" />
            </li>
          </ul>
        </div>

        {(p.note || edit) && (
          <div className="absolute right-[max(2rem,calc((100%-1200px)/2+2rem))] top-[150px] hidden max-w-[150px] border-b-2 border-(--p) pb-3 @6xl:block">
            <T path={["note"]} value={p.note} multiline className={cn(label, "block leading-[1.7] text-white/85")} placeholder="Notiz" />
          </div>
        )}

        {/* booking bar */}
        <form onSubmit={(e) => e.preventDefault()} className="mt-10 grid gap-2.5 rounded-(--r) border border-white/15 bg-white/[0.06] p-2.5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl @4xl:mt-14 @4xl:grid-cols-[1fr_1fr_1fr_auto]">
          {[
            { icon: MapPin, title: "Abholort", input: <input className={field} placeholder="Stadt oder Flughafen" aria-label="Abholort" /> },
            { icon: CalendarDays, title: "Abholdatum", input: <input type="date" className={field} aria-label="Abholdatum" /> },
            { icon: CalendarDays, title: "Rückgabe", input: <input type="date" className={field} aria-label="Rückgabe" /> },
          ].map(({ icon: Icon, title, input }) => (
            <label key={title} className="flex items-center gap-3.5 rounded-(--r-sm) bg-black/35 px-4 py-3 transition-colors focus-within:bg-black/55">
              <Icon className="size-5 shrink-0 text-white/80" strokeWidth={1.6} aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block text-[12px] font-bold text-white">{title}</span>
                {input}
              </span>
            </label>
          ))}
          <button type="submit" className={cn(solid, "h-auto min-h-[58px] px-8")}>
            <T path={["primary"]} value={p.primary} placeholder="Button" />
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </form>
      </div>
    </section>
  );
}

// ---------- stats ----------
function Stats({ block }: { block: StatsBlock }) {
  const { items } = block.props;
  return (
    <section className="bg-(--bg) pb-12 pt-2 @4xl:pb-16">
      <div className={cn(wrap, "grid grid-cols-2 gap-y-9 @4xl:flex")}>
        {items.map((item, i) => (
          <div key={i} className="d-rise group/item relative border-(--line) @4xl:flex-1 @4xl:px-12 @4xl:[&:not(:first-child)]:border-l">
            <T path={["items", i, "value"]} value={item.value} className="block text-[38px] font-bold leading-none tracking-[-0.02em] @2xl:text-[46px]" placeholder="100" />
            <T path={["items", i, "label"]} value={item.label} className={cn(label, "mt-3 block max-w-[150px] leading-[1.5] text-(--mut)")} placeholder="Bezeichnung" />
            <ItemTools path={["items"]} index={i} count={items.length} />
          </div>
        ))}
      </div>
      <div className={cn(wrap, "mt-4 empty:hidden")}>
        <AddItem path={["items"]} item={{ value: "100", label: "Bezeichnung" }} label="Kennzahl" />
      </div>
    </section>
  );
}

// ---------- cards: the fleet ----------
function Cards({ block }: { block: CardsBlock }) {
  const { eyebrow, title, text, button, items } = block.props;
  return (
    <section id="offers" className={section}>
      <div className={wrap}>
        <Head eyebrow={eyebrow} title={title} text={text}>
          <HeadButton value={button} />
        </Head>
        <div className="mt-10 grid gap-4 @2xl:grid-cols-2 @5xl:grid-cols-3">
          {items.map((item, i) => (
            <article key={i} className={cn(panel, "d-rise group/item relative overflow-hidden transition-[border-color,translate] duration-300 hover:-translate-y-1 hover:border-(--p)/50")}>
              <div className="relative">
                <Img src={item.image} path={["items", i, "image"]} alt={item.title} className="aspect-[16/11] w-full" imgClassName="transition-transform duration-700 group-hover/item:scale-105" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-(--card) to-transparent" />
                <T path={["items", i, "tag"]} value={item.tag} className={cn(label, "absolute left-3.5 top-3.5 rounded-md border border-white/25 bg-black/55 px-2.5 py-1.5 text-[10.5px] text-white backdrop-blur")} placeholder="Kategorie" />
              </div>
              <div className="p-5 pt-3">
                <T as="h3" path={["items", i, "title"]} value={item.title} className="block text-[19px] font-bold tracking-[-0.01em]" placeholder="Titel" />
                <T path={["items", i, "price"]} value={item.price} className="mt-1.5 block text-[21px] font-bold text-(--fg)" placeholder="Preis" />
                <T as="p" path={["items", i, "text"]} value={item.text} className="mt-4 border-t border-(--line) pt-4 text-[13.5px] text-(--mut)" placeholder="Beschreibung" />
                <a href="#contact" className={cn(outline, "mt-5 h-11 w-full justify-between px-4 text-[11.5px]")}>
                  Zum Fahrzeug
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              </div>
              <ItemTools path={["items"]} index={i} count={items.length} />
            </article>
          ))}
        </div>
        <div className="mt-5 empty:hidden">
          <AddItem path={["items"]} item={{ image: "", title: "Neues Fahrzeug", text: "Automatik · 5 Sitze", price: "ab 0 € / Tag", tag: "Neu" }} label="Fahrzeug" />
        </div>
      </div>
    </section>
  );
}

// ---------- services: bento of photo tiles and icon cards ----------
function Services({ block }: { block: ServicesBlock }) {
  const { eyebrow, title, text, button, items } = block.props;
  const tiles = items.map((item, i) => (item.image !== undefined ? i : -1)).filter((i) => i >= 0);
  return (
    <section id="services" className={section}>
      <div className={wrap}>
        <Head eyebrow={eyebrow} title={title} text={text}>
          <HeadButton value={button} />
        </Head>
        <div className="mt-10 grid grid-cols-2 gap-3 @5xl:grid-flow-dense @5xl:grid-cols-4 @5xl:gap-4">
          {items.map((item, i) =>
            item.image !== undefined ? (
              <article
                key={i}
                className={cn(
                  "d-rise group/item relative col-span-2 flex min-h-[280px] items-end overflow-hidden rounded-(--r) border border-(--line) @5xl:col-span-1 @5xl:row-span-2 @5xl:min-h-[400px]",
                  i === tiles[0] && "@5xl:col-start-1 @5xl:row-start-1",
                  i === tiles[1] && "@5xl:col-start-4 @5xl:row-start-1",
                )}
              >
                <Img src={item.image} path={["items", i, "image"]} alt="" chip="tl" className="absolute inset-0 h-full w-full" imgClassName="transition-transform duration-700 group-hover/item:scale-105" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                <div className="relative flex w-full items-end justify-between gap-4 p-6 text-white">
                  <div>
                    <T as="h3" path={["items", i, "title"]} value={item.title} multiline className="block max-w-[200px] text-[21px] font-bold leading-[1.15]" placeholder="Titel" />
                    <T as="p" path={["items", i, "text"]} value={item.text} multiline className="mt-2.5 max-w-[210px] text-[13.5px] leading-[1.5] text-white/75" placeholder="Beschreibung" />
                  </div>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/30 transition-colors group-hover/item:border-(--p) group-hover/item:bg-(--p) group-hover/item:text-(--p-on)" aria-hidden="true">
                    <ArrowRight className="size-4" />
                  </span>
                </div>
                <ItemTools path={["items"]} index={i} count={items.length} />
              </article>
            ) : (
              <article key={i} className={cn(panel, "d-rise group/item relative p-5 transition-colors duration-300 hover:border-(--p)/50 @2xl:p-6")}>
                <IconPick name={item.icon} path={["items", i, "icon"]} className="rounded-md text-(--p)" iconClassName="size-8" strokeWidth={1.4} />
                <T as="h3" path={["items", i, "title"]} value={item.title} className="mt-5 block text-[16.5px] font-bold leading-[1.2]" placeholder="Leistung" />
                <T as="p" path={["items", i, "text"]} value={item.text} multiline className="mt-2 text-[13.5px] leading-[1.5] text-(--mut)" placeholder="Beschreibung" />
                <ItemTools path={["items"]} index={i} count={items.length} />
              </article>
            ),
          )}
        </div>
        <div className="mt-5 empty:hidden">
          <AddItem path={["items"]} item={{ icon: "star", title: "Neuer Vorteil", text: "Kurze Beschreibung." }} label="Vorteil" />
        </div>
      </div>
    </section>
  );
}

// ---------- steps ----------
const stepIcons = [Car, FileText, LifeBuoy, Clock];

function Steps({ block }: { block: StepsBlock }) {
  const { eyebrow, title, text, items } = block.props;
  return (
    <section id="steps" className={section}>
      <div className={wrap}>
        <Head eyebrow={eyebrow} title={title} text={text} />
        <ol className={cn("mt-10 grid gap-4", items.length >= 4 ? "@2xl:grid-cols-2 @6xl:grid-cols-4" : "@4xl:grid-cols-3")}>
          {items.map((item, i) => {
            const Icon = stepIcons[i % stepIcons.length];
            return (
              <li key={i} className={cn(panel, "d-rise group/item relative flex items-start gap-4 p-5")}>
                <span className={cn(display, "flex size-12 shrink-0 items-center justify-center rounded-(--r-sm) border border-(--fg)/25 text-[22px] leading-none")}>{String(i + 1).padStart(2, "0")}</span>
                <div className="min-w-0 flex-1">
                  <T as="h3" path={["items", i, "title"]} value={item.title} className="block text-[16.5px] font-bold" placeholder="Schritt" />
                  <T as="p" path={["items", i, "text"]} value={item.text} multiline className="mt-1.5 text-[13.5px] leading-[1.5] text-(--mut)" placeholder="Beschreibung" />
                </div>
                <Icon className="hidden size-9 shrink-0 text-(--fg)/35 @2xl:block" strokeWidth={1.1} aria-hidden="true" />
                <ItemTools path={["items"]} index={i} count={items.length} />
              </li>
            );
          })}
        </ol>
        <div className="mt-5 empty:hidden">
          <AddItem path={["items"]} item={{ title: "Neuer Schritt", text: "Beschreibung." }} label="Schritt" />
        </div>
      </div>
    </section>
  );
}

// ---------- quotes ----------
function Quotes({ block }: { block: QuotesBlock }) {
  const edit = useEdit();
  const { eyebrow, title, text, items } = block.props;
  return (
    <section id="quotes" className={section}>
      <div className={wrap}>
        <div className="d-rise flex flex-col gap-6 @4xl:flex-row @4xl:items-end @4xl:justify-between">
          <div>
            <Eyebrow value={eyebrow} />
            <h2 className={h2}>
              <T path={["title"]} value={title} multiline placeholder="Überschrift" />
              <Dot />
            </h2>
          </div>
          {(text || edit) && (
            <div className="@4xl:pb-2 @4xl:text-right">
              <Stars className="text-[22px] text-(--p)" />
              <T as="p" path={["text"]} value={text} className="mt-2 text-[13.5px] text-(--mut)" placeholder="z. B. 5,0 bei Google" />
            </div>
          )}
        </div>
        <div className="mt-10 grid gap-4 @4xl:grid-cols-3">
          {items.map((item, i) => (
            <figure key={i} className={cn(panel, "d-rise group/item relative flex gap-4 p-5 @2xl:p-6")}>
              <Initials name={item.name} className="size-12 bg-(--fg)/10 text-[14px]" />
              <div className="min-w-0">
                <Stars className="text-[14px] text-(--p)" />
                <T as="blockquote" path={["items", i, "quote"]} value={item.quote} multiline className="mt-2.5 text-[14.5px] leading-[1.55] text-(--fg)/90" placeholder="Zitat" />
                <figcaption className="mt-4 text-[13px] text-(--mut)">
                  <T path={["items", i, "name"]} value={item.name} className="font-semibold text-(--fg)" placeholder="Name" />
                  <span aria-hidden="true"> · </span>
                  <T path={["items", i, "role"]} value={item.role} placeholder="Rolle" />
                </figcaption>
              </div>
              <ItemTools path={["items"]} index={i} count={items.length} />
            </figure>
          ))}
        </div>
        <div className="mt-5 empty:hidden">
          <AddItem path={["items"]} item={{ quote: "Hier steht eine Kundenstimme.", name: "Vorname N.", role: "Kunde" }} label="Stimme" />
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
      <div className={cn(wrap, "grid gap-10 @5xl:grid-cols-[0.9fr_1.1fr] @5xl:gap-16")}>
        <div className="d-rise">
          <Eyebrow value={eyebrow} />
          <h2 className={h2}>
            <T path={["title"]} value={title} multiline placeholder="Überschrift" />
            <Dot />
          </h2>
          <T as="p" path={["text"]} value={text} multiline className="mt-5 max-w-[380px] text-[15px] leading-[1.6] text-(--mut)" placeholder="Kurzer Einleitungstext" />
        </div>
        <div>
          <div className="border-t border-(--line)">
            {items.map((item, i) => (
              <details key={i} open={!!edit || i === 0} className="group/item group/faq relative border-b border-(--line)">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[16.5px] font-bold [&::-webkit-details-marker]:hidden">
                  <T path={["items", i, "q"]} value={item.q} placeholder="Frage" />
                  <Plus className="size-5 shrink-0 text-(--p) transition-transform duration-200 group-open/faq:rotate-45" aria-hidden="true" />
                </summary>
                <T as="p" path={["items", i, "a"]} value={item.a} multiline className="max-w-[560px] pb-6 text-[15px] leading-[1.6] text-(--mut)" placeholder="Antwort" />
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

// ---------- call to action: wide photo band ----------
function Cta({ block }: { block: CtaBlock }) {
  const { eyebrow, title, text, button, image } = block.props;
  return (
    <section className="relative isolate overflow-hidden border-t border-(--line) bg-[#070808] text-[#F1F3EE]">
      <Img src={image} path={["image"]} alt="" chip="tr" className="absolute inset-0 -z-20 h-full w-full bg-transparent" imgClassName="object-[center_62%]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-[#070808] via-[#070808]/75 to-[#070808]/20" />
      <div className={cn(wrap, "d-rise flex flex-col gap-8 py-16 @4xl:flex-row @4xl:items-center @4xl:justify-between @4xl:py-20")}>
        <div>
          <Eyebrow value={eyebrow} />
          <h2 className={h2}>
            <T path={["title"]} value={title} multiline placeholder="Aufforderung" />
            <Dot />
          </h2>
          <T as="p" path={["text"]} value={text} multiline className="mt-4 max-w-[520px] text-[15.5px] leading-[1.6] text-white/80" placeholder="Text" />
        </div>
        <a href="#contact" className={cn(solid, "h-14 shrink-0 self-start px-9 @4xl:self-center")}>
          <T path={["button"]} value={button} placeholder="Button" />
          <ArrowRight className="size-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

// ---------- contact ----------
function Contact({ block, doc }: { block: ContactBlock; doc: DemoDoc }) {
  const { eyebrow, title, text, hours, form } = block.props;
  const { meta } = doc;
  const input = "h-12 w-full rounded-(--r-sm) border border-(--line) bg-(--bg) px-4 text-[14.5px] text-(--fg) outline-none transition-colors placeholder:text-(--mut) focus:border-(--p)";
  const row = "flex items-start gap-4";
  return (
    <section id="contact" className={section}>
      <div className={cn(wrap, "grid gap-12 @5xl:grid-cols-2 @5xl:gap-16")}>
        <div className="d-rise">
          <Eyebrow value={eyebrow} />
          <h2 className={h2}>
            <T path={["title"]} value={title} multiline placeholder="Überschrift" />
            <Dot />
          </h2>
          <T as="p" path={["text"]} value={text} multiline className="mt-5 max-w-[420px] text-[15px] leading-[1.6] text-(--mut)" placeholder="Kurzer Einleitungstext" />
          <ul className="mt-9 space-y-6 text-[15px]">
            <li className={row}>
              <MapPin className="mt-0.5 size-5 shrink-0 text-(--p)" strokeWidth={1.7} aria-hidden="true" />
              <span>
                <T meta="address" value={meta.address} className="block font-semibold" placeholder="Straße und Hausnummer" />
                <T meta="city" value={meta.city} className="block text-(--mut)" placeholder="PLZ Ort" />
              </span>
            </li>
            <li className={row}>
              <Phone className="mt-0.5 size-5 shrink-0 text-(--p)" strokeWidth={1.7} aria-hidden="true" />
              <T meta="phone" value={meta.phone} className="font-semibold" placeholder="Telefon" />
            </li>
            <li className={row}>
              <Mail className="mt-0.5 size-5 shrink-0 text-(--p)" strokeWidth={1.7} aria-hidden="true" />
              <T meta="email" value={meta.email} className="font-semibold" placeholder="E-Mail" />
            </li>
            <li className={row}>
              <Clock className="mt-0.5 size-5 shrink-0 text-(--p)" strokeWidth={1.7} aria-hidden="true" />
              <span className="w-full max-w-[320px]">
                {hours.map((h, i) => (
                  <span key={i} className="group/item relative flex justify-between gap-6 py-0.5">
                    <T path={["hours", i, "day"]} value={h.day} className="text-(--mut)" placeholder="Tag" />
                    <T path={["hours", i, "time"]} value={h.time} className="font-semibold" placeholder="Zeit" />
                    <ItemTools path={["hours"]} index={i} count={hours.length} />
                  </span>
                ))}
                <AddItem path={["hours"]} item={{ day: "Tag", time: "09–18 Uhr" }} label="Zeile" className="mt-2" />
              </span>
            </li>
          </ul>
        </div>
        {form && (
          <form className={cn(panel, "d-rise space-y-3 self-start p-6 @2xl:p-8")} onSubmit={(e) => e.preventDefault()}>
            <p className={cn(label, "mb-5 text-(--mut)")}>Anfrage senden</p>
            <div className="grid gap-3 @2xl:grid-cols-2">
              <input className={input} placeholder="Name" aria-label="Name" />
              <input className={input} placeholder="Telefon" aria-label="Telefon" />
            </div>
            <input className={input} placeholder="E-Mail" aria-label="E-Mail" />
            <div className="relative">
              <select className={cn(input, "appearance-none")} aria-label="Fahrzeugklasse" defaultValue="">
                <option value="" disabled>
                  Fahrzeugklasse
                </option>
                <option>Kompakt</option>
                <option>Limousine</option>
                <option>SUV</option>
                <option>Sportwagen</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-(--mut)" aria-hidden="true" />
            </div>
            <textarea className={cn(input, "h-28 resize-none py-3")} placeholder="Zeitraum und Wünsche" aria-label="Nachricht" />
            <button type="submit" className={cn(solid, "w-full")}>
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
  const heading = cn(label, "mb-4 block text-(--dk-on)");
  return (
    <footer className="border-t border-(--line) bg-(--dk) py-14 text-(--dk-on)">
      <div className={cn(wrap, "grid gap-10 @4xl:grid-cols-[1.4fr_1fr_1fr_1.2fr]")}>
        <div>
          <T meta="company" value={meta.company} className="block text-[21px] font-extrabold uppercase tracking-[0.02em]" placeholder="Firmenname" />
          <T as="p" path={["text"]} value={text} multiline className="mt-3 max-w-[260px] text-[13.5px] leading-[1.6] opacity-65" placeholder="Kurzer Satz" />
        </div>
        <div>
          <span className={heading}>Schnellzugang</span>
          <ul className="space-y-2.5 text-[13.5px] opacity-70">
            {navLinks(doc).map((link, i) => (
              <li key={i}>{link}</li>
            ))}
          </ul>
        </div>
        <div>
          <span className={heading}>Rechtliches</span>
          <ul className="space-y-2.5 text-[13.5px] opacity-70">
            {links.map((link, i) => (
              <li key={i}>
                <T path={["links", i]} value={link} placeholder="Link" />
              </li>
            ))}
          </ul>
        </div>
        <div>
          <span className={heading}>Kontakt</span>
          <ul className="space-y-2.5 text-[13.5px] opacity-70">
            <li>{meta.address}</li>
            <li>{meta.city}</li>
            <li>{meta.phone}</li>
            <li>{meta.email}</li>
          </ul>
        </div>
      </div>
      <p className={cn(wrap, "mt-12 border-t border-white/10 pt-6 text-[12.5px] opacity-55")}>
        © {new Date().getFullYear()} {meta.company}. Alle Rechte vorbehalten.
      </p>
    </footer>
  );
}

export default function NoirBlock({ block, doc }: SkinProps) {
  switch (block.type) {
    case "nav":
      return <Nav block={block} doc={doc} />;
    case "hero":
      return <Hero block={block} />;
    case "stats":
      return <Stats block={block} />;
    case "cards":
      return <Cards block={block} />;
    case "services":
      return <Services block={block} />;
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
