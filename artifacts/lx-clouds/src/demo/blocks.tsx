import { ArrowRight, Check, ChevronDown, Clock, Mail, MapPin, Phone, Quote } from "lucide-react";
import { useContext, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AddItem, BlockContext, Img, ItemTools, T, imageUrl, useEdit } from "./edit";
import { icons } from "./icons";
import type {
  AboutBlock,
  Block,
  CardsBlock,
  ContactBlock,
  CtaBlock,
  DemoDoc,
  FaqBlock,
  FooterBlock,
  GalleryBlock,
  HeroBlock,
  NavBlock,
  PricesBlock,
  QuotesBlock,
  ServicesBlock,
  StatsBlock,
  StepsBlock,
} from "./types";

// Layout reacts to the width of the demo itself (container queries), not of the browser window,
// so the phone and tablet previews in the editor are the real layout.
const wrap = "mx-auto w-full max-w-[1140px] px-5 @2xl:px-8";
const h2 = "text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] [font-family:var(--fh)] @2xl:text-[38px]";
const lead = "text-[16px] leading-[1.6] text-(--mut) @2xl:text-[17px]";
const btn = "inline-flex h-12 items-center justify-center gap-2 rounded-(--r-sm) px-6 text-[15px] font-semibold transition-[filter,translate] duration-200 hover:-translate-y-px hover:brightness-110";
const card = "rounded-(--r) border border-(--line) bg-(--card)";

function Section({ id, children, tone, className }: { id: string; children: ReactNode; tone?: "alt"; className?: string }) {
  return (
    <section id={id} className={cn("py-14 @4xl:py-[88px]", tone === "alt" ? "bg-(--bg2)" : "bg-(--bg)", className)}>
      <div className={wrap}>{children}</div>
    </section>
  );
}

function Heading({ title, text, center }: { title: string; text?: string; center?: boolean }) {
  return (
    <div className={cn("max-w-[640px]", center && "mx-auto text-center")}>
      <T as="h2" path={["title"]} value={title} className={h2} placeholder="Überschrift" />
      {text !== undefined && <T as="p" path={["text"]} value={text} multiline className={cn(lead, "mt-3")} placeholder="Kurzer Einleitungstext" />}
    </div>
  );
}

// ---------- nav ----------
function Nav({ block, doc }: { block: NavBlock; doc: DemoDoc }) {
  const { links, cta } = block.props;
  return (
    <header className="border-b border-(--line) bg-(--bg)">
      <div className={cn(wrap, "flex h-[68px] items-center justify-between gap-6")}>
        {doc.theme.logo ? (
          <img src={imageUrl(doc.theme.logo)} alt={doc.meta.company} className="h-9 w-auto max-w-[180px] object-contain" />
        ) : (
          <T meta="company" value={doc.meta.company} className="text-[20px] font-bold tracking-[-0.02em] [font-family:var(--fh)]" placeholder="Firmenname" />
        )}
        <nav className="hidden items-center gap-7 @4xl:flex">
          {links.map((link, i) => (
            <span key={i} className="group/item relative">
              <T path={["links", i]} value={link} className="text-[14.5px] text-(--mut) hover:text-(--fg)" placeholder="Link" />
            </span>
          ))}
        </nav>
        <a href="#contact" className={cn(btn, "h-10 bg-(--p) px-5 text-[14px] text-(--p-on)")}>
          <T path={["cta"]} value={cta} placeholder="Button" />
        </a>
      </div>
    </header>
  );
}

