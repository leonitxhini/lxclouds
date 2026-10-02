import { Check, ChevronLeft, ChevronRight, CircleHelp, Columns2, ImagePlus, Maximize, MessageSquarePlus, Minimize, PanelRight, Pipette, Star, Trash2, X, ZoomIn } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { asset, cn } from "@/lib/utils";
import { uploadImage, type Board, type BoardItem, type ItemStatus, type Pin, type PinKind } from "../api";
import { itemName, kindOf, pickKeys, pickLabels, pinKindOrder, pinKinds, type PickKey } from "./model";

type Props = {
  board: Board;
  items: BoardItem[];
  index: number;
  onIndex: (index: number) => void;
  onClose: () => void;
  /** Changes one design; the page saves it. */
  onChange: (id: number, patch: Partial<BoardItem>) => void;
  /** Changes the collection (which design wins per aspect); the page saves it. */
  onBoard: (patch: Partial<Board>) => void;
  saved: boolean;
};

const src = (url: string) => (url.startsWith("/") ? asset(url) : url);
const bar = "flex size-10 items-center justify-center rounded-[10px] text-white/75 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30";
const statusStyle: Record<Exclude<ItemStatus, "">, string> = { favorite: "bg-amber-400 text-black", maybe: "bg-sky-400 text-black", out: "bg-rose-500 text-white" };
const placeholders: Record<PinKind, string> = {
  keep: "Was genau gefällt? (optional)",
  colour: "Welche Farbe stattdessen? (optional)",
  smaller: "Wie viel kleiner? (optional)",
  bigger: "Wie viel größer? (optional)",
  image: "Was soll auf dem Bild sein?",
  text: "Wie soll der Text lauten?",
  remove: "Warum weg? (optional)",
  other: "Was soll hier anders werden?",
};

// ---------- colour of a spot in a design ----------
const pixels = new Map<string, Promise<CanvasRenderingContext2D>>();
function context(url: string) {
  let ready = pixels.get(url);
  if (!ready) {
    ready = (async () => {
      const image = new Image();
      image.src = url;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
      ctx.drawImage(image, 0, 0);
      return ctx;
    })();
    pixels.set(url, ready);
  }
  return ready;
}
/** Average colour of the few pixels around a spot (fx, fy between 0 and 1) as #rrggbb. */
async function colourAt(url: string, fx: number, fy: number) {
  const ctx = await context(url);
  const { width, height } = ctx.canvas;
  const x = Math.min(width - 3, Math.max(0, Math.round(fx * width) - 1));
  const y = Math.min(height - 3, Math.max(0, Math.round(fy * height) - 1));
  const data = ctx.getImageData(x, y, 3, 3).data;
  const sum = [0, 0, 0];
  for (let i = 0; i < data.length; i += 4) for (let c = 0; c < 3; c++) sum[c] += data[i + c];
  return `#${sum.map((v) => Math.round(v / (data.length / 4)).toString(16).padStart(2, "0")).join("")}`;
}

