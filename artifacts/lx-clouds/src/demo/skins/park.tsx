import { ArrowRight, CalendarDays, Check, ChevronDown, ChevronRight, Clock, Facebook, Instagram, Linkedin, Mail, MapPin, Menu, Minus, Phone, Plus, UserRound } from "lucide-react";
import { useContext, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { renderBase, type SkinProps } from "../blocks";
import { AddItem, BlockContext, Img, ItemTools, T, imageUrl, useEdit } from "../edit";
import { icons } from "../icons";
import type { AboutBlock, ContactBlock, CtaBlock, DemoDoc, FaqBlock, FooterBlock, HeroBlock, NavBlock, Path, QuotesBlock, ServicesBlock, StatsBlock, TeamBlock } from "../types";
import { Initials, MapArt, Stars, navLinks, wrap } from "./kit";

// "Park": bright, calm practice look – white and mint surfaces, soft shapes, big radii, a friendly rounded sans.

/** Mint tints derived from the brand colour, so they follow when the colour is changed. */
const tints = {
  "--mint": "color-mix(in oklch, oklch(from var(--p) 0.84 0.09 calc(h - 24)) 30%, var(--bg))",
  "--mint2": "color-mix(in oklch, oklch(from var(--p) 0.8 0.1 calc(h - 24)) 52%, var(--bg))",
} as CSSProperties;

const h2 = "[font-family:var(--fh)] text-[30px] font-semibold leading-[1.14] tracking-[-0.025em] @2xl:text-[38px] @2xl:leading-[1.12] @5xl:text-[44px] @5xl:leading-[1.12]";
const eyebrowText = "text-[11.5px] font-medium uppercase tracking-[0.17em] text-(--p)";
const lead = "text-[15.5px] font-light leading-[1.65] text-(--mut)";
const solid =
  "inline-flex h-12 items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-(--p) px-6 text-[14px] font-medium text-(--p-on) shadow-[0_12px_26px_-12px_var(--p)] transition-[filter,translate] duration-200 hover:-translate-y-px hover:brightness-110";
const ghost =
  "inline-flex h-12 items-center justify-center gap-2.5 whitespace-nowrap rounded-full border-[1.5px] border-(--p)/45 bg-(--card)/60 px-6 text-[14px] font-medium text-(--p) transition-colors duration-200 hover:border-(--p) hover:bg-(--mint)";
const soft = "rounded-(--r) border border-(--line) bg-(--card) shadow-[0_22px_48px_-28px_color-mix(in_srgb,var(--fg)_45%,transparent)]";
const tick = "flex size-[22px] shrink-0 items-center justify-center rounded-full bg-(--mint2) text-(--p)";

function Eyebrow({ value }: { value: string | undefined }) {
  return <T path={["eyebrow"]} value={value} className={cn(eyebrowText, "mb-4 block")} placeholder="Kurzzeile" />;
}

function Title({ value, className }: { value: string; className?: string }) {
  return <T as="h2" path={["title"]} value={value} multiline className={cn(h2, className)} placeholder="Überschrift" />;
}

/** Soft leaf shape used as background decoration. */
function Leaf({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("pointer-events-none absolute -z-10 block rounded-[0_100%_0_100%] bg-[linear-gradient(135deg,var(--mint2),var(--mint))] opacity-70", className)} />;
}

function Tooth({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M7.5 3C5 3 3.5 5 3.5 7.5c0 2 .8 3.2 1.3 5 .5 1.9.6 4.2 1.2 6.2.3 1.1.8 2.3 1.8 2.3 1.3 0 1.5-1.7 1.8-3.2.3-1.6.8-3.3 2.4-3.3s2.1 1.7 2.4 3.3c.3 1.5.5 3.2 1.8 3.2 1 0 1.5-1.2 1.8-2.3.6-2 .7-4.3 1.2-6.2.5-1.8 1.3-3 1.3-5C20.5 5 19 3 16.5 3c-1.7 0-2.9 1-4.5 1S9.2 3 7.5 3Z" />
    </svg>
  );
}

/** Icon of a list entry; "tooth" is drawn here because the icon set has none. A click opens the icon picker while editing. */
function ItemIcon({ name, path, className, iconClassName }: { name: string | undefined; path: Path; className?: string; iconClassName?: string }) {
  const edit = useEdit();
  const blockId = useContext(BlockContext);
  const key = name ?? "tooth";
  const Icon = icons[key];
  return (
    <button
      type="button"
      disabled={!edit}
      onClick={() => edit?.pickIcon(blockId, path, key)}
      className={cn("flex shrink-0 items-center justify-center", edit && "cursor-pointer hover:ring-2 hover:ring-(--p)", className)}
      aria-label={edit ? "Symbol ändern" : undefined}
      tabIndex={edit ? 0 : -1}
    >
      {Icon ? <Icon className={iconClassName} strokeWidth={1.6} aria-hidden="true" /> : <Tooth className={iconClassName} />}
    </button>
  );
}

function Brand({ doc, light }: { doc: DemoDoc; light?: boolean }) {
  return (
    <span className="flex min-w-0 items-center gap-3">
      {doc.theme.logo ? (
        <img src={imageUrl(doc.theme.logo)} alt={doc.meta.company} className="h-10 w-auto max-w-[170px] object-contain" />
      ) : (
        <>
          <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-[13px]", light ? "bg-white/12 text-(--mint2)" : "bg-(--mint) text-(--p)")}>
            <Tooth className="size-6" />
          </span>
          <T meta="company" value={doc.meta.company} className={cn("line-clamp-2 min-w-0 font-semibold tracking-[-0.01em]", doc.meta.company.length > 18 ? "max-w-[240px] text-[13px] leading-[1.2] @2xl:text-[15px] @2xl:leading-[1.2]" : "max-w-[170px] text-[15px] leading-[1.15] @2xl:text-[16.5px] @2xl:leading-[1.15]")} placeholder="Praxisname" />
        </>
      )}
    </span>
  );
}

// ---------- nav: floats above the hero ----------
function Nav({ block, doc }: { block: NavBlock; doc: DemoDoc }) {
  const { links, cta } = block.props;
  return (
    <header className="absolute inset-x-0 top-0 z-30 text-(--fg)" style={tints}>
      <div className={cn(wrap, "flex h-[92px] items-center justify-between gap-4")}>
        <Brand doc={doc} />
        <nav className="hidden h-[54px] items-center gap-1 rounded-full border border-(--line) bg-(--card) px-3 shadow-[0_14px_34px_-20px_color-mix(in_srgb,var(--fg)_50%,transparent)] @5xl:flex">
          {links.map((link, i) => (
            <span key={i} className="rounded-full px-4 py-2 text-[13.5px] font-medium transition-colors hover:bg-(--mint) hover:text-(--p)">
              <T path={["links", i]} value={link} placeholder="Link" />
            </span>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2.5">
          <a href="#contact" className={cn(solid, "h-11 whitespace-nowrap px-4 text-[13.5px] @2xl:px-5")}>
            <T path={["cta"]} value={cta} placeholder="Button" />
            <ArrowRight className="hidden size-4 @2xl:block" aria-hidden="true" />
          </a>
          <span className="flex size-11 items-center justify-center rounded-full border border-(--line) bg-(--card) @5xl:hidden" aria-hidden="true">
            <Menu className="size-5" />
          </span>
        </div>
      </div>
    </header>
  );
}

// ---------- hero with the appointment widget ----------
const weekdays = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const months = ["Jan.", "Feb.", "März", "Apr.", "Mai", "Juni", "Juli", "Aug.", "Sep.", "Okt.", "Nov.", "Dez."];
const slots = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00"];

/** The next working days, starting tomorrow. */
function workdays(count: number) {
  const days: Date[] = [];
  const d = new Date();
  while (days.length < count) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) days.push(new Date(d));
  }
  return days;
}

function Booking({ block, doc }: { block: HeroBlock; doc: DemoDoc }) {
  const days = useMemo(() => workdays(12), []);
  const [from, setFrom] = useState(0);
  const [day, setDay] = useState(1);
  const [time, setTime] = useState<string | null>(null);
  const picked = days[day];
  return (
    <div className="w-full rounded-[28px] border border-(--line) bg-(--card) p-5 shadow-[0_34px_70px_-30px_color-mix(in_srgb,var(--fg)_55%,transparent)] @2xl:p-6">
      <div className="flex items-center gap-3.5">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-[14px] border-[1.5px] border-(--fg)/80">
          <CalendarDays className="size-5" strokeWidth={1.7} aria-hidden="true" />
        </span>
        <span>
          <span className="block text-[17px] font-semibold tracking-[-0.01em]">Online-Termin</span>
          <span className="block text-[12px] font-light text-(--mut)">Wählen Sie Ihren Wunschtermin</span>
        </span>
      </div>

      <div className="mt-5 flex items-stretch gap-1.5 border-t border-(--line) pt-5" role="group" aria-label="Tag wählen">
        {days.slice(from, from + 4).map((d, i) => {
          const index = from + i;
          return (
            <button
              key={index}
              type="button"
              onClick={() => setDay(index)}
              aria-pressed={day === index}
              className={cn("flex-1 rounded-[14px] px-1 py-2.5 text-center transition-colors duration-200", day === index ? "bg-(--p) text-(--p-on) shadow-[0_10px_20px_-10px_var(--p)]" : "bg-(--bg2) hover:bg-(--mint)")}
            >
              <span className="block text-[13.5px] font-semibold">{weekdays[d.getDay()]}</span>
              <span className={cn("block whitespace-nowrap text-[10.5px]", day === index ? "opacity-85" : "text-(--mut)")}>
                {d.getDate()}. {months[d.getMonth()]}
              </span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => {
            const next = from + 4 >= days.length ? 0 : from + 4;
            setFrom(next);
            setDay(next);
          }}
          className="flex w-8 shrink-0 items-center justify-center rounded-[14px] text-(--mut) transition-colors hover:bg-(--mint) hover:text-(--p)"
          aria-label="Weitere Tage"
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-1.5" role="group" aria-label="Uhrzeit wählen">
        {slots.map((slot) => (
          <button
            key={slot}
            type="button"
            onClick={() => setTime(slot)}
            aria-pressed={time === slot}
            className={cn("h-10 rounded-[12px] text-[13px] font-medium transition-colors duration-200", time === slot ? "bg-(--mint2) text-(--p) ring-[1.5px] ring-(--p)" : "bg-(--bg2) hover:bg-(--mint)")}
          >
            {slot}
          </button>
        ))}
      </div>

      <a href="#contact" className={cn(solid, "mt-4 w-full")}>
        <T path={["primary"]} value={block.props.primary} placeholder="Button" />
        <ArrowRight className="size-4" aria-hidden="true" />
      </a>
      <p className="mt-3.5 flex min-h-[18px] flex-wrap items-center justify-center gap-x-1.5 text-center text-[12px] text-(--mut)" aria-live="polite">
        {time ? (
          <span>
            Ihre Auswahl: <strong className="font-semibold text-(--fg)">{weekdays[picked.getDay()]}, {picked.getDate()}. {months[picked.getMonth()]} um {time} Uhr</strong>
          </span>
        ) : (
          <>
            <Phone className="size-3.5 text-(--p)" aria-hidden="true" />
            <span>Oder telefonisch:</span>
            <T meta="phone" value={doc.meta.phone} className="font-semibold text-(--fg)" placeholder="Telefon" />
          </>
        )}
      </p>
    </div>
  );
}

function Hero({ block, doc }: { block: HeroBlock; doc: DemoDoc }) {
  const edit = useEdit();
  const p = block.props;
  return (
    <section id="top" className="relative isolate overflow-hidden bg-(--bg)" style={tints}>
      <Leaf className="-left-[190px] top-[250px] hidden h-[330px] w-[260px] rotate-[18deg] @4xl:block" />
      <Leaf className="-right-[70px] top-[70px] h-[240px] w-[170px] -rotate-[8deg] opacity-60" />

      <div className={cn(wrap, "grid items-center gap-12 pb-16 pt-[124px] @5xl:grid-cols-[0.86fr_1fr] @5xl:gap-8 @5xl:pb-24 @5xl:pt-[132px]")}>
        <div>
          <T path={["eyebrow"]} value={p.eyebrow} className={cn(eyebrowText, "mb-5 block")} placeholder="Kurzzeile" />
          <T
            as="h1"
            path={["title"]}
            value={p.title}
            multiline
            className="[font-family:var(--fh)] text-[40px] font-semibold leading-[1.1] tracking-[-0.03em] @2xl:text-[54px] @2xl:leading-[1.08] @5xl:text-[62px] @5xl:leading-[1.08]"
            placeholder="Hauptüberschrift"
          />
          <T as="p" path={["text"]} value={p.text} multiline className={cn(lead, "mt-6 max-w-[500px] text-[16.5px]")} placeholder="Worum geht es?" />
          <ul className="mt-7 space-y-3.5">
            {p.points.map((point, i) => (
              <li key={i} className="group/item relative flex items-center gap-3.5 text-[14.5px]">
                <span className={tick}>
                  <Check className="size-3.5" strokeWidth={2.6} aria-hidden="true" />
                </span>
                <T path={["points", i]} value={point} placeholder="Vorteil" />
                <ItemTools path={["points"]} index={i} count={p.points.length} />
              </li>
            ))}
          </ul>
          <AddItem path={["points"]} item="Neuer Vorteil" label="Vorteil" className="mt-3" />

          <div className="mt-9 flex flex-wrap gap-3">
            {(p.note || edit) && (
              <div className="rounded-[18px] border border-(--line) bg-(--card) px-5 py-3.5 shadow-[0_16px_34px_-22px_color-mix(in_srgb,var(--fg)_55%,transparent)]">
                <Stars className="text-[15px] text-[#F5B83D]" />
                <T path={["note"]} value={p.note} className="mt-1 block text-[12.5px] text-(--mut)" placeholder="z. B. 4,9 bei Google" />
              </div>
            )}
            {(p.badge || edit) && (
              <div className="flex items-center gap-3 rounded-[18px] bg-(--mint) px-4 py-3.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-(--p) text-(--p-on)">
                  <UserRound className="size-4.5" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <T path={["badge"]} value={p.badge} className="max-w-[130px] text-[13px] font-medium leading-[1.3]" placeholder="Hinweis" />
              </div>
            )}
            {(p.secondary || edit) && (
              <a href="#services" className={cn(ghost, "self-center")}>
                <T path={["secondary"]} value={p.secondary} placeholder="Zweiter Button" />
              </a>
            )}
          </div>
        </div>

        {/* photo in a soft blob, appointment card on top */}
        <div className="relative mx-auto w-full max-w-[600px] @5xl:max-w-none">
          <span aria-hidden="true" className="absolute left-[9%] top-[-3%] -z-10 block aspect-[1/1.04] w-[82%] rotate-[16deg] bg-(--mint2) opacity-75 [border-radius:54%_46%_40%_60%/48%_58%_42%_52%] @2xl:w-[74%] @5xl:w-[80%]" />
          <Img
            src={p.image}
            path={["image"]}
            alt=""
            eager
            className="aspect-[1/1.1] w-[88%] bg-(--mint) [border-radius:66%_34%_58%_42%/50%_42%_58%_50%] @2xl:w-[76%] @5xl:w-[80%]"
            imgClassName="origin-top scale-[1.08] object-[center_6%] @2xl:-translate-x-[7%]"
          />
          <div className="relative z-10 -mt-20 ml-auto w-full max-w-[340px] @2xl:absolute @2xl:right-0 @2xl:top-[27%] @2xl:mt-0 @2xl:max-w-[312px]">
            <Booking block={block} doc={doc} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- services: row of soft cards ----------
function Services({ block }: { block: ServicesBlock }) {
  const edit = useEdit();
  const { eyebrow, title, text, button, items } = block.props;
  return (
    <section id="services" className="relative isolate overflow-hidden bg-(--bg2) pb-16 pt-14 @4xl:pb-24 @4xl:pt-16" style={tints}>
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 block h-[58%] bg-(--bg) [border-radius:0_0_50%_50%/0_0_90px_90px]" />
      <div className={wrap}>
        <div className="d-rise flex flex-col gap-6 @4xl:flex-row @4xl:items-end @4xl:justify-between">
          <div className="max-w-[640px]">
            <Eyebrow value={eyebrow} />
            <Title value={title} />
            <T as="p" path={["text"]} value={text} multiline className={cn(lead, "mt-4 max-w-[560px]")} placeholder="Kurzer Einleitungstext" />
          </div>
          {(button || edit) && (
            <a href="#contact" className={cn(ghost, "self-start @4xl:mb-1 @4xl:self-auto")}>
              <T path={["button"]} value={button} placeholder="Button" />
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          )}
        </div>
        <div className="mt-10 grid gap-3.5 @2xl:grid-cols-2 @4xl:grid-cols-3 @6xl:grid-cols-5">
          {items.map((item, i) => (
            <article key={i} className={cn(soft, "d-rise group/item relative flex gap-4 p-5 transition-[translate,box-shadow] duration-300 hover:-translate-y-1.5 @2xl:block @2xl:p-6")}>
              <ItemIcon name={item.icon} path={["items", i, "icon"]} className="size-[52px] rounded-[16px] bg-(--mint) text-(--p) transition-colors duration-300 group-hover/item:bg-(--mint2)" iconClassName="size-[26px]" />
              <div className="min-w-0">
                <T as="h3" path={["items", i, "title"]} value={item.title} multiline className="block text-[16.5px] font-semibold leading-[1.25] tracking-[-0.01em] @2xl:mt-5" placeholder="Leistung" />
                <T as="p" path={["items", i, "text"]} value={item.text} multiline className="mt-2 text-[13.5px] font-light leading-[1.55] text-(--mut) @2xl:min-h-[42px]" placeholder="Beschreibung" />
                <span className="mt-4 inline-flex items-center gap-2 text-[13px] font-medium text-(--p)">
                  Mehr erfahren
                  <ArrowRight className="size-3.5 transition-transform duration-300 group-hover/item:translate-x-1" aria-hidden="true" />
                </span>
              </div>
              <ItemTools path={["items"]} index={i} count={items.length} />
            </article>
          ))}
        </div>
        <div className="mt-5 empty:hidden">
          <AddItem path={["items"]} item={{ icon: "tooth", title: "Neue Leistung", text: "Kurze Beschreibung." }} label="Leistung" />
        </div>
      </div>
    </section>
  );
}

// ---------- about: the visit ----------
function About({ block }: { block: AboutBlock }) {
  const edit = useEdit();
  const { eyebrow, title, text, image, points, flip, button } = block.props;
  return (
    <section id="about" className="relative isolate overflow-hidden bg-(--bg) py-16 @4xl:py-24" style={tints}>
      <span aria-hidden="true" className="pointer-events-none absolute -left-[140px] top-[12%] -z-10 block h-[76%] w-[58%] bg-(--bg2) [border-radius:38%_62%_55%_45%/48%_42%_58%_52%]" />
      <Leaf className="-right-[40px] bottom-[40px] hidden h-[190px] w-[130px] rotate-[6deg] @4xl:block" />
      <Leaf className="right-[60px] bottom-[10px] hidden h-[120px] w-[90px] rotate-[48deg] opacity-45 @4xl:block" />
      <div className={cn(wrap, "grid items-center gap-10 @5xl:grid-cols-[1fr_1.02fr] @5xl:gap-20")}>
        <div className={cn("d-rise relative", flip && "@5xl:order-2")}>
          <Img
            src={image}
            path={["image"]}
            alt=""
            className="aspect-[4/3.3] w-full border-[7px] border-(--card) shadow-[0_34px_70px_-34px_color-mix(in_srgb,var(--fg)_60%,transparent)] [border-radius:calc(var(--r)*1.7)_calc(var(--r)*1.7)_calc(var(--r)*1.7)_calc(var(--r)*3.4)]"
          />
        </div>
        <div className="d-rise">
          <Eyebrow value={eyebrow} />
          <Title value={title} />
          <T as="p" path={["text"]} value={text} multiline className={cn(lead, "mt-5 max-w-[520px]")} placeholder="Über die Praxis" />
          <ul className="mt-7 space-y-3.5">
            {points.map((point, i) => (
              <li key={i} className="group/item relative flex items-start gap-3.5 text-[14.5px]">
                <span className={cn(tick, "mt-px")}>
                  <Check className="size-3.5" strokeWidth={2.6} aria-hidden="true" />
                </span>
                <T path={["points", i]} value={point} placeholder="Punkt" />
                <ItemTools path={["points"]} index={i} count={points.length} />
              </li>
            ))}
          </ul>
          <AddItem path={["points"]} item="Neuer Punkt" label="Punkt" className="mt-4" />
          {(button || edit) && (
            <a href="#contact" className={cn(solid, "mt-8")}>
              <T path={["button"]} value={button} placeholder="Button" />
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

// ---------- team ----------
function Team({ block }: { block: TeamBlock }) {
  const { eyebrow, title, text, items } = block.props;
  return (
    <section id="team" className="bg-(--bg) pb-10 pt-6 @4xl:pb-14 @4xl:pt-8" style={tints}>
      <div className={wrap}>
        <div className="d-rise flex flex-col gap-5 @4xl:flex-row @4xl:items-end @4xl:justify-between @4xl:gap-12">
          <div>
            <Eyebrow value={eyebrow} />
            <Title value={title} />
          </div>
          <T as="p" path={["text"]} value={text} multiline className={cn(lead, "max-w-[400px] @4xl:pb-1.5")} placeholder="Kurzer Einleitungstext" />
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3.5 @4xl:grid-cols-4 @4xl:gap-5">
          {items.map((item, i) => (
            <article key={i} className={cn(soft, "d-rise group/item relative overflow-hidden transition-[translate] duration-300 hover:-translate-y-1.5")}>
              <Img src={item.image} path={["items", i, "image"]} alt={item.name} className="aspect-[4/3.25] w-full bg-(--mint)" imgClassName="object-[center_22%] transition-transform duration-700 group-hover/item:scale-105" />
              <div className="flex items-end justify-between gap-2 p-4 @2xl:p-5">
                <div className="min-w-0">
                  <T as="h3" path={["items", i, "name"]} value={item.name} multiline className="block text-[14px] font-semibold leading-[1.3] @2xl:text-[15.5px]" placeholder="Name" />
                  <T path={["items", i, "role"]} value={item.role} className="mt-1.5 block text-[12.5px] font-light text-(--mut)" placeholder="Aufgabe" />
                  <T as="p" path={["items", i, "text"]} value={item.text} multiline className="mt-2 text-[12.5px] font-light leading-[1.5] text-(--mut)" placeholder="Schwerpunkt" />
                </div>
                <span className="hidden size-9 shrink-0 items-center justify-center rounded-full border-[1.5px] border-(--p)/35 text-(--p) transition-colors duration-300 group-hover/item:bg-(--p) group-hover/item:text-(--p-on) @2xl:flex" aria-hidden="true">
                  <ArrowRight className="size-4" />
                </span>
              </div>
              <ItemTools path={["items"]} index={i} count={items.length} />
            </article>
          ))}
        </div>
        <div className="mt-5 empty:hidden">
          <AddItem path={["items"]} item={{ image: "", name: "Dr. med. dent.\nVorname Name", role: "Zahnärztin", text: "" }} label="Person" />
        </div>
      </div>
    </section>
  );
}

// ---------- stats: the mint info strip ----------
const stripIcons = ["clock", "pin", "shield", "heart"];

function Stats({ block }: { block: StatsBlock }) {
  const { items } = block.props;
  return (
    <section className="bg-(--bg) py-8 @4xl:py-10" style={tints}>
      <div className={wrap}>
        <div className="d-rise grid gap-x-6 gap-y-7 rounded-(--r) bg-(--mint) px-6 py-7 @2xl:grid-cols-2 @2xl:px-8 @5xl:flex @5xl:gap-0 @5xl:py-8">
          {items.map((item, i) => (
            <div key={i} className="group/item relative flex items-start gap-4 border-(--p)/20 @5xl:flex-1 @5xl:px-7 @5xl:first:pl-0 @5xl:last:pr-0 @5xl:[&:not(:first-child)]:border-l">
              <ItemIcon name={item.icon ?? stripIcons[i % stripIcons.length]} path={["items", i, "icon"]} className="size-10 rounded-full border-[1.5px] border-(--p)/60 text-(--p)" iconClassName="size-5" />
              <div className="min-w-0">
                <T path={["items", i, "value"]} value={item.value} className="block text-[15px] font-semibold tracking-[-0.01em]" placeholder="Titel" />
                <T as="p" path={["items", i, "label"]} value={item.label} multiline className="mt-1.5 text-[12.5px] font-light leading-[1.6] text-(--fg)/75" placeholder="Beschreibung" />
              </div>
              <ItemTools path={["items"]} index={i} count={items.length} />
            </div>
          ))}
        </div>
        <div className="mt-4 empty:hidden">
          <AddItem path={["items"]} item={{ icon: "check", value: "Titel", label: "Kurze Beschreibung." }} label="Hinweis" />
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
    <section id="quotes" className="relative isolate overflow-hidden bg-(--bg) py-16 @4xl:py-20" style={tints}>
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[62%] bg-gradient-to-b from-transparent to-(--bg2)" />
      <div className={wrap}>
        <div className="d-rise flex flex-col gap-5 @4xl:flex-row @4xl:items-end @4xl:justify-between">
          <div>
            <Eyebrow value={eyebrow} />
            <Title value={title} />
          </div>
          {(text || edit) && (
            <div className="flex items-center gap-3 self-start rounded-full border-[1.5px] border-(--p)/35 bg-(--card)/70 py-2.5 pl-4 pr-5 @4xl:mb-1 @4xl:self-auto">
              <Stars className="text-[15px] text-[#F5B83D]" />
              <T path={["text"]} value={text} className="text-[13.5px] font-medium text-(--p)" placeholder="z. B. 4,9 bei Google" />
            </div>
          )}
        </div>
        <div className="mt-10 grid gap-4 @4xl:grid-cols-3 @4xl:gap-5">
          {items.map((item, i) => (
            <figure key={i} className={cn(soft, "d-rise group/item relative flex flex-col p-6 @2xl:p-7")}>
              <Stars className="text-[15px] text-[#F5B83D]" />
              <T as="blockquote" path={["items", i, "quote"]} value={item.quote} multiline className="mt-4 flex-1 text-[14.5px] font-light leading-[1.65]" placeholder="Zitat" />
              <figcaption className="mt-6 flex items-center gap-3">
                <Initials name={item.name} className="size-10 bg-(--mint2) text-[12.5px] text-(--p)" />
                <span>
                  <T path={["items", i, "name"]} value={item.name} className="block text-[13.5px] font-semibold" placeholder="Name" />
                  <T path={["items", i, "role"]} value={item.role} className="block text-[12px] font-light text-(--mut)" placeholder="z. B. vor 2 Wochen" />
                </span>
              </figcaption>
              <ItemTools path={["items"]} index={i} count={items.length} />
            </figure>
          ))}
        </div>
        <div className="mt-5 empty:hidden">
          <AddItem path={["items"]} item={{ quote: "Hier steht eine Patientenstimme.", name: "Vorname N.", role: "vor 1 Woche" }} label="Stimme" />
        </div>
      </div>
    </section>
  );
}

// ---------- faq ----------
function Faq({ block, doc }: { block: FaqBlock; doc: DemoDoc }) {
  const edit = useEdit();
  const { eyebrow, title, text, items } = block.props;
  return (
    <section id="faq" className="bg-(--bg2) py-16 @4xl:py-20" style={tints}>
      <div className={cn(wrap, "grid gap-10 @5xl:grid-cols-[0.82fr_1fr] @5xl:gap-16")}>
        <div className="d-rise">
          <Eyebrow value={eyebrow} />
          <Title value={title} />
          <T as="p" path={["text"]} value={text} multiline className={cn(lead, "mt-5 max-w-[400px]")} placeholder="Kurzer Einleitungstext" />
          <div className={cn(ghost, "mt-7 h-auto min-h-12 flex-wrap justify-start gap-x-2 gap-y-0 whitespace-normal py-2.5")}>
            <Phone className="size-4 shrink-0" aria-hidden="true" />
            <span className="font-light text-(--mut)">Frage nicht dabei?</span>
            <T meta="phone" value={doc.meta.phone} className="font-semibold" placeholder="Telefon" />
          </div>
        </div>
        <div>
          <div className="space-y-2.5">
            {items.map((item, i) => (
              <details key={i} open={!!edit || i === 0} className="group/item group/faq relative rounded-[calc(var(--r)*0.75)] border border-(--line) bg-(--card) px-5 shadow-[0_14px_30px_-24px_color-mix(in_srgb,var(--fg)_50%,transparent)] @2xl:px-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-[18px] text-[15px] font-medium [&::-webkit-details-marker]:hidden">
                  <T path={["items", i, "q"]} value={item.q} placeholder="Frage" />
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-(--mint) text-(--p) transition-transform duration-300 group-open/faq:rotate-180">
                    <ChevronDown className="size-4" aria-hidden="true" />
                  </span>
                </summary>
                <T as="p" path={["items", i, "a"]} value={item.a} multiline className="max-w-[520px] pb-5 text-[13.5px] font-light leading-[1.65] text-(--mut)" placeholder="Antwort" />
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

// ---------- call to action: mint panel ----------
function Cta({ block }: { block: CtaBlock }) {
  const { eyebrow, title, text, button } = block.props;
  return (
    <section className="bg-(--bg) py-10 @4xl:py-14" style={tints}>
      <div className={wrap}>
        <div className="d-rise relative isolate flex flex-col gap-7 overflow-hidden rounded-[calc(var(--r)*1.4)] bg-(--mint) px-7 py-10 @4xl:flex-row @4xl:items-center @4xl:justify-between @4xl:px-12 @4xl:py-12">
          <Leaf className="-right-[30px] -top-[60px] h-[220px] w-[160px] rotate-[12deg]" />
          <div>
            <Eyebrow value={eyebrow} />
            <Title value={title} />
            <T as="p" path={["text"]} value={text} multiline className={cn(lead, "mt-4 max-w-[520px] text-(--fg)/75")} placeholder="Text" />
          </div>
          <a href="#contact" className={cn(solid, "h-14 shrink-0 self-start px-8 @4xl:self-center")}>
            <T path={["button"]} value={button} placeholder="Button" />
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

// ---------- contact ----------
function InfoIcon({ children }: { children: ReactNode }) {
  return <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-(--mint) text-(--p)">{children}</span>;
}

function Contact({ block, doc }: { block: ContactBlock; doc: DemoDoc }) {
  const { eyebrow, title, text, hours, form } = block.props;
  const { meta } = doc;
  const field = "h-12 w-full rounded-[14px] border border-(--line) bg-(--bg) px-4 text-[14px] text-(--fg) outline-none transition-colors placeholder:text-(--mut) focus:border-(--p)";
  return (
    <section id="contact" className="bg-(--bg) pb-28 pt-16 @4xl:pb-36 @4xl:pt-20" style={tints}>
      <div className={cn(wrap, "grid gap-10 @5xl:grid-cols-[2.15fr_1fr] @5xl:gap-10")}>
        <div className="d-rise">
          <Eyebrow value={eyebrow} />
          <Title value={title} />
          <div className="mt-9 grid gap-7 text-[13.5px] @2xl:grid-cols-[1fr_1.05fr_1.15fr] @2xl:gap-4">
            <div className="flex items-start gap-3">
              <InfoIcon>
                <MapPin className="size-5" strokeWidth={1.7} aria-hidden="true" />
              </InfoIcon>
              <span className="min-w-0 font-light leading-[1.6] text-(--mut)">
                <T meta="company" value={meta.company} className="block font-semibold text-(--fg)" placeholder="Praxisname" />
                <T meta="address" value={meta.address} className="block" placeholder="Straße und Hausnummer" />
                <T meta="city" value={meta.city} className="block" placeholder="PLZ Ort" />
              </span>
            </div>
            <div className="flex items-start gap-3">
              <InfoIcon>
                <Phone className="size-5" strokeWidth={1.7} aria-hidden="true" />
              </InfoIcon>
              <span className="min-w-0 flex-1 font-light leading-[1.6] text-(--mut)">
                <T meta="phone" value={meta.phone} className="block font-semibold text-(--fg)" placeholder="Telefon" />
                {hours.map((h, i) => (
                  <span key={i} className="group/item relative flex flex-wrap gap-x-1.5">
                    <T path={["hours", i, "day"]} value={h.day} placeholder="Tag" />
                    <T path={["hours", i, "time"]} value={h.time} placeholder="Zeit" />
                    <ItemTools path={["hours"]} index={i} count={hours.length} />
                  </span>
                ))}
                <AddItem path={["hours"]} item={{ day: "Tag", time: "08–18 Uhr" }} label="Zeile" className="mt-2" />
              </span>
            </div>
            <div className="flex items-start gap-3">
              <InfoIcon>
                <Mail className="size-5" strokeWidth={1.7} aria-hidden="true" />
              </InfoIcon>
              <span className="min-w-0 font-light leading-[1.6] text-(--mut)">
                <T meta="email" value={meta.email} className="block break-all font-semibold text-(--fg)" placeholder="E-Mail" />
                <T path={["text"]} value={text} multiline className="block" placeholder="Hinweis" />
              </span>
            </div>
          </div>

          {form && (
            <form className={cn(soft, "mt-10 grid gap-3 p-6 @2xl:grid-cols-2 @2xl:p-7")} onSubmit={(e) => e.preventDefault()}>
              <input className={field} placeholder="Name" aria-label="Name" />
              <input className={field} placeholder="Telefon" aria-label="Telefon" />
              <input className={cn(field, "@2xl:col-span-2")} placeholder="E-Mail" aria-label="E-Mail" />
              <textarea className={cn(field, "h-28 resize-none py-3 @2xl:col-span-2")} placeholder="Ihr Anliegen" aria-label="Nachricht" />
              <button type="submit" className={cn(solid, "@2xl:col-span-2 @2xl:justify-self-start")}>
                Terminanfrage senden
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </form>
          )}
        </div>

        <div className="d-rise relative self-start">
          <MapArt label={meta.company} className="h-[260px] rounded-[calc(var(--r)*1.2)] border border-(--line) shadow-[0_28px_60px_-34px_color-mix(in_srgb,var(--fg)_55%,transparent)] @5xl:h-[280px]" style={tints} />
          <span className="absolute bottom-4 right-4 flex flex-col overflow-hidden rounded-[10px] bg-(--card) text-(--fg) shadow-md" aria-hidden="true">
            <span className="flex size-8 items-center justify-center border-b border-(--line)">
              <Plus className="size-4" />
            </span>
            <span className="flex size-8 items-center justify-center">
              <Minus className="size-4" />
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}

// ---------- footer: dark teal with a wave on top ----------
function Footer({ block, doc }: { block: FooterBlock; doc: DemoDoc }) {
  const { text, links } = block.props;
  const { meta } = doc;
  const heading = "mb-4 block text-[13px] font-medium opacity-70";
  return (
    <footer className="relative bg-(--dk) pb-9 pt-10 text-(--dk-on)" style={tints}>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-[calc(100%-1px)] block h-[56px] w-full text-(--dk) @4xl:h-[76px]" aria-hidden="true">
        <path fill="currentColor" d="M0 80V44C180 12 360 2 560 20c220 20 380 52 600 44 120-4 210-22 280-40v56Z" />
      </svg>
      <div className={cn(wrap, "grid gap-10 @2xl:grid-cols-3 @4xl:grid-cols-[1.5fr_1fr_1fr_1fr]")}>
        <div className="@2xl:col-span-3 @4xl:col-span-1">
          <Brand doc={doc} light />
          <T as="p" path={["text"]} value={text} multiline className="mt-5 max-w-[280px] text-[13.5px] font-light leading-[1.6] opacity-75" placeholder="Kurzer Satz" />
          <span className="mt-6 flex gap-2.5" aria-hidden="true">
            {[Instagram, Facebook, Linkedin].map((Icon, i) => (
              <span key={i} className="flex size-9 items-center justify-center rounded-full border border-white/25 text-(--mint2)">
                <Icon className="size-4" strokeWidth={1.7} />
              </span>
            ))}
          </span>
        </div>
        <div>
          <span className={heading}>Praxis</span>
          <ul className="space-y-2.5 text-[13.5px] font-light">
            {navLinks(doc).map((link, i) => (
              <li key={i}>{link}</li>
            ))}
          </ul>
        </div>
        <div>
          <span className={heading}>Kontakt</span>
          <ul className="space-y-2.5 text-[13.5px] font-light">
            <li>{meta.address}</li>
            <li>{meta.city}</li>
            <li>{meta.phone}</li>
            <li className="break-all">{meta.email}</li>
          </ul>
        </div>
        <div>
          <span className={heading}>Sprechzeiten</span>
          <ul className="space-y-2.5 text-[13.5px] font-light">
            {(doc.blocks.find((b) => b.type === "contact") as ContactBlock | undefined)?.props.hours.map((h, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <Clock className={cn("mt-[3px] size-3.5 shrink-0 text-(--mint2)", i > 0 && "invisible")} aria-hidden="true" />
                <span>
                  {h.day}
                  <span className="block opacity-70">{h.time}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={cn(wrap, "mt-12")}>
        <div className="flex flex-col gap-4 border-t border-white/15 pt-6 text-[12.5px] font-light @2xl:flex-row @2xl:items-center @2xl:justify-between">
          <nav className="flex flex-wrap gap-x-7 gap-y-2 opacity-80">
            {links.map((link, i) => (
              <T key={i} path={["links", i]} value={link} placeholder="Link" />
            ))}
          </nav>
          <p className="opacity-65">
            © {new Date().getFullYear()} {meta.company}. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function ParkBlock({ block, doc }: SkinProps) {
  switch (block.type) {
    case "nav":
      return <Nav block={block} doc={doc} />;
    case "hero":
      return <Hero block={block} doc={doc} />;
    case "services":
      return <Services block={block} />;
    case "about":
      return <About block={block} />;
    case "team":
      return <Team block={block} />;
    case "stats":
      return <Stats block={block} />;
    case "quotes":
      return <Quotes block={block} />;
    case "faq":
      return <Faq block={block} doc={doc} />;
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