// ---------- hero ----------
function HeroText({ block, light }: { block: HeroBlock; light?: boolean }) {
  const edit = useEdit();
  const p = block.props;
  const center = p.variant === "center";
  return (
    <div className={cn(center && "mx-auto max-w-[760px] text-center")}>
      <T
        path={["eyebrow"]}
        value={p.eyebrow}
        className={cn(
          "inline-block rounded-full px-3 py-1 text-[12.5px] font-semibold tracking-[0.02em]",
          light ? "bg-white/15 text-white backdrop-blur" : "bg-(--soft) text-(--p)",
        )}
        placeholder="Kurzzeile"
      />
      <T
        as="h1"
        path={["title"]}
        value={p.title}
        multiline
        className="mt-4 text-[38px] font-bold leading-[1.04] tracking-[-0.03em] [font-family:var(--fh)] @2xl:text-[52px] @5xl:text-[62px]"
        placeholder="Hauptüberschrift"
      />
      <T
        as="p"
        path={["text"]}
        value={p.text}
        multiline
        className={cn("mt-4 max-w-[540px] text-[17px] leading-[1.6] @2xl:text-[18.5px]", light ? "text-white/85" : "text-(--mut)", center && "mx-auto")}
        placeholder="Worum geht es?"
      />
      <div className={cn("mt-7 flex flex-wrap gap-3", center && "justify-center")}>
        <a href="#contact" className={cn(btn, "bg-(--p) text-(--p-on)")}>
          <T path={["primary"]} value={p.primary} placeholder="Button" />
          <ArrowRight className="size-4" aria-hidden="true" />
        </a>
        {(p.secondary || edit) && (
          <a href="#services" className={cn(btn, "border", light ? "border-white/40 text-white" : "border-(--line) bg-(--card) text-(--fg)")}>
            <T path={["secondary"]} value={p.secondary} placeholder="Zweiter Button" />
          </a>
        )}
      </div>
      <ul className={cn("mt-7 flex flex-wrap gap-x-6 gap-y-2", center && "justify-center")}>
        {p.points.map((point, i) => (
          <li key={i} className={cn("group/item relative flex items-center gap-2 text-[14.5px]", light ? "text-white/90" : "text-(--fg)")}>
            <span className={cn("flex size-5 items-center justify-center rounded-full", light ? "bg-white/20" : "bg-(--soft) text-(--p)")}>
              <Check className="size-3" strokeWidth={3} aria-hidden="true" />
            </span>
            <T path={["points", i]} value={point} placeholder="Vorteil" />
            <ItemTools path={["points"]} index={i} count={p.points.length} />
          </li>
        ))}
        <li>
          <AddItem path={["points"]} item="Neuer Vorteil" label="Vorteil" />
        </li>
      </ul>
    </div>
  );
}

function Hero({ block }: { block: HeroBlock }) {
  const p = block.props;
  if (p.variant === "cover") {
    return (
      <section id="top" className="relative isolate overflow-hidden bg-[#0c0d12] text-white">
        <Img src={p.image} path={["image"]} alt="" className="absolute inset-0 -z-10 h-full w-full [&_img]:opacity-55" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />
        <div className={cn(wrap, "pointer-events-none py-24 @4xl:py-[150px] [&_*]:pointer-events-auto")}>
          <div className="max-w-[640px]">
            <HeroText block={block} light />
          </div>
        </div>
      </section>
    );
  }
  if (p.variant === "center") {
    return (
      <section id="top" className="bg-(--bg2) pb-14 pt-14 @4xl:pb-20 @4xl:pt-20">
        <div className={wrap}>
          <HeroText block={block} />
          <Img src={p.image} path={["image"]} alt="" className="mt-12 aspect-[16/8] w-full rounded-(--r) shadow-[0_40px_80px_-40px_rgba(0,0,0,0.35)]" />
        </div>
      </section>
    );
  }
  return (
    <section id="top" className="bg-(--bg2) py-14 @4xl:py-24">
      <div className={cn(wrap, "grid items-center gap-10 @4xl:grid-cols-[1.05fr_1fr] @4xl:gap-14")}>
        <HeroText block={block} />
        <Img src={p.image} path={["image"]} alt="" className="aspect-[5/4] w-full rounded-(--r) shadow-[0_40px_80px_-40px_rgba(0,0,0,0.35)]" />
      </div>
    </section>
  );
}

// ---------- stats ----------
function Stats({ block }: { block: StatsBlock }) {
  const { items } = block.props;
  return (
    <section className="border-y border-(--line) bg-(--bg)">
      <div className={cn(wrap, "grid grid-cols-2 gap-y-8 py-10 @4xl:flex @4xl:justify-between")}>
        {items.map((item, i) => (
          <div key={i} className="group/item relative text-center @4xl:flex-1">
            <T path={["items", i, "value"]} value={item.value} className="block text-[34px] font-bold leading-none tracking-[-0.03em] text-(--p) [font-family:var(--fh)] @2xl:text-[42px]" placeholder="100" />
            <T path={["items", i, "label"]} value={item.label} className="mt-2 block text-[14px] text-(--mut)" placeholder="Bezeichnung" />
            <ItemTools path={["items"]} index={i} count={items.length} />
          </div>
        ))}
      </div>
      <div className="pb-4 text-center empty:hidden">
        <AddItem path={["items"]} item={{ value: "100", label: "Bezeichnung" }} label="Kennzahl" />
      </div>
    </section>
  );
}

