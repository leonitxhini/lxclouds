import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { Cta } from "@/components/home/Cta";
import { ProjectStage, TypeBadge } from "@/components/ProjectStage";
import { Reveal } from "@/components/Reveal";
import { projects, type Project } from "@/data/projects";
import { usePage } from "@/hooks/use-page";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";

function Showcase({ project, flip }: { project: Project; flip: boolean }) {
  const t = useT();
  const copy = t.projects[project.slug];
  const headline = copy.results[0];
  return (
    <article className="grid items-center gap-7 lg:grid-cols-12 lg:gap-12">
      <Reveal className={cn("lg:col-span-8", flip && "lg:order-2")}>
        <Link href={`/work/${project.slug}`} className="group block" aria-label={`${project.name} — ${t.common.viewCase}`}>
          <ProjectStage project={project} />
        </Link>
      </Reveal>

      <Reveal delay={0.08} className={cn("lg:col-span-4", flip && "lg:order-1")}>
        <p className="text-[13px] font-medium tracking-[0.12em] text-faint">
          {project.index} / 0{projects.length}
        </p>
        <h2 className="mt-3 text-[38px] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-[46px]">{project.name}</h2>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <TypeBadge type={project.type} />
          <span className="text-[13px] text-muted">{copy.category}</span>
        </div>
        <p className="mt-5 max-w-[420px] text-[16.5px] leading-[1.55] text-muted">{copy.summary}</p>
        {headline && (
          <p className="mt-5 flex items-baseline gap-2.5">
            <span className="text-gradient text-[30px] font-semibold leading-none tracking-[-0.03em]">{headline.value}</span>
            <span className="text-[14.5px] text-ink/80">{headline.label}</span>
          </p>
        )}
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            href={`/work/${project.slug}`}
            className="group/btn inline-flex h-11 items-center gap-2 rounded-full bg-ink px-[22px] text-[14.5px] font-medium text-white transition-[background-color,box-shadow] duration-300 hover:bg-[#23243a] hover:shadow-[0_12px_26px_-10px_rgba(104,101,255,0.65)]"
          >
            {t.common.viewCase}
            <ArrowRight className="size-[15px] transition-transform duration-300 group-hover/btn:translate-x-[3px]" aria-hidden="true" />
          </Link>
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-1.5 text-[14.5px] text-ink underline decoration-ink/25 underline-offset-[5px] transition-colors hover:decoration-accent"
          >
            {project.domain}
            <ArrowUpRight
              className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </a>
        </div>
      </Reveal>
    </article>
  );
}

export default function Work() {
  const t = useT();
  usePage({ title: t.meta.workTitle, description: t.meta.workDescription, path: "/work" });

  return (
    <>
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[520px]"
          aria-hidden="true"
          style={{
            background: [
              "radial-gradient(620px 380px at 8% 10%, rgba(196,188,255,0.4), transparent 70%)",
              "radial-gradient(600px 380px at 96% 0%, rgba(186,208,255,0.42), transparent 70%)",
            ].join(","),
          }}
        />
        <div className="container-page relative pb-12 pt-[128px] sm:pb-16 sm:pt-[150px]">
          <Reveal>
            <p className="eyebrow">{t.work.eyebrow}</p>
            <h1 className="mt-4 max-w-[980px] text-[44px] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-[68px]">
              {t.work.pageTitle1} <span className="text-gradient">{t.work.pageTitle2}</span>
            </h1>
            <p className="mt-5 max-w-[560px] text-[17px] leading-[1.55] text-muted">{t.work.pageSub}</p>
          </Reveal>
        </div>
      </section>

      <div className="container-page space-y-20 pb-10 sm:space-y-28">
        {projects.map((project, i) => (
          <Showcase key={project.slug} project={project} flip={i % 2 === 1} />
        ))}
      </div>

      <Cta />
    </>
  );
}
