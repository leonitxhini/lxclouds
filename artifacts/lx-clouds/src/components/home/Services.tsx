import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Bot, LayoutDashboard, Layers, Monitor, Plus, Smartphone, type LucideIcon } from "lucide-react";
import { useState, type PointerEvent } from "react";
import { Link } from "wouter";
import { Reveal } from "@/components/Reveal";
import { projects } from "@/data/projects";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";

/** Icon, tint and the project that demonstrates each service – same order as the copy. */
const serviceMeta: { icon: LucideIcon; color: string; tint: string; proof?: string }[] = [
  { icon: Monitor, color: "#8A5CF6", tint: "#F0E9FF", proof: "rron-rent-a-car" },
  { icon: Smartphone, color: "#EE4D6E", tint: "#FFE9ED", proof: "zgjedhplus" },
  { icon: Bot, color: "#3F6BF0", tint: "#E6EDFF", proof: "framenotion" },
  { icon: LayoutDashboard, color: "#3F6BF0", tint: "#E6EDFF", proof: "subtoapi" },
  { icon: Layers, color: "#FFFFFF", tint: "rgba(255,255,255,0.14)" },
];

function trackPointer(e: PointerEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

export function Services() {
  const t = useT().services;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="services" aria-labelledby="services-title" className="container-page pt-16 xl:pt-[72px]">
      <Reveal className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <h2 id="services-title" className="text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[31px]">
          {t.title}
        </h2>
        <p className="text-[14.5px] text-muted sm:mb-1">{t.sub}</p>
      </Reveal>

      <ul className="mt-6 grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[14px]">
        {t.items.map((service, i) => {
          const meta = serviceMeta[i];
          const Icon = meta.icon;
          const isOpen = open === i;
          const featured = i === t.items.length - 1;
          const proof = projects.find((p) => p.slug === meta.proof);
          const panelId = `service-panel-${i}`;
          return (
            <li key={service.title} className={cn(featured && "sm:col-span-2")}>
              <Reveal delay={(i % 3) * 0.06}>
                <div
                  onPointerMove={trackPointer}
                  className={cn(
                    "spotlight group overflow-hidden rounded-[16px] border transition-[border-color,box-shadow] duration-500",
                    featured
                      ? "border-transparent bg-night text-white shadow-[0_24px_50px_-28px_rgba(17,18,27,0.7)]"
                      : "border-ink/[0.06] bg-white hover:border-accent/25 hover:shadow-card",
                    isOpen && !featured && "border-accent/30 shadow-card",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full items-center gap-5 px-5 py-[19px] text-left"
                  >
                    <span
                      className="flex size-[52px] shrink-0 items-center justify-center rounded-[14px] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-6 group-hover:scale-105"
                      style={{ background: meta.tint, color: meta.color }}
                    >
                      <Icon className="size-6" strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15.5px] font-semibold tracking-[-0.01em]">{service.title}</span>
                      <span className={cn("mt-1 block text-[13.5px] leading-[1.4]", featured ? "max-w-[420px] text-white/70" : "max-w-[260px] text-muted")}>
                        {service.body}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full border transition-[rotate,background-color,color,border-color] duration-300",
                        featured ? "border-white/20 text-white" : "border-ink/10 text-ink/70",
                        isOpen && (featured ? "rotate-45 bg-white text-ink" : "rotate-45 border-accent bg-accent text-white"),
                      )}
                      aria-hidden="true"
                    >
                      <Plus className="size-4" strokeWidth={2} />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className={cn("mx-5 border-t pb-5 pt-4", featured ? "border-white/12" : "border-ink/[0.07]")}>
                          <p className={cn("text-[11px] font-semibold uppercase tracking-[0.12em]", featured ? "text-white/50" : "text-faint")}>
                            {t.includes}
                          </p>
                          <ul className={cn("mt-3 grid gap-x-6 gap-y-2", featured ? "sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1")}>
                            {service.points.map((point, k) => (
                              <motion.li
                                key={point}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.12 + k * 0.05, duration: 0.4 }}
                                className={cn("flex items-center gap-2.5 text-[13.5px]", featured ? "text-white/85" : "text-ink/80")}
                              >
                                <span className="size-[5px] shrink-0 rounded-full" style={{ background: featured ? "#7C79FF" : meta.color }} aria-hidden="true" />
                                {point}
                              </motion.li>
                            ))}
                          </ul>
                          {proof && (
                            <Link
                              href={`/work/${proof.slug}`}
                              className="group/link mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-accent-ink"
                            >
                              {t.seenIn} {proof.name}
                              <ArrowUpRight
                                className="size-3.5 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                                strokeWidth={2}
                                aria-hidden="true"
                              />
                            </Link>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
