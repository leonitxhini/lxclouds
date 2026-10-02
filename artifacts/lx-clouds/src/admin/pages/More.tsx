import { Download, ExternalLink, Mail, Pencil, Plus, Trash2, UserPlus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { api, ApiError, formatDate, useLoad, type Client, type Inquiry, type Project, type Task, type User } from "../api";
import { Badge, Btn, Card, Empty, Field, Input, Loading, Modal, PageHeader, Select, Textarea, useToast } from "../ui";

// ---------------------------------------------------------------- Projekte
const projectStatus = { idea: ["Idee", "grey"], building: ["In Arbeit", "amber"], live: ["Live", "green"], paused: ["Pausiert", "red"] } as const;

export function Projects() {
  const { data, error, reload } = useLoad<{ projects: Project[] }>("/projects");
  const toast = useToast();
  const [editing, setEditing] = useState<Project | "new" | null>(null);

  if (error) return <p className="py-20 text-center text-red-600">{error.message}</p>;
  if (!data) return <Loading />;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(e.currentTarget));
    try {
      if (editing === "new") await api("/projects", { method: "POST", body });
      else if (editing) await api(`/projects/${editing.id}`, { method: "PATCH", body });
      setEditing(null);
      reload();
    } catch (err) {
      toast((err as ApiError).message, "error");
    }
  }

  async function remove(p: Project) {
    if (!window.confirm(`Projekt „${p.name}“ wirklich löschen?`)) return;
    await api(`/projects/${p.id}`, { method: "DELETE" });
    setEditing(null);
    reload();
  }

  const current = editing && editing !== "new" ? editing : null;

  return (
    <>
      <PageHeader title="Projekte" sub="Alles, was läuft oder geplant ist – mit den Links, die man sonst sucht.">
        <Btn variant="accent" onClick={() => setEditing("new")}>
          <Plus className="size-4" aria-hidden="true" />
          Neues Projekt
        </Btn>
      </PageHeader>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.projects.map((p) => (
          <li key={p.id}>
            <Card className="flex h-full flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-[16.5px] font-semibold tracking-[-0.01em]">{p.name}</h2>
                <Badge tone={projectStatus[p.status][1]}>{projectStatus[p.status][0]}</Badge>
              </div>
              <dl className="mt-3 flex-1 space-y-1.5 text-[13.5px]">
                {p.url && (
                  <div className="flex gap-2">
                    <dt className="w-[62px] shrink-0 text-faint">Live</dt>
                    <dd className="min-w-0">
                      <a href={p.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 truncate text-accent-ink hover:underline">
                        {p.url.replace(/^https?:\/\//, "")}
                        <ExternalLink className="size-3 shrink-0" aria-hidden="true" />
                      </a>
                    </dd>
                  </div>
                )}
                {p.repo && (
                  <div className="flex gap-2">
                    <dt className="w-[62px] shrink-0 text-faint">Repo</dt>
                    <dd className="truncate">{p.repo}</dd>
                  </div>
                )}
                {p.hosting && (
                  <div className="flex gap-2">
                    <dt className="w-[62px] shrink-0 text-faint">Hosting</dt>
                    <dd className="truncate">{p.hosting}</dd>
                  </div>
                )}
                {p.client_name && (
                  <div className="flex gap-2">
                    <dt className="w-[62px] shrink-0 text-faint">Kunde</dt>
                    <dd className="truncate">{p.client_name}</dd>
                  </div>
                )}
              </dl>
              {p.notes && <p className="mt-3 line-clamp-3 whitespace-pre-line border-t border-ink/[0.06] pt-3 text-[13.5px] text-muted">{p.notes}</p>}
              <Btn variant="ghost" size="sm" className="mt-3 self-start" onClick={() => setEditing(p)}>
                <Pencil className="size-3.5" aria-hidden="true" />
                Bearbeiten
              </Btn>
            </Card>
          </li>
        ))}
      </ul>

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={current ? "Projekt bearbeiten" : "Neues Projekt"}>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2" key={current?.id ?? "new"}>
          <Field label="Name" className="sm:col-span-2">
            <Input name="name" required defaultValue={current?.name ?? ""} autoFocus />
          </Field>
          <Field label="Status">
            <Select name="status" defaultValue={current?.status ?? "building"}>
              {Object.entries(projectStatus).map(([k, [label]]) => (
                <option key={k} value={k}>
                  {label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Hosting">
            <Input name="hosting" defaultValue={current?.hosting ?? ""} placeholder="Cloudflare Pages, Hetzner …" />
          </Field>
          <Field label="Live-Adresse" className="sm:col-span-2">
            <Input name="url" defaultValue={current?.url ?? ""} placeholder="https://…" />
          </Field>
          <Field label="Repository" className="sm:col-span-2">
            <Input name="repo" defaultValue={current?.repo ?? ""} placeholder="name/repo" />
          </Field>
          <Field label="Notizen" className="sm:col-span-2">
            <Textarea name="notes" rows={4} defaultValue={current?.notes ?? ""} />
          </Field>
          <div className="flex items-center justify-between sm:col-span-2">
            {current ? (
              <Btn variant="danger" size="sm" onClick={() => remove(current)}>
                <Trash2 className="size-3.5" aria-hidden="true" />
                Löschen
              </Btn>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <Btn variant="ghost" onClick={() => setEditing(null)}>
                Abbrechen
              </Btn>
              <Btn type="submit" variant="accent">
                Speichern
              </Btn>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}

// ---------------------------------------------------------------- Aufgaben
export function Tasks() {
  const { data, error, reload } = useLoad<{ tasks: Task[] }>("/tasks");
  const clients = useLoad<{ clients: Client[] }>("/clients");
  const today = new Date().toISOString().slice(0, 10);

  if (error) return <p className="py-20 text-center text-red-600">{error.message}</p>;
  if (!data) return <Loading />;

  async function add(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const title = String(fd.get("title") ?? "").trim();
    if (!title) return;
    await api("/tasks", { method: "POST", body: { title, due: fd.get("due") || null, client_id: fd.get("client_id") || null } });
    form.reset();
    reload();
  }

  const open = data.tasks.filter((t) => !t.done);
  const done = data.tasks.filter((t) => t.done).slice(0, 20);

  const row = (t: Task) => (
    <li key={t.id} className="flex items-center gap-3 px-5 py-3">
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
      <span className="min-w-0 flex-1">
        <span className={cn("block truncate text-[14.5px]", t.done && "text-faint line-through")}>{t.title}</span>
        {t.client_name && t.client_id && (
          <Link href={`/kunden/${t.client_id}`} className="text-[12.5px] text-faint hover:text-accent-ink">
            {t.client_name}
          </Link>
        )}
      </span>
      {t.due && <span className={cn("shrink-0 text-[13px]", !t.done && t.due < today ? "font-medium text-red-600" : "text-muted")}>{formatDate(t.due)}</span>}
      <button
        type="button"
        onClick={async () => {
          await api(`/tasks/${t.id}`, { method: "DELETE" });
          reload();
        }}
        className="flex size-8 shrink-0 items-center justify-center rounded-lg text-faint hover:bg-red-50 hover:text-red-600"
        aria-label="Aufgabe löschen"
      >
        <Trash2 className="size-4" />
      </button>
    </li>
  );

  return (
    <>
      <PageHeader title="Aufgaben" sub={`${open.length} offen`} />
      <Card className="mb-4 p-4">
        <form onSubmit={add} className="flex flex-wrap gap-2">
          <Input name="title" placeholder="Was ist zu tun?" className="min-w-[200px] flex-1" aria-label="Neue Aufgabe" />
          <Select name="client_id" className="w-[190px]" aria-label="Kunde" defaultValue="">
            <option value="">Ohne Kunde</option>
            {clients.data?.clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
          <Input name="due" type="date" className="w-[150px]" aria-label="Fällig am" />
          <Btn type="submit" variant="accent">
            <Plus className="size-4" aria-hidden="true" />
            Hinzufügen
          </Btn>
        </form>
      </Card>
      {open.length === 0 && done.length === 0 ? (
        <Empty title="Keine Aufgaben" text="Trag oben ein, was als Nächstes ansteht." />
      ) : (
        <>
          <Card className="overflow-hidden">
            {open.length ? <ul className="divide-y divide-ink/[0.06]">{open.map(row)}</ul> : <p className="px-5 py-6 text-[14px] text-muted">Alles erledigt.</p>}
          </Card>
          {done.length > 0 && (
            <>
              <h2 className="mb-2 mt-7 text-[13px] font-semibold uppercase tracking-[0.1em] text-faint">Erledigt</h2>
              <Card className="overflow-hidden">
                <ul className="divide-y divide-ink/[0.06]">{done.map(row)}</ul>
              </Card>
            </>
          )}
        </>
      )}
    </>
  );
}

// ---------------------------------------------------------------- Anfragen
export function Inquiries() {
  const { data, error, reload } = useLoad<{ inquiries: Inquiry[] }>("/inquiries");
  const [, navigate] = useLocation();
  const toast = useToast();

  if (error) return <p className="py-20 text-center text-red-600">{error.message}</p>;
  if (!data) return <Loading />;

  async function setStatus(i: Inquiry, status: Inquiry["status"]) {
    await api(`/inquiries/${i.id}`, { method: "PATCH", body: { status } });
    reload();
  }

  async function toClient(i: Inquiry) {
    try {
      const { id } = await api<{ id: number }>("/clients", { method: "POST", body: { name: i.name || i.email || "Anfrage", email: i.email, status: "lead", notes: i.message } });
      await api(`/inquiries/${i.id}`, { method: "PATCH", body: { status: "done" } });
      navigate(`/kunden/${id}`);
    } catch (err) {
      toast((err as ApiError).message, "error");
    }
  }

  return (
    <>
      <PageHeader title="Anfragen" sub="Nachrichten aus dem Kontaktformular der Website." />
      {data.inquiries.length === 0 ? (
        <Empty title="Noch keine Anfragen" text="Sobald jemand das Kontaktformular auf lxclouds.com abschickt, erscheint die Nachricht hier." />
      ) : (
        <ul className="space-y-3">
          {data.inquiries.map((i) => (
            <li key={i.id}>
              <Card className={cn("p-5", i.status === "new" && "border-accent/40")}>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-[15px] font-semibold">{i.name ?? "Unbekannt"}</span>
                  {i.email && (
                    <a href={`mailto:${i.email}`} className="text-[13.5px] text-accent-ink hover:underline">
                      {i.email}
                    </a>
                  )}
                  {i.status === "new" && <Badge tone="accent">Neu</Badge>}
                  {i.status === "done" && <Badge tone="green">Erledigt</Badge>}
                  <span className="ml-auto text-[12.5px] text-faint">
                    {formatDate(i.created_at, true)}
                    {i.lang ? ` · ${i.lang.toUpperCase()}` : ""}
                  </span>
                </div>
                <p className="mt-3 whitespace-pre-line text-[14.5px] leading-relaxed text-ink/85">{i.message}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {i.email && (
                    <a href={`mailto:${i.email}?subject=${encodeURIComponent("Ihre Anfrage an lxclouds.com")}`} className="inline-flex h-8 items-center gap-1.5 rounded-[10px] border border-ink/12 bg-white px-3 text-[13px] font-medium hover:border-accent/50">
                      <Mail className="size-3.5" aria-hidden="true" />
                      Antworten
                    </a>
                  )}
                  <Btn variant="outline" size="sm" onClick={() => toClient(i)}>
                    <UserPlus className="size-3.5" aria-hidden="true" />
                    Als Kunde anlegen
                  </Btn>
                  {i.status === "new" && (
                    <Btn variant="ghost" size="sm" onClick={() => setStatus(i, "read")}>
                      Als gelesen markieren
                    </Btn>
                  )}
                  {i.status !== "done" && (
                    <Btn variant="ghost" size="sm" onClick={() => setStatus(i, "done")}>
                      Erledigt
                    </Btn>
                  )}
                  <Btn
                    variant="ghost"
                    size="sm"
                    className="ml-auto text-faint hover:text-red-600"
                    onClick={async () => {
                      if (!window.confirm("Anfrage wirklich löschen?")) return;
                      await api(`/inquiries/${i.id}`, { method: "DELETE" });
                      reload();
                    }}
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                    Löschen
                  </Btn>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

// ---------------------------------------------------------------- Einstellungen
export function SettingsPage({ user, onLogout }: { user: User; onLogout: () => void }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  async function changePassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get("next") !== fd.get("repeat")) {
      toast("Die beiden neuen Passwörter stimmen nicht überein.", "error");
      return;
    }
    setBusy(true);
    try {
      await api("/auth/password", { method: "POST", body: { current: fd.get("current"), next: fd.get("next") } });
      form.reset();
      toast("Passwort geändert");
    } catch (err) {
      toast((err as ApiError).message, "error");
    }
    setBusy(false);
  }

  return (
    <>
      <PageHeader title="Einstellungen" />
      <div className="grid max-w-[860px] gap-4 md:grid-cols-2">
        <Card className="p-5">
          <h2 className="text-[15px] font-semibold">Konto</h2>
          <p className="mt-3 text-[14.5px]">{user.name}</p>
          <p className="text-[13.5px] text-muted">{user.email}</p>
          <Btn variant="outline" size="sm" className="mt-4" onClick={onLogout}>
            Abmelden
          </Btn>
        </Card>
        <Card className="p-5">
          <h2 className="text-[15px] font-semibold">Datensicherung</h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-muted">Lädt alle Kunden, Demos, Vorlagen, Aufgaben und Anfragen als eine JSON-Datei herunter.</p>
          <a href="/api/export" className="mt-4 inline-flex h-8 items-center gap-1.5 rounded-[10px] border border-ink/12 bg-white px-3 text-[13px] font-medium hover:border-accent/50">
            <Download className="size-3.5" aria-hidden="true" />
            Export herunterladen
          </a>
        </Card>
        <Card className="p-5 md:col-span-2">
          <h2 className="text-[15px] font-semibold">Passwort ändern</h2>
          <form onSubmit={changePassword} className="mt-4 grid gap-4 sm:grid-cols-3">
            <Field label="Aktuelles Passwort">
              <Input name="current" type="password" required autoComplete="current-password" />
            </Field>
            <Field label="Neues Passwort" hint="Mindestens 10 Zeichen">
              <Input name="next" type="password" required minLength={10} autoComplete="new-password" />
            </Field>
            <Field label="Neues Passwort wiederholen">
              <Input name="repeat" type="password" required minLength={10} autoComplete="new-password" />
            </Field>
            <div className="sm:col-span-3">
              <Btn type="submit" disabled={busy}>
                Passwort speichern
              </Btn>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
