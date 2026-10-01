import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { Check, CodeXml, MousePointer2, PenTool, Rocket, Settings, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { BrowserFrame, PhoneFrame } from "@/components/Frames";
import { Reveal } from "@/components/Reveal";
import { projects } from "@/data/projects";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";

const stageMeta: { icon: LucideIcon; dot: string }[] = [
  { icon: PenTool, dot: "#7C79FF" },
  { icon: CodeXml, dot: "#F29BD4" },
  { icon: Settings, dot: "#F3C56B" },
  { icon: Rocket, dot: "#FFFFFF" },
];

const zgjedhplus = projects[0];
const framenotion = projects[1];
const framenotionAds = framenotion.gallery[2];

type Pose = { x?: string; y?: string; scale?: number; z: number; lit: boolean };

/** A collage piece that takes a different pose in each stage. */
function Piece({ poses, stage, className, children }: { poses: Pose[]; stage: number; className?: string; children: ReactNode }) {
  const pose = poses[stage];
  return (
    <motion.div
      className={cn("absolute", className)}
      style={{ zIndex: pose.z }}
      animate={{ x: pose.x ?? "0%", y: pose.y ?? "0%", scale: pose.scale ?? 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={cn("transition-[filter] duration-700", pose.lit ? "" : "brightness-[0.62] saturate-[0.7]")}>{children}</div>
    </motion.div>
  );
}

const glass =
  "rounded-[16px] border border-white/25 bg-gradient-to-br from-white/[0.95] to-[#DAD6FF]/90 text-ink shadow-[0_26px_50px_-20px_rgba(0,0,0,0.7)]";

/** The extra card each stage brings in. */
function StageDetail({ stage, chips }: { stage: number; chips: string[] }) {
  const pop = {
    initial: { opacity: 0, y: 18, scale: 0.94 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.96 },
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  };
  return (
    <AnimatePresence mode="wait">
      {stage === 0 && (
        <motion.div key="tokens" {...pop} className={cn(glass, "absolute left-[30%] top-[76%] z-40 hidden items-center gap-3 px-3.5 py-2.5 sm:flex")}>
          <div className="flex -space-x-1.5">
            {["#6865FF", "#11121B", "#F8F7F4", "#B56BE6"].map((c) => (
              <span key={c} className="size-[22px] rounded-full border-2 border-white" style={{ background: c }} />
            ))}
          </div>
          <span className="text-[19px] font-semibold leading-none tracking-[-0.03em]">Aa</span>
          <span className="text-[11px] font-medium text-muted">Outfit · 8 / 16 / 24</span>
        </motion.div>
      )}
      {stage === 1 && (
        <motion.pre
          key="code"
          {...pop}
          className="absolute left-[42%] top-[58%] z-40 hidden rounded-[14px] border border-white/10 bg-[#0C0D16]/95 px-4 py-3 font-mono text-[10.5px] leading-[1.65] text-white/80 shadow-[0_26px_50px_-18px_rgba(0,0,0,0.8)] backdrop-blur sm:block"
        >
          <span className="text-[#C792EA]">export async function</span> <span className="text-[#82AAFF]">createAd</span>(url) {"{"}
          {"\n"}  <span className="text-[#C792EA]">const</span> page = <span className="text-[#C792EA]">await</span> analyse(url);
          {"\n"}  <span className="text-[#C792EA]">const</span> script = <span className="text-[#C792EA]">await</span> write(page);
          {"\n"}  <span className="text-[#C792EA]">return</span> render(script, {"{"} format: <span className="text-[#C3E88D]">"9:16"</span> {"}"});
          {"\n"}
          {"}"}
        </motion.pre>
      )}
      {stage === 2 && (
        <motion.ul key="checks" {...pop} className={cn(glass, "absolute left-[8%] top-[30%] z-40 hidden space-y-2 px-4 py-3.5 sm:block")}>
          {chips.map((label) => (
            <li key={label} className="flex items-center gap-2.5 text-[12.5px] font-medium">
              <span className="flex size-[18px] items-center justify-center rounded-full bg-[#22c55e] text-white">
                <Check className="size-3" strokeWidth={3} />
              </span>
              {label}
            </li>
          ))}
        </motion.ul>
      )}
      {stage === 3 && (
        <motion.ul key="live" {...pop} className="absolute left-[4%] top-[14%] z-40 hidden space-y-2 sm:block">
          {projects.map((p, i) => (
            <motion.li
              key={p.slug}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.1] py-1.5 pl-2.5 pr-3.5 text-[12px] font-medium text-white backdrop-blur"
            >
              <span className="size-[7px] animate-pulse-dot rounded-full bg-[#22c55e]" />
              {p.domain}
            </motion.li>
          ))}
        </motion.ul>
      )}
    </AnimatePresence>
  );
}

function Collage({ stage }: { stage: number }) {
  const t = useT().process;
  return (
    <div className="relative mx-auto aspect-[780/430] w-full max-w-[780px] lg:-my-2" aria-hidden="true">
      {/* indigo light behind the pieces */}
      <div className="absolute left-[2%] top-[36%] size-[46%] rounded-full bg-[#5B57E8]/35 blur-[70px]" />
      <div className="absolute right-[6%] top-[4%] size-[38%] rounded-full bg-[#7E6BFF]/25 blur-[80px]" />

      <Piece
        stage={stage}
        className="left-[19%] top-[-5%] w-[47%]"
        poses={[
          { z: 1, lit: false },
          { x: "-22%", y: "30%", scale: 1.2, z: 25, lit: true },
          { z: 1, lit: false },
          { z: 1, lit: false },
        ]}
      >
        <div className="[transform:perspective(1300px)_rotateY(-16deg)_rotateX(8deg)_rotate(-3deg)]">
          <BrowserFrame project={framenotion} shot={framenotionAds} small dark className="shadow-[0_30px_60px_-24px_rgba(0,0,0,0.75)]" />
        </div>
      </Piece>

      <Piece
        stage={stage}
        className="left-0 top-[23%] w-[57%]"
        poses={[
          { scale: 1.04, y: "-2%", z: 10, lit: true },
          { x: "10%", y: "-12%", scale: 0.86, z: 5, lit: false },
          { z: 10, lit: false },
          { z: 10, lit: true },
        ]}
      >
        <div className="[transform:perspective(1300px)_rotateY(-16deg)_rotateX(8deg)_rotate(-3deg)]">
          <BrowserFrame project={zgjedhplus} shot={zgjedhplus.cover} small className="shadow-[0_36px_70px_-22px_rgba(0,0,0,0.8)]" />
        </div>
      </Piece>

      <Piece
        stage={stage}
        className="left-[53.5%] top-[16%] w-[17%]"
        poses={[
          { z: 20, lit: true },
          { z: 20, lit: false },
          { x: "-70%", y: "-2%", scale: 1.28, z: 30, lit: true },
          { z: 20, lit: true },
        ]}
      >
        <PhoneFrame project={zgjedhplus} shot={zgjedhplus.coverMobile} small className="rotate-[7deg] shadow-[0_30px_50px_-18px_rgba(0,0,0,0.85)]" />
      </Piece>

      {/* the four stages as a glass checklist */}
      <div className={cn(glass, "absolute right-[2%] top-[-3%] z-30 w-[27%] rotate-[5deg] px-[7%] py-[5%] sm:px-5 sm:py-4")}>
        <ul className="relative space-y-[0.55em] text-[clamp(8px,1.5vw,13px)] font-medium">
          <span className="absolute bottom-[0.6em] left-[3px] top-[0.6em] w-px bg-accent/30" />
          {t.checklist.map((label, i) => (
            <li key={label} className="relative flex items-center gap-[0.9em]">
              <span
                className={cn(
                  "relative size-[7px] rounded-full transition-[background-color,box-shadow] duration-500",
                  i <= stage ? "bg-accent shadow-[0_0_0_3px_rgba(104,101,255,0.2)]" : "bg-accent/30",
                )}
              />
              <span className={cn("transition-opacity duration-500", i <= stage ? "opacity-100" : "opacity-55")}>{label}</span>
            </li>
          ))}
        </ul>
        <motion.span
          className="absolute right-[10%] block size-[13%] min-w-3"
          animate={{ top: `${14 + stage * 19}%` }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <MousePointer2 className="h-full w-full fill-ink text-ink" strokeWidth={1.5} />
        </motion.span>
      </div>

      {/* a figure the live product publishes itself */}
      <Piece
        stage={stage}
        className="right-0 top-[58%] w-[25%]"
        poses={[
          { z: 30, lit: false },
          { z: 30, lit: false },
          { z: 30, lit: false },
          { x: "-16%", y: "-14%", scale: 1.16, z: 35, lit: true },
        ]}
      >
        <div className={cn(glass, "-rotate-[5deg] p-[9%]")}>
          <p className="text-[clamp(6.5px,1.05vw,10px)] font-medium text-muted">
            {zgjedhplus.name} · {t.statLabel}
          </p>
          <p className="mt-[0.15em] text-[clamp(13px,2.5vw,22px)] font-semibold leading-none tracking-[-0.02em] text-accent">1.25M+</p>
          <p className="mt-[0.4em] text-[clamp(6px,0.95vw,9px)] text-muted">{t.statBody("229")}</p>
          <p className="mt-[9%] flex items-center gap-[0.5em] border-t border-accent/15 pt-[7%] text-[clamp(6px,0.95vw,9px)] font-medium text-ink/70">
            <span className="size-[5px] rounded-full bg-[#22c55e]" />
            {zgjedhplus.domain}
          </p>
        </div>
      </Piece>

      <div className="absolute right-[1%] top-[39%] z-30 hidden items-start gap-1.5 text-white/85 sm:flex">
        <svg width="26" height="30" viewBox="0 0 26 30" fill="none" className="mt-1 shrink-0">
          <path d="M22 3C10 4 4 12 5 26" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M1 20l4 6.5L10.5 22" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="-rotate-3 font-hand text-[clamp(13px,1.6vw,19px)] leading-[1.05]">
          {t.note[0]}
          <br />
          {t.note[1]}
        </p>
      </div>

      <StageDetail stage={stage} chips={t.stages[2].chips} />
    </div>
  );
}

/** Extra scroll distance the panel stays pinned for, in viewport heights. */
const PIN_VH = 150;

export function Process() {
  const t = useT().process;
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);
  const [pinned, setPinned] = useState(false);
  const raw = useMotionValue(0);
  const progress = useSpring(raw, { stiffness: 120, damping: 26, mass: 0.4 });

  // Desktop: the panel sticks while the page scrolls PIN_VH further, and that distance walks the stages.
  // Smaller screens: no pinning – the stages follow the panel's way through the viewport.
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const wrap = wrapRef.current;
      const panel = panelRef.current;
      if (!wrap || !panel) return;
      const rect = wrap.getBoundingClientRect();
      const distance = rect.height - panel.offsetHeight;
      let p: number;
      if (distance > 40) {
        const top = parseFloat(getComputedStyle(panel).top) || 0;
        p = (top - rect.top) / distance;
        setPinned(p > 0 && p < 1);
      } else {
        const vh = window.innerHeight;
        p = (vh * 0.75 - rect.top) / (rect.height + vh * 0.2);
        setPinned(false);
      }
      p = Math.min(1, Math.max(0, p));
      raw.set(p);
      setStage(Math.min(stageMeta.length - 1, Math.floor(p * stageMeta.length)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [raw]);

  /** Jumps the page to the scroll position of a stage. */
  function goToStage(i: number) {
    const wrap = wrapRef.current;
    const panel = panelRef.current;
    if (!wrap || !panel) return;
    const distance = wrap.offsetHeight - panel.offsetHeight;
    if (distance <= 40) {
      setStage(i);
      return;
    }
    const top = parseFloat(getComputedStyle(panel).top) || 0;
    const start = wrap.getBoundingClientRect().top + window.scrollY - top;
    window.scrollTo({ top: start + ((i + 0.5) / stageMeta.length) * distance, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <section aria-labelledby="process-title" className="mx-auto mt-10 w-full max-w-[1390px] px-3 md:px-4 xl:mt-9">
      <div ref={wrapRef}>
        <div
          ref={panelRef}
          className="relative overflow-hidden rounded-[24px] bg-night text-white md:rounded-[26px] lg:sticky lg:top-[max(84px,calc(50vh-290px))]"
        >
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{
              background: [
                "radial-gradient(700px 420px at 68% 60%, rgba(91,87,232,0.26), transparent 70%)",
                "radial-gradient(520px 320px at 100% 0%, rgba(126,107,255,0.2), transparent 70%)",
                "linear-gradient(180deg, #151624 0%, #11121C 100%)",
              ].join(","),
            }}
          />
          {/* progress of the whole walk-through */}
          <motion.span
            className="absolute inset-x-0 top-0 h-[2px] origin-left bg-gradient-to-r from-[#7C79FF] via-[#F29BD4] to-[#F3C56B]"
            style={{ scaleX: progress }}
            aria-hidden="true"
          />

          <div className="relative grid gap-10 px-6 py-11 sm:px-10 lg:min-h-[540px] lg:grid-cols-[minmax(0,410px)_minmax(0,1fr)] lg:items-center lg:gap-6 lg:py-[52px] lg:pl-[84px] lg:pr-8">
            <div>
              <Reveal>
                <h2 id="process-title" className="text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[33px]">
                  {t.title}
                </h2>
                <p className="mt-3 max-w-[390px] text-[15.5px] leading-[1.5] text-white/70">{t.sub}</p>
              </Reveal>

              <ol className="relative mt-7">
                <span className="absolute bottom-7 left-[5px] top-7 w-px bg-white/15" aria-hidden="true" />
                <motion.span
                  className="absolute left-[5px] top-7 w-px origin-top bg-gradient-to-b from-[#7C79FF] to-white/70"
                  style={{ height: "calc(100% - 56px)", scaleY: progress }}
                  aria-hidden="true"
                />
                {t.stages.map((copy, i) => {
                  const { icon: Icon, dot } = stageMeta[i];
                  const on = i === stage;
                  return (
                    <li key={copy.title} className="relative">
                      <button
                        type="button"
                        onClick={() => goToStage(i)}
                        aria-current={on ? "step" : undefined}
                        className="group flex w-full items-center gap-5 rounded-2xl py-[7px] text-left"
                      >
                        <span
                          className={cn(
                            "relative z-10 size-[11px] shrink-0 rounded-full transition-[scale,box-shadow] duration-500",
                            on ? "scale-125" : "scale-100",
                          )}
                          style={{ background: dot, boxShadow: on ? `0 0 0 5px ${dot}33` : "0 0 0 3px #12131f" }}
                          aria-hidden="true"
                        />
                        <span
                          className={cn(
                            "flex size-[52px] shrink-0 items-center justify-center rounded-[14px] border transition-[background-color,border-color,color] duration-500",
                            on
                              ? "border-[#7C79FF]/60 bg-[#7C79FF]/25 text-white"
                              : "border-white/[0.08] bg-white/[0.07] text-white/80 group-hover:bg-white/[0.11]",
                          )}
                        >
                          <Icon className="size-[21px]" strokeWidth={1.7} aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[16px] font-semibold tracking-[-0.01em]">{copy.title}</span>
                          <span
                            className={cn(
                              "mt-0.5 block max-w-[290px] text-[13.5px] leading-[1.4] transition-colors duration-500",
                              on ? "text-white/85" : "text-white/55",
                            )}
                          >
                            {copy.body}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>

              <div className="mt-5 flex min-h-[30px] flex-wrap items-center gap-2 pl-[36px]">
                <AnimatePresence mode="popLayout" initial={false}>
                  {t.stages[stage].chips.map((chip, i) => (
                    <motion.span
                      key={`${stage}-${chip}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.35, delay: i * 0.05 }}
                      className="rounded-full border border-white/12 bg-white/[0.07] px-3 py-1 text-[12px] text-white/80"
                    >
                      {chip}
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <Reveal y={30} delay={0.1}>
              <Collage stage={stage} />
            </Reveal>
          </div>

          <p
            className={cn(
              "pointer-events-none absolute bottom-4 right-6 hidden items-center gap-3 text-[11.5px] font-medium tracking-[0.06em] text-white/55 transition-opacity duration-500 lg:flex",
              pinned ? "opacity-100" : "opacity-0",
            )}
            aria-hidden="true"
          >
            {t.step(stage + 1, stageMeta.length)}
            <span className="h-px w-8 bg-white/25" />
            {stage < stageMeta.length - 1 ? t.hint : "✓"}
          </p>
        </div>
        {/* room for the pinned walk-through; a sticky box can only travel inside its parent's content box */}
        <div className="hidden lg:block" style={{ height: `${PIN_VH}vh` }} aria-hidden="true" />
      </div>
    </section>
  );
}
