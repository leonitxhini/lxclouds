import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Eye,
  EyeOff,
  Layers,
  LayoutTemplate,
  Maximize,
  Minimize,
  Monitor,
  Palette,
  PanelLeft,
  Pencil,
  Plus,
  Redo2,
  Share2,
  Smartphone,
  StickyNote,
  Tablet,
  Trash2,
  Undo2,
  History,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState, type FormEvent } from "react";
import { Link } from "wouter";
import { DemoSite, type BlockTools } from "@/demo/DemoSite";
import { imageUrl, type EditApi } from "@/demo/edit";
import { getIn, setIn } from "@/demo/path";
import { blankBlock, blockLabels, uid } from "@/demo/templates";
import { colourPresets, fonts } from "@/demo/theme";
import type { Block, BlockType, DemoDoc, FontKey, Meta, Path, Theme } from "@/demo/types";
import { cn } from "@/lib/utils";
import { api, ApiError, formatDate, useLoad, type Demo, type Version } from "../api";
import { Btn, Field, Input, Loading, Modal, Select, Textarea, useToast } from "../ui";
import { IconPicker, ImagePicker, ShareDialog } from "./pickers";

type Device = "desktop" | "tablet" | "phone";
type Panel = "blocks" | "design" | "notes" | "versions";
type SaveState = "saved" | "dirty" | "saving" | "error";

const deviceWidth: Record<Device, string> = { desktop: "100%", tablet: "834px", phone: "390px" };
const addable: BlockType[] = ["hero", "stats", "services", "cards", "about", "prices", "gallery", "steps", "quotes", "faq", "cta", "contact"];
const iconButton = "flex size-9 items-center justify-center rounded-[9px] text-ink/70 transition-colors hover:bg-ink/[0.07] hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent";

type History = { doc: DemoDoc; past: DemoDoc[]; future: DemoDoc[] };
type HistoryAction = { type: "change"; change: (doc: DemoDoc) => DemoDoc } | { type: "undo" } | { type: "redo" };

function historyReducer(h: History, action: HistoryAction): History {
  if (action.type === "change") {
    const next = action.change(h.doc);
    return next === h.doc ? h : { doc: next, past: [...h.past.slice(-60), h.doc], future: [] };
  }
  if (action.type === "undo") {
    return h.past.length ? { doc: h.past[h.past.length - 1], past: h.past.slice(0, -1), future: [h.doc, ...h.future] } : h;
  }
  return h.future.length ? { doc: h.future[0], past: [...h.past, h.doc], future: h.future.slice(1) } : h;
}

export function DemoEditor({ id }: { id: number }) {
  const { data, error } = useLoad<{ demo: Demo; versions: Version[] }>(`/demos/${id}`);
  if (error) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-paper">
        <p className="text-red-600">{error.message}</p>
        <Link href="/demos" className="text-accent-ink underline">
          Zurück zu den Demos
        </Link>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="min-h-dvh bg-paper">
        <Loading />
      </div>
    );
  }
  return <Workspace demo={data.demo} initialVersions={data.versions} />;
}