// ---------- services ----------
function Services({ block }: { block: ServicesBlock }) {
  const edit = useEdit();
  const blockId = useContext(BlockContext);
  const { title, text, items } = block.props;
  return (
    <Section id="services">
      <Heading title={title} text={text} center />
      <div className="mt-10 grid gap-4 @2xl:grid-cols-2 @5xl:grid-cols-3">
        {items.map((item, i) => {
          const Icon = icons[item.icon] ?? icons.star;
          return (
            <div key={i} className={cn(card, "group/item relative p-6 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(0,0,0,0.3)]")}>
              <button
                type="button"
                disabled={!edit}
                onClick={() => edit?.pickIcon(blockId, ["items", i, "icon"], item.icon)}
                className={cn("flex size-12 items-center justify-center rounded-(--r-sm) bg-(--soft) text-(--p)", edit && "cursor-pointer hover:ring-2 hover:ring-(--p)")}
                aria-label={edit ? "Symbol ändern" : undefined}
              >
                <Icon className="size-6" strokeWidth={1.8} aria-hidden="true" />
              </button>
              <T as="h3" path={["items", i, "title"]} value={item.title} className="mt-5 block text-[18px] font-semibold tracking-[-0.01em] [font-family:var(--fh)]" placeholder="Leistung" />
              <T as="p" path={["items", i, "text"]} value={item.text} multiline className="mt-2 text-[15px] leading-[1.55] text-(--mut)" placeholder="Beschreibung" />
              <ItemTools path={["items"]} index={i} count={items.length} />
            </div>
          );
        })}
      </div>
      <div className="mt-5 text-center empty:hidden">
        <AddItem path={["items"]} item={{ icon: "star", title: "Neue Leistung", text: "Kurze Beschreibung." }} label="Leistung" />
      </div>
    </Section>
  );
}

// ---------- cards (fleet, products, treatments, listings) ----------
function Cards({ block }: { block: CardsBlock }) {
  const { title, text, items } = block.props;
  return (
    <Section id="offers" tone="alt">
      <Heading title={title} text={text} />
      <div className="mt-10 grid gap-5 @2xl:grid-cols-2 @5xl:grid-cols-3">
        {items.map((item, i) => (
          <article key={i} className={cn(card, "group/item relative overflow-hidden")}>
            <Img src={item.image} path={["items", i, "image"]} alt={item.title} className="aspect-[4/3] w-full" />
            <div className="p-5">
              <T path={["items", i, "tag"]} value={item.tag} className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-(--p)" placeholder="Kategorie" />
              <T as="h3" path={["items", i, "title"]} value={item.title} className="mt-1.5 block text-[19px] font-semibold tracking-[-0.01em] [font-family:var(--fh)]" placeholder="Titel" />
              <T as="p" path={["items", i, "text"]} value={item.text} multiline className="mt-1.5 text-[14.5px] leading-[1.5] text-(--mut)" placeholder="Beschreibung" />
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-(--line) pt-4">
                <T path={["items", i, "price"]} value={item.price} className="text-[18px] font-bold [font-family:var(--fh)]" placeholder="Preis" />
                <a href="#contact" className="inline-flex h-9 items-center rounded-(--r-sm) bg-(--p) px-4 text-[13.5px] font-semibold text-(--p-on)">
                  Anfragen
                </a>
              </div>
            </div>
            <ItemTools path={["items"]} index={i} count={items.length} />
          </article>
        ))}
      </div>
      <div className="mt-5 empty:hidden">
        <AddItem path={["items"]} item={{ image: "", title: "Neuer Eintrag", text: "Beschreibung", price: "ab 0 €", tag: "Neu" }} label="Eintrag" />
      </div>
    </Section>
  );
}

