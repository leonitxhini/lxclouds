// Live checks for project folios: is a domain still free, and how good is a website.
// Plain fetch, so the same code runs in the Pages Function and in Node scripts.

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36 lxclouds-check";

async function fetchWithTimeout(url, ms, init = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: controller.signal, headers: { "User-Agent": UA, ...(init.headers ?? {}) } });
  } finally {
    clearTimeout(timer);
  }
}

const RDAP = {
  de: (d) => `https://rdap.denic.de/domain/${d}`,
  com: (d) => `https://rdap.verisign.com/com/v1/domain/${d}`,
  net: (d) => `https://rdap.verisign.com/net/v1/domain/${d}`,
};

export function cleanDomain(value) {
  const d = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split(/[/?#]/)[0];
  return /^[a-z0-9äöüß-]+(\.[a-z0-9-]+)+$/.test(d) && d.length <= 80 ? d : null;
}

/** "free" when the registry does not know the domain, "taken" when it does, "unknown" when it could not be asked. */
export async function checkDomain(domain) {
  const d = cleanDomain(domain);
  if (!d) return { domain: String(domain), status: "unknown", error: "Keine gültige Domain" };
  const tld = d.split(".").pop();
  const url = (RDAP[tld] ?? ((x) => `https://rdap.org/domain/${x}`))(d);
  try {
    const res = await fetchWithTimeout(url, 9000, { headers: { Accept: "application/rdap+json" } });
    if (res.status === 404) return { domain: d, status: "free" };
    if (res.ok) return { domain: d, status: "taken" };
    return { domain: d, status: "unknown", error: `Registry antwortet ${res.status}` };
  } catch {
    return { domain: d, status: "unknown", error: "Registry nicht erreichbar" };
  }
}

const has = (html, re) => re.test(html);
const count = (html, re) => (html.match(re) ?? []).length;
const attr = (html, re) => (re.exec(html)?.[1] ?? "").replace(/\s+/g, " ").trim();
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ");

/** Reads a page the way a careful agency would in a first check: reachability, basics for Google, trust and contact, legal pages. */
export async function auditSite(rawUrl) {
  let url = String(rawUrl ?? "").trim();
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return { checked: new Date().toISOString(), error: "Keine gültige Adresse" };
  }
  const started = Date.now();
  let res;
  try {
    res = await fetchWithTimeout(parsed.href, 15000, { redirect: "follow" });
  } catch {
    // some sites only answer on http
    try {
      parsed.protocol = "http:";
      res = await fetchWithTimeout(parsed.href, 15000, { redirect: "follow" });
    } catch {
      return { checked: new Date().toISOString(), url: parsed.href, error: "Nicht erreichbar" };
    }
  }
  const ms = Date.now() - started;
  const buffer = await res.arrayBuffer();
  const html = new TextDecoder("utf-8").decode(buffer.slice(0, 3_000_000));
  const finalUrl = res.url || parsed.href;
  const origin = new URL(finalUrl).origin;
  const lower = html.toLowerCase();

  const [robots, sitemap] = await Promise.all(
    ["/robots.txt", "/sitemap.xml"].map((p) =>
      fetchWithTimeout(origin + p, 6000)
        .then(async (r) => r.ok && !/<html/i.test((await r.text()).slice(0, 400)))
        .catch(() => false),
    ),
  );

  const schema = [...html.matchAll(/"@type"\s*:\s*"([A-Za-z]+)"/g)].map((m) => m[1]);
  const images = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const result = {
    checked: new Date().toISOString(),
    url: parsed.href,
    finalUrl,
    status: res.status,
    https: finalUrl.startsWith("https://"),
    ms,
    kb: Math.round(buffer.byteLength / 1024),
    title: decode(attr(html, /<title[^>]*>([\s\S]*?)<\/title>/i)).slice(0, 160),
    description: decode(attr(html, /<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i) || attr(html, /<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["']/i)).slice(0, 300),
    h1: count(html, /<h1[\s>]/gi),
    viewport: has(html, /<meta[^>]+name=["']viewport["']/i),
    lang: attr(html, /<html[^>]*\blang=["']([^"']+)["']/i),
    canonical: has(html, /<link[^>]+rel=["']canonical["']/i),
    og: has(html, /<meta[^>]+property=["']og:/i),
    schema: [...new Set(schema)].slice(0, 12),
    localBusiness: schema.some((t) => /LocalBusiness|AccountingService|ProfessionalService|Organization|Store|Restaurant|Dentist|MedicalBusiness|RealEstateAgent|AutoRental|HomeAndConstructionBusiness|BeautySalon|HairSalon/.test(t)),
    impressum: /impressum|imprint|legal-notice/.test(lower),
    datenschutz: /datenschutz|privacy/.test(lower),
    phone: /href=["']tel:/.test(lower),
    email: /href=["']mailto:/.test(lower),
    whatsapp: /wa\.me\/|api\.whatsapp\.com/.test(lower),
    forms: count(html, /<form[\s>]/gi),
    booking: /calendly|termin|booking|buchen|reserv/i.test(lower),
    reviews: /google.*bewertung|provenexpert|trustpilot|kundenstimmen|bewertungen|testimonial/i.test(lower),
    images: images.length,
    imagesNoAlt: images.filter((tag) => !/\balt=["'][^"']+["']/i.test(tag)).length,
    noindex: /<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html),
    robots,
    sitemap,
    jsOnly: html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().length < 300,
  };
  result.score = scoreAudit(result);
  return result;
}

/** Our own 0–100 rating of the basics; every point is something a client can understand. */
export function scoreAudit(a) {
  if (a.error || !a.status || a.status >= 400) return 0;
  const checks = [
    [a.https, 10],
    [a.ms < 1500, 8],
    [a.kb < 1500, 4],
    [a.viewport, 10],
    [a.title.length >= 15 && a.title.length <= 70, 8],
    [a.description.length >= 70, 8],
    [a.h1 === 1, 6],
    [a.lang !== "", 3],
    [a.canonical, 3],
    [a.og, 3],
    [a.localBusiness, 6],
    [a.sitemap, 4],
    [a.robots, 2],
    [!a.noindex, 5],
    [a.phone || a.whatsapp, 6],
    [a.forms > 0 || a.booking, 6],
    [a.impressum, 4],
    [a.datenschutz, 4],
    [a.images === 0 || a.imagesNoAlt / a.images < 0.3, 2],
    [!a.jsOnly, 2],
  ];
  const total = checks.reduce((n, [, w]) => n + w, 0);
  return Math.round((checks.reduce((n, [ok, w]) => n + (ok ? w : 0), 0) / total) * 100);
}
