import { Check, ChevronLeft, ChevronRight, CircleHelp, Columns2, Maximize, MessageSquarePlus, Minimize, PanelRight, Star, Trash2, X, ZoomIn } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { asset, cn } from "@/lib/utils";
import type { BoardItem, ItemStatus, Pin } from "../api";

type Props = {
  items: BoardItem[];
  index: number;
  onIndex: (index: number) => void;
  onClose: () => void;
  /** Changes one design; the page saves it. */
  onChange: (id: number, patch: Partial<BoardItem>) => void;
  saved: boolean;
};

const src = (url: string) => (url.startsWith("/") ? asset(url) : url);
const label = (item: BoardItem) => (item.group_name ? `${item.group_name} · ${item.title}` : item.title);
const bar = "flex size-10 items-center justify-center rounded-[10px] text-white/75 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30";
const statusStyle: Record<Exclude<ItemStatus, "">, string> = { favorite: "bg-amber-400 text-black", maybe: "bg-sky-400 text-black", out: "bg-rose-500 text-white" };

/** The image, fitted into the free space; a click marks a spot or zooms in. */
function Canvas({
  item,
  marking,
  pins,
  activePin,
  onMark,
  onPickPin,
}: {
  item: BoardItem;
  marking: boolean;
  /** Show the marks of this design (off in the comparison). */
  pins: boolean;
  activePin?: string | null;
  onMark?: (x: number, y: number) => void;
  onPickPin?: (id: string) => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [space, setSpace] = useState({ w: 0, h: 0 });
  const [zoom, setZoom] = useState(false);
  const focus = useRef<{ fx: number; fy: number; vx: number; vy: number } | null>(null);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => setSpace({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // a new design starts fitted
  useEffect(() => setZoom(false), [item.id]);

  const ratio = (item.width || 4) / (item.height || 3);
  const fit = Math.min(space.w, space.h * ratio);
  const width = Math.max(0, fit * (zoom ? 2.2 : 1));
  const height = width / ratio;

  // after zooming in, keep the clicked spot under the pointer
  useLayoutEffect(() => {
    const el = box.current;
    if (!el || !zoom || !focus.current) return;
    el.scrollLeft = focus.current.fx * width - focus.current.vx;
    el.scrollTop = focus.current.fy * height - focus.current.vy;
    focus.current = null;
  }, [zoom, width, height]);

  function click(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const fx = (e.clientX - rect.left) / rect.width;
    const fy = (e.clientY - rect.top) / rect.height;
    if (marking && onMark) return onMark(fx * 100, fy * 100);
    const frame = box.current!.getBoundingClientRect();
    focus.current = { fx, fy, vx: e.clientX - frame.left, vy: e.clientY - frame.top };
    setZoom((z) => !z);
  }

  return (
    <div ref={box} className="absolute inset-0 overflow-auto [scrollbar-width:thin]">
      <div className="flex min-h-full min-w-full items-center justify-center">
        <div className={cn("relative shrink-0", marking ? "cursor-crosshair" : zoom ? "cursor-zoom-out" : "cursor-zoom-in")} style={{ width, height }} onClick={click}>
          <img src={src(item.image)} alt={label(item)} draggable={false} className="h-full w-full select-none rounded-[6px] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]" />
          {pins &&
            item.pins.map((pin, i) => (
              <button
                key={pin.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPickPin?.(pin.id);
                }}
                className={cn(
                  "absolute flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white text-[13px] font-bold shadow-[0_6px_18px_rgba(0,0,0,0.55)] transition-transform hover:scale-110",
                  pin.done ? "bg-emerald-500 text-white" : "bg-[#6865FF] text-white",
                  activePin === pin.id && "scale-125 ring-4 ring-white/40",
                )}
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                aria-label={`Markierung ${i + 1}${pin.text ? `: ${pin.text}` : ""}`}
                title={pin.text || undefined}
              >
                {pin.done ? <Check className="size-4" strokeWidth={3} /> : i + 1}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

/** Full-screen view for the meeting: one design at a time, marks and change requests beside it, or two designs side by side. */
export function Presenter({ items, index, onIndex, onClose, onChange, saved }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const item = items[index];
  const [marking, setMarking] = useState(false);
  const [panel, setPanel] = useState(() => window.innerWidth >= 1024);
  const [compare, setCompare] = useState<number | null>(null);
  const [activePin, setActivePin] = useState<string | null>(null);
  const [full, setFull] = useState(false);
  const other = compare === null ? null : (items.find((i) => i.id === compare) ?? null);

  const go = useCallback((by: number) => onIndex((index + by + items.length) % items.length), [index, items.length, onIndex]);

  useEffect(() => {
    setActivePin(null);
  }, [item?.id]);

  // keyboard: arrows change the design, Esc steps back out
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);
      if (e.key === "Escape") {
        if (typing) return el.blur();
        if (marking) return setMarking(false);
        if (compare !== null) return setCompare(null);
        if (!document.fullscreenElement) onClose();
        return;
      }
      if (typing) return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key.toLowerCase() === "m") setMarking((m) => !m);
      if (e.key.toLowerCase() === "f") onChange(item.id, { status: item.status === "favorite" ? "" : "favorite" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, marking, compare, onClose, onChange, item]);

  useEffect(() => {
    const onFull = () => setFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFull);
    return () => document.removeEventListener("fullscreenchange", onFull);
  }, []);

  // the page behind must not scroll
  useEffect(() => {
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = before;
    };
  }, []);

  // swipe left / right on touch screens
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const down = (e: PointerEvent) => {
    swipe.current = e.pointerType === "touch" && !marking ? { x: e.clientX, y: e.clientY } : null;
  };
  const up = (e: PointerEvent) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(e.clientY - start.y) * 1.5) go(dx < 0 ? 1 : -1);
  };

  if (!item) return null;

  const setPins = (pins: Pin[]) => onChange(item.id, { pins });
  const setStatus = (status: ItemStatus) => onChange(item.id, { status: item.status === status ? "" : status });

  function mark(x: number, y: number) {
    const pin: Pin = { id: Math.random().toString(36).slice(2, 10), x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, text: "", done: false };
    setPins([...item.pins, pin]);
    setActivePin(pin.id);
    setPanel(true);
    window.setTimeout(() => document.getElementById(`pin-${pin.id}`)?.focus(), 60);
  }

  const openPins = item.pins.filter((p) => !p.done).length;

  return (
    <div ref={root} className="fixed inset-0 z-[70] flex flex-col bg-[#0b0c12] text-white">
      {/* ---------- top bar ---------- */}
      <header className="flex h-14 shrink-0 items-center gap-1 border-b border-white/[0.08] px-2 sm:gap-2 sm:px-3">
        <button type="button" className={bar} onClick={onClose} aria-label="Schließen">
          <X className="size-5" />
        </button>
        <div className="min-w-0 flex-1 px-1">
          {item.group_name && <p className="truncate text-[11px] font-medium uppercase tracking-[0.12em] text-white/45">{item.group_name}</p>}
          <input
            value={item.title}
            onChange={(e) => onChange(item.id, { title: e.target.value })}
            className="-ml-1.5 block w-full max-w-[420px] truncate rounded-md border border-transparent bg-transparent px-1.5 text-[16px] font-semibold leading-tight outline-none hover:border-white/15 focus:border-white/40"
            aria-label="Name des Entwurfs"
          />
        </div>
        <span className="hidden shrink-0 text-[13px] tabular-nums text-white/50 sm:block">
          {index + 1} / {items.length}
        </span>

        <div className="flex shrink-0 items-center gap-0.5 rounded-[12px] bg-white/[0.07] p-1" role="group" aria-label="Bewertung">
          {(
            [
              ["favorite", Star, "Favorit"],
              ["maybe", CircleHelp, "Vielleicht"],
              ["out", X, "Raus"],
            ] as const
          ).map(([status, Icon, text]) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatus(status)}
              aria-pressed={item.status === status}
              title={text}
              className={cn("flex h-8 items-center gap-1.5 rounded-[9px] px-2.5 text-[13px] font-medium transition-colors", item.status === status ? statusStyle[status] : "text-white/65 hover:bg-white/10 hover:text-white")}
            >
              <Icon className={cn("size-4", status === "favorite" && item.status === "favorite" && "fill-current")} />
              <span className="hidden xl:inline">{text}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            setMarking(!marking);
            setCompare(null);
          }}
          aria-pressed={marking}
          className={cn("flex h-10 shrink-0 items-center gap-2 rounded-[10px] px-3 text-[13.5px] font-medium transition-colors", marking ? "bg-[#6865FF] text-white" : "text-white/75 hover:bg-white/10 hover:text-white")}
          title="Stelle im Bild markieren (M)"
        >
          <MessageSquarePlus className="size-[18px]" />
          <span className="hidden md:inline">{marking ? "Ins Bild tippen" : "Markieren"}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setMarking(false);
            setCompare(compare === null ? items[(index + 1) % items.length].id : null);
          }}
          aria-pressed={compare !== null}
          disabled={items.length < 2}
          className={cn(bar, "hidden sm:flex", compare !== null && "bg-white/15 text-white")}
          aria-label="Zwei Entwürfe vergleichen"
          title="Vergleichen"
        >
          <Columns2 className="size-[18px]" />
        </button>
        <button type="button" onClick={() => setPanel(!panel)} aria-pressed={panel} className={cn(bar, "relative", panel && "bg-white/15 text-white")} aria-label="Änderungswünsche" title="Änderungswünsche">
          <PanelRight className="size-[18px]" />
          {openPins > 0 && <span className="absolute right-1 top-1 flex min-w-[16px] items-center justify-center rounded-full bg-[#6865FF] px-1 text-[10px] font-bold leading-4">{openPins}</span>}
        </button>
        <button
          type="button"
          onClick={() => (document.fullscreenElement ? document.exitFullscreen() : root.current?.requestFullscreen?.())?.catch(() => {})}
          className={cn(bar, "hidden sm:flex")}
          aria-label="Vollbild"
          title="Vollbild"
        >
          {full ? <Minimize className="size-[18px]" /> : <Maximize className="size-[18px]" />}
        </button>
      </header>

      <div className="relative flex min-h-0 flex-1">
        {/* ---------- stage ---------- */}
        <div className="relative min-w-0 flex-1" onPointerDown={down} onPointerUp={up}>
          {other ? (
            <div className="absolute inset-0 grid grid-cols-2 gap-px bg-white/10">
              {[item, other].map((it, side) => (
                <div key={side} className="relative bg-[#0b0c12]">
                  <div className="absolute inset-x-3 top-3 z-10 flex justify-center">
                    <select
                      value={it.id}
                      onChange={(e) => (side === 0 ? onIndex(items.findIndex((i) => i.id === Number(e.target.value))) : setCompare(Number(e.target.value)))}
                      className="h-9 max-w-full rounded-full border border-white/20 bg-[#161826] px-3.5 text-[13px] font-medium text-white outline-none"
                      aria-label={side === 0 ? "Linker Entwurf" : "Rechter Entwurf"}
                    >
                      {items.map((i) => (
                        <option key={i.id} value={i.id}>
                          {label(i)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="absolute inset-0 top-14 m-3">
                    <Canvas item={it} marking={false} pins={false} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="absolute inset-0 m-3 sm:m-5">
                <Canvas item={item} marking={marking} pins activePin={activePin} onMark={mark} onPickPin={(id) => (setActivePin(id), setPanel(true), window.setTimeout(() => document.getElementById(`pin-${id}`)?.focus(), 60))} />
              </div>
              <button type="button" onClick={() => go(-1)} className="absolute left-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white/85 backdrop-blur transition-colors hover:bg-black/80" aria-label="Vorheriger Entwurf">
                <ChevronLeft className="size-6" />
              </button>
              <button type="button" onClick={() => go(1)} className="absolute right-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white/85 backdrop-blur transition-colors hover:bg-black/80" aria-label="Nächster Entwurf">
                <ChevronRight className="size-6" />
              </button>
              {!marking && (
                <span className="pointer-events-none absolute bottom-3 left-1/2 hidden -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-[11.5px] text-white/60 backdrop-blur md:flex">
                  <ZoomIn className="size-3.5" /> Klick vergrößert · ← → wechselt · M markiert
                </span>
              )}
            </>
          )}
        </div>

        {/* ---------- change requests ---------- */}
        {panel && (
          <aside className="absolute inset-x-0 bottom-0 z-20 flex max-h-[58%] flex-col border-t border-white/10 bg-[#12131d] lg:static lg:max-h-none lg:w-[350px] lg:shrink-0 lg:border-l lg:border-t-0">
            <div className="flex shrink-0 items-center justify-between gap-3 px-4 pb-2 pt-4">
              <h2 className="text-[14px] font-semibold">Änderungswünsche</h2>
              <span className="text-[11.5px] text-white/40">{saved ? "Gespeichert" : "Speichert …"}</span>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
              {item.pins.length === 0 ? (
                <p className="rounded-[12px] border border-dashed border-white/15 px-3.5 py-4 text-[13px] leading-[1.5] text-white/55">
                  Noch keine Markierung. „Markieren" antippen und dann die Stelle im Bild – daneben schreibst du, was sich ändern soll.
                </p>
              ) : (
                <ol className="space-y-2">
                  {item.pins.map((pin, i) => (
                    <li key={pin.id} className={cn("flex gap-2.5 rounded-[12px] border p-2.5 transition-colors", activePin === pin.id ? "border-[#6865FF] bg-[#6865FF]/10" : "border-white/10")} onFocusCapture={() => setActivePin(pin.id)}>
                      <span className={cn("mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-[11.5px] font-bold", pin.done ? "bg-emerald-500" : "bg-[#6865FF]")}>{i + 1}</span>
                      <div className="min-w-0 flex-1">
                        <textarea
                          id={`pin-${pin.id}`}
                          value={pin.text}
                          onChange={(e) => setPins(item.pins.map((p) => (p.id === pin.id ? { ...p, text: e.target.value } : p)))}
                          rows={Math.min(6, Math.max(2, Math.ceil(pin.text.length / 34)))}
                          placeholder="Was soll hier anders werden?"
                          className={cn("block w-full resize-none bg-transparent text-[13.5px] leading-[1.45] outline-none placeholder:text-white/30", pin.done && "text-white/45 line-through")}
                        />
                        <div className="mt-1 flex items-center justify-between">
                          <label className="flex cursor-pointer items-center gap-1.5 text-[11.5px] text-white/50">
                            <input type="checkbox" checked={pin.done} onChange={(e) => setPins(item.pins.map((p) => (p.id === pin.id ? { ...p, done: e.target.checked } : p)))} className="size-3.5 accent-emerald-500" />
                            erledigt
                          </label>
                          <button type="button" onClick={() => setPins(item.pins.filter((p) => p.id !== pin.id))} className="flex size-7 items-center justify-center rounded-md text-white/40 hover:bg-white/10 hover:text-rose-400" aria-label={`Markierung ${i + 1} löschen`}>
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
              <h3 className="mb-2 mt-5 text-[12px] font-semibold uppercase tracking-[0.1em] text-white/45">Allgemein zu diesem Entwurf</h3>
              <textarea
                value={item.notes}
                onChange={(e) => onChange(item.id, { notes: e.target.value })}
                rows={4}
                placeholder={"z. B. Farbe gefällt, Schrift zu streng,\nLogo lieber wie bei Entwurf 2 …"}
                className="block w-full resize-y rounded-[12px] border border-white/10 bg-white/[0.04] p-3 text-[13.5px] leading-[1.5] outline-none placeholder:text-white/30 focus:border-white/35"
              />
            </div>
          </aside>
        )}
      </div>

      {/* ---------- all designs ---------- */}
      <nav className="flex h-[78px] shrink-0 items-center gap-2 overflow-x-auto border-t border-white/[0.08] px-3 [scrollbar-width:thin]" aria-label="Alle Entwürfe">
        {items.map((it, i) => (
          <button
            key={it.id}
            type="button"
            onClick={() => onIndex(i)}
            aria-current={i === index}
            title={label(it)}
            className={cn("relative h-[56px] w-[76px] shrink-0 overflow-hidden rounded-[8px] border-2 transition-[border-color,opacity]", i === index ? "border-white" : "border-transparent opacity-55 hover:opacity-100", it.status === "out" && i !== index && "opacity-25")}
          >
            <img src={src(it.image)} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
            {it.status && <span className={cn("absolute right-1 top-1 size-2.5 rounded-full ring-2 ring-black/50", it.status === "favorite" ? "bg-amber-400" : it.status === "maybe" ? "bg-sky-400" : "bg-rose-500")} />}
            {it.pins.length > 0 && <span className="absolute bottom-0.5 left-0.5 rounded bg-black/70 px-1 text-[10px] font-semibold leading-4">{it.pins.length}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
}
