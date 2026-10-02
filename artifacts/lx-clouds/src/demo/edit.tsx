import { ArrowDown, ArrowUp, ImagePlus, Plus, Trash2 } from "lucide-react";
import { createContext, createElement, useContext, useLayoutEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import { asset, cn } from "@/lib/utils";
import type { Meta, Path } from "./types";

/** What the editor offers the blocks. Without it the site is rendered read-only. */
export type EditApi = {
  set: (blockId: string, path: Path, value: unknown) => void;
  setMeta: (key: keyof Meta, value: string) => void;
  pickImage: (blockId: string, path: Path) => void;
  pickIcon: (blockId: string, path: Path, current: string) => void;
  add: (blockId: string, path: Path, item: unknown) => void;
  remove: (blockId: string, path: Path, index: number) => void;
  move: (blockId: string, path: Path, index: number, by: -1 | 1) => void;
};

export const EditContext = createContext<EditApi | null>(null);
export const BlockContext = createContext("");

export const useEdit = () => useContext(EditContext);

/** Uploaded and bundled images are site-relative; anything else is used as given. */
export const imageUrl = (src: string) => (src.startsWith("/") ? asset(src) : src);

type TextProps = {
  value: string;
  /** Position inside the current block's props … */
  path?: Path;
  /** … or a field of the company data, shared by all blocks. */
  meta?: keyof Meta;
  as?: string;
  className?: string;
  /** Keeps line breaks and lets Enter start a new line. */
  multiline?: boolean;
  placeholder?: string;
};

/** Text that can be typed over directly in the preview while editing. */
export function T({ value, path, meta, as = "span", className, multiline, placeholder = "Text" }: TextProps) {
  const edit = useEdit();
  const blockId = useContext(BlockContext);
  const ref = useRef<HTMLElement>(null);

  // The DOM owns the text while it is being typed; React only writes it when the value changes elsewhere.
  useLayoutEffect(() => {
    const el = ref.current;
    if (el && document.activeElement !== el && el.innerText !== value) el.innerText = value;
  }, [value, edit]);

  if (!edit) {
    if (!value) return null;
    return createElement(as, { className: cn(className, multiline && "whitespace-pre-line") }, value);
  }

  const commit = (el: HTMLElement) => {
    const next = el.innerText.replace(/ /g, " ").trim();
    if (next === value) return;
    if (meta) edit.setMeta(meta, next);
    else if (path) edit.set(blockId, path, next);
  };

  return createElement(as, {
    ref,
    className: cn(className, "demo-editable", multiline && "whitespace-pre-line"),
    contentEditable: true,
    suppressContentEditableWarning: true,
    spellCheck: false,
    "data-placeholder": placeholder,
    onBlur: (e: { currentTarget: HTMLElement }) => commit(e.currentTarget),
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
      if (e.key === "Enter" && !multiline) {
        e.preventDefault();
        e.currentTarget.blur();
      }
      if (e.key === "Escape") {
        e.currentTarget.innerText = value;
        e.currentTarget.blur();
      }
      e.stopPropagation();
    },
    onPaste: (e: { preventDefault: () => void; clipboardData: DataTransfer }) => {
      e.preventDefault();
      document.execCommand("insertText", false, e.clipboardData.getData("text/plain"));
    },
  });
}

/** An image that can be swapped by clicking it while editing. */
export function Img({ src, path, alt, className }: { src: string; path: Path; alt: string; className?: string }) {
  const edit = useEdit();
  const blockId = useContext(BlockContext);
  return (
    <div className={cn("group/img relative overflow-hidden bg-(--soft)", className)}>
      {src ? (
        <img src={imageUrl(src)} alt={alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-(--p)/50">
          <ImagePlus className="size-8" strokeWidth={1.4} aria-hidden="true" />
        </div>
      )}
      {edit && (
        <button
          type="button"
          onClick={() => edit.pickImage(blockId, path)}
          className="absolute inset-0 flex items-end justify-end bg-black/0 p-3 opacity-0 transition-[opacity,background-color] duration-200 hover:bg-black/25 focus-visible:opacity-100 group-hover/img:opacity-100"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12px] font-semibold text-[#14151c] shadow-lg [font-family:Outfit,sans-serif]">
            <ImagePlus className="size-3.5" aria-hidden="true" />
            Bild ändern
          </span>
        </button>
      )}
    </div>
  );
}

const tool = "flex size-7 items-center justify-center rounded-md text-[#14151c] hover:bg-[#f0efff] disabled:opacity-30";

/** Move / delete controls for one entry of a list; shown on hover while editing. Parent needs `group/item relative`. */
export function ItemTools({ path, index, count }: { path: Path; index: number; count: number }) {
  const edit = useEdit();
  const blockId = useContext(BlockContext);
  if (!edit) return null;
  return (
    <div className="absolute right-1.5 top-1.5 z-10 hidden rounded-lg border border-black/10 bg-white p-0.5 shadow-lg group-focus-within/item:flex group-hover/item:flex">
      <button type="button" className={tool} disabled={index === 0} onClick={() => edit.move(blockId, path, index, -1)} aria-label="Nach vorn">
        <ArrowUp className="size-3.5" />
      </button>
      <button type="button" className={tool} disabled={index === count - 1} onClick={() => edit.move(blockId, path, index, 1)} aria-label="Nach hinten">
        <ArrowDown className="size-3.5" />
      </button>
      <button type="button" className={cn(tool, "hover:bg-red-50 hover:text-red-600")} onClick={() => edit.remove(blockId, path, index)} aria-label="Entfernen">
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
}

/** "Add another" button for a list; only while editing. */
export function AddItem({ path, item, label, className }: { path: Path; item: unknown; label: string; className?: string }) {
  const edit = useEdit();
  const blockId = useContext(BlockContext);
  if (!edit) return null;
  return (
    <button
      type="button"
      onClick={() => edit.add(blockId, path, item)}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-dashed border-(--p)/50 px-3.5 py-1.5 text-[12.5px] font-medium text-(--p) [font-family:Outfit,sans-serif] hover:bg-(--soft)",
        className,
      )}
    >
      <Plus className="size-3.5" aria-hidden="true" />
      {label}
    </button>
  );
}

export function EditOnly({ children }: { children: ReactNode }) {
  return useEdit() ? <>{children}</> : null;
}
