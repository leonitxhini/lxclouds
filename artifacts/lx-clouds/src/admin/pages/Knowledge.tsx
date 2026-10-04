import { ArrowLeft, ArrowRight, BookOpen, Check, Copy, Globe, Loader2, Search } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { api, ApiError } from "../api";
import { Badge, Btn, Card, Input, PageHeader } from "../ui";

// ---------------------------------------------------------------- the list of guides

const guides = [
  {
    slug: "domain-umzug",
    title: "Domain in dein Cloudflare holen",
    text: "Nameserver-Wechsel Schritt für Schritt: Domain prüfen, Einträge übernehmen, beim Anbieter umstellen, Website verbinden – und was du sagst, wenn der Kunde fragt.",
    icon: Globe,
    tags: ["Domains", "E-Mail", "Cloudflare"],
  },
];

export function Knowledge() {
  return (
    <>
      <PageHeader title="Wissen" sub="Anleitungen und Werkzeuge für Kundenprojekte – zum Nachschlagen vor und während eines Termins." />
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {guides.map((g) => (
          <li key={g.slug}>
            <Link href={`/wissen/${g.slug}`} className="group block h-full">
              <Card className="flex h-full flex-col p-5 transition-[border-color,box-shadow] duration-200 group-hover:border-accent/30 group-hover:shadow-card">
                <span className="flex size-10 items-center justify-center rounded-[12px] bg-accent-soft text-accent-ink">
                  <g.icon className="size-5" aria-hidden="true" />
                </span>
                <h2 className="mt-4 text-[17px] font-semibold">{g.title}</h2>
                <p className="mt-1.5 flex-1 text-[14px] leading-relaxed text-muted">{g.text}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                  <span className="flex flex-wrap gap-1.5">
                    {g.tags.map((t) => (
                      <Badge key={t}>{t}</Badge>
                    ))}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[13px] font-medium text-accent-ink">
                    Öffnen <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </div>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export function KnowledgeGuide({ slug }: { slug: string }) {
  if (slug === "domain-umzug") return <DomainGuide />;
  return (
    <div className="py-16 text-center">
      <p className="text-[16px] font-semibold">Diese Anleitung gibt es nicht.</p>
      <Link href="/wissen" className="mt-3 inline-block text-[14px] text-accent-ink hover:underline">
        Zurück zu Wissen
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------- small pieces

const h2 = "text-[20px] font-semibold tracking-[-0.015em]";
const mono = "font-mono text-[12.5px]";

function Section({ id, title, sub, children }: { id: string; title: string; sub?: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className={h2}>{title}</h2>
      {sub && <p className="mt-1 text-[14px] text-muted">{sub}</p>}
      <div className="mt-4 grid gap-3 [&>*]:min-w-0">{children}</div>
    </section>
  );
}

function CopyButton({ value }: { value: string }) {
  const [done, setDone] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setDone(true);
      window.setTimeout(() => setDone(false), 1500);
    } catch {
      // clipboard refused: the value stays visible and selectable
    }
  }
  return (
    <button type="button" onClick={copy} className={cn("inline-flex h-7 shrink-0 items-center gap-1 rounded-[8px] border px-2 text-[12px] font-medium", done ? "border-emerald-300 text-emerald-700" : "border-ink/12 bg-white text-ink/70 hover:border-accent/50 hover:text-accent-ink")}>
      {done ? <Check className="size-3.5" /> : <Copy className="size-3.5" />} {done ? "Kopiert" : "Kopieren"}
    </button>
  );
}

function Callout({ tone, title, children }: { tone: "bad" | "warn" | "ok" | "info"; title?: string; children: ReactNode }) {
  const tones = { bad: "bg-red-50 text-red-900 border-red-100", warn: "bg-amber-50 text-amber-950 border-amber-100", ok: "bg-emerald-50 text-emerald-950 border-emerald-100", info: "bg-accent-soft text-ink border-accent/10" };
  return (
    <div className={cn("rounded-[12px] border px-4 py-3 text-[14px] leading-relaxed", tones[tone])}>
      {title && <p className="font-semibold">{title}</p>}
      <div className={cn(title && "mt-0.5")}>{children}</div>
    </div>
  );
}

function ClickPath({ steps }: { steps: string[] }) {
  return (
    <p className="rounded-[10px] bg-ink/[0.04] px-3 py-2 font-mono text-[12.5px] leading-relaxed text-ink">
      {steps.map((s, i) => (
        <span key={i}>
          {i > 0 && <span className="px-1.5 text-faint">→</span>}
          {s}
        </span>
      ))}
    </p>
  );
}

// ---------------------------------------------------------------- the domain check

type Carry = { type: string; name: string; value: string; priority?: number; note: string };
type Inspection = {
  domain: string;
  error?: string;
  registered: "free" | "taken" | "unknown";
  provider: string | null;
  nameservers: string[];
  dnssec: boolean;
  website: { ipv4: string[]; ipv6: string[]; www: string | null };
  mail: string | null;
  carry: Carry[];
  warnings: { tone: "bad" | "warn"; text: string }[];
  checked: string;
};

const providerPaths: Record<string, { steps: string[]; note?: string }> = {
  Strato: { steps: ["Domains", "Domainverwaltung", "Zahnrad bei der Domain", "Reiter DNS", "NS-Record", "„Eigene Nameserver“", "Cloudflare-Nameserver eintragen", "„NS-Record speichern“"], note: "Feld ausgegraut? Erst eigene MX-, A- oder SPF-Einträge auf Standard zurückstellen." },
  IONOS: { steps: ["Domains & SSL", "Zahnrad (Aktionen) bei der Domain", "Nameserver", "„Eigene Nameserver verwenden“", "Nameserver 1 und 2 eintragen", "Speichern"] },
};

function DomainCheck() {
  const [domain, setDomain] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Inspection | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function check(e: FormEvent) {
    e.preventDefault();
    if (!domain.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const { result } = await api<{ result: Inspection }>("/tools/dns", { method: "POST", body: { domain } });
      if (result.error) {
        setError(result.error);
        setResult(null);
      } else setResult(result);
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setBusy(false);
    }
  }

  const path = result?.provider ? providerPaths[result.provider] : undefined;
  return (
    <Card className="p-5">
      <form onSubmit={check} className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="domain-check" className="sr-only">
          Domain
        </label>
        <Input id="domain-check" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="z. B. beispiel.de" autoComplete="off" spellCheck={false} className="font-mono sm:flex-1" />
        <Btn type="submit" disabled={busy || !domain.trim()}>
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />} Domain prüfen
        </Btn>
      </form>
      <p className="mt-2 text-[12.5px] text-faint">Fragt Nameserver, Website, E-Mail, DNSSEC und die wichtigsten Mail-Einträge live ab. Den Inhaber einer .de-Domain zeigt keine öffentliche Abfrage – den siehst du nur im Login des Kunden.</p>
      {error && <p className="mt-3 text-[14px] text-red-600">{error}</p>}

      {result && (
        <div className="mt-5 grid gap-4 border-t border-ink/[0.07] pt-5 [&>*]:min-w-0">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-mono text-[18px] font-semibold">{result.domain}</p>
            <p className="text-[12.5px] text-faint">geprüft {new Date(result.checked).toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" })}</p>
          </div>
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Registriert", result.registered === "taken" ? "ja" : result.registered === "free" ? "nein – frei" : "unklar", result.registered === "free" ? "red" : "green"],
              ["Nameserver bei", result.provider ?? "–", result.provider === "Cloudflare" ? "accent" : "grey"],
              ["E-Mail", result.mail ?? "keine", result.mail ? "amber" : "grey"],
              ["DNSSEC", result.dnssec ? "an – erst ausschalten" : "aus", result.dnssec ? "red" : "green"],
            ].map(([label, value, tone]) => (
              <div key={label} className="rounded-[12px] bg-ink/[0.03] px-3 py-2.5">
                <dt className="text-[11.5px] font-medium uppercase tracking-[0.08em] text-faint">{label}</dt>
                <dd className="mt-1">
                  <Badge tone={tone as "grey"} className="text-[12.5px]">
                    {value}
                  </Badge>
                </dd>
              </div>
            ))}
          </dl>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="min-w-0">
              <p className="text-[12.5px] font-medium text-ink/70">Nameserver heute</p>
              <p className={cn(mono, "mt-1 break-all leading-relaxed")}>{result.nameservers.join(" · ") || "–"}</p>
            </div>
            <div className="min-w-0">
              <p className="text-[12.5px] font-medium text-ink/70">Website zeigt heute auf</p>
              <p className={cn(mono, "mt-1 break-all leading-relaxed")}>{[...result.website.ipv4, ...result.website.ipv6].join(" · ") || "nichts"}</p>
            </div>
          </div>
          {result.warnings.map((w) => (
            <Callout key={w.text} tone={w.tone}>
              {w.text}
            </Callout>
          ))}
          {!result.dnssec && result.registered === "taken" && <Callout tone="ok">DNSSEC ist aus – vor dem Wechsel musst du dort nichts abschalten.</Callout>}

          <div>
            <p className="text-[14px] font-semibold">Diese Einträge müssen in Cloudflare stehen, bevor die Nameserver umgestellt werden</p>
            {result.carry.length ? (
              <div className="mt-2 overflow-x-auto rounded-[12px] border border-ink/[0.07]">
                <table className="w-full min-w-[620px] text-[13px]">
                  <thead>
                    <tr className="border-b border-ink/[0.07] text-left text-[11.5px] uppercase tracking-[0.06em] text-faint">
                      <th className="px-3 py-2 font-medium">Typ</th>
                      <th className="px-3 py-2 font-medium">Name</th>
                      <th className="px-3 py-2 font-medium">Prio</th>
                      <th className="px-3 py-2 font-medium">Wert</th>
                      <th className="px-3 py-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {result.carry.map((r, i) => (
                      <tr key={i} className="border-b border-ink/[0.05] align-top last:border-0">
                        <td className="px-3 py-2 font-mono font-semibold text-accent-ink">{r.type}</td>
                        <td className="px-3 py-2 font-mono">{r.name}</td>
                        <td className="px-3 py-2 font-mono tabular-nums">{r.priority ?? ""}</td>
                        <td className="max-w-[360px] px-3 py-2">
                          <span className="line-clamp-2 break-all font-mono">{r.value}</span>
                          <span className="mt-0.5 block text-[12px] text-faint">{r.note}</span>
                        </td>
                        <td className="px-3 py-2 text-right">
                          <CopyButton value={r.value} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-1 text-[14px] text-muted">Keine E-Mail- oder TXT-Einträge gefunden – hier muss nichts mit.</p>
            )}
            <p className="mt-2 text-[12.5px] text-faint">Alle diese Einträge in Cloudflare mit grauer Wolke („Nur DNS“). Der Website-Eintrag kommt später von Cloudflare Pages.</p>
          </div>

          {result.provider && result.provider !== "Cloudflare" && (
            <div>
              <p className="text-[14px] font-semibold">Klickweg bei {result.provider}</p>
              {path ? (
                <div className="mt-2 grid gap-2">
                  <ClickPath steps={path.steps} />
                  {path.note && <p className="text-[13px] text-muted">{path.note}</p>}
                </div>
              ) : (
                <p className="mt-1 text-[14px] text-muted">Im Kundenbereich des Anbieters bei der Domain nach „Nameserver“ oder „DNS-Server“ suchen und „eigene Nameserver“ wählen.</p>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

// ---------------------------------------------------------------- the step list, remembered in this browser

type Step = { id: string; title: string; text?: string; path?: string[] };
const phases: { key: string; title: string; when: string; steps: Step[] }[] = [
  {
    key: "a",
    title: "Vor dem Termin – bei dir",
    when: "ca. 10 Minuten",
    steps: [
      { id: "a1", title: "Domain oben prüfen", text: "Anbieter, E-Mail und DNSSEC kennen, bevor du beim Kunden sitzt." },
      { id: "a2", title: "Cloudflare → „Domain hinzufügen“ → Domain eingeben → Plan „Free“", text: "Cloudflare liest die vorhandenen Einträge automatisch ein." },
      { id: "a3", title: "Eingelesene Einträge mit der Prüfung vergleichen", text: "Fehlende MX-, TXT- und DKIM-Einträge von Hand ergänzen, alle mit grauer Wolke." },
      { id: "a4", title: "Die zwei Nameserver notieren, die Cloudflare anzeigt", text: "In deinem Konto meist beth.ns.cloudflare.com und kyrie.ns.cloudflare.com – nimm, was Cloudflare bei der Domain zeigt." },
      { id: "a5", title: "Website auf Cloudflare Pages bereithalten", text: "Damit die Domain nach dem Wechsel sofort etwas zeigt." },
    ],
  },
  {
    key: "b",
    title: "Im Termin – mit dem Kunden",
    when: "ca. 15 Minuten · er braucht seine Logins",
    steps: [
      { id: "b1", title: "Kunde loggt sich beim Anbieter ein – ihr prüft, ob die Domain auf ihn läuft" },
      { id: "b2", title: "Fragen: Nutzen Sie E-Mail-Adressen mit dieser Domain?", text: "Wenn ja: Die Einträge hast du schon übernommen – sag ihm das." },
      { id: "b3", title: "Nameserver beim Anbieter auf die zwei Cloudflare-Nameserver umstellen", text: "Klickwege unten." },
      { id: "b4", title: "In Cloudflare „Nameserver jetzt prüfen“ klicken", text: "Aktiv meist nach Minuten bis wenigen Stunden, spätestens nach 24 Stunden. Cloudflare schickt eine E-Mail." },
    ],
  },
  {
    key: "c",
    title: "Danach – bei dir",
    when: "sobald Cloudflare „Aktiv“ meldet",
    steps: [
      { id: "c1", title: "Cloudflare Pages → Projekt → „Custom domains“ → Domain und www hinzufügen", text: "Cloudflare legt die Einträge an und stellt das SSL-Zertifikat aus." },
      { id: "c2", title: "Zweit-Domains weiterleiten", text: "In deren Zone: A-Eintrag @ und www auf 192.0.2.1 mit oranger Wolke. Dann Regeln → Weiterleitungsregeln → 301 auf die Hauptadresse, Pfad behalten: concat(\"https://hauptadresse.de\", http.request.uri.path)." },
      { id: "c3", title: "Testen", text: "Domain und www öffnen (Schloss im Browser?), Zweit-Domain öffnen (landet auf der Hauptadresse?), eine E-Mail hin und eine zurück." },
      { id: "c4", title: "Google-Unternehmensprofil: Website-Link eintragen" },
    ],
  },
];
const STEPS_KEY = "lx-guide-domain-steps";

function Steps() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  useEffect(() => {
    try {
      setDone(JSON.parse(localStorage.getItem(STEPS_KEY) ?? "{}") ?? {});
    } catch {
      setDone({});
    }
  }, []);
  function toggle(id: string) {
    setDone((d) => {
      const next = { ...d, [id]: !d[id] };
      try {
        localStorage.setItem(STEPS_KEY, JSON.stringify(next));
      } catch {
        // not remembered – fine
      }
      return next;
    });
  }
  function reset() {
    setDone({});
    try {
      localStorage.removeItem(STEPS_KEY);
    } catch {
      // nothing stored
    }
  }
  return (
    <>
      {phases.map((p, pi) => {
        const count = p.steps.filter((s) => done[s.id]).length;
        return (
          <Card key={p.key} className="p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-[16.5px] font-semibold">
                <span className="mr-2 font-mono text-accent-ink">{String.fromCharCode(65 + pi)}</span>
                {p.title}
              </h3>
              <span className="text-[12.5px] text-faint tabular-nums">
                {p.when} · {count} von {p.steps.length}
              </span>
            </div>
            <ul className="mt-3 grid gap-2.5">
              {p.steps.map((s) => (
                <li key={s.id}>
                  <label className="flex cursor-pointer items-start gap-3">
                    <input type="checkbox" checked={!!done[s.id]} onChange={() => toggle(s.id)} className="mt-0.5 size-[18px] shrink-0 accent-[var(--color-accent)]" />
                    <span className="min-w-0">
                      <span className={cn("block text-[14.5px] font-medium", done[s.id] && "text-faint line-through")}>{s.title}</span>
                      {s.text && <span className="mt-0.5 block text-[13.5px] leading-relaxed text-muted">{s.text}</span>}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </Card>
        );
      })}
      <button type="button" onClick={reset} className="w-fit text-[13px] text-faint hover:text-ink">
        Häkchen zurücksetzen
      </button>
    </>
  );
}

// ---------------------------------------------------------------- the guide

const faq: [string, ReactNode][] = [
  ["„Gehört mir die Domain dann noch?“", "Ja. Sie bleibt auf seinen Namen beim bisherigen Anbieter registriert, er zahlt dort weiter seine Gebühr. Du bekommst nur die Verwaltung der Einträge. Will er irgendwann wechseln, stellt er die Nameserver zurück – fünf Minuten."],
  ["„Was kostet mich das?“", "Nichts zusätzlich. Cloudflare läuft im kostenlosen Tarif. Beim bisherigen Anbieter bleibt nur die Gebühr, die er schon zahlt."],
  ["„Gehen meine E-Mails verloren?“", "Nein. Die Mail-Einträge stehen vorher eins zu eins in Cloudflare. Das Postfach selbst bleibt, wo es ist – Google, Microsoft, Strato. Nach dem Wechsel schickt ihr eine Test-Mail."],
  ["„Ist die Seite eine Weile offline?“", "Nein. Während der Umstellung antworten kurz noch die alten Server, dann Cloudflare – beide zeigen auf funktionierende Ziele."],
  ["„Warum nicht beim alten Anbieter lassen?“", "Weil die Website bei Cloudflare läuft – schnell, mit kostenlosem SSL-Zertifikat. Und alles liegt an einer Stelle: Website, Weiterleitungen, Schutz vor Angriffen."],
  [
    "„Soll ich beim alten Anbieter kündigen?“",
    <>
      <b className="text-red-600">Nicht einfach kündigen</b> – dann wird die Domain frei und jeder kann sie kaufen. Nur wenn er den Anbieter ganz loswerden will: Umzug zu einem anderen Registrar (siehe unten).
    </>,
  ],
];

const glossary: [string, string][] = [
  ["Domain", "Die Adresse, z. B. beispiel.de."],
  ["Registrar", "Der Anbieter, bei dem die Domain registriert ist und bezahlt wird."],
  ["DENIC", "Die zentrale Stelle für alle .de-Adressen. Dort steht, welche Nameserver zuständig sind."],
  ["Nameserver", "Die Server, die auf jede Anfrage antworten, wohin sie gehen soll. Wer sie stellt, hat die Kontrolle."],
  ["Zone", "Die Liste aller Einträge einer Domain – nach dem Umzug in deinem Cloudflare."],
  ["A / AAAA / CNAME", "Einträge, die sagen, wo die Website liegt."],
  ["MX", "Sagt, wohin E-Mails zugestellt werden."],
  ["SPF (TXT)", "Wer im Namen der Domain E-Mails verschicken darf."],
  ["DKIM", "Digitale Unterschrift unter ausgehenden E-Mails, steht unter …._domainkey."],
  ["DMARC", "Was mit Mails passiert, die SPF und DKIM nicht bestehen (p=reject: ablehnen)."],
  ["DNSSEC", "Signiert die DNS-Antworten. Ist es an, muss es vor dem Nameserver-Wechsel aus."],
  ["Proxy (orange Wolke)", "Cloudflare steht zwischen Besucher und Website: schneller, geschützt, mit SSL. Nie für Mail-Einträge."],
  ["Authcode", "Passwort für den Umzug zu einem anderen Registrar – nur nötig, wenn der Registrar wechselt."],
];

function DomainGuide() {
  return (
    <div className="mx-auto w-full min-w-0 max-w-[880px]">
      <Link href="/wissen" className="mb-4 inline-flex items-center gap-1.5 text-[13.5px] text-muted hover:text-ink">
        <ArrowLeft className="size-4" /> Wissen
      </Link>
      <PageHeader title="Domain in dein Cloudflare holen" sub="Für jeden Kunden gleich: Die Domain bleibt bei seinem Anbieter registriert, die Nameserver zeigen auf dein Cloudflare – damit steuerst du Website, Weiterleitungen und E-Mail-Einträge." />

      <div className="grid gap-10 [&>*]:min-w-0">
        <Callout tone="info" title="In einem Satz">
          Registrierung und Jahresgebühr bleiben beim Kunden und seinem Anbieter. Ihr stellt dort nur die Nameserver auf dein Cloudflare um – ab dann kontrollierst du alles. Cloudflare kann .de-Domains nicht selbst registrieren; für die Kontrolle reicht der Nameserver-Wechsel.
        </Callout>

        <Section id="pruefen" title="Domain prüfen" sub="Vor jedem Umzug: Wo liegt sie, läuft E-Mail darüber, was muss mit?">
          <DomainCheck />
        </Section>

        <Section id="prinzip" title="Das Prinzip: drei Rollen">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Registrar", "Wem die Domain gehört", "Strato, IONOS & Co. Dort steht der Kunde als Inhaber, dort läuft die Gebühr. Bleibt so.", "text-sky-700"],
              ["Nameserver", "Wer sagt, wohin es geht", "Heute meist die Server des Anbieters. Neu: dein Cloudflare. Wer die Nameserver hat, hat die Kontrolle.", "text-accent-ink"],
              ["Ziele", "Wohin es geht", "Website (Cloudflare Pages) und E-Mail (Google, Microsoft, Anbieter-Postfach). Trägst du in Cloudflare ein.", "text-emerald-700"],
            ].map(([tag, title, text, tone]) => (
              <Card key={tag} className="p-4">
                <p className={cn("font-mono text-[11.5px] font-semibold uppercase tracking-[0.08em]", tone)}>{tag}</p>
                <p className="mt-1.5 text-[15px] font-semibold">{title}</p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-muted">{text}</p>
              </Card>
            ))}
          </div>
          <p className="text-[14px] text-muted">Vergleich für das Gespräch: Das Grundbuch (Registrar) bleibt, wie es ist. Wir übernehmen nur die Hausverwaltung (Nameserver) – die entscheidet, wo Post und Besucher ankommen.</p>
          <Card className="p-4">
            <p className="text-[12.5px] font-medium text-ink/70">So erklärst du es dem Kunden</p>
            <p className="mt-1 text-[15px] leading-relaxed">„Die Adresse bleibt Ihre – sie bleibt auf Ihren Namen bei Ihrem Anbieter. Wir stellen nur den Wegweiser um, damit sie auf Ihre neue Website zeigt. Ihre E-Mails laufen weiter, die Einstellungen haben wir vorher übernommen.“</p>
          </Card>
        </Section>

        <Section id="ablauf" title="Ablauf" sub="Zum Abhaken – dein Browser merkt sich die Häkchen.">
          <Steps />
        </Section>

        <Section id="klickwege" title="Klickwege beim Anbieter">
          {Object.entries(providerPaths).map(([name, p]) => (
            <Card key={name} className="p-4">
              <p className="text-[15px] font-semibold">{name}</p>
              <div className="mt-2">
                <ClickPath steps={p.steps} />
              </div>
              {p.note && <p className="mt-2 text-[13px] text-muted">{p.note}</p>}
              {name === "Strato" && <p className="mt-1 text-[13px] text-muted">Mit „Domain Guard“ kommt ein Bestätigungscode aufs Handy des Inhabers.</p>}
            </Card>
          ))}
          <Card className="p-4">
            <p className="text-[15px] font-semibold">Andere Anbieter</p>
            <p className="mt-1 text-[14px] text-muted">Im Kundenbereich bei der Domain nach „Nameserver“ oder „DNS-Server“ suchen, „eigene Nameserver“ wählen und die zwei von Cloudflare eintragen.</p>
          </Card>
        </Section>

        <Section id="fragen" title="Wenn der Kunde fragt">
          <div className="grid gap-2">
            {faq.map(([q, a]) => (
              <details key={q} className="group rounded-[12px] border border-ink/[0.07] bg-white px-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3 text-[14.5px] font-medium">
                  {q}
                  <span className="font-mono text-faint group-open:hidden">+</span>
                  <span className="hidden font-mono text-faint group-open:inline">–</span>
                </summary>
                <p className="pb-3 text-[14px] leading-relaxed text-muted">{a}</p>
              </details>
            ))}
          </div>
        </Section>

        <Section id="fallen" title="Die Fallen">
          <Callout tone="bad" title="Mail-Einträge vergessen">
            Ohne MX-Einträge in Cloudflare kommen ab dem Wechsel keine E-Mails mehr an. Darum Phase A vor dem Termin.
          </Callout>
          <Callout tone="bad" title="DKIM übersehen">
            Einträge unter …._domainkey findet Cloudflare beim Einlesen meist nicht. Fehlen sie, landen ausgehende Mails im Spam. Die Prüfung oben sucht die üblichen Namen.
          </Callout>
          <Callout tone="warn" title="Orange Wolke bei Mail-Einträgen">
            Nur Website-Einträge (A, AAAA, CNAME) laufen über den Proxy. MX und TXT bleiben „Nur DNS“.
          </Callout>
          <Callout tone="warn" title="DNSSEC an">
            Erst beim alten Anbieter ausschalten, einen Tag warten, dann die Nameserver ändern – sonst ist die Domain danach nicht erreichbar.
          </Callout>
          <Callout tone="bad" title="Domain gekündigt">
            Eine einfach gekündigte Domain wird frei, und jeder kann sie kaufen. Kündigen nur mit Folgeauftrag „Providerwechsel“.
          </Callout>
        </Section>

        <Section id="registrar" title="Optional: Registrar wechseln" sub="Nur wenn der Kunde seinen alten Anbieter ganz loswerden will – für die Kontrolle nicht nötig.">
          <Card className="p-4 text-[14px] leading-relaxed text-muted">
            <p>Ziel muss ein Anbieter sein, der die Endung registriert – Cloudflare kann .de nicht. Die Nameserver bleiben dabei auf Cloudflare.</p>
            <p className="mt-2">
              <b className="text-ink">Strato:</b> zuerst kündigen und als Folgeauftrag „Providerwechsel“ wählen, dann „Authcode anfordern“. Der Code kommt innerhalb von 24 Stunden per E-Mail an den Inhaber und gilt für .de 30 Tage.
            </p>
            <p className="mt-2">
              <b className="text-ink">IONOS:</b> Domains &amp; SSL → Aktionen bei der Domain → Transfer &amp; Verlängern → Auth-Code.
            </p>
          </Card>
        </Section>

        <Section id="begriffe" title="Begriffe">
          <Card className="p-4">
            <dl className="grid gap-x-6 gap-y-2.5 text-[14px] sm:grid-cols-[180px_minmax(0,1fr)]">
              {glossary.map(([term, text]) => (
                <div key={term} className="contents">
                  <dt className="font-semibold">{term}</dt>
                  <dd className="mb-1.5 text-muted sm:mb-0">{text}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </Section>

        <p className="flex items-center gap-2 text-[12.5px] text-faint">
          <BookOpen className="size-4" aria-hidden="true" /> Quellen: STRATO-FAQ (DNS-Einträge, AuthInfo-Code), IONOS-Hilfe (eigene Nameserver), Cloudflare-Dokumentation (Full Setup, DNSSEC, Domain weiterleiten). Stand Oktober 2026.
        </p>
      </div>
    </div>
  );
}