// ---------- about ----------
function About({ block }: { block: AboutBlock }) {
  const { title, text, image, points, flip } = block.props;
  return (
    <Section id="about">
      <div className="grid items-center gap-10 @4xl:grid-cols-2 @4xl:gap-16">
        <Img src={image} path={["image"]} alt="" className={cn("aspect-[5/4] w-full rounded-(--r)", flip && "@4xl:order-2")} />
        <div>
          <T as="h2" path={["title"]} value={title} className={h2} placeholder="Überschrift" />
          <T as="p" path={["text"]} value={text} multiline className={cn(lead, "mt-4")} placeholder="Über das Unternehmen" />
          <ul className="mt-6 space-y-3">
            {points.map((point, i) => (
              <li key={i} className="group/item relative flex items-start gap-3 text-[15.5px]">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-(--p) text-(--p-on)">
                  <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                </span>
                <T path={["points", i]} value={point} placeholder="Punkt" />
                <ItemTools path={["points"]} index={i} count={points.length} />
              </li>
            ))}
          </ul>
          <AddItem path={["points"]} item="Neuer Punkt" label="Punkt" className="mt-4" />
        </div>
      </div>
    </Section>
  );
}

// ---------- prices / menu ----------
function Prices({ block }: { block: PricesBlock }) {
  const { title, text, groups } = block.props;
  return (
    <Section id="prices" tone="alt">
      <Heading title={title} text={text} center />
      <div className="mt-10 grid gap-5 @4xl:grid-cols-2">
        {groups.map((group, g) => (
          <div key={g} className={cn(card, "group/item relative p-6 @2xl:p-7")}>
            <T as="h3" path={["groups", g, "name"]} value={group.name} className="block text-[13px] font-semibold uppercase tracking-[0.12em] text-(--p)" placeholder="Gruppe" />
            <ul className="mt-4 divide-y divide-(--line)">
              {group.items.map((item, i) => (
                <li key={i} className="group/item relative flex items-baseline justify-between gap-4 py-3.5">
                  <div className="min-w-0">
                    <T path={["groups", g, "items", i, "name"]} value={item.name} className="block text-[16px] font-semibold" placeholder="Name" />
                    <T path={["groups", g, "items", i, "text"]} value={item.text} className="mt-0.5 block text-[14px] text-(--mut)" placeholder="Beschreibung" />
                  </div>
                  <T path={["groups", g, "items", i, "price"]} value={item.price} className="shrink-0 text-[16px] font-bold text-(--p) [font-family:var(--fh)]" placeholder="0 €" />
                  <ItemTools path={["groups", g, "items"]} index={i} count={group.items.length} />
                </li>
              ))}
            </ul>
            <AddItem path={["groups", g, "items"]} item={{ name: "Neuer Eintrag", text: "", price: "0 €" }} label="Zeile" className="mt-3" />
            <ItemTools path={["groups"]} index={g} count={groups.length} />
          </div>
        ))}
      </div>
      <div className="mt-5 text-center empty:hidden">
        <AddItem path={["groups"]} item={{ name: "Neue Gruppe", items: [{ name: "Eintrag", text: "", price: "0 €" }] }} label="Gruppe" />
      </div>
    </Section>
  );
}

// ---------- gallery ----------
function Gallery({ block }: { block: GalleryBlock }) {
  const { title, images } = block.props;
  return (
    <Section id="gallery">
      <Heading title={title} center />
      <div className="mt-10 grid grid-cols-2 gap-3 @4xl:grid-cols-3 @4xl:gap-4">
        {images.map((image, i) => (
          <div key={i} className={cn("group/item relative", i % 5 === 0 && "@4xl:col-span-2")}>
            <Img src={image} path={["images", i]} alt="" className={cn("w-full rounded-(--r)", i % 5 === 0 ? "aspect-[4/3] @4xl:aspect-[2/1]" : "aspect-[4/3]")} />
            <ItemTools path={["images"]} index={i} count={images.length} />
          </div>
        ))}
      </div>
      <div className="mt-5 text-center empty:hidden">
        <AddItem path={["images"]} item="" label="Bild" />
      </div>
    </Section>
  );
}

