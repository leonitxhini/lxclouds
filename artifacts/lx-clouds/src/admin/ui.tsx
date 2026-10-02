import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { createContext, useCallback, useContext, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// ---------- buttons ----------
const buttonBase =
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] font-medium transition-[background-color,border-color,color,box-shadow] duration-200 disabled:pointer-events-none disabled:opacity-50";
const buttonVariants = {
  primary: "bg-ink text-white hover:bg-[#23243a]",
  accent: "bg-accent text-white hover:bg-[#5855f0]",
  outline: "border border-ink/12 bg-white text-ink hover:border-accent/50 hover:text-accent-ink",
  ghost: "text-ink/75 hover:bg-ink/[0.06] hover:text-ink",
  danger: "border border-red-200 bg-white text-red-600 hover:bg-red-50",
};
const buttonSizes = { sm: "h-8 px-3 text-[13px]", md: "h-10 px-4 text-[14px]", icon: "size-9" };

type ButtonProps = ComponentPropsWithoutRef<"button"> & { variant?: keyof typeof buttonVariants; size?: keyof typeof buttonSizes };

export function Btn({ variant = "primary", size = "md", className, type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={cn(buttonBase, buttonVariants[variant], buttonSizes[size], className)} {...rest} />;
}

export const linkButton = (variant: keyof typeof buttonVariants = "primary", size: keyof typeof buttonSizes = "md") =>
  cn(buttonBase, buttonVariants[variant], buttonSizes[size]);

// ---------- form fields ----------
export const inputClass =
  "w-full rounded-[10px] border border-ink/12 bg-white px-3 h-10 text-[14px] text-ink placeholder:text-faint/70 transition-[border-color,box-shadow] duration-150 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15";

export function Field({ label, children, className, hint }: { label: string; children: ReactNode; className?: string; hint?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-[12.5px] font-medium text-ink/70">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[12px] text-faint">{hint}</span>}
    </label>
  );
}

export function Input(props: ComponentPropsWithoutRef<"input">) {
  return <input {...props} className={cn(inputClass, props.className)} />;
}

export function Textarea(props: ComponentPropsWithoutRef<"textarea">) {
  return <textarea {...props} className={cn(inputClass, "h-auto resize-y py-2.5 leading-relaxed", props.className)} />;
}

export function Select(props: ComponentPropsWithoutRef<"select">) {
  return <select {...props} className={cn(inputClass, "pr-2", props.className)} />;
}

// ---------- surfaces ----------
export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-[16px] border border-ink/[0.07] bg-white", className)}>{children}</div>;
}

export function PageHeader({ title, sub, children }: { title: string; sub?: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[26px] font-semibold leading-tight tracking-[-0.025em]">{title}</h1>
        {sub && <p className="mt-1 text-[14px] text-muted">{sub}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

const badgeTones = {
  grey: "bg-ink/[0.06] text-ink/70",
  accent: "bg-accent-soft text-accent-ink",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-600",
  blue: "bg-sky-50 text-sky-700",
};
export function Badge({ tone = "grey", children, className }: { tone?: keyof typeof badgeTones; children: ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11.5px] font-medium", badgeTones[tone], className)}>{children}</span>;
}

export function Empty({ title, text, children }: { title: string; text?: string; children?: ReactNode }) {
  return (
    <div className="rounded-[16px] border border-dashed border-ink/15 px-6 py-12 text-center">
      <p className="text-[16px] font-semibold">{title}</p>
      {text && <p className="mx-auto mt-1.5 max-w-[380px] text-[14px] text-muted">{text}</p>}
      {children && <div className="mt-5 flex justify-center gap-2">{children}</div>}
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return <span className={cn("inline-block size-5 animate-spin rounded-full border-2 border-ink/15 border-t-accent", className)} role="status" aria-label="Lädt" />;
}

export function Loading() {
  return (
    <div className="flex justify-center py-20">
      <Spinner />
    </div>
  );
}

// ---------- modal ----------
export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-ink/40 backdrop-blur-[3px] data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content
          aria-describedby={undefined}
          className={cn(
            "fixed left-1/2 top-1/2 z-[91] max-h-[calc(100dvh-32px)] w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[20px] bg-white p-6 shadow-[0_40px_90px_-30px_rgba(17,18,27,0.5)] data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95",
            wide ? "max-w-[980px]" : "max-w-[520px]",
          )}
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <Dialog.Title className="text-[19px] font-semibold tracking-[-0.015em]">{title}</Dialog.Title>
            <Dialog.Close className="flex size-8 items-center justify-center rounded-full text-muted hover:bg-ink/[0.06] hover:text-ink" aria-label="Schließen">
              <X className="size-4" />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ---------- toasts ----------
type Toast = { id: number; text: string; tone: "ok" | "error" };
const ToastContext = createContext<(text: string, tone?: Toast["tone"]) => void>(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((text: string, tone: Toast["tone"] = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, tone }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);
  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[120] flex flex-col items-center gap-2" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "rounded-full px-4 py-2 text-[13.5px] font-medium text-white shadow-lg animate-in fade-in slide-in-from-bottom-2",
              t.tone === "error" ? "bg-red-600" : "bg-ink",
            )}
          >
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
