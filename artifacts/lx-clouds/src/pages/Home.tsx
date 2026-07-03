import { useState, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

const HeroClouds = lazy(() => import("@/components/HeroClouds"));
import {
  Cloud, ArrowRight, ArrowUpRight, Menu, X,
  Monitor, Code2, PenTool, Server, Globe, Mail,
  MessageSquare, Layers, Rocket,
  Clock, Sparkles, Bot, TrendingUp,
  FileStack, Repeat, EyeOff, CalendarClock, MessageCircle,
  LayoutTemplate, AppWindow, Smartphone, Database,
} from "lucide-react";

// --- Constants ---

const PHONE_DISPLAY = "0157 8099 8115";
const WHATSAPP_URL = "https://wa.me/4915780998115";
const EMAIL = "info@lxclouds.com";
const YEAR = new Date().getFullYear();

type Lang = "en" | "de";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// --- Shared (non-translated) icon maps ---

const PROBLEM_ICONS = [CalendarClock, Repeat, EyeOff, FileStack];
const BENEFIT_ICONS = [Clock, Sparkles, Bot, TrendingUp];
const SERVICE_ICONS = [PenTool, Monitor, LayoutTemplate, AppWindow, Smartphone, Database, CalendarClock, MessageCircle, Server];
const PROCESS_ICONS = [MessageSquare, Layers, Code2, Rocket];

// --- Translations ---

const T = {
  en: {
    nav: ["Services", "Solutions", "Process", "Contact"],
    getInTouch: "Get in Touch",
    heroEyebrow: "YOUR DIGITAL AGENCY",
    heroLine1: "We Build",
    heroGradient: "Digital Experiences",
    heroLine3: "That Last.",
    heroText:
      "LX CLOUDS is your digital agency for web design, websites, web apps, mobile apps and custom systems — designed with precision, built for growth, delivered with care.",
    heroChips: ["Web Design", "Websites", "Web Apps", "Mobile Apps", "Systems", "Automation"],
    heroCta1: "Start a Project",
    heroCta2: "What We Build",
    stats: [["50+", "Projects Delivered"], ["100%", "Client Satisfaction"], ["<24h", "Response Time"]],
    problemsEyebrow: "DIGITALIZATION",
    problemsTitle: "Real Problems. Digital Solutions.",
    problemsSub:
      "Digitalization in practice: we turn time-consuming routines into digital processes that simply work.",
    problemLabel: "The Problem",
    solutionLabel: "Our Solution",
    problems: [
      {
        problem: "Bookings, requests and appointments arrive by phone or on paper — and things get lost.",
        solution: "Digital booking & request forms that collect everything automatically in one place.",
      },
      {
        problem: "You answer the same questions every single day — again and again.",
        solution: "WhatsApp automations and smart forms that answer for you, around the clock.",
      },
      {
        problem: "Customers search for you online — and find nothing, or something outdated.",
        solution: "A modern website that builds trust and wins customers while you work.",
      },
      {
        problem: "Excel chaos: orders, stock or jobs buried in endless lists.",
        solution: "Simple custom tools and dashboards — everything clear at a glance.",
      },
    ],
    benefitsEyebrow: "WHY DIGITAL",
    benefitsTitle: "Digital Pays Off From Day One.",
    benefits: [
      { title: "Save Time", desc: "Automate repetitive work and win back hours every week." },
      { title: "Simplify", desc: "One clear system instead of paper, phone calls and chaos." },
      { title: "Always On", desc: "Your website and automations work 24/7 — even while you sleep." },
      { title: "Grow", desc: "A professional appearance that wins trust and new customers." },
    ],
    servicesEyebrow: "SERVICES",
    servicesTitle: "What We Build",
    servicesSub: "From web design to complete systems — everything from one hand.",
    services: [
      { title: "Web Design", desc: "Modern, clean design that makes your brand look professional and trustworthy." },
      { title: "Websites", desc: "Fast, responsive websites that present your business and win customers." },
      { title: "Landing Pages", desc: "Focused one-pagers for offers, campaigns and product launches." },
      { title: "Web Apps", desc: "Browser-based applications, dashboards and portals — tailored to your workflow." },
      { title: "Mobile Apps", desc: "iOS & Android apps that put your service into your customers' pockets." },
      { title: "Custom Systems", desc: "Management systems for orders, inventory, returns & more — goodbye Excel chaos." },
      { title: "Booking & Requests", desc: "Booking systems and request flows your customers love to use." },
      { title: "WhatsApp & Automation", desc: "Automatic replies, notifications and workflows — 24/7, no extra staff needed." },
      { title: "Hosting & Care", desc: "We host, maintain and keep everything running. You focus on your business." },
    ],
    processEyebrow: "PROCESS",
    processTitle: "Simple Process. Clear Result.",
    process: [
      { title: "Listen", desc: "You tell us your problem — we listen and understand your workflow." },
      { title: "Concept", desc: "We design the simplest digital solution that fits your business." },
      { title: "Build", desc: "We build it and keep you updated — no tech jargon, no surprises." },
      { title: "Launch & Care", desc: "Your solution goes live. We stay by your side and keep it running." },
    ],
    contactEyebrow: "CONTACT",
    contactTitle: "Let's Build Your Project.",
    contactSub:
      "Website, app or custom system — in a short, free conversation we'll find the right solution. Clear fixed price afterwards, no obligation.",
    labelWebsite: "Website",
    labelEmail: "Email",
    labelWhatsApp: "WhatsApp",
    startProject: "Free Consultation",
    footerTagline: "Your digital agency for websites, apps and systems.",
    rights: `© ${YEAR} LX CLOUDS. All rights reserved.`,
  },
  de: {
    nav: ["Leistungen", "Lösungen", "Ablauf", "Kontakt"],
    getInTouch: "Kontakt aufnehmen",
    heroEyebrow: "DEINE DIGITALAGENTUR",
    heroLine1: "Wir bauen",
    heroGradient: "digitale Erlebnisse,",
    heroLine3: "die bleiben.",
    heroText:
      "LX CLOUDS ist deine Digitalagentur für Webdesign, Websites, Web-Apps, mobile Apps und individuelle Systeme — mit Präzision entworfen, für Wachstum gebaut, mit Sorgfalt geliefert.",
    heroChips: ["Webdesign", "Websites", "Web-Apps", "Mobile Apps", "Systeme", "Automation"],
    heroCta1: "Projekt starten",
    heroCta2: "Was wir bauen",
    stats: [["50+", "Umgesetzte Projekte"], ["100%", "Kundenzufriedenheit"], ["<24h", "Antwortzeit"]],
    problemsEyebrow: "DIGITALISIERUNG",
    problemsTitle: "Echte Probleme. Digitale Lösungen.",
    problemsSub:
      "Digitalisierung in der Praxis: Wir machen aus zeitraubenden Routinen digitale Abläufe, die einfach funktionieren.",
    problemLabel: "Das Problem",
    solutionLabel: "Unsere Lösung",
    problems: [
      {
        problem: "Buchungen, Anfragen und Termine kommen per Telefon oder Zettel — und gehen unter.",
        solution: "Digitale Buchungs- & Anfrageformulare, die alles automatisch an einem Ort sammeln.",
      },
      {
        problem: "Du beantwortest jeden Tag die gleichen Fragen — immer und immer wieder.",
        solution: "WhatsApp-Automationen und smarte Formulare, die für dich antworten — rund um die Uhr.",
      },
      {
        problem: "Kunden suchen dich online — und finden nichts oder etwas Veraltetes.",
        solution: "Eine moderne Website, die Vertrauen schafft und Kunden gewinnt, während du arbeitest.",
      },
      {
        problem: "Excel-Chaos: Aufträge, Bestände oder Jobs in endlosen Listen.",
        solution: "Einfache individuelle Tools und Dashboards — alles auf einen Blick.",
      },
    ],
    benefitsEyebrow: "WARUM DIGITAL",
    benefitsTitle: "Digital lohnt sich ab Tag eins.",
    benefits: [
      { title: "Zeit sparen", desc: "Automatisiere wiederkehrende Arbeit und gewinn jede Woche Stunden zurück." },
      { title: "Vereinfachen", desc: "Ein klares System statt Zettel, Anrufe und Chaos." },
      { title: "Immer erreichbar", desc: "Deine Website und Automationen arbeiten 24/7 — auch wenn du schläfst." },
      { title: "Wachsen", desc: "Ein professioneller Auftritt, der Vertrauen und Neukunden bringt." },
    ],
    servicesEyebrow: "LEISTUNGEN",
    servicesTitle: "Was wir bauen",
    servicesSub: "Von Webdesign bis zum kompletten System — alles aus einer Hand.",
    services: [
      { title: "Webdesign", desc: "Modernes, klares Design, das deine Marke professionell und vertrauenswürdig zeigt." },
      { title: "Websites", desc: "Schnelle, responsive Websites, die dein Unternehmen präsentieren und Kunden gewinnen." },
      { title: "Landingpages", desc: "Fokussierte One-Pager für Angebote, Aktionen und Produkt-Launches." },
      { title: "Web-Apps", desc: "Browserbasierte Anwendungen, Dashboards und Portale — passend zu deinem Ablauf." },
      { title: "Mobile Apps", desc: "iOS- & Android-Apps, die deinen Service in die Hosentasche deiner Kunden bringen." },
      { title: "Individuelle Systeme", desc: "Verwaltungssysteme für Aufträge, Bestände, Retouren & mehr — Schluss mit Excel-Chaos." },
      { title: "Buchung & Anfragen", desc: "Buchungssysteme und Anfrage-Abläufe, die deine Kunden gern nutzen." },
      { title: "WhatsApp & Automation", desc: "Automatische Antworten, Benachrichtigungen und Abläufe — 24/7, ohne extra Personal." },
      { title: "Hosting & Betreuung", desc: "Wir hosten, warten und halten alles am Laufen. Du kümmerst dich um dein Geschäft." },
    ],
    processEyebrow: "ABLAUF",
    processTitle: "Einfacher Ablauf. Klares Ergebnis.",
    process: [
      { title: "Zuhören", desc: "Du erzählst uns dein Problem — wir hören zu und verstehen deinen Ablauf." },
      { title: "Konzept", desc: "Wir entwerfen die einfachste digitale Lösung, die zu deinem Business passt." },
      { title: "Umsetzen", desc: "Wir bauen sie und halten dich auf dem Laufenden — ohne Fachchinesisch, ohne Überraschungen." },
      { title: "Launch & Betreuung", desc: "Deine Lösung geht live. Wir bleiben an deiner Seite und halten sie am Laufen." },
    ],
    contactEyebrow: "KONTAKT",
    contactTitle: "Lass uns dein Projekt bauen.",
    contactSub:
      "Website, App oder individuelles System — in einem kurzen, kostenlosen Gespräch finden wir die passende Lösung. Danach klarer Festpreis, unverbindlich.",
    labelWebsite: "Website",
    labelEmail: "E-Mail",
    labelWhatsApp: "WhatsApp",
    startProject: "Kostenloses Erstgespräch",
    footerTagline: "Deine Digitalagentur für Websites, Apps und Systeme.",
    rights: `© ${YEAR} LX CLOUDS. Alle Rechte vorbehalten.`,
  },
} as const;

type Translation = (typeof T)[Lang];

// --- Background glow ribbons ---

const BackgroundGlow = () => (
  <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 75% 8%, rgba(34,211,238,0.10), transparent 60%)" }} />
    <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 45% at 85% 30%, rgba(59,130,246,0.14), transparent 60%)" }} />
    <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 45% 40% at 10% 18%, rgba(99,102,241,0.10), transparent 60%)" }} />
    <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(37,99,235,0.08), transparent 65%)" }} />
  </div>
);

