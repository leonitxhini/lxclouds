import { ChevronLeft, ChevronRight, LayoutGrid, Maximize, Minimize, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { EditApi } from "@/demo/edit";
import { ChapterView, Cover, FolioFrame, RoleBadge, SummaryView } from "./Folio";
import { roles } from "./roles";
import type { FolioDoc } from "./types";

type Slide = { key: string; label: string; render: () => ReactNode };

/** The folio as a full-screen presentation for the meeting: cover, team, summary, one slide per chapter, next steps. */
/** `choose` lets favourites and choices be set during the meeting; texts stay as they are. */
export function Present({ doc, onClose, start = 0, choose = null }: { doc: FolioDoc; onClose: () => void; start?: number; choose?: EditApi["set"] | null }) {
  const root = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(start);
  const [overview, setOverview] = useState(false);
  const [full, setFull] = useState(false);

  const visible = doc.chapters.map((c, i) => [c, i] as const).filter(([c]) => !c.hidden);
  const next = doc.chapters.flatMap((c) => c.blocks).find((b) => b.type === "checklist" && /nächste schritte/i.test(b.title));
  const slides: Slide[] = [
    {
      key: "cover",
      label: "Titel",
      render: () => <Cover doc={doc} />,
    },
    { key: "summary", label: "Auf einen Blick", render: () => <SummaryView doc={doc} /> },
    ...visible.map(([chapter, i], n) => ({ key: chapter.id, label: chapter.title, render: () => <ChapterView chapter={chapter} index={i} number={n + 1} total={visible.length} /> })),
    {
      key: "end",
      label: "Wie es weitergeht",
      render: () => (
        <div className="flex min-h-full flex-col justify-center">
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-(--p)">Wie es weitergeht</p>
          <h2 className="mt-4 text-[38px] font-semibold leading-[1.05] tracking-[-0.035em] @3xl:text-[60px]">Bereit für den nächsten Schritt?</h2>
          {next?.type === "checklist" && (
            <ol className="mt-10 grid gap-3 @3xl:grid-cols-2">
              {next.items.map((item, i) => (
                <li key={i} className="flex gap-4 rounded-[16px] border border-(--line) bg-white p-5">
                  <span className="text-[24px] font-semibold leading-none text-(--p)">{i + 1}</span>
                  <span className="text-[17px] leading-[1.4]">
                    {item.text}
                    <span className="mt-1 block text-[13px] text-(--mut)">{item.who}</span>
                  </span>
                </li>
              ))}
            </ol>
          )}
          <p className="mt-12 text-[15px] text-(--mut)">lxclouds.com · info@lxclouds.com</p>
        </div>
      ),
    },
  ];

  const go = useCallback((to: number) => setIndex(Math.max(0, Math.min(slides.length - 1, to))), [slides.length]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (overview) return setOverview(false);
        if (!document.fullscreenElement) onClose();
      }
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        go(index + 1);
      }
      if (e.key === "ArrowLeft" || e.key === "PageUp") go(index - 1);
      if (e.key === "Home") go(0);
      if (e.key === "End") go(slides.length - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index, onClose, overview, slides.length]);

  useEffect(() => {
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onFull = () => setFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFull);
    return () => {
      document.body.style.overflow = before;
      document.removeEventListener("fullscreenchange", onFull);
    };
  }, []);

  const swipe = useRef<{ x: number; y: number } | null>(null);
  const down = (e: PointerEvent) => {
    swipe.current = e.pointerType === "touch" ? { x: e.clientX, y: e.clientY } : null;
  };
  const up = (e: PointerEvent) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 80 && Math.abs(dx) > Math.abs(e.clientY - s.y) * 1.6) go(index + (dx < 0 ? 1 : -1));
  };

  const slide = slides[index];
  const chapter = doc.chapters.find((c) => c.id === slide.key);

  return (
    <div ref={root} className="fixed inset-0 z-[80] flex flex-col bg-[#F7F6F2]" onPointerDown={down} onPointerUp={up}>
      <FolioFrame doc={doc} choose={choose} className="flex min-h-0 flex-1 flex-col">
        <div className="h-1 shrink-0 bg-(--fg)/[0.06]">
          <div className="h-full bg-(--p) transition-[width] duration-500" style={{ width: `${((index + 1) / slides.length) * 100}%` }} />
        </div>
        <header className="flex h-14 shrink-0 items-center gap-2 px-3 @3xl:px-5">
          <button type="button" onClick={onClose} className="flex size-10 items-center justify-center rounded-[10px] text-(--mut) hover:bg-(--fg)/[0.06] hover:text-(--fg)" aria-label="Präsentation beenden">
            <X className="size-5" />
          </button>
          <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium text-(--mut)">
            {doc.meta.client} · {slide.label}
          </span>
          {chapter && <RoleBadge role={chapter.role} className="hidden @2xl:inline-flex" />}
          <span className="ml-2 text-[13px] tabular-nums text-(--mut)">
            {index + 1} / {slides.length}
          </span>
          <button type="button" onClick={() => setOverview(!overview)} aria-pressed={overview} className="flex size-10 items-center justify-center rounded-[10px] text-(--mut) hover:bg-(--fg)/[0.06] hover:text-(--fg)" aria-label="Alle Folien">
            <LayoutGrid className="size-[18px]" />
          </button>
          <button
            type="button"
            onClick={() => (document.fullscreenElement ? document.exitFullscreen() : root.current?.requestFullscreen?.())?.catch(() => {})}
            className="hidden size-10 items-center justify-center rounded-[10px] text-(--mut) hover:bg-(--fg)/[0.06] hover:text-(--fg) @2xl:flex"
            aria-label="Vollbild"
          >
            {full ? <Minimize className="size-[18px]" /> : <Maximize className="size-[18px]" />}
          </button>
        </header>

        <div ref={scroller} className="relative min-h-0 flex-1 overflow-y-auto">
          {overview ? (
            <ol className="mx-auto grid max-w-[1180px] gap-3 px-4 py-6 @2xl:grid-cols-2 @5xl:grid-cols-3">
              {slides.map((s, i) => {
                const ch = doc.chapters.find((c) => c.id === s.key);
                return (
                  <li key={s.key}>
                    <button
                      type="button"
                      onClick={() => {
                        go(i);
                        setOverview(false);
                      }}
                      className={cn("flex w-full items-center gap-3 rounded-[14px] border bg-white p-4 text-left transition-colors hover:border-(--p)", i === index ? "border-(--p)" : "border-(--line)")}
                    >
                      <span className="text-[13px] font-semibold tabular-nums text-(--mut)">{String(i + 1).padStart(2, "0")}</span>
                      {ch && <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: roles[ch.role].tone }} />}
                      <span className="min-w-0 truncate text-[15px] font-medium">{s.label}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          ) : (
            <div key={slide.key} className="mx-auto min-h-full max-w-[1180px] px-5 pb-28 pt-4 animate-in fade-in slide-in-from-right-4 duration-500 @3xl:px-10 @3xl:pt-8">
              {slide.render()}
            </div>
          )}
        </div>

        {!overview && (
          <div className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center gap-2">
            <button type="button" onClick={() => go(index - 1)} disabled={index === 0} className="pointer-events-auto flex size-12 items-center justify-center rounded-full bg-(--fg) text-white shadow-xl transition-opacity disabled:opacity-25" aria-label="Zurück">
              <ChevronLeft className="size-6" />
            </button>
            <button type="button" onClick={() => go(index + 1)} disabled={index === slides.length - 1} className="pointer-events-auto flex h-12 items-center gap-2 rounded-full bg-(--p) px-5 text-[14.5px] font-semibold text-(--p-on) shadow-xl transition-opacity disabled:opacity-25" aria-label="Weiter">
              {slides[index + 1]?.label ?? "Ende"}
              <ChevronRight className="size-5" />
            </button>
          </div>
        )}
      </FolioFrame>
    </div>
  );
}
