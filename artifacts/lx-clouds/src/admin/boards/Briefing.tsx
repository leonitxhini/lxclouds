import { Check, Copy, Eraser, Plus, Printer, Star, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import { asset, cn } from "@/lib/utils";
import { api, ApiError, type Board, type BoardItem, type OfferLine } from "../api";
import { Btn, useToast } from "../ui";
import { euro, itemName, kindOf, offerTotals, pickKeys, pickLabels, pinKinds, pinText, summaryText } from "./model";

const src = (url: string) => (url.startsWith("/") ? asset(url) : url);
const heading = "mb-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-faint";
const cell = "h-9 w-full rounded-[8px] border border-ink/12 bg-white px-2.5 text-[14px] outline-none focus:border-accent print:border-0 print:px-0";
const offerPresets = [
  { title: "Website nach gewähltem Entwurf", unit: "once" },
  { title: "Logo und Markenpaket", unit: "once" },
  { title: "Texte und Bildauswahl", unit: "once" },
  { title: "Pflege und Hosting", unit: "month" },
] as const;

/** A field to sign in with finger, pen or mouse; hands back a PNG. */
function SignaturePad({ onChange }: { onChange: (png: string | null) => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [empty, setEmpty] = useState(true);

  const point = (e: PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: ((e.clientX - rect.left) / rect.width) * e.currentTarget.width, y: ((e.clientY - rect.top) / rect.height) * e.currentTarget.height };
  };
  const start = (e: PointerEvent<HTMLCanvasElement>) => {
    const ctx = e.currentTarget.getContext("2d")!;
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    ctx.lineWidth = 3.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#11121b";
    const { x, y } = point(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const move = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = e.currentTarget.getContext("2d")!;
    const { x, y } = point(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  const end = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    drawing.current = false;
    setEmpty(false);
    onChange(e.currentTarget.toDataURL("image/png"));
  };
  const clear = () => {
    const el = canvas.current!;
    el.getContext("2d")!.clearRect(0, 0, el.width, el.height);
    setEmpty(true);
    onChange(null);
  };

  return (
    <div className="relative">
      <canvas ref={canvas} width={900} height={260} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end} className="block h-[150px] w-full touch-none rounded-[12px] border border-dashed border-ink/25 bg-white" aria-label="Unterschriftsfeld" />
      {empty && <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-[13.5px] text-faint">Hier unterschreiben</span>}
      {!empty && (
        <button type="button" onClick={clear} className="absolute right-2 top-2 flex h-8 items-center gap-1.5 rounded-full bg-ink/[0.06] px-3 text-[12px] font-medium hover:bg-ink/10">
          <Eraser className="size-3.5" /> Neu
        </button>
      )}
    </div>
  );
}

type Props = { board: Board; items: BoardItem[]; onBoard: (patch: Partial<Board>, now?: boolean) => void; onClose: () => void };

/** The outcome of the meeting on one page: direction, what to take from which design, changes, offer and the client's sign-off. Prints as a document. */
export function Briefing({ board, items, onBoard, onClose }: Props) {
  const toast = useToast();
  const [name, setName] = useState(board.client_name ?? "");
  const [signature, setSignature] = useState<string | null>(null);
  const favourites = items.filter((i) => i.status === "favorite");
  const out = items.filter((i) => i.status === "out");
  const changed = items.filter((i) => i.pins.length > 0 || i.notes.trim());
  const totals = offerTotals(board);
  const text = summaryText(board, items);

  useEffect(() => {
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("briefing-open");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !/^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement).tagName) && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = before;
      document.body.classList.remove("briefing-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const setLine = (id: string, patch: Partial<OfferLine>) => onBoard({ offer: board.offer.map((l) => (l.id === id ? { ...l, ...patch } : l)) });
  const addLine = (title = "", unit: OfferLine["unit"] = "once") => onBoard({ offer: [...board.offer, { id: Math.random().toString(36).slice(2, 10), title, text: "", price: 0, unit }] });

  return createPortal(
    <div className="briefing fixed inset-0 z-[80] overflow-y-auto bg-paper text-ink print:static print:overflow-visible print:bg-white">
      <div className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b border-ink/[0.08] bg-paper/95 px-3 backdrop-blur print:hidden">
        <button type="button" onClick={onClose} className="flex size-10 items-center justify-center rounded-[10px] hover:bg-ink/[0.06]" aria-label="Schließen">
          <X className="size-5" />
        </button>
        <span className="flex-1 truncate text-[15px] font-semibold">Auftrag</span>
        <Btn
          variant="ghost"
          size="sm"
          onClick={async () => {
            await navigator.clipboard.writeText(text).catch(() => {});
            toast("Text kopiert");
          }}
        >
          <Copy className="size-4" />
          <span className="hidden sm:inline">Text kopieren</span>
        </Btn>
        {board.client_id && (
          <Btn
            variant="outline"
            size="sm"
            onClick={async () => {
              try {
                await api("/activities", { method: "POST", body: { client_id: board.client_id, kind: "meeting", text } });
                toast("In der Kundenakte gespeichert");
              } catch (err) {
                toast((err as ApiError).message, "error");
              }
            }}
          >
            In Kundenakte
          </Btn>
        )}
        <Btn variant="accent" size="sm" onClick={() => window.print()}>
          <Printer className="size-4" />
          Drucken / PDF
        </Btn>
      </div>

      <div className="mx-auto max-w-[940px] px-5 py-8 sm:px-8 sm:py-10 print:max-w-none print:p-0">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/10 pb-6">
          <div>
            <p className="eyebrow">Auftrag · Design-Abstimmung</p>
            <h1 className="mt-2 text-[30px] font-semibold leading-[1.1] tracking-[-0.03em]">{board.client_name ?? board.title}</h1>
            <p className="mt-1 text-[14.5px] text-muted">{board.title}</p>
          </div>
          <p className="text-right text-[13.5px] text-muted">
            lxclouds.com
            <br />
            {new Date().toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </header>

        {/* ---------- direction ---------- */}
        <section className="mt-8 break-inside-avoid">
          <h2 className={heading}>Gewählte Richtung</h2>
          {favourites.length === 0 ? (
            <p className="text-[14.5px] text-muted">Noch kein Favorit markiert.</p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {favourites.map((item) => (
                <li key={item.id} className="overflow-hidden rounded-[14px] border border-ink/10 bg-white">
                  <img src={src(item.image)} alt="" className="aspect-[4/3] w-full object-contain" />
                  <p className="flex items-center gap-2 border-t border-ink/[0.07] px-4 py-3 text-[15px] font-semibold">
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                    {itemName(item)}
                  </p>
                </li>
              ))}
            </ul>
          )}
          {out.length > 0 && <p className="mt-3 text-[13.5px] text-muted">Nicht weiterverfolgt: {out.map(itemName).join(", ")}</p>}
        </section>

        {/* ---------- mix ---------- */}
        <section className="mt-9 break-inside-avoid">
          <h2 className={heading}>Wunsch-Kombination</h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {pickKeys.map((key) => {
              const item = items.find((i) => i.id === board.picks[key]);
              return (
                <li key={key} className="overflow-hidden rounded-[12px] border border-ink/10 bg-white">
                  <div className="aspect-[16/9] bg-ink/[0.04]">{item && <img src={src(item.image)} alt="" className="h-full w-full object-cover object-top" />}</div>
                  <div className="px-3 py-2.5">
                    <p className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-accent-ink">{pickLabels[key]}</p>
                    <select
                      value={item?.id ?? ""}
                      onChange={(e) => {
                        const picks = { ...board.picks };
                        if (e.target.value) picks[key] = Number(e.target.value);
                        else delete picks[key];
                        onBoard({ picks });
                      }}
                      className="mt-0.5 block w-full truncate bg-transparent text-[13.5px] font-medium outline-none print:appearance-none"
                      aria-label={`${pickLabels[key]} übernehmen von`}
                    >
                      <option value="">noch offen</option>
                      {items.map((i) => (
                        <option key={i.id} value={i.id}>
                          wie {itemName(i)}
                        </option>
                      ))}
                    </select>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ---------- changes ---------- */}
        <section className="mt-9">
          <h2 className={heading}>Änderungen</h2>
          {changed.length === 0 && !board.notes.trim() && <p className="text-[14.5px] text-muted">Keine Änderungswünsche festgehalten.</p>}
          {board.notes.trim() && <p className="mb-5 whitespace-pre-line rounded-[12px] border border-ink/10 bg-white p-4 text-[14.5px] leading-[1.55]">{board.notes.trim()}</p>}
          <div className="space-y-5">
            {changed.map((item) => (
              <article key={item.id} className="grid break-inside-avoid gap-4 rounded-[14px] border border-ink/10 bg-white p-4 sm:grid-cols-[1.1fr_1fr]">
                <div className="relative self-start overflow-hidden rounded-[8px] border border-ink/[0.07]">
                  <img src={src(item.image)} alt="" className="block w-full" />
                  {item.pins.map((pin, i) => (
                    <span key={pin.id} className="absolute flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white text-[11px] font-bold text-white shadow [print-color-adjust:exact]" style={{ left: `${pin.x}%`, top: `${pin.y}%`, backgroundColor: pinKinds[kindOf(pin)].tone }}>
                      {i + 1}
                    </span>
                  ))}
                </div>
                <div className="min-w-0">
                  <h3 className="text-[16px] font-semibold">{itemName(item)}</h3>
                  {item.notes.trim() && <p className="mt-1.5 whitespace-pre-line text-[14px] leading-[1.5] text-muted">{item.notes.trim()}</p>}
                  <ol className="mt-3 space-y-2.5">
                    {item.pins.map((pin, i) => (
                      <li key={pin.id} className="flex gap-2.5 text-[14px] leading-[1.45]">
                        <span className="mt-px flex size-[22px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white [print-color-adjust:exact]" style={{ backgroundColor: pinKinds[kindOf(pin)].tone }}>
                          {i + 1}
                        </span>
                        <span className={cn("min-w-0 flex-1", pin.done && "text-muted line-through")}>
                          {pinText(pin)}
                          {kindOf(pin) === "colour" && pin.colour && <span className="ml-2 inline-block size-4 translate-y-[3px] rounded-full border border-ink/20 [print-color-adjust:exact]" style={{ backgroundColor: pin.colour }} />}
                          {pin.image && <img src={src(pin.image)} alt="Beispielbild" className="mt-1.5 block h-20 rounded-md border border-ink/10 object-cover" />}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- offer ---------- */}
        <section className="mt-9 break-inside-avoid">
          <h2 className={heading}>Angebot</h2>
          <div className="rounded-[14px] border border-ink/10 bg-white p-4">
            {board.offer.length === 0 && <p className="text-[14px] text-muted print:hidden">Noch keine Positionen. Füge ein, was der Kunde bekommt – die Preise trägst du selbst ein.</p>}
            <ul className="divide-y divide-ink/[0.07]">
              {board.offer.map((line) => (
                <li key={line.id} className="grid grid-cols-[1fr_auto] items-start gap-x-3 gap-y-1.5 py-2.5 sm:grid-cols-[1fr_120px_130px_36px] print:grid-cols-[1fr_110px_90px] print:items-baseline">
                  <div className="min-w-0">
                    <input value={line.title} onChange={(e) => setLine(line.id, { title: e.target.value })} placeholder="Position" className={cn(cell, "font-medium")} aria-label="Position" />
                    <input value={line.text} onChange={(e) => setLine(line.id, { text: e.target.value })} placeholder="Was ist enthalten? (optional)" className={cn(cell, "mt-1 h-8 text-[13px] text-muted", !line.text && "print:hidden")} aria-label="Beschreibung" />
                  </div>
                  <div className="relative">
                    <input type="number" min={0} step={10} value={line.price || ""} onChange={(e) => setLine(line.id, { price: Number(e.target.value) })} placeholder="0" className={cn(cell, "pr-7 text-right tabular-nums print:hidden")} aria-label="Preis in Euro" />
                    <span className="pointer-events-none absolute right-2.5 top-2 text-[14px] text-faint print:hidden">€</span>
                    <span className="hidden text-right text-[14px] font-medium tabular-nums print:block">{euro(line.price)}</span>
                  </div>
                  <select value={line.unit} onChange={(e) => setLine(line.id, { unit: e.target.value as OfferLine["unit"] })} className={cn(cell, "print:appearance-none")} aria-label="Abrechnung">
                    <option value="once">einmalig</option>
                    <option value="month">pro Monat</option>
                  </select>
                  <button type="button" onClick={() => onBoard({ offer: board.offer.filter((l) => l.id !== line.id) })} className="flex size-9 items-center justify-center rounded-lg text-faint hover:bg-red-50 hover:text-red-600 print:hidden" aria-label="Position löschen">
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap items-center gap-2 print:hidden">
              <Btn variant="outline" size="sm" onClick={() => addLine()}>
                <Plus className="size-3.5" /> Position
              </Btn>
              {offerPresets
                .filter((p) => !board.offer.some((l) => l.title === p.title))
                .map((p) => (
                  <button key={p.title} type="button" onClick={() => addLine(p.title, p.unit)} className="h-8 rounded-full border border-dashed border-ink/20 px-3 text-[12.5px] text-ink/70 hover:border-accent hover:text-accent-ink">
                    + {p.title}
                  </button>
                ))}
            </div>
            {board.offer.length > 0 && (
              <dl className="mt-4 space-y-1 border-t border-ink/10 pt-3 text-[15px]">
                <div className="flex justify-between font-semibold">
                  <dt>Summe einmalig</dt>
                  <dd className="tabular-nums">{euro(totals.once)}</dd>
                </div>
                {totals.month > 0 && (
                  <div className="flex justify-between text-muted">
                    <dt>Laufend pro Monat</dt>
                    <dd className="tabular-nums">{euro(totals.month)}</dd>
                  </div>
                )}
              </dl>
            )}
          </div>
        </section>

        {/* ---------- sign-off ---------- */}
        <section className="mt-9 break-inside-avoid pb-10">
          <h2 className={heading}>Freigabe</h2>
          <div className="rounded-[14px] border border-ink/10 bg-white p-5">
            <p className="text-[14.5px] leading-[1.55]">Die oben beschriebene Richtung und die aufgeführten Änderungen werden so zur Umsetzung freigegeben.</p>
            {board.signoff ? (
              <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <img src={board.signoff.signature} alt={`Unterschrift ${board.signoff.name}`} className="h-[90px] w-auto" />
                  <p className="mt-1 border-t border-ink/25 pt-1.5 text-[13.5px]">
                    <span className="font-semibold">{board.signoff.name || "Kunde"}</span> · {new Date(board.signoff.date.replace(" ", "T") + "Z").toLocaleString("de-DE", { dateStyle: "long", timeStyle: "short" })} Uhr
                  </p>
                </div>
                <div className="flex items-center gap-2 print:hidden">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[13px] font-medium text-emerald-700">
                    <Check className="size-4" /> Freigegeben
                  </span>
                  <Btn variant="ghost" size="sm" onClick={() => window.confirm("Freigabe wirklich zurücknehmen?") && onBoard({ signoff: null }, true)}>
                    Zurücknehmen
                  </Btn>
                </div>
              </div>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end print:block">
                <div>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name des Kunden" className={cn(cell, "mb-2 max-w-[340px] print:hidden")} aria-label="Name des Kunden" />
                  <div className="print:hidden">
                    <SignaturePad onChange={setSignature} />
                  </div>
                  <p className="mt-16 hidden border-t border-ink/40 pt-1.5 text-[13px] print:block">Ort, Datum, Unterschrift</p>
                </div>
                <Btn variant="accent" disabled={!signature} className="print:hidden" onClick={() => signature && onBoard({ signoff: { name: name.trim(), date: new Date().toISOString().slice(0, 19).replace("T", " "), signature } }, true)}>
                  <Check className="size-4" />
                  Freigeben
                </Btn>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>,
    document.body,
  );
}
