import { BedDouble, Check, ChevronDown, Clock, Heart, House, Instagram, Linkedin, Lock, Mail, MapPin, Menu, MoveRight, Phone, Plus, Quote, Scaling } from "lucide-react";
import { useContext, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { renderBase, type SkinProps } from "../blocks";
import { AddItem, BlockContext, Img, ItemTools, T, imageUrl, useEdit } from "../edit";
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
  QuotesBlock,
  ServicesBlock,
  StatsBlock,
  StepsBlock,
  TeamBlock,
} from "../types";
import { IconPick, MapArt, Stars, navLinks } from "./kit";

// "Linden": architectural and quiet – sand paper, near-black ink, one bronze accent,
// a large calm serif, hairlines and almost square corners. Photography leads.

const wrap = "mx-auto w-full max-w-[1340px] px-5 @2xl:px-10";
const serif = "[font-family:var(--fh)] font-medium tracking-[-0.01em] [font-variant-numeric:lining-nums]";
// (line height comes after the size: a font-size utility would otherwise reset it)
const h2 = cn(serif, "text-[36px] leading-[1.05] @2xl:text-[44px] @2xl:leading-[1.05] @5xl:text-[54px] @5xl:leading-[1.05]");
const huge = cn(serif, "text-[50px] leading-[0.95] @2xl:text-[68px] @2xl:leading-[0.95] @6xl:text-[86px] @6xl:leading-[0.95]");
const caps = "text-[12px] font-medium uppercase leading-[1.65] tracking-[0.2em]";
const lead = "text-[16px] leading-[1.65] text-(--mut) @2xl:text-[17px]";
const solid =
  "inline-flex h-[52px] items-center justify-center gap-3.5 rounded-(--r) bg-(--p) px-8 text-[14.5px] font-medium text-(--p-on) shadow-[0_10px_24px_-14px_var(--p)] transition-[filter] duration-200 hover:brightness-110";
const link = "inline-flex items-center gap-3 text-[14.5px] font-medium text-(--p) transition-[gap] duration-200 hover:gap-4";
const panel = "rounded-(--r) border border-(--line) bg-(--card)";
const fieldLabel = "mb-1.5 block text-[13px] font-medium text-(--fg)";
const field = "h-11 w-full appearance-none rounded-(--r) border border-(--line) bg-(--card) px-3.5 text-[14px] text-(--fg) outline-none transition-colors placeholder:text-(--mut)/75 focus:border-(--p)";
const Arrow = ({ className }: { className?: string }) => <MoveRight className={cn("size-[19px] shrink-0", className)} strokeWidth={1.4} aria-hidden="true" />;

function Caps({ value, className }: { value: string | undefined; className?: string }) {
  return <T path={["eyebrow"]} value={value} multiline className={cn(caps, "mb-6 block text-(--mut)", className)} placeholder="Kurzzeile" />;
}

/** Section headline with the quiet "… ansehen →" link at the right edge. */
function Head({ title, action, actionPath = ["button"], children }: { title: string; action?: string; actionPath?: Path; children?: ReactNode }) {
  const edit = useEdit();
  return (
    <div className="d-rise flex flex-col gap-4 @4xl:flex-row @4xl:items-end @4xl:justify-between @4xl:gap-10">
      <div>
        {children}
        <T as="h2" path={["title"]} value={title} multiline className={h2} placeholder="Überschrift" />
      </div>
      {(action || edit) && (
        <a href="#contact" className={cn(link, "shrink-0 @4xl:pb-2.5")}>
          <T path={actionPath} value={action} placeholder="Link" />
          <Arrow />
        </a>
      )}
    </div>
  );
}

/** One editable piece of a text that is stored as a single string, e.g. "Villa · 8 Zimmer · 280 m²". */
function Part({ value, onCommit, className }: { value: string; onCommit: (next: string) => void; className?: string }) {
  const edit = useEdit();
  const ref = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (el && document.activeElement !== el && el.innerText !== value) el.innerText = value;
  }, [value, edit]);
  if (!edit) return <span className={className}>{value}</span>;
  return (
    <span
      ref={ref}
      className={cn(className, "demo-editable")}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      data-placeholder="Text"
      onBlur={(e) => {
        const next = e.currentTarget.innerText.replace(/ /g, " ").trim();
        if (next !== value) onCommit(next);
      }}
      onKeyDown={(e: KeyboardEvent<HTMLSpanElement>) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.currentTarget.blur();
        }
        if (e.key === "Escape") {
          e.currentTarget.innerText = value;
          e.currentTarget.blur();
        }
        e.stopPropagation();
      }}
    />
  );
}

/** Splits a stored string at `separator` and hands each piece to `children`; edits are written back joined. */
function Parts({ value, path, separator, children }: { value: string; path: Path; separator: string; children: (part: ReactNode, index: number) => ReactNode }) {
  const edit = useEdit();
  const blockId = useContext(BlockContext);
  const parts = value
    .split(separator)
    .map((s) => s.trim())
    .filter(Boolean);
  const join = separator === "\n" ? "\n" : ` ${separator} `;
  return (
    <>
      {parts.map((part, i) =>
        children(
          <Part
            value={part}
            onCommit={(next) =>
              edit?.set(
                blockId,
                path,
                parts
                  .map((p, j) => (j === i ? next : p))
                  .filter(Boolean)
                  .join(join),
              )
            }
          />,
          i,
        ),
      )}
    </>
  );
}

