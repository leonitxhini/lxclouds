import { shotSrc, type Project, type ShotRef } from "@/data/projects";
import { useT } from "@/i18n";
import { asset, cn } from "@/lib/utils";

type FrameProps = {
  project: Project;
  shot: ShotRef;
  className?: string;
  /** Load immediately instead of lazily – for images above the fold. */
  eager?: boolean;
  /** Use the half-size file; enough for cards and collages. */
  small?: boolean;
  /** Dark window chrome; defaults to whether the project's own site is dark. */
  dark?: boolean;
};

/** Alt text of a screenshot: project name plus its translated caption. */
export function useShotAlt() {
  const t = useT();
  return (project: Project, shot: ShotRef) => `${project.name} — ${t.projects[project.slug].captions[shot.file] ?? shot.file}`;
}

export function BrowserFrame({ project, shot, className, eager, small, dark = project.brand.dark }: FrameProps) {
  const alt = useShotAlt();
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[14px] border",
        dark ? "border-white/10 bg-[#161826]" : "border-ink/[0.07] bg-white",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-[30px] items-center gap-1.5 border-b px-3",
          dark ? "border-white/[0.07]" : "border-ink/[0.06]",
        )}
        aria-hidden="true"
      >
        {[0, 1, 2].map((i) => (
          <span key={i} className={cn("size-[7px] rounded-full", dark ? "bg-white/20" : "bg-ink/[0.13]")} />
        ))}
        <span
          className={cn(
            "mx-auto -translate-x-4 rounded-full px-3 py-[3px] text-[10px] leading-none tracking-wide",
            dark ? "bg-white/[0.07] text-white/70" : "bg-ink/[0.045] text-ink/70",
          )}
        >
          {project.domain}
        </span>
      </div>
      <img
        src={asset(shotSrc(project, shot, small))}
        alt={alt(project, shot)}
        width={1600}
        height={1000}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="block aspect-[16/10] w-full object-cover object-top"
      />
    </div>
  );
}

export function PhoneFrame({ project, shot, className, eager, small }: FrameProps) {
  const alt = useShotAlt();
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[13%/6%] bg-[#0d0e16] p-[3.2%] shadow-[0_0_0_1px_rgba(255,255,255,0.14)_inset]",
        className,
      )}
    >
      <span
        className="absolute left-1/2 top-[2.6%] z-10 h-[2.4%] w-[26%] -translate-x-1/2 rounded-full bg-[#0d0e16]"
        aria-hidden="true"
      />
      <img
        src={asset(shotSrc(project, shot, small))}
        alt={alt(project, shot)}
        width={780}
        height={1688}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="block aspect-[390/844] w-full rounded-[11%/5%] object-cover object-top"
      />
    </div>
  );
}