// ---------- steps ----------
function Steps({ block }: { block: StepsBlock }) {
  const { title, items } = block.props;
  return (
    <Section id="steps">
      <Heading title={title} center />
      <ol className="mt-10 grid gap-5 @2xl:grid-cols-2 @5xl:grid-cols-4">
        {items.map((item, i) => (
          <li key={i} className="group/item relative">
            <span className="flex size-11 items-center justify-center rounded-full bg-(--p) text-[16px] font-bold text-(--p-on) [font-family:var(--fh)]">{i + 1}</span>
            <T as="h3" path={["items", i, "title"]} value={item.title} className="mt-4 block text-[18px] font-semibold [font-family:var(--fh)]" placeholder="Schritt" />
            <T as="p" path={["items", i, "text"]} value={item.text} multiline className="mt-1.5 text-[15px] leading-[1.55] text-(--mut)" placeholder="Beschreibung" />
            <ItemTools path={["items"]} index={i} count={items.length} />
          </li>
        ))}
      </ol>
      <div className="mt-5 text-center empty:hidden">
        <AddItem path={["items"]} item={{ title: "Neuer Schritt", text: "Beschreibung." }} label="Schritt" />
      </div>
    </Section>
  );
}

// ---------- quotes ----------
function Quotes({ block }: { block: QuotesBlock }) {
  const { title, items } = block.props;
  return (
    <Section id="quotes" tone="alt">
      <Heading title={title} center />
      <div className="mt-10 grid gap-4 @4xl:grid-cols-3">
        {items.map((item, i) => (
          <figure key={i} className={cn(card, "group/item relative p-6")}>
            <Quote className="size-6 text-(--p)" aria-hidden="true" />
            <T as="blockquote" path={["items", i, "quote"]} value={item.quote} multiline className="mt-4 text-[16px] leading-[1.6]" placeholder="Zitat" />
            <figcaption className="mt-5 border-t border-(--line) pt-4">
              <T path={["items", i, "name"]} value={item.name} className="block text-[15px] font-semibold" placeholder="Name" />
              <T path={["items", i, "role"]} value={item.role} className="block text-[13.5px] text-(--mut)" placeholder="Rolle" />
            </figcaption>
            <ItemTools path={["items"]} index={i} count={items.length} />
          </figure>
        ))}
      </div>
      <div className="mt-5 text-center empty:hidden">
        <AddItem path={["items"]} item={{ quote: "Hier steht eine Kundenstimme.", name: "Name", role: "Kunde" }} label="Stimme" />
      </div>
    </Section>
  );
}

// ---------- faq ----------
function Faq({ block }: { block: FaqBlock }) {
  const edit = useEdit();
  const { title, items } = block.props;
  return (
    <Section id="faq">
      <Heading title={title} center />
      <div className="mx-auto mt-10 max-w-[760px] space-y-3">
        {items.map((item, i) => (
          <details key={i} open={!!edit || i === 0} className={cn(card, "group/item group/faq relative px-5 py-1")}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[16.5px] font-semibold [&::-webkit-details-marker]:hidden">
              <T path={["items", i, "q"]} value={item.q} placeholder="Frage" />
              <ChevronDown className="size-5 shrink-0 text-(--mut) transition-transform duration-200 group-open/faq:rotate-180" aria-hidden="true" />
            </summary>
            <T as="p" path={["items", i, "a"]} value={item.a} multiline className="pb-5 text-[15.5px] leading-[1.6] text-(--mut)" placeholder="Antwort" />
            <ItemTools path={["items"]} index={i} count={items.length} />
          </details>
        ))}
      </div>
      <div className="mt-5 text-center empty:hidden">
        <AddItem path={["items"]} item={{ q: "Neue Frage?", a: "Antwort." }} label="Frage" />
      </div>
    </Section>
  );
}