function Wordmark({ doc, className, sub }: { doc: DemoDoc; className?: string; sub?: string }) {
  if (doc.theme.logo) return <img src={imageUrl(doc.theme.logo)} alt={doc.meta.company} className="h-11 w-auto max-w-[190px] object-contain" />;
  // a long company name is set smaller and may run over two lines instead of pushing the button out
  const long = doc.meta.company.length > 16;
  return (
    <span className={cn("inline-flex min-w-0 flex-col items-center", className)}>
      <T
        meta="company"
        value={doc.meta.company}
        className={cn(
          serif,
          "block uppercase tracking-[0.07em]",
          long ? "max-w-[210px] text-balance text-center text-[15px] leading-[1.12] @2xl:max-w-[320px] @2xl:text-[19px] @2xl:leading-[1.12]" : "whitespace-nowrap text-[24px] leading-none @2xl:text-[31px] @2xl:leading-none",
        )}
        placeholder="Firmenname"
      />
      <T meta="industry" value={doc.meta.industry} className={cn("mt-1.5 block whitespace-nowrap text-[8.5px] font-medium uppercase leading-none tracking-[0.38em] @2xl:text-[9.5px] @2xl:leading-none", sub)} placeholder="Branche" />
    </span>
  );
}

// ---------- nav: lies on the hero photo ----------
function Nav({ block, doc }: { block: NavBlock; doc: DemoDoc }) {
  const { links, cta } = block.props;
  const ink = "text-[#16130F]";
  return (
    <header className={cn("absolute inset-x-0 top-0 z-30 bg-gradient-to-b from-[#F7F2E9]/75 via-[#F7F2E9]/30 to-transparent", ink)}>
      <div className={cn(wrap, "flex h-[84px] items-center justify-between gap-6 @2xl:h-[104px] @5xl:px-[70px]")}>
        <Wordmark doc={doc} />
        <nav className="hidden shrink-0 items-center gap-7 @5xl:flex @6xl:gap-10">
          {links.map((item, i) => (
            <T key={i} path={["links", i]} value={item} className="text-[14.5px] font-medium opacity-85 transition-opacity hover:opacity-100" placeholder="Link" />
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-4 @2xl:gap-5">
          <span className="hidden h-6 w-px bg-[#16130F]/25 @5xl:block" aria-hidden="true" />
          <Heart className="hidden size-[21px] @5xl:block" strokeWidth={1.4} aria-hidden="true" />
          <a href="#contact" className={cn(solid, "h-11 whitespace-nowrap px-5 @2xl:h-[52px] @2xl:px-7")}>
            <T path={["cta"]} value={cta} placeholder="Button" />
          </a>
          <Menu className="size-6 @5xl:hidden" strokeWidth={1.4} aria-hidden="true" />
        </div>
      </div>
    </header>
  );
}

// ---------- hero: full-bleed photo, serif headline, search panel on the lower edge ----------
const searchOptions = {
  Kaufen: { types: ["Alle Objektarten", "Villa", "Einfamilienhaus", "Penthouse", "Wohnung", "Grundstück"], prices: ["Beliebig", "bis 500.000 €", "bis 1 Mio. €", "bis 2,5 Mio. €", "bis 5 Mio. €"] },
  Mieten: { types: ["Alle Objektarten", "Wohnung", "Penthouse", "Haus", "Büro"], prices: ["Beliebig", "bis 1.500 €", "bis 2.500 €", "bis 4.000 €", "bis 6.000 €"] },
};
type Mode = keyof typeof searchOptions;

function Hero({ block }: { block: HeroBlock }) {
  const edit = useEdit();
  const p = block.props;
  const [mode, setMode] = useState<Mode>("Kaufen");
  const options = searchOptions[mode];
  return (
    <section id="top" className="relative isolate overflow-hidden bg-[#1c1820] text-white">
      <Img src={p.image} path={["image"]} alt="" eager chip="tr" className="absolute inset-0 -z-20 h-full w-full bg-transparent [&>button]:top-[112px]" imgClassName="object-[68%_center] @5xl:object-center" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-[#1a1422]/60 via-[#1a1422]/20 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-2/5 bg-gradient-to-t from-[#120e0c]/55 to-transparent" />

      <div className={cn(wrap, "relative pb-10 pt-[136px] @2xl:pt-[176px] @5xl:px-[70px] @5xl:pb-[58px]")}>
        <div className="max-w-[720px]">
          <T path={["eyebrow"]} value={p.eyebrow} multiline className={cn(caps, "block max-w-[330px] text-white/90 [text-shadow:0_1px_14px_rgba(20,14,22,0.5)]")} placeholder="Kurzzeile" />
          <T
            as="h1"
            path={["title"]}
            value={p.title}
            multiline
            className={cn(serif, "mt-7 text-[58px] leading-[0.95] [text-shadow:0_2px_30px_rgba(20,14,22,0.35)] @2xl:text-[86px] @2xl:leading-[0.93] @6xl:text-[112px] @6xl:leading-[0.92]")}
            placeholder="Hauptüberschrift"
          />
          <T as="p" path={["text"]} value={p.text} multiline className="mt-6 max-w-[520px] text-[16.5px] leading-[1.55] text-white/95 [text-shadow:0_1px_14px_rgba(20,14,22,0.55)] @2xl:text-[17.5px]" placeholder="Worum geht es?" />
          {(p.points.length > 0 || edit) && (
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-white/90">
              {p.points.map((point, i) => (
                <li key={i} className="group/item relative flex items-center gap-2">
                  <Check className="size-4 text-white" strokeWidth={1.6} aria-hidden="true" />
                  <T path={["points", i]} value={point} placeholder="Vorteil" />
                  <ItemTools path={["points"]} index={i} count={p.points.length} />
                </li>
              ))}
              <li>
                <AddItem path={["points"]} item="Neuer Vorteil" label="Vorteil" className="border-white/60 text-white" />
              </li>
            </ul>
          )}
        </div>

        {(p.note || edit) && (
          <div className="absolute right-[70px] top-[196px] hidden w-[170px] border-l border-white/55 pl-4 @6xl:block">
            <T path={["note"]} value={p.note} multiline className="block text-[10.5px] font-medium uppercase leading-[1.95] tracking-[0.17em] text-white [text-shadow:0_1px_10px_rgba(20,14,22,0.75)]" placeholder="Notiz" />
            <span className="absolute -left-px top-full mt-5 block h-12 w-px bg-white/55" aria-hidden="true" />
          </div>
        )}

        {/* search panel */}
        <form onSubmit={(e) => e.preventDefault()} className="mt-14 text-[#16130F] @2xl:mt-[88px] @5xl:mt-[104px]">
          <div className="flex" role="tablist" aria-label="Angebotsart">
            {(Object.keys(searchOptions) as Mode[]).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={mode === key}
                onClick={() => setMode(key)}
                className={cn(
                  "h-12 w-[124px] rounded-t-(--r) text-[14.5px] font-medium transition-colors duration-200 @2xl:w-[152px]",
                  mode === key ? "bg-(--p) text-(--p-on)" : "bg-[#F3EFE8]/85 text-[#16130F]/80 backdrop-blur hover:bg-[#F3EFE8]",
                )}
              >
                {key}
              </button>
            ))}
          </div>
          <div className="grid gap-4 rounded-(--r) rounded-tl-none bg-[#FBF8F2]/92 p-5 shadow-[0_30px_70px_-30px_rgba(10,8,6,0.65)] backdrop-blur-md @4xl:grid-cols-[1.45fr_1.1fr_1fr_auto] @4xl:items-end @4xl:gap-6 @4xl:p-7">
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium">Ort</span>
              <span className="relative block">
                <input className="h-11 w-full rounded-(--r) border border-[#16130F]/12 bg-white px-3.5 pr-10 text-[14px] outline-none placeholder:text-[#16130F]/45 focus:border-(--p)" placeholder="z. B. Stadt oder Postleitzahl" aria-label="Ort" />
                <MapPin className="pointer-events-none absolute right-3 top-1/2 size-[17px] -translate-y-1/2 text-[#16130F]/70" strokeWidth={1.5} aria-hidden="true" />
              </span>
            </label>
            {[
              { title: "Objektart", list: options.types },
              { title: "Preis bis", list: options.prices },
            ].map(({ title, list }) => (
              <label key={title} className="block">
                <span className="mb-1.5 block text-[13px] font-medium">{title}</span>
                <span className="relative block">
                  <select key={mode} className="h-11 w-full appearance-none rounded-(--r) border border-[#16130F]/12 bg-white px-3.5 pr-10 text-[14px] text-[#16130F]/75 outline-none focus:border-(--p)" aria-label={title}>
                    {list.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-[17px] -translate-y-1/2" strokeWidth={1.6} aria-hidden="true" />
                </span>
              </label>
            ))}
            <button type="submit" className={cn(solid, "h-[60px] whitespace-nowrap px-9 @4xl:h-16")}>
              <T path={["primary"]} value={p.primary} placeholder="Button" />
              <Arrow />
            </button>
          </div>
          {(p.secondary || edit) && (
            <a href="#offers" className="mt-4 inline-flex items-center gap-3 text-[14px] font-medium text-white/90 hover:text-white">
              <T path={["secondary"]} value={p.secondary} placeholder="Zweiter Link" />
              <Arrow />
            </a>
          )}
        </form>
      </div>
    </section>
  );
}

// ---------- stats: calm row of serif numbers ----------
function Stats({ block }: { block: StatsBlock }) {
  const { items } = block.props;
  return (
    <section className="bg-(--bg2)">
      <div className={cn(wrap, "grid grid-cols-2 gap-y-9 py-10 @4xl:flex @4xl:py-[46px]")}>
        {items.map((item, i) => (
          <div key={i} className="d-rise group/item relative border-(--p)/30 text-center @4xl:flex-1 @4xl:[&:not(:first-child)]:border-l">
            <T path={["items", i, "value"]} value={item.value} className={cn(serif, "block text-[40px] leading-none @2xl:text-[54px] @2xl:leading-none")} placeholder="100" />
            <T path={["items", i, "label"]} value={item.label} className="mt-3 block text-[14.5px] text-(--fg)/80" placeholder="Bezeichnung" />
            <ItemTools path={["items"]} index={i} count={items.length} />
          </div>
        ))}
      </div>
      <div className={cn(wrap, "pb-4 text-center empty:hidden")}>
        <AddItem path={["items"]} item={{ value: "100", label: "Bezeichnung" }} label="Kennzahl" />
      </div>
    </section>
  );
}

// ---------- cards: featured properties ----------
const specIcons = [House, BedDouble, Scaling];

function Cards({ block }: { block: CardsBlock }) {
  const { title, button, items } = block.props;
  return (
    <section id="offers" className="bg-(--bg) py-14 @4xl:py-[72px]">
      <div className={wrap}>
        <Head title={title} action={button} />
        <div className="mt-8 grid gap-6 @2xl:grid-cols-2 @5xl:grid-cols-3">
          {items.map((item, i) => (
            <article key={i} className={cn(panel, "d-rise group/item relative overflow-hidden transition-shadow duration-300 hover:shadow-[0_30px_60px_-36px_rgba(22,19,15,0.45)]")}>
              <div className="relative">
                <Img src={item.image} path={["items", i, "image"]} alt={item.title} className="aspect-[11/8] w-full" imgClassName="transition-transform duration-[900ms] group-hover/item:scale-[1.04]" />
                <T
                  path={["items", i, "price"]}
                  value={item.price}
                  className="absolute right-4 top-4 rounded-[6px] bg-[#16130F]/90 px-3.5 py-2 text-[13.5px] font-semibold leading-none tracking-[0.02em] text-white backdrop-blur"
                  placeholder="Preis"
                />
              </div>
              <div className="p-6 @2xl:px-7">
                <p className="flex items-center gap-2 text-[12.5px] font-medium text-(--fg)">
                  <MapPin className="size-[15px] shrink-0" strokeWidth={1.5} aria-hidden="true" />
                  <T path={["items", i, "tag"]} value={item.tag} placeholder="Ort" />
                </p>
                <p className="mt-4 flex flex-wrap items-center gap-y-1 text-[12.5px] text-(--mut)">
                  <Parts value={item.text} path={["items", i, "text"]} separator="·">
                    {(part, j) => {
                      const Icon = specIcons[j % specIcons.length];
                      return (
                        <span key={j} className="flex items-center gap-2 border-(--line) [&:not(:first-child)]:ml-3.5 [&:not(:first-child)]:border-l [&:not(:first-child)]:pl-3.5">
                          <Icon className="size-[15px] shrink-0 text-(--fg)/75" strokeWidth={1.5} aria-hidden="true" />
                          {part}
                        </span>
                      );
                    }}
                  </Parts>
                </p>
                <div className="mt-5 flex items-center justify-between gap-4">
                  <T as="h3" path={["items", i, "title"]} value={item.title} className={cn(serif, "block text-[24px] leading-[1.15] @2xl:text-[26px] @2xl:leading-[1.15]")} placeholder="Titel" />
                  <Arrow className="transition-transform duration-300 group-hover/item:translate-x-1" />
                </div>
              </div>
              <ItemTools path={["items"]} index={i} count={items.length} />
            </article>
          ))}
        </div>
        <div className="mt-5 empty:hidden">
          <AddItem path={["items"]} item={{ image: "", title: "Neues Objekt", text: "Wohnung · 3 Zimmer · 90 m²", price: "€ 0", tag: "Ort" }} label="Objekt" />
        </div>
      </div>
    </section>
  );
}

// ---------- about: "sell your property" with the valuation card ----------
function About({ block }: { block: AboutBlock }) {
  const edit = useEdit();
  const { eyebrow, title, text, image, points, flip, button, note } = block.props;
  return (
    <section id="about" className="bg-(--bg2)">
      <div className={cn("mx-auto grid max-w-[1480px] @5xl:grid-cols-[minmax(0,0.78fr)_minmax(0,1fr)_minmax(0,0.98fr)]")}>
        <Img src={image} path={["image"]} alt="" className={cn("d-rise aspect-[16/11] w-full @5xl:aspect-auto @5xl:h-full @5xl:min-h-[600px]", flip && "@5xl:order-3")} />
        <div className="d-rise px-5 py-12 @2xl:px-10 @5xl:self-center @5xl:px-[58px] @5xl:py-[70px]">
          <Caps value={eyebrow} />
          <T as="h2" path={["title"]} value={title} multiline className={huge} placeholder="Überschrift" />
          <T as="p" path={["text"]} value={text} multiline className={cn(lead, "mt-7 max-w-[440px] text-(--fg)/85")} placeholder="Text" />
          {(points.length > 0 || edit) && (
            <ul className="mt-6 space-y-2.5">
              {points.map((point, i) => (
                <li key={i} className="group/item relative flex items-center gap-3 text-[15px]">
                  <Check className="size-4 shrink-0 text-(--p)" strokeWidth={1.8} aria-hidden="true" />
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
            <a href="#contact" className={cn(solid, "mt-8")}>
              <T path={["button"]} value={button} placeholder="Button" />
              <Arrow />
            </a>
          )}
        </div>
        <div className="px-5 pb-12 @2xl:px-10 @5xl:self-center @5xl:py-9 @5xl:pl-0 @5xl:pr-[58px]">
          <form onSubmit={(e) => e.preventDefault()} className={cn(panel, "d-rise p-6 shadow-[0_30px_70px_-50px_rgba(22,19,15,0.5)] @2xl:p-8")}>
            <T as="h3" path={["note"]} value={note} className={cn(serif, "block text-[26px] leading-[1.15] @2xl:text-[29px] @2xl:leading-[1.15]")} placeholder="Titel der Karte" />
            <p className="mt-3 text-[14px] leading-[1.6] text-(--mut)">Erhalten Sie in wenigen Minuten eine fundierte Einschätzung des aktuellen Marktwerts Ihrer Immobilie.</p>
            <span className="mt-5 block h-px w-7 bg-(--fg)/25" aria-hidden="true" />
            <label className="mt-5 block">
              <span className={fieldLabel}>Objektart</span>
              <span className="relative block">
                <select className={cn(field, "pr-10 text-(--mut)")} defaultValue="" aria-label="Objektart">
                  <option value="" disabled>
                    Bitte wählen
                  </option>
                  <option>Wohnung</option>
                  <option>Einfamilienhaus</option>
                  <option>Mehrfamilienhaus</option>
                  <option>Villa</option>
                  <option>Grundstück</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-[17px] -translate-y-1/2 text-(--fg)" strokeWidth={1.6} aria-hidden="true" />
              </span>
            </label>
            <label className="mt-4 block">
              <span className={fieldLabel}>Adresse</span>
              <input className={field} placeholder="Straße, Hausnummer, Ort" aria-label="Adresse" />
            </label>
            <label className="mt-4 block">
              <span className={fieldLabel}>E-Mail</span>
              <input type="email" className={field} placeholder="Ihre E-Mail-Adresse" aria-label="E-Mail" />
            </label>
            <button type="submit" className={cn(solid, "mt-6 w-full")}>
              Jetzt bewerten
              <Arrow />
            </button>
            <p className="mt-5 flex items-center gap-2.5 text-[12px] text-(--mut)">
              <Lock className="size-[14px] shrink-0 text-(--fg)/80" strokeWidth={1.7} aria-hidden="true" />
              100 % kostenlos, unverbindlich und diskret.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

// ---------- services: hairline cards with thin icons ----------
function Services({ block }: { block: ServicesBlock }) {
  const { title, button, items } = block.props;
  return (
    <section id="services" className="bg-(--bg) py-14 @4xl:py-[72px]">
      <div className={wrap}>
        <Head title={title} action={button} />
        <div className="mt-8 grid gap-5 @2xl:grid-cols-2 @5xl:grid-cols-4 @5xl:gap-6">
          {items.map((item, i) => (
            <article key={i} className={cn(panel, "d-rise group/item relative p-7 transition-[border-color,box-shadow] duration-300 hover:border-(--p)/45 hover:shadow-[0_26px_50px_-38px_rgba(22,19,15,0.5)] @2xl:p-9")}>
              <IconPick name={item.icon} path={["items", i, "icon"]} className="rounded-(--r) text-(--p)" iconClassName="size-[50px]" strokeWidth={1} />
              <T as="h3" path={["items", i, "title"]} value={item.title} className={cn(serif, "mt-6 block text-[25px] leading-[1.15] @2xl:text-[27px] @2xl:leading-[1.15]")} placeholder="Leistung" />
              <T as="p" path={["items", i, "text"]} value={item.text} multiline className="mt-2.5 text-[15px] leading-[1.6] text-(--mut)" placeholder="Beschreibung" />
              <span className={cn(link, "mt-6 group-hover/item:gap-4")}>
                Mehr erfahren
                <Arrow />
              </span>
              <ItemTools path={["items"]} index={i} count={items.length} />
            </article>
          ))}
        </div>
        <div className="mt-5 empty:hidden">
          <AddItem path={["items"]} item={{ icon: "house", title: "Neue Leistung", text: "Kurze Beschreibung." }} label="Leistung" />
        </div>
      </div>
    </section>
  );
}

// ---------- team: the first person as a large profile with a quote ----------
/** "Sophie Linden" → "S. Linden", written across the photo like a signature. */
const signature = (name: string) => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  return words.length > 1 ? `${words[0][0]}. ${words[words.length - 1]}` : name;
};

function Team({ block }: { block: TeamBlock }) {
  const edit = useEdit();
  const { eyebrow, title, text, items } = block.props;
  const [first, ...more] = items;
  return (
    <section id="team" className="bg-(--bg2)">
      <div className="mx-auto grid max-w-[1480px] @5xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.55fr)]">
        {first && (
          <div className="d-rise group/item relative">
            <Img src={first.image} path={["items", 0, "image"]} alt={first.name} className="aspect-[5/4] w-full @5xl:aspect-auto @5xl:h-full @5xl:min-h-[500px]" imgClassName="object-[30%_center]" />
            <span className="d-script pointer-events-none absolute bottom-7 left-8 -rotate-6 text-[38px] leading-none text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.45)] @2xl:text-[46px]" aria-hidden="true">
              {signature(first.name)}
            </span>
            <ItemTools path={["items"]} index={0} count={items.length} />
          </div>
        )}
        <div className="d-rise grid gap-10 px-5 py-12 @2xl:px-10 @4xl:grid-cols-[minmax(0,1fr)_auto] @5xl:self-center @5xl:px-[66px] @5xl:py-12">
          <div>
            <Caps value={eyebrow} className="max-w-[230px]" />
            <T as="h2" path={["title"]} value={title} multiline className={cn(serif, "block text-[38px] italic leading-[1.08] @2xl:text-[50px] @2xl:leading-[1.06] @6xl:text-[60px] @6xl:leading-[1.04]")} placeholder="Zitat" />
            <T as="p" path={["text"]} value={text} multiline className={cn(lead, "mt-6 max-w-[430px] text-(--fg)/85")} placeholder="Ein paar persönliche Sätze" />
            {first && (
              <p className="mt-7">
                <T path={["items", 0, "name"]} value={first.name} className="block text-[17px] font-semibold" placeholder="Name" />
                <T path={["items", 0, "role"]} value={first.role} className="mt-1 block text-[14px] text-(--mut)" placeholder="Aufgabe" />
              </p>
            )}
          </div>
          {first && (
            <div className="border-(--line) @4xl:self-center @4xl:border-l @4xl:pl-10">
              <ul className="space-y-6">
                <Parts value={first.text} path={["items", 0, "text"]} separator={"\n"}>
                  {(part, j) => (
                    <li key={j} className="flex items-center gap-4 text-[15px] font-medium">
                      <span className="flex size-[30px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-(--p) text-(--p)">
                        <Check className="size-4" strokeWidth={2} aria-hidden="true" />
                      </span>
                      {part}
                    </li>
                  )}
                </Parts>
              </ul>
              <a href="#contact" className={cn(solid, "mt-9")}>
                Mehr über uns
                <Arrow />
              </a>
            </div>
          )}
        </div>
      </div>
      {(more.length > 0 || edit) && (
        <div className={cn(wrap, "pb-12 pt-10")}>
          <div className="grid gap-5 @2xl:grid-cols-2 @5xl:grid-cols-4">
            {more.map((item, k) => {
              const i = k + 1;
              return (
                <article key={i} className={cn(panel, "group/item relative overflow-hidden")}>
                  <Img src={item.image} path={["items", i, "image"]} alt={item.name} className="aspect-[4/3] w-full" />
                  <div className="p-5">
                    <T as="h3" path={["items", i, "name"]} value={item.name} className={cn(serif, "block text-[23px] leading-[1.15]")} placeholder="Name" />
                    <T path={["items", i, "role"]} value={item.role} className="mt-1 block text-[13.5px] text-(--p)" placeholder="Aufgabe" />
                    <T as="p" path={["items", i, "text"]} value={item.text} multiline className="mt-2 text-[14px] leading-[1.55] text-(--mut)" placeholder="Ein Satz zur Person" />
                  </div>
                  <ItemTools path={["items"]} index={i} count={items.length} />
                </article>
              );
            })}
          </div>
          <AddItem path={["items"]} item={{ image: "", name: "Name", role: "Aufgabe", text: "" }} label="Person" className="mt-5" />
        </div>
      )}
    </section>
  );
}

// ---------- quotes ----------
function Quotes({ block }: { block: QuotesBlock }) {
  const { title, text, items } = block.props;
  return (
    <section id="quotes" className="bg-(--bg) py-14 @4xl:py-[64px]">
      <div className={wrap}>
        <Head title={title} action={text} actionPath={["text"]} />
        <div className="mt-8 grid gap-5 @4xl:grid-cols-3 @5xl:gap-6">
          {items.map((item, i) => (
            <figure key={i} className={cn(panel, "d-rise group/item relative flex gap-4 p-6 @2xl:gap-5 @2xl:p-7")}>
              <Quote className="mt-0.5 size-8 shrink-0 -scale-x-100 text-(--p)" strokeWidth={1.3} aria-hidden="true" />
              <div className="min-w-0">
                <T as="blockquote" path={["items", i, "quote"]} value={item.quote} multiline className="text-[14.5px] leading-[1.6] text-(--fg)/85" placeholder="Zitat" />
                <Stars className="mt-4 gap-1 text-[17px] text-(--p)" />
                <figcaption className="mt-4">
                  <T path={["items", i, "name"]} value={item.name} className="block text-[15px] font-semibold" placeholder="Name" />
                  <T path={["items", i, "role"]} value={item.role} className="mt-0.5 block text-[14px] text-(--mut)" placeholder="Rolle" />
                </figcaption>
              </div>
              <ItemTools path={["items"]} index={i} count={items.length} />
            </figure>
          ))}
        </div>
        <div className="mt-5 empty:hidden">
          <AddItem path={["items"]} item={{ quote: "„Hier steht eine Kundenstimme.“", name: "Vorname N.", role: "Käufer" }} label="Stimme" />
        </div>
      </div>
    </section>
  );
}

// ---------- steps ----------
function Steps({ block }: { block: StepsBlock }) {
  const { eyebrow, title, items } = block.props;
  return (
    <section id="steps" className="bg-(--bg) py-14 @4xl:py-[72px]">
      <div className={wrap}>
        <div className="d-rise">
          <Caps value={eyebrow} className="mb-4" />
          <T as="h2" path={["title"]} value={title} multiline className={h2} placeholder="Überschrift" />
        </div>
        <ol className={cn("mt-10 grid gap-x-8 gap-y-9 border-t border-(--line) pt-9 @2xl:grid-cols-2", items.length >= 4 ? "@5xl:grid-cols-4" : "@5xl:grid-cols-3")}>
          {items.map((item, i) => (
            <li key={i} className="d-rise group/item relative">
              <span className={cn(serif, "block text-[46px] leading-none text-(--p)")}>{String(i + 1).padStart(2, "0")}</span>
              <T as="h3" path={["items", i, "title"]} value={item.title} className={cn(serif, "mt-4 block text-[25px] leading-[1.15]")} placeholder="Schritt" />
              <T as="p" path={["items", i, "text"]} value={item.text} multiline className="mt-2 text-[15px] leading-[1.6] text-(--mut)" placeholder="Beschreibung" />
              <ItemTools path={["items"]} index={i} count={items.length} />
            </li>
          ))}
        </ol>
        <div className="mt-5 empty:hidden">
          <AddItem path={["items"]} item={{ title: "Neuer Schritt", text: "Beschreibung." }} label="Schritt" />
        </div>
      </div>
    </section>
  );
}

// ---------- gallery ----------
function Gallery({ block }: { block: GalleryBlock }) {
  const { eyebrow, title, images } = block.props;
  return (
    <section id="gallery" className="bg-(--bg) py-14 @4xl:py-[72px]">
      <div className={wrap}>
        <div className="d-rise">
          <Caps value={eyebrow} className="mb-4" />
          <T as="h2" path={["title"]} value={title} multiline className={h2} placeholder="Überschrift" />
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 @4xl:grid-cols-3 @5xl:gap-6">
          {images.map((image, i) => (
            <div key={i} className={cn("d-rise group/item relative", i % 5 === 0 && "col-span-2")}>
              <Img src={image} path={["images", i]} alt="" className={cn("w-full rounded-(--r)", i % 5 === 0 ? "aspect-[2/1]" : "aspect-[4/3]")} />
              <ItemTools path={["images"]} index={i} count={images.length} />
            </div>
          ))}
        </div>
        <div className="mt-5 empty:hidden">
          <AddItem path={["images"]} item="" label="Bild" />
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
    <section id="faq" className="bg-(--bg) py-14 @4xl:py-[72px]">
      <div className={cn(wrap, "grid gap-10 @5xl:grid-cols-[0.85fr_1.15fr] @5xl:gap-20")}>
        <div className="d-rise">
          <Caps value={eyebrow} className="mb-4" />
          <T as="h2" path={["title"]} value={title} multiline className={h2} placeholder="Überschrift" />
          <T as="p" path={["text"]} value={text} multiline className={cn(lead, "mt-5 max-w-[400px]")} placeholder="Kurzer Einleitungstext" />
        </div>
        <div>
          <div className="border-t border-(--line)">
            {items.map((item, i) => (
              <details key={i} open={!!edit || i === 0} className="group/item group/faq relative border-b border-(--line)">
                <summary className={cn(serif, "flex cursor-pointer list-none items-center justify-between gap-5 py-5 text-[23px] leading-[1.2] [&::-webkit-details-marker]:hidden")}>
                  <T path={["items", i, "q"]} value={item.q} placeholder="Frage" />
                  <Plus className="size-5 shrink-0 text-(--p) transition-transform duration-200 group-open/faq:rotate-45" strokeWidth={1.4} aria-hidden="true" />
                </summary>
                <T as="p" path={["items", i, "a"]} value={item.a} multiline className="max-w-[600px] pb-6 text-[15.5px] leading-[1.65] text-(--mut)" placeholder="Antwort" />
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

// ---------- call to action: dusk photo band ----------
function Cta({ block }: { block: CtaBlock }) {
  const { eyebrow, title, text, button, image } = block.props;
  return (
    <section className="relative isolate overflow-hidden bg-[#1d1c26] text-white">
      <Img src={image} path={["image"]} alt="" chip="tr" className="absolute inset-0 -z-20 h-full w-full bg-transparent" imgClassName="object-[center_58%]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-[#1b1c2a]/90 via-[#1b1c2a]/55 to-[#1b1c2a]/20" />
      <div className={cn(wrap, "d-rise flex flex-col gap-8 py-14 @4xl:flex-row @4xl:items-center @4xl:justify-between @4xl:py-[58px]")}>
        <div>
          <T path={["eyebrow"]} value={eyebrow} className={cn(caps, "mb-4 block text-white/85")} placeholder="Kurzzeile" />
          <T as="h2" path={["title"]} value={title} multiline className={cn(serif, "block text-[36px] leading-[1.08] @2xl:text-[46px] @2xl:leading-[1.08] @5xl:text-[52px] @5xl:leading-[1.08]")} placeholder="Aufforderung" />
          <T as="p" path={["text"]} value={text} multiline className="mt-4 max-w-[520px] text-[16px] leading-[1.6] text-white/85" placeholder="Text" />
        </div>
        <a href="#contact" className="inline-flex h-[56px] shrink-0 items-center justify-center gap-3.5 self-start whitespace-nowrap rounded-(--r) border border-white/80 px-8 text-[14.5px] font-medium text-white transition-colors duration-200 hover:bg-white hover:text-[#16130F] @4xl:self-center">
          <T path={["button"]} value={button} placeholder="Button" />
          <Arrow />
        </a>
      </div>
    </section>
  );
}

// ---------- contact ----------
function Contact({ block, doc }: { block: ContactBlock; doc: DemoDoc }) {
  const { eyebrow, title, text, hours, form } = block.props;
  const { meta } = doc;
  const row = "flex items-start gap-4 text-[15.5px]";
  const icon = "mt-0.5 size-[19px] shrink-0 text-(--p)";
  return (
    <section id="contact" className="bg-(--bg2) py-14 @4xl:py-[80px]">
      <div className={cn(wrap, "grid gap-12 @5xl:grid-cols-[1fr_1.05fr] @5xl:gap-20")}>
        <div className="d-rise">
          <Caps value={eyebrow} className="mb-5" />
          <T as="h2" path={["title"]} value={title} multiline className={huge} placeholder="Überschrift" />
          <T as="p" path={["text"]} value={text} multiline className={cn(lead, "mt-6 max-w-[430px] text-(--fg)/85")} placeholder="Kurzer Einleitungstext" />
          <ul className="mt-9 space-y-5 border-t border-(--line) pt-8">
            <li className={row}>
              <MapPin className={icon} strokeWidth={1.4} aria-hidden="true" />
              <span>
                <T meta="address" value={meta.address} className="block font-medium" placeholder="Straße und Hausnummer" />
                <T meta="city" value={meta.city} className="block text-(--mut)" placeholder="PLZ Ort" />
              </span>
            </li>
            <li className={row}>
              <Phone className={icon} strokeWidth={1.4} aria-hidden="true" />
              <T meta="phone" value={meta.phone} className="font-medium" placeholder="Telefon" />
            </li>
            <li className={row}>
              <Mail className={icon} strokeWidth={1.4} aria-hidden="true" />
              <T meta="email" value={meta.email} className="font-medium" placeholder="E-Mail" />
            </li>
            <li className={row}>
              <Clock className={icon} strokeWidth={1.4} aria-hidden="true" />
              <span className="w-full max-w-[330px]">
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
        <div className="d-rise space-y-6 self-start">
          <MapArt className="aspect-[16/7] w-full rounded-(--r) border border-(--line)" label={meta.address} />
          {form && (
            <form className={cn(panel, "space-y-4 p-6 @2xl:p-8")} onSubmit={(e) => e.preventDefault()}>
              <p className={cn(serif, "text-[27px] leading-[1.15]")}>Schreiben Sie uns</p>
              <div className="grid gap-4 @2xl:grid-cols-2">
                <label className="block">
                  <span className={fieldLabel}>Name</span>
                  <input className={field} placeholder="Ihr Name" aria-label="Name" />
                </label>
                <label className="block">
                  <span className={fieldLabel}>Telefon</span>
                  <input className={field} placeholder="Für Rückfragen" aria-label="Telefon" />
                </label>
              </div>
              <label className="block">
                <span className={fieldLabel}>E-Mail</span>
                <input type="email" className={field} placeholder="Ihre E-Mail-Adresse" aria-label="E-Mail" />
              </label>
              <label className="block">
                <span className={fieldLabel}>Ihr Anliegen</span>
                <textarea className={cn(field, "h-28 resize-none py-3")} placeholder="Kaufen, verkaufen oder vermieten – worum geht es?" aria-label="Nachricht" />
              </label>
              <button type="submit" className={cn(solid, "w-full")}>
                Nachricht senden
                <Arrow />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ---------- footer ----------
function Footer({ block, doc }: { block: FooterBlock; doc: DemoDoc }) {
  const { text, links } = block.props;
  const { meta } = doc;
  const heading = "mb-4 block text-[14px] font-semibold text-(--fg)";
  const list = "space-y-2.5 text-[14.5px] text-(--mut)";
  return (
    <footer className="bg-(--bg) pb-9 pt-12 text-(--fg) @4xl:pt-14">
      <div className={cn(wrap, "@5xl:px-[80px]")}>
        <div className="grid gap-10 @4xl:grid-cols-[1.9fr_1fr_1fr_1.25fr]">
          <div>
            <Wordmark doc={doc} />
            <T as="p" path={["text"]} value={text} multiline className="mt-5 max-w-[320px] text-[14.5px] leading-[1.65] text-(--mut)" placeholder="Kurzer Satz" />
            <div className="mt-6 flex gap-5 text-(--fg)" aria-hidden="true">
              <Instagram className="size-[19px]" strokeWidth={1.5} />
              <Linkedin className="size-[19px]" strokeWidth={1.5} />
              <Mail className="size-[19px]" strokeWidth={1.5} />
            </div>
          </div>
          <div>
            <span className={heading}>Navigation</span>
            <ul className={list}>
              {navLinks(doc).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <span className={heading}>Rechtliches</span>
            <ul className={list}>
              {links.map((item, i) => (
                <li key={i}>
                  <T path={["links", i]} value={item} placeholder="Link" />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className={heading}>Kontakt</span>
            <ul className={list}>
              <li className="flex gap-3.5">
                <MapPin className="mt-1 size-4 shrink-0 text-(--fg)" strokeWidth={1.5} aria-hidden="true" />
                <span>
                  {meta.company}
                  <br />
                  {meta.address}
                  <br />
                  {meta.city}
                </span>
              </li>
              <li className="flex gap-3.5">
                <Phone className="mt-1 size-4 shrink-0 text-(--fg)" strokeWidth={1.5} aria-hidden="true" />
                {meta.phone}
              </li>
              <li className="flex gap-3.5">
                <Mail className="mt-1 size-4 shrink-0 text-(--fg)" strokeWidth={1.5} aria-hidden="true" />
                <span className="break-all">{meta.email}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-11 flex flex-col gap-3 border-t border-(--line) pt-6 text-[13px] text-(--mut) @4xl:flex-row @4xl:items-center @4xl:justify-between">
          <p>
            © {new Date().getFullYear()} {meta.company}. Alle Rechte vorbehalten.
          </p>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em]">
            {meta.industry} · {meta.city.replace(/^\d+\s*/, "")}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function LindenBlock({ block, doc }: SkinProps) {
  switch (block.type) {
    case "nav":
      return <Nav block={block} doc={doc} />;
    case "hero":
      return <Hero block={block} />;
    case "stats":
      return <Stats block={block} />;
    case "cards":
      return <Cards block={block} />;
    case "about":
      return <About block={block} />;
    case "services":
      return <Services block={block} />;
    case "team":
      return <Team block={block} />;
    case "quotes":
      return <Quotes block={block} />;
    case "steps":
      return <Steps block={block} />;
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
