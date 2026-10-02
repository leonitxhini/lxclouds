import { ArrowDown, ArrowUp, Copy, EyeOff, Trash2 } from "lucide-react";
import type { MouseEvent } from "react";
import { cn } from "@/lib/utils";
import { renderBlock } from "./blocks";
import { BlockContext, EditContext, type EditApi } from "./edit";
import { blockLabels } from "./templates";
import { themeVars } from "./theme";
import type { DemoDoc } from "./types";

export type BlockTools = {
  move: (id: string, by: -1 | 1) => void;
  hide: (id: string) => void;
  duplicate: (id: string) => void;
  remove: (id: string) => void;
};

type Props = {
  doc: DemoDoc;
  /** Present while editing: turns texts, images and lists into editable ones. */
  edit?: EditApi | null;
  /** Present while editing: the controls shown on each section. */
  tools?: BlockTools | null;
  className?: string;
};

const tool = "flex size-7 items-center justify-center rounded-md text-[#14151c] hover:bg-[#f0efff] disabled:opacity-30";

/** Renders a demo website from its document. The root is a size container, so every block lays itself out by the demo's own width. */
export function DemoSite({ doc, edit = null, tools = null, className }: Props) {
  const visible = doc.blocks.filter((b) => !b.hidden);

  // while editing, links and buttons inside the demo must not navigate or submit
  const stopLinks = (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest("a[href]")) e.preventDefault();
  };

  return (
    <EditContext.Provider value={edit}>
      <div
        className={cn("demo-root @container bg-(--bg) text-(--fg) antialiased [font-family:var(--fb)]", edit && "demo-editing", className)}
        style={themeVars(doc.theme)}
        onClickCapture={edit ? stopLinks : undefined}
      >
        {visible.map((block, i) => (
          <BlockContext.Provider key={block.id} value={block.id}>
            <div className="group/block relative" data-block={block.id}>
              {renderBlock(block, doc)}
              {tools && (
                <div className="absolute left-3 top-3 z-20 hidden items-center gap-0.5 rounded-lg border border-black/10 bg-white p-0.5 shadow-lg [font-family:Outfit,sans-serif] group-hover/block:flex">
                  <span className="px-2 text-[11.5px] font-semibold text-[#14151c]">{blockLabels[block.type]}</span>
                  <button type="button" className={tool} disabled={i === 0} onClick={() => tools.move(block.id, -1)} aria-label="Abschnitt nach oben">
                    <ArrowUp className="size-3.5" />
                  </button>
                  <button type="button" className={tool} disabled={i === visible.length - 1} onClick={() => tools.move(block.id, 1)} aria-label="Abschnitt nach unten">
                    <ArrowDown className="size-3.5" />
                  </button>
                  <button type="button" className={tool} onClick={() => tools.duplicate(block.id)} aria-label="Abschnitt duplizieren">
                    <Copy className="size-3.5" />
                  </button>
                  <button type="button" className={tool} onClick={() => tools.hide(block.id)} aria-label="Abschnitt ausblenden">
                    <EyeOff className="size-3.5" />
                  </button>
                  <button type="button" className={cn(tool, "hover:bg-red-50 hover:text-red-600")} onClick={() => tools.remove(block.id)} aria-label="Abschnitt löschen">
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              )}
            </div>
          </BlockContext.Provider>
        ))}
      </div>
    </EditContext.Provider>
  );
}