// ---------- call to action ----------
function Cta({ block }: { block: CtaBlock }) {
  const { title, text, button } = block.props;
  return (
    <section className="bg-(--bg) px-5 py-10 @2xl:px-8">
      <div className="mx-auto max-w-[1140px] rounded-(--r) bg-(--p) px-6 py-12 text-center text-(--p-on) @2xl:px-12 @4xl:py-16">
        <T as="h2" path={["title"]} value={title} className="mx-auto block max-w-[720px] text-[28px] font-bold leading-[1.1] tracking-[-0.02em] [font-family:var(--fh)] @2xl:text-[40px]" placeholder="Aufforderung" />
        <T as="p" path={["text"]} value={text} multiline className="mx-auto mt-3 max-w-[560px] text-[16.5px] leading-[1.55] opacity-90" placeholder="Text" />
        <a href="#contact" className={cn(btn, "mt-7 bg-(--p-on) text-(--p)")}>
          <T path={["button"]} value={button} placeholder="Button" />
          <ArrowRight className="size-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

// ---------- contact ----------
function Contact({ block, doc }: { block: ContactBlock; doc: DemoDoc }) {
  const { title, text, hours, form } = block.props;
  const { meta } = doc;
  const field = "h-12 w-full rounded-(--r-sm) border border-(--line) bg-(--bg) px-4 text-[15px] text-(--fg) placeholder:text-(--mut)";
  const row = "flex items-start gap-3.5";
  const iconBox = "flex size-10 shrink-0 items-center justify-center rounded-(--r-sm) bg-(--soft) text-(--p)";
  return (
    <Section id="contact" tone="alt">
      <div className="grid gap-10 @4xl:grid-cols-2 @4xl:gap-14">
        <div>
          <Heading title={title} text={text} />
          <ul className="mt-8 space-y-5 text-[15.5px]">
            <li className={row}>
              <span className={iconBox}>
                <MapPin className="size-5" aria-hidden="true" />
              </span>
              <span>
                <T meta="address" value={meta.address} className="block font-medium" placeholder="Straße und Hausnummer" />
                <T meta="city" value={meta.city} className="block text-(--mut)" placeholder="PLZ Ort" />
              </span>
            </li>
            <li className={row}>
              <span className={iconBox}>
                <Phone className="size-5" aria-hidden="true" />
              </span>
              <T meta="phone" value={meta.phone} className="mt-2 block font-medium" placeholder="Telefon" />
            </li>
            <li className={row}>
              <span className={iconBox}>
                <Mail className="size-5" aria-hidden="true" />
              </span>
              <T meta="email" value={meta.email} className="mt-2 block font-medium" placeholder="E-Mail" />
            </li>
            <li className={row}>
              <span className={iconBox}>
                <Clock className="size-5" aria-hidden="true" />
              </span>
              <span className="w-full max-w-[300px]">
                {hours.map((h, i) => (
                  <span key={i} className="group/item relative flex justify-between gap-6 py-0.5">
                    <T path={["hours", i, "day"]} value={h.day} className="text-(--mut)" placeholder="Tag" />
                    <T path={["hours", i, "time"]} value={h.time} className="font-medium" placeholder="Zeit" />
                    <ItemTools path={["hours"]} index={i} count={hours.length} />
                  </span>
                ))}
                <AddItem path={["hours"]} item={{ day: "Tag", time: "09–18 Uhr" }} label="Zeile" className="mt-2" />
              </span>
            </li>
          </ul>
        </div>
        {form && (
          <form className={cn(card, "space-y-3 p-6 @2xl:p-8")} onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-3 @2xl:grid-cols-2">
              <input className={field} placeholder="Name" aria-label="Name" />
              <input className={field} placeholder="Telefon" aria-label="Telefon" />
            </div>
            <input className={field} placeholder="E-Mail" aria-label="E-Mail" />
            <textarea className={cn(field, "h-32 resize-none py-3")} placeholder="Ihre Nachricht" aria-label="Nachricht" />
            <button type="submit" className={cn(btn, "w-full bg-(--p) text-(--p-on)")}>
              Nachricht senden
            </button>
          </form>
        )}
      </div>
    </Section>
  );
}

// ---------- footer ----------
function Footer({ block, doc }: { block: FooterBlock; doc: DemoDoc }) {
  const { text, links } = block.props;
  return (
    <footer className="border-t border-(--line) bg-(--bg) py-10">
      <div className={cn(wrap, "flex flex-col gap-6 @4xl:flex-row @4xl:items-center @4xl:justify-between")}>
        <div>
          <T meta="company" value={doc.meta.company} className="block text-[18px] font-bold [font-family:var(--fh)]" placeholder="Firmenname" />
          <T path={["text"]} value={text} className="mt-1 block text-[14px] text-(--mut)" placeholder="Kurzer Satz" />
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-(--mut)">
          {links.map((link, i) => (
            <T key={i} path={["links", i]} value={link} placeholder="Link" />
          ))}
        </nav>
      </div>
      <p className={cn(wrap, "mt-8 text-[13px] text-(--mut)")}>
        © {new Date().getFullYear()} {doc.meta.company}
      </p>
    </footer>
  );
}

export function renderBlock(block: Block, doc: DemoDoc) {
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
  }
}
