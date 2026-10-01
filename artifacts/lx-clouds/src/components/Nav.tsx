import * as Dialog from "@radix-ui/react-dialog";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, Mail, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ButtonLink } from "@/components/Button";
import { LogoMark } from "@/components/Logo";
import { mailto, navSections, site } from "@/data/site";
import { useActiveSection, useSectionNav } from "@/hooks/use-page";
import { localeNames, locales, useHref, useLocale } from "@/i18n";
import { cn } from "@/lib/utils";

function LanguageSwitch({ className }: { className?: string }) {
  const { locale, switchTo, t } = useLocale();
  return (
    <div role="group" aria-label={t.nav.language} className={cn("flex items-center rounded-full bg-ink/[0.05] p-[3px]", className)}>
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          onClick={() => switchTo(l)}
          aria-pressed={l === locale}
          title={localeNames[l]}
          className={cn(
            "relative h-[26px] min-w-[32px] rounded-full px-2 text-[11.5px] font-semibold uppercase tracking-[0.04em] transition-colors duration-300",
            l === locale ? "text-ink" : "text-ink/55 hover:text-ink",
          )}
        >
          {l === locale && (
            <motion.span
              layoutId={`lang-pill-${className ?? "nav"}`}
              className="absolute inset-0 rounded-full bg-white shadow-[0_1px_3px_rgba(17,18,27,0.12)]"
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
            />
          )}
          <span className="relative">{l}</span>
          <span className="sr-only"> — {localeNames[l]}</span>
        </button>
      ))}
    </div>
  );
}

/** Thin line under the header that fills with the scroll position of the page. */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });
  return (
    <motion.span
      className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gradient-to-r from-[#5468EE] via-accent to-[#B56BE6]"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}

export function Nav() {
  const [location] = useLocation();
  const { t } = useLocale();
  const href = useHref();
  const { goTo, onClick: go } = useSectionNav();
  const onHome = location === "/";
  const activeSection = useActiveSection(navSections, onHome);
  // on /work and case studies the "Work" entry stays marked
  const active = onHome ? activeSection : location.startsWith("/work") ? "work" : null;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500",
        scrolled
          ? "bg-paper/80 shadow-[0_1px_0_rgba(17,18,27,0.06)] backdrop-blur-xl backdrop-saturate-150"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-[68px] w-full max-w-[1240px] items-center justify-between px-5 md:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark size={27} />
          <span className="text-[17px] font-semibold tracking-[-0.01em]">{site.name}</span>
        </Link>

        <nav aria-label={t.nav.main} className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
          <ul className="flex items-center gap-1">
            {navSections.map((id) => (
              <li key={id}>
                <a
                  href={href(`/#${id}`)}
                  onClick={go(id)}
                  aria-current={active === id ? "true" : undefined}
                  className={cn(
                    "relative block whitespace-nowrap rounded-full px-3.5 py-2 text-[14px] transition-colors duration-300",
                    active === id ? "text-ink" : "text-ink/70 hover:text-ink",
                  )}
                >
                  {t.nav[id]}
                  <span
                    className={cn(
                      "absolute bottom-[3px] left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent transition-[opacity,scale] duration-300",
                      active === id ? "scale-100 opacity-100" : "scale-0 opacity-0",
                    )}
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LanguageSwitch />
          <a
            href={mailto(t.contact.subject)}
            className="inline-flex items-center gap-2 text-[14px] text-ink/80 transition-colors duration-300 hover:text-accent-ink"
          >
            <Mail className="size-[17px]" strokeWidth={1.7} aria-hidden="true" />
            {t.nav.email}
          </a>
          <ButtonLink href={href("/#work")} onClick={go("work")} size="sm" className="h-[38px] px-[18px]">
            {t.nav.viewProjects}
          </ButtonLink>
        </div>

        <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
          <Dialog.Trigger
            className="-mr-2 flex size-11 items-center justify-center rounded-full text-ink lg:hidden"
            aria-label={t.nav.openMenu}
          >
            <Menu className="size-[22px]" strokeWidth={1.8} aria-hidden="true" />
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Content
              className="fixed inset-0 z-[60] flex flex-col bg-paper data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in lg:hidden"
              aria-describedby={undefined}
            >
              <Dialog.Title className="sr-only">{t.nav.menu}</Dialog.Title>
              <div className="flex h-[68px] items-center justify-between px-5">
                <span className="flex items-center gap-2.5">
                  <LogoMark size={27} />
                  <span className="text-[17px] font-semibold tracking-[-0.01em]">{site.name}</span>
                </span>
                <Dialog.Close className="-mr-2 flex size-11 items-center justify-center rounded-full" aria-label={t.nav.closeMenu}>
                  <X className="size-[22px]" strokeWidth={1.8} aria-hidden="true" />
                </Dialog.Close>
              </div>
              <nav aria-label={t.nav.main} className="flex-1 px-5 pt-6">
                <ul>
                  {navSections.map((id, i) => (
                    <li key={id} className="border-b border-ink/[0.07]">
                      <a
                        href={href(`/#${id}`)}
                        onClick={(e) => {
                          e.preventDefault();
                          setMenuOpen(false);
                          // let the dialog release its scroll lock before moving the page
                          window.setTimeout(() => goTo(id), 60);
                        }}
                        className="flex items-baseline justify-between py-5 text-[34px] font-semibold tracking-[-0.03em]"
                      >
                        {t.nav[id]}
                        <span className="text-[12px] font-medium tracking-[0.1em] text-faint">0{i + 1}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="space-y-4 px-5 pb-8">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-faint">{t.nav.language}</span>
                  <LanguageSwitch className="menu" />
                </div>
                <ButtonLink
                  href={mailto(t.contact.subject)}
                  className="h-[52px] w-full text-[16px]"
                  icon={<ArrowUpRight className="size-4" aria-hidden="true" />}
                >
                  {t.nav.emailMe}
                </ButtonLink>
                <p className="text-center text-[13px] text-faint">{site.email}</p>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
      <ScrollProgress />
    </header>
  );
}