function Workspace({ demo, initialVersions }: { demo: Demo; initialVersions: Version[] }) {
  const toast = useToast();
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);

  // ---- document with undo history ----
  const [history, dispatch] = useReducer(historyReducer, { doc: demo.doc, past: [], future: [] });
  const { doc, past, future } = history;
  const mutate = useCallback((change: (doc: DemoDoc) => DemoDoc) => dispatch({ type: "change", change }), []);
  const undo = useCallback(() => dispatch({ type: "undo" }), []);
  const redo = useCallback(() => dispatch({ type: "redo" }), []);

  // ---- autosave: shortly after the last change; a failed save is retried ----
  const [savedDoc, setSavedDoc] = useState(demo.doc);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(0);
  const latest = useRef(doc);
  latest.current = doc;
  useEffect(() => {
    if (doc === savedDoc) return;
    const timer = window.setTimeout(
      async () => {
        const sent = doc;
        setSaving(true);
        try {
          await api(`/demos/${demo.id}`, { method: "PATCH", body: { doc: sent } });
          setSavedDoc(sent);
          setFailed(0);
        } catch {
          setFailed((n) => n + 1);
        }
        setSaving(false);
      },
      failed ? 4000 : 700,
    );
    return () => window.clearTimeout(timer);
  }, [doc, savedDoc, failed, demo.id]);
  const save: SaveState = failed ? "error" : saving ? "saving" : doc === savedDoc ? "saved" : "dirty";

  // warn before leaving with unsaved changes
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (save !== "saved") e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [save]);

  // ---- view state ----
  const [title, setTitle] = useState(demo.title);
  const [notes, setNotes] = useState(demo.notes);
  const [shared, setShared] = useState(!!demo.shared);
  const [versions, setVersions] = useState(initialVersions);
  const [device, setDevice] = useState<Device>("desktop");
  const [editing, setEditing] = useState(true);
  const [presenting, setPresenting] = useState(false);
  const [panel, setPanel] = useState<Panel | null>(() => (window.innerWidth >= 1024 ? "blocks" : null));
  const [imagePick, setImagePick] = useState<{ blockId: string; path: Path } | null>(null);
  const [iconPick, setIconPick] = useState<{ blockId: string; path: Path; current: string } | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);

  const updateBlock = useCallback(
    (blockId: string, change: (props: Record<string, unknown>) => Record<string, unknown>) =>
      mutate((d) => ({ ...d, blocks: d.blocks.map((b) => (b.id === blockId ? ({ ...b, props: change(b.props as Record<string, unknown>) } as Block) : b)) })),
    [mutate],
  );

  const edit = useMemo<EditApi>(
    () => ({
      set: (blockId, path, value) => updateBlock(blockId, (props) => setIn(props, path, value)),
      setMeta: (key, value) => mutate((d) => ({ ...d, meta: { ...d.meta, [key]: value } })),
      pickImage: (blockId, path) => setImagePick({ blockId, path }),
      pickIcon: (blockId, path, current) => setIconPick({ blockId, path, current }),
      add: (blockId, path, item) => updateBlock(blockId, (props) => setIn(props, path, [...((getIn(props, path) as unknown[]) ?? []), structuredClone(item)])),
      remove: (blockId, path, index) => updateBlock(blockId, (props) => setIn(props, path, ((getIn(props, path) as unknown[]) ?? []).filter((_, i) => i !== index))),
      move: (blockId, path, index, by) =>
        updateBlock(blockId, (props) => {
          const list = [...((getIn(props, path) as unknown[]) ?? [])];
          const target = index + by;
          if (target < 0 || target >= list.length) return props;
          [list[index], list[target]] = [list[target], list[index]];
          return setIn(props, path, list);
        }),
    }),
    [mutate, updateBlock],
  );

  const tools = useMemo<BlockTools>(
    () => ({
      move: (id, by) =>
        mutate((d) => {
          const blocks = [...d.blocks];
          const index = blocks.findIndex((b) => b.id === id);
          let target = index + by;
          while (blocks[target]?.hidden) target += by; // hop over hidden sections
          if (index < 0 || target < 0 || target >= blocks.length) return d;
          [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
          return { ...d, blocks };
        }),
      hide: (id) => mutate((d) => ({ ...d, blocks: d.blocks.map((b) => (b.id === id ? { ...b, hidden: !b.hidden } : b)) })),
      duplicate: (id) =>
        mutate((d) => {
          const index = d.blocks.findIndex((b) => b.id === id);
          if (index < 0) return d;
          const copy = { ...structuredClone(d.blocks[index]), id: uid() };
          return { ...d, blocks: [...d.blocks.slice(0, index + 1), copy, ...d.blocks.slice(index + 1)] };
        }),
      remove: (id) => mutate((d) => ({ ...d, blocks: d.blocks.filter((b) => b.id !== id) })),
    }),
    [mutate],
  );

  const setTheme = (patch: Partial<Theme>) => mutate((d) => ({ ...d, theme: { ...d.theme, ...patch } }));

  function addBlock(type: BlockType) {
    const block = blankBlock(type);
    mutate((d) => {
      // new sections go in front of the closing ones
      const tail = d.blocks.findIndex((b) => b.type === "contact" || b.type === "footer");
      const at = tail < 0 ? d.blocks.length : tail;
      return { ...d, blocks: [...d.blocks.slice(0, at), block, ...d.blocks.slice(at)] };
    });
    window.setTimeout(() => canvas.current?.querySelector(`[data-block="${block.id}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 120);
  }

  function onImagePicked(src: string) {
    if (!imagePick) return;
    if (imagePick.blockId === "theme") setTheme({ logo: src || undefined });
    else edit.set(imagePick.blockId, imagePick.path, src);
    setImagePick(null);
  }

  async function saveField(body: Record<string, unknown>) {
    try {
      await api(`/demos/${demo.id}`, { method: "PATCH", body });
    } catch (err) {
      toast((err as ApiError).message, "error");
    }
  }

  // ---- presenting ----
  async function present(on: boolean) {
    setPresenting(on);
    if (on) {
      setEditing(false);
      await root.current?.requestFullscreen?.().catch(() => {});
    } else if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => {});
    }
  }
  useEffect(() => {
    const onChange = () => {
      if (!document.fullscreenElement) setPresenting(false);
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // ---- keyboard: undo / redo outside of text fields ----
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  // ---- versions ----
  async function snapshot(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const label = String(new FormData(form).get("label") ?? "").trim() || `Stand ${versions.length + 1}`;
    try {
      if (save !== "saved") {
        await api(`/demos/${demo.id}`, { method: "PATCH", body: { doc: latest.current } });
        setSavedDoc(latest.current);
      }
      const { id } = await api<{ id: number }>(`/demos/${demo.id}/versions`, { method: "POST", body: { label } });
      setVersions((v) => [{ id, label, created_at: new Date().toISOString() }, ...v]);
      form.reset();
      toast("Stand gespeichert");
    } catch (err) {
      toast((err as ApiError).message, "error");
    }
  }
  async function restore(version: Version) {
    const { version: full } = await api<{ version: { doc: DemoDoc } }>(`/versions/${version.id}`);
    mutate(() => full.doc);
    toast(`„${version.label}“ geladen – mit Rückgängig kommst du zurück`);
  }

  async function saveAsTemplate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await api("/templates", { method: "POST", body: { name: fd.get("name"), industry: fd.get("industry"), doc: latest.current } });
      setTemplateOpen(false);
      toast("Als Vorlage gespeichert");
    } catch (err) {
      toast((err as ApiError).message, "error");
    }
  }

  const hero = doc.blocks.find((b) => b.type === "hero");
  const saveLabel = { saved: "Gespeichert", dirty: "Ungespeichert …", saving: "Speichert …", error: "Nicht gespeichert!" }[save];
  const showChrome = !presenting;

  return (
    <div ref={root} className="flex h-dvh flex-col bg-[#ECEAF3] text-ink">
      {/* ---------- top bar ---------- */}
      {showChrome && (
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-ink/[0.08] bg-white px-3">
          <Link href="/demos" className={iconButton} aria-label="Zurück zu den Demos">
            <ArrowLeft className="size-[18px]" />
          </Link>
          <button type="button" className={cn(iconButton, panel && "bg-ink/[0.07] text-ink")} onClick={() => setPanel(panel ? null : "blocks")} aria-label="Seitenleiste" aria-pressed={!!panel}>
            <PanelLeft className="size-[18px]" />
          </button>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => title.trim() && title !== demo.title && saveField({ title: title.trim() })}
            className="h-9 min-w-0 flex-1 rounded-[9px] border border-transparent bg-transparent px-2.5 text-[15px] font-semibold hover:border-ink/12 focus:border-accent focus:outline-none sm:max-w-[280px]"
            aria-label="Name der Demo"
          />
          <span className={cn("hidden shrink-0 text-[12.5px] md:block", save === "error" ? "font-medium text-red-600" : "text-faint")}>{saveLabel}</span>

          <div className="ml-auto flex items-center gap-1">
            <button type="button" className={iconButton} onClick={undo} disabled={!past.length} aria-label="Rückgängig" title="Rückgängig (⌘Z)">
              <Undo2 className="size-[18px]" />
            </button>
            <button type="button" className={iconButton} onClick={redo} disabled={!future.length} aria-label="Wiederholen" title="Wiederholen (⇧⌘Z)">
              <Redo2 className="size-[18px]" />
            </button>
            <div className="mx-1 hidden items-center rounded-[10px] bg-ink/[0.05] p-0.5 sm:flex" role="group" aria-label="Gerät">
              {(
                [
                  ["desktop", Monitor, "Desktop"],
                  ["tablet", Tablet, "Tablet"],
                  ["phone", Smartphone, "Handy"],
                ] as const
              ).map(([key, Icon, label]) => (
                <button key={key} type="button" onClick={() => setDevice(key)} aria-pressed={device === key} aria-label={label} title={label} className={cn("flex h-8 w-9 items-center justify-center rounded-[8px]", device === key ? "bg-white text-ink shadow-sm" : "text-ink/55 hover:text-ink")}>
                  <Icon className="size-[17px]" />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setEditing(!editing)}
              aria-pressed={editing}
              className={cn("flex h-9 items-center gap-2 rounded-[9px] px-3 text-[13.5px] font-medium", editing ? "bg-accent-soft text-accent-ink" : "text-ink/70 hover:bg-ink/[0.07]")}
              title="Texte und Bilder direkt in der Vorschau ändern"
            >
              {editing ? <Pencil className="size-4" /> : <Eye className="size-4" />}
              <span className="hidden md:inline">{editing ? "Bearbeiten" : "Ansehen"}</span>
            </button>
            <Btn variant="outline" size="sm" className="h-9" onClick={() => setShareOpen(true)}>
              <Share2 className="size-4" />
              <span className="hidden md:inline">Teilen</span>
            </Btn>
            <Btn variant="primary" size="sm" className="h-9" onClick={() => present(true)}>
              <Maximize className="size-4" />
              <span className="hidden md:inline">Präsentieren</span>
            </Btn>
          </div>
        </header>
      )}

      <div className="relative flex min-h-0 flex-1">
        {/* ---------- side panel ---------- */}
        {showChrome && panel && (
          <aside className="absolute inset-y-0 left-0 z-30 flex w-[min(320px,88vw)] shrink-0 flex-col border-r border-ink/[0.08] bg-white shadow-xl lg:static lg:shadow-none">
            <div className="flex shrink-0 gap-1 border-b border-ink/[0.07] p-2" role="tablist">
              {(
                [
                  ["blocks", Layers, "Aufbau"],
                  ["design", Palette, "Design"],
                  ["notes", StickyNote, "Notizen"],
                  ["versions", History, "Stände"],
                ] as const
              ).map(([key, Icon, label]) => (
                <button key={key} type="button" role="tab" aria-selected={panel === key} onClick={() => setPanel(key)} className={cn("flex h-9 flex-1 items-center justify-center gap-1.5 rounded-[9px] text-[12.5px] font-medium", panel === key ? "bg-accent-soft text-accent-ink" : "text-ink/60 hover:bg-ink/[0.05]")}>
                  <Icon className="size-4" />
                  {label}
                </button>
              ))}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              {panel === "blocks" && (
                <>
                  <ul className="space-y-1">
                    {doc.blocks.map((block, i) => (
                      <li key={block.id} className={cn("flex items-center gap-1 rounded-[10px] border border-ink/[0.07] pl-3 pr-1", block.hidden && "opacity-50")}>
                        <button
                          type="button"
                          className="h-10 min-w-0 flex-1 truncate text-left text-[13.5px] font-medium"
                          onClick={() => canvas.current?.querySelector(`[data-block="${block.id}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                        >
                          {blockLabels[block.type]}
                        </button>
                        <button type="button" className={cn(iconButton, "size-7")} disabled={i === 0} onClick={() => tools.move(block.id, -1)} aria-label="Nach oben">
                          <ArrowUp className="size-3.5" />
                        </button>
                        <button type="button" className={cn(iconButton, "size-7")} disabled={i === doc.blocks.length - 1} onClick={() => tools.move(block.id, 1)} aria-label="Nach unten">
                          <ArrowDown className="size-3.5" />
                        </button>
                        <button type="button" className={cn(iconButton, "size-7")} onClick={() => tools.hide(block.id)} aria-label={block.hidden ? "Einblenden" : "Ausblenden"}>
                          {block.hidden ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                        </button>
                        <button type="button" className={cn(iconButton, "size-7 hover:bg-red-50 hover:text-red-600")} onClick={() => tools.remove(block.id)} aria-label="Löschen">
                          <Trash2 className="size-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <p className="mb-2 mt-5 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-faint">Abschnitt hinzufügen</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {addable.map((type) => (
                      <button key={type} type="button" onClick={() => addBlock(type)} className="flex h-9 items-center gap-1.5 rounded-[9px] border border-dashed border-ink/20 px-2.5 text-[12.5px] text-ink/75 hover:border-accent hover:bg-accent-soft hover:text-accent-ink">
                        <Plus className="size-3.5 shrink-0" />
                        <span className="truncate">{blockLabels[type]}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {panel === "design" && (
                <div className="space-y-5">
                  <div>
                    <p className="mb-2 text-[12.5px] font-medium text-ink/70">Farbe</p>
                    <div className="flex flex-wrap gap-2">
                      {colourPresets.map((c) => (
                        <button key={c} type="button" onClick={() => setTheme({ primary: c })} aria-label={`Farbe ${c}`} aria-pressed={doc.theme.primary.toLowerCase() === c.toLowerCase()} className={cn("size-8 rounded-full ring-offset-2 transition-shadow", doc.theme.primary.toLowerCase() === c.toLowerCase() && "ring-2 ring-ink")} style={{ background: c }} />
                      ))}
                      <label className="relative flex size-8 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-ink/20 text-[15px]" title="Eigene Farbe">
                        +
                        <input type="color" value={doc.theme.primary} onChange={(e) => setTheme({ primary: e.target.value })} className="absolute inset-0 cursor-pointer opacity-0" aria-label="Eigene Farbe" />
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Erscheinung">
                      <Select value={doc.theme.mode} onChange={(e) => setTheme({ mode: e.target.value as Theme["mode"] })}>
                        <option value="light">Hell</option>
                        <option value="dark">Dunkel</option>
                      </Select>
                    </Field>
                    <Field label="Schrift">
                      <Select value={doc.theme.font} onChange={(e) => setTheme({ font: e.target.value as FontKey })}>
                        {Object.entries(fonts).map(([key, f]) => (
                          <option key={key} value={key}>
                            {f.label}
                          </option>
                        ))}
                      </Select>
                    </Field>
                  </div>
                  <Field label={`Ecken: ${doc.theme.radius} px`}>
                    <input type="range" min={0} max={28} step={2} value={doc.theme.radius} onChange={(e) => setTheme({ radius: Number(e.target.value) })} className="w-full accent-[#6865ff]" />
                  </Field>
                  {hero && hero.type === "hero" && (
                    <Field label="Hero-Variante">
                      <Select value={hero.props.variant} onChange={(e) => edit.set(hero.id, ["variant"], e.target.value)}>
                        <option value="split">Text links, Bild rechts</option>
                        <option value="cover">Bild als Hintergrund</option>
                        <option value="center">Zentriert, Bild darunter</option>
                      </Select>
                    </Field>
                  )}
                  <div>
                    <p className="mb-2 text-[12.5px] font-medium text-ink/70">Logo</p>
                    <div className="flex items-center gap-2">
                      {doc.theme.logo && <img src={imageUrl(doc.theme.logo)} alt="" className="h-10 max-w-[120px] rounded-md border border-ink/10 object-contain p-1" />}
                      <Btn variant="outline" size="sm" onClick={() => setImagePick({ blockId: "theme", path: ["logo"] })}>
                        {doc.theme.logo ? "Ändern" : "Logo hochladen"}
                      </Btn>
                      {doc.theme.logo && (
                        <Btn variant="ghost" size="sm" onClick={() => setTheme({ logo: undefined })}>
                          Entfernen
                        </Btn>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3 border-t border-ink/[0.07] pt-4">
                    <p className="text-[12.5px] font-medium text-ink/70">Firmendaten</p>
                    {(
                      [
                        ["company", "Firmenname"],
                        ["address", "Straße"],
                        ["city", "PLZ und Ort"],
                        ["phone", "Telefon"],
                        ["email", "E-Mail"],
                      ] as [keyof Meta, string][]
                    ).map(([key, label]) => (
                      <Input key={`${key}-${doc.meta[key]}`} defaultValue={doc.meta[key]} placeholder={label} aria-label={label} onBlur={(e) => e.target.value !== doc.meta[key] && edit.setMeta(key, e.target.value.trim())} />
                    ))}
                  </div>
                  <Btn variant="outline" size="sm" className="w-full" onClick={() => setTemplateOpen(true)}>
                    <LayoutTemplate className="size-3.5" />
                    Als Vorlage speichern
                  </Btn>
                </div>
              )}

              {panel === "notes" && (
                <div>
                  <p className="mb-2 text-[12.5px] leading-snug text-muted">Wünsche und Ideen aus dem Gespräch. Wird automatisch gespeichert und ist nur für dich sichtbar.</p>
                  <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} onBlur={() => notes !== demo.notes && saveField({ notes })} rows={18} placeholder={"– Kunde möchte mehr Fotos vom Team\n– Farbe eher dunkelgrün\n– Preisliste erst nach dem Sommer"} />
                </div>
              )}

              {panel === "versions" && (
                <div>
                  <p className="mb-3 text-[12.5px] leading-snug text-muted">Halte einen Stand fest, bevor du etwas ausprobierst – zum Beispiel „Variante A“ und „Variante B“ zum Vergleichen.</p>
                  <form onSubmit={snapshot} className="flex gap-2">
                    <Input name="label" placeholder="Name, z. B. Variante A" aria-label="Name des Stands" />
                    <Btn type="submit" variant="accent" className="shrink-0">
                      Sichern
                    </Btn>
                  </form>
                  <ul className="mt-4 space-y-1.5">
                    {versions.map((v) => (
                      <li key={v.id} className="flex items-center gap-2 rounded-[10px] border border-ink/[0.07] py-1.5 pl-3 pr-1.5">
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13.5px] font-medium">{v.label}</span>
                          <span className="block text-[11.5px] text-faint">{formatDate(v.created_at, true)}</span>
                        </span>
                        <Btn variant="ghost" size="sm" onClick={() => restore(v)}>
                          Laden
                        </Btn>
                        <button
                          type="button"
                          className={cn(iconButton, "size-7 hover:bg-red-50 hover:text-red-600")}
                          aria-label="Stand löschen"
                          onClick={async () => {
                            await api(`/versions/${v.id}`, { method: "DELETE" });
                            setVersions((list) => list.filter((x) => x.id !== v.id));
                          }}
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </li>
                    ))}
                    {versions.length === 0 && <li className="text-[13px] text-faint">Noch kein Stand gesichert.</li>}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* ---------- canvas ---------- */}
        <div ref={canvas} className={cn("min-w-0 flex-1 overflow-y-auto", presenting ? "bg-black" : device === "desktop" ? "" : "px-3 py-5")}>
          <div
            className={cn("mx-auto bg-white transition-[width] duration-300", !presenting && device !== "desktop" && "overflow-hidden rounded-[22px] shadow-[0_30px_70px_-30px_rgba(17,18,27,0.45)] ring-1 ring-ink/10")}
            style={{ width: deviceWidth[device], maxWidth: "100%" }}
          >
            <DemoSite doc={doc} edit={editing ? edit : null} tools={editing ? tools : null} />
          </div>
        </div>
      </div>

      {/* ---------- presenting: a small bar that stays out of the way ---------- */}
      {presenting && (
        <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/15 bg-[#14151c]/90 p-1.5 text-white opacity-40 shadow-2xl backdrop-blur transition-opacity duration-300 focus-within:opacity-100 hover:opacity-100">
          <button type="button" onClick={() => setEditing(!editing)} aria-pressed={editing} className={cn("flex h-9 items-center gap-2 rounded-full px-3.5 text-[13px] font-medium", editing ? "bg-accent text-white" : "hover:bg-white/10")}>
            <Pencil className="size-4" />
            {editing ? "Bearbeiten an" : "Bearbeiten"}
          </button>
          <label className="relative flex size-9 cursor-pointer items-center justify-center rounded-full hover:bg-white/10" title="Farbe">
            <span className="size-5 rounded-full ring-2 ring-white/60" style={{ background: doc.theme.primary }} />
            <input type="color" value={doc.theme.primary} onChange={(e) => setTheme({ primary: e.target.value })} className="absolute inset-0 cursor-pointer opacity-0" aria-label="Farbe ändern" />
          </label>
          <button type="button" onClick={() => setTheme({ mode: doc.theme.mode === "dark" ? "light" : "dark" })} className="flex h-9 items-center rounded-full px-3 text-[13px] hover:bg-white/10">
            {doc.theme.mode === "dark" ? "Hell" : "Dunkel"}
          </button>
          {(
            [
              ["desktop", Monitor],
              ["phone", Smartphone],
            ] as const
          ).map(([key, Icon]) => (
            <button key={key} type="button" onClick={() => setDevice(key)} aria-pressed={device === key} aria-label={key} className={cn("flex size-9 items-center justify-center rounded-full", device === key ? "bg-white/20" : "hover:bg-white/10")}>
              <Icon className="size-4" />
            </button>
          ))}
          <button type="button" onClick={undo} disabled={!past.length} className="flex size-9 items-center justify-center rounded-full hover:bg-white/10 disabled:opacity-30" aria-label="Rückgängig">
            <Undo2 className="size-4" />
          </button>
          <button type="button" onClick={() => present(false)} className="flex h-9 items-center gap-2 rounded-full bg-white px-3.5 text-[13px] font-medium text-ink">
            <Minimize className="size-4" />
            Beenden
          </button>
        </div>
      )}

      <ImagePicker open={!!imagePick} onClose={() => setImagePick(null)} onPick={onImagePicked} />
      <IconPicker
        open={!!iconPick}
        current={iconPick?.current ?? ""}
        onClose={() => setIconPick(null)}
        onPick={(name) => {
          if (iconPick) edit.set(iconPick.blockId, iconPick.path, name);
          setIconPick(null);
        }}
      />
      <ShareDialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        slug={demo.slug}
        shared={shared}
        onToggle={(next) => {
          setShared(next);
          void saveField({ shared: next });
        }}
      />
      <Modal open={templateOpen} onClose={() => setTemplateOpen(false)} title="Als Vorlage speichern">
        <form onSubmit={saveAsTemplate} className="space-y-4">
          <p className="text-[13.5px] text-muted">Der jetzige Aufbau samt Texten, Bildern und Farben wird zur Vorlage. Beim Verwenden trägst du nur noch die neue Firma ein.</p>
          <Field label="Name der Vorlage">
            <Input name="name" required defaultValue={`${doc.meta.industry} – ${title}`} autoFocus />
          </Field>
          <Field label="Branche">
            <Input name="industry" defaultValue={doc.meta.industry} />
          </Field>
          <div className="flex justify-end gap-2">
            <Btn variant="ghost" onClick={() => setTemplateOpen(false)}>
              Abbrechen
            </Btn>
            <Btn type="submit" variant="accent">
              Speichern
            </Btn>
          </div>
        </form>
      </Modal>
    </div>
  );
}
