import { ArrowLeft, Check, Copy, Eye, EyeOff, FileText, Link2, Loader2, Play, Plus, Printer, RefreshCw, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link, useLocation, useSearch } from "wouter";
import type { EditApi } from "@/demo/edit";
import { getIn, setIn } from "@/demo/path";
import { colourPresets } from "@/demo/theme";
import { FolioView, type FolioTools } from "@/folio/Folio";
import { generateFolio } from "@/folio/generate";
import { playbooks } from "@/folio/playbooks";
import { Present } from "@/folio/Present";
import { roles } from "@/folio/roles";
import type { Audit, AuditBlock, DomainsBlock, FolioDoc } from "@/folio/types";
import { cn } from "@/lib/utils";
import { api, ApiError, formatDate, useLoad, type Client } from "../api";
import { Badge, Btn, Card, Empty, Field, Input, Loading, Modal, PageHeader, Select, Textarea, useToast } from "../ui";

type FolioSummary = { id: number; slug: string; title: string; client_id: number | null; client_name: string | null; shared: number; updated_at: string; industry: string | null };
type FolioRow = FolioSummary & { doc: FolioDoc };

// ---------------------------------------------------------------- list + wizard
export function Folios() {
  const { data, error } = useLoad<{ folios: FolioSummary[] }>("/folios");
  const [creating, setCreating] = useState(false);
  if (error) return <p className="py-20 text-center text-red-600">{error.message}</p>;
  if (!data) return <Loading />;
  return (
    <>
      <PageHeader title="Projektmappen" sub="Strategie, Name & Domain, Design, Google, Recht, Technik und Angebot – für jeden Kunden in einer Mappe, live geprüft und präsentierbar.">
        <Btn variant="accent" onClick={() => setCreating(true)}>
          <Plus className="size-4" aria-hidden="true" />
          Neue Mappe
        </Btn>
      </PageHeader>
      {data.folios.length === 0 ? (
        <Empty title="Noch keine Mappe" text="Eine Mappe bündelt alles, was ein Team aus Strategie, Marke, Design, SEO, Recht und Technik für den Kunden ausarbeiten würde.">
          <Btn variant="accent" onClick={() => setCreating(true)}>
            Erste Mappe erstellen
          </Btn>
        </Empty>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.folios.map((f) => (
            <li key={f.id}>
              <Link href={`/mappen/${f.id}`} className="group block">
                <Card className="p-5 transition-[border-color,box-shadow] duration-200 group-hover:border-accent/30 group-hover:shadow-card">
                  <span className="flex size-10 items-center justify-center rounded-[12px] bg-night text-white">
                    <FileText className="size-5" />
                  </span>
                  <p className="mt-4 truncate text-[16.5px] font-semibold">{f.title}</p>
                  <p className="truncate text-[13px] text-faint">
                    {f.client_name ?? "Ohne Kunde"} · {f.industry ?? "–"} · {formatDate(f.updated_at, true)}
                  </p>
                  <div className="mt-3">{f.shared ? <Badge tone="green">Link freigegeben</Badge> : <Badge>Privat</Badge>}</div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <NewFolioModal open={creating} onClose={() => setCreating(false)} />
    </>
  );
}

/** The playbook that fits a client's industry as written in the client file. */
function playbookFor(industry: string | null | undefined) {
  const text = (industry ?? "").toLowerCase();
  const hit = playbooks.find((p) => text && (text.includes(p.label.toLowerCase().slice(0, 6)) || p.words.some((w) => text.includes(w.slice(0, 6)))));
  return hit?.id ?? (text.includes("gastro") ? "restaurant" : text.includes("gesund") ? "clinic" : "service");
}

export function NewFolioModal({ open, onClose, client }: { open: boolean; onClose: () => void; client?: Client | null }) {
  const [, navigate] = useLocation();
  const toast = useToast();
  const clients = useLoad<{ clients: Client[] }>(open ? "/clients" : null);
  const [clientId, setClientId] = useState(client ? String(client.id) : "");
  const [accent, setAccent] = useState("#6865FF");
  const [busy, setBusy] = useState(false);
  const chosen = clients.data?.clients.find((c) => String(c.id) === clientId) ?? client ?? null;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("client") ?? "").trim() || chosen?.name || "Kunde";
    const doc = generateFolio({
      client: name,
      playbook: String(f.get("playbook")),
      city: String(f.get("city") ?? ""),
      website: String(f.get("website") ?? "").trim(),
      goal: String(f.get("goal") ?? "").trim(),
      names: String(f.get("names") ?? "")
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean),
      competitors: String(f.get("competitors") ?? "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [a, b] = line.split("|").map((s) => s.trim());
          return b ? { name: a, url: b } : { name: a.replace(/^https?:\/\/(www\.)?/, "").split("/")[0], url: a };
        }),
      accent,
    });
    setBusy(true);
    try {
      const { id } = await api<{ id: number }>("/folios", { method: "POST", body: { title: `Projektmappe ${name}`, client_id: chosen?.id ?? null, doc } });
      onClose();
      navigate(`/mappen/${id}?pruefen=1`);
    } catch (err) {
      toast((err as ApiError).message, "error");
    }
    setBusy(false);
  }

  return (
    <Modal open={open} onClose={onClose} title="Neue Projektmappe" wide>
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2" key={chosen?.id ?? "new"}>
        <Field label="Kunde">
          <Select value={clientId} onChange={(e) => setClientId(e.target.value)} disabled={!!client}>
            <option value="">Ohne Kundenakte</option>
            {clients.data?.clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Name in der Mappe">
          <Input name="client" defaultValue={chosen?.name ?? ""} placeholder="z. B. Ibrahim Buchhaltung" required={!chosen} />
        </Field>
        <Field label="Branche" hint="Bestimmt das Fachwissen: Zielgruppen, Suchbegriffe, Recht, Kanäle.">
          <Select name="playbook" defaultValue={playbookFor(chosen?.industry)}>
            {playbooks.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Ort">
          <Input name="city" defaultValue={chosen?.city ?? ""} placeholder="Frankfurt am Main" required />
        </Field>
        <Field label="Jetzige Website (falls vorhanden)">
          <Input name="website" defaultValue={chosen?.website ?? ""} placeholder="https://…" />
        </Field>
        <Field label="Ziel des Kunden">
          <Input name="goal" placeholder="z. B. 5 neue Mandanten pro Monat" />
        </Field>
        <Field label="Namensideen" hint="Komma-getrennt; jede wird bewertet und als Domain geprüft." className="sm:col-span-2">
          <Input name="names" placeholder="z. B. IC Buchhaltung, mybuchhalter" />
        </Field>
        <Field label="Wettbewerber" hint="Eine Website pro Zeile, optional „Name | Adresse“. Sie werden live geprüft." className="sm:col-span-2">
          <Textarea name="competitors" rows={4} placeholder={"buchlohn.de\nMcDATA | https://www.mcdata.de/…"} />
        </Field>
        <Field label="Farbe der Mappe" className="sm:col-span-2">
          <div className="flex flex-wrap gap-2">
            {colourPresets.slice(0, 10).map((c) => (
              <button key={c} type="button" onClick={() => setAccent(c)} aria-pressed={accent === c} aria-label={`Farbe ${c}`} className={cn("size-8 rounded-full ring-offset-2", accent === c && "ring-2 ring-ink")} style={{ background: c }} />
            ))}
          </div>
        </Field>
        <div className="flex justify-end gap-2 sm:col-span-2">
          <Btn variant="ghost" onClick={onClose}>
            Abbrechen
          </Btn>
          <Btn type="submit" variant="accent" disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : <FileText className="size-4" />}
            Mappe erstellen & prüfen
          </Btn>
        </div>
      </form>
    </Modal>
  );
}

// ---------------------------------------------------------------- one folio
const parseScope = (scope: string) =>
  scope
    .split(".")
    .filter(Boolean)
    .map((s) => (/^\d+$/.test(s) ? Number(s) : s));

/** Google's own measurement (PageSpeed Insights, mobile), straight from the browser. */
async function pageSpeed(url: string) {
  const query = new URLSearchParams({ url: /^https?:/.test(url) ? url : `https://${url}`, strategy: "mobile", locale: "de" });
  for (const c of ["PERFORMANCE", "SEO", "ACCESSIBILITY", "BEST_PRACTICES"]) query.append("category", c);
  const res = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${query}`);
  if (!res.ok) throw new Error(res.status === 429 ? "Google-Messung gerade ausgelastet – in einer Minute noch einmal." : "Google konnte die Seite nicht messen.");
  const data = (await res.json()) as { lighthouseResult: { categories: Record<string, { score: number }> } };
  const c = data.lighthouseResult.categories;
  const pct = (k: string) => Math.round((c[k]?.score ?? 0) * 100);
  return { performance: pct("performance"), seo: pct("seo"), accessibility: pct("accessibility"), practices: pct("best-practices"), checked: new Date().toISOString() };
}

export function FolioEditor({ id }: { id: number }) {
  const { data, error } = useLoad<{ folio: FolioRow }>(`/folios/${id}`);
  const search = useSearch();
  const [, navigate] = useLocation();
  const toast = useToast();
  const [doc, setDoc] = useState<FolioDoc | null>(null);
  const [title, setTitle] = useState("");
  const [shared, setShared] = useState(false);
  const [saved, setSaved] = useState(true);
  const [presenting, setPresenting] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [busy, setBusy] = useState<Set<string>>(new Set());
  const latest = useRef<FolioDoc | null>(null);
  const timer = useRef(0);
  const autoChecked = useRef(false);

  useEffect(() => {
    if (!data) return;
    setDoc(data.folio.doc);
    latest.current = data.folio.doc;
    setTitle(data.folio.title);
    setShared(!!data.folio.shared);
  }, [data]);

  const save = useCallback(
    (next: FolioDoc) => {
      latest.current = next;
      setSaved(false);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(async () => {
        try {
          await api(`/folios/${id}`, { method: "PATCH", body: { doc: latest.current } });
          setSaved(true);
        } catch (err) {
          toast(`Nicht gespeichert: ${(err as ApiError).message}`, "error");
        }
      }, 700);
    },
    [id, toast],
  );

  const mutate = useCallback(
    (change: (d: FolioDoc) => FolioDoc) =>
      setDoc((d) => {
        if (!d) return d;
        const next = change(d);
        if (next !== d) save(next);
        return next;
      }),
    [save],
  );

  // keep waiting changes when the page is left
  useEffect(() => {
    const flush = () => {
      if (timer.current && latest.current) {
        window.clearTimeout(timer.current);
        void fetch(`/api/folios/${id}`, { method: "PATCH", keepalive: true, headers: { "Content-Type": "application/json", "X-Studio": "1" }, body: JSON.stringify({ doc: latest.current }) });
        timer.current = 0;
      }
    };
    window.addEventListener("pagehide", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
    };
  }, [id]);

  const edit = useMemo<EditApi>(
    () => ({
      set: (scope, path, value) => mutate((d) => setIn(d, [...parseScope(scope), ...path], value)),
      setMeta: () => {},
      pickImage: () => {},
      pickIcon: () => {},
      add: (scope, path, item) => mutate((d) => setIn(d, [...parseScope(scope), ...path], [...((getIn(d, [...parseScope(scope), ...path]) as unknown[]) ?? []), structuredClone(item)])),
      remove: (scope, path, index) => mutate((d) => setIn(d, [...parseScope(scope), ...path], ((getIn(d, [...parseScope(scope), ...path]) as unknown[]) ?? []).filter((_, i) => i !== index))),
      move: (scope, path, index, by) =>
        mutate((d) => {
          const full = [...parseScope(scope), ...path];
          const list = [...((getIn(d, full) as unknown[]) ?? [])];
          const target = index + by;
          if (target < 0 || target >= list.length) return d;
          [list[index], list[target]] = [list[target], list[index]];
          return setIn(d, full, list);
        }),
    }),
    [mutate],
  );

  const setBusyKey = (key: string, on: boolean) =>
    setBusy((s) => {
      const n = new Set(s);
      if (on) n.add(key);
      else n.delete(key);
      return n;
    });

  const tools = useMemo<FolioTools>(
    () => ({
      busy,
      checkDomains: async (scope) => {
        const block = getIn(latest.current, parseScope(scope)) as DomainsBlock | undefined;
        if (!block?.items.length) return;
        setBusyKey(scope, true);
        try {
          const { results } = await api<{ results: { domain: string; status: "free" | "taken" | "unknown" }[] }>("/tools/domains", { method: "POST", body: { domains: block.items.map((d) => d.domain) } });
          const now = new Date().toISOString();
          mutate((d) => {
            const current = getIn(d, parseScope(scope)) as DomainsBlock;
            return setIn(
              d,
              [...parseScope(scope), "items"],
              current.items.map((item, i) => (results[i] ? { ...item, domain: results[i].domain, status: results[i].status, checked: results[i].status === "unknown" ? item.checked : now } : item)),
            );
          });
        } catch (err) {
          toast((err as ApiError).message, "error");
        }
        setBusyKey(scope, false);
      },
      audit: async (scope, only) => {
        const block = getIn(latest.current, parseScope(scope)) as AuditBlock | undefined;
        if (!block) return;
        const targets = block.items.map((site, i) => [site, i] as const).filter(([site, i]) => site.url.trim() && (only === undefined || only === i));
        setBusyKey(scope, true);
        await Promise.all(
          targets.map(async ([site, i]) => {
            try {
              const { result } = await api<{ result: Audit }>("/tools/audit", { method: "POST", body: { url: site.url } });
              mutate((d) => setIn(d, [...parseScope(scope), "items", i, "result"], { ...result, psi: (getIn(d, [...parseScope(scope), "items", i, "result"]) as Audit | null)?.psi }));
            } catch (err) {
              toast(`${site.name}: ${(err as ApiError).message}`, "error");
            }
          }),
        );
        setBusyKey(scope, false);
      },
      psi: async (scope, i) => {
        const site = (getIn(latest.current, parseScope(scope)) as AuditBlock).items[i];
        if (!site?.url) return;
        const key = `${scope}:psi:${i}`;
        setBusyKey(key, true);
        try {
          const psi = await pageSpeed(site.url);
          mutate((d) => {
            const result = (getIn(d, [...parseScope(scope), "items", i, "result"]) as Audit | null) ?? { checked: psi.checked };
            return setIn(d, [...parseScope(scope), "items", i, "result"], { ...result, psi });
          });
        } catch (err) {
          toast((err as Error).message, "error");
        }
        setBusyKey(key, false);
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [busy, mutate, toast],
  );

  /** Every live check of the folio: all domain lists and all website checks. */
  const checkAll = useCallback(() => {
    const d = latest.current;
    if (!d) return;
    d.chapters.forEach((c, ci) =>
      c.blocks.forEach((b, bi) => {
        const scope = `chapters.${ci}.blocks.${bi}`;
        if (b.type === "domains") void tools.checkDomains(scope);
        if (b.type === "audit" && b.items.length) void tools.audit(scope);
      }),
    );
  }, [tools]);

  // a new folio runs its checks once by itself
  useEffect(() => {
    if (!doc || autoChecked.current || !/pruefen=1/.test(search)) return;
    autoChecked.current = true;
    checkAll();
    navigate(`/mappen/${id}`, { replace: true });
  }, [doc, search, checkAll, id, navigate]);

  if (error) return <p className="py-20 text-center text-red-600">{error.message}</p>;
  if (!doc || !data) return <Loading />;

  const url = `${window.location.origin}/m/${data.folio.slug}`;
  const running = busy.size > 0;

  async function saveMeta(body: Record<string, unknown>) {
    try {
      await api(`/folios/${id}`, { method: "PATCH", body });
    } catch (err) {
      toast((err as ApiError).message, "error");
    }
  }

  return (
    <div className="min-h-dvh bg-paper">
      <div className="sticky top-0 z-30 flex flex-wrap items-center gap-2 border-b border-ink/[0.08] bg-paper/95 px-3 py-2.5 backdrop-blur print:hidden sm:px-5">
        <Link href="/mappen" className="flex size-9 items-center justify-center rounded-[9px] hover:bg-ink/[0.06]" aria-label="Alle Mappen">
          <ArrowLeft className="size-[18px]" />
        </Link>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => title.trim() && title !== data.folio.title && saveMeta({ title: title.trim() })}
          className="h-9 min-w-0 flex-1 rounded-[9px] border border-transparent bg-transparent px-2 text-[15.5px] font-semibold hover:border-ink/12 focus:border-accent focus:outline-none sm:max-w-[360px]"
          aria-label="Titel der Mappe"
        />
        <span className="hidden text-[12.5px] text-faint md:block">{running ? "Prüft live …" : saved ? "Gespeichert" : "Speichert …"}</span>
        <div className="ml-auto flex flex-wrap items-center gap-1.5">
          <Btn variant="ghost" size="sm" onClick={checkAll} disabled={running}>
            {running ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
            <span className="hidden sm:inline">Alles prüfen</span>
          </Btn>
          <Btn variant="ghost" size="sm" onClick={() => window.print()}>
            <Printer className="size-4" />
            <span className="hidden sm:inline">PDF</span>
          </Btn>
          <Btn variant="outline" size="sm" onClick={() => setShareOpen(true)}>
            <Link2 className="size-4" />
            <span className="hidden sm:inline">Teilen</span>
          </Btn>
          <Btn variant="accent" size="sm" onClick={() => setPresenting(true)}>
            <Play className="size-4" />
            Präsentieren
          </Btn>
        </div>
      </div>

      <div className="grid lg:grid-cols-[250px_minmax(0,1fr)]">
        <nav className="hidden border-r border-ink/[0.07] print:hidden lg:block" aria-label="Kapitel">
          <ol className="sticky top-[57px] max-h-[calc(100dvh-57px)] space-y-0.5 overflow-y-auto p-3">
            {doc.chapters.map((c, i) => {
              const r = roles[c.role];
              return (
                <li key={c.id} className="group flex items-center gap-1 rounded-[10px] hover:bg-ink/[0.04]">
                  <a href={`#ch-${c.id}`} className={cn("flex min-w-0 flex-1 items-center gap-2.5 px-2.5 py-2 text-[13.5px]", c.hidden && "opacity-40")}>
                    <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: r.tone }} />
                    <span className="min-w-0 flex-1 truncate">{c.title}</span>
                  </a>
                  <button type="button" onClick={() => edit.set(`chapters.${i}`, ["status"], c.status === "ready" ? "draft" : "ready")} className={cn("flex size-6 items-center justify-center rounded-md", c.status === "ready" ? "text-emerald-600" : "text-ink/25 hover:text-ink/60")} aria-label={c.status === "ready" ? "Fertig" : "Als fertig markieren"} title={c.status === "ready" ? "Fertig" : "Entwurf"}>
                    <Check className="size-4" strokeWidth={3} />
                  </button>
                  <button type="button" onClick={() => edit.set(`chapters.${i}`, ["hidden"], !c.hidden)} className="flex size-6 items-center justify-center rounded-md text-ink/30 opacity-0 hover:text-ink group-hover:opacity-100" aria-label={c.hidden ? "Einblenden" : "Ausblenden"} title={c.hidden ? "Einblenden" : "Für den Kunden ausblenden"}>
                    {c.hidden ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  </button>
                </li>
              );
            })}
          </ol>
          <p className="px-5 pb-5 text-[12px] leading-[1.45] text-faint">Texte direkt anklicken und ändern. Haken = Kapitel fertig. Ausgeblendete Kapitel sieht der Kunde nicht.</p>
        </nav>
        <FolioView doc={doc} edit={edit} tools={tools} className="min-h-dvh" />
      </div>

      {presenting && <Present doc={doc} onClose={() => setPresenting(false)} />}

      <Modal open={shareOpen} onClose={() => setShareOpen(false)} title="Mappe teilen">
        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-[14px] border border-ink/10 p-4">
          <span>
            <span className="block text-[14.5px] font-medium">Link für den Kunden</span>
            <span className="block text-[13px] text-muted">{shared ? "Jeder mit dem Link kann die Mappe lesen." : "Aus – nur du siehst die Mappe."}</span>
          </span>
          <input
            type="checkbox"
            checked={shared}
            onChange={(e) => {
              setShared(e.target.checked);
              void saveMeta({ shared: e.target.checked });
            }}
            className="size-5 accent-[#6865ff]"
          />
        </label>
        {shared && (
          <div className="mt-4 flex gap-2">
            <div className="flex h-10 min-w-0 flex-1 items-center rounded-[10px] border border-ink/12 bg-paper px-3 text-[13.5px]">
              <span className="truncate">{url}</span>
            </div>
            <Btn
              variant="accent"
              onClick={async () => {
                await navigator.clipboard.writeText(url).catch(() => {});
                toast("Link kopiert");
              }}
            >
              <Copy className="size-4" />
              Kopieren
            </Btn>
          </div>
        )}
        <div className="mt-5 flex justify-between border-t border-ink/[0.07] pt-4">
          <Btn
            variant="danger"
            size="sm"
            onClick={async () => {
              if (!window.confirm("Diese Mappe wirklich löschen?")) return;
              await api(`/folios/${id}`, { method: "DELETE" });
              navigate("/mappen");
            }}
          >
            <Trash2 className="size-3.5" />
            Mappe löschen
          </Btn>
          <Btn variant="ghost" size="sm" onClick={() => setShareOpen(false)}>
            Schließen
          </Btn>
        </div>
      </Modal>
    </div>
  );
}
