import { Link } from "wouter";
import { useContact } from "@/components/ContactDialog";
import { LogoMark } from "@/components/Logo";
import { projects } from "@/data/projects";
import { mailto, site } from "@/data/site";
import { localeNames, locales, useLocale } from "@/i18n";
import { cn } from "@/lib/utils";

const linkClass = "text-[14px] text-muted transition-colors duration-300 hover:text-accent-ink";

export function Footer() {
  const openContact = useContact();
  const { t, locale, switchTo } = useLocale();
  return (
    <footer className="border-t border-ink/[0.07] bg-paper">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5">
            <LogoMark size={26} />
            <span className="text-[16px] font-semibold tracking-[-0.01em]">LX / {site.name}</span>
          </Link>
          <p className="mt-3 max-w-[280px] text-[14px] leading-relaxed text-muted">{t.common.role}</p>
          <ul className="mt-5 flex gap-4" aria-label={t.nav.language}>
            {locales.map((l) => (
              <li key={l}>
                <button
                  type="button"
                  lang={l}
                  onClick={() => switchTo(l)}
                  aria-pressed={l === locale}
                  className={cn("text-[13.5px] transition-colors duration-300", l === locale ? "font-medium text-ink" : "text-muted hover:text-accent-ink")}
                >
                  {localeNames[l]}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label={t.footer.selectedWork}>
          <h2 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-faint">{t.footer.selectedWork}</h2>
          <ul className="mt-4 space-y-2.5">
            {projects.map((p) => (
              <li key={p.slug}>
                <Link href={`/work/${p.slug}`} className={linkClass}>
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t.footer.contact}>
          <h2 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-faint">{t.footer.contact}</h2>
          <ul className="mt-4 space-y-2.5">
            <li>
              <a href={mailto(t.contact.subject)} className={linkClass}>
                {site.email}
              </a>
            </li>
            <li>
              <button type="button" onClick={openContact} className={linkClass}>
                {t.footer.start}
              </button>
            </li>
            {site.socials.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noreferrer" className={linkClass}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="container-page flex flex-col gap-1 border-t border-ink/[0.06] py-5 text-[12.5px] text-faint sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <p>{site.domain}</p>
      </div>
    </footer>
  );
}