/** The image, fitted into the free space; a click marks a spot, takes its colour or zooms in. */
function Canvas({
  item,
  mode,
  pins,
  activePin,
  onSpot,
  onPickPin,
}: {
  item: BoardItem;
  /** What a click does: zoom, set a mark, or take the colour of the spot. */
  mode: "zoom" | "mark" | "colour";
  /** Show the marks of this design (off in the comparison). */
  pins: boolean;
  activePin?: string | null;
  onSpot?: (fx: number, fy: number) => void;
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
    if (mode !== "zoom") return onSpot?.(fx, fy);
    const frame = box.current!.getBoundingClientRect();
    focus.current = { fx, fy, vx: e.clientX - frame.left, vy: e.clientY - frame.top };
    setZoom((z) => !z);
  }

  return (
    <div ref={box} className="absolute inset-0 overflow-auto [scrollbar-width:thin]">
      <div className="flex min-h-full min-w-full items-center justify-center">
        <div data-stage className={cn("relative shrink-0", mode === "mark" ? "cursor-crosshair" : mode === "colour" ? "cursor-copy" : zoom ? "cursor-zoom-out" : "cursor-zoom-in")} style={{ width, height }} onClick={click}>
          <img src={src(item.image)} alt={itemName(item)} draggable={false} className="h-full w-full select-none rounded-[6px] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]" />
          {pins &&
            item.pins.map((pin, i) => {
              const kind = kindOf(pin);
              return (
                <button
                  key={pin.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPickPin?.(pin.id);
                  }}
                  className={cn(
                    "absolute flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white text-[13px] font-bold text-white shadow-[0_6px_18px_rgba(0,0,0,0.55)] transition-transform hover:scale-110",
                    activePin === pin.id && "scale-125 ring-4 ring-white/40",
                    mode === "colour" && "pointer-events-none opacity-40",
                  )}
                  style={{ left: `${pin.x}%`, top: `${pin.y}%`, backgroundColor: pin.done ? "#10b981" : pinKinds[kind].tone }}
                  aria-label={`Markierung ${i + 1}: ${pinKinds[kind].hint}${pin.text ? ` – ${pin.text}` : ""}`}
                  title={`${pinKinds[kind].hint}${pin.text ? `: ${pin.text}` : ""}`}
                >
                  {pin.done ? <Check className="size-4" strokeWidth={3} /> : i + 1}
                  {kind === "colour" && pin.colour && <span className="absolute -bottom-1.5 -right-1.5 size-4 rounded-full border-2 border-white" style={{ backgroundColor: pin.colour }} />}
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
}

/** Full-screen view for the meeting: one design at a time, marks and change requests beside it, or two designs side by side. */
export function Presenter({ board, items, index, onIndex, onClose, onChange, onBoard, saved }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const item = items[index];
  const [marking, setMarking] = useState(false);
  const [kind, setKind] = useState<PinKind>("other");
  const [panel, setPanel] = useState(() => window.innerWidth >= 1024);
  const [compare, setCompare] = useState<number | null>(null);
  const [activePin, setActivePin] = useState<string | null>(null);
  /** The mark that is waiting for a colour taken from one of the designs. */
  const [pipette, setPipette] = useState<{ itemId: number; pinId: string } | null>(null);
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
        if (pipette) return setPipette(null);
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
  }, [go, marking, compare, pipette, onClose, onChange, item]);

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
    swipe.current = e.pointerType === "touch" && !marking && !pipette ? { x: e.clientX, y: e.clientY } : null;
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
  const patchPin = (id: string, patch: Partial<Pin>) => setPins(item.pins.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const setStatus = (status: ItemStatus) => onChange(item.id, { status: item.status === status ? "" : status });
  const focusPin = (id: string) => window.setTimeout(() => document.getElementById(`pin-${id}`)?.focus(), 60);

  function mark(fx: number, fy: number) {
    const pin: Pin = { id: Math.random().toString(36).slice(2, 10), x: Math.round(fx * 1000) / 10, y: Math.round(fy * 1000) / 10, text: "", done: false, kind };
    setPins([...item.pins, pin]);
    setActivePin(pin.id);
    setPanel(true);
    // "keep" needs no words; everything else usually does
    if (kind !== "keep" && kind !== "smaller" && kind !== "bigger" && kind !== "remove") focusPin(pin.id);
  }

  /** The spot's colour goes to the mark that asked for it, which may sit on another design. */
  async function takeColour(from: BoardItem, fx: number, fy: number) {
    if (!pipette) return;
    const colour = await colourAt(src(from.image), fx, fy).catch(() => null);
    const target = items.find((i) => i.id === pipette.itemId);
    if (colour && target) onChange(target.id, { pins: target.pins.map((p) => (p.id === pipette.pinId ? { ...p, colour } : p)) });
    const back = items.findIndex((i) => i.id === pipette.itemId);
    setPipette(null);
    if (back >= 0 && back !== index) onIndex(back);
    setActivePin(pipette.pinId);
  }

  function togglePick(key: PickKey) {
    const picks = { ...board.picks };
    if (picks[key] === item.id) delete picks[key];
    else picks[key] = item.id;
    onBoard({ picks });
  }

  const openPins = item.pins.filter((p) => !p.done).length;
  const mode = pipette ? "colour" : marking ? "mark" : "zoom";

  return (
    <div ref={root} data-presenter className="fixed inset-0 z-[70] flex flex-col bg-[#0b0c12] text-white">
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
              aria-label={text}
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
            setPipette(null);
            setCompare(null);
          }}
          aria-pressed={marking}
          className={cn("flex h-10 shrink-0 items-center gap-2 rounded-[10px] px-3 text-[13.5px] font-medium transition-colors", marking ? "bg-[#6865FF] text-white" : "text-white/75 hover:bg-white/10 hover:text-white")}
          title="Stellen im Bild markieren (M)"
        >
          <MessageSquarePlus className="size-[18px]" />
          <span className="hidden md:inline">{marking ? "Fertig" : "Markieren"}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setMarking(false);
            setPipette(null);
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
                          {itemName(i)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="absolute inset-0 top-14 m-3">
                    <Canvas item={it} mode={pipette ? "colour" : "zoom"} pins={false} onSpot={(fx, fy) => takeColour(it, fx, fy)} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className={cn("absolute inset-0 m-3 sm:m-5", (marking || pipette) && "top-12 sm:top-12")}>
                <Canvas
                  item={item}
                  mode={mode}
                  pins
                  activePin={activePin}
                  onSpot={(fx, fy) => (pipette ? takeColour(item, fx, fy) : mark(fx, fy))}
                  onPickPin={(id) => {
                    setActivePin(id);
                    setPanel(true);
                    focusPin(id);
                  }}
                />
              </div>
              <button type="button" onClick={() => go(-1)} className="absolute left-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white/85 backdrop-blur transition-colors hover:bg-black/80" aria-label="Vorheriger Entwurf">
                <ChevronLeft className="size-6" />
              </button>
              <button type="button" onClick={() => go(1)} className="absolute right-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white/85 backdrop-blur transition-colors hover:bg-black/80" aria-label="Nächster Entwurf">
                <ChevronRight className="size-6" />
              </button>
              {mode === "zoom" && (
                <span className="pointer-events-none absolute bottom-3 left-1/2 hidden -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-[11.5px] text-white/60 backdrop-blur md:flex">
                  <ZoomIn className="size-3.5" /> Klick vergrößert · ← → wechselt · M markiert
                </span>
              )}
            </>
          )}

          {/* what the next tap on the image means */}
          {marking && !pipette && !other && (
            <div className="absolute inset-x-2 top-2 z-10 flex justify-center">
              <div className="flex max-w-full gap-1 overflow-x-auto rounded-full border border-white/15 bg-[#161826]/95 p-1 shadow-xl backdrop-blur [scrollbar-width:none]" role="group" aria-label="Art der Markierung">
                {pinKindOrder.map((k) => {
                  const Icon = pinKinds[k].icon;
                  return (
                    <button key={k} type="button" onClick={() => setKind(k)} aria-pressed={kind === k} className={cn("flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-[12.5px] font-medium transition-colors", kind === k ? "bg-white text-black" : "text-white/75 hover:bg-white/10")}>
                      <Icon className="size-3.5" />
                      {pinKinds[k].label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {pipette && (
            <div className="absolute inset-x-2 top-2 z-10 flex justify-center">
              <div className="flex items-center gap-3 rounded-full border border-white/15 bg-[#161826]/95 py-1 pl-4 pr-1 text-[12.5px] shadow-xl backdrop-blur">
                <Pipette className="size-4 text-[#A9A7FF]" />
                <span>Farbe antippen – auch in einem anderen Entwurf (← →)</span>
                <button type="button" onClick={() => setPipette(null)} className="h-8 rounded-full bg-white/10 px-3 font-medium hover:bg-white/20">
                  Abbrechen
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ---------- change requests ---------- */}
        {panel && (
          <aside className="absolute inset-x-0 bottom-0 z-20 flex max-h-[58%] flex-col border-t border-white/10 bg-[#12131d] lg:static lg:max-h-none lg:w-[360px] lg:shrink-0 lg:border-l lg:border-t-0">
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
              <h2 className="mb-2 mt-4 text-[12px] font-semibold uppercase tracking-[0.1em] text-white/45">Von diesem Entwurf übernehmen</h2>
              <div className="flex flex-wrap gap-1.5">
                {pickKeys.map((key) => {
                  const on = board.picks[key] === item.id;
                  const elsewhere = !on && board.picks[key] ? items.find((i) => i.id === board.picks[key]) : undefined;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => togglePick(key)}
                      aria-pressed={on}
                      title={elsewhere ? `Bisher: ${itemName(elsewhere)}` : undefined}
                      className={cn("flex h-8 items-center gap-1.5 rounded-full border px-3 text-[12.5px] font-medium transition-colors", on ? "border-emerald-400 bg-emerald-400 text-black" : "border-white/15 text-white/70 hover:border-white/40")}
                    >
                      {on && <Check className="size-3.5" strokeWidth={3} />}
                      {pickLabels[key]}
                      {elsewhere && <span className="size-1.5 rounded-full bg-white/40" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>

              <div className="mb-2 mt-5 flex items-center justify-between gap-3">
                <h2 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-white/45">Änderungswünsche</h2>
                <span className="text-[11.5px] text-white/40">{saved ? "Gespeichert" : "Speichert …"}</span>
              </div>
              {item.pins.length === 0 ? (
                <p className="rounded-[12px] border border-dashed border-white/15 px-3.5 py-4 text-[13px] leading-[1.5] text-white/55">
                  Noch keine Markierung. „Markieren" antippen, oben die Art wählen (Gefällt, Farbe, Kleiner …) und dann die Stelle im Bild.
                </p>
              ) : (
                <ol className="space-y-2">
                  {item.pins.map((pin, i) => {
                    const pinKind = kindOf(pin);
                    return (
                      <li key={pin.id} className={cn("rounded-[12px] border p-2.5 transition-colors", activePin === pin.id ? "border-[#6865FF] bg-[#6865FF]/10" : "border-white/10")} onFocusCapture={() => setActivePin(pin.id)}>
                        <div className="flex items-center gap-2">
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-full text-[11.5px] font-bold" style={{ backgroundColor: pin.done ? "#10b981" : pinKinds[pinKind].tone }}>
                            {i + 1}
                          </span>
                          <div className="flex min-w-0 flex-1 gap-0.5" role="group" aria-label={`Art der Markierung ${i + 1}`}>
                            {pinKindOrder.map((k) => {
                              const Icon = pinKinds[k].icon;
                              return (
                                <button key={k} type="button" onClick={() => patchPin(pin.id, { kind: k })} aria-pressed={pinKind === k} aria-label={pinKinds[k].hint} title={pinKinds[k].hint} className={cn("flex size-7 items-center justify-center rounded-md transition-colors", pinKind === k ? "bg-white text-black" : "text-white/45 hover:bg-white/10 hover:text-white")}>
                                  <Icon className="size-3.5" />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <p className="mt-2 text-[12px] font-semibold text-white/85">{pinKinds[pinKind].hint}</p>

                        {pinKind === "colour" && (
                          <div className="mt-1.5 flex items-center gap-2">
                            <label className="relative size-8 shrink-0 cursor-pointer overflow-hidden rounded-full border-2 border-white/60" style={{ backgroundColor: pin.colour ?? "transparent" }} title="Farbe wählen">
                              <input type="color" value={pin.colour ?? "#6865ff"} onChange={(e) => patchPin(pin.id, { colour: e.target.value })} className="absolute inset-0 cursor-pointer opacity-0" aria-label="Wunschfarbe wählen" />
                            </label>
                            <span className="w-[66px] text-[12.5px] tabular-nums text-white/70">{pin.colour?.toUpperCase() ?? "offen"}</span>
                            <button
                              type="button"
                              onClick={() => setPipette({ itemId: item.id, pinId: pin.id })}
                              className="flex h-8 items-center gap-1.5 rounded-full border border-white/20 px-3 text-[12px] font-medium text-white/85 hover:border-white/50"
                            >
                              <Pipette className="size-3.5" />
                              Aus einem Bild holen
                            </button>
                          </div>
                        )}

                        {pinKind === "image" && (
                          <div className="mt-1.5 flex items-center gap-2">
                            {pin.image && <img src={src(pin.image)} alt="Beispielbild" className="size-12 rounded-md object-cover" />}
                            <label className="flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-white/20 px-3 text-[12px] font-medium text-white/85 hover:border-white/50">
                              <ImagePlus className="size-3.5" />
                              {pin.image ? "Anderes Beispiel" : "Beispielbild hochladen"}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const image = await uploadImage(file).catch(() => null);
                                  if (image) patchPin(pin.id, { image });
                                }}
                              />
                            </label>
                          </div>
                        )}

                        <textarea
                          id={`pin-${pin.id}`}
                          value={pin.text}
                          onChange={(e) => patchPin(pin.id, { text: e.target.value })}
                          rows={Math.min(6, Math.max(1, Math.ceil(pin.text.length / 36)))}
                          placeholder={placeholders[pinKind]}
                          className={cn("mt-1.5 block w-full resize-none bg-transparent text-[13.5px] leading-[1.45] outline-none placeholder:text-white/30", pin.done && "text-white/45 line-through")}
                        />
                        <div className="mt-1 flex items-center justify-between">
                          <label className="flex cursor-pointer items-center gap-1.5 text-[11.5px] text-white/50">
                            <input type="checkbox" checked={pin.done} onChange={(e) => patchPin(pin.id, { done: e.target.checked })} className="size-3.5 accent-emerald-500" />
                            erledigt
                          </label>
                          <button type="button" onClick={() => setPins(item.pins.filter((p) => p.id !== pin.id))} className="flex size-7 items-center justify-center rounded-md text-white/40 hover:bg-white/10 hover:text-rose-400" aria-label={`Markierung ${i + 1} löschen`}>
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}

              <h3 className="mb-2 mt-5 text-[12px] font-semibold uppercase tracking-[0.1em] text-white/45">Allgemein zu diesem Entwurf</h3>
              <textarea
                value={item.notes}
                onChange={(e) => onChange(item.id, { notes: e.target.value })}
                rows={3}
                placeholder={"z. B. Farbe gefällt, Schrift zu streng,\nLogo lieber wie bei Entwurf 2 …"}
                className="block w-full resize-y rounded-[12px] border border-white/10 bg-white/[0.04] p-3 text-[13.5px] leading-[1.5] outline-none placeholder:text-white/30 focus:border-white/35"
              />
            </div>
          </aside>
        )}
      </div>

      {/* ---------- all designs ---------- */}
      <nav className="flex h-[78px] shrink-0 items-center gap-2 overflow-x-auto border-t border-white/[0.08] px-3 [scrollbar-width:thin]" aria-label="Alle Entwürfe">
        {items.map((it, i) => {
          const taken = pickKeys.filter((key) => board.picks[key] === it.id).length;
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => onIndex(i)}
              aria-current={i === index}
              title={itemName(it)}
              className={cn("relative h-[56px] w-[76px] shrink-0 overflow-hidden rounded-[8px] border-2 transition-[border-color,opacity]", i === index ? "border-white" : "border-transparent opacity-55 hover:opacity-100", it.status === "out" && i !== index && "opacity-25")}
            >
              <img src={src(it.image)} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
              {it.status && <span className={cn("absolute right-1 top-1 size-2.5 rounded-full ring-2 ring-black/50", it.status === "favorite" ? "bg-amber-400" : it.status === "maybe" ? "bg-sky-400" : "bg-rose-500")} />}
              {it.pins.length > 0 && <span className="absolute bottom-0.5 left-0.5 rounded bg-black/70 px-1 text-[10px] font-semibold leading-4">{it.pins.length}</span>}
              {taken > 0 && <span className="absolute bottom-0.5 right-0.5 flex items-center gap-0.5 rounded bg-emerald-400 px-1 text-[10px] font-bold leading-4 text-black">✓{taken}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
