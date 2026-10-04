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

// ---------------------------------------------------------------- DNS: where a domain lives today and what has to move with it

const DNS_TYPES = { A: 1, NS: 2, CNAME: 5, MX: 15, TXT: 16, AAAA: 28, DS: 43 };
const TYPE_NAMES = Object.fromEntries(Object.entries(DNS_TYPES).map(([k, v]) => [v, k]));

/** One DNS question over HTTPS (Cloudflare, Google as fallback). Answers: [{ name, type, data }]. */
async function dnsQuery(name, type) {
  const urls = [`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`, `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`];
  for (const url of urls) {
    try {
      const res = await fetchWithTimeout(url, 6000, { headers: { Accept: "application/dns-json" } });
      if (!res.ok) continue;
      const body = await res.json();
      return (body.Answer ?? []).map((a) => ({ name: String(a.name).replace(/\.$/, ""), type: TYPE_NAMES[a.type] ?? String(a.type), data: String(a.data) }));
    } catch {
      // try the next resolver
    }
  }
  return null;
}

const txt = (data) => (data.match(/"((?:[^"\\]|\\.)*)"/g) ?? [data]).map((s) => s.replace(/^"|"$/g, "")).join("");
const host = (s) => s.replace(/\.$/, "").toLowerCase();

// who runs the nameservers – for the usual providers in Germany
const DNS_HOSTS = [
  [/\.rzone\.de$/, "Strato"],
  [/\.ui-dns\.(com|org|biz|de)$|\.1and1|\.ionos\./, "IONOS"],
  [/\.ns\.cloudflare\.com$/, "Cloudflare"],
  [/\.domaincontrol\.com$/, "GoDaddy"],
  [/\.kasserver\.com$/, "All-Inkl"],
  [/hetzner|your-server\.de$|first-ns\.de$|second-ns\.(de|com)$|robotns/, "Hetzner"],
  [/\.inwx\.(de|eu|net|com)$/, "INWX"],
  [/netcup\.net$/, "netcup"],
  [/\.ovh\.net$|anycast\.me$/, "OVH"],
  [/dns-parking\.com$|hostinger/, "Hostinger"],
  [/squarespacedns\.com$|googledomains\.com$/, "Squarespace"],
  [/wixdns\.net$/, "Wix"],
  [/awsdns/, "Amazon Route 53"],
  [/checkdomain\.de$/, "checkdomain"],
  [/\.df\.eu$|domainfactory/, "domainfactory"],
  [/hosteurope\.de$/, "Host Europe"],
  [/webgo\.de$/, "webgo"],
];
const MAIL_HOSTS = [
  [/google\.com$|googlemail\.com$/, "Google Workspace"],
  [/outlook\.com$|protection\.outlook/, "Microsoft 365"],
  [/\.rzone\.de$/, "Strato-Mail"],
  [/kundenserver\.de$|ionos\./, "IONOS-Mail"],
  [/kasserver\.com$/, "All-Inkl-Mail"],
  [/your-server\.de$/, "Hetzner-Mail"],
  [/zoho\./, "Zoho Mail"],
  [/protonmail/, "Proton Mail"],
  [/mx\.cloudflare\.net$/, "Cloudflare E-Mail-Routing"],
  [/mailbox\.org$/, "mailbox.org"],
  [/secureserver\.net$/, "GoDaddy-Mail"],
  [/mail\.ovh\.net$|ovh\.net$/, "OVH-Mail"],
  [/hostinger/, "Hostinger-Mail"],
];
const DKIM_SELECTORS = ["google", "selector1", "selector2", "strato-dkim-0001", "strato-dkim-0002", "s1-ionos", "s2-ionos", "s1", "s2", "k1", "default", "dkim", "mail", "zoho", "protonmail", "protonmail2", "protonmail3"];
const match = (list, value) => list.find(([re]) => re.test(value))?.[1] ?? null;

