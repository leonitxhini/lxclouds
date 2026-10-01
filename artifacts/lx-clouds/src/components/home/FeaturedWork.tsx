import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Link } from "wouter";
import { PhoneFrame, useShotAlt } from "@/components/Frames";
import { Reveal } from "@/components/Reveal";
import { projects, shotSrc, type Project } from "@/data/projects";
import { useT } from "@/i18n";
import { asset, cn } from "@/lib/utils";

const filters = ["all", "product", "client"] as const;
type Filter = (typeof filters)[number];

function ProjectCard({ project }: { project: Project }) {
  const t = useT();
  const copy = t.projects[project.slug];
  const alt = useShotAlt();
  const reduce = useReducedMotion();
  const withPhone = project.slug === "zgjedhplus";
  const headline = copy.results[0];

  // the card leans towards the pointer
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 160, damping: 18 });
  const rotateY = useSpring(ry, { stiffness: 160, damping: 18 });

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    ry.set((x - 0.5) * 9);
    rx.set((0.5 - y) * 9);
    e.currentTarget.style.setProperty("--mx", `${x * 100}%`);
    e.currentTarget.style.setProperty("--my", `${y * 100}%`);
  }

  return (
    <motion.div
      className="h-full [transform-style:preserve-3d]"
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onPointerMove={onMove}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      <Link
        href={`/work/${project.slug}`}
        className="spotlight group block h-full rounded-[20px] border border-ink/[0.06] bg-white p-[5px] shadow-card transition-[box-shadow,border-color] duration-500 ease-out hover:border-accent/25 hover:shadow-lift"
      >
        <div className="relative aspect-[1.62] overflow-hidden rounded-[15px]" style={{ background: project.brand.backdrop }}>
          <img
            src={asset(shotSrc(project, project.cover, true))}
            alt={alt(project, project.cover)}
            width={800}
            height={500}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full origin-top-left object-cover object-left-top transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          />
          {withPhone && (
            <PhoneFrame
              project={project}
              shot={project.coverMobile}
              small
              className="absolute -bottom-[34%] right-[5%] w-[27%] rotate-[4deg] shadow-[0_18px_30px_-12px_rgba(17,18,27,0.45)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 group-hover:rotate-[2deg]"
            />
          )}
          {headline && (
            <span className="absolute left-2 top-2 inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/85 py-1 pl-2 pr-2.5 text-[10.5px] font-medium text-ink shadow-[0_6px_16px_-8px_rgba(17,18,27,0.4)] backdrop-blur">
              <span className="size-1.5 rounded-full bg-[#22c55e]" aria-hidden="true" />
              {headline.value} {headline.label}
            </span>
          )}
          {/* hover invitation */}
          <span
            className="absolute inset-x-0 bottom-0 flex translate-y-2 items-end justify-start bg-gradient-to-t from-ink/60 to-transparent px-3.5 pb-3 pt-10 text-[12px] font-medium text-white opacity-0 transition-[opacity,translate] duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
            aria-hidden="true"
          >
            {t.common.viewCase}
          </span>
        </div>

        <div className="px-3 pb-3.5 pt-3.5">
          <div className="flex items-center gap-2.5">
            <span
              className={cn(
                "flex size-[30px] shrink-0 items-center justify-center overflow-hidden rounded-[9px]",
                project.brand.dark ? "bg-ink p-[3px]" : "border border-ink/[0.06] bg-white p-[4px]",
              )}
            >
              <img src={asset(project.brand.icon)} alt="" width={30} height={30} loading="lazy" className="h-full w-full object-contain" />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-[15px] font-semibold leading-tight tracking-[-0.01em]">{project.name}</h3>
              <span className="mt-1 inline-block max-w-full truncate rounded-[6px] bg-accent-soft px-1.5 py-[2px] align-top text-[10.5px] font-medium leading-tight text-accent-ink">
                {copy.tag}
              </span>
            </div>
            <span
              className="flex size-[30px] shrink-0 items-center justify-center rounded-full border border-ink/10 text-ink transition-[background-color,color,border-color] duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white"
              aria-hidden="true"
            >
              <ArrowRight className="size-[14px] transition-transform duration-300 group-hover:translate-x-px" strokeWidth={2} />
            </span>
          </div>
          <p className="mt-3 min-h-[2.75em] text-[12.5px] leading-snug text-muted">{copy.blurb}</p>
          <dl className="mt-3 grid grid-cols-2 gap-3 border-t border-ink/[0.06] pt-3">
            {copy.results.slice(1, 3).map((r) => (
              <div key={r.label} className="flex flex-col-reverse">
                <dt className="mt-0.5 text-[10.5px] leading-tight text-muted">{r.label}</dt>
                <dd className="text-[17px] font-semibold leading-none tracking-[-0.02em] text-ink">{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Link>
    </motion.div>
  );
}

export function FeaturedWork() {
  const t = useT();
  const [filter, setFilter] = useState<Filter>("all");
  const visible = projects.filter((p) => filter === "all" || p.type === filter);
  const listRef = useRef<HTMLUListElement>(null);
  const [slide, setSlide] = useState(0);

  // which card is centred in the swipe row on phones
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const onScroll = () => {
      const first = list.children[0] as HTMLElement | undefined;
      if (!first) return;
      const step = first.offsetWidth + 16;
      setSlide(Math.min(visible.length - 1, Math.max(0, Math.round(list.scrollLeft / step))));
    };
    list.addEventListener("scroll", onScroll, { passive: true });
    return () => list.removeEventListener("scroll", onScroll);
  }, [visible.length]);

  return (
    <section id="work" aria-labelledby="work-title" className="container-page pt-12 xl:pt-10">
      <Reveal className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow">{t.work.eyebrow}</p>
          <h2 id="work-title" className="mt-2.5 text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[34px]">
            {t.work.title}
          </h2>
        </div>

        <div className="flex items-center justify-between gap-6 lg:mb-1">
          <div role="group" aria-label={t.work.filterLabel} className="flex items-center rounded-full bg-ink/[0.045] p-1">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => {
                  setFilter(f);
                  setSlide(0);
                  listRef.current?.scrollTo({ left: 0 });
                }}
                aria-pressed={filter === f}
                className={cn(
                  "relative h-8 whitespace-nowrap rounded-full px-3.5 text-[13px] font-medium transition-colors duration-300",
                  filter === f ? "text-ink" : "text-ink/60 hover:text-ink",
                )}
              >
                {filter === f && (
                  <motion.span
                    layoutId="work-filter"
                    className="absolute inset-0 rounded-full bg-white shadow-[0_1px_3px_rgba(17,18,27,0.12)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{t.work.filters[f]}</span>
              </button>
            ))}
          </div>
          <Link href="/work" className="group hidden items-center gap-2 text-[14px] text-ink sm:inline-flex">
            <span className="underline decoration-ink/30 underline-offset-[5px] transition-colors duration-300 group-hover:decoration-accent">
              {t.work.viewAll}
            </span>
            <ArrowRight className="size-[15px] transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.8} aria-hidden="true" />
          </Link>
        </div>
      </Reveal>

      {/* swipeable on phones, four across on desktop */}
      <ul
        ref={listRef}
        className="no-scrollbar -mx-5 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 md:-mx-8 md:px-8 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-[18px] lg:overflow-visible lg:px-0 lg:pb-0"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project, i) => (
            <motion.li
              key={project.slug}
              layout
              initial={{ opacity: 0, y: 26, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              viewport={{ once: true, margin: "0px 0px -8% 0px" }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1], layout: { duration: 0.5 } }}
              className="w-[82vw] max-w-[340px] shrink-0 snap-center lg:w-auto lg:max-w-none"
            >
              <ProjectCard project={project} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <div className="flex items-center justify-between lg:hidden">
        <div className="flex gap-1.5" aria-hidden="true">
          {visible.map((p, i) => (
            <span
              key={p.slug}
              className={cn("h-1.5 rounded-full transition-[width,background-color] duration-300", i === slide ? "w-5 bg-accent" : "w-1.5 bg-ink/15")}
            />
          ))}
        </div>
        <Link href="/work" className="inline-flex items-center gap-2 text-[14px] underline decoration-ink/30 underline-offset-[5px] sm:hidden">
          {t.work.viewAll}
          <ArrowRight className="size-[15px]" strokeWidth={1.8} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
