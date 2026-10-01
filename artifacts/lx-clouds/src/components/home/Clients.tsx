import { motion } from "framer-motion";
import { ArrowRight, Check, Store, Workflow, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { useContact } from "@/components/ContactDialog";
import { Reveal } from "@/components/Reveal";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";

const icons: LucideIcon[] = [Store, Workflow];

/** The two kinds of client, as panels that widen when hovered or focused. */
export function Clients() {
  const t = useT().clients;
  const openContact = useContact();
  const [active, setActive] = useState(0);

  return (
    <section aria-labelledby="clients-title" className="container-page pt-20 xl:pt-24">
      <Reveal>
        <p className="eyebrow">{t.eyebrow}</p>
        <h2 id="clients-title" className="mt-2.5 max-w-[640px] text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[40px]">
          {t.title}
        </h2>
      </Reveal>

      <Reveal delay={0.08} className="mt-8 flex flex-col gap-3.5 lg:flex-row">
        {t.items.map((item, i) => {
          const Icon = icons[i];
          const on = active === i;
          return (
            <motion.article
              key={item.title}
              onPointerEnter={(e) => e.pointerType !== "touch" && setActive(i)}
              onFocusCapture={() => setActive(i)}
              onClick={() => setActive(i)}
              animate={{ flexGrow: on ? 1.5 : 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "relative overflow-hidden rounded-[24px] border p-7 lg:basis-0 transition-[background-color,border-color,box-shadow,color] duration-500 sm:p-9",
                on ? "border-transparent bg-night text-white shadow-[0_30px_60px_-34px_rgba(17,18,27,0.75)]" : "border-ink/[0.07] bg-white",
              )}
            >
              <div
                className={cn(
                  "pointer-events-none absolute -right-20 -top-24 size-[320px] rounded-full bg-[#6865FF]/40 blur-[90px] transition-opacity duration-700",
                  on ? "opacity-100" : "opacity-0",
                )}
                aria-hidden="true"
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "flex size-[52px] items-center justify-center rounded-[15px] transition-colors duration-500",
                      on ? "bg-white/[0.12] text-white" : "bg-accent-soft text-accent",
                    )}
                  >
                    <Icon className="size-6" strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <span className={cn("text-[13px] font-medium tracking-[0.12em] transition-colors duration-500", on ? "text-white/50" : "text-faint")}>
                    0{i + 1}
                  </span>
                </div>

                <h3 className="mt-7 max-w-[420px] text-[25px] font-semibold leading-[1.15] tracking-[-0.025em] sm:text-[28px]">{item.title}</h3>
                <p className={cn("mt-3 max-w-[470px] text-[15.5px] leading-[1.55] transition-colors duration-500", on ? "text-white/75" : "text-muted")}>
                  {item.body}
                </p>

                <ul className="mt-6 space-y-2.5">
                  {item.points.map((point) => (
                    <li key={point} className={cn("flex items-start gap-3 text-[14.5px] transition-colors duration-500", on ? "text-white/90" : "text-ink/80")}>
                      <span
                        className={cn(
                          "mt-[3px] flex size-[18px] shrink-0 items-center justify-center rounded-full transition-colors duration-500",
                          on ? "bg-[#7C79FF] text-white" : "bg-accent-soft text-accent",
                        )}
                      >
                        <Check className="size-3" strokeWidth={2.6} aria-hidden="true" />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={openContact}
                  className={cn(
                    "group/btn mt-8 inline-flex h-11 items-center gap-2 rounded-full px-[22px] text-[14.5px] font-medium transition-[background-color,color,border-color] duration-500",
                    on ? "bg-white text-ink hover:bg-accent-soft" : "border border-ink/10 bg-white text-ink hover:border-accent/40",
                  )}
                >
                  {t.cta}
                  <ArrowRight className="size-[15px] transition-transform duration-300 group-hover/btn:translate-x-[3px]" strokeWidth={2} aria-hidden="true" />
                </button>
              </div>
            </motion.article>
          );
        })}
      </Reveal>
    </section>
  );
}
