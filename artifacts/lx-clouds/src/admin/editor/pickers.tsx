import QRCode from "qrcode";
import { Check, Copy, Link2, Upload } from "lucide-react";
import { useEffect, useRef, useState, type DragEvent, type FormEvent } from "react";
import { imageUrl } from "@/demo/edit";
import { iconNames, icons } from "@/demo/icons";
import { stockImages } from "@/demo/templates";
import { cn } from "@/lib/utils";
import { ApiError, uploadImage } from "../api";
import { Btn, Field, Input, Modal, Spinner, useToast } from "../ui";

/** Choose an image: upload one, paste an address, or take one from the bundled library. */
export function ImagePicker({ open, onClose, onPick }: { open: boolean; onClose: () => void; onPick: (src: string) => void }) {
  const toast = useToast();
  const input = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<"upload" | "library" | "url">("upload");
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);

  async function upload(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      onPick(await uploadImage(file));
    } catch (err) {
      toast((err as ApiError).message, "error");
    }
    setBusy(false);
  }

  function drop(e: DragEvent) {
    e.preventDefault();
    setOver(false);
    void upload(e.dataTransfer.files[0]);
  }

  function useUrl(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const url = String(new FormData(e.currentTarget).get("url") ?? "").trim();
    if (/^https?:\/\//.test(url)) onPick(url);
    else toast("Bitte eine vollständige Adresse mit https:// eingeben.", "error");
  }

  return (
    <Modal open={open} onClose={onClose} title="Bild wählen" wide>
      <div className="mb-4 flex gap-1 rounded-[12px] bg-ink/[0.05] p-1">
        {(
          [
            ["upload", "Hochladen"],
            ["library", "Bibliothek"],
            ["url", "Adresse"],
          ] as const
        ).map(([key, label]) => (
          <button key={key} type="button" onClick={() => setTab(key)} aria-pressed={tab === key} className={cn("h-8 flex-1 rounded-[9px] text-[13px] font-medium", tab === key ? "bg-white shadow-sm" : "text-ink/60 hover:text-ink")}>
            {label}
          </button>
        ))}
      </div>

      {tab === "upload" && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={drop}
          className={cn("flex flex-col items-center justify-center rounded-[16px] border-2 border-dashed px-6 py-14 text-center transition-colors", over ? "border-accent bg-accent-soft" : "border-ink/15")}
        >
          {busy ? (
            <Spinner />
          ) : (
            <>
              <Upload className="size-7 text-accent" strokeWidth={1.6} aria-hidden="true" />
              <p className="mt-3 text-[15px] font-medium">Bild hierher ziehen</p>
              <p className="mt-1 text-[13.5px] text-muted">oder vom Gerät wählen – auch direkt mit der Kamera. Bis 8 MB.</p>
              <Btn variant="accent" className="mt-5" onClick={() => input.current?.click()}>
                Datei wählen
              </Btn>
              <input ref={input} type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
            </>
          )}
        </div>
      )}

      {tab === "library" && (
        <div className="max-h-[56dvh] space-y-5 overflow-y-auto pr-1">
          {stockImages.map((group) => (
            <div key={group.label}>
              <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-faint">{group.label}</p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                {group.images.map((src) => (
                  <button key={src} type="button" onClick={() => onPick(src)} className="overflow-hidden rounded-[10px] ring-accent transition-shadow hover:ring-2 focus-visible:ring-2">
                    <img src={imageUrl(src)} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "url" && (
        <form onSubmit={useUrl} className="space-y-4">
          <Field label="Bildadresse" hint="Zum Beispiel ein Foto von der aktuellen Website des Kunden.">
            <Input name="url" type="url" placeholder="https://…" autoFocus />
          </Field>
          <Btn type="submit" variant="accent">
            Übernehmen
          </Btn>
        </form>
      )}

      <div className="mt-5 flex justify-between border-t border-ink/[0.07] pt-4">
        <Btn variant="ghost" size="sm" onClick={() => onPick("")}>
          Bild entfernen
        </Btn>
        <Btn variant="ghost" size="sm" onClick={onClose}>
          Abbrechen
        </Btn>
      </div>
    </Modal>
  );
}

export function IconPicker({ open, current, onClose, onPick }: { open: boolean; current: string; onClose: () => void; onPick: (name: string) => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Symbol wählen">
      <div className="grid grid-cols-6 gap-2">
        {iconNames.map((name) => {
          const Icon = icons[name];
          return (
            <button
              key={name}
              type="button"
              onClick={() => onPick(name)}
              aria-label={name}
              aria-pressed={current === name}
              className={cn("flex aspect-square items-center justify-center rounded-[12px] border transition-colors", current === name ? "border-accent bg-accent-soft text-accent" : "border-ink/10 hover:border-accent/50 hover:text-accent")}
            >
              <Icon className="size-6" strokeWidth={1.7} />
            </button>
          );
        })}
      </div>
    </Modal>
  );
}

/** Turn the public link on or off and hand it over: copy it, or let the client scan the code. */
export function ShareDialog({ open, onClose, slug, shared, onToggle }: { open: boolean; onClose: () => void; slug: string; shared: boolean; onToggle: (next: boolean) => void }) {
  const url = `${window.location.origin}/d/${slug}`;
  const [qr, setQr] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open && shared) QRCode.toDataURL(url, { margin: 1, width: 440, color: { dark: "#11121b", light: "#ffffff" } }).then(setQr, () => setQr(""));
  }, [open, shared, url]);

  async function copy() {
    await navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <Modal open={open} onClose={onClose} title="Demo teilen">
      <label className="flex cursor-pointer items-center justify-between gap-4 rounded-[14px] border border-ink/10 p-4">
        <span>
          <span className="block text-[14.5px] font-medium">Öffentlicher Link</span>
          <span className="block text-[13px] text-muted">{shared ? "Jeder mit dem Link kann die Demo ansehen." : "Aus – nur du siehst die Demo."}</span>
        </span>
        <input type="checkbox" checked={shared} onChange={(e) => onToggle(e.target.checked)} className="size-5 accent-[#6865ff]" />
      </label>

      {shared && (
        <>
          <div className="mt-4 flex gap-2">
            <div className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-[10px] border border-ink/12 bg-paper px-3 text-[13.5px]">
              <Link2 className="size-4 shrink-0 text-faint" aria-hidden="true" />
              <span className="truncate">{url}</span>
            </div>
            <Btn variant="accent" onClick={copy}>
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Kopiert" : "Kopieren"}
            </Btn>
          </div>
          <div className="mt-5 flex flex-col items-center rounded-[14px] bg-paper p-5">
            {qr ? <img src={qr} alt="QR-Code zur Demo" width={220} height={220} className="rounded-[10px]" /> : <Spinner />}
            <p className="mt-3 text-center text-[13px] text-muted">Der Kunde scannt den Code und hat die Demo auf seinem eigenen Handy.</p>
          </div>
        </>
      )}
    </Modal>
  );
}
