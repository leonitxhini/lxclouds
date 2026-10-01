import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowRight, ChartNoAxesColumn, CodeXml, Monitor, Play, Plus, Rocket, Sparkles, Zap, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { Link } from "wouter";
import { Button } from "@/components/Button";
import { useContact } from "@/components/ContactDialog";
import { projects } from "@/data/projects";
import { useSectionNav } from "@/hooks/use-page";
import { useT } from "@/i18n";
import { asset, cn } from "@/lib/utils";

function useWideScreen() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1280px)");
    const update = () => setWide(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return wide;
}

/** Layout of the four floating cards on the 1440px stage, matched to the reference composition. */
const cardLayout: { icon: LucideIcon; place: string; rotate: number; depth: number; delay: number; from: number }[] = [
  { icon: Zap, place: "left-[calc(50%-560px)] top-[43px] w-[256px]", rotate: 8, depth: 30, delay: 0, from: -40 },
  { icon: CodeXml, place: "left-[calc(50%-590px)] top-[262px] w-[266px]", rotate: -9, depth: 44, delay: 1.7, from: -40 },
  { icon: Rocket, place: "left-[calc(50%+292px)] top-[52px] w-[268px]", rotate: -8, depth: 36, delay: 0.9, from: 40 },
  { icon: Sparkles, place: "left-[calc(50%+336px)] top-[280px] w-[270px]", rotate: 11, depth: 24, delay: 2.5, from: 40 },
];

const pillarIcons: LucideIcon[] = [Monitor, CodeXml, Zap, ChartNoAxesColumn];

type CardCopy = { title: string; body: string; more: string[] };

