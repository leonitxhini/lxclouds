import { Eye, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { DemoSite } from "@/demo/DemoSite";
import { imageUrl } from "@/demo/edit";
import { templates } from "@/demo/templates";
import type { DemoDoc } from "@/demo/types";
import { api, formatDate, useLoad, type OwnTemplate } from "../api";
import { NewDemoModal } from "../NewDemo";
import { Badge, Btn, Card, Loading, Modal, PageHeader } from "../ui";

export function Templates() {
  const own = useLoad<{ templates: OwnTemplate[] }>("/templates");
  const [use, setUse] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ name: string; doc: DemoDoc } | null>(null);

  async function remove(t: OwnTemplate) {
    if (!window.confirm(`Vorlage „${t.name}“ wirklich löschen?`)) return;
    await api(`/templates/${t.id}`, { method: "DELETE" });
    own.reload();
  }

  return (
    <>
      <PageHeader title="Vorlagen" sub="Branchen-Vorlagen als Startpunkt für jede Demo. Eigene Vorlagen speicherst du im Editor über „Als Vorlage speichern“." />

      <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-faint">Branchen</h2>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {templates.map((t) => (
          <li key={t.id}>
            <Card className="group flex h-full flex-col overflow-hidden transition-[border-color,box-shadow] duration-200 hover:border-accent/30 hover:shadow-card">
              <button type="button" onClick={() => setPreview({ name: t.name, doc: t.build({ company: "Musterfirma" }) })} className="relative block overflow-hidden" aria-label={`Vorschau ${t.name}`}>
                <img src={imageUrl(t.preview)} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition-[opacity,background-color] duration-200 group-hover:bg-black/35 group-hover:opacity-100">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12.5px] font-semibold text-ink">
                    <Eye className="size-3.5" /> Vorschau
                  </span>
                </span>
              </button>
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-[15.5px] font-semibold">{t.name}</h3>
                  <Badge tone="accent">{t.industry}</Badge>
                </div>
                <p className="mt-1.5 flex-1 text-[13.5px] leading-snug text-muted">{t.description}</p>
                <Btn variant="outline" size="sm" className="mt-4 w-full" onClick={() => setUse(t.id)}>
                  <Plus className="size-3.5" aria-hidden="true" />
                  Demo daraus erstellen
                </Btn>
              </div>
            </Card>
          </li>
        ))}
      </ul>

      <h2 className="mb-3 mt-9 text-[13px] font-semibold uppercase tracking-[0.1em] text-faint">Eigene Vorlagen</h2>
      {!own.data ? (
        <Loading />
      ) : own.data.templates.length === 0 ? (
        <p className="rounded-[16px] border border-dashed border-ink/15 px-6 py-8 text-center text-[14px] text-muted">
          Noch keine eigenen Vorlagen. Baue eine Demo so um, wie du sie öfter brauchst, und speichere sie im Editor als Vorlage.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {own.data.templates.map((t) => (
            <li key={t.id}>
              <Card className="flex h-full flex-col overflow-hidden">
                <button
                  type="button"
                  onClick={() => setPreview({ name: t.name, doc: t.doc })}
                  className="flex aspect-[16/10] flex-col justify-end p-4 text-left text-white"
                  style={{ background: `linear-gradient(135deg, ${t.doc.theme.primary}, #14151c)` }}
                  aria-label={`Vorschau ${t.name}`}
                >
                  <span className="text-[11px] font-semibold uppercase tracking-[0.1em] opacity-70">{t.industry ?? "Eigene Vorlage"}</span>
                  <span className="text-[18px] font-semibold">{t.name}</span>
                </button>
                <div className="flex items-center gap-2 p-3">
                  <span className="flex-1 text-[12.5px] text-faint">Gespeichert {formatDate(t.updated_at)}</span>
                  <Btn variant="outline" size="sm" onClick={() => setUse(`own:${t.id}`)}>
                    Verwenden
                  </Btn>
                  <button type="button" onClick={() => remove(t)} className="flex size-8 items-center justify-center rounded-lg text-muted hover:bg-red-50 hover:text-red-600" aria-label="Vorlage löschen">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Modal open={!!preview} onClose={() => setPreview(null)} title={preview ? `Vorschau: ${preview.name}` : ""} wide>
        {preview && (
          <div className="max-h-[70dvh] overflow-y-auto rounded-[12px] border border-ink/10">
            <DemoSite doc={preview.doc} />
          </div>
        )}
      </Modal>
      <NewDemoModal open={!!use} onClose={() => setUse(null)} template={use ?? undefined} />
    </>
  );
}
