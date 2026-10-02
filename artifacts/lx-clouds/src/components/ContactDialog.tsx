import * as Dialog from "@radix-ui/react-dialog";
import { Check, Mail, X } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/Button";
import { mailto, site } from "@/data/site";
import { useLocale, useT } from "@/i18n";

const ContactContext = createContext<() => void>(() => {});

/** Returns a function that opens the contact dialog. */
export const useContact = () => useContext(ContactContext);

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-xl border border-ink/10 bg-white px-3.5 py-2.5 text-[15px] text-ink placeholder:text-faint/80 transition-[border-color,box-shadow] duration-200 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15";

function ContactForm({ onDone }: { onDone: () => void }) {
  const { t, locale } = useLocale();
  const c = t.contact;
  const [status, setStatus] = useState<Status>("idle");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get("botcheck")) return; // honeypot
    setStatus("sending");
    const message = { name: data.get("name"), email: data.get("email"), message: data.get("message") };
    // the message goes to the inbox (e-mail) and into the Studio's enquiry list; one of the two is enough
    const [mail, studio] = await Promise.allSettled([
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "ff0f38d4-cdc5-49b5-a0e8-00c4c585ce19",
          subject: `New enquiry from ${message.name} — ${site.domain}`,
          from_name: `${site.domain} portfolio`,
          ...message,
        }),
      }).then(async (res) => ((await res.json()) as { success?: boolean }).success === true),
      fetch("/api/public/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Studio": "1" },
        body: JSON.stringify({ ...message, lang: locale, page: window.location.pathname }),
      }).then((res) => res.ok),
    ]);
    const delivered = (mail.status === "fulfilled" && mail.value) || (studio.status === "fulfilled" && studio.value);
    setStatus(delivered ? "sent" : "error");
  }

  if (status === "sent") {
    return (
      <div className="py-6 text-center" role="status">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent-soft text-accent">
          <Check className="size-5" strokeWidth={2.2} aria-hidden="true" />
        </span>
        <p className="mt-4 text-[19px] font-semibold tracking-[-0.01em]">{c.sentTitle}</p>
        <p className="mt-1.5 text-[15px] text-muted">{c.sentBody}</p>
        <Button variant="light" className="mt-6" icon={null} onClick={onDone}>
          {t.common.close}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-ink/80">{c.name}</span>
          <input name="name" required autoComplete="name" className={field} placeholder={c.namePlaceholder} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-ink/80">{c.email}</span>
          <input name="email" type="email" required autoComplete="email" className={field} placeholder={c.emailPlaceholder} />
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-[13px] font-medium text-ink/80">{c.message}</span>
        <textarea
          name="message"
          required
          rows={5}
          className={`${field} resize-none`}
          placeholder={c.messagePlaceholder}
        />
      </label>
      {status === "error" && (
        <p role="alert" className="text-[13.5px] text-[#c0392b]">
          {c.error}{" "}
          <a className="underline" href={mailto(c.subject)}>
            {site.email}
          </a>
          .
        </p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <a
          href={mailto(c.subject)}
          className="inline-flex items-center gap-2 text-[14px] text-muted transition-colors hover:text-accent-ink"
        >
          <Mail className="size-4" strokeWidth={1.8} aria-hidden="true" />
          {site.email}
        </a>
        <Button type="submit" disabled={status === "sending"} className="disabled:opacity-60">
          {status === "sending" ? c.sending : c.send}
        </Button>
      </div>
    </form>
  );
}

export function ContactProvider({ children }: { children: ReactNode }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  // remount the form on every open so a sent/failed state never lingers
  const [session, setSession] = useState(0);
  const show = useCallback(() => {
    setSession((n) => n + 1);
    setOpen(true);
  }, []);
  const value = useMemo(() => show, [show]);

  return (
    <ContactContext.Provider value={value}>
      {children}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[70] bg-ink/35 backdrop-blur-[6px] data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in" />
          <Dialog.Content className="fixed inset-x-3 bottom-3 z-[71] max-h-[calc(100dvh-24px)] overflow-y-auto rounded-[26px] border border-white bg-paper p-6 shadow-[0_40px_90px_-30px_rgba(40,36,120,0.5)] sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[min(560px,calc(100vw-40px))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:p-8">
            <Dialog.Close
              className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-ink/5 hover:text-ink"
              aria-label={t.common.close}
            >
              <X className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
            </Dialog.Close>
            <p className="eyebrow">{t.contact.eyebrow}</p>
            <Dialog.Title className="mt-2 text-[28px] font-semibold leading-[1.1] tracking-[-0.025em]">
              {t.contact.title}
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-[15px] leading-relaxed text-muted">
              {t.contact.sub}
            </Dialog.Description>
            <ContactForm key={session} onDone={() => setOpen(false)} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </ContactContext.Provider>
  );
}
