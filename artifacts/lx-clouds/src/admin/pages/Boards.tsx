import { ArrowLeft, ClipboardList, CircleHelp, Copy, ExternalLink, ImagePlus, MapPin, Play, Plus, Star, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { asset, cn } from "@/lib/utils";
import { api, ApiError, formatDate, itemStatusLabels, uploadImage, useLoad, type Board, type BoardItem, type BoardSummary, type Client, type ItemStatus } from "../api";
import { Presenter } from "../boards/Presenter";
import { Badge, Btn, Card, Empty, Field, Input, Loading, Modal, PageHeader, Select, Spinner, Textarea, useToast } from "../ui";

const src = (url: string) => (url.startsWith("/") ? asset(url) : url);
const statusTone = { favorite: "amber", maybe: "blue", out: "red" } as const;
const statusIcon = { favorite: Star, maybe: CircleHelp, out: X } as const;

// ---------------------------------------------------------------- list
export function Boards() {
  const { data, error } = useLoad<{ boards: BoardSummary[] }>("/boards");
  const clients = useLoad<{ clients: Client[] }>("/clients");
  const [, navigate] = useLocation();
  const toast = useToast();
  const [creating, setCreating] = useState(false);

  if (error) return <p className="py-20 text-center text-red-600">{error.message}</p>;
  if (!data) return <Loading />;

  async function create(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    try {
      const { id } = await api<{ id: number }>("/boards", { method: "POST", body: { title: form.get("title"), client_id: form.get("client_id") || null } });
      navigate(`/entwuerfe/${id}`);
    } catch (err) {
      toast((err as ApiError).message, "error");
    }
  }

  return (
    <>
      <PageHeader title="Entwürfe" sub="Design-Entwürfe als Bilder: dem Kunden zeigen, vergleichen, Änderungen direkt im Bild festhalten.">
        <Btn variant="accent" onClick={() => setCreating(true)}>
          <Plus className="size-4" aria-hidden="true" />
          Neue Entwürfe
        </Btn>
      </PageHeader>

      {data.boards.length === 0 ? (
        <Empty title="Noch keine Entwürfe" text="Lege eine Sammlung an und lade die Design-Bilder hoch, die du dem Kunden zeigen willst.">
          <Btn variant="accent" onClick={() => setCreating(true)}>
            Erste Sammlung anlegen
          </Btn>
        </Empty>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.boards.map((b) => (
            <li key={b.id}>
              <Link href={`/entwuerfe/${b.id}`} className="group block">
                <Card className="overflow-hidden transition-[border-color,box-shadow] duration-200 group-hover:border-accent/30 group-hover:shadow-card">
                  <div className="aspect-[16/10] overflow-hidden bg-ink/[0.05]">
                    {b.cover && <img src={src(b.cover)} alt="" loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]" />}
                  </div>
                  <div className="flex items-center gap-3 p-4">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15.5px] font-semibold">{b.title}</span>
                      <span className="block truncate text-[12.5px] text-faint">
                        {b.client_name ?? "Ohne Kunde"} · {formatDate(b.updated_at, true)}
                      </span>
                    </span>
                    <Badge>{b.items} Bilder</Badge>
                    {b.favorites > 0 && (
                      <Badge tone="amber">
                        <Star className="size-3 fill-current" /> {b.favorites}
                      </Badge>
                    )}
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Modal open={creating} onClose={() => setCreating(false)} title="Neue Entwürfe">
        <form onSubmit={create} className="space-y-4">
          <Field label="Titel">
            <Input name="title" required autoFocus placeholder="z. B. Markenentwürfe" />
          </Field>
          <Field label="Kunde">
            <Select name="client_id" defaultValue="">
              <option value="">Ohne Kunde</option>
              {clients.data?.clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          <div className="flex justify-end gap-2">
            <Btn variant="ghost" onClick={() => setCreating(false)}>
              Abbrechen
            </Btn>
            <Btn type="submit" variant="accent">
              Anlegen
            </Btn>
          </div>
        </form>
      </Modal>
    </>
  );
}

// ---------------------------------------------------------------- one collection
/** Width and height of an image file, read in the browser before the upload. */
async function imageSize(file: File): Promise<{ width: number; height: number } | null> {
  try {
    const bitmap = await createImageBitmap(file);
    const size = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return size;
  } catch {
    return null;
  }
}

/** Everything that was decided, as plain text for the client file or a message. */
function summary(board: Board, items: BoardItem[]) {
  const name = (i: BoardItem) => (i.group_name ? `${i.group_name} · ${i.title}` : i.title);
  const lines = [`Entwürfe „${board.title}" – Stand ${new Date().toLocaleDateString("de-DE")}`];
  for (const status of ["favorite", "maybe", "out"] as const) {
    const list = items.filter((i) => i.status === status);
    if (list.length) lines.push(`${itemStatusLabels[status]}: ${list.map(name).join(", ")}`);
  }
  if (board.notes.trim()) lines.push("", "Allgemein:", board.notes.trim());
  for (const item of items) {
    if (!item.notes.trim() && item.pins.length === 0) continue;
    lines.push("", `${name(item)}${item.status ? ` [${itemStatusLabels[item.status]}]` : ""}`);
    if (item.notes.trim()) lines.push(item.notes.trim());
    item.pins.forEach((pin, n) => lines.push(`  ${n + 1}. ${pin.text.trim() || "(ohne Text)"}${pin.done ? " – erledigt" : ""}`));
  }
  return lines.join("\n");
}

export function BoardDetail({ id }: { id: number }) {
  const { data, error, reload } = useLoad<{ board: Board; items: BoardItem[] }>(`/boards/${id}`);
  const [, navigate] = useLocation();
  const toast = useToast();
  const [board, setBoard] = useState<Board | null>(null);
  const [items, setItems] = useState<BoardItem[]>([]);
  const [showing, setShowing] = useState<number | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [uploading, setUploading] = useState(0);
  const [group, setGroup] = useState("");
  const [unsaved, setUnsaved] = useState(0);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!data) return;
    setBoard(data.board);
    setItems(data.items);
  }, [data]);

  // Changes are shown at once and written shortly after, one request per design.
  const pending = useRef(new Map<number, { timer: number; patch: Partial<BoardItem> }>());
  const send = useCallback(
    async (itemId: number) => {
      const entry = pending.current.get(itemId);
      if (!entry) return;
      pending.current.delete(itemId);
      try {
        await api(`/board-items/${itemId}`, { method: "PATCH", body: entry.patch });
      } catch (err) {
        toast(`Nicht gespeichert: ${(err as ApiError).message}`, "error");
      }
      setUnsaved(pending.current.size);
    },
    [toast],
  );
  const change = useCallback(
    (itemId: number, patch: Partial<BoardItem>) => {
      setItems((list) => list.map((i) => (i.id === itemId ? { ...i, ...patch } : i)));
      const entry = pending.current.get(itemId) ?? { timer: 0, patch: {} };
      window.clearTimeout(entry.timer);
      entry.patch = { ...entry.patch, ...patch };
      entry.timer = window.setTimeout(() => send(itemId), 500);
      pending.current.set(itemId, entry);
      setUnsaved(pending.current.size);
    },
    [send],
  );
  // leaving the page: write what is still waiting
  useEffect(() => {
    const waiting = pending.current;
    const flush = () => {
      for (const [itemId, entry] of waiting) {
        window.clearTimeout(entry.timer);
        void fetch(`/api/board-items/${itemId}`, { method: "PATCH", keepalive: true, headers: { "Content-Type": "application/json", "X-Studio": "1" }, body: JSON.stringify(entry.patch) });
      }
      waiting.clear();
    };
    window.addEventListener("pagehide", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, []);

  const groups = useMemo(() => {
    const map = new Map<string, BoardItem[]>();
    for (const item of items) {
      const key = item.group_name ?? "";
      map.set(key, [...(map.get(key) ?? []), item]);
    }
    return [...map.entries()];
  }, [items]);

  if (error) return <p className="py-20 text-center text-red-600">{error.message}</p>;
  if (!board) return <Loading />;

  async function saveBoard(patch: Partial<Board>) {
    setBoard((b) => (b ? { ...b, ...patch } : b));
    try {
      await api(`/boards/${id}`, { method: "PATCH", body: patch });
    } catch (err) {
      toast((err as ApiError).message, "error");
    }
  }

  async function addFiles(files: FileList | null) {
    if (!files?.length) return;
    const list = [...files].filter((f) => f.type.startsWith("image/"));
    setUploading(list.length);
    for (const file of list) {
      try {
        const size = await imageSize(file);
        const image = await uploadImage(file);
        await api(`/boards/${id}/items`, { method: "POST", body: { title: file.name.replace(/\.[a-z0-9]+$/i, ""), group_name: group.trim() || null, image, ...size } });
      } catch (err) {
        toast(`${file.name}: ${(err as ApiError).message}`, "error");
      }
      setUploading((n) => n - 1);
    }
    if (fileInput.current) fileInput.current.value = "";
    reload();
  }

  async function removeItem(item: BoardItem) {
    if (!window.confirm(`Entwurf „${item.title}" wirklich löschen?`)) return;
    await api(`/board-items/${item.id}`, { method: "DELETE" });
    setItems((list) => list.filter((i) => i.id !== item.id));
  }

  async function removeBoard() {
    if (!window.confirm(`„${board!.title}" mit allen ${items.length} Entwürfen wirklich löschen?`)) return;
    await api(`/boards/${id}`, { method: "DELETE" });
    navigate("/entwuerfe");
  }

  const text = summary(board, items);
  const favourites = items.filter((i) => i.status === "favorite").length;
  const marks = items.reduce((n, i) => n + i.pins.length, 0);

  return (
    <>
      <Link href="/entwuerfe" className="mb-3 inline-flex items-center gap-1.5 text-[13.5px] text-muted hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Alle Entwürfe
      </Link>
      <PageHeader title={board.title} sub={`${board.client_name ?? "Ohne Kunde"} · ${items.length} Entwürfe${favourites ? ` · ${favourites} Favorit${favourites > 1 ? "en" : ""}` : ""}${marks ? ` · ${marks} Markierungen` : ""}`}>
        <Btn variant="outline" onClick={() => setSummaryOpen(true)}>
          <ClipboardList className="size-4" aria-hidden="true" />
          Änderungen
        </Btn>
        <Btn variant="accent" disabled={!items.length} onClick={() => setShowing(0)}>
          <Play className="size-4" aria-hidden="true" />
          Präsentieren
        </Btn>
      </PageHeader>

      {items.length === 0 && (
        <Empty title="Noch keine Bilder" text="Lade die Design-Entwürfe hoch (PNG, JPG oder WebP, je bis 8 MB).">
          <Btn variant="accent" onClick={() => fileInput.current?.click()}>
            Bilder hochladen
          </Btn>
        </Empty>
      )}

      {groups.map(([name, list]) => (
        <section key={name} className="mb-8">
          {(name || groups.length > 1) && <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-faint">{name || "Ohne Gruppe"}</h2>}
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((item) => {
              const index = items.indexOf(item);
              return (
                <li key={item.id}>
                  <Card className={cn("group overflow-hidden transition-[border-color,box-shadow,opacity] duration-200 hover:border-accent/30 hover:shadow-card", item.status === "out" && "opacity-55 hover:opacity-100")}>
                    <button type="button" onClick={() => setShowing(index)} className="relative block w-full overflow-hidden bg-ink/[0.05]" aria-label={`${item.title} zeigen`}>
                      <img src={src(item.image)} alt="" loading="lazy" className="aspect-[4/3] w-full object-contain transition-transform duration-700 group-hover:scale-[1.03]" />
                      {item.status && (
                        <Badge tone={statusTone[item.status]} className="absolute left-2.5 top-2.5 shadow-sm">
                          {itemStatusLabels[item.status]}
                        </Badge>
                      )}
                      {item.pins.length > 0 && (
                        <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[11.5px] font-semibold text-white shadow-sm">
                          <MapPin className="size-3" /> {item.pins.length}
                        </span>
                      )}
                    </button>
                    <div className="p-3.5">
                      <input
                        value={item.title}
                        onChange={(e) => change(item.id, { title: e.target.value })}
                        className="-ml-1.5 block w-[calc(100%+6px)] rounded-md border border-transparent bg-transparent px-1.5 py-0.5 text-[15px] font-semibold outline-none hover:border-ink/12 focus:border-accent"
                        aria-label="Name des Entwurfs"
                      />
                      {item.notes.trim() && <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-muted">{item.notes}</p>}
                      <div className="mt-2.5 flex items-center gap-1">
                        {(["favorite", "maybe", "out"] as const).map((status) => {
                          const Icon = statusIcon[status];
                          const on = item.status === status;
                          return (
                            <button
                              key={status}
                              type="button"
                              onClick={() => change(item.id, { status: (on ? "" : status) as ItemStatus })}
                              aria-pressed={on}
                              className={cn("inline-flex h-7 items-center gap-1 rounded-full border px-2.5 text-[12px] font-medium transition-colors", on ? "border-ink bg-ink text-white" : "border-ink/12 text-ink/65 hover:border-ink/30")}
                            >
                              <Icon className={cn("size-3", on && status === "favorite" && "fill-current")} />
                              {itemStatusLabels[status]}
                            </button>
                          );
                        })}
                        <button type="button" onClick={() => removeItem(item)} className="ml-auto flex size-7 items-center justify-center rounded-lg text-faint hover:bg-red-50 hover:text-red-600" aria-label="Entwurf löschen">
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-5">
          <h2 className="text-[15px] font-semibold">Notizen zum Termin</h2>
          <p className="mt-1 text-[13px] text-muted">Was über alle Entwürfe hinweg gesagt wurde: Richtung, Name, nächste Schritte.</p>
          <Textarea
            className="mt-3"
            rows={5}
            value={board.notes}
            onChange={(e) => setBoard({ ...board, notes: e.target.value })}
            onBlur={() => board.notes !== data?.board.notes && saveBoard({ notes: board.notes })}
            placeholder={"– Name: eher „IC Buchhaltung“\n– warme Farben kommen besser an\n– bis Freitag zwei Varianten nachschärfen"}
          />
        </Card>
        <Card className="space-y-4 p-5">
          <div>
            <h2 className="text-[15px] font-semibold">Bilder hinzufügen</h2>
            <div className="mt-3 flex gap-2">
              <Input value={group} onChange={(e) => setGroup(e.target.value)} placeholder="Gruppe (optional)" aria-label="Gruppe für neue Bilder" list="board-groups" />
              <datalist id="board-groups">
                {groups.map(([name]) => name && <option key={name} value={name} />)}
              </datalist>
              <Btn variant="outline" className="shrink-0" disabled={uploading > 0} onClick={() => fileInput.current?.click()}>
                {uploading > 0 ? <Spinner className="size-4" /> : <ImagePlus className="size-4" aria-hidden="true" />}
                {uploading > 0 ? `Noch ${uploading}` : "Hochladen"}
              </Btn>
              <input ref={fileInput} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
            </div>
          </div>
          <Field label="Titel der Sammlung">
            <Input value={board.title} onChange={(e) => setBoard({ ...board, title: e.target.value })} onBlur={() => board.title.trim() && board.title !== data?.board.title && saveBoard({ title: board.title.trim() })} />
          </Field>
          <Field label="Link zur Live-Vorschau" hint="Wird in der Präsentation nicht gezeigt – nur zum schnellen Öffnen.">
            <div className="flex gap-2">
              <Input value={board.link ?? ""} onChange={(e) => setBoard({ ...board, link: e.target.value })} onBlur={() => (board.link ?? "") !== (data?.board.link ?? "") && saveBoard({ link: board.link || null })} placeholder="https://…" />
              {board.link && (
                <a href={board.link} target="_blank" rel="noreferrer" className="flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-ink/12 text-muted hover:border-accent/50 hover:text-ink" aria-label="Live-Vorschau öffnen">
                  <ExternalLink className="size-4" />
                </a>
              )}
            </div>
          </Field>
          <Btn variant="danger" size="sm" onClick={removeBoard}>
            <Trash2 className="size-3.5" aria-hidden="true" />
            Sammlung löschen
          </Btn>
        </Card>
      </div>

      <Modal open={summaryOpen} onClose={() => setSummaryOpen(false)} title="Änderungen und Entscheidungen" wide>
        <pre className="max-h-[56dvh] overflow-auto whitespace-pre-wrap rounded-[12px] bg-paper p-4 font-sans text-[14px] leading-[1.55]">{text}</pre>
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <Btn
            variant="outline"
            onClick={async () => {
              await navigator.clipboard.writeText(text).catch(() => {});
              toast("Text kopiert");
            }}
          >
            <Copy className="size-4" aria-hidden="true" />
            Text kopieren
          </Btn>
          {board.client_id && (
            <Btn
              variant="accent"
              onClick={async () => {
                try {
                  await api("/activities", { method: "POST", body: { client_id: board.client_id, kind: "meeting", text } });
                  toast("In der Kundenakte gespeichert");
                  setSummaryOpen(false);
                } catch (err) {
                  toast((err as ApiError).message, "error");
                }
              }}
            >
              In Kundenakte speichern
            </Btn>
          )}
        </div>
      </Modal>

      {showing !== null && <Presenter items={items} index={Math.min(showing, items.length - 1)} onIndex={setShowing} onClose={() => setShowing(null)} onChange={change} saved={unsaved === 0} />}
    </>
  );
}
