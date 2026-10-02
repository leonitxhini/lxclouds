import { Play } from "lucide-react";
import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { FolioView } from "@/folio/Folio";
import { Present } from "@/folio/Present";
import type { FolioDoc } from "@/folio/types";

type State = { status: "loading" } | { status: "missing" } | { status: "ready"; doc: FolioDoc };

/** A project folio shared with the client: /m/<slug>. */
export default function FolioPublic({ slug }: { slug: string }) {
  const [state, setState] = useState<State>({ status: "loading" });
  const [presenting, setPresenting] = useState(false);

  useEffect(() => {
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.appendChild(robots);
    fetch(`/api/public/folios/${slug}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("missing");
        const data = (await res.json()) as { doc: FolioDoc };
        document.title = `Projektmappe ${data.doc.meta.client} – ${site.domain}`;
        setState({ status: "ready", doc: data.doc });
      })
      .catch(() => setState({ status: "missing" }));
    return () => robots.remove();
  }, [slug]);

  if (state.status === "loading") return <div className="min-h-screen bg-paper" />;
  if (state.status === "missing") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center">
        <p className="eyebrow">Projektmappe</p>
        <h1 className="mt-3 text-[30px] font-semibold tracking-[-0.03em]">Diese Mappe ist nicht verfügbar.</h1>
        <p className="mt-2 max-w-[420px] text-muted">Der Link ist nicht mehr freigegeben oder die Adresse stimmt nicht.</p>
      </div>
    );
  }
  return (
    <>
      <FolioView doc={state.doc} className="min-h-screen" />
      <button type="button" onClick={() => setPresenting(true)} className="fixed bottom-4 right-4 z-40 inline-flex h-12 items-center gap-2 rounded-full bg-[#12131B] px-5 text-[14.5px] font-semibold text-white shadow-xl print:hidden">
        <Play className="size-4" /> Als Präsentation
      </button>
      {presenting && <Present doc={state.doc} onClose={() => setPresenting(false)} />}
    </>
  );
}
