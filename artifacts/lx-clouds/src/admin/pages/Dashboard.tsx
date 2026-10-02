import { ArrowRight, MonitorPlay, Plus, UserPlus } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { api, euro, formatDate, statusLabels, statusOrder, useLoad, type Overview } from "../api";
import { NewDemoModal } from "../NewDemo";
import { Badge, Btn, Card, linkButton, Loading, PageHeader } from "../ui";

const statusColours = { lead: "#A5A3FF", contact: "#6865FF", offer: "#F3A93C", won: "#22C55E", lost: "#D1D3DC" };

function Kpi({ label, value, hint, href }: { label: string; value: string; hint?: string; href: string }) {
  return (
    <Link href={href} className="group block">
      <Card className="h-full p-5 transition-[border-color,box-shadow] duration-200 group-hover:border-accent/30 group-hover:shadow-card">
        <p className="text-[13px] text-muted">{label}</p>
        <p className="mt-2 text-[32px] font-semibold leading-none tracking-[-0.03em]">{value}</p>
        {hint && <p className="mt-2 text-[12.5px] text-faint">{hint}</p>}
      </Card>
    </Link>
  );
}

export function Dashboard() {
  const { data, error, reload } = useLoad<Overview>("/overview");
  const [newDemo, setNewDemo] = useState(false);

  if (error) return <p className="py-20 text-center text-red-600">{error.message}</p>;
  if (!data) return <Loading />;
  const { counts } = data;
  const total = Math.max(1, data.pipeline.reduce((sum, p) => sum + p.n, 0));

  async function done(id: number) {
    await api(`/tasks/${id}`, { method: "PATCH", body: { done: true } });
    reload();
  }

  return (
    <>
      <PageHeader title="Übersicht" sub={new Date().toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}>
        <Link href="/kunden?neu=1" className={linkButton("outline")}>
          <UserPlus className="size-4" aria-hidden="true" />
          Neuer Kunde
        </Link>
        <Btn variant="accent" onClick={() => setNewDemo(true)}>
          <Plus className="size-4" aria-hidden="true" />
          Neue Demo
        </Btn>
      </PageHeader>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Offene Leads" value={String(counts.open_leads)} hint={`${euro(counts.pipeline_value)} in der Pipeline`} href="/kunden" />
        <Kpi label="Kunden" value={String(counts.customers)} hint={`${counts.clients} Kontakte insgesamt`} href="/kunden" />
        <Kpi label="Demos" value={String(counts.demos)} hint="Präsentationen für Kunden" href="/demos" />
        <Kpi label="Offene Aufgaben" value={String(counts.open_tasks)} hint={counts.new_inquiries ? `${counts.new_inquiries} neue Anfrage(n)` : "Keine neuen Anfragen"} href="/aufgaben" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold">Pipeline</h2>
            <Link href="/kunden" className="text-[13px] text-accent-ink hover:underline">
              Alle Kunden
            </Link>
          </div>
          <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-ink/[0.06]">
            {statusOrder.map((s) => {
              const row = data.pipeline.find((p) => p.status === s);
              return row ? <span key={s} style={{ width: `${(row.n / total) * 100}%`, background: statusColours[s] }} title={`${statusLabels[s]}: ${row.n}`} /> : null;
            })}
          </div>
          <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
            {statusOrder.map((s) => {
              const row = data.pipeline.find((p) => p.status === s);
              return (
                <li key={s} className="flex items-center justify-between text-[14px]">
                  <span className="flex items-center gap-2.5">
                    <span className="size-2.5 rounded-full" style={{ background: statusColours[s] }} />
                    {statusLabels[s]}
                  </span>
                  <span className="text-muted">
                    <span className="font-medium text-ink">{row?.n ?? 0}</span>
                    {row?.value ? ` · ${euro(row.value)}` : ""}
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold">Aufgaben</h2>
            <Link href="/aufgaben" className="text-[13px] text-accent-ink hover:underline">
              Alle
            </Link>
          </div>
          {data.tasks.length === 0 ? (
            <p className="mt-4 text-[14px] text-muted">Nichts offen.</p>
          ) : (
            <ul className="mt-3 divide-y divide-ink/[0.06]">
              {data.tasks.map((t) => (
                <li key={t.id} className="flex items-center gap-3 py-2.5">
                  <button type="button" onClick={() => done(t.id)} className="size-[18px] shrink-0 rounded-[5px] border-[1.5px] border-ink/25 hover:border-accent hover:bg-accent-soft" aria-label={`Erledigt: ${t.title}`} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px]">{t.title}</span>
                    {t.client_name && <span className="block truncate text-[12.5px] text-faint">{t.client_name}</span>}
                  </span>
                  {t.due && <span className={cn("shrink-0 text-[12.5px]", t.due < new Date().toISOString().slice(0, 10) ? "font-medium text-red-600" : "text-muted")}>{formatDate(t.due)}</span>}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold">Zuletzt bearbeitete Demos</h2>
            <Link href="/demos" className="text-[13px] text-accent-ink hover:underline">
              Alle Demos
            </Link>
          </div>
          {data.demos.length === 0 ? (
            <div className="mt-4 rounded-[12px] border border-dashed border-ink/15 px-5 py-8 text-center">
              <MonitorPlay className="mx-auto size-7 text-accent" strokeWidth={1.6} aria-hidden="true" />
              <p className="mt-3 text-[14.5px] font-medium">Noch keine Demo</p>
              <p className="mt-1 text-[13.5px] text-muted">Wähle eine Vorlage, trag den Firmennamen ein – fertig zum Zeigen.</p>
              <Btn variant="accent" size="sm" className="mt-4" onClick={() => setNewDemo(true)}>
                Erste Demo erstellen
              </Btn>
            </div>
          ) : (
            <ul className="mt-3 divide-y divide-ink/[0.06]">
              {data.demos.map((d) => (
                <li key={d.id}>
                  <Link href={`/demos/${d.id}`} className="group flex items-center gap-3 py-3">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14.5px] font-medium group-hover:text-accent-ink">{d.title}</span>
                      <span className="block truncate text-[12.5px] text-faint">
                        {d.client_name ?? "Ohne Kunde"} · {formatDate(d.updated_at, true)}
                      </span>
                    </span>
                    {d.shared ? <Badge tone="green">Freigegeben</Badge> : <Badge>Privat</Badge>}
                    <ArrowRight className="size-4 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="text-[15px] font-semibold">Verlauf</h2>
          {data.activities.length === 0 ? (
            <p className="mt-4 text-[14px] text-muted">Noch nichts passiert.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {data.activities.map((a) => (
                <li key={a.id} className="flex gap-3 text-[13.5px]">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                  <span className="min-w-0">
                    <span className="block">{a.text}</span>
                    <span className="block text-[12px] text-faint">
                      {a.client_name && a.client_id ? (
                        <Link href={`/kunden/${a.client_id}`} className="hover:text-accent-ink">
                          {a.client_name}
                        </Link>
                      ) : null}
                      {a.client_name ? " · " : ""}
                      {formatDate(a.created_at, true)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {data.inquiries.length > 0 && (
        <Card className="mt-4 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold">Anfragen über die Website</h2>
            <Link href="/anfragen" className="text-[13px] text-accent-ink hover:underline">
              Alle Anfragen
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-ink/[0.06]">
            {data.inquiries.map((i) => (
              <li key={i.id} className="flex items-start gap-3 py-3">
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 text-[14px] font-medium">
                    {i.name ?? "Unbekannt"}
                    {i.status === "new" && <Badge tone="accent">Neu</Badge>}
                  </span>
                  <span className="mt-0.5 line-clamp-2 block text-[13.5px] text-muted">{i.message}</span>
                </span>
                <span className="shrink-0 text-[12.5px] text-faint">{formatDate(i.created_at)}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <NewDemoModal open={newDemo} onClose={() => setNewDemo(false)} />
    </>
  );
}
