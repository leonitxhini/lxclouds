import { ArrowLeft, ArrowRight, Check, ChevronDown, Copy, Globe, Loader2 } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { api, ApiError } from "../api";
import { Badge, Btn, Card, Input, PageHeader } from "../ui";

// ---------------------------------------------------------------- the list of guides

const guides = [
  {
    slug: "domain-umzug",
    title: "Kunden-Domain in mein Cloudflare holen",
    text: "Was du Schritt für Schritt machst, damit die Domain eines Kunden in deinem Cloudflare liegt und du alles steuerst.",
    icon: Globe,
    tags: ["Domains", "Cloudflare"],
  },
];

export function Knowledge() {
  return (
    <>
      <PageHeader title="Wissen" sub="Anleitungen für dich – was du bei Kundenprojekten machen musst." />
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

/** A click path: "Domains → Domainverwaltung → …" */
function Clicks({ children }: { children: string }) {
  const parts = children.split(" → ");
  return (
    <p className="rounded-[10px] bg-ink/[0.04] px-3 py-2 text-[13.5px] leading-relaxed">
      {parts.map((p, i) => (
        <span key={i}>
          {i > 0 && <span className="px-1.5 text-faint">→</span>}
          <span className="font-medium">{p}</span>
        </span>
      ))}
    </p>
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

// ---------------------------------------------------------------- step 3 helper: which records does the domain have today

type Inspection = {
  domain: string;
  error?: string;
  provider: string | null;
  dnssec: boolean;
  mail: string | null;
  carry: { type: string; name: string; value: string; priority?: number }[];
};

function RecordsHelper() {
  const [open, setOpen] = useState(false);
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

  return (
    <div className="rounded-[12px] border border-ink/[0.08]">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-[14px] font-medium">
        Unsicher? Domain eintippen und sehen, welche Einträge rein müssen
        <ChevronDown className={cn("size-4 shrink-0 text-faint transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="grid gap-3 border-t border-ink/[0.08] p-3.5 [&>*]:min-w-0">
          <form onSubmit={check} className="flex flex-col gap-2 sm:flex-row">
            <label htmlFor="domain-check" className="sr-only">
              Domain
            </label>
            <Input id="domain-check" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="kunde.de" autoComplete="off" spellCheck={false} className="sm:flex-1" />
            <Btn type="submit" disabled={busy || !domain.trim()}>
              {busy && <Loader2 className="size-4 animate-spin" />} Anzeigen
            </Btn>
          </form>
          {error && <p className="text-[14px] text-red-600">{error}</p>}
          {result && (
            <>
              <p className="text-[14px]">
                <b>{result.domain}</b> liegt bei <b>{result.provider ?? "unbekannt"}</b>
                {result.mail ? (
                  <>
                    {" "}
                    · E-Mail läuft über <b>{result.mail}</b>
                  </>
                ) : (
                  " · keine E-Mail"
                )}
                {result.dnssec && <span className="text-red-600"> · DNSSEC ist an – erst beim Anbieter ausschalten</span>}
              </p>
              {result.carry.length ? (
                <ul className="grid grid-cols-1 gap-1.5 [&>*]:min-w-0">
                  {result.carry.map((r, i) => (
                    <li key={i} className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-[8px] bg-ink/[0.04] px-2.5 py-1.5 text-[13px]">
                      <span className="w-11 shrink-0 font-mono font-semibold text-accent-ink">{r.type}</span>
                      <span className="min-w-0 flex-1 truncate font-mono text-muted sm:w-28 sm:flex-none" title={r.name}>
                        {r.name}
                        {r.priority !== undefined ? ` · ${r.priority}` : ""}
                      </span>
                      <span className="order-last w-full truncate font-mono sm:order-none sm:w-auto sm:min-w-0 sm:flex-1" title={r.value}>
                        {r.value}
                      </span>
                      <CopyButton value={r.value} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[14px] text-muted">Keine Einträge, die mit müssen.</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- the guide: what you do, in order

type Step = { title: string; body: ReactNode };

const steps: Step[] = [
  {
    title: "Kunden fragen",
    body: (
      <ul className="grid gap-1 text-[14.5px] text-muted">
        <li>Wo hat er die Domain gekauft? (Strato, IONOS, …)</li>
        <li>Hat er E-Mail-Adressen mit der Domain, z. B. info@…?</li>
        <li>Er soll zum Termin seine Zugangsdaten für den Anbieter dabeihaben.</li>
      </ul>
    ),
  },
  {
    title: "Domain in dein Cloudflare eintragen",
    body: (
      <>
        <Clicks>dash.cloudflare.com → Domain hinzufügen → Domain eintippen → Plan „Free“ → Weiter</Clicks>
        <p className="text-[14.5px] text-muted">Cloudflare liest dabei die Einträge ein, die die Domain heute hat.</p>
      </>
    ),
  },
  {
    title: "Prüfen, ob die E-Mail-Einträge drin sind",
    body: (
      <>
        <p className="text-[14.5px] text-muted">Nur nötig, wenn der Kunde E-Mails mit der Domain hat. In der Liste von Cloudflare müssen die MX-Einträge stehen. Fehlt einer, über „Eintrag hinzufügen“ nachtragen. Bei Mail-Einträgen die Wolke immer grau lassen.</p>
        <RecordsHelper />
      </>
    ),
  },
  {
    title: "Die zwei Nameserver notieren",
    body: <p className="text-[14.5px] text-muted">Cloudflare zeigt sie dir am Ende an. Bei dir sind es meistens beth.ns.cloudflare.com und kyrie.ns.cloudflare.com – nimm aber immer die, die Cloudflare anzeigt.</p>,
  },
  {
    title: "Beim Anbieter des Kunden die Nameserver ändern",
    body: (
      <>
        <p className="text-[14.5px] text-muted">Mit dem Kunden zusammen, in seinem Login. Die zwei Nameserver von Cloudflare eintragen und speichern.</p>
        <p className="text-[13px] font-semibold text-ink/70">Strato</p>
        <Clicks>Domains → Domainverwaltung → Zahnrad bei der Domain → DNS → NS-Record → Eigene Nameserver → speichern</Clicks>
        <p className="text-[13px] font-semibold text-ink/70">IONOS</p>
        <Clicks>Domains & SSL → Zahnrad bei der Domain → Nameserver → Eigene Nameserver verwenden → speichern</Clicks>
        <p className="text-[14px] text-muted">Anderer Anbieter: bei der Domain nach „Nameserver ändern“ suchen.</p>
      </>
    ),
  },
  {
    title: "Warten, bis Cloudflare „Aktiv“ zeigt",
    body: <p className="text-[14.5px] text-muted">In Cloudflare auf „Nameserver jetzt prüfen“ klicken. Meist dauert es Minuten bis ein paar Stunden, höchstens 24 Stunden. Du bekommst eine E-Mail, wenn es geklappt hat.</p>,
  },
  {
    title: "Website mit der Domain verbinden",
    body: (
      <>
        <Clicks>Cloudflare → Workers & Pages → dein Projekt → Benutzerdefinierte Domains → Domain hinzufügen</Clicks>
        <p className="text-[14.5px] text-muted">Einmal mit der Domain, einmal mit www davor. Das Schloss (https) kommt von selbst.</p>
      </>
    ),
  },
  {
    title: "Zweite Domain weiterleiten – falls der Kunde mehrere hat",
    body: (
      <>
        <p className="text-[14.5px] text-muted">Die zweite Domain genauso in Cloudflare eintragen (Schritte 2 bis 6). Dann in ihrem DNS zwei A-Einträge anlegen, beide mit oranger Wolke:</p>
        <p className="rounded-[10px] bg-ink/[0.04] px-3 py-2 font-mono text-[13px]">A · @ · 192.0.2.1 &nbsp;&nbsp;und&nbsp;&nbsp; A · www · 192.0.2.1</p>
        <Clicks>Regeln → Weiterleitungsregeln → Regel erstellen → alle Anfragen → 301 → https://hauptdomain.de</Clicks>
      </>
    ),
  },
  {
    title: "Testen",
    body: (
      <ul className="grid gap-1 text-[14.5px] text-muted">
        <li>Domain öffnen und mit www öffnen – Website da, Schloss da?</li>
        <li>Zweite Domain öffnen – landet sie auf der Hauptdomain?</li>
        <li>Eine Test-Mail an die Adresse des Kunden schicken – kommt sie an?</li>
      </ul>
    ),
  },
  {
    title: "Website im Google-Eintrag des Kunden eintragen",
    body: <p className="text-[14.5px] text-muted">Fertig.</p>,
  },
];

function DomainGuide() {
  return (
    <div className="mx-auto w-full min-w-0 max-w-[760px]">
      <Link href="/wissen" className="mb-4 inline-flex items-center gap-1.5 text-[13.5px] text-muted hover:text-ink">
        <ArrowLeft className="size-4" /> Wissen
      </Link>
      <PageHeader title="Kunden-Domain in mein Cloudflare holen" sub="Die Domain bleibt beim Kunden gekauft und auf ihn registriert. Du stellst nur die Nameserver auf dein Cloudflare um – danach machst du alles in Cloudflare." />

      <ol className="grid grid-cols-1 gap-3 [&>*]:min-w-0">
        {steps.map((s, i) => (
          <li key={s.title}>
            <Card className="flex gap-4 p-4 sm:p-5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink text-[14px] font-semibold text-white tabular-nums">{i + 1}</span>
              <div className="grid min-w-0 flex-1 gap-2 [&>*]:min-w-0">
                <h2 className="pt-1 text-[16.5px] font-semibold leading-snug">{s.title}</h2>
                {s.body}
              </div>
            </Card>
          </li>
        ))}
      </ol>

      <Card className="mt-6 p-5">
        <h2 className="text-[16px] font-semibold">Nicht vergessen</h2>
        <ul className="mt-2 grid gap-1.5 text-[14.5px] text-muted">
          <li>
            <b className="text-ink">Die Domain nie kündigen lassen.</b> Dann wird sie frei und jemand anderes kann sie kaufen.
          </li>
          <li>
            <b className="text-ink">Mail-Einträge (MX, TXT) immer mit grauer Wolke.</b> Nur die Website-Einträge bekommen die orange Wolke.
          </li>
          <li>
            <b className="text-ink">Steht beim Anbieter „DNSSEC“ auf an:</b> erst ausschalten, einen Tag warten, dann die Nameserver ändern.
          </li>
        </ul>
      </Card>
    </div>
  );
}
