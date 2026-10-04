import { ArrowLeft, ArrowRight, Check, Copy, Images, MessageSquarePlus, MessagesSquare, Plus, Sparkles, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { imageUrl } from "@/demo/edit";
import { cn } from "@/lib/utils";
import { api, ApiError, formatDate, useLoad, type BoardItem, type Client } from "../api";
import { isMeeting, labelsOf, newMeeting, summaryText, uid, type Item, type MeetingDoc, type Pick, type Section, type SectionKind, type Todo } from "../meeting";
import { Btn, Card, Empty, Field, Input, Loading, Modal, PageHeader, Select, useToast } from "../ui";

type Summary = { id: number; title: string; client_id: number | null; client_name: string | null; created_at: string; updated_at: string };
type Row = Summary & { doc: MeetingDoc };

/** All drafts a client has in Entwürfe, as meeting items. */
async function clientDesigns(clientId: number) {
  const { boards } = await api<{ boards: { id: number }[] }>(`/clients/${clientId}`);
  const lists = await Promise.all(boards.map((b) => api<{ items: BoardItem[] }>(`/boards/${b.id}`).then((r) => r.items)));
  return lists.flat().map((i) => ({ title: i.group_name ? `${i.group_name} · ${i.title}` : i.title, image: i.image }));
}

// ---------------------------------------------------------------- list

export function Meetings() {
  const { data, error } = useLoad<{ talks: Summary[] }>("/talks");
  const [creating, setCreating] = useState(false);
  if (error) return <p className="py-20 text-center text-red-600">{error.message}</p>;
  if (!data) return <Loading />;
  return (
    <>
      <PageHeader title="Besprechungen" sub="Alles, was du für einen Kunden vorbereitet hast, auf einer Seite – beim Kunden aufmachen und gemeinsam entscheiden, was ihr nehmt.">
        <Btn variant="accent" onClick={() => setCreating(true)}>
          <Plus className="size-4" aria-hidden="true" />
          Neue Besprechung
        </Btn>
      </PageHeader>
      {data.talks.length === 0 ? (
        <Empty title="Noch keine Besprechung" text="Leg eine an, bereite sie vor – Entwürfe, Name, Funktionen, Pakete – und mach sie beim Kunden auf.">
          <Btn variant="accent" onClick={() => setCreating(true)}>
            Erste Besprechung vorbereiten
          </Btn>
        </Empty>
      ) : (
        <Card className="divide-y divide-ink/[0.06]">
          {data.talks.map((t) => (
            <Link key={t.id} href={`/besprechungen/${t.id}`} className="group flex items-center justify-between gap-3 px-5 py-3.5">
              <span className="min-w-0">
                <span className="block truncate text-[15px] font-medium group-hover:text-accent-ink">{t.title}</span>
                <span className="block text-[12.5px] text-faint">
                  {t.client_name ?? "Ohne Kunde"} · geändert {formatDate(t.updated_at, true)}
                </span>
              </span>
              <MessagesSquare className="size-4 shrink-0 text-faint" aria-hidden="true" />
            </Link>
          ))}
        </Card>
      )}
      <NewMeetingModal open={creating} onClose={() => setCreating(false)} />
    </>
  );
}

export function NewMeetingModal({ open, onClose, client }: { open: boolean; onClose: () => void; client?: Client | null }) {
  const [, navigate] = useLocation();
  const toast = useToast();
  const clients = useLoad<{ clients: Client[] }>(open ? "/clients" : null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const clientId = Number(f.get("client")) || client?.id || null;
    const name = clients.data?.clients.find((c) => c.id === clientId)?.name ?? client?.name;
    const title = String(f.get("title") ?? "").trim() || `Besprechung${name ? ` mit ${name}` : ""}`;
    setBusy(true);
    try {
      const designs = clientId ? await clientDesigns(clientId).catch(() => []) : [];
      const { id } = await api<{ id: number }>("/talks", { method: "POST", body: { title, client_id: clientId, doc: newMeeting(designs) } });
      onClose();
      navigate(`/besprechungen/${id}?vorbereiten=1`);
    } catch (err) {
      toast((err as ApiError).message, "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Neue Besprechung">
      <form onSubmit={submit} className="grid gap-4">
        <Field label="Kunde" hint="Seine Entwürfe kommen automatisch mit rein.">
          <Select name="client" defaultValue={client ? String(client.id) : ""}>
            <option value="">– ohne Kunde –</option>
            {clients.data?.clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Titel" hint="Leer lassen: „Besprechung mit …“">
          <Input name="title" placeholder="z. B. Website – erster Termin" />
        </Field>
        <Btn type="submit" variant="accent" disabled={busy}>
          Anlegen und vorbereiten
        </Btn>
      </form>
    </Modal>
  );
}

// ---------------------------------------------------------------- saving

function useAutosave(id: number, row: Row | null) {
  const toast = useToast();
  const latest = useRef<MeetingDoc | null>(null);
  const base = useRef<string | null>(null);
  const timer = useRef(0);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const [state, setState] = useState<"saved" | "saving" | "stale">("saved");

  useEffect(() => {
    if (!row) return;
    latest.current = row.doc;
    base.current = row.updated_at;
  }, [row]);

  const flush = useCallback(() => {
    timer.current = 0;
    queue.current = queue.current.then(async () => {
      try {
        const res = await api<{ updated_at: string | null }>(`/talks/${id}`, { method: "PATCH", body: { doc: latest.current, base: base.current } });
        base.current = res.updated_at;
        setState((s) => (s === "stale" ? s : "saved"));
      } catch (err) {
        if ((err as ApiError).status === 409) setState("stale");
        else toast(`Nicht gespeichert: ${(err as ApiError).message}`, "error");
      }
    });
  }, [id, toast]);

  const save = useCallback(
    (doc: MeetingDoc) => {
      latest.current = doc;
      setState((s) => (s === "stale" ? s : "saving"));
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(flush, 600);
    },
    [flush],
  );

  useEffect(() => {
    const onHide = () => {
      if (!timer.current) return;
      window.clearTimeout(timer.current);
      void fetch(`/api/talks/${id}`, { method: "PATCH", keepalive: true, headers: { "Content-Type": "application/json", "X-Studio": "1" }, body: JSON.stringify({ doc: latest.current, base: base.current }) });
    };
    window.addEventListener("pagehide", onHide);
    return () => window.removeEventListener("pagehide", onHide);
  }, [id]);

  async function rename(title: string) {
    try {
      const res = await api<{ updated_at: string | null }>(`/talks/${id}`, { method: "PATCH", body: { title } });
      base.current = res.updated_at;
    } catch (err) {
      toast((err as ApiError).message, "error");
    }
  }
  return { save, state, rename };
}

// ---------------------------------------------------------------- the page
// One topic at a time: a step bar on top, the topic in the middle, what you have chosen on the right.

export function MeetingPage({ id }: { id: number }) {
  const { data, error } = useLoad<{ talk: Row }>(`/talks/${id}`);
  const row = data?.talk ?? null;
  const [doc, setDoc] = useState<MeetingDoc | null>(null);
  const [title, setTitle] = useState("");
  const [prep, setPrep] = useState(() => new URLSearchParams(window.location.search).has("vorbereiten"));
  const [step, setStep] = useState(0);
  const [zoom, setZoom] = useState<Item | null>(null);
  const toast = useToast();
  const { save, state, rename } = useAutosave(id, row);
  const top = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!row) return;
    setDoc(isMeeting(row.doc) ? row.doc : newMeeting());
    setTitle(row.title);
  }, [row]);

  const change = useCallback(
    (next: (d: MeetingDoc) => MeetingDoc) =>
      setDoc((d) => {
        if (!d) return d;
        const n = next(d);
        save(n);
        return n;
      }),
    [save],
  );
  const setSection = (sid: string, fn: (s: Section) => Section) => change((d) => ({ ...d, sections: d.sections.map((s) => (s.id === sid ? fn(s) : s)) }));
  const setItem = (sid: string, iid: string, patch: Partial<Item>) => setSection(sid, (s) => ({ ...s, items: s.items.map((i) => (i.id === iid ? { ...i, ...patch } : i)) }));
  const choose = (s: Section, item: Item, pick: Pick) =>
    setSection(s.id, (sec) => ({
      ...sec,
      // a choice has one answer: picking one clears the others
      items: sec.items.map((i) => (i.id === item.id ? { ...i, pick } : sec.kind === "choice" && pick === "yes" && i.pick === "yes" ? { ...i, pick: "" } : i)),
    }));

  async function importDesigns(s: Section) {
    if (!row?.client_id) return;
    try {
      const designs = await clientDesigns(row.client_id);
      const have = new Set(s.items.map((i) => i.image));
      const fresh = designs.filter((d) => !have.has(d.image));
      if (!fresh.length) return toast("Alle Entwürfe sind schon drin.");
      setSection(s.id, (sec) => ({ ...sec, items: [...sec.items, ...fresh.map((d) => ({ id: uid(), title: d.title, text: "", image: d.image, pick: "" as Pick, note: "" }))] }));
    } catch (err) {
      toast((err as ApiError).message, "error");
    }
  }

  if (error) return <p className="py-20 text-center text-red-600">{error.message}</p>;
  if (!row || !doc) return <Loading />;

  const steps = doc.sections.length + 1; // the topics, then the result
  const current = Math.min(step, steps - 1);
  const section = doc.sections[current] as Section | undefined;
  const go = (n: number) => {
    setStep(Math.max(0, Math.min(steps - 1, n)));
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const decided = doc.sections.reduce((n, s) => n + s.items.filter((i) => i.pick).length, 0);
  const total = doc.sections.reduce((n, s) => n + s.items.length, 0);

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1240px]">
      {state === "stale" && (
        <div className="sticky top-0 z-30 mb-4 flex flex-wrap items-center justify-center gap-3 rounded-[12px] bg-amber-400 px-4 py-2.5 text-[14px] font-medium text-black">
          Diese Besprechung wurde an anderer Stelle geändert – deine letzte Änderung hier ist nicht gespeichert.
          <button type="button" onClick={() => window.location.reload()} className="rounded-full bg-black px-4 py-1.5 text-[13px] font-semibold text-white">
            Neu laden
          </button>
        </div>
      )}

      {/* head: who, what, how far */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1">
          <Link href="/besprechungen" className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-ink">
            <ArrowLeft className="size-3.5" /> Besprechungen
          </Link>
          <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-accent-ink">{row.client_name ?? "Besprechung"}</p>
          {prep ? (
            <input value={title} onChange={(e) => setTitle(e.target.value)} onBlur={() => title.trim() && title !== row.title && rename(title.trim())} aria-label="Titel" className="mt-1 w-full rounded-[10px] border border-dashed border-ink/15 bg-white px-2 py-0.5 text-[26px] font-semibold tracking-[-0.02em] outline-none focus:border-accent sm:text-[30px]" />
          ) : (
            <h1 className="mt-1 text-[26px] font-semibold leading-tight tracking-[-0.02em] text-balance sm:text-[30px]">{title}</h1>
          )}
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <div className="inline-flex w-fit rounded-full bg-ink/[0.06] p-1" role="group" aria-label="Ansicht">
            {([
              [true, "Vorbereiten"],
              [false, "Mit dem Kunden"],
            ] as const).map(([value, label]) => (
              <button key={label} type="button" aria-pressed={prep === value} onClick={() => setPrep(value)} className={cn("rounded-full px-4 py-1.5 text-[13.5px] font-medium", prep === value ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink")}>
                {label}
              </button>
            ))}
          </div>
          <span className="text-[12.5px] text-faint tabular-nums">{state === "saving" ? "speichert …" : state === "saved" ? "gespeichert" : "nicht gespeichert"}</span>
        </div>
      </div>

      {/* progress */}
      <div className="mb-5 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/[0.07]">
          <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${total ? (decided / total) * 100 : 0}%` }} />
        </div>
        <span className="text-[12.5px] text-muted tabular-nums">
          {decided} von {total} entschieden
        </span>
      </div>

      {/* steps */}
      <div ref={top} className="scroll-mt-4" />
      <nav aria-label="Themen" className="-mx-4 mb-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <ol className="flex w-max gap-1.5 sm:w-auto sm:flex-wrap">
          {doc.sections.map((s, i) => {
            const done = s.items.filter((x) => x.pick).length;
            const complete = s.items.length > 0 && (s.kind === "choice" ? s.items.some((x) => x.pick === "yes") : done === s.items.length);
            return (
              <li key={s.id}>
                <button type="button" onClick={() => go(i)} aria-current={current === i ? "step" : undefined} className={cn("flex h-10 items-center gap-2 rounded-full border px-3.5 text-[13.5px] font-medium transition-colors", current === i ? "border-ink bg-ink text-white" : "border-ink/10 bg-white text-ink/75 hover:border-ink/25")}>
                  <span className={cn("flex size-5 items-center justify-center rounded-full text-[11px] font-semibold", complete ? "bg-emerald-500 text-white" : current === i ? "bg-white/20" : "bg-ink/[0.07]")}>{complete ? <Check className="size-3" strokeWidth={3} /> : i + 1}</span>
                  <span className="whitespace-nowrap">{s.title || "Ohne Titel"}</span>
                  {s.kind !== "choice" && s.items.length > 0 && <span className={cn("text-[12px] tabular-nums", current === i ? "text-white/60" : "text-faint")}>{done}/{s.items.length}</span>}
                </button>
              </li>
            );
          })}
          <li>
            <button type="button" onClick={() => go(steps - 1)} aria-current={current === steps - 1 ? "step" : undefined} className={cn("flex h-10 items-center gap-2 rounded-full border px-3.5 text-[13.5px] font-semibold", current === steps - 1 ? "border-accent bg-accent text-white" : "border-accent/30 bg-accent-soft text-accent-ink hover:border-accent")}>
              <Sparkles className="size-4" aria-hidden="true" /> Ergebnis
            </button>
          </li>
        </ol>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          {section ? (
            <SectionBlock
              key={section.id}
              section={section}
              index={current}
              prep={prep}
              onSection={(fn) => setSection(section.id, fn)}
              onItem={(iid, patch) => setItem(section.id, iid, patch)}
              onPick={(item, pick) => choose(section, item, pick)}
              onRemove={() => {
                change((d) => ({ ...d, sections: d.sections.filter((x) => x.id !== section.id) }));
                setStep((n) => Math.max(0, n - 1));
              }}
              onImport={row.client_id ? () => importDesigns(section) : undefined}
              onZoom={setZoom}
            />
          ) : (
            <Result title={title} doc={doc} onTodos={(todos) => change((d) => ({ ...d, todos }))} onJump={go} />
          )}

          {prep && section && (
            <AddSection
              onAdd={(kind) => {
                change((d) => ({ ...d, sections: [...d.sections, blankSection(kind)] }));
                setStep(doc.sections.length);
              }}
            />
          )}

          <div className="mt-8 flex items-center justify-between gap-3 border-t border-ink/[0.07] pt-5">
            <Btn variant="ghost" onClick={() => go(current - 1)} disabled={current === 0}>
              <ArrowLeft className="size-4" /> Zurück
            </Btn>
            {current < steps - 1 && (
              <Btn onClick={() => go(current + 1)}>
                {current === steps - 2 ? "Zum Ergebnis" : `Weiter: ${doc.sections[current + 1]?.title ?? ""}`} <ArrowRight className="size-4" />
              </Btn>
            )}
          </div>
        </div>

        <aside className="min-w-0 lg:order-none">
          <div className="sticky top-6">
            <Choice doc={doc} onJump={go} />
          </div>
        </aside>
      </div>

      <Modal open={!!zoom} onClose={() => setZoom(null)} title={zoom?.title ?? ""} wide>
        {zoom?.image && <img src={imageUrl(zoom.image)} alt={zoom.title} className="w-full rounded-[12px]" />}
      </Modal>
    </div>
  );
}

const blankSection = (kind: SectionKind): Section => ({
  id: uid(),
  kind,
  title: kind === "choice" ? "Neue Auswahl" : kind === "designs" ? "Entwürfe" : "Neue Punkte",
  intro: "",
  items: kind === "designs" ? [] : [{ id: uid(), title: "Neuer Punkt", text: "", pick: "", note: "" }],
  notes: "",
});

// ---------------------------------------------------------------- small pieces

const segTone: Record<Exclude<Pick, "">, string> = {
  yes: "bg-emerald-500 text-white",
  maybe: "bg-amber-400 text-black",
  no: "bg-ink/75 text-white",
};

/** Three connected buttons – one decision per point. */
function Segmented({ item, labels, onPick, full }: { item: Item; labels: [string, string, string]; onPick: (p: Pick) => void; full?: boolean }) {
  const picks: Exclude<Pick, "">[] = ["yes", "maybe", "no"];
  return (
    <div className={cn("flex w-full shrink-0 rounded-full bg-ink/[0.05] p-0.5", !full && "sm:inline-flex sm:w-auto")} role="group">
      {picks.map((p, i) => (
        <button key={p} type="button" aria-pressed={item.pick === p} onClick={() => onPick(item.pick === p ? "" : p)} className={cn("h-8 flex-1 whitespace-nowrap rounded-full px-3 text-[12.5px] font-medium transition-colors", !full && "sm:flex-none", item.pick === p ? segTone[p] : "text-ink/60 hover:bg-white hover:text-ink")}>
          {labels[i]}
        </button>
      ))}
    </div>
  );
}

/** Text that is plain while talking and editable while preparing. */
function Editable({ prep, value, onChange, placeholder, className, multiline }: { prep: boolean; value: string; onChange: (v: string) => void; placeholder: string; className?: string; multiline?: boolean }) {
  if (!prep) return value ? <span className={cn("block", className)}>{value}</span> : null;
  const base = cn("block w-full rounded-[8px] border border-dashed border-ink/15 bg-white px-2 py-1 outline-none focus:border-accent", className);
  return multiline ? <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={Math.max(2, value.split("\n").length)} className={cn(base, "resize-y")} /> : <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={base} />;
}

/** A note to a point: a small link until there is one. */
function Note({ value, onChange, label = "Notiz" }: { value: string; onChange: (v: string) => void; label?: string }) {
  const [open, setOpen] = useState(false);
  if (!open && !value)
    return (
      <button type="button" onClick={() => setOpen(true)} className="inline-flex w-fit items-center gap-1 text-[12.5px] text-faint hover:text-accent-ink">
        <MessageSquarePlus className="size-3.5" /> {label}
      </button>
    );
  return <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Was er dazu sagt …" aria-label={label} autoFocus={open && !value} onBlur={() => setOpen(false)} className="h-8 w-full rounded-[8px] border border-transparent bg-amber-50/70 px-2.5 text-[13px] text-ink placeholder:text-faint/70 focus:border-accent focus:bg-white focus:outline-none" />;
}

/** Text with "– " lines shown as a list. */
function Lines({ text }: { text: string }) {
  const lines = text.split("\n").filter((l) => l.trim());
  return (
    <div className="grid gap-1.5 text-[14px] leading-snug text-muted">
      {lines.map((l, i) =>
        l.startsWith("– ") ? (
          <p key={i} className="flex gap-2">
            <Check className="mt-0.5 size-3.5 shrink-0 text-accent" strokeWidth={3} aria-hidden="true" />
            <span>{l.slice(2)}</span>
          </p>
        ) : (
          <p key={i} className={cn(i > 0 && /einmalig|inklusive/.test(l) && "pt-1 text-[12.5px] text-faint")}>
            {l}
          </p>
        ),
      )}
    </div>
  );
}

// ---------------------------------------------------------------- one topic

function SectionBlock({
  section: s,
  index,
  prep,
  onSection,
  onItem,
  onPick,
  onRemove,
  onImport,
  onZoom,
}: {
  section: Section;
  index: number;
  prep: boolean;
  onSection: (fn: (s: Section) => Section) => void;
  onItem: (iid: string, patch: Partial<Item>) => void;
  onPick: (item: Item, pick: Pick) => void;
  onRemove: () => void;
  onImport?: () => void;
  onZoom: (item: Item) => void;
}) {
  const labels = labelsOf(s);
  const removeItem = (iid: string) => onSection((sec) => ({ ...sec, items: sec.items.filter((i) => i.id !== iid) }));
  const addItem = () => onSection((sec) => ({ ...sec, items: [...sec.items, { id: uid(), title: "", text: "", pick: "", note: "" }] }));
  const del = (iid: string) =>
    prep && (
      <button type="button" onClick={() => removeItem(iid)} className="flex size-8 shrink-0 items-center justify-center rounded-full text-faint hover:bg-red-50 hover:text-red-600" aria-label="Punkt entfernen">
        <Trash2 className="size-4" />
      </button>
    );

  return (
    <section aria-labelledby={`sec-${s.id}`} className="grid gap-5">
      <header className="flex items-start gap-3">
        <div className="grid min-w-0 flex-1 gap-1.5">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-faint">Thema {index + 1}</p>
          {prep ? (
            <Editable prep value={s.title} onChange={(v) => onSection((x) => ({ ...x, title: v }))} placeholder="Überschrift" className="text-[28px] font-semibold tracking-[-0.02em]" />
          ) : (
            <h2 id={`sec-${s.id}`} className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-balance sm:text-[32px]">
              {s.title}
            </h2>
          )}
          <Editable prep={prep} value={s.intro} onChange={(v) => onSection((x) => ({ ...x, intro: v }))} placeholder="Frage an den Kunden (optional)" className="text-[16px] text-muted" />
        </div>
        {prep && (
          <button type="button" onClick={onRemove} className="flex size-9 shrink-0 items-center justify-center rounded-full text-faint hover:bg-red-50 hover:text-red-600" aria-label="Thema entfernen">
            <Trash2 className="size-4" />
          </button>
        )}
      </header>

      {s.kind === "designs" && (
        <>
          {s.items.length === 0 && <p className="rounded-[16px] bg-ink/[0.03] px-4 py-10 text-center text-[14px] text-muted">Noch keine Entwürfe drin.</p>}
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 [&>*]:min-w-0">
            {s.items.map((item) => (
              <li key={item.id} className={cn("group overflow-hidden rounded-[20px] bg-white ring-1 transition-[box-shadow,opacity]", item.pick === "yes" ? "ring-2 ring-emerald-500" : "ring-ink/[0.08]", item.pick === "no" && "opacity-55")}>
                <button type="button" onClick={() => onZoom(item)} className="relative block w-full overflow-hidden bg-ink/[0.04]" aria-label={`${item.title} groß ansehen`}>
                  {item.image && <img src={imageUrl(item.image)} alt="" loading="lazy" className="aspect-[16/11] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]" />}
                  {item.tag && <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-2.5 py-1 text-[11.5px] font-semibold text-white backdrop-blur">{item.tag}</span>}
                  {item.pick && <span className={cn("absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11.5px] font-semibold", segTone[item.pick])}>{labels[["yes", "maybe", "no"].indexOf(item.pick)]}</span>}
                </button>
                <div className="grid gap-3 p-4">
                  <div className="flex items-center gap-2">
                    <div className="min-w-0 flex-1">{prep ? <Editable prep value={item.title} onChange={(v) => onItem(item.id, { title: v })} placeholder="Name" className="text-[15px] font-semibold" /> : <p className="truncate text-[15px] font-semibold">{item.title}</p>}</div>
                    {del(item.id)}
                  </div>
                  {prep && <Editable prep value={item.tag ?? ""} onChange={(v) => onItem(item.id, { tag: v })} placeholder="Etikett, z. B. Unser Favorit" className="text-[12.5px]" />}
                  <Segmented item={item} labels={labels} onPick={(p) => onPick(item, p)} full />
                  <Note value={item.note} onChange={(v) => onItem(item.id, { note: v })} />
                </div>
              </li>
            ))}
          </ul>
          {prep && onImport && (
            <Btn variant="outline" size="sm" className="w-fit" onClick={onImport}>
              <Images className="size-3.5" /> Entwürfe aus „Entwürfe“ holen
            </Btn>
          )}
        </>
      )}

      {s.kind === "choice" && (
        <ul className={cn("grid grid-cols-1 gap-4 [&>*]:min-w-0", s.items.length > 1 && "md:grid-cols-2")}>
          {s.items.map((item) => {
            const on = item.pick === "yes";
            const card = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div className="grid min-w-0 flex-1 gap-1">
                    <Editable prep={prep} value={item.title} onChange={(v) => onItem(item.id, { title: v })} placeholder="Option" className="text-[20px] font-semibold leading-snug tracking-[-0.01em]" />
                  </div>
                  {prep ? del(item.id) : <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-full border-2", on ? "border-accent bg-accent text-white" : "border-ink/15")}>{on && <Check className="size-4" strokeWidth={3} />}</span>}
                </div>
                {(item.price || prep) && <Editable prep={prep} value={item.price ?? ""} onChange={(v) => onItem(item.id, { price: v })} placeholder="Preis (optional)" className="text-[34px] font-semibold leading-none tracking-[-0.03em]" />}
                {prep ? <Editable prep value={item.text} onChange={(v) => onItem(item.id, { text: v })} placeholder="Was dafür spricht – Zeilen mit „– “ werden zur Liste" className="text-[14px]" multiline /> : item.text && <Lines text={item.text} />}
              </>
            );
            return (
              <li key={item.id} className="grid gap-2">
                {prep ? (
                  <div className="grid gap-3 rounded-[20px] border-2 border-ink/[0.08] bg-white p-5">{card}</div>
                ) : (
                  <button type="button" aria-pressed={on} onClick={() => onPick(item, on ? "" : "yes")} className={cn("grid h-full gap-3 rounded-[20px] border-2 bg-white p-5 text-left transition-[border-color,box-shadow]", on ? "border-accent shadow-[0_18px_40px_-24px_rgb(104_101_255)]" : "border-ink/[0.08] hover:border-ink/20")}>
                    {card}
                    <span className={cn("mt-1 text-[13px] font-semibold", on ? "text-accent-ink" : "text-faint")}>{on ? "Das nehmen wir" : "Antippen zum Auswählen"}</span>
                  </button>
                )}
                <Note value={item.note} onChange={(v) => onItem(item.id, { note: v })} />
              </li>
            );
          })}
        </ul>
      )}

      {s.kind === "list" && (
        <ul className="divide-y divide-ink/[0.06] overflow-hidden rounded-[20px] bg-white ring-1 ring-ink/[0.08]">
          {s.items.map((item) => (
            <li key={item.id} className={cn("flex flex-col gap-3 px-4 py-3.5 transition-colors sm:flex-row sm:items-center sm:px-5", item.pick === "yes" && "bg-emerald-50/50", item.pick === "no" && "opacity-55")}>
              <div className="grid min-w-0 flex-1 gap-0.5">
                <div className="flex items-start gap-2">
                  <div className="grid min-w-0 flex-1 gap-0.5">
                    <Editable prep={prep} value={item.title} onChange={(v) => onItem(item.id, { title: v })} placeholder="Punkt" className="text-[15.5px] font-semibold" />
                    <Editable prep={prep} value={item.text} onChange={(v) => onItem(item.id, { text: v })} placeholder="Kurz erklärt (optional)" className="text-[13.5px] text-muted" />
                  </div>
                  {del(item.id)}
                </div>
                <div className="mt-1">
                  <Note value={item.note} onChange={(v) => onItem(item.id, { note: v })} />
                </div>
              </div>
              <Segmented item={item} labels={labels} onPick={(p) => onPick(item, p)} />
            </li>
          ))}
        </ul>
      )}

      {prep && s.kind !== "designs" && (
        <Btn variant="outline" size="sm" className="w-fit" onClick={addItem}>
          <Plus className="size-3.5" /> {s.kind === "choice" ? "Option" : "Punkt"}
        </Btn>
      )}

      <div className="rounded-[16px] bg-amber-50/60 p-1">
        <label htmlFor={`notes-${s.id}`} className="block px-3 pt-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-amber-800/70">
          Notizen zu diesem Thema
        </label>
        <textarea
          id={`notes-${s.id}`}
          value={s.notes}
          onChange={(e) => onSection((x) => ({ ...x, notes: e.target.value }))}
          rows={Math.max(2, s.notes.split("\n").length)}
          placeholder="Was er sagt, was ihm wichtig ist …"
          className="block w-full resize-y rounded-[12px] bg-transparent px-3 py-2 text-[14.5px] leading-relaxed placeholder:text-faint/70 focus:bg-white focus:outline-none"
        />
      </div>
    </section>
  );
}

function AddSection({ onAdd }: { onAdd: (kind: SectionKind) => void }) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-2 rounded-[16px] border border-dashed border-ink/15 p-4">
      <span className="mr-1 text-[14px] text-muted">Neues Thema:</span>
      <Btn variant="outline" size="sm" onClick={() => onAdd("list")}>
        <Plus className="size-3.5" /> Punkte
      </Btn>
      <Btn variant="outline" size="sm" onClick={() => onAdd("choice")}>
        <Plus className="size-3.5" /> Eins wählen
      </Btn>
      <Btn variant="outline" size="sm" onClick={() => onAdd("designs")}>
        <Plus className="size-3.5" /> Entwürfe
      </Btn>
    </div>
  );
}

// ---------------------------------------------------------------- what we take – live

function Choice({ doc, onJump }: { doc: MeetingDoc; onJump: (n: number) => void }) {
  const price = doc.sections.flatMap((s) => (s.kind === "choice" ? s.items.filter((i) => i.pick === "yes" && i.price) : []))[0];
  const groups = doc.sections
    .map((s, n) => ({ s, n, chosen: s.labels ? [] : s.items.filter((i) => i.pick === "yes"), open: s.items.filter((i) => i.pick === "maybe") }))
    .filter((g) => g.chosen.length || g.open.length);
  return (
    <div className="overflow-hidden rounded-[20px] bg-white ring-1 ring-ink/[0.08]">
      <div className="bg-ink px-5 py-4 text-white">
        <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-white/55">Unsere Auswahl</p>
        {price ? (
          <p className="mt-1 text-[30px] font-semibold leading-tight tracking-[-0.02em] tabular-nums">
            {price.price} <span className="text-[14px] font-medium text-white/65">{price.title}</span>
          </p>
        ) : (
          <p className="mt-1 text-[14px] text-white/75">Füllt sich, während ihr entscheidet.</p>
        )}
      </div>
      <div className="grid gap-4 p-5">
        {groups.map(({ s, n, chosen, open }) => (
          <button key={s.id} type="button" onClick={() => onJump(n)} className="grid gap-1.5 rounded-[10px] text-left hover:bg-ink/[0.02]">
            <span className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-faint">{s.title}</span>
            {chosen.map((i) => (
              <span key={i.id} className="flex gap-2 text-[14px] leading-snug">
                <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" strokeWidth={3} aria-hidden="true" />
                <span className="min-w-0">{i.title}</span>
              </span>
            ))}
            {open.length > 0 && (
              <span className="text-[13px] leading-snug text-amber-700">
                {labelsOf(s)[1]}: {open.map((i) => i.title).join(", ")}
              </span>
            )}
          </button>
        ))}
        {!groups.length && <p className="text-[14px] text-muted">Noch nichts gewählt.</p>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- the result: what was decided, next steps, text to send

function Result({ title, doc, onTodos, onJump }: { title: string; doc: MeetingDoc; onTodos: (t: Todo[]) => void; onJump: (n: number) => void }) {
  const text = summaryText(title, doc);
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // the text stays selectable in the summary below
    }
  }
  const undecided = doc.sections.map((s, n) => ({ s, n, left: s.kind === "choice" ? (s.items.some((i) => i.pick === "yes") ? 0 : 1) : s.items.filter((i) => !i.pick).length })).filter((x) => x.left > 0);

  return (
    <section className="grid gap-6">
      <header className="grid gap-1.5">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-faint">Zum Schluss</p>
        <h2 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] sm:text-[32px]">Das haben wir entschieden</h2>
      </header>

      {undecided.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-[14px] bg-amber-50 px-4 py-3 text-[14px]">
          <span className="text-amber-900">Noch offen:</span>
          {undecided.map(({ s, n, left }) => (
            <button key={s.id} type="button" onClick={() => onJump(n)} className="rounded-full bg-white px-3 py-1 text-[13px] font-medium text-amber-900 ring-1 ring-amber-200 hover:ring-amber-400">
              {s.title}
              {s.kind !== "choice" && ` · ${left}`}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 [&>*]:min-w-0">
        {doc.sections.map((s, n) => {
          const [yes, maybe, no] = labelsOf(s);
          const by = (p: Pick) => s.items.filter((i) => i.pick === p);
          const rows: [string, Item[], string][] = [
            [s.kind === "choice" ? "Gewählt" : yes, by("yes"), "text-emerald-700"],
            [maybe, by("maybe"), "text-amber-700"],
            [no, s.kind === "choice" ? [] : by("no"), "text-faint"],
          ];
          return (
            <button key={s.id} type="button" onClick={() => onJump(n)} className="grid content-start gap-2.5 rounded-[18px] bg-white p-5 text-left ring-1 ring-ink/[0.08] hover:ring-ink/20">
              <span className="text-[15px] font-semibold">{s.title}</span>
              {rows.every(([, list]) => !list.length) && <span className="text-[13.5px] text-faint">Noch nichts entschieden</span>}
              {rows.map(([label, list, tone]) =>
                list.length ? (
                  <span key={label} className="grid gap-0.5">
                    <span className={cn("text-[11.5px] font-semibold uppercase tracking-[0.08em]", tone)}>{label}</span>
                    <span className="text-[14px] leading-snug">{list.map((i) => i.title + (i.price ? ` · ${i.price}` : "")).join(", ")}</span>
                  </span>
                ) : null,
              )}
              {s.notes.trim() && <span className="whitespace-pre-line rounded-[10px] bg-amber-50/70 px-3 py-2 text-[13px] text-ink/80">{s.notes.trim()}</span>}
            </button>
          );
        })}
      </div>

      <Todos todos={doc.todos} onChange={onTodos} />

      <div className="grid gap-3 rounded-[20px] bg-ink/[0.03] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[15px] font-semibold">Text zum Schicken</p>
            <p className="text-[13.5px] text-muted">Per WhatsApp oder E-Mail an den Kunden.</p>
          </div>
          <Btn onClick={copy}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />} {copied ? "Kopiert" : "Text kopieren"}
          </Btn>
        </div>
        <pre className="max-h-[320px] overflow-auto whitespace-pre-wrap rounded-[12px] bg-white p-4 font-sans text-[13.5px] leading-relaxed ring-1 ring-ink/[0.06]">{text}</pre>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- next steps

function Todos({ todos, onChange }: { todos: Todo[]; onChange: (t: Todo[]) => void }) {
  const set = (id: string, patch: Partial<Todo>) => onChange(todos.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  return (
    <div className="grid gap-3 rounded-[20px] bg-white p-5 ring-1 ring-ink/[0.08]">
      <div>
        <p className="text-[15px] font-semibold">Nächste Schritte</p>
        <p className="text-[13.5px] text-muted">Wer macht was?</p>
      </div>
      {todos.length > 0 && (
        <ul className="grid gap-2">
          {todos.map((t) => (
            <li key={t.id} className="flex items-center gap-2">
              <input type="checkbox" checked={t.done} onChange={() => set(t.id, { done: !t.done })} className="size-[18px] shrink-0 accent-[var(--color-accent)]" aria-label="Erledigt" />
              <input value={t.text} onChange={(e) => set(t.id, { text: e.target.value })} placeholder="z. B. Logo als Datei schicken" aria-label="Schritt" className={cn("h-10 min-w-0 flex-1 rounded-[10px] border border-ink/10 bg-white px-3 text-[14.5px] focus:border-accent focus:outline-none", t.done && "text-faint line-through")} />
              <button type="button" onClick={() => set(t.id, { who: t.who === "Ich" ? "Kunde" : "Ich" })} className={cn("h-10 w-[72px] shrink-0 rounded-[10px] text-[13px] font-medium", t.who === "Ich" ? "bg-accent-soft text-accent-ink" : "bg-amber-50 text-amber-800")} title="Wer macht es? Antippen zum Wechseln">
                {t.who}
              </button>
              <button type="button" onClick={() => onChange(todos.filter((x) => x.id !== t.id))} className="flex size-10 shrink-0 items-center justify-center rounded-[10px] text-faint hover:bg-red-50 hover:text-red-600" aria-label="Schritt löschen">
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap gap-2">
        <Btn variant="outline" size="sm" onClick={() => onChange([...todos, { id: uid(), text: "", who: "Ich", done: false }])}>
          <Plus className="size-3.5" /> Für mich
        </Btn>
        <Btn variant="outline" size="sm" onClick={() => onChange([...todos, { id: uid(), text: "", who: "Kunde", done: false }])}>
          <Plus className="size-3.5" /> Für den Kunden
        </Btn>
      </div>
    </div>
  );
}