// --- Language switcher ---

const LangSwitch = ({ lang, setLang, className }: { lang: Lang; setLang: (l: Lang) => void; className?: string }) => (
  <div className={clsx("inline-flex items-center rounded-lg border border-white/15 overflow-hidden text-xs font-bold", className)}>
    {(["en", "de"] as const).map((l) => (
      <button
        key={l}
        onClick={() => setLang(l)}
        className={clsx("px-2.5 py-1.5 transition-colors uppercase", lang === l ? "bg-primary text-white" : "text-foreground/50 hover:text-foreground")}
        aria-pressed={lang === l}
      >
        {l}
      </button>
    ))}
  </div>
);

const Logo = () => (
  <a href="#home" className="flex items-center gap-2" aria-label="LX CLOUDS">
    <img src="/logo-cloud.png" alt="" aria-hidden="true" className="h-11 w-auto" />
    <span className="text-xl font-serif font-bold tracking-[0.15em] text-foreground">LX CLOUDS</span>
  </a>
);

// --- Navbar ---

const Navbar = ({ t, lang, setLang }: { t: Translation; lang: Lang; setLang: (l: Lang) => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const hrefs = ["#services", "#solutions", "#process", "#contact"];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={clsx("fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b", scrolled ? "bg-background/80 backdrop-blur-xl border-white/10 py-3" : "border-transparent py-5")}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Logo />
        <nav className="hidden lg:flex items-center gap-8">
          {t.nav.map((label, i) => (
            <a key={i} href={hrefs[i]} className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">{label}</a>
          ))}
          <LangSwitch lang={lang} setLang={setLang} />
          <a href="#contact" className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 hover:border-glow/50 hover:bg-white/5 text-foreground text-sm font-semibold px-5 py-2.5 transition-colors">
            {t.getInTouch} <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </nav>
        <div className="lg:hidden flex items-center gap-3">
          <LangSwitch lang={lang} setLang={setLang} />
          <button className="text-foreground p-2" onClick={() => setOpen((o) => !o)} aria-label="Menu">{open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden bg-background/95 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex flex-col gap-1">
          {t.nav.map((label, i) => (
            <a key={i} href={hrefs[i]} onClick={() => setOpen(false)} className="py-2.5 text-sm font-medium text-foreground/80">{label}</a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)} className="mt-2 rounded-lg bg-primary text-white text-sm font-semibold px-5 py-3 text-center">{t.getInTouch}</a>
        </div>
      )}
    </header>
  );
};

