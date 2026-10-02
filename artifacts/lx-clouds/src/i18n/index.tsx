import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { Router, useLocation } from "wouter";
import { de } from "./de";
import { en, type Dict } from "./en";
import { sq } from "./sq";

export const locales = ["en", "de", "sq"] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = { en: "English", de: "Deutsch", sq: "Shqip" };

const dicts: Record<Locale, Dict> = { en, de, sq };
const STORAGE_KEY = "lx-lang";

/** English lives at the root; German and Albanian under /de and /sq. */
export const localePrefix = (locale: Locale) => (locale === "en" ? "" : `/${locale}`);

type LocaleContext = {
  locale: Locale;
  t: Dict;
  /** Current path without the language prefix. */
  path: string;
  switchTo: (locale: Locale) => void;
};

const Ctx = createContext<LocaleContext>({ locale: "en", t: en, path: "/", switchTo: () => {} });

export const useLocale = () => useContext(Ctx);
export const useT = () => useContext(Ctx).t;

/** Builds a real href (base path + language prefix) for plain anchors that bypass wouter's Link. */
export function useHref() {
  const { locale } = useContext(Ctx);
  return (path: string) => `${import.meta.env.BASE_URL.replace(/\/$/, "")}${localePrefix(locale)}${path}`;
}

/** The visitor's own choice, kept in a cookie so the edge function (functions/_middleware.js) can honour it. */
function readStored(): Locale | null {
  const v = document.cookie.match(/(?:^|;\s*)lx-lang=(en|de|sq)\b/)?.[1];
  return v === "en" || v === "de" || v === "sq" ? v : null;
}

function store(locale: Locale) {
  document.cookie = `${STORAGE_KEY}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}

/**
 * Reads the language from the first path segment and nests a router under it,
 * so every link inside the app stays within the active language.
 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [location, navigate] = useLocation();
  const segment = location.split("/")[1];
  const locale: Locale = segment === "de" || segment === "sq" ? segment : "en";
  const path = locale === "en" ? location : location.slice(3) || "/";

  // The language is picked by country at the edge (functions/_middleware.js): Germany, Austria and Switzerland → German,
  // Kosovo and Albania → Albanian, everyone else English. This is only the fallback for a stored
  // choice when the page is served without that function, e.g. in local development.
  useEffect(() => {
    if (window.location.pathname !== import.meta.env.BASE_URL) return;
    const wanted = readStored() ?? "en";
    if (wanted !== "en") navigate(`/${wanted}${window.location.hash}`, { replace: true });
    // only on the very first render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<LocaleContext>(
    () => ({
      locale,
      t: dicts[locale],
      path,
      switchTo: (next) => {
        store(next);
        navigate(`${localePrefix(next)}${path === "/" && next !== "en" ? "" : path}` || "/");
      },
    }),
    [locale, path, navigate],
  );

  return (
    <Ctx.Provider value={value}>
      <Router base={localePrefix(locale)}>{children}</Router>
    </Ctx.Provider>
  );
}
