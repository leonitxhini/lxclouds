import { Check } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { imageUrl } from "@/demo/edit";
import { templates, uid } from "@/demo/templates";
import type { DemoDoc } from "@/demo/types";
import { cn } from "@/lib/utils";
import { api, ApiError, useLoad, type Client, type OwnTemplate } from "./api";
import { Btn, Field, Input, Modal, Select, useToast } from "./ui";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Pre-selected template: a built-in id, or "own:<id>". */
  template?: string;
  client?: Pick<Client, "id" | "name" | "city" | "phone" | "email"> | null;
};

/** Copies a saved template for a new company: fresh ids, the new company data on top. */
function fromOwn(doc: DemoDoc, meta: Partial<DemoDoc["meta"]>): DemoDoc {
  const copy = structuredClone(doc);
  copy.blocks.forEach((b) => (b.id = uid()));
  copy.meta = { ...copy.meta, ...Object.fromEntries(Object.entries(meta).filter(([, v]) => v)) };
  return copy;
}

/** Creates a demo from a template for a company and opens it in the editor. */
export function NewDemoModal({ open, onClose, template, client }: Props) {
  const [, navigate] = useLocation();
  const toast = useToast();
  const own = useLoad<{ templates: OwnTemplate[] }>(open ? "/templates" : null);
  const clients = useLoad<{ clients: Client[] }>(open && !client ? "/clients" : null);
  const [chosen, setChosen] = useState(template ?? "rental");
  const [clientChoice, setClientChoice] = useState("new");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) setChosen(template ?? "rental");
  }, [open, template]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const company = String(form.get("company") ?? "").trim();
    if (!company) return;
    const input = {
      company,
      city: String(form.get("city") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      address: String(form.get("address") ?? "").trim(),
    };
    setBusy(true);
    try {
      let doc: DemoDoc;
      let industry = "";
      if (chosen.startsWith("own:")) {
        const tpl = own.data?.templates.find((t) => `own:${t.id}` === chosen);
        if (!tpl) throw new ApiError(0, "Vorlage nicht gefunden.");
        doc = fromOwn(tpl.doc, input);
        industry = tpl.industry ?? "";
      } else {
        const tpl = templates.find((t) => t.id === chosen) ?? templates[0];
        doc = tpl.build(input);
        industry = tpl.industry;
      }

      let clientId: number | null = client?.id ?? null;
      if (!client) {
        if (clientChoice === "new") {
          const created = await api<{ id: number }>("/clients", {
            method: "POST",
            body: { name: company, city: input.city, phone: input.phone, email: input.email, industry, status: "lead" },
          });
          clientId = created.id;
        } else if (clientChoice !== "none") {
          clientId = Number(clientChoice);
        }
      }

      const demo = await api<{ id: number }>("/demos", { method: "POST", body: { title: company, client_id: clientId, template: chosen, doc } });
      onClose();
      navigate(`/demos/${demo.id}`);
    } catch (err) {
      toast((err as ApiError).message, "error");
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Neue Demo" wide>
      <form onSubmit={submit}>
        <p className="mb-2 text-[12.5px] font-medium text-ink/70">Vorlage</p>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setChosen(t.id)}
              aria-pressed={chosen === t.id}
              className={cn(
                "group relative overflow-hidden rounded-[12px] border-2 text-left transition-[border-color,box-shadow] duration-150",
                chosen === t.id ? "border-accent shadow-[0_0_0_4px_rgba(104,101,255,0.15)]" : "border-transparent hover:border-ink/15",
              )}
            >
              <img src={imageUrl(t.preview)} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover" />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-2.5 pb-2 pt-6 text-[13px] font-medium text-white">{t.name}</span>
              {chosen === t.id && (
                <span className="absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-accent text-white">
                  <Check className="size-3" strokeWidth={3} />
                </span>
              )}
            </button>
          ))}
          {own.data?.templates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setChosen(`own:${t.id}`)}
              aria-pressed={chosen === `own:${t.id}`}
              className={cn(
                "relative flex aspect-[16/10] flex-col justify-end overflow-hidden rounded-[12px] border-2 p-2.5 text-left text-white transition-[border-color,box-shadow] duration-150",
                chosen === `own:${t.id}` ? "border-accent shadow-[0_0_0_4px_rgba(104,101,255,0.15)]" : "border-transparent hover:border-ink/15",
              )}
              style={{ background: `linear-gradient(135deg, ${t.doc.theme.primary}, #14151c)` }}
            >
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.1em] opacity-70">Eigene Vorlage</span>
              <span className="text-[13px] font-medium">{t.name}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Firmenname" className="sm:col-span-2">
            <Input name="company" required defaultValue={client?.name ?? ""} placeholder="z. B. Musterfirma GmbH" autoFocus />
          </Field>
          <Field label="PLZ und Ort">
            <Input name="city" defaultValue={client?.city ?? ""} placeholder="60311 Frankfurt am Main" />
          </Field>
          <Field label="Straße">
            <Input name="address" placeholder="Musterstraße 12" />
          </Field>
          <Field label="Telefon">
            <Input name="phone" defaultValue={client?.phone ?? ""} placeholder="+49 …" />
          </Field>
          <Field label="E-Mail">
            <Input name="email" type="email" defaultValue={client?.email ?? ""} placeholder="info@…" />
          </Field>
          {!client && (
            <Field label="Kunde" className="sm:col-span-2" hint="Die Demo erscheint beim Kunden in der Akte.">
              <Select value={clientChoice} onChange={(e) => setClientChoice(e.target.value)}>
                <option value="new">Neuen Kunden mit diesem Namen anlegen</option>
                <option value="none">Ohne Kunde</option>
                {clients.data?.clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </Field>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Btn variant="ghost" onClick={onClose}>
            Abbrechen
          </Btn>
          <Btn type="submit" variant="accent" disabled={busy}>
            {busy ? "Erstelle …" : "Demo erstellen"}
          </Btn>
        </div>
      </form>
    </Modal>
  );
}
