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

function readStored(): Locale | null {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "en" || v === "de" || v === "sq" ? v : null;
  } catch {
    return null;
  }
}

function store(locale: Locale) {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // private mode: the choice simply lasts for this visit
  }
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

  // First arrival on the root address: honour a stored choice, else the browser language.
  useEffect(() => {
    if (window.location.pathname !== import.meta.env.BASE_URL) return;
    const browser = navigator.language.slice(0, 2).toLowerCase();
    const wanted = readStored() ?? (browser === "de" || browser === "sq" ? browser : "en");
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
