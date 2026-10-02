import { Copy, ExternalLink, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { imageUrl } from "@/demo/edit";
import { getTemplate } from "@/demo/templates";
import { onColour } from "@/demo/theme";
import { api, ApiError, formatDate, useLoad, type DemoSummary } from "../api";
import { NewDemoModal } from "../NewDemo";
import { Badge, Btn, Card, Empty, Loading, PageHeader, useToast } from "../ui";

/** Card image of a demo: the photo of its template, tinted in the demo's own colour. */
export function DemoThumb({ demo }: { demo: Pick<DemoSummary, "template" | "theme" | "meta" | "title"> }) {
  const preview = demo.template ? getTemplate(demo.template)?.photo : undefined;
  const colour = demo.theme?.primary ?? "#6865FF";
  return (
    <div className="relative aspect-[16/10] overflow-hidden" style={{ background: `linear-gradient(135deg, ${colour}, #14151c)` }}>
      {preview && <img src={imageUrl(preview)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105" />}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <span className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11.5px] font-semibold" style={{ background: colour, color: onColour(colour) }}>
        {demo.meta?.industry ?? "Demo"}
      </span>
      <span className="absolute inset-x-3 bottom-3 truncate text-[17px] font-semibold text-white">{demo.meta?.company ?? demo.title}</span>
    </div>
  );
}

export function Demos() {
  const { data, error, reload } = useLoad<{ demos: DemoSummary[] }>("/demos");
  const toast = useToast();
  const [creating, setCreating] = useState(false);

  if (error) return <p className="py-20 text-center text-red-600">{error.message}</p>;
  if (!data) return <Loading />;

  async function duplicate(id: number) {
    try {
      await api(`/demos/${id}/duplicate`, { method: "POST" });
      toast("Demo dupliziert");
      reload();
    } catch (err) {
      toast((err as ApiError).message, "error");
    }
  }

  async function remove(demo: DemoSummary) {
    if (!window.confirm(`Demo „${demo.title}“ wirklich löschen?`)) return;
    await api(`/demos/${demo.id}`, { method: "DELETE" });
    reload();
  }

  return (
    <>
      <PageHeader title="Demos" sub="Demo-Websites für Kunden – zeigen, live anpassen, teilen.">
        <Btn variant="accent" onClick={() => setCreating(true)}>
          <Plus className="size-4" aria-hidden="true" />
          Neue Demo
        </Btn>
      </PageHeader>

      {data.demos.length === 0 ? (
        <Empty title="Noch keine Demo" text="Wähle eine Branchen-Vorlage, trag den Firmennamen ein – in einer Minute hast du etwas zum Zeigen.">
          <Btn variant="accent" onClick={() => setCreating(true)}>
            Erste Demo erstellen
          </Btn>
        </Empty>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.demos.map((d) => (
            <li key={d.id}>
              <Card className="group overflow-hidden transition-[border-color,box-shadow] duration-200 hover:border-accent/30 hover:shadow-card">
                <Link href={`/demos/${d.id}`} className="block" aria-label={`${d.title} öffnen`}>
                  <DemoThumb demo={d} />
                </Link>
                <div className="flex items-center gap-2 p-3.5">
                  <Link href={`/demos/${d.id}`} className="min-w-0 flex-1">
                    <span className="block truncate text-[14.5px] font-medium">{d.title}</span>
                    <span className="block truncate text-[12.5px] text-faint">
                      {d.client_name ?? "Ohne Kunde"} · {formatDate(d.updated_at, true)}
                    </span>
                  </Link>
                  {d.shared ? <Badge tone="green">Freigegeben</Badge> : <Badge>Privat</Badge>}
                </div>
                <div className="flex items-center gap-1 border-t border-ink/[0.06] px-2 py-1.5">
                  <Link href={`/demos/${d.id}`} className="flex h-8 flex-1 items-center justify-center rounded-lg text-[13px] font-medium text-accent-ink hover:bg-accent-soft">
                    Öffnen & bearbeiten
                  </Link>
                  {d.shared ? (
                    <a href={`/d/${d.slug}`} target="_blank" rel="noreferrer" className="flex size-8 items-center justify-center rounded-lg text-muted hover:bg-ink/[0.06] hover:text-ink" aria-label="Öffentliche Seite öffnen" title="Öffentliche Seite">
                      <ExternalLink className="size-4" />
                    </a>
                  ) : null}
                  <button type="button" onClick={() => duplicate(d.id)} className="flex size-8 items-center justify-center rounded-lg text-muted hover:bg-ink/[0.06] hover:text-ink" aria-label="Duplizieren" title="Duplizieren">
                    <Copy className="size-4" />
                  </button>
                  <button type="button" onClick={() => remove(d)} className="flex size-8 items-center justify-center rounded-lg text-muted hover:bg-red-50 hover:text-red-600" aria-label="Löschen" title="Löschen">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <NewDemoModal open={creating} onClose={() => setCreating(false)} />
    </>
  );
}
