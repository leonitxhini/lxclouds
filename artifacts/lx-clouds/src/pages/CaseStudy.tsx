import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ImageOff } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "wouter";
import { BrowserFrame, PhoneFrame } from "@/components/Frames";
import { Cta } from "@/components/home/Cta";
import { CountUp } from "@/components/home/Results";
import { ProjectStage, TypeBadge } from "@/components/ProjectStage";
import { Reveal } from "@/components/Reveal";
import { getProject, projects, shotSrc } from "@/data/projects";
import { usePage } from "@/hooks/use-page";
import { useT } from "@/i18n";
import NotFound from "@/pages/not-found";
import { asset, cn } from "@/lib/utils";

/** A case-study chapter: label on the left, content on the right. */
function Chapter({ label, title, children }: { label: string; title: string; children: ReactNode }) {
  return (
    <section className="grid grid-cols-[minmax(0,1fr)] gap-5 border-t border-ink/[0.08] py-12 sm:py-16 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-12">
      <Reveal>
        <p className="eyebrow lg:sticky lg:top-24">{label}</p>
      </Reveal>
      <div>
        <Reveal>
          <h2 className="max-w-[720px] text-[28px] font-semibold leading-[1.12] tracking-[-0.03em] sm:text-[36px]">{title}</h2>
        </Reveal>
        <div className="mt-7">{children}</div>
      </div>
    </section>
  );
}