function CardBody({
  copy,
  icon: Icon,
  open,
  onToggle,
  labels,
}: {
  copy: CardCopy;
  icon: LucideIcon;
  open: boolean;
  onToggle: () => void;
  labels: { more: string; less: string };
}) {
  return (
    <div className="glass-card rounded-[26px] px-[18px] py-4 text-left transition-shadow duration-500 hover:shadow-lift">
      <div className="flex items-center gap-3.5">
        <span className="flex size-[50px] shrink-0 items-center justify-center rounded-[16px] bg-accent/[0.09] text-accent-ink">
          <Icon className="size-[23px]" strokeWidth={1.9} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[16px] font-semibold leading-tight tracking-[-0.01em]">{copy.title}</p>
          <p className="mt-1 text-[12.5px] leading-[1.38] text-muted">{copy.body}</p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-label={`${open ? labels.less : labels.more}: ${copy.title}`}
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-accent-ink shadow-[0_6px_16px_-6px_rgba(96,88,220,0.5)] transition-[background-color,color,rotate] duration-300 hover:bg-accent hover:text-white"
          style={{ rotate: open ? "45deg" : "0deg" }}
        >
          <Plus className="size-[17px]" strokeWidth={2.2} aria-hidden="true" />
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            {copy.more.map((line) => (
              <li key={line} className="flex items-center gap-2.5 pt-2.5 text-[13px] text-ink/80 first:pt-4">
                <span className="size-[5px] shrink-0 rounded-full bg-accent" aria-hidden="true" />
                {line}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Wrapper that drifts with the pointer (depth) and with the page scroll (speed). */
function Drift({
  mx,
  my,
  scroll,
  depth,
  speed,
  className,
  children,
}: {
  mx: MotionValue<number>;
  my: MotionValue<number>;
  scroll: MotionValue<number>;
  depth: number;
  speed: number;
  className?: string;
  children?: ReactNode;
}) {
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform([my, scroll], ([m, s]: number[]) => m * depth + s * speed);
  return (
    <motion.div className={cn("absolute", className)} style={{ x, y }}>
      {children}
    </motion.div>
  );
}

/** Soft colour fields that fill the whole hero, behind everything else. */
function Atmosphere() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(760px 560px at 0% 22%, rgba(190,182,255,0.55), transparent 68%)",
            "radial-gradient(760px 560px at 100% 26%, rgba(196,190,255,0.55), transparent 68%)",
            "radial-gradient(900px 520px at 12% 96%, rgba(206,200,255,0.5), transparent 70%)",
            "radial-gradient(900px 520px at 90% 100%, rgba(208,202,255,0.5), transparent 70%)",
            "linear-gradient(180deg, #F4F2FF 0%, #F6F5FC 62%, #F8F7F4 100%)",
          ].join(","),
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-[200px] bg-gradient-to-b from-paper/0 to-paper" />
    </div>
  );
}

/**
 * The glass is a path-traced render (see replit.md): a 2400×1100 plate with ribbons, plates, orbit lines
 * and the shadows of the spheres, plus the spheres themselves as separate cut-outs so they can float.
 * Positions are stage px, matching the scene the render was made from.
 */
const spheres: { file: string; x: number; y: number; r: number; depth: number; speed: number; delay: number }[] = [
  { file: "a", x: 202, y: 176, r: 23, depth: 34, speed: -70, delay: 0 },
  { file: "b", x: 346, y: 436, r: 20, depth: 46, speed: -130, delay: 2 },
  { file: "c", x: 1350, y: 238, r: 52, depth: 28, speed: -160, delay: 3.5 },
  { file: "d", x: 1357, y: 11, r: 13, depth: 18, speed: -40, delay: 1.2 },
];

function GlassPlate({ mx, my, scroll }: { mx: MotionValue<number>; my: MotionValue<number>; scroll: MotionValue<number> }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      className={cn(
        "pointer-events-none absolute left-1/2 top-[-200px] z-0 h-[1100px] w-screen -translate-x-1/2 overflow-hidden transition-opacity duration-1000",
        loaded ? "opacity-100" : "opacity-0",
      )}
      aria-hidden="true"
    >
      <Drift mx={mx} my={my} scroll={scroll} depth={12} speed={50} className="left-1/2 top-0 w-[2400px] -translate-x-1/2">
        <img
          src={asset("/hero/glass-plate.webp")}
          alt=""
          width={2400}
          height={1100}
          decoding="async"
          fetchPriority="high"
          onLoad={() => setLoaded(true)}
          className="hero-plate-mask block h-[1100px] w-[2400px] max-w-none"
        />
      </Drift>
    </div>
  );
}

function GlassSpheres({ mx, my, scroll }: { mx: MotionValue<number>; my: MotionValue<number>; scroll: MotionValue<number> }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[2]" aria-hidden="true">
      {spheres.map((s) => (
        <Drift key={s.file} mx={mx} my={my} scroll={scroll} depth={s.depth} speed={s.speed} className="left-1/2 top-0">
          <img
            src={asset(`/hero/sphere-${s.file}.webp`)}
            alt=""
            width={s.r * 2}
            height={s.r * 2}
            decoding="async"
            className="max-w-none animate-drift"
            style={{ marginLeft: s.x - 720 - s.r, marginTop: s.y - s.r, width: s.r * 2, height: s.r * 2, animationDelay: `-${s.delay}s` }}
          />
        </Drift>
      ))}
    </div>
  );
}

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.95, delay, ease: [0.16, 1, 0.3, 1] as const },
});

