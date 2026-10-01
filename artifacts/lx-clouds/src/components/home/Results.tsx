import { animate, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Reveal } from "@/components/Reveal";
import { getProject } from "@/data/projects";
import { useT } from "@/i18n";
import { asset, cn } from "@/lib/utils";

/** The project each figure belongs to – same order as the copy; null for figures about the work as a whole. */
const sources = ["zgjedhplus", "rron-rent-a-car", "framenotion", "subtoapi", "zgjedhplus", null];

/** Splits a figure like "Top 10", "#1", "1.3M+", "1,3 Mio.+" or "1.000" into prefix, number and suffix. */
function parseFigure(value: string) {
  const match = value.match(/^(\D*)(\d[\d.,]*\d|\d)(.*)$/);
  if (!match) return null;
  const [, prefix, raw, suffix] = match;
  // "24/7" or "4×100" are names, not quantities – they stay as written
  if (/^[/×]/.test(suffix)) return null;
  const grouped = /^\d{1,3}([.,]\d{3})+$/.test(raw); // 1,000 or 1.000
  const separator = grouped ? raw.replace(/\d/g, "")[0] : "";
  const decimalMark = grouped ? "" : (raw.match(/[.,]/)?.[0] ?? "");
  const target = Number(grouped ? raw.replace(/[.,]/g, "") : raw.replace(",", "."));
  const decimals = decimalMark ? raw.split(decimalMark)[1].length : 0;
  const format = (n: number) => {
    const fixed = n.toFixed(decimals);
    if (grouped) return fixed.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return decimalMark === "," ? fixed.replace(".", ",") : fixed;
  };
  return { prefix, suffix, target, format };
}

/** Counts the numeric part of a figure up from zero once it scrolls into view. */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const reduce = useReducedMotion();
  const figure = parseFigure(value);
  const target = figure?.target ?? 0;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setCurrent(target);
      return;
    }
    const controls = animate(0, target, { duration: 1.6, ease: [0.16, 1, 0.3, 1], onUpdate: setCurrent });
    return () => controls.stop();
  }, [inView, target, reduce]);

  if (!figure) return <span ref={ref}>{value}</span>;
  return (
    <span ref={ref}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true">
        {figure.prefix}
        <span className="tabular-nums">{figure.format(current)}</span>
        {figure.suffix}
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

      <ul className="mt-8 grid gap-px overflow-hidden rounded-[22px] border border-ink/[0.07] bg-ink/[0.07] sm:grid-cols-2 lg:grid-cols-3">
        {t.items.map((item, i) => {
          const slug = sources[i];
          const project = slug ? getProject(slug) : undefined;
          const figure = (
            <>
              <span className="text-gradient w-fit text-[52px] font-semibold leading-none tracking-[-0.045em] sm:text-[58px]">
                <CountUp value={item.value} />
              </span>
              <span className="mt-3 text-[16px] font-semibold tracking-[-0.01em]">{item.label}</span>
              <span className="mt-1.5 text-[13.5px] leading-[1.45] text-muted">{item.note}</span>
            </>
          );
          if (!project) {
            return (
              <li key={item.label} className="bg-paper">
                <Reveal delay={(i % 3) * 0.07} className="flex h-full flex-col bg-white px-6 pb-6 pt-7">
                  {figure}
                </Reveal>
              </li>
            );
          }
          return (
            <li key={item.label} className="bg-paper">
              <Reveal delay={(i % 3) * 0.07} className="h-full">
                <Link
                  href={`/work/${project.slug}`}
                  className="group relative flex h-full flex-col bg-white px-6 pb-6 pt-7 transition-colors duration-500 hover:bg-[#FBFAFF]"
                >
                  <span
                    className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                    style={{ background: project.brand.color }}
                    aria-hidden="true"
                  />
                  {figure}
                  <span className="mt-auto flex items-center justify-between pt-6">
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
