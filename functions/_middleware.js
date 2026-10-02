/**
 * Picks the language of lxclouds.com by country (Cloudflare Pages Function).
 *
 *   Germany            → /de
 *   Kosovo, Albania    → /sq
 *   everywhere else    → English, at the root
 *
 * Only addresses without a language prefix are redirected (see public/_routes.json for the list),
 * a language the visitor picked in the switcher wins (cookie lx-lang), and crawlers are left alone
 * so every language version stays indexable from anywhere.
 */
const BY_COUNTRY = { DE: "de", XK: "sq", AL: "sq" };
const CRAWLER = /bot|crawl|spider|slurp|facebookexternalhit|embedly|preview|lighthouse|pagespeed/i;

function pickLanguage({ country, cookie, userAgent }) {
  const chosen = /(?:^|;\s*)lx-lang=(en|de|sq)\b/.exec(cookie ?? "")?.[1];
  if (chosen) return chosen;
  if (CRAWLER.test(userAgent ?? "")) return "en";
  return BY_COUNTRY[country] ?? "en";
}

export async function onRequest({ request, next }) {
  if (request.method !== "GET" && request.method !== "HEAD") return next();
  const language = pickLanguage({
    country: request.cf?.country,
    cookie: request.headers.get("Cookie"),
    userAgent: request.headers.get("User-Agent"),
  });
  if (language === "en") return next();

  const url = new URL(request.url);
  const path = url.pathname === "/" ? "" : url.pathname.replace(/\/$/, "");
  return new Response(null, {
    status: 302,
    headers: {
      Location: `/${language}${path}${url.search}`,
      "Cache-Control": "private, no-store",
      Vary: "Cookie",
    },
  });
}