export function Hero() {
  const t = useT().hero;
  const openContact = useContact();
  const { goTo } = useSectionNav();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [openCard, setOpenCard] = useState<number | null>(null);
  const wide = useWideScreen();

  // pointer position, -0.5…0.5 from the centre of the hero
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const mx = useSpring(px, { stiffness: 55, damping: 18, mass: 0.6 });
  const my = useSpring(py, { stiffness: 55, damping: 18, mass: 0.6 });

  // scrolling out: the copy sinks and fades, the glass drifts at its own speeds
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scroll = useTransform(scrollYProgress, (v) => (reduce ? 0 : v));
  const copyY = useTransform(scroll, [0, 1], [0, 90]);
  const copyOpacity = useTransform(scroll, [0, 0.7], [1, 0]);

  function onPointerMove(e: PointerEvent<HTMLElement>) {
    if (reduce || e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  const labels = { more: t.more, less: t.less };
  const toggle = (i: number) => setOpenCard((cur) => (cur === i ? null : i));

  return (
    <section
      ref={ref}
      className="relative flex flex-col justify-center overflow-clip pt-[68px] xl:min-h-[max(100svh,760px)]"
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      <Atmosphere />

      {/* phones and tablets: the same rendered spheres, placed around the copy */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden xl:hidden" aria-hidden="true">
        {[
          "right-[-46px] top-[176px] w-[112px]",
          "left-[-28px] top-[440px] w-[64px] [animation-delay:-2.4s]",
          "right-[10px] top-[84px] w-[34px] [animation-delay:-4s]",
        ].map((place) => (
          <img
            key={place}
            src={asset("/hero/sphere-c.webp")}
            alt=""
            width={104}
            height={104}
            className={cn("absolute h-auto animate-drift drop-shadow-[0_14px_18px_rgba(88,78,200,0.28)]", place)}
          />
        ))}
      </div>

      {/* lets the render dissolve into the page colour wherever the hero ends; sits between plate and spheres */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] hidden h-[220px] bg-gradient-to-b from-paper/0 to-paper xl:block" aria-hidden="true" />

      {/* the 1440px stage the reference composition is laid out on */}
      <div className="relative mx-auto w-full max-w-[1440px]">
        {wide && <GlassPlate mx={mx} my={my} scroll={scroll} />}
        {wide && <GlassSpheres mx={mx} my={my} scroll={scroll} />}

        {/* above the copy block, which spans the full width; only the cards themselves take clicks */}
        <div className="pointer-events-none absolute inset-0 z-[4] hidden xl:block" role="group" aria-label={t.cardsLabel}>
          {t.cards.map((copy, i) => {
            const layout = cardLayout[i];
            const open = openCard === i;
            return (
              <Drift
                key={copy.title}
                mx={mx}
                my={my}
                scroll={scroll}
                depth={layout.depth}
                speed={-60 - i * 26}
                className={cn("pointer-events-auto", layout.place, open ? "z-30" : "z-10")}
              >
                <motion.div
                  initial={{ opacity: 0, x: layout.from, rotate: layout.rotate * 1.6 }}
                  animate={{ opacity: 1, x: 0, rotate: open ? 0 : layout.rotate, scale: open ? 1.04 : 1 }}
                  transition={{ duration: 1.1, delay: openCard === null && !open ? 0.3 + i * 0.1 : 0, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="animate-drift" style={{ animationDelay: `-${layout.delay}s` }}>
                    <CardBody copy={copy} icon={layout.icon} open={open} onToggle={() => toggle(i)} labels={labels} />
                  </div>
                </motion.div>
              </Drift>
            );
          })}
        </div>

        <motion.div
          style={{ y: copyY, opacity: copyOpacity }}
          className="relative z-[3] px-5 pb-12 pt-10 text-center md:px-8 xl:pb-7 xl:pt-[66px]"
        >
          <motion.p
            {...rise(0)}
            className="mx-auto inline-flex min-h-[34px] items-center gap-2.5 rounded-full border border-white/70 bg-accent/[0.08] px-4 py-1.5 text-[12.5px] font-medium text-accent-ink"
          >
            <span className="size-[9px] shrink-0 rounded-full bg-accent" aria-hidden="true" />
            {t.eyebrow}
          </motion.p>

          <h1 className="mx-auto mt-7 max-w-[820px] text-balance text-[40px] font-semibold leading-[1.05] tracking-[-0.038em] sm:text-[54px] xl:mt-9 xl:text-[61px]">
            <motion.span {...rise(0.08)} className="block">
              {t.title1}
            </motion.span>
            <motion.span
              {...rise(0.16)}
              className="block bg-[linear-gradient(92deg,#5468EE_0%,#7A66F2_30%,#B56BE6_62%,#9469F2_100%)] bg-clip-text pb-[0.12em] text-transparent"
            >
              {t.title2}
            </motion.span>
          </h1>

          <motion.p {...rise(0.26)} className="mx-auto mt-3 max-w-[510px] text-[17px] leading-[1.5] text-muted xl:text-[17.5px]">
            {t.sub}
          </motion.p>

          <motion.div {...rise(0.36)} className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button className="h-[48px] w-full px-[30px] text-[15px] sm:h-[46px] sm:w-auto" onClick={openContact}>
              {t.talk}
            </Button>
            <Link
              href="/work"
              className="group/btn inline-flex h-[48px] w-full items-center justify-center gap-4 rounded-full border border-white bg-white/90 pl-[26px] pr-2 text-[15px] font-medium shadow-card transition-shadow duration-300 hover:shadow-lift sm:h-[46px] sm:w-auto"
            >
              {t.viewWork}
              <span className="flex size-[30px] items-center justify-center rounded-full bg-accent/[0.1] text-accent transition-[background-color,color] duration-300 group-hover/btn:bg-accent group-hover/btn:text-white">
                <Play className="size-3 translate-x-px fill-current" strokeWidth={0} aria-hidden="true" />
              </span>
            </Link>
          </motion.div>

          <motion.ul
            {...rise(0.46)}
            className="mx-auto mt-10 grid max-w-[600px] grid-cols-2 gap-y-7 sm:grid-cols-4 sm:divide-x sm:divide-ink/[0.07] xl:mt-11"
          >
            {t.pillars.map((pillar, i) => {
              const Icon = pillarIcons[i];
              return (
                <li key={pillar.title} className="group px-3">
                  <span className="mx-auto flex size-[38px] items-center justify-center rounded-[11px] bg-accent/[0.08] text-accent transition-[background-color,color,translate] duration-300 group-hover:-translate-y-1 group-hover:bg-accent group-hover:text-white">
                    <Icon className="size-[19px]" strokeWidth={2} aria-hidden="true" />
                  </span>
                  <p className="mt-3 text-[15px] font-semibold tracking-[-0.01em]">{pillar.title}</p>
                  <p className="mt-0.5 text-[12.5px] leading-snug text-muted">{pillar.body}</p>
                </li>
              );
            })}
          </motion.ul>

          {/* below the desktop breakpoint the floating cards become a swipeable row */}
          <motion.ul
            {...rise(0.5)}
            className="no-scrollbar -mx-5 -mb-4 mt-9 flex snap-x snap-mandatory items-start gap-3 overflow-x-auto px-5 pb-8 md:-mx-8 md:px-8 xl:hidden"
            aria-label={t.cardsLabel}
          >
            {t.cards.map((copy, i) => (
              <li key={copy.title} className="w-[272px] shrink-0 snap-center">
                <CardBody copy={copy} icon={cardLayout[i].icon} open={openCard === i} onToggle={() => toggle(i)} labels={labels} />
              </li>
            ))}
          </motion.ul>

          <motion.div
            {...rise(0.56)}
            className="mx-auto mt-8 flex w-full max-w-[640px] flex-col gap-3 rounded-[24px] border border-white bg-white/85 p-3 shadow-card backdrop-blur sm:w-fit sm:max-w-none sm:flex-row sm:items-center sm:gap-4 sm:rounded-full sm:py-[7px] sm:pl-5 sm:pr-[7px]"
          >
            <p className="flex items-center gap-2.5 px-1 pt-1 text-left text-[12.5px] leading-snug text-muted sm:p-0">
              <span className="size-[8px] shrink-0 animate-pulse-dot rounded-full bg-[#22c55e]" aria-hidden="true" />
              {t.available}
            </p>
            <div className="flex items-center justify-between gap-3 sm:justify-start">
              <ul className="flex pl-1.5" aria-label={t.builtLabel}>
                {projects.map((p) => (
                  <li
                    key={p.slug}
                    title={p.name}
                    className={cn(
                      "-ml-1.5 flex size-[28px] items-center justify-center overflow-hidden rounded-full shadow-[0_1px_3px_rgba(17,18,27,0.14)] ring-2 ring-white",
                      p.brand.dark ? "bg-ink p-[3px]" : "bg-white p-[6px]",
                    )}
                  >
                    <img src={asset(p.brand.icon)} alt={p.name} width={28} height={28} className="h-full w-full object-contain" />
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={openContact}
                className="group/btn inline-flex h-[32px] shrink-0 items-center gap-2 rounded-full bg-accent-soft px-3.5 text-[12.5px] font-medium text-accent-ink transition-[background-color,color] duration-300 hover:bg-accent hover:text-white"
              >
                {t.together}
                <ArrowRight className="size-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
          </motion.div>

          <motion.button
            {...rise(0.7)}
            type="button"
            onClick={() => goTo("work")}
            aria-label={t.scroll}
            className="mx-auto mt-7 hidden h-[34px] w-[22px] justify-center rounded-full border-[1.5px] border-ink/35 pt-[6px] transition-colors duration-300 hover:border-accent xl:flex"
          >
            <span className="h-[7px] w-[2.5px] animate-wheel rounded-full bg-ink/50" aria-hidden="true" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
