import { useEffect, useState, type MouseEvent } from "react";
import { useLocation } from "wouter";
import { site } from "@/data/site";
import { localePrefix, locales, useLocale } from "@/i18n";

function upsertLink(rel: string, hreflang: string | null, href: string) {
  const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]`;
  let link = document.head.querySelector<HTMLLinkElement>(selector);
  if (!link) {
    link = document.createElement("link");
    link.rel = rel;
    if (hreflang) link.hreflang = hreflang;
    document.head.appendChild(link);
  }
  link.href = href;
}

function setMeta(selector: string, value: string) {
  document.head.querySelector(selector)?.setAttribute("content", value);
}

/**
 * Per-page title, meta and language alternates, plus scroll position:
 * top of the page, or the section named in the hash.
 * `path` is the path without the language prefix.
 */
export function usePage({ title, description, path }: { title: string; description: string; path: string }) {
  const { locale } = useLocale();

  useEffect(() => {
    const urlFor = (l: (typeof locales)[number]) => `${site.url}${localePrefix(l)}${path === "/" && l !== "en" ? "" : path}`;
    document.title = title;
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:url"]', urlFor(locale));
    upsertLink("canonical", null, urlFor(locale));
    for (const l of locales) upsertLink("alternate", l, urlFor(l));
    upsertLink("alternate", "x-default", urlFor("en"));
  }, [title, description, path, locale]);

  useEffect(() => {
    const id = window.location.hash.slice(1);
    const target = id ? document.getElementById(id) : null;
    if (target) target.scrollIntoView({ behavior: "instant" as ScrollBehavior });
    else window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [path]);
}

/** Scrolls to a section of the home page, navigating there first when on another route. */
export function useSectionNav() {
  const [location, navigate] = useLocation();
  const goTo = (hash: string) => {
    if (location === "/") {
      document.getElementById(hash)?.scrollIntoView();
      window.history.replaceState(null, "", `#${hash}`);
    } else {
      navigate(`/#${hash}`);
    }
  };
  /** onClick for an anchor that points at a home section. */
  const onClick = (hash: string) => (e: MouseEvent) => {
    e.preventDefault();
    goTo(hash);
  };
  return { goTo, onClick };
}

/** Id of the home section currently crossing the upper part of the viewport. */
export function useActiveSection(ids: readonly string[], enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) {
      setActive(null);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    const nodes = ids.map((id) => document.getElementById(id)).filter((n): n is HTMLElement => n !== null);
    nodes.forEach((n) => observer.observe(n));
    const clearAtTop = () => {
      if (window.scrollY < 200) setActive(null);
    };
    window.addEventListener("scroll", clearAtTop, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", clearAtTop);
    };
  }, [ids, enabled]);
  return active;
}
