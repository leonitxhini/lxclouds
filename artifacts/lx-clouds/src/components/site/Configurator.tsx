import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import {
  LayoutTemplate, Monitor, AppWindow, Smartphone, Database,
  FileText, CalendarClock, CreditCard, Users, LayoutDashboard,
  MessageCircle, Webhook, Languages, Search, PenTool, BarChart3,
  Check, ChevronLeft, ArrowRight, RefreshCw, Clock, Euro, Send,
} from "lucide-react";
import { Reveal, Magnetic, ripple, EASE } from "@/lib/fx";

const WHATSAPP_NUMBER = "4915780998115";

// --- Model ---

type ProjectType = {
  id: string;
  icon: React.ElementType;
  label: string;
  desc: string;
  base: number;
  days: [number, number];
};

const TYPES: ProjectType[] = [
  { id: "landing", icon: LayoutTemplate, label: "Landing Page", desc: "Focused one-pager for offers & launches", base: 399, days: [4, 7] },
  { id: "website", icon: Monitor, label: "Business Website", desc: "Multi-section site that wins customers", base: 1500, days: [10, 21] },
  { id: "webapp", icon: AppWindow, label: "Web App", desc: "Browser app, portal or dashboard", base: 2500, days: [21, 35] },
  { id: "mobile", icon: Smartphone, label: "Mobile App", desc: "iOS & Android application", base: 4000, days: [28, 56] },
  { id: "system", icon: Database, label: "Custom System", desc: "Internal tool that replaces spreadsheet chaos", base: 2500, days: [21, 42] },
];

type Level = { id: string; label: string; desc: string; priceMult: number; daysMult: number };

const LEVELS: Level[] = [
  { id: "basic", label: "Essential", desc: "Clean, solid foundation — everything you need to start", priceMult: 1, daysMult: 1 },
  { id: "standard", label: "Professional", desc: "More sections, more polish, custom interactions", priceMult: 1.35, daysMult: 1.3 },
  { id: "premium", label: "Premium", desc: "Fully custom design system with advanced animations", priceMult: 1.8, daysMult: 1.7 },
];

type Feature = { id: string; icon: React.ElementType; label: string; price: number; days: number };

const FEATURES: Feature[] = [
  { id: "cms", icon: FileText, label: "Content Management", price: 300, days: 3 },
  { id: "booking", icon: CalendarClock, label: "Booking System", price: 350, days: 4 },
  { id: "payments", icon: CreditCard, label: "Online Payments", price: 450, days: 5 },
  { id: "accounts", icon: Users, label: "User Accounts & Login", price: 400, days: 5 },
  { id: "admin", icon: LayoutDashboard, label: "Admin Dashboard", price: 600, days: 6 },
  { id: "whatsapp", icon: MessageCircle, label: "WhatsApp Automation", price: 150, days: 2 },
  { id: "api", icon: Webhook, label: "API Integrations", price: 300, days: 4 },
  { id: "multilingual", icon: Languages, label: "Multilingual", price: 250, days: 3 },
  { id: "seo", icon: Search, label: "SEO Package", price: 150, days: 2 },
  { id: "branding", icon: PenTool, label: "Logo & Branding", price: 120, days: 3 },
  { id: "analytics", icon: BarChart3, label: "Analytics Setup", price: 100, days: 1 },
];

const CARE = [
  { id: "none", label: "No care plan", monthly: 0 },
  { id: "basic", label: "Basic Care", monthly: 15 },
  { id: "business", label: "Business Care", monthly: 29 },
  { id: "premium", label: "Premium Care", monthly: 49 },
];

const STEPS = ["Project", "Scope", "Features", "Estimate"];

// --- Helpers ---

const roundTo = (v: number, step: number) => Math.round(v / step) * step;
const fmt = (v: number) => v.toLocaleString("en-US");

