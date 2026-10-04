import { ArrowLeft, Check, Copy, MessagesSquare, Plus, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { imageUrl } from "@/demo/edit";
import { cn } from "@/lib/utils";
import { api, ApiError, formatDate, useLoad, type BoardItem, type Client } from "../api";
import { answerOf, emptyTalk, filled, summaryText, todoId, topics, type Answer, type DesignNote, type TalkDoc, type Todo, type Topic } from "../talk";
import { Btn, Card, Empty, Field, Input, Loading, Modal, PageHeader, Select, useToast } from "../ui";

type TalkSummary = { id: number; title: string; client_id: number | null; client_name: string | null; created_at: string; updated_at: string };
type TalkRow = TalkSummary & { doc: TalkDoc };

// ---------------------------------------------------------------- list

export function Talks() {
  const { data, error } = useLoad<{ talks: TalkSummary[] }>("/talks");
  const [creating, setCreating] = useState(false);
  if (error) return <p className="py-20 text-center text-red-600">{error.message}</p>;
  if (!data) return <Loading />;
  return (
    <>
      <PageHeader title="Gespräche" sub="Du sitzt mit dem Kunden zusammen und schreibst mit: was er braucht, wie er es will, was er von den Entwürfen hält.">
        <Btn variant="accent" onClick={() => setCreating(true)}>
          <Plus className="size-4" aria-hidden="true" />
          Neues Gespräch
        </Btn>
      </PageHeader>
      {data.talks.length === 0 ? (
        <Empty title="Noch kein Gespräch" text="Leg ein Gespräch an, bevor du zum Kunden gehst – die Themen und Fragen sind schon drin.">
          <Btn variant="accent" onClick={() => setCreating(true)}>
            Erstes Gespräch anlegen
          </Btn>
        </Empty>
      ) : (
        <Card className="divide-y divide-ink/[0.06]">
          {data.talks.map((t) => (
            <Link key={t.id} href={`/gespraeche/${t.id}`} className="group flex items-center justify-between gap-3 px-5 py-3.5">
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
      <NewTalkModal open={creating} onClose={() => setCreating(false)} />
    </>
  );
}

export function NewTalkModal({ open, onClose, client }: { open: boolean; onClose: () => void; client?: Client | null }) {
  const [, navigate] = useLocation();
  const toast = useToast();
  const clients = useLoad<{ clients: Client[] }>(open ? "/clients" : null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const clientId = Number(f.get("client")) || client?.id || null;
    const name = clients.data?.clients.find((c) => c.id === clientId)?.name ?? client?.name;
    const title = String(f.get("title") ?? "").trim() || `Gespräch${name ? ` mit ${name}` : ""} – ${new Date().toLocaleDateString("de-DE")}`;
    setBusy(true);
    try {
      const { id } = await api<{ id: number }>("/talks", { method: "POST", body: { title, client_id: clientId, doc: emptyTalk() } });
      onClose();
      navigate(`/gespraeche/${id}`);
    } catch (err) {
      toast((err as ApiError).message, "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Neues Gespräch">
      <form onSubmit={submit} className="grid gap-4">
        <Field label="Kunde">
          <Select name="client" defaultValue={client ? String(client.id) : ""}>
            <option value="">– ohne Kunde –</option>
            {clients.data?.clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Titel" hint="Leer lassen: „Gespräch mit … – Datum“">
          <Input name="title" placeholder="z. B. Erstgespräch Website" />
        </Field>
        <Btn type="submit" variant="accent" disabled={busy}>
          Gespräch anlegen
        </Btn>
      </form>
    </Modal>
  );
}

// ---------------------------------------------------------------- the sheet

function useAutosave(id: number, initial: TalkRow | null) {
  const toast = useToast();
  const latest = useRef<TalkDoc | null>(null);
  const base = useRef<string | null>(null);
  const timer = useRef(0);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const [state, setState] = useState<"saved" | "saving" | "stale">("saved");

  useEffect(() => {
    if (initial) {
      latest.current = initial.doc;
      base.current = initial.updated_at;
    }
  }, [initial]);

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
    (doc: TalkDoc) => {
      latest.current = doc;
      setState((s) => (s === "stale" ? s : "saving"));
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(flush, 600);
    },
    [flush],
  );

  // a pending change is sent when the tab closes
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

export function TalkSheet({ id }: { id: number }) {
  const { data, error } = useLoad<{ talk: TalkRow }>(`/talks/${id}`);
  const talk = data?.talk ?? null;
  const [doc, setDoc] = useState<TalkDoc | null>(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState(false);
  const [designs, setDesigns] = useState<BoardItem[]>([]);
  const { save, state, rename } = useAutosave(id, talk);
  // the title wraps instead of being cut off on a phone
  const titleRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [title, doc]);

  useEffect(() => {
    if (!talk) return;
    setDoc({ ...emptyTalk(), ...talk.doc });
    setTitle(talk.title);
  }, [talk]);

  // the client's drafts, with the reactions they already carry
  useEffect(() => {
    if (!talk?.client_id) return;
    let alive = true;
    api<{ boards: { id: number }[] }>(`/clients/${talk.client_id}`)
      .then(async ({ boards }) => {
        const lists = await Promise.all(boards.map((b) => api<{ items: BoardItem[] }>(`/boards/${b.id}`).then((r) => r.items)));
        if (alive) setDesigns(lists.flat());
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [talk?.client_id]);

  const change = useCallback(
    (next: (d: TalkDoc) => TalkDoc) =>
      setDoc((d) => {
        if (!d) return d;
        const n = next(d);
        save(n);
        return n;
      }),
    [save],
  );
  const setAnswer = (key: string, a: Answer) => change((d) => ({ ...d, answers: { ...d.answers, [key]: a } }));

  if (error) return <p className="py-20 text-center text-red-600">{error.message}</p>;
  if (!talk || !doc) return <Loading />;

  const designNotes: DesignNote[] = designs.map((d) => ({ title: d.group_name ? `${d.group_name} · ${d.title}` : d.title, status: d.status, notes: d.notes }));
  const done = topics.filter((t) => filled(answerOf(doc, t.key))).length;

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1080px]">
      {state === "stale" && (
        <div className="sticky top-0 z-30 mb-4 flex flex-wrap items-center justify-center gap-3 rounded-[12px] bg-amber-400 px-4 py-2.5 text-[14px] font-medium text-black">
          Dieses Gespräch wurde an anderer Stelle geändert – deine letzte Änderung hier ist nicht gespeichert.
          <button type="button" onClick={() => window.location.reload()} className="rounded-full bg-black px-4 py-1.5 text-[13px] font-semibold text-white">
            Neu laden
          </button>
        </div>
      )}

      <Link href="/gespraeche" className="mb-3 inline-flex items-center gap-1.5 text-[13.5px] text-muted hover:text-ink">
        <ArrowLeft className="size-4" /> Gespräche
      </Link>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <label htmlFor="talk-title" className="sr-only">
            Titel
          </label>
          <textarea
            id="talk-title"
            ref={titleRef}
            rows={1}
            value={title}
            onChange={(e) => setTitle(e.target.value.replace(/\n/g, " "))}
            onBlur={() => title.trim() && title !== talk.title && rename(title.trim())}
            className="block w-full resize-none overflow-hidden rounded-[8px] bg-transparent text-[22px] font-semibold leading-tight tracking-[-0.02em] outline-none focus:bg-ink/[0.04] sm:text-[26px]"
          />
          <p className="mt-0.5 text-[13.5px] text-muted">
            {talk.client_name ?? "Ohne Kunde"} · {done} von {topics.length} Themen besprochen · <span className={cn(state === "saving" && "text-faint")}>{state === "saving" ? "speichert …" : state === "saved" ? "gespeichert" : "nicht gespeichert"}</span>
          </p>
        </div>
        <Btn variant="outline" onClick={() => setSummary(true)} className="w-full sm:w-auto">
          Zusammenfassung
        </Btn>
      </div>

      <div className="grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)]">
        <nav aria-label="Themen" className="hidden lg:block">
          <ul className="sticky top-6 grid gap-0.5">
            {[...topics, { key: "schritte", title: "Nächste Schritte" } as Topic].map((t) => {
              const has = t.key === "schritte" ? doc.todos.some((x) => x.text.trim()) : filled(answerOf(doc, t.key));
              return (
                <li key={t.key}>
                  <a href={`#thema-${t.key}`} className="flex items-center gap-2 rounded-[8px] px-2.5 py-1.5 text-[13.5px] text-ink/75 hover:bg-ink/[0.05] hover:text-ink">
                    <span className={cn("size-2 shrink-0 rounded-full", has ? "bg-emerald-500" : "bg-ink/15")} aria-hidden="true" />
                    {t.title}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="grid min-w-0 gap-4 [&>*]:min-w-0">
          {topics.map((t) => (
            <TopicCard key={t.key} topic={t} answer={answerOf(doc, t.key)} onChange={(a) => setAnswer(t.key, a)} designs={t.designs ? designs : undefined} onDesign={(item) => setDesigns((list) => list.map((d) => (d.id === item.id ? item : d)))} />
          ))}
          <Todos todos={doc.todos} onChange={(todos) => change((d) => ({ ...d, todos }))} />
        </div>
      </div>

      <Modal open={summary} onClose={() => setSummary(false)} title="Zusammenfassung" wide>
        <Summary text={summaryText(title, doc, designNotes)} />
      </Modal>
    </div>
  );
}

// ---------------------------------------------------------------- one topic

function TopicCard({ topic, answer, onChange, designs, onDesign }: { topic: Topic; answer: Answer; onChange: (a: Answer) => void; designs?: BoardItem[]; onDesign: (item: BoardItem) => void }) {
  const [extra, setExtra] = useState("");
  const toggle = (chip: string) => onChange({ ...answer, chips: answer.chips.includes(chip) ? answer.chips.filter((c) => c !== chip) : [...answer.chips, chip] });
  const addCustom = (e: FormEvent) => {
    e.preventDefault();
    const v = extra.trim();
    if (!v || answer.custom.includes(v)) return;
    onChange({ ...answer, custom: [...answer.custom, v] });
    setExtra("");
  };
  const chip = "inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3.5 text-[14px] transition-colors";

  return (
    <section id={`thema-${topic.key}`} className="scroll-mt-6">
      <Card className="p-5 sm:p-6">
        <div className="flex items-center gap-2.5">
          <span className={cn("size-2.5 shrink-0 rounded-full", filled(answer) ? "bg-emerald-500" : "bg-ink/15")} aria-hidden="true" />
          <h2 className="text-[18px] font-semibold tracking-[-0.01em]">{topic.title}</h2>
        </div>
        <ul className="mt-2 grid gap-0.5 text-[14px] text-muted">
          {topic.questions.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>

        {designs && <Designs items={designs} onChange={onDesign} />}

        {(topic.chips?.length || answer.custom.length > 0) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {topic.chips?.map((c) => {
              const on = answer.chips.includes(c);
              return (
                <button key={c} type="button" aria-pressed={on} onClick={() => toggle(c)} className={cn(chip, on ? "border-accent bg-accent text-white" : "border-ink/12 bg-white text-ink/80 hover:border-accent/50")}>
                  {on && <Check className="size-3.5" aria-hidden="true" />}
                  {c}
                </button>
              );
            })}
            {answer.custom.map((c) => (
              <span key={c} className={cn(chip, "border-accent bg-accent pr-1.5 text-white")}>
                {c}
                <button type="button" onClick={() => onChange({ ...answer, custom: answer.custom.filter((x) => x !== c) })} className="flex size-6 items-center justify-center rounded-full hover:bg-white/20" aria-label={`${c} entfernen`}>
                  <X className="size-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
        {topic.chips && (
          <form onSubmit={addCustom} className="mt-2 flex max-w-[360px] gap-2">
            <label htmlFor={`extra-${topic.key}`} className="sr-only">
              Eigener Punkt
            </label>
            <Input id={`extra-${topic.key}`} value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="Eigener Punkt …" className="h-9" />
            <Btn type="submit" variant="outline" size="sm" className="h-9" disabled={!extra.trim()}>
              <Plus className="size-3.5" /> Dazu
            </Btn>
          </form>
        )}

        <label htmlFor={`notes-${topic.key}`} className="sr-only">
          Notizen zu {topic.title}
        </label>
        <textarea
          id={`notes-${topic.key}`}
          value={answer.notes}
          onChange={(e) => onChange({ ...answer, notes: e.target.value })}
          rows={Math.max(3, answer.notes.split("\n").length + 1)}
          placeholder="Was er sagt …"
          className="mt-4 block w-full resize-y rounded-[12px] border border-ink/12 bg-white px-3.5 py-3 text-[15px] leading-relaxed placeholder:text-faint/70 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15"
        />
      </Card>
    </section>
  );
}

// ---------------------------------------------------------------- the drafts: what he thinks of each

const reactions = [
  ["favorite", "Gefällt", "border-emerald-500 bg-emerald-500 text-white"],
  ["maybe", "Vielleicht", "border-amber-400 bg-amber-400 text-black"],
  ["out", "Nein", "border-red-500 bg-red-500 text-white"],
] as const;

function Designs({ items, onChange }: { items: BoardItem[]; onChange: (item: BoardItem) => void }) {
  const toast = useToast();
  async function update(item: BoardItem, patch: Partial<BoardItem>) {
    const next = { ...item, ...patch };
    onChange(next);
    try {
      await api(`/board-items/${item.id}`, { method: "PATCH", body: patch });
    } catch (err) {
      onChange(item);
      toast((err as ApiError).message, "error");
    }
  }
  if (!items.length)
    return (
      <p className="mt-4 rounded-[12px] bg-ink/[0.03] px-4 py-3 text-[14px] text-muted">
        Für diesen Kunden gibt es noch keine Entwürfe. Unter{" "}
        <Link href="/entwuerfe" className="text-accent-ink hover:underline">
          Entwürfe
        </Link>{" "}
        anlegen, dann erscheinen sie hier.
      </p>
    );
  return (
    <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 [&>*]:min-w-0">
      {items.map((item) => (
        <li key={item.id} className="overflow-hidden rounded-[14px] border border-ink/[0.08] bg-white">
          <a href={imageUrl(item.image)} target="_blank" rel="noopener noreferrer" className="block bg-ink/[0.04]">
            <img src={imageUrl(item.image)} alt={item.title} loading="lazy" className="aspect-[4/3] w-full object-cover object-top" />
          </a>
          <div className="grid gap-2 p-3">
            <p className="truncate text-[14px] font-medium">{item.group_name ? `${item.group_name} · ${item.title}` : item.title}</p>
            <div className="flex gap-1.5">
              {reactions.map(([status, label, on]) => (
                <button key={status} type="button" aria-pressed={item.status === status} onClick={() => update(item, { status: item.status === status ? "" : status })} className={cn("h-8 flex-1 rounded-full border text-[12.5px] font-medium", item.status === status ? on : "border-ink/12 text-ink/70 hover:border-ink/30")}>
                  {label}
                </button>
              ))}
            </div>
            <DesignNoteInput item={item} onSave={(notes) => update(item, { notes })} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function DesignNoteInput({ item, onSave }: { item: BoardItem; onSave: (notes: string) => void }) {
  const [value, setValue] = useState(item.notes);
  useEffect(() => setValue(item.notes), [item.notes]);
  return (
    <>
      <label htmlFor={`design-note-${item.id}`} className="sr-only">
        Was er dazu sagt
      </label>
      <input id={`design-note-${item.id}`} value={value} onChange={(e) => setValue(e.target.value)} onBlur={() => value !== item.notes && onSave(value)} placeholder="Was er dazu sagt …" className="h-9 w-full rounded-[10px] border border-ink/10 px-2.5 text-[13.5px] placeholder:text-faint/70 focus:border-accent focus:outline-none" />
    </>
  );
}

// ---------------------------------------------------------------- next steps

function Todos({ todos, onChange }: { todos: Todo[]; onChange: (t: Todo[]) => void }) {
  const set = (id: string, patch: Partial<Todo>) => onChange(todos.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  return (
    <section id="thema-schritte" className="scroll-mt-6">
      <Card className="p-5 sm:p-6">
        <div className="flex items-center gap-2.5">
          <span className={cn("size-2.5 shrink-0 rounded-full", todos.some((t) => t.text.trim()) ? "bg-emerald-500" : "bg-ink/15")} aria-hidden="true" />
          <h2 className="text-[18px] font-semibold tracking-[-0.01em]">Nächste Schritte</h2>
        </div>
        <p className="mt-2 text-[14px] text-muted">Wer macht was bis wann?</p>
        <ul className="mt-3 grid gap-2">
          {todos.map((t) => (
            <li key={t.id} className="flex items-center gap-2">
              <input type="checkbox" checked={t.done} onChange={() => set(t.id, { done: !t.done })} className="size-[18px] shrink-0 accent-[var(--color-accent)]" aria-label="Erledigt" />
              <label htmlFor={`todo-${t.id}`} className="sr-only">
                Schritt
              </label>
              <input id={`todo-${t.id}`} value={t.text} onChange={(e) => set(t.id, { text: e.target.value })} placeholder="z. B. Logo als Datei schicken" className={cn("h-10 min-w-0 flex-1 rounded-[10px] border border-ink/10 px-3 text-[14.5px] focus:border-accent focus:outline-none", t.done && "text-faint line-through")} />
              <button type="button" onClick={() => set(t.id, { who: t.who === "Ich" ? "Kunde" : "Ich" })} className={cn("h-10 w-[72px] shrink-0 rounded-[10px] text-[13px] font-medium", t.who === "Ich" ? "bg-accent-soft text-accent-ink" : "bg-amber-50 text-amber-800")} title="Wer macht es? Antippen zum Wechseln">
                {t.who}
              </button>
              <button type="button" onClick={() => onChange(todos.filter((x) => x.id !== t.id))} className="flex size-10 shrink-0 items-center justify-center rounded-[10px] text-faint hover:bg-red-50 hover:text-red-600" aria-label="Schritt löschen">
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-wrap gap-2">
          <Btn variant="outline" size="sm" onClick={() => onChange([...todos, { id: todoId(), text: "", who: "Ich", done: false }])}>
            <Plus className="size-3.5" /> Für mich
          </Btn>
          <Btn variant="outline" size="sm" onClick={() => onChange([...todos, { id: todoId(), text: "", who: "Kunde", done: false }])}>
            <Plus className="size-3.5" /> Für den Kunden
          </Btn>
        </div>
      </Card>
    </section>
  );
}

// ---------------------------------------------------------------- summary

function Summary({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // the text stays selectable below
    }
  }
  return (
    <div className="grid gap-4">
      <p className="text-[14px] text-muted">Alles, was ihr besprochen habt – zum Durchlesen am Ende oder zum Schicken an den Kunden.</p>
      <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap rounded-[12px] bg-ink/[0.04] p-4 font-sans text-[14px] leading-relaxed">{text || "Noch nichts notiert."}</pre>
      <div>
        <Btn onClick={copy} disabled={!text}>
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />} {copied ? "Kopiert" : "Text kopieren"}
        </Btn>
      </div>
    </div>
  );
}

