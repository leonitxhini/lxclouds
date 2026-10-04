import { ArrowLeft, Check, Copy, Images, MessagesSquare, Plus, Trash2, X } from "lucide-react";
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

export function MeetingPage({ id }: { id: number }) {
  const { data, error } = useLoad<{ talk: Row }>(`/talks/${id}`);
  const row = data?.talk ?? null;
  const [doc, setDoc] = useState<MeetingDoc | null>(null);
  const [title, setTitle] = useState("");
  const [prep, setPrep] = useState(() => new URLSearchParams(window.location.search).has("vorbereiten"));
  const [summary, setSummary] = useState(false);
  const [zoom, setZoom] = useState<Item | null>(null);
  const toast = useToast();
  const { save, state, rename } = useAutosave(id, row);

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

      <Link href="/besprechungen" className="mb-4 inline-flex items-center gap-1.5 text-[13.5px] text-muted hover:text-ink">
        <ArrowLeft className="size-4" /> Besprechungen
      </Link>

      <header className="mb-8 grid gap-4 rounded-[24px] bg-ink px-6 py-7 text-white sm:px-8 sm:py-9">
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-white/55">{row.client_name ?? "Besprechung"}</p>
        {prep ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => title.trim() && title !== row.title && rename(title.trim())}
            aria-label="Titel"
            className="w-full rounded-[10px] bg-white/10 px-2 py-1 text-[28px] font-semibold leading-tight tracking-[-0.02em] outline-none sm:text-[38px]"
          />
        ) : (
          <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-balance sm:text-[38px]">{title}</h1>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-full bg-white/10 p-1" role="group" aria-label="Ansicht">
            {[
              [true, "Vorbereiten"],
              [false, "Mit dem Kunden"],
            ].map(([value, label]) => (
              <button key={String(label)} type="button" aria-pressed={prep === value} onClick={() => setPrep(value as boolean)} className={cn("rounded-full px-4 py-1.5 text-[13.5px] font-medium", prep === value ? "bg-white text-ink" : "text-white/75 hover:text-white")}>
                {label as string}
              </button>
            ))}
          </div>
          <span className="text-[13.5px] text-white/60 tabular-nums">
            {decided} von {total} Punkten entschieden · {state === "saving" ? "speichert …" : state === "saved" ? "gespeichert" : "nicht gespeichert"}
          </span>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid min-w-0 gap-10 [&>*]:min-w-0">
          {doc.sections.map((s, n) => (
            <SectionBlock
              key={s.id}
              section={s}
              index={n}
              prep={prep}
              onSection={(fn) => setSection(s.id, fn)}
              onItem={(iid, patch) => setItem(s.id, iid, patch)}
              onPick={(item, pick) => choose(s, item, pick)}
              onRemove={() => change((d) => ({ ...d, sections: d.sections.filter((x) => x.id !== s.id) }))}
              onImport={row.client_id ? () => importDesigns(s) : undefined}
              onZoom={setZoom}
            />
          ))}
          {prep && <AddSection onAdd={(kind) => change((d) => ({ ...d, sections: [...d.sections, blankSection(kind)] }))} />}
          <Todos todos={doc.todos} onChange={(todos) => change((d) => ({ ...d, todos }))} />
        </div>

        <aside className="min-w-0">
          <div className="sticky top-6">
            <Choice doc={doc} onSummary={() => setSummary(true)} />
          </div>
        </aside>
      </div>

      <Modal open={summary} onClose={() => setSummary(false)} title="Zusammenfassung" wide>
        <SummaryText text={summaryText(title, doc)} />
      </Modal>
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

// ---------------------------------------------------------------- one section

const pickTone: Record<Exclude<Pick, "">, string> = {
  yes: "border-emerald-500 bg-emerald-500 text-white",
  maybe: "border-amber-400 bg-amber-400 text-black",
  no: "border-ink/70 bg-ink/70 text-white",
};

function PickButtons({ item, labels, onPick, small }: { item: Item; labels: [string, string, string]; onPick: (p: Pick) => void; small?: boolean }) {
  const picks: Exclude<Pick, "">[] = ["yes", "maybe", "no"];
  return (
    <div className="flex gap-1.5">
      {picks.map((p, i) => (
        <button key={p} type="button" aria-pressed={item.pick === p} onClick={() => onPick(item.pick === p ? "" : p)} className={cn("flex-1 rounded-full border font-medium transition-colors", small ? "h-8 text-[12.5px]" : "h-9 text-[13.5px]", item.pick === p ? pickTone[p] : "border-ink/12 bg-white text-ink/70 hover:border-ink/30")}>
          {item.pick === p && p === "yes" && <Check className="-mt-0.5 mr-1 inline size-3.5" aria-hidden="true" />}
          {labels[i]}
        </button>
      ))}
    </div>
  );
}

/** Text that is plain while talking and editable while preparing. */
function Editable({ prep, value, onChange, placeholder, className, multiline }: { prep: boolean; value: string; onChange: (v: string) => void; placeholder: string; className?: string; multiline?: boolean }) {
  if (!prep) return value ? <span className={className}>{value}</span> : null;
  const base = cn("block w-full rounded-[8px] border border-dashed border-ink/15 bg-white/60 px-2 py-1 outline-none focus:border-accent focus:bg-white", className);
  return multiline ? <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={2} className={cn(base, "resize-y")} /> : <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={base} />;
}

function NoteField({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const [open, setOpen] = useState(!!value);
  if (!open)
    return (
      <button type="button" onClick={() => setOpen(true)} className="w-fit text-[12.5px] font-medium text-faint hover:text-accent-ink">
        + Notiz
      </button>
    );
  return <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={label} aria-label={label} autoFocus={!value} className="h-9 w-full rounded-[10px] border border-ink/10 bg-white px-2.5 text-[13.5px] placeholder:text-faint/70 focus:border-accent focus:outline-none" />;
}

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
    <section aria-labelledby={`sec-${s.id}`}>
      <div className="mb-4 flex items-start gap-3">
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[14px] font-semibold text-accent-ink tabular-nums">{index + 1}</span>
        <div className="grid min-w-0 flex-1 gap-1">
          {prep ? (
            <Editable prep value={s.title} onChange={(v) => onSection((x) => ({ ...x, title: v }))} placeholder="Überschrift" className="text-[22px] font-semibold tracking-[-0.015em]" />
          ) : (
            <h2 id={`sec-${s.id}`} className="text-[22px] font-semibold leading-tight tracking-[-0.015em]">
              {s.title}
            </h2>
          )}
          <Editable prep={prep} value={s.intro} onChange={(v) => onSection((x) => ({ ...x, intro: v }))} placeholder="Frage an den Kunden (optional)" className="text-[15px] text-muted" />
        </div>
        {prep && (
          <button type="button" onClick={onRemove} className="flex size-9 shrink-0 items-center justify-center rounded-full text-faint hover:bg-red-50 hover:text-red-600" aria-label="Bereich entfernen">
            <Trash2 className="size-4" />
          </button>
        )}
      </div>

      {s.kind === "designs" && (
        <>
          {s.items.length === 0 && <p className="rounded-[14px] bg-ink/[0.03] px-4 py-6 text-center text-[14px] text-muted">Noch keine Entwürfe drin.</p>}
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 [&>*]:min-w-0">
            {s.items.map((item) => (
              <li key={item.id} className={cn("overflow-hidden rounded-[18px] border bg-white transition-shadow", item.pick === "yes" ? "border-emerald-500 shadow-[0_0_0_2px_rgb(16_185_129)]" : item.pick === "no" ? "border-ink/[0.08] opacity-60" : "border-ink/[0.08]")}>
                <button type="button" onClick={() => onZoom(item)} className="relative block w-full bg-ink/[0.04]" aria-label={`${item.title} groß ansehen`}>
                  {item.image && <img src={imageUrl(item.image)} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover object-top" />}
                  {item.tag && <span className="absolute left-3 top-3 rounded-full bg-ink px-2.5 py-1 text-[11.5px] font-semibold text-white">{item.tag}</span>}
                </button>
                <div className="grid gap-2.5 p-3.5">
                  <div className="flex items-center gap-2">
                    <div className="min-w-0 flex-1">
                      {prep ? <Editable prep value={item.title} onChange={(v) => onItem(item.id, { title: v })} placeholder="Name" className="text-[14.5px] font-medium" /> : <p className="truncate text-[14.5px] font-medium">{item.title}</p>}
                    </div>
                    {del(item.id)}
                  </div>
                  {prep && <Editable prep value={item.tag ?? ""} onChange={(v) => onItem(item.id, { tag: v })} placeholder="Etikett, z. B. Unser Favorit" className="text-[12.5px]" />}
                  <PickButtons item={item} labels={labels} onPick={(p) => onPick(item, p)} small />
                  <NoteField value={item.note} onChange={(v) => onItem(item.id, { note: v })} label="Was er dazu sagt" />
                </div>
              </li>
            ))}
          </ul>
          {prep && onImport && (
            <Btn variant="outline" size="sm" className="mt-3" onClick={onImport}>
              <Images className="size-3.5" /> Entwürfe aus „Entwürfe“ holen
            </Btn>
          )}
        </>
      )}

      {s.kind === "choice" && (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 [&>*]:min-w-0">
          {s.items.map((item) => {
            const on = item.pick === "yes";
            return (
              <li key={item.id}>
                <div className={cn("flex h-full flex-col gap-3 rounded-[18px] border-2 bg-white p-5 transition-colors", on ? "border-accent shadow-[0_10px_30px_-18px_rgb(104_101_255)]" : "border-ink/[0.08]")}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid min-w-0 flex-1 gap-1">
                      <Editable prep={prep} value={item.title} onChange={(v) => onItem(item.id, { title: v })} placeholder="Option" className="text-[19px] font-semibold leading-snug" />
                      <Editable prep={prep} value={item.text} onChange={(v) => onItem(item.id, { text: v })} placeholder="Kurz: was dafür spricht" className="whitespace-pre-line text-[14.5px] leading-relaxed text-muted" multiline />
                    </div>
                    {del(item.id)}
                  </div>
                  {(item.price || prep) && <Editable prep={prep} value={item.price ?? ""} onChange={(v) => onItem(item.id, { price: v })} placeholder="Preis (optional)" className="text-[28px] font-semibold tracking-[-0.02em]" />}
                  <div className="mt-auto grid gap-2">
                    <button type="button" aria-pressed={on} onClick={() => onPick(item, on ? "" : "yes")} className={cn("h-10 rounded-full text-[14px] font-semibold", on ? "bg-accent text-white" : "border border-ink/12 text-ink/80 hover:border-accent/50")}>
                      {on ? (
                        <>
                          <Check className="-mt-0.5 mr-1.5 inline size-4" aria-hidden="true" />
                          Das nehmen wir
                        </>
                      ) : (
                        "Das nehmen"
                      )}
                    </button>
                    <NoteField value={item.note} onChange={(v) => onItem(item.id, { note: v })} label="Was er dazu sagt" />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {s.kind === "list" && (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 [&>*]:min-w-0">
          {s.items.map((item) => (
            <li key={item.id} className={cn("grid gap-3 rounded-[16px] border bg-white p-4", item.pick === "yes" ? "border-emerald-500/60" : "border-ink/[0.08]", item.pick === "no" && "opacity-60")}>
              <div className="flex items-start gap-2">
                <div className="grid min-w-0 flex-1 gap-0.5">
                  <Editable prep={prep} value={item.title} onChange={(v) => onItem(item.id, { title: v })} placeholder="Punkt" className="text-[15.5px] font-semibold" />
                  <Editable prep={prep} value={item.text} onChange={(v) => onItem(item.id, { text: v })} placeholder="Kurz erklärt (optional)" className="text-[13.5px] text-muted" />
                </div>
                {del(item.id)}
              </div>
              <PickButtons item={item} labels={labels} onPick={(p) => onPick(item, p)} small />
              <NoteField value={item.note} onChange={(v) => onItem(item.id, { note: v })} label="Notiz" />
            </li>
          ))}
        </ul>
      )}

      {prep && s.kind !== "designs" && (
        <Btn variant="outline" size="sm" className="mt-3" onClick={addItem}>
          <Plus className="size-3.5" /> {s.kind === "choice" ? "Option" : "Punkt"}
        </Btn>
      )}

      <label htmlFor={`notes-${s.id}`} className="sr-only">
        Notizen zu {s.title}
      </label>
      <textarea
        id={`notes-${s.id}`}
        value={s.notes}
        onChange={(e) => onSection((x) => ({ ...x, notes: e.target.value }))}
        rows={s.notes ? Math.max(2, s.notes.split("\n").length) : 1}
        placeholder="Was er dazu sagt …"
        className="mt-3 block w-full resize-y rounded-[12px] border border-ink/[0.08] bg-white/70 px-3.5 py-2.5 text-[14.5px] leading-relaxed placeholder:text-faint/70 focus:border-accent focus:bg-white focus:outline-none"
      />
    </section>
  );
}

function AddSection({ onAdd }: { onAdd: (kind: SectionKind) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-[16px] border border-dashed border-ink/15 p-4">
      <span className="mr-1 text-[14px] text-muted">Neuer Bereich:</span>
      <Btn variant="outline" size="sm" onClick={() => onAdd("list")}>
        <Plus className="size-3.5" /> Punkte zum Abhaken
      </Btn>
      <Btn variant="outline" size="sm" onClick={() => onAdd("choice")}>
        <Plus className="size-3.5" /> Eins von mehreren wählen
      </Btn>
      <Btn variant="outline" size="sm" onClick={() => onAdd("designs")}>
        <Plus className="size-3.5" /> Entwürfe
      </Btn>
    </div>
  );
}

// ---------------------------------------------------------------- what we take – live

function Choice({ doc, onSummary }: { doc: MeetingDoc; onSummary: () => void }) {
  const price = doc.sections.flatMap((s) => (s.kind === "choice" ? s.items.filter((i) => i.pick === "yes" && i.price) : []))[0];
  return (
    <Card className="overflow-hidden">
      <div className="bg-accent px-5 py-4 text-white">
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-white/70">Unsere Auswahl</p>
        {price ? (
          <p className="mt-1 text-[28px] font-semibold leading-tight tracking-[-0.02em]">
            {price.price} <span className="text-[15px] font-medium text-white/80">· {price.title}</span>
          </p>
        ) : (
          <p className="mt-1 text-[15px] text-white/85">Wächst mit, während ihr entscheidet.</p>
        )}
      </div>
      <div className="grid gap-4 p-5">
        {doc.sections.map((s) => {
          const maybe = labelsOf(s)[1];
          // for "what we need from you" the open points matter, not the ones already there
          const chosen = s.labels ? [] : s.items.filter((i) => i.pick === "yes");
          const open = s.items.filter((i) => i.pick === "maybe");
          if (!chosen.length && !open.length) return null;
          return (
            <div key={s.id} className="grid gap-1.5">
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-faint">{s.title}</p>
              {chosen.map((i) => (
                <p key={i.id} className="flex gap-2 text-[14px] leading-snug">
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" strokeWidth={3} aria-hidden="true" />
                  <span className="min-w-0">{i.title}</span>
                </p>
              ))}
              {open.length > 0 && (
                <p className="text-[13px] text-amber-700">
                  {maybe}: {open.map((i) => i.title).join(", ")}
                </p>
              )}
            </div>
          );
        })}
        {!doc.sections.some((s) => s.items.some((i) => i.pick === "yes" || i.pick === "maybe")) && <p className="text-[14px] text-muted">Noch nichts gewählt. Tippt bei jedem Punkt an, was ihr nehmt.</p>}
        <Btn variant="outline" onClick={onSummary}>
          Zusammenfassung
        </Btn>
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------- next steps

function Todos({ todos, onChange }: { todos: Todo[]; onChange: (t: Todo[]) => void }) {
  const set = (id: string, patch: Partial<Todo>) => onChange(todos.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  return (
    <section aria-labelledby="sec-todos">
      <h2 id="sec-todos" className="text-[22px] font-semibold tracking-[-0.015em]">
        Nächste Schritte
      </h2>
      <p className="mt-1 text-[15px] text-muted">Wer macht was?</p>
      <ul className="mt-4 grid gap-2">
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
      <div className="mt-3 flex flex-wrap gap-2">
        <Btn variant="outline" size="sm" onClick={() => onChange([...todos, { id: uid(), text: "", who: "Ich", done: false }])}>
          <Plus className="size-3.5" /> Für mich
        </Btn>
        <Btn variant="outline" size="sm" onClick={() => onChange([...todos, { id: uid(), text: "", who: "Kunde", done: false }])}>
          <Plus className="size-3.5" /> Für den Kunden
        </Btn>
      </div>
    </section>
  );
}

function SummaryText({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // the text stays selectable
    }
  }
  return (
    <div className="grid gap-4">
      <p className="text-[14px] text-muted">Alles, was ihr entschieden habt – zum Schicken an den Kunden.</p>
      <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap rounded-[12px] bg-ink/[0.04] p-4 font-sans text-[14px] leading-relaxed">{text}</pre>
      <div>
        <Btn onClick={copy}>
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />} {copied ? "Kopiert" : "Text kopieren"}
        </Btn>
      </div>
    </div>
  );
}
