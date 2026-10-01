import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Sparkle, SquareArrowOutUpRight } from "lucide-react";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { Link } from "wouter";
import { Reveal } from "@/components/Reveal";
import { mailto } from "@/data/site";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";

/** Lets its child lean a few pixels towards the pointer. */
function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 16, mass: 0.4 });
  const y = useSpring(my, { stiffness: 220, damping: 16, mass: 0.4 });

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left - rect.width / 2) * 0.28);
    my.set((e.clientY - rect.top - rect.height / 2) * 0.4);
  }

  return (
    <motion.div
      className={className}
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/** Two bands of service names that run in opposite directions and shift with the scroll. */
function Marquee({ items }: { items: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const forward = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const backward = useTransform(scrollYProgress, [0, 1], ["-12%", "0%"]);

  const row = (reverse: boolean) => (
    <motion.div style={{ x: reverse ? backward : forward }}>
      <div className={cn("flex w-max animate-marquee", reverse && "[animation-direction:reverse]")}>
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1 || reverse ? "true" : undefined}>
            {items.map((item) => (
              <li
                key={item}
                className={cn(
                  "flex items-center gap-7 pr-7 text-[40px] font-semibold leading-none tracking-[-0.035em] sm:gap-10 sm:pr-10 sm:text-[68px]",
                  reverse ? "text-gradient pb-[0.1em]" : "text-ink",
                )}
              >
                {item}
                <Sparkle className="size-5 shrink-0 fill-accent text-accent sm:size-7" strokeWidth={0} aria-hidden="true" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div ref={ref} className="space-y-3 overflow-hidden py-2 sm:space-y-4">
      {row(false)}
      {row(true)}
    </div>
  );
}

/** Closing call to action, shared by the home page and the work pages. */
export function Cta({ marquee = false }: { marquee?: boolean }) {
  const t = useT();
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative mt-20 overflow-hidden xl:mt-24">
      {marquee && <Marquee items={t.cta.marquee} />}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[420px]" aria-hidden="true">
        <div className="absolute -bottom-[150px] left-[-8%] h-[260px] w-[46%] rounded-[50%] bg-[#C9C2FF]/55 blur-[50px]" />
        <div className="absolute -bottom-[170px] right-[-8%] h-[270px] w-[48%] rounded-[50%] bg-[#C3D4FF]/60 blur-[50px]" />
        <div className="absolute -bottom-[190px] left-1/2 h-[250px] w-[40%] -translate-x-1/2 rounded-[50%] bg-[#DCD6FF]/60 blur-[60px]" />
      </div>

      <Reveal className={cn("container-page relative pb-20 text-center sm:pb-24", marquee ? "pt-16 sm:pt-20" : "pt-4")}>
        <h2 id="contact-title" className="mx-auto max-w-[820px] text-balance text-[36px] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-[56px]">
          {t.cta.title}
        </h2>
        <p className="mx-auto mt-4 max-w-[620px] text-[16px] leading-[1.55] text-muted">{t.cta.sub}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Magnetic className="w-full sm:w-auto">
            <a
              href={mailto(t.contact.subject)}
              className="group/btn inline-flex h-[52px] w-full items-center justify-center gap-2.5 rounded-full bg-ink px-8 text-[15.5px] font-medium text-white shadow-[0_10px_24px_-10px_rgba(17,18,27,0.6)] transition-[background-color,box-shadow] duration-300 hover:bg-[#23243a] hover:shadow-[0_16px_34px_-12px_rgba(104,101,255,0.7)] sm:w-auto"
            >
              {t.cta.email}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-[3px]" strokeWidth={2} aria-hidden="true" />
            </a>
          </Magnetic>
          <Magnetic className="w-full sm:w-auto">
            <Link
              href="/work"
              className="inline-flex h-[52px] w-full items-center justify-center gap-2.5 rounded-full border border-ink/10 bg-white px-8 text-[15.5px] font-medium shadow-[0_1px_2px_rgba(17,18,27,0.04)] transition-[border-color,color] duration-300 hover:border-accent/40 hover:text-accent-ink sm:w-auto"
            >
              {t.cta.work}
              <SquareArrowOutUpRight className="size-4" strokeWidth={1.9} aria-hidden="true" />
            </Link>
          </Magnetic>
        </div>
      </Reveal>
    </section>
  );
}
