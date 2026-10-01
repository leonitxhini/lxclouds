import { animate, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Reveal } from "@/components/Reveal";
import { getProject } from "@/data/projects";
import { useT } from "@/i18n";
import { asset, cn } from "@/lib/utils";

/** The project each figure belongs to – same order as the copy. */
const sources = ["zgjedhplus", "rron-rent-a-car", "framenotion", "zgjedhplus"];

/** Counts the numeric part of a figure up from zero once it scrolls into view ("Top 10", "#1", "1.25M+"). */
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const reduce = useReducedMotion();
  const match = value.match(/^(\D*)([\d.]+)(.*)$/);
  const target = match ? Number(match[2]) : 0;
  const decimals = match?.[2].split(".")[1]?.length ?? 0;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!inView || !match) return;
    if (reduce) {
      setCurrent(target);
      return;
    }
    const controls = animate(0, target, { duration: 1.6, ease: [0.16, 1, 0.3, 1], onUpdate: setCurrent });
    return () => controls.stop();
    // match is derived from value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, target, reduce]);

  if (!match) return <span ref={ref}>{value}</span>;
  return (
    <span ref={ref} aria-label={value}>
      <span aria-hidden="true">
        {match[1]}
        <span className="tabular-nums">{current.toFixed(decimals)}</span>
        {match[3]}
      </span>
    </span>
  );
}

export function Results() {
  const t = useT().results;
  return (
    <section aria-labelledby="results-title" className="container-page pt-20 xl:pt-24">
      <Reveal className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="results-title" className="mt-2.5 text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[40px]">
            {t.title}
          </h2>
        </div>
        <p className="text-[14.5px] text-muted sm:mb-1.5">{t.sub}</p>
      </Reveal>

      <ul className="mt-8 grid overflow-hidden rounded-[22px] border border-ink/[0.07] bg-ink/[0.07] gap-px sm:grid-cols-2 lg:grid-cols-4">
        {t.items.map((item, i) => {
          const project = getProject(sources[i]);
          if (!project) return null;
          return (
            <li key={item.label} className="bg-paper">
              <Reveal delay={i * 0.07} className="h-full">
                <Link
                  href={`/work/${project.slug}`}
                  className="group relative flex h-full flex-col bg-white px-6 pb-6 pt-7 transition-colors duration-500 hover:bg-[#FBFAFF]"
                >
                  <span
                    className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                    style={{ background: project.brand.color }}
                    aria-hidden="true"
                  />
                  <span className="text-gradient text-[52px] font-semibold leading-none tracking-[-0.045em] sm:text-[58px]">
                    <CountUp value={item.value} />
                  </span>
                  <span className="mt-3 text-[16px] font-semibold tracking-[-0.01em]">{item.label}</span>
                  <span className="mt-1.5 text-[13.5px] leading-[1.45] text-muted">{item.note}</span>
                  <span className="mt-6 flex items-center justify-between pt-1">
                    <span className="flex items-center gap-2 text-[13px] font-medium text-ink/80">
                      <span
                        className={cn(
                          "flex size-6 items-center justify-center overflow-hidden rounded-[7px]",
                          project.brand.dark ? "bg-ink p-[2px]" : "border border-ink/[0.07] bg-white p-[3px]",
                        )}
                      >
                        <img src={asset(project.brand.icon)} alt="" width={24} height={24} loading="lazy" className="h-full w-full object-contain" />
                      </span>
                      {project.name}
                    </span>
                    <ArrowUpRight
                      className="size-4 text-faint transition-[translate,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
