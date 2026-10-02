import { ArrowLeft, Mail, MonitorPlay, Phone, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { cn } from "@/lib/utils";
import { api, ApiError, euro, formatDate, statusLabels, statusOrder, useLoad, type Activity, type Client, type ClientStatus, type DemoSummary, type Task } from "../api";
import { NewDemoModal } from "../NewDemo";
import { Badge, Btn, Card, Empty, Field, Input, Loading, Modal, PageHeader, Select, Textarea, useToast } from "../ui";

const statusTone: Record<ClientStatus, "grey" | "accent" | "amber" | "green" | "red"> = { lead: "grey", contact: "accent", offer: "amber", won: "green", lost: "red" };

export function StatusBadge({ status }: { status: ClientStatus }) {
  return <Badge tone={statusTone[status]}>{statusLabels[status]}</Badge>;
}

function ClientForm({ onDone, onCancel }: { onDone: (id: number) => void; onCancel: () => void }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    try {
      const body = Object.fromEntries(new FormData(e.currentTarget));
      const { id } = await api<{ id: number }>("/clients", { method: "POST", body });
      onDone(id);
    } catch (err) {
      toast((err as ApiError).message, "error");
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <Field label="Firma / Name" className="sm:col-span-2">
        <Input name="name" required autoFocus placeholder="z. B. Musterfirma GmbH" />
      </Field>
      <Field label="Ansprechpartner">
        <Input name="contact" />
      </Field>
      <Field label="Branche">
        <Input name="industry" placeholder="Restaurant, Handwerk …" />
      </Field>
      <Field label="E-Mail">
        <Input name="email" type="email" />
      </Field>
      <Field label="Telefon">
        <Input name="phone" />
      </Field>
      <Field label="Ort">
        <Input name="city" />
      </Field>
      <Field label="Auftragswert (geschätzt, €)">
        <Input name="value" type="number" min={0} step={50} />
      </Field>
      <div className="flex justify-end gap-2 sm:col-span-2">
        <Btn variant="ghost" onClick={onCancel}>
          Abbrechen
        </Btn>
        <Btn type="submit" variant="accent" disabled={busy}>
          Kunde anlegen
        </Btn>
      </div>
    </form>
  );
}

export function Clients() {
  const { data, error } = useLoad<{ clients: Client[] }>("/clients");
  const [, navigate] = useLocation();
  const search = useSearch();
  const [filter, setFilter] = useState<ClientStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(search).get("neu")) setCreating(true);
  }, [search]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data?.clients ?? []).filter(
      (c) => (filter === "all" || c.status === filter) && (!q || [c.name, c.contact, c.city, c.industry, c.email].some((v) => v?.toLowerCase().includes(q))),
    );
  }, [data, filter, query]);

  if (error) return <p className="py-20 text-center text-red-600">{error.message}</p>;
  if (!data) return <Loading />;

  return (
    <>
      <PageHeader title="Kunden" sub={`${data.clients.length} Kontakte`}>
        <Btn variant="accent" onClick={() => setCreating(true)}>
          <Plus className="size-4" aria-hidden="true" />
          Neuer Kunde
        </Btn>
      </PageHeader>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap items-center gap-1 rounded-[12px] bg-ink/[0.05] p-1">
          {(["all", ...statusOrder] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              aria-pressed={filter === s}
              className={cn("h-8 rounded-[9px] px-3 text-[13px] font-medium transition-colors", filter === s ? "bg-white text-ink shadow-sm" : "text-ink/60 hover:text-ink")}
            >
              {s === "all" ? "Alle" : statusLabels[s]}
              <span className="ml-1.5 text-faint">{s === "all" ? data.clients.length : data.clients.filter((c) => c.status === s).length}</span>
            </button>
          ))}
        </div>
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden="true" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Suchen …" className="pl-9" aria-label="Kunden durchsuchen" />
        </div>
      </div>

      {data.clients.length === 0 ? (
        <Empty title="Noch keine Kunden" text="Lege den ersten Kontakt an – Demos, Notizen und Aufgaben hängen dann an ihm.">
          <Btn variant="accent" onClick={() => setCreating(true)}>
            Ersten Kunden anlegen
          </Btn>
        </Empty>
      ) : rows.length === 0 ? (
        <Empty title="Nichts gefunden" text="Kein Kunde passt zu Filter und Suche." />
      ) : (
        <Card className="overflow-hidden">
          <ul className="divide-y divide-ink/[0.06]">
            {rows.map((c) => (
              <li key={c.id}>
                <Link href={`/kunden/${c.id}`} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-5 py-3.5 transition-colors hover:bg-ink/[0.025] md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_110px_100px_90px]">
                  <span className="min-w-0">
                    <span className="block truncate text-[14.5px] font-medium">{c.name}</span>
                    <span className="block truncate text-[12.5px] text-faint">{[c.contact, c.industry].filter(Boolean).join(" · ") || "–"}</span>
                  </span>
                  <span className="hidden truncate text-[13.5px] text-muted md:block">{c.city ?? "–"}</span>
                  <span className="justify-self-end md:justify-self-start">
                    <StatusBadge status={c.status} />
                  </span>
                  <span className="hidden text-right text-[13.5px] md:block">{euro(c.value)}</span>
                  <span className="hidden text-right text-[12.5px] text-faint md:block">
                    {c.demo_count ? `${c.demo_count} Demo${c.demo_count > 1 ? "s" : ""}` : formatDate(c.updated_at)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Modal open={creating} onClose={() => setCreating(false)} title="Neuer Kunde">
        <ClientForm onCancel={() => setCreating(false)} onDone={(id) => navigate(`/kunden/${id}`)} />
      </Modal>
    </>
  );
}

type Detail = { client: Client; activities: Activity[]; tasks: Task[]; demos: DemoSummary[] };
const kinds = { note: "Notiz", call: "Anruf", meeting: "Termin", email: "E-Mail", system: "System" } as Record<string, string>;

export function ClientDetail({ id }: { id: number }) {
  const { data, error, reload, set } = useLoad<Detail>(`/clients/${id}`);
  const [, navigate] = useLocation();
  const toast = useToast();
  const [newDemo, setNewDemo] = useState(false);
  const [kind, setKind] = useState("note");

  if (error) return <p className="py-20 text-center text-red-600">{error.message}</p>;
  if (!data) return <Loading />;
  const { client } = data;

  /** Saves one field when it loses focus, if it changed. */
  async function save(field: keyof Client, value: string) {
    const current = client[field];
    if (String(current ?? "") === value) return;
    try {
      await api(`/clients/${id}`, { method: "PATCH", body: { [field]: value } });
      set({ ...data!, client: { ...client, [field]: field === "value" ? (value ? Number(value) : null) : value } as Client });
      if (field === "status") reload();
    } catch (err) {
      toast((err as ApiError).message, "error");
    }
  }

  async function addActivity(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const text = String(new FormData(form).get("text") ?? "").trim();
    if (!text) return;
    await api("/activities", { method: "POST", body: { client_id: id, kind, text } });
    form.reset();
    reload();
  }

  async function addTask(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const title = String(fd.get("title") ?? "").trim();
    if (!title) return;
    await api("/tasks", { method: "POST", body: { client_id: id, title, due: fd.get("due") || null } });
    form.reset();
    reload();
  }

  async function remove() {
    if (!window.confirm(`„${client.name}“ wirklich löschen? Notizen und Aufgaben gehen mit verloren, Demos bleiben erhalten.`)) return;
    await api(`/clients/${id}`, { method: "DELETE" });
    navigate("/kunden");
  }

  const text = (field: keyof Client, label: string, props: { type?: string; placeholder?: string } = {}) => (
    <Field label={label}>
      <Input key={`${field}-${client.updated_at}`} defaultValue={String(client[field] ?? "")} onBlur={(e) => save(field, e.target.value.trim())} {...props} />
    </Field>
  );

  return (
    <>
      <Link href="/kunden" className="mb-4 inline-flex items-center gap-1.5 text-[13.5px] text-muted hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Alle Kunden
      </Link>
      <PageHeader title={client.name} sub={[client.contact, client.city].filter(Boolean).join(" · ") || undefined}>
        {client.phone && (
          <a href={`tel:${client.phone}`} className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-ink/12 bg-white px-3.5 text-[14px] hover:border-accent/50">
            <Phone className="size-4" aria-hidden="true" />
            Anrufen
          </a>
        )}
        {client.email && (
          <a href={`mailto:${client.email}`} className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-ink/12 bg-white px-3.5 text-[14px] hover:border-accent/50">
            <Mail className="size-4" aria-hidden="true" />
            E-Mail
          </a>
        )}
        <Btn variant="accent" onClick={() => setNewDemo(true)}>
          <MonitorPlay className="size-4" aria-hidden="true" />
          Demo erstellen
        </Btn>
      </PageHeader>

      <div className="grid gap-4 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="space-y-4">
          <Card className="space-y-4 p-5">
            <Field label="Status">
              <Select value={client.status} onChange={(e) => save("status", e.target.value)}>
                {statusOrder.map((s) => (
                  <option key={s} value={s}>
                    {statusLabels[s]}
                  </option>
                ))}
              </Select>
            </Field>
            {text("name", "Firma / Name")}
            {text("contact", "Ansprechpartner")}
            <div className="grid grid-cols-2 gap-3">
              {text("phone", "Telefon")}
              {text("email", "E-Mail", { type: "email" })}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {text("city", "Ort")}
              {text("industry", "Branche")}
            </div>
            {text("website", "Aktuelle Website", { placeholder: "https://…" })}
            {text("value", "Auftragswert (geschätzt, €)", { type: "number" })}
            <Field label="Notizen">
              <Textarea key={client.updated_at} rows={5} defaultValue={client.notes} onBlur={(e) => save("notes", e.target.value)} placeholder="Was will der Kunde? Budget, Wünsche, Besonderheiten …" />
            </Field>
          </Card>
          <Btn variant="danger" size="sm" onClick={remove}>
            <Trash2 className="size-3.5" aria-hidden="true" />
            Kunde löschen
          </Btn>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-semibold">Demos</h2>
              <Btn variant="outline" size="sm" onClick={() => setNewDemo(true)}>
                <Plus className="size-3.5" aria-hidden="true" />
                Neue Demo
              </Btn>
            </div>
            {data.demos.length === 0 ? (
              <p className="mt-3 text-[14px] text-muted">Noch keine Demo für diesen Kunden.</p>
            ) : (
              <ul className="mt-3 divide-y divide-ink/[0.06]">
                {data.demos.map((d) => (
                  <li key={d.id}>
                    <Link href={`/demos/${d.id}`} className="group flex items-center justify-between gap-3 py-2.5">
                      <span className="min-w-0">
                        <span className="block truncate text-[14.5px] font-medium group-hover:text-accent-ink">{d.title}</span>
                        <span className="block text-[12.5px] text-faint">Geändert {formatDate(d.updated_at, true)}</span>
                      </span>
                      {d.shared ? <Badge tone="green">Freigegeben</Badge> : <Badge>Privat</Badge>}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-5">
            <h2 className="text-[15px] font-semibold">Aufgaben</h2>
            <ul className="mt-2 divide-y divide-ink/[0.06]">
              {data.tasks.map((t) => (
                <li key={t.id} className="flex items-center gap-3 py-2.5">
                  <input
                    type="checkbox"
                    checked={!!t.done}
                    onChange={async (e) => {
                      await api(`/tasks/${t.id}`, { method: "PATCH", body: { done: e.target.checked } });
                      reload();
                    }}
                    className="size-[17px] accent-[#6865ff]"
                    aria-label={t.title}
                  />
                  <span className={cn("flex-1 text-[14px]", t.done && "text-faint line-through")}>{t.title}</span>
                  {t.due && <span className="text-[12.5px] text-muted">{formatDate(t.due)}</span>}
                </li>
              ))}
            </ul>
            <form onSubmit={addTask} className="mt-3 flex flex-wrap gap-2">
              <Input name="title" placeholder="Neue Aufgabe …" className="min-w-[180px] flex-1" aria-label="Neue Aufgabe" />
              <Input name="due" type="date" className="w-[150px]" aria-label="Fällig am" />
              <Btn type="submit" variant="outline">
                Hinzufügen
              </Btn>
            </form>
          </Card>

          <Card className="p-5">
            <h2 className="text-[15px] font-semibold">Verlauf</h2>
            <form onSubmit={addActivity} className="mt-3 space-y-2">
              <Textarea name="text" rows={2} placeholder="Was wurde besprochen?" aria-label="Neuer Eintrag" />
              <div className="flex gap-2">
                <Select value={kind} onChange={(e) => setKind(e.target.value)} className="w-[140px]" aria-label="Art">
                  <option value="note">Notiz</option>
                  <option value="call">Anruf</option>
                  <option value="meeting">Termin</option>
                  <option value="email">E-Mail</option>
                </Select>
                <Btn type="submit" variant="outline">
                  Eintragen
                </Btn>
              </div>
            </form>
            <ul className="mt-5 space-y-4">
              {data.activities.map((a) => (
                <li key={a.id} className="flex gap-3">
                  <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", a.kind === "system" ? "bg-ink/20" : "bg-accent")} />
                  <span className="min-w-0 flex-1">
                    <span className="block whitespace-pre-line text-[14px]">{a.text}</span>
                    <span className="text-[12px] text-faint">
                      {kinds[a.kind] ?? a.kind} · {formatDate(a.created_at, true)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <NewDemoModal open={newDemo} onClose={() => setNewDemo(false)} client={client} template={templateFor(client.industry)} />
    </>
  );
}

/** Suggests the template that fits a client's industry. */
function templateFor(industry: string | null) {
  const text = (industry ?? "").toLowerCase();
  const rules: [RegExp, string][] = [
    [/auto|miet|rent|car/, "rental"],
    [/restaurant|gastro|caf|bar|pizz|imbiss/, "restaurant"],
    [/handwerk|elektr|sanit|maler|bau|dach|fliesen/, "craft"],
    [/friseur|beauty|kosmetik|barber|nagel|salon/, "beauty"],
    [/arzt|praxis|zahn|physio|gesund/, "clinic"],
    [/immobil|makler/, "realestate"],
    [/shop|handel|boutique|laden|mode/, "shop"],
  ];
  return rules.find(([re]) => re.test(text))?.[1] ?? "service";
}
