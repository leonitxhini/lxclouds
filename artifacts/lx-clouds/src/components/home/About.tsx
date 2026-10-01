import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Infinity as InfinityIcon, Users } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { Reveal } from "@/components/Reveal";
import { projects } from "@/data/projects";
import { localeNames, locales, useT } from "@/i18n";

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  // 0.48 keeps the dimmed words above the 3:1 contrast that large text needs
  const opacity = useTransform(progress, range, [0.48, 1]);
  return <motion.span style={{ opacity }}>{children} </motion.span>;
}

/** A statement whose words light up one after another as it scrolls through the viewport. */
function Statement({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.88", "end 0.5"] });
  const words = text.split(" ");

  if (reduce) {
    return <p className="max-w-[1040px] text-[28px] font-semibold leading-[1.22] tracking-[-0.03em] sm:text-[44px]">{text}</p>;
  }
  return (
    <p ref={ref} className="max-w-[1040px] text-[28px] font-semibold leading-[1.22] tracking-[-0.03em] sm:text-[44px]">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <Word key={`${word}-${i}`} progress={scrollYProgress} range={[i / words.length, Math.min(1, (i + 1.5) / words.length)]}>
            {word}
          </Word>
        ))}
      </span>
    </p>
  );
}

function Tile({ figure, label }: { figure: ReactNode; label: string }) {
  return (
    <li className="flex min-h-[92px] flex-1 flex-col items-center justify-center rounded-[16px] border border-ink/[0.06] bg-white px-3 py-3.5 text-center transition-[translate,box-shadow,border-color] duration-500 hover:-translate-y-1 hover:border-accent/25 hover:shadow-card">
      <span className="flex h-8 items-center text-accent">{figure}</span>
      <span className="mt-1 max-w-[120px] text-[12.5px] leading-[1.3] text-muted">{label}</span>
    </li>
  );
}

export function About() {
  const t = useT().about;
  return (
    <section id="about" aria-labelledby="about-title" className="container-page pt-20 xl:pt-28">
      <Statement text={t.statement} />

      <Reveal className="mt-14 grid items-center gap-6 border-t border-ink/[0.08] pt-10 lg:grid-cols-[minmax(0,290px)_minmax(0,1fr)_minmax(0,480px)] lg:gap-10">
        <h2 id="about-title" className="text-[26px] font-semibold leading-[1.2] tracking-[-0.025em] sm:text-[25px]">
          {t.title[0]}
          <br />
          {t.title[1]}
        </h2>
        <div className="max-w-[420px]">
          <p className="text-[14.5px] leading-[1.55] text-muted">{t.body}</p>
          <p className="mt-3 flex flex-wrap items-center gap-2 text-[13px] text-muted">
            {t.languages}
            <span className="flex gap-1.5">
              {locales.map((l) => (
                <span key={l} lang={l} className="rounded-full bg-accent-soft px-2 py-0.5 text-[11.5px] font-medium text-accent-ink">
                  {localeNames[l]}
                </span>
              ))}
            </span>
          </p>
        </div>
        <ul className="flex gap-2.5 sm:gap-3">
          <Tile
            figure={<span className="text-[28px] font-semibold leading-none tracking-[-0.02em]">{projects.length}</span>}
            label={t.tiles[0]}
          />
          <Tile figure={<InfinityIcon className="size-7" strokeWidth={1.8} aria-hidden="true" />} label={t.tiles[1]} />
          <Tile figure={<Users className="size-[22px]" strokeWidth={1.8} aria-hidden="true" />} label={t.tiles[2]} />
        </ul>
      </Reveal>
    </section>
  );
}
