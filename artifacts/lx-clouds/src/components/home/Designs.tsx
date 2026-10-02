import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useContact } from "@/components/ContactDialog";
import { Reveal } from "@/components/Reveal";
import { demoUrl, designs, shotWidth } from "@/data/designs";
import { site } from "@/data/site";
import { useT } from "@/i18n";
import { asset, cn } from "@/lib/utils";

/** How long one design stays on stage before the next one takes over. */
const HOLD_MS = 10000;
/** Speed at which the captured page travels through the browser window, in capture pixels per second. */
const SCROLL_SPEED = 170;

const shot = (id: string, phone = false) =>
  asset(`/showcase/${id}${phone ? "-m" : ""}.webp`);

/** "What we build": the eight demo designs on a dark stage, each scrolling through a browser window and a phone. */
export function Designs() {
  const t = useT().designs;
  const openContact = useContact();
  const reduce = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const inView = useInView(stage, { amount: 0.3 });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const design = designs[active];
  const copy = t.items[design.id];
  const running = inView && !paused && !reduce;

  // move on to the next design while nobody is interacting
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(
      () => setActive((i) => (i + 1) % designs.length),
      HOLD_MS,
    );
    return () => window.clearTimeout(timer);
  }, [active, running]);

  // have the next capture ready before it is shown
  useEffect(() => {
    if (!inView) return;
    const next = designs[(active + 1) % designs.length];
    new Image().src = shot(next.id);
  }, [active, inView]);

  return (
    <section
      id="designs"
      aria-labelledby="designs-title"
      className="px-3 pt-20 sm:px-5 xl:pt-28"
    >
      <div
        ref={stage}
        className="relative isolate mx-auto max-w-[1720px] overflow-hidden rounded-[28px] bg-night text-white sm:rounded-[36px]"
        onPointerEnter={(e) => e.pointerType !== "touch" && setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        {/* the stage light takes the colour of the design on show */}
        <div
          className="pointer-events-none absolute -right-[12%] -top-[30%] -z-10 size-[70%] rounded-full opacity-[0.22] blur-[140px] transition-[background-color] duration-[1200ms]"
          style={{ backgroundColor: design.accent }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-[40%] -left-[10%] -z-10 size-[55%] rounded-full bg-[#6865FF] opacity-[0.16] blur-[150px]"
          aria-hidden="true"
        />

        <div className="container-page py-12 sm:py-16 lg:py-20">
          <Reveal className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.86fr)] lg:items-end lg:gap-16">
            <div>
              <p className="eyebrow !text-[#A9A7FF]">{t.eyebrow}</p>
              <h2
                id="designs-title"
                className="mt-2.5 max-w-[560px] text-[30px] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-[40px] xl:text-[46px]"
              >
                {t.title}
              </h2>
            </div>
            <p className="max-w-[520px] text-[15.5px] leading-[1.6] text-white/70 lg:pb-1.5">
              {t.text}
            </p>
          </Reveal>

          <div className="mt-7 grid grid-cols-[minmax(0,1fr)] gap-6 lg:mt-12 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1.5fr)] lg:gap-12 xl:gap-16">
            {/* ---------- left: the list of designs (on small screens its parts line up with the window: chips, window, buttons) ---------- */}
            <div className="contents lg:flex lg:min-w-0 lg:flex-col">
              {/* phone and tablet: chips */}
              <div
                className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
                role="group"
                aria-label={t.pick}
              >
                {designs.map((d, i) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={i === active}
                    className={cn(
                      "h-10 shrink-0 rounded-full border px-4 text-[14px] font-medium transition-colors duration-300",
                      i === active
                        ? "border-white bg-white text-ink"
                        : "border-white/15 text-white/75",
                    )}
                  >
                    {t.items[d.id].name}
                  </button>
                ))}
              </div>

              {/* desktop: the list, with a line that fills while the design is on show */}
              <ul className="hidden lg:block" aria-label={t.pick}>
                {designs.map((d, i) => {
                  const on = i === active;
                  return (
                    <li
                      key={d.id}
                      className="relative border-t border-white/10 last:border-b"
                    >
                      <button
                        type="button"
                        onClick={() => setActive(i)}
                        aria-pressed={on}
                        className={cn(
                          "group flex w-full items-baseline gap-4 py-[13px] text-left transition-colors duration-300",
                          on
                            ? "text-white"
                            : "text-white/50 hover:text-white/85",
                        )}
                      >
                        <span className="w-6 shrink-0 text-[12px] font-medium tabular-nums tracking-[0.08em] opacity-60">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[17px] font-medium tracking-[-0.01em]">
                            {t.items[d.id].name}
                          </span>
                          <span
                            className={cn(
                              "grid transition-[grid-template-rows,opacity] duration-500 ease-out",
                              on
                                ? "grid-rows-[1fr] opacity-100"
                                : "grid-rows-[0fr] opacity-0",
                            )}
                          >
                            <span className="overflow-hidden">
                              <span className="block pt-1 text-[13.5px] leading-[1.45] text-white/60">
                                {t.items[d.id].style}
                              </span>
                            </span>
                          </span>
                        </span>
                        <span
                          className={cn(
                            "mt-[7px] size-2 shrink-0 self-start rounded-full transition-[opacity,scale] duration-300",
                            on ? "scale-100 opacity-100" : "scale-50 opacity-0",
                          )}
                          style={{ backgroundColor: d.accent }}
                          aria-hidden="true"
                        />
                      </button>
                      {on && (
                        <span
                          key={`${d.id}-${running}`}
                          className="absolute -bottom-px left-0 h-px origin-left"
                          style={{
                            backgroundColor: d.accent,
                            width: "100%",
                            animation: running
                              ? `design-hold ${HOLD_MS}ms linear both`
                              : undefined,
                          }}
                          aria-hidden="true"
                        />
                      )}
                    </li>
                  );
                })}
              </ul>

              <div className="order-3 flex flex-wrap items-center gap-3 lg:order-none lg:mt-8">
                <a
                  href={demoUrl(design.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="group/btn inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[15px] font-medium text-ink transition-colors duration-300 hover:bg-accent-soft"
                >
                  {t.open}
                  <ArrowUpRight
                    className="size-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </a>
                <button
                  type="button"
                  onClick={openContact}
                  className="group/btn inline-flex h-12 items-center gap-2 rounded-full border border-white/20 px-6 text-[15px] font-medium text-white transition-colors duration-300 hover:border-white/50"
                >
                  {t.request}
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover/btn:translate-x-[3px]"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </button>
              </div>
              <p className="order-4 -mt-2 text-[12.5px] leading-[1.5] text-white/45 lg:order-none lg:mt-4">
                {t.note}
              </p>
            </div>

            {/* ---------- right: browser window and phone, both travelling down the page ---------- */}
            <Reveal delay={0.1} className="relative order-2 min-w-0 lg:order-none lg:self-start">
              <a
                href={demoUrl(design.id)}
                target="_blank"
                rel="noreferrer"
                aria-label={`${t.open}: ${copy.name}`}
                className="block overflow-hidden rounded-[14px] border border-white/[0.12] bg-[#0c0d16] shadow-[0_50px_100px_-40px_rgba(0,0,0,0.9)] transition-[border-color] duration-500 hover:border-white/30 sm:rounded-[18px] lg:mr-[9%]"
              >
                <span
                  className="flex h-9 items-center gap-1.5 border-b border-white/[0.08] px-3.5"
                  aria-hidden="true"
                >
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="size-2 rounded-full bg-white/20" />
                  ))}
                  <span className="mx-auto max-w-[70%] -translate-x-5 truncate rounded-full bg-white/[0.07] px-3.5 py-1 text-[11px] leading-none tracking-wide text-white/65">
                    {site.domain}
                    {demoUrl(design.id)}
                  </span>
                </span>
                <span className="relative block aspect-[16/10.6] overflow-hidden [container-type:size]">
                  <AnimatePresence initial={false}>
                    <motion.img
                      key={design.id}
                      src={shot(design.id)}
                      alt={`${copy.name} — ${t.desktop}`}
                      width={shotWidth.desktop}
                      height={design.h}
                      decoding="async"
                      loading="lazy"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className="shot-travel absolute inset-x-0 top-0 h-auto w-full"
                      style={
                        {
                          "--travel": `${Math.round(design.h / SCROLL_SPEED)}s`,
                        } as CSSProperties
                      }
                    />
                  </AnimatePresence>
                </span>
              </a>

              {/* the same design on a phone */}
              <div className="absolute -bottom-7 right-0 hidden w-[21%] overflow-hidden rounded-[13%/6.2%] bg-[#0d0e16] p-[0.7%] shadow-[0_0_0_1px_rgba(255,255,255,0.16)_inset,0_40px_70px_-30px_rgba(0,0,0,0.95)] lg:block">
                <span
                  className="absolute left-1/2 top-[2.4%] z-10 h-[2.3%] w-[27%] -translate-x-1/2 rounded-full bg-[#0d0e16]"
                  aria-hidden="true"
                />
                <div className="relative aspect-[390/820] overflow-hidden rounded-[11.5%/5.5%] [container-type:size]">
                  <AnimatePresence initial={false}>
                    <motion.img
                      key={design.id}
                      src={shot(design.id, true)}
                      alt={`${copy.name} — ${t.phone}`}
                      width={shotWidth.phone}
                      height={design.hm}
                      decoding="async"
                      loading="lazy"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className="shot-travel absolute inset-x-0 top-0 h-auto w-full"
                      style={
                        {
                          "--travel": `${Math.round(design.hm / 110)}s`,
                        } as CSSProperties
                      }
                    />
                  </AnimatePresence>
                </div>
              </div>

              {/* which design is on show (phone and tablet, where the list is a row of chips) */}
              <p className="mt-4 text-[14px] leading-[1.5] text-white/65 lg:hidden">
                {copy.style}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