/** Everything needed before moving a domain into Cloudflare: who hosts DNS today, website, mail, DNSSEC, and the records that must come along. */
export async function inspectDomain(raw) {
  const domain = cleanDomain(raw);
  if (!domain) return { error: "Keine gültige Domain – zum Beispiel beispiel.de" };
  const q = (name, type) => dnsQuery(name, type);
  const [registry, ns, a, aaaa, mx, rootTxt, ds, dmarc, www, ...dkim] = await Promise.all([
    checkDomain(domain),
    q(domain, "NS"),
    q(domain, "A"),
    q(domain, "AAAA"),
    q(domain, "MX"),
    q(domain, "TXT"),
    q(domain, "DS"),
    q(`_dmarc.${domain}`, "TXT"),
    q(`www.${domain}`, "CNAME"),
    ...DKIM_SELECTORS.map((s) => q(`${s}._domainkey.${domain}`, "TXT")),
  ]);
  if (ns === null) return { domain, error: "Die DNS-Abfrage hat nicht geantwortet – bitte gleich noch einmal versuchen." };

  const nameservers = ns.filter((r) => r.type === "NS").map((r) => host(r.data));
  const provider = match(DNS_HOSTS, nameservers[0] ?? "") ?? (nameservers.length ? "anderer Anbieter" : null);
  const mxList = (mx ?? []).filter((r) => r.type === "MX").map((r) => {
    const [prio, target] = r.data.split(/\s+/);
    return { priority: Number(prio), host: host(target ?? "") };
  }).sort((x, y) => x.priority - y.priority);
  const mail = mxList.length ? match(MAIL_HOSTS, mxList[0].host) ?? "eigener Mailserver" : null;
  const txts = (rootTxt ?? []).filter((r) => r.type === "TXT").map((r) => txt(r.data));
  const dmarcTxt = (dmarc ?? []).filter((r) => r.type === "TXT").map((r) => txt(r.data)).find((t) => /^v=DMARC1/i.test(t)) ?? null;
  const dkimFound = DKIM_SELECTORS.flatMap((sel, i) => {
    const answers = dkim[i] ?? [];
    const cname = answers.find((r) => r.type === "CNAME");
    if (cname) return [{ selector: sel, type: "CNAME", value: host(cname.data) }];
    const t = answers.find((r) => r.type === "TXT");
    return t && /v=DKIM1|k=rsa|p=/i.test(txt(t.data)) ? [{ selector: sel, type: "TXT", value: txt(t.data) }] : [];
  });

  // the records that must exist in Cloudflare before the nameservers change
  const carry = [
    ...mxList.map((m) => ({ type: "MX", name: "@", value: m.host, priority: m.priority, note: "E-Mail-Zustellung" })),
    ...txts.map((t) => ({ type: "TXT", name: "@", value: t, note: /^v=spf1/i.test(t) ? "SPF – wer Mails verschicken darf" : /verification|verify/i.test(t) ? "Bestätigung für einen Dienst" : "TXT-Eintrag" })),
    ...(dmarcTxt ? [{ type: "TXT", name: "_dmarc", value: dmarcTxt, note: "DMARC" }] : []),
    ...dkimFound.map((k) => ({ type: k.type, name: `${k.selector}._domainkey`, value: k.value, note: "DKIM – meist von Hand nachtragen" })),
  ];

  const warnings = [];
  if (registry.status === "free") warnings.push({ tone: "bad", text: "Die Domain ist gar nicht registriert – sie kann erst gekauft werden." });
  if (ds?.some((r) => r.type === "DS")) warnings.push({ tone: "bad", text: "DNSSEC ist an. Erst beim jetzigen Anbieter ausschalten, einen Tag warten, dann die Nameserver ändern – sonst ist die Domain danach nicht erreichbar." });
  if (provider === "Cloudflare") warnings.push({ tone: "warn", text: "Die Domain liegt schon bei Cloudflare – vielleicht in einem anderen Konto. Dann über „Domain hinzufügen“ in deinem Konto neu anlegen; Cloudflare zeigt dir neue Nameserver." });
  if (dkimFound.length) warnings.push({ tone: "warn", text: `DKIM gefunden (${dkimFound.map((k) => k.selector).join(", ")}). Den findet Cloudflare beim Einlesen meist nicht – von Hand nachtragen, sonst landen Mails im Spam.` });
  if (mail) warnings.push({ tone: "warn", text: `Auf der Domain läuft E-Mail (${mail}). Alle MX- und TXT-Einträge müssen vor dem Wechsel in Cloudflare stehen – und bleiben „Nur DNS“.` });
  if (provider === "Strato") warnings.push({ tone: "warn", text: "Strato: Ist das Nameserver-Feld ausgegraut, sind eigene MX-, A- oder SPF-Einträge gesetzt – die erst auf Standard zurückstellen. Bei „Domain Guard“ kommt ein Code aufs Handy des Inhabers." });

  return {
    domain,
    registered: registry.status,
    provider,
    nameservers,
    dnssec: !!ds?.some((r) => r.type === "DS"),
    website: { ipv4: (a ?? []).filter((r) => r.type === "A").map((r) => r.data), ipv6: (aaaa ?? []).filter((r) => r.type === "AAAA").map((r) => r.data), www: (www ?? []).find((r) => r.type === "CNAME") ? host(www.find((r) => r.type === "CNAME").data) : null },
    mail,
    mx: mxList,
    carry,
    warnings,
    checked: new Date().toISOString(),
  };
}
