import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { BrowserFrame, PhoneFrame } from "@/components/Frames";
import type { Project } from "@/data/projects";
import { useT } from "@/i18n";
import { asset, cn } from "@/lib/utils";

/**
 * Brand-coloured panel holding the real desktop and mobile screens of a project.
 * The screens travel at slightly different speeds while the panel crosses the viewport.
 */
export function ProjectStage({ project, eager, className }: { project: Project; eager?: boolean; className?: string }) {
  const { brand } = project;
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const browserY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [26, -26]);
  const phoneY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [70, -70]);

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden rounded-[24px] sm:rounded-[30px]", className)}
      style={{ background: brand.backdrop }}
    >
      <div
        className="pointer-events-none absolute -right-[10%] -top-[30%] size-[60%] rounded-full opacity-25 blur-[90px]"
        style={{ background: brand.color }}
        aria-hidden="true"
      />
      <div className="relative px-[6%] pb-[7%] pt-[6%] sm:px-[7%]">
        <img
          src={asset(brand.logo.src)}
          alt={`${project.name} logo`}
          width={brand.logo.width}
          height={brand.logo.height}
          loading={eager ? "eager" : "lazy"}
          className={cn("w-auto", brand.logo.width === brand.logo.height ? "h-9 sm:h-11" : "h-6 sm:h-7")}
        />
        <div className="relative mt-[5%]">
          <motion.div style={{ y: browserY }} className="w-[88%]">
            <BrowserFrame
              project={project}
              shot={project.cover}
              eager={eager}
              className="shadow-[0_40px_80px_-36px_rgba(17,18,27,0.55)] transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5"
            />
          </motion.div>
          <motion.div style={{ y: phoneY }} className="absolute -bottom-[4%] right-0 w-[21%]">
            <PhoneFrame
              project={project}
              shot={project.coverMobile}
              eager={eager}
              className="shadow-[0_30px_50px_-20px_rgba(17,18,27,0.6)] transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-3"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export function TypeBadge({ type }: { type: Project["type"] }) {
  const t = useT().common;
  const client = type === "client";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-medium",
        client ? "bg-ink text-white" : "bg-accent-soft text-accent-ink",
      )}
    >
      <span className={cn("size-1.5 rounded-full", client ? "bg-[#7CF0B2]" : "bg-accent")} aria-hidden="true" />
      {client ? t.typeClient : t.typeProduct}
    </span>
  );
}
