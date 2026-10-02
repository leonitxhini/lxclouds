import { ArrowLeftRight, MapPin, Star } from "lucide-react";
import { useContext, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { cn } from "@/lib/utils";
import { BlockContext, Img, useEdit } from "../edit";
import { icons } from "../icons";
import type { DemoDoc, Path } from "../types";

// Shared by all design languages. Layout reacts to the width of the demo itself (container queries),
// so the phone and tablet previews in the editor are the real layout.
export const wrap = "mx-auto w-full max-w-[1200px] px-5 @2xl:px-8";

export function Stars({ className, count = 5 }: { className?: string; count?: number }) {
  return (
    <span className={cn("inline-flex gap-0.5", className)} role="img" aria-label={`${count} von 5 Sternen`}>
      {Array.from({ length: count }, (_, i) => (
        <Star key={i} className="size-[1em] fill-current" strokeWidth={0} aria-hidden="true" />
      ))}
    </span>
  );
}

/** Round badge with a person's initials, for reviews without a photo. */
export function Initials({ name, className }: { name: string; className?: string }) {
  const letters = name
    .split(/\s+/)
    .map((w) => w[0])
    .filter((c) => c && /\p{L}/u.test(c))
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span className={cn("flex shrink-0 items-center justify-center rounded-full font-semibold", className)} aria-hidden="true">
      {letters || "·"}
    </span>
  );
}

/** An icon from the icon set; while editing a click opens the icon picker. */
export function IconPick({ name, path, className, iconClassName, strokeWidth = 1.7 }: { name: string; path: Path; className?: string; iconClassName?: string; strokeWidth?: number }) {
  const edit = useEdit();
  const blockId = useContext(BlockContext);
  const Icon = icons[name] ?? icons.star;
  return (
    <button
      type="button"
      disabled={!edit}
      onClick={() => edit?.pickIcon(blockId, path, name)}
      className={cn("flex shrink-0 items-center justify-center", edit && "cursor-pointer hover:ring-2 hover:ring-(--p)", className)}
      aria-label={edit ? "Symbol ändern" : undefined}
      tabIndex={edit ? 0 : -1}
    >
      <Icon className={iconClassName} strokeWidth={strokeWidth} aria-hidden="true" />
    </button>
  );
}

/** The links of the demo's navigation, for footers that repeat them. */
export function navLinks(doc: DemoDoc): string[] {
  const nav = doc.blocks.find((b) => b.type === "nav");
  return nav?.type === "nav" ? nav.props.links : [];
}

/** A drawn street map with a pin; stands in for an embedded map in a demo. */
export function MapArt({ className, label, style }: { className?: string; label?: string; style?: CSSProperties }) {
  return (
    <div className={cn("relative overflow-hidden bg-[color-mix(in_srgb,var(--fg)_6%,var(--bg))]", className)} style={style}>
      <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <g stroke="var(--card)" strokeLinecap="round" fill="none">
          <path d="M-20 70 L140 40 L260 90 L430 60" strokeWidth="14" />
          <path d="M-20 190 L120 170 L220 210 L430 180" strokeWidth="14" />
          <path d="M90 -20 L140 40 L120 170 L150 290" strokeWidth="11" />
          <path d="M290 -20 L260 90 L220 210 L250 290" strokeWidth="11" />
          <path d="M-20 130 L430 125" strokeWidth="7" />
          <path d="M190 -20 L195 290" strokeWidth="6" />
          <path d="M340 -20 L355 290" strokeWidth="6" />
          <path d="M30 -20 L45 290" strokeWidth="5" />
        </g>
        <path d="M150 130 L255 128 L222 205 L125 172 Z" fill="color-mix(in srgb, var(--p) 16%, transparent)" />
        <circle cx="330" cy="215" r="34" fill="color-mix(in srgb, var(--p) 12%, transparent)" />
      </svg>
      <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center">
        {label && <span className="mb-1.5 max-w-[200px] truncate rounded-full bg-(--card) px-3 py-1 text-[12px] font-semibold text-(--fg) shadow-[0_6px_18px_-6px_rgba(0,0,0,0.35)]">{label}</span>}
        <MapPin className="size-9 fill-(--p) text-(--card)" strokeWidth={1.4} aria-hidden="true" />
      </span>
    </div>
  );
}

/** Two photos behind a draggable divider: before and after. */
export function BeforeAfter({ before, after, beforePath, afterPath, className, labels = ["Vorher", "Nachher"] }: { before: string | undefined; after: string | undefined; beforePath: Path; afterPath: Path; className?: string; labels?: [string, string] }) {
  const [split, setSplit] = useState(50);
  const dragging = useRef(false);
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const box = e.currentTarget.getBoundingClientRect();
    setSplit(Math.min(94, Math.max(6, ((e.clientX - box.left) / box.width) * 100)));
  };
  const tag = "absolute top-4 rounded-full bg-(--card) px-3.5 py-1.5 text-[11.5px] font-bold uppercase tracking-[0.08em] text-(--fg) shadow-md";
  return (
    <div className={cn("relative touch-pan-y select-none overflow-hidden", className)} onPointerMove={move} onPointerUp={() => (dragging.current = false)} onPointerLeave={() => (dragging.current = false)}>
      <Img src={after} path={afterPath} alt={labels[1]} className="absolute inset-0 h-full w-full" chip="br" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
        <Img src={before} path={beforePath} alt={labels[0]} className="absolute inset-0 h-full w-full" chip="bl" />
      </div>
      <span className={cn(tag, "left-4")}>{labels[0]}</span>
      <span className={cn(tag, "right-4")}>{labels[1]}</span>
      <div className="absolute inset-y-0 w-[3px] -translate-x-1/2 bg-(--card)" style={{ left: `${split}%` }}>
        <button
          type="button"
          onPointerDown={(e) => {
            dragging.current = true;
            e.currentTarget.parentElement?.parentElement?.setPointerCapture(e.pointerId);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setSplit((v) => Math.max(6, v - 4));
            if (e.key === "ArrowRight") setSplit((v) => Math.min(94, v + 4));
          }}
          className="absolute left-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-(--p) text-(--p-on) shadow-lg"
          aria-label="Vorher und Nachher vergleichen"
        >
          <ArrowLeftRight className="size-4.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