// --- Section eyebrow + title ---

const SectionTitle = ({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) => (
  <div className="mb-12 text-center">
    <div className="font-mono text-xs tracking-[0.25em] text-glow mb-3">{eyebrow}</div>
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground">{title}</h2>
    {sub && <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">{sub}</p>}
  </div>
);

// --- Main page ---

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const t = T[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div id="home" className="relative bg-background text-foreground min-h-screen overflow-x-hidden">
      <BackgroundGlow />
      <Navbar t={t} lang={lang} setLang={setLang} />

      <main>
        {/* HERO */}
        <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden">
          {/* animated cloud background (static image as fallback / while loading) */}
          <div className="absolute inset-0 z-0">
            <img src="/hero-servers.png" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: "right center" }} />
            <Suspense fallback={null}>
              <HeroClouds />
            </Suspense>
            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(90deg, #06090f 0%, rgba(6,9,15,0.9) 26%, rgba(6,9,15,0.45) 42%, rgba(6,9,15,0) 58%)" }} />
            <div className="absolute inset-x-0 bottom-0 h-28" style={{ background: "linear-gradient(to bottom, transparent, #06090f)" }} />
            <div className="absolute inset-x-0 top-0 h-16" style={{ background: "linear-gradient(to bottom, #06090f, transparent)" }} />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <motion.div key={lang} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-xl">
              <div className="flex items-center gap-2.5 mb-5">
                <span className="w-2 h-2 rounded-full bg-glow shadow-[0_0_10px_2px] shadow-glow/60" />
                <span className="font-mono text-xs tracking-[0.35em] text-glow">{t.heroEyebrow}</span>
              </div>
              <h1 className="font-serif font-bold leading-[1.04] text-5xl md:text-6xl lg:text-7xl text-foreground">
                {t.heroLine1}<br />
                <span className="gradient-text">{t.heroGradient}</span><br />
                {t.heroLine3}
              </h1>
              <p className="mt-7 text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">{t.heroText}</p>
              <div className="mt-9 flex flex-wrap gap-4">
                <a href="#contact" className="inline-flex items-center gap-2 rounded-xl text-white font-semibold px-7 py-3.5 shadow-lg shadow-primary/30 transition-transform hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(110deg, #2563eb 0%, #6d5cf5 100%)" }}>
                  {t.heroCta1} <ArrowUpRight className="w-4 h-4" />
                </a>
                <a href="#services" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] hover:bg-white/[0.07] text-foreground font-semibold px-7 py-3.5 transition-colors">
                  {t.heroCta2} <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-2 max-w-lg">
                {t.heroChips.map((chip) => (
                  <span key={chip} className="rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold text-foreground/80">
                    {chip}
                  </span>
                ))}
              </div>
              <div className="mt-10 flex">
                {t.stats.map(([n, l], i) => (
                  <div key={l} className={clsx("px-6 first:pl-0", i > 0 && "border-l border-white/15")}>
                    <div className="text-2xl md:text-3xl font-serif font-bold gradient-text">{n}</div>
                    <div className="mt-1 font-mono text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground">{l}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="py-20 scroll-mt-24">
          <div className="container mx-auto px-6">
            <SectionTitle eyebrow={t.servicesEyebrow} title={t.servicesTitle} sub={t.servicesSub} />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {t.services.map((s, i) => {
                const Icon = SERVICE_ICONS[i];
                return (
                  <motion.div
                    key={s.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
                    className="glass-card rounded-2xl p-7 hover:border-glow/30 hover:-translate-y-1 transition-all duration-300"
                  >
                    <span className="w-12 h-12 rounded-xl bg-primary/15 text-glow flex items-center justify-center mb-5">
                      <Icon className="w-6 h-6" />
                    </span>
                    <h3 className="text-xl font-serif font-bold text-foreground">{s.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* PROBLEMS → SOLUTIONS */}
        <section id="solutions" className="py-20 scroll-mt-24">
          <div className="container mx-auto px-6">
            <SectionTitle eyebrow={t.problemsEyebrow} title={t.problemsTitle} sub={t.problemsSub} />
            <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
              {t.problems.map((p, i) => {
                const Icon = PROBLEM_ICONS[i];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.45, delay: (i % 2) * 0.08 }}
                    className="glass-card rounded-2xl p-7 flex flex-col"
                  >
                    <div className="flex items-start gap-4">
                      <span className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 text-muted-foreground flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5" />
                      </span>
                      <div>
                        <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1.5">{t.problemLabel}</div>
                        <p className="text-foreground/85 leading-relaxed">{p.problem}</p>
                      </div>
                    </div>
                    <div className="my-5 flex items-center gap-3">
                      <div className="flex-1 h-px bg-white/10" />
                      <ArrowRight className="w-4 h-4 text-glow rotate-90" />
                      <div className="flex-1 h-px bg-white/10" />
                    </div>
                    <div className="flex items-start gap-4">
                      <span className="w-11 h-11 rounded-xl bg-primary/15 text-glow flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5" />
                      </span>
                      <div>
                        <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-glow mb-1.5">{t.solutionLabel}</div>
                        <p className="text-foreground leading-relaxed font-medium">{p.solution}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <SectionTitle eyebrow={t.benefitsEyebrow} title={t.benefitsTitle} />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
              {t.benefits.map((b, i) => {
                const Icon = BENEFIT_ICONS[i];
                return (
                  <motion.div
                    key={b.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.45, delay: i * 0.08 }}
                    className="glass-card rounded-2xl p-6 text-center hover:border-glow/30 hover:-translate-y-1 transition-all duration-300"
                  >
                    <span className="w-12 h-12 rounded-xl bg-primary/15 text-glow flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6" />
                    </span>
                    <h3 className="text-lg font-serif font-bold text-foreground">{b.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section id="process" className="py-20 scroll-mt-24">
          <div className="container mx-auto px-6">
            <SectionTitle eyebrow={t.processEyebrow} title={t.processTitle} />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {t.process.map((p, i) => {
                const Icon = PROCESS_ICONS[i];
                return (
                  <motion.div
                    key={p.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.45, delay: i * 0.1 }}
                    className="glass-card rounded-2xl p-6 relative"
                  >
                    <span className="absolute top-5 right-5 font-serif text-3xl font-bold text-white/10">{i + 1}</span>
                    <span className="w-12 h-12 rounded-xl bg-primary/15 text-glow flex items-center justify-center mb-5">
                      <Icon className="w-6 h-6" />
                    </span>
                    <h3 className="text-lg font-serif font-bold text-foreground">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="py-20 scroll-mt-24">
          <div className="container mx-auto px-6">
            <div className="glass-card rounded-3xl p-8 md:p-12">
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div>
                  <div className="font-mono text-xs tracking-[0.25em] text-glow mb-3">{t.contactEyebrow}</div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">{t.contactTitle}</h2>
                  <p className="mt-4 text-muted-foreground leading-relaxed max-w-md">{t.contactSub}</p>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-xl text-white font-semibold px-7 py-3.5 shadow-lg shadow-primary/30 transition-transform hover:-translate-y-0.5"
                    style={{ background: "linear-gradient(110deg, #2563eb 0%, #6d5cf5 100%)" }}>
                    {t.startProject} <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
                <div className="flex flex-col gap-4">
                  <a href="https://lxclouds.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-xl bg-white/[0.03] border border-white/5 p-4 hover:border-glow/30 transition-colors">
                    <span className="w-11 h-11 rounded-xl bg-primary/15 text-glow flex items-center justify-center"><Globe className="w-5 h-5" /></span>
                    <span><span className="block text-xs text-muted-foreground">{t.labelWebsite}</span><span className="font-semibold text-foreground">lxclouds.com</span></span>
                  </a>
                  <a href={`mailto:${EMAIL}`} className="flex items-center gap-4 rounded-xl bg-white/[0.03] border border-white/5 p-4 hover:border-glow/30 transition-colors">
                    <span className="w-11 h-11 rounded-xl bg-primary/15 text-glow flex items-center justify-center"><Mail className="w-5 h-5" /></span>
                    <span><span className="block text-xs text-muted-foreground">{t.labelEmail}</span><span className="font-semibold text-foreground">{EMAIL}</span></span>
                  </a>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-xl bg-white/[0.03] border border-white/5 p-4 hover:border-glow/30 transition-colors">
                    <span className="w-11 h-11 rounded-xl bg-primary/15 text-glow flex items-center justify-center"><WhatsAppIcon className="w-5 h-5" /></span>
                    <span><span className="block text-xs text-muted-foreground">{t.labelWhatsApp}</span><span className="font-semibold text-foreground">{PHONE_DISPLAY}</span></span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo-cloud.png" alt="" aria-hidden="true" className="h-8 w-auto" />
            <span className="font-serif font-bold tracking-[0.15em] text-foreground text-sm">LX CLOUDS</span>
            <span className="hidden md:inline text-muted-foreground text-sm">— {t.footerTagline}</span>
          </div>
          <p className="text-xs text-muted-foreground font-mono">{t.rights}</p>
        </div>
      </footer>
    </div>
  );
}