export default function CaseStudy({ slug }: { slug: string }) {
  const t = useT();
  const c = t.caseStudy;
  const project = getProject(slug);
  const copy = project ? t.projects[project.slug] : undefined;
  usePage({
    title: project ? t.meta.caseTitle(project.name) : t.meta.notFoundTitle,
    description: copy?.summary ?? t.meta.notFoundDescription,
    path: `/work/${slug}`,
  });
  if (!project || !copy) return <NotFound />;

  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  const nextCopy = t.projects[next.slug];
  const desktop = project.gallery.filter((s) => s.kind === "desktop");
  const mobile = project.gallery.filter((s) => s.kind === "mobile");
  const { brand } = project;

  return (
    <article>
      <header className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[560px] opacity-70"
          aria-hidden="true"
          style={{
            background: `radial-gradient(700px 420px at 88% 0%, ${brand.color}2e, transparent 70%), radial-gradient(620px 380px at 6% 8%, rgba(196,188,255,0.38), transparent 70%)`,
          }}
        />
        <div className="container-page relative pt-[104px] sm:pt-[120px]">
          <Link href="/work" className="group inline-flex items-center gap-2 text-[14px] text-muted transition-colors hover:text-ink">
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" strokeWidth={1.8} aria-hidden="true" />
            {c.allWork}
          </Link>

          <Reveal className="mt-9">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[13px] font-medium tracking-[0.12em] text-faint">
                {project.index} / 0{projects.length}
              </span>
              <TypeBadge type={project.type} />
            </div>
            <h1 className="mt-4 text-[50px] font-semibold leading-[0.98] tracking-[-0.045em] sm:text-[84px]">{project.name}</h1>
            <p className="mt-5 max-w-[680px] text-[19px] leading-[1.45] text-muted sm:text-[22px]">{copy.summary}</p>
          </Reveal>

          <Reveal delay={0.08}>
            <dl className="mt-10 grid gap-x-8 gap-y-6 border-t border-ink/[0.08] pt-7 sm:grid-cols-2 lg:grid-cols-4">
              {[
                [c.category, copy.category],
                [c.role, copy.role],
                [c.stack, project.stack.join(" · ")],
              ].map(([term, value]) => (
                <div key={term}>
                  <dt className="text-[12px] font-semibold uppercase tracking-[0.12em] text-faint">{term}</dt>
                  <dd className="mt-1.5 text-[15px] leading-snug">{value}</dd>
                </div>
              ))}
              <div>
                <dt className="text-[12px] font-semibold uppercase tracking-[0.12em] text-faint">{c.live}</dt>
                <dd className="mt-1.5">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1 text-[15px] text-accent-ink underline decoration-accent/30 underline-offset-4 hover:decoration-accent"
                  >
                    {project.domain}
                    <ArrowUpRight
                      className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </a>
                </dd>
              </div>
            </dl>
          </Reveal>

          <Reveal y={36} delay={0.12} className="mt-10 sm:mt-12">
            <ProjectStage project={project} eager />
          </Reveal>

          {copy.results.length > 0 && (
            <ul className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[22px] border border-ink/[0.07] bg-ink/[0.07] lg:grid-cols-4">
              {copy.results.map((r, i) => (
                <li key={r.label} className="bg-white">
                  <Reveal delay={i * 0.06} className="h-full px-5 py-6 sm:px-7 sm:py-7">
                    <p className="w-fit text-[34px] font-semibold leading-none tracking-[-0.04em] sm:text-[46px]" style={{ color: brand.color }}>
                      <CountUp value={r.value} />
                    </p>
                    <p className="mt-2.5 text-[14px] leading-snug text-muted">{r.label}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
          )}

          <Reveal className="mt-4">
            <div className="rounded-[22px] bg-night px-6 py-7 text-white sm:px-9 sm:py-9">
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#A9A6FF]">{c.forYou}</p>
              <p className="mt-3 max-w-[820px] text-[20px] leading-[1.45] tracking-[-0.01em] sm:text-[24px]">{copy.forYou}</p>
            </div>
          </Reveal>
        </div>
      </header>

      <div className="container-page mt-14 sm:mt-20">
        <Chapter label={c.overview} title={c.overviewTitle(project.name)}>
          <div className="max-w-[720px] space-y-5 text-[17px] leading-[1.65] text-ink/80">
            {copy.overview.map((p) => (
              <Reveal key={p}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
        </Chapter>

        <Chapter label={c.problemLabel} title={c.problemTitle}>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              [c.problem, copy.problem],
              [c.objective, copy.objective],
            ].map(([heading, body], i) => (
              <Reveal key={heading} delay={i * 0.08} className="h-full">
                <div className={cn("h-full rounded-[22px] p-7 sm:p-8", i === 0 ? "border border-ink/[0.07] bg-white" : "bg-night text-white")}>
                  <h3 className={cn("text-[12px] font-semibold uppercase tracking-[0.12em]", i === 0 ? "text-faint" : "text-white/55")}>{heading}</h3>
                  <p className={cn("mt-4 text-[18px] leading-[1.5] sm:text-[19px]", i === 0 ? "text-ink/85" : "text-white/90")}>{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Chapter>

        <Chapter label={c.contributionLabel} title={project.type === "client" ? c.contributionTitleClient : c.contributionTitleProduct}>
          <ul className="grid gap-x-10 sm:grid-cols-2">
            {copy.contribution.map((item, i) => (
              <li key={item}>
                <Reveal delay={(i % 2) * 0.05} className="flex items-center gap-3.5 border-b border-ink/[0.07] py-4 text-[16.5px]">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                    <Check className="size-3.5" strokeWidth={2.4} aria-hidden="true" />
                  </span>
                  {item}
                </Reveal>
              </li>
            ))}
          </ul>
        </Chapter>

        <Chapter label={c.approachLabel} title={c.approachTitle}>
          <ol>
            {copy.approach.map((step, i) => (
              <li key={step.title}>
                <Reveal className="group grid gap-2 border-b border-ink/[0.07] py-6 transition-colors duration-500 hover:border-accent/40 sm:grid-cols-[64px_minmax(0,280px)_minmax(0,1fr)] sm:gap-6 sm:py-7">
                  <span className="text-[13px] font-medium tracking-[0.1em] text-faint transition-colors duration-500 group-hover:text-accent-ink">
                    0{i + 1}
                  </span>
                  <h3 className="text-[20px] font-semibold leading-tight tracking-[-0.015em]">{step.title}</h3>
                  <p className="text-[16px] leading-[1.6] text-muted">{step.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
          <Reveal className="mt-8 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span key={tech} className="rounded-full border border-ink/10 bg-white px-3.5 py-1.5 text-[13.5px]">
                {tech}
              </span>
            ))}
          </Reveal>
        </Chapter>

        <Chapter label={c.featuresLabel} title={c.featuresTitle}>
          <ul className="grid gap-px overflow-hidden rounded-[22px] border border-ink/[0.07] bg-ink/[0.07] sm:grid-cols-2 lg:grid-cols-3">
            {copy.features.map((feature, i) => (
              <li key={feature.title} className="bg-white">
                <Reveal delay={(i % 3) * 0.05} className="h-full p-6 sm:p-7">
                  <span className="block h-[3px] w-7 rounded-full" style={{ background: brand.color }} aria-hidden="true" />
                  <h3 className="mt-5 text-[17px] font-semibold tracking-[-0.01em]">{feature.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-[1.55] text-muted">{feature.body}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </Chapter>

        <Chapter label={c.showcaseLabel} title={c.showcaseTitle}>
          <p className="-mt-3 max-w-[640px] text-[15.5px] leading-[1.6] text-muted">{c.showcaseNote(project.domain)}</p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {desktop.map((s, i) => (
              <Reveal key={s.file} delay={(i % 2) * 0.07}>
                <figure className="group">
                  <div className="overflow-hidden rounded-[20px] p-4 sm:p-6" style={{ background: brand.backdrop }}>
                    <BrowserFrame
                      project={project}
                      shot={s}
                      className="shadow-[0_26px_50px_-28px_rgba(17,18,27,0.5)] transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.025]"
                    />
                  </div>
                  <figcaption className="mt-3 text-[14px] text-muted">{copy.captions[s.file]}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          <div
            className="no-scrollbar -mx-5 mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto rounded-none px-5 py-8 sm:mx-0 sm:justify-center sm:gap-10 sm:rounded-[24px] sm:px-10 sm:py-12"
            style={{ background: brand.backdrop }}
          >
            {mobile.map((s) => (
              <figure key={s.file} className="w-[58vw] max-w-[250px] shrink-0 snap-center sm:w-[220px]">
                <PhoneFrame project={project} shot={s} className="shadow-[0_30px_50px_-24px_rgba(17,18,27,0.55)]" />
                <figcaption className={cn("mt-4 text-center text-[13.5px]", brand.dark ? "text-white/65" : "text-muted")}>{copy.captions[s.file]}</figcaption>
              </figure>
            ))}
          </div>

          {copy.missing && (
            <Reveal className="mt-6">
              <div className="flex items-start gap-4 rounded-[18px] border border-dashed border-ink/20 bg-white/60 p-5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-ink/[0.05] text-muted">
                  <ImageOff className="size-5" strokeWidth={1.7} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-faint">{c.notShown}</p>
                  <p className="mt-1.5 max-w-[640px] text-[15px] leading-[1.55] text-ink/80">{copy.missing}</p>
                </div>
              </div>
            </Reveal>
          )}
        </Chapter>

        <Chapter label={c.resultsLabel} title={copy.results.length ? c.resultsTitle : c.resultsTitleNone}>
          {copy.results.length > 0 && (
            <ul className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {copy.results.map((r, i) => (
                <li key={r.label}>
                  <Reveal delay={i * 0.07}>
                    <p className="rounded-[22px] border border-ink/[0.07] bg-white p-7">
                      <span className="block text-[44px] font-semibold leading-none tracking-[-0.04em]" style={{ color: brand.color }}>
                        {r.value}
                      </span>
                      <span className="mt-3 block text-[15px] text-muted">{r.label}</span>
                    </p>
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
          <Reveal>
            <p className="max-w-[640px] text-[15.5px] leading-[1.6] text-muted">{copy.resultsNote}</p>
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="group/btn mt-7 inline-flex h-[52px] items-center gap-2.5 rounded-full px-7 text-[16px] font-medium text-white transition-[filter,box-shadow] duration-300 hover:brightness-110"
              style={{ background: brand.color, boxShadow: `0 16px 34px -16px ${brand.color}` }}
            >
              {c.visit(project.domain)}
              <ArrowUpRight
                className="size-[18px] transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </Reveal>
        </Chapter>
      </div>

      <Link href={`/work/${next.slug}`} className="group mt-6 block border-y border-ink/[0.08] bg-white/50 transition-colors duration-500 hover:bg-white">
        <div className="container-page flex items-center justify-between gap-6 py-9 sm:py-12">
          <div className="min-w-0">
            <p className="eyebrow">{c.next}</p>
            <p className="mt-2 flex items-center gap-4 text-[34px] font-semibold leading-none tracking-[-0.035em] sm:text-[56px]">
              <span className="truncate">{next.name}</span>
              <ArrowRight
                className="size-7 shrink-0 text-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 sm:size-10"
                strokeWidth={1.6}
                aria-hidden="true"
              />
            </p>
            <p className="mt-3 text-[14.5px] text-muted">{nextCopy.category}</p>
          </div>
          <div className="hidden w-[280px] shrink-0 overflow-hidden rounded-[14px] border border-ink/[0.07] md:block">
            <img
              src={asset(shotSrc(next, next.cover, true))}
              alt=""
              width={800}
              height={500}
              loading="lazy"
              className="aspect-[16/10] w-full object-cover object-top transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            />
          </div>
        </div>
      </Link>

      <Cta />
    </article>
  );
}