function calc(type: ProjectType | null, level: Level | null, featureIds: string[]) {
  if (!type || !level) return null;
  const feats = FEATURES.filter((f) => featureIds.includes(f.id));
  const p = type.base * level.priceMult + feats.reduce((s, f) => s + f.price, 0);
  const dMin = Math.round(type.days[0] * level.daysMult) + feats.reduce((s, f) => s + f.days, 0);
  const dMax = Math.round(type.days[1] * level.daysMult) + Math.round(feats.reduce((s, f) => s + f.days, 0) * 1.4);
  return {
    priceMin: roundTo(p * 0.9, 50),
    priceMax: roundTo(p * 1.15, 50),
    dMin,
    dMax,
  };
}

function timeLabel(dMin: number, dMax: number) {
  if (dMax <= 10) return `≈ ${dMin}–${dMax} days`;
  const wMin = Math.max(1, Math.round(dMin / 7));
  const wMax = Math.max(wMin + 1, Math.ceil(dMax / 7));
  return `≈ ${wMin}–${wMax} weeks`;
}

// --- UI bits ---

const StepDots = ({ step }: { step: number }) => (
  <div className="mb-10 flex items-center justify-center gap-0">
    {STEPS.map((label, i) => (
      <div key={label} className="flex items-center">
        <div className="flex flex-col items-center">
          <div
            className={clsx(
              "flex h-9 w-9 items-center justify-center rounded-full border font-mono text-xs font-semibold transition-all duration-300",
              i < step && "border-transparent bg-gradient-to-r from-primary to-glow text-white",
              i === step && "border-primary/60 bg-primary/15 text-glow shadow-[0_0_18px_rgba(29,124,255,0.35)]",
              i > step && "border-white/10 text-muted-foreground"
            )}
          >
            {i < step ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
          </div>
          <span className={clsx("mt-2 hidden font-mono text-[10px] uppercase tracking-[0.18em] sm:block", i === step ? "text-glow" : "text-muted-foreground")}>
            {label}
          </span>
        </div>
        {i < STEPS.length - 1 && <div className={clsx("mx-3 mb-5 h-px w-10 sm:w-16", i < step ? "bg-gradient-to-r from-primary to-glow" : "bg-white/10")} />}
      </div>
    ))}
  </div>
);

const stepAnim = {
  initial: { opacity: 0, x: 42, filter: "blur(8px)" },
  animate: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: { opacity: 0, x: -42, filter: "blur(8px)" },
  transition: { duration: 0.45, ease: EASE },
};

// --- Main component ---

export const Configurator = ({ goTo }: { goTo: (hash: string) => void }) => {
  const [step, setStep] = useState(0);
  const [typeId, setTypeId] = useState<string | null>(null);
  const [levelId, setLevelId] = useState<string | null>(null);
  const [featureIds, setFeatureIds] = useState<string[]>([]);
  const [careId, setCareId] = useState("none");

  const type = TYPES.find((t) => t.id === typeId) ?? null;
  const level = LEVELS.find((l) => l.id === levelId) ?? null;
  const care = CARE.find((c) => c.id === careId)!;
  const est = useMemo(() => calc(type, level, featureIds), [type, level, featureIds]);

  const toggleFeature = (id: string) =>
    setFeatureIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

  const reset = () => {
    setStep(0);
    setTypeId(null);
    setLevelId(null);
    setFeatureIds([]);
    setCareId("none");
  };

  const summaryText = () => {
    const feats = FEATURES.filter((f) => featureIds.includes(f.id)).map((f) => f.label);
    return [
      "Project request via configurator:",
      `• Type: ${type?.label}`,
      `• Scope: ${level?.label}`,
      `• Features: ${feats.length ? feats.join(", ") : "—"}`,
      `• Care plan: ${care.label}${care.monthly ? ` (€${care.monthly}/mo)` : ""}`,
      est ? `• Estimate: €${fmt(est.priceMin)}–€${fmt(est.priceMax)}, ${timeLabel(est.dMin, est.dMax)}` : "",
    ].filter(Boolean).join("\n");
  };

  const sendToContact = () => {
    goTo("#contact");
    window.setTimeout(() => {
      const ta = document.querySelector('textarea[name="message"]') as HTMLTextAreaElement | null;
      if (ta) {
        ta.value = summaryText();
        ta.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }, 900);
  };

  return (
    <section id="configurator" className="relative scroll-mt-24 py-24 lg:py-32">
      <div className="absolute left-1/2 top-0 h-[380px] w-[680px] -translate-x-1/2 rounded-full bg-primary/[0.07] blur-[140px]" aria-hidden="true" />
      <div className="container relative mx-auto px-6">
        <Reveal className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-glow shadow-[0_0_8px_2px] shadow-glow/60" />
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-glow">Project Configurator</span>
          </div>
          <h2 className="font-display text-4xl font-bold leading-[1.06] md:text-5xl">
            Configure your project.
            <br />
            <span className="text-gradient">Get an instant estimate.</span>
          </h2>
          <p className="mt-5 text-muted-foreground md:text-lg">Pick what you need — we'll show you a realistic price range and timeline.</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="glass mx-auto max-w-4xl rounded-3xl p-6 md:p-10">
            <StepDots step={step} />

            <AnimatePresence mode="wait">
              {/* STEP 0 — type */}
              {step === 0 && (
                <motion.div key="s0" {...stepAnim}>
                  <h3 className="mb-6 text-center font-display text-xl font-bold">What do you want to build?</h3>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {TYPES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => { setTypeId(t.id); setStep(1); }}
                        className={clsx(
                          "group rounded-2xl border p-5 text-left transition-all duration-200",
                          typeId === t.id
                            ? "border-primary/60 bg-primary/10 shadow-[0_0_24px_rgba(29,124,255,0.2)]"
                            : "border-white/10 bg-white/[0.03] hover:border-primary/40 hover:bg-white/[0.05]"
                        )}
                      >
                        <t.icon className="mb-3 h-6 w-6 text-glow" />
                        <div className="font-display font-bold">{t.label}</div>
                        <div className="mt-1 text-xs leading-relaxed text-muted-foreground">{t.desc}</div>
                        <div className="mt-3 font-mono text-xs text-primary">from €{fmt(t.base)}</div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 1 — scope */}
              {step === 1 && (
                <motion.div key="s1" {...stepAnim}>
                  <h3 className="mb-6 text-center font-display text-xl font-bold">How polished should it be?</h3>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {LEVELS.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => { setLevelId(l.id); setStep(2); }}
                        className={clsx(
                          "rounded-2xl border p-5 text-left transition-all duration-200",
                          levelId === l.id
                            ? "border-primary/60 bg-primary/10 shadow-[0_0_24px_rgba(29,124,255,0.2)]"
                            : "border-white/10 bg-white/[0.03] hover:border-primary/40 hover:bg-white/[0.05]"
                        )}
                      >
                        <div className="font-display font-bold">{l.label}</div>
                        <div className="mt-1 text-xs leading-relaxed text-muted-foreground">{l.desc}</div>
                        <div className="mt-3 font-mono text-xs text-primary">{l.priceMult === 1 ? "base price" : `×${l.priceMult} price`}</div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 2 — features */}
              {step === 2 && (
                <motion.div key="s2" {...stepAnim}>
                  <h3 className="mb-2 text-center font-display text-xl font-bold">Which features do you need?</h3>
                  <p className="mb-6 text-center text-sm text-muted-foreground">Optional — select any that apply.</p>
                  <div className="flex flex-wrap justify-center gap-2.5">
                    {FEATURES.map((f) => {
                      const on = featureIds.includes(f.id);
                      return (
                        <button
                          key={f.id}
                          onClick={() => toggleFeature(f.id)}
                          className={clsx(
                            "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200",
                            on
                              ? "border-primary/60 bg-primary/15 text-foreground shadow-[0_0_16px_rgba(29,124,255,0.25)]"
                              : "border-white/10 bg-white/[0.03] text-foreground/75 hover:border-primary/40"
                          )}
                        >
                          <f.icon className={clsx("h-4 w-4", on ? "text-glow" : "text-muted-foreground")} />
                          {f.label}
                          <span className={clsx("font-mono text-xs", on ? "text-glow" : "text-muted-foreground")}>+€{f.price}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 3 — result */}
              {step === 3 && est && (
                <motion.div key="s3" {...stepAnim}>
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* estimate */}
                    <div className="rounded-2xl border border-primary/30 bg-primary/[0.07] p-7 text-center">
                      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Estimated Price</div>
                      <div className="mt-3 font-display text-4xl font-bold md:text-[2.6rem]">
                        <span className="text-gradient">€{fmt(est.priceMin)} – €{fmt(est.priceMax)}</span>
                      </div>
                      {care.monthly > 0 && (
                        <div className="mt-2 font-mono text-sm text-glow">+ €{care.monthly}/month care plan</div>
                      )}
                      <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-foreground/85">
                        <Clock className="h-4 w-4 text-glow" />
                        {timeLabel(est.dMin, est.dMax)}
                      </div>
                      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                        Rough estimate based on your selection. You'll always receive a fixed price before we start — no surprises.
                      </p>
                    </div>

                    {/* summary + care */}
                    <div className="flex flex-col gap-4">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Your Selection</div>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2.5"><Check className="h-4 w-4 shrink-0 text-glow" strokeWidth={3} />{type?.label} · {level?.label}</li>
                          {FEATURES.filter((f) => featureIds.includes(f.id)).map((f) => (
                            <li key={f.id} className="flex items-center gap-2.5 text-foreground/80">
                              <Check className="h-4 w-4 shrink-0 text-primary/70" strokeWidth={3} />{f.label}
                            </li>
                          ))}
                          {featureIds.length === 0 && <li className="text-muted-foreground">No extra features</li>}
                        </ul>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Hosting & Care (optional)</div>
                        <div className="flex flex-wrap gap-2">
                          {CARE.map((c) => (
                            <button
                              key={c.id}
                              onClick={() => setCareId(c.id)}
                              className={clsx(
                                "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all",
                                careId === c.id
                                  ? "border-primary/60 bg-primary/15 text-foreground"
                                  : "border-white/10 bg-white/[0.02] text-foreground/70 hover:border-primary/40"
                              )}
                            >
                              {c.label}{c.monthly ? ` · €${c.monthly}/mo` : ""}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                    <Magnetic>
                      <button
                        onClick={(e) => { ripple(e); sendToContact(); }}
                        className="relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-glow px-7 py-3.5 font-semibold text-white shadow-[0_8px_32px_rgba(29,124,255,0.35)] transition-shadow hover:shadow-[0_8px_44px_rgba(29,124,255,0.55)]"
                      >
                        Request Exact Quote <Send className="h-4 w-4" />
                      </button>
                    </Magnetic>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(summaryText())}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => ripple(e)}
                      className="relative inline-flex items-center gap-2 overflow-hidden rounded-xl glass px-7 py-3.5 font-semibold transition-colors hover:border-white/25"
                    >
                      <MessageCircle className="h-4 w-4 text-glow" /> Send via WhatsApp
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* nav row */}
            <div className="mt-9 flex items-center justify-between border-t border-white/10 pt-6">
              <button
                onClick={() => (step === 0 ? reset() : setStep((s) => s - 1))}
                className={clsx("inline-flex items-center gap-1.5 text-sm font-medium transition-colors", step === 0 ? "invisible" : "text-muted-foreground hover:text-foreground")}
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>

              <div className="flex items-center gap-4">
                {est && step < 3 && (
                  <span className="hidden font-mono text-xs text-muted-foreground sm:block">
                    Current estimate: <span className="text-glow">€{fmt(est.priceMin)}–€{fmt(est.priceMax)}</span>
                  </span>
                )}
                {step === 2 && (
                  <Magnetic strength={0.2}>
                    <button
                      onClick={(e) => { ripple(e); setStep(3); }}
                      className="relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-glow px-6 py-2.5 text-sm font-semibold text-white"
                    >
                      Show Estimate <ArrowRight className="h-4 w-4" />
                    </button>
                  </Magnetic>
                )}
                {step === 3 && (
                  <button onClick={reset} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                    <RefreshCw className="h-3.5 w-3.5" /> Start over
                  </button>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.18} className="mx-auto mt-6 max-w-4xl text-center">
          <p className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <Euro className="h-3.5 w-3.5" /> All estimates are starting points — final fixed price after a short free call.
          </p>
        </Reveal>
      </div>
    </section>
  );
};
