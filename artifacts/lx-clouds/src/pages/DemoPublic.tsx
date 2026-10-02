import { useEffect, useState } from "react";
import { DemoSite } from "@/demo/DemoSite";
import type { DemoDoc } from "@/demo/types";
import { site } from "@/data/site";

type State = { status: "loading" } | { status: "missing" } | { status: "ready"; title: string; doc: DemoDoc };

/** A demo website that was shared with a client: /d/<slug>. */
export default function DemoPublic({ slug }: { slug: string }) {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.appendChild(robots);
    fetch(`/api/public/demos/${slug}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("missing");
        const data = (await res.json()) as { title: string; doc: DemoDoc };
        document.title = `${data.doc.meta.company} – Demo`;
        setState({ status: "ready", ...data });
      })
      .catch(() => setState({ status: "missing" }));
    return () => robots.remove();
  }, [slug]);

  if (state.status === "loading") return <div className="min-h-screen bg-white" />;
  if (state.status === "missing") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center">
        <p className="eyebrow">Demo</p>
        <h1 className="mt-3 text-[30px] font-semibold tracking-[-0.03em]">Diese Demo ist nicht verfügbar.</h1>
        <p className="mt-2 max-w-[420px] text-muted">Der Link ist nicht mehr freigegeben oder die Adresse stimmt nicht.</p>
        <a href="/" className="mt-6 text-accent-ink underline underline-offset-4">
          {site.domain}
        </a>
      </div>
    );
  }

  return (
    <>
      <DemoSite doc={state.doc} className="min-h-screen" />
      <a
        href="/"
        className="fixed bottom-3 right-3 z-50 rounded-full bg-[#14151c]/85 px-3 py-1.5 text-[11.5px] font-medium text-white shadow-lg backdrop-blur transition-opacity hover:opacity-100 sm:opacity-80"
      >
        Demo von {site.domain}
      </a>
    </>
  );
}
