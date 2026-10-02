import { useCallback, useEffect, useState } from "react";
import type { DemoDoc } from "@/demo/types";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type Options = { method?: "GET" | "POST" | "PATCH" | "DELETE"; body?: unknown };

/** Calls the Studio API. Writes carry the header the server requires from its own pages. */
export async function api<T = unknown>(path: string, { method = "GET", body }: Options = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (method !== "GET") headers["X-Studio"] = "1";
  if (body !== undefined) headers["Content-Type"] = "application/json";
  let res: Response;
  try {
    res = await fetch(`/api${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), credentials: "same-origin" });
  } catch {
    throw new ApiError(0, "Keine Verbindung zum Server.");
  }
  const data = (await res.json().catch(() => null)) as { error?: string } | null;
  if (!res.ok) throw new ApiError(res.status, data?.error ?? "Da ist etwas schiefgelaufen.");
  return data as T;
}

/** Uploads an image and returns its site-relative URL. */
export async function uploadImage(file: File): Promise<string> {
  let res: Response;
  try {
    res = await fetch("/api/media", {
      method: "POST",
      headers: { "X-Studio": "1", "Content-Type": file.type, "X-File-Name": encodeURIComponent(file.name) },
      body: file,
      credentials: "same-origin",
    });
  } catch {
    throw new ApiError(0, "Keine Verbindung zum Server.");
  }
  const data = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;
  if (!res.ok || !data?.url) throw new ApiError(res.status, data?.error ?? "Upload fehlgeschlagen.");
  return data.url;
}

/** Loads a resource and keeps it; `reload` fetches it again, `set` patches the local copy. */
export function useLoad<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (path === null) return;
    let alive = true;
    api<T>(path)
      .then((d) => {
        if (!alive) return;
        setData(d);
        setError(null);
      })
      .catch((e: ApiError) => alive && setError(e));
    return () => {
      alive = false;
    };
  }, [path, tick]);

  const reload = useCallback(() => setTick((n) => n + 1), []);
  return { data, error, loading: data === null && error === null, reload, set: setData };
}

// ---------- shapes the API returns ----------
export type User = { id: number; email: string; name: string };
export type ClientStatus = "lead" | "contact" | "offer" | "won" | "lost";
export type Client = {
  id: number;
  name: string;
  contact: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  industry: string | null;
  city: string | null;
  status: ClientStatus;
  value: number | null;
  notes: string;
  created_at: string;
  updated_at: string;
  demo_count?: number;
  open_tasks?: number;
};
export type Activity = { id: number; client_id: number | null; kind: string; text: string; created_at: string; client_name?: string | null };
export type Task = { id: number; client_id: number | null; title: string; due: string | null; done: number; created_at: string; client_name?: string | null };
export type DemoSummary = {
  id: number;
  slug: string;
  title: string;
  template: string | null;
  shared: number;
  client_id: number | null;
  client_name: string | null;
  created_at: string;
  updated_at: string;
  theme?: DemoDoc["theme"] | null;
  meta?: DemoDoc["meta"] | null;
};
export type Demo = DemoSummary & { doc: DemoDoc; notes: string };
export type Version = { id: number; label: string; created_at: string };
export type OwnTemplate = { id: number; name: string; industry: string | null; doc: DemoDoc; created_at: string; updated_at: string };
export type Project = { id: number; name: string; client_id: number | null; client_name?: string | null; url: string | null; repo: string | null; hosting: string | null; status: "idea" | "building" | "live" | "paused"; notes: string };
export type Inquiry = { id: number; name: string | null; email: string | null; message: string; lang: string | null; page: string | null; status: "new" | "read" | "done"; created_at: string };
export type Overview = {
  counts: { clients: number; open_leads: number; customers: number; demos: number; open_tasks: number; new_inquiries: number; pipeline_value: number };
  pipeline: { status: ClientStatus; n: number; value: number }[];
  activities: Activity[];
  tasks: Task[];
  inquiries: Inquiry[];
  demos: DemoSummary[];
};

export const statusLabels: Record<ClientStatus, string> = { lead: "Lead", contact: "Im Gespräch", offer: "Angebot", won: "Kunde", lost: "Verloren" };
export const statusOrder: ClientStatus[] = ["lead", "contact", "offer", "won", "lost"];

/** "2026-10-02 14:03:11" (UTC, from SQLite) → "02.10.2026, 16:03". */
export function formatDate(value: string | null | undefined, withTime = false) {
  if (!value) return "–";
  const date = new Date(value.includes("T") ? value : `${value.replace(" ", "T")}Z`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("de-DE", withTime ? { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" } : { day: "2-digit", month: "2-digit", year: "numeric" });
}

export const euro = (value: number | null | undefined) => (value == null ? "–" : `${value.toLocaleString("de-DE")} €`);
