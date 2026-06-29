import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import {
  Cloud, Check, ArrowRight, ArrowUpRight, Menu, X, BadgeEuro, Sparkles, MessageCircle,
  Monitor, LayoutTemplate, Code2, PenTool, Settings, Server, Globe, Mail,
  MessageSquare, Layers, Rocket,
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

// --- Shared (non-translated) icon / image maps ---

const ABOUT_ICONS = [BadgeEuro, Sparkles, MessageCircle];
const SERVICE_ICONS = [Monitor, LayoutTemplate, Code2, Cloud, PenTool, Settings];
const HOSTING_ICONS = [Server, Server, Globe, Mail];
const PROCESS_ICONS = [MessageSquare, Layers, Code2, Rocket];
const WORK_IMAGES: (string | null)[] = [null, null, null, "/project-lonorix.png"];

// --- Translations ---

const T = {
  en: {
    nav: ["Pricing", "Contact"],
    getInTouch: "Get in Touch",
    heroEyebrow: "WE BUILD SOLUTIONS",
    heroLine1: "We Build",
    heroGradient: "Digital Experiences",
    heroLine3: "That Last.",
    heroText:
      "LX CLOUDS crafts websites, web apps, mobile apps, and custom booking systems — designed with precision, built for growth, delivered with care.",
    heroCta1: "View Pricing",
    heroCta2: "Get in Touch",
    stats: [["50+", "Projects Delivered"], ["100%", "Client Satisfaction"], ["Germany", "Based in Germany"]],
    aboutEyebrow: "ABOUT",
    aboutTitle: "Personal. Clean. Reliable.",
    aboutP1:
      "LX CLOUDS is a personal web design project focused on creating modern websites for small businesses, creators, local brands and private projects.",
    aboutP2:
      "No agency overhead. No complicated processes. Just clean design, reliable development and fair communication from start to finish.",
    aboutCards: [
      { title: "Fair Pricing", desc: "Transparent prices without hidden costs." },
      { title: "Modern Design", desc: "Clean layouts, responsive structure and strong visual quality." },
      { title: "Personal Support", desc: "Direct communication and simple project handling." },
    ],
    servicesEyebrow: "SERVICES",
    servicesTitle: "What I Build",
    services: [
      { title: "Websites", desc: "Modern websites for businesses, creators and personal brands." },
      { title: "Landing Pages", desc: "Focused one-page websites for offers, campaigns and portfolios." },
      { title: "Custom Functions", desc: "Forms, WhatsApp automations, filters, galleries and small tools." },
      { title: "Hosting Setup", desc: "Domain, hosting, SSL and email setup for your project." },
      { title: "Branding Basics", desc: "Simple logos, colors and visual direction for your website." },
      { title: "Maintenance", desc: "Small changes, updates and support after launch." },
    ],
    workEyebrow: "WORK",
    workTitle: "Selected Work",
    work: [
      { title: "Holzwurm-Lindheim", desc: "Boutique website for handmade wooden decorations.", features: ["Warm handmade design", "Product overview", "Gallery", "Contact form", "WhatsApp request", "Responsive layout"] },
      { title: "RGM System", desc: "Returns and credit management system.", features: ["Dashboard interface", "Data structure", "Admin workflow", "Clean UI"] },
      { title: "AFM Manager", desc: "Vehicle preparation management platform.", features: ["Task overview", "Status tracking", "Internal workflow", "Custom interface"] },
      { title: "AI Album Cover Generator", desc: "Creative tool for generating album cover ideas.", features: ["Modern interface", "Prompt input", "Image result layout", "Clean user experience"] },
    ],
    pricingEyebrow: "PRICING",
    pricingTitle: "Fair Pricing for Digital Projects",
    pricingSub: "Every project is different. These prices are a starting point.",
    mostPopular: "MOST POPULAR",
    from: "from",
    possibleFeatures: "Possible features:",
    packages: [
      { name: "Landing Page", price: "399", desc: "For simple one-page websites with a clear message.", features: ["One modern page", "Responsive design", "Contact section", "WhatsApp button", "Basic SEO"] },
      { name: "Website", price: "1.500", desc: "For small businesses, local brands and personal projects.", features: ["Custom homepage", "Multiple content sections", "Gallery or product overview", "Contact form", "Mobile optimization", "Basic SEO"] },
      { name: "Custom Website", price: "2.500", desc: "For projects with special functions or more advanced requirements.", features: ["Request forms", "WhatsApp automation", "Filters", "Upload fields", "Booking forms", "Custom JavaScript functions"] },
    ],
    addonsTitle: "ADD-ONS",
    addons: [
      { label: "Logo / Simple Branding", price: "from 30 €" },
      { label: "Additional Page", price: "from 80 €" },
      { label: "Contact Form", price: "from 50 €" },
      { label: "WhatsApp Integration", price: "from 50 €" },
      { label: "Gallery / Lightbox", price: "from 80 €" },
      { label: "Product Request Function", price: "from 250 €" },
      { label: "Hosting & Domain Setup", price: "from 50 €" },
      { label: "Maintenance", price: "from 20 € / month" },
    ],
    hostingTitle: "HOSTING & RUNNING COSTS",
    hosting: [
      { label: "Simple Website Hosting", price: "ca. 5 – 15 €", unit: "/ month" },
      { label: "Business Hosting", price: "ca. 15 – 30 €", unit: "/ month" },
      { label: "Domain", price: "ca. 10 – 20 €", unit: "/ year" },
      { label: "Business Email", price: "ca. 1 – 5 €", unit: "/ month" },
    ],
    hostingNote: "Hosting and domain costs are separate from the website price and depend on the provider and project requirements.",
    processEyebrow: "PROCESS",
    processTitle: "Simple Process. Clear Result.",
    process: [
      { title: "Brief", desc: "You tell me what you need." },
      { title: "Concept", desc: "We define structure, design direction and features." },
      { title: "Design & Build", desc: "I create the website and keep you updated." },
      { title: "Launch", desc: "The website goes online with domain, hosting and basic setup." },
    ],
    contactEyebrow: "CONTACT",
    contactTitle: "Let's Build Your Project.",
    contactSub: "Need a website, landing page or custom function? Send me a message and I'll give you a clear estimate.",
    labelWebsite: "Website",
    labelEmail: "Email",
    labelWhatsApp: "WhatsApp",
    startProject: "Start a Project",
    footerTagline: "Personal web design, clean development and fair digital solutions.",
    rights: `© ${YEAR} LX CLOUDS. All rights reserved.`,
  },
  de: {
    nav: ["Preise", "Kontakt"],
    getInTouch: "Kontakt aufnehmen",
    heroEyebrow: "WIR BAUEN LÖSUNGEN",
    heroLine1: "Wir gestalten",
    heroGradient: "digitale Erlebnisse,",
    heroLine3: "die bleiben.",
    heroText:
      "LX CLOUDS gestaltet Websites, Web-Apps, mobile Apps und individuelle Buchungssysteme — mit Präzision entworfen, für Wachstum gebaut, mit Sorgfalt geliefert.",
    heroCta1: "Preise ansehen",
    heroCta2: "Kontakt aufnehmen",
    stats: [["50+", "Projekte umgesetzt"], ["100%", "Kundenzufriedenheit"], ["Germany", "Sitz in Deutschland"]],
    aboutEyebrow: "ÜBER MICH",
    aboutTitle: "Persönlich. Sauber. Zuverlässig.",
    aboutP1:
      "LX CLOUDS ist ein persönliches Webdesign-Projekt mit Fokus auf moderne Websites für kleine Unternehmen, Creators, lokale Marken und private Projekte.",
    aboutP2:
      "Kein Agentur-Overhead. Keine komplizierten Prozesse. Nur sauberes Design, zuverlässige Entwicklung und faire Kommunikation von Anfang bis Ende.",
    aboutCards: [
      { title: "Faire Preise", desc: "Transparente Preise ohne versteckte Kosten." },
      { title: "Modernes Design", desc: "Klare Layouts, responsive Struktur und starke visuelle Qualität." },
      { title: "Persönlicher Support", desc: "Direkte Kommunikation und einfache Projektabwicklung." },
    ],
    servicesEyebrow: "LEISTUNGEN",
    servicesTitle: "Was ich baue",
    services: [
      { title: "Websites", desc: "Moderne Websites für Unternehmen, Creators und persönliche Marken." },
      { title: "Landingpages", desc: "Fokussierte One-Page-Websites für Angebote, Aktionen und Portfolios." },
      { title: "Individuelle Funktionen", desc: "Formulare, WhatsApp-Automationen, Filter, Galerien und kleine Tools." },
      { title: "Hosting-Setup", desc: "Domain, Hosting, SSL und E-Mail-Einrichtung für dein Projekt." },
      { title: "Branding-Basics", desc: "Einfache Logos, Farben und visuelle Richtung für deine Website." },
      { title: "Wartung", desc: "Kleine Änderungen, Updates und Support nach dem Launch." },
    ],
    workEyebrow: "ARBEITEN",
    workTitle: "Ausgewählte Arbeiten",
    work: [
      { title: "Holzwurm-Lindheim", desc: "Boutique-Website für handgemachte Holzdekorationen.", features: ["Warmes handgemachtes Design", "Produktübersicht", "Galerie", "Kontaktformular", "WhatsApp-Anfrage", "Responsives Layout"] },
      { title: "RGM System", desc: "Retouren- und Gutschriften-Management-System.", features: ["Dashboard-Oberfläche", "Datenstruktur", "Admin-Workflow", "Klares UI"] },
      { title: "AFM Manager", desc: "Plattform für Fahrzeugaufbereitungs-Management.", features: ["Aufgabenübersicht", "Status-Tracking", "Interner Workflow", "Individuelles Interface"] },
      { title: "KI-Album-Cover-Generator", desc: "Kreatives Tool zum Generieren von Album-Cover-Ideen.", features: ["Modernes Interface", "Prompt-Eingabe", "Bild-Ergebnis-Layout", "Klare Bedienung"] },
    ],
    pricingEyebrow: "PREISE",
    pricingTitle: "Faire Preise für digitale Projekte",
    pricingSub: "Jedes Projekt ist anders. Diese Preise sind ein Startpunkt.",
    mostPopular: "BELIEBT",
    from: "ab",
    possibleFeatures: "Mögliche Funktionen:",
    packages: [
      { name: "Landingpage", price: "399", desc: "Für einfache One-Page-Websites mit einer klaren Botschaft.", features: ["Eine moderne Seite", "Responsives Design", "Kontaktbereich", "WhatsApp-Button", "Basis-SEO"] },
      { name: "Website", price: "1.500", desc: "Für kleine Unternehmen, lokale Marken und persönliche Projekte.", features: ["Individuelle Startseite", "Mehrere Inhaltsbereiche", "Galerie oder Produktübersicht", "Kontaktformular", "Mobile Optimierung", "Basis-SEO"] },
      { name: "Individuelle Website", price: "2.500", desc: "Für Projekte mit Sonderfunktionen oder höheren Anforderungen.", features: ["Anfrageformulare", "WhatsApp-Automation", "Filter", "Upload-Felder", "Buchungsformulare", "Individuelle JavaScript-Funktionen"] },
    ],
    addonsTitle: "ZUSATZLEISTUNGEN",
    addons: [
      { label: "Logo / einfaches Branding", price: "ab 30 €" },
      { label: "Zusätzliche Unterseite", price: "ab 80 €" },
      { label: "Kontaktformular", price: "ab 50 €" },
      { label: "WhatsApp-Integration", price: "ab 50 €" },
      { label: "Galerie / Lightbox", price: "ab 80 €" },
      { label: "Produkt-Anfragefunktion", price: "ab 250 €" },
      { label: "Hosting & Domain Einrichtung", price: "ab 50 €" },
      { label: "Wartung", price: "ab 20 € / Monat" },
    ],
    hostingTitle: "HOSTING & LAUFENDE KOSTEN",
    hosting: [
      { label: "Einfaches Website-Hosting", price: "ca. 5 – 15 €", unit: "/ Monat" },
      { label: "Business-Hosting", price: "ca. 15 – 30 €", unit: "/ Monat" },
      { label: "Domain", price: "ca. 10 – 20 €", unit: "/ Jahr" },
      { label: "Business-E-Mail", price: "ca. 1 – 5 €", unit: "/ Monat" },
    ],
    hostingNote: "Hosting- und Domainkosten sind unabhängig vom Website-Preis und hängen vom Anbieter und den Projektanforderungen ab.",
    processEyebrow: "ABLAUF",
    processTitle: "Einfacher Ablauf. Klares Ergebnis.",
    process: [
      { title: "Briefing", desc: "Du sagst mir, was du brauchst." },
      { title: "Konzept", desc: "Wir definieren Struktur, Design-Richtung und Funktionen." },
      { title: "Design & Bau", desc: "Ich erstelle die Website und halte dich auf dem Laufenden." },
      { title: "Launch", desc: "Die Website geht online — mit Domain, Hosting und Basis-Setup." },
    ],
    contactEyebrow: "KONTAKT",
    contactTitle: "Lass uns dein Projekt bauen.",
    contactSub: "Brauchst du eine Website, Landingpage oder Sonderfunktion? Schreib mir und ich gebe dir eine klare Einschätzung.",
    labelWebsite: "Website",
    labelEmail: "E-Mail",
    labelWhatsApp: "WhatsApp",
    startProject: "Projekt starten",
    footerTagline: "Persönliches Webdesign, saubere Entwicklung und faire digitale Lösungen.",
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
  <a href="#home" className="flex items-center gap-2.5" aria-label="LX CLOUDS">
    <Cloud className="w-7 h-7 text-glow" fill="currentColor" strokeWidth={0} />
    <span className="text-xl font-serif font-bold tracking-[0.15em] text-foreground">LX CLOUDS</span>
  </a>
);

// --- Navbar ---

const Navbar = ({ t, lang, setLang }: { t: Translation; lang: Lang; setLang: (l: Lang) => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const hrefs = ["#pricing", "#contact"];

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

const SectionTitle = ({ eyebrow, title, sub, center = true }: { eyebrow: string; title: string; sub?: string; center?: boolean }) => (
  <div className={clsx("mb-12", center && "text-center")}>
    <div className={clsx("font-mono text-xs tracking-[0.25em] text-glow mb-3", center && "flex justify-center")}>{eyebrow}</div>
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground">{title}</h2>
    {sub && <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">{sub}</p>}
  </div>
);

// --- Work card with image / mock fallback ---

const WorkCard = ({ item, image, index }: { item: Translation["work"][number]; image: string | null; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 26 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.5, delay: (index % 2) * 0.1 }}
    className="glass-card rounded-2xl overflow-hidden flex flex-col group"
  >
    <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#0c1830] to-[#0a1424]">
      {image ? (
        <img src={image} alt={item.title} className="w-full h-full object-cover object-top group-hover:scale-[1.04] transition-transform duration-500" />
      ) : (
        <div className="absolute inset-0 flex flex-col p-4">
          <div className="flex gap-1.5 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
          </div>
          <div className="flex-1 grid grid-cols-3 gap-2">
            <div className="col-span-1 rounded-lg bg-white/[0.04] border border-white/5" />
            <div className="col-span-2 flex flex-col gap-2">
              <div className="h-3 w-2/3 rounded bg-white/10" />
              <div className="h-2 w-full rounded bg-white/[0.06]" />
              <div className="h-2 w-5/6 rounded bg-white/[0.06]" />
              <div className="mt-auto h-6 w-24 rounded-md bg-gradient-to-r from-glow/40 to-primary/40" />
            </div>
          </div>
        </div>
      )}
    </div>
    <div className="p-6 flex flex-col flex-1">
      <h3 className="text-xl font-serif font-bold text-foreground">{item.title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{item.desc}</p>
      <ul className="mt-4 space-y-2">
        {item.features.map((f) => (
          <li key={f} className="flex items-center gap-2.5 text-sm text-foreground/85">
            <Check className="w-4 h-4 text-glow flex-shrink-0" strokeWidth={2.5} />
            {f}
          </li>
        ))}
      </ul>
    </div>
  </motion.div>
);

// --- Pricing section (bilingual: German primary, English secondary) ---

type Pkg = {
  name: string; nameEn?: string; priceDe: string; priceEn: string; descDe: string; descEn: string;
  highlight: boolean; features: [string, string][]; notIncludedDe?: string; notIncludedEn?: string;
};

const WEBSITE_PACKAGES: Pkg[] = [
  {
    name: "Landing Page", priceDe: "ab 399 €", priceEn: "from 399 €", highlight: false,
    descDe: "Für eine einfache statische One-Page-Website mit klarer Struktur.",
    descEn: "For a simple static one-page website with a clean structure.",
    features: [
      ["Statische HTML/CSS-Website", "Static HTML/CSS website"],
      ["Einfache Hero Section", "Simple hero section"],
      ["Einfacher Inhaltsbereich", "Basic content section"],
      ["Footer", "Footer section"],
      ["Responsives Layout", "Responsive layout"],
      ["Sauberes Design", "Clean visual design"],
      ["Basis SEO Titel & Beschreibung", "Basic SEO title and description"],
      ["Upload zum Hosting falls benötigt", "Upload to hosting if needed"],
    ],
    notIncludedDe: "Kein Kontaktformular, keine Animationen, keine Galerie, kein CMS, kein Buchungssystem, kein Konfigurator.",
    notIncludedEn: "No contact form, no animations, no gallery, no CMS, no booking system, no configurator.",
  },
  {
    name: "Website", priceDe: "ab 1.500 €", priceEn: "from 1,500 €", highlight: true,
    descDe: "Für eine professionelle Website mit starkem Design, mehreren Bereichen und seriösem Online-Auftritt.",
    descEn: "For a professional website with strong design, multiple sections and a serious online presence.",
    features: [
      ["Individuelles Webdesign", "Custom website design"],
      ["Mehrere Inhaltsbereiche", "Multiple content sections"],
      ["Sticky Navigation", "Sticky navigation"],
      ["Mobile Burger-Menü", "Mobile burger menu"],
      ["Hero Section mit starkem Look", "Hero section with strong visual direction"],
      ["Über-uns Bereich", "About section"],
      ["Leistungen oder Produkte", "Services or products section"],
      ["Galerie oder Portfolio", "Gallery or portfolio section"],
      ["Bewertungen / Testimonials", "Testimonials section"],
      ["FAQ falls benötigt", "FAQ if needed"],
      ["Kontaktbereich", "Contact section"],
      ["Kontaktformular mit einfacher Validierung", "Contact form with basic validation"],
      ["WhatsApp Integration", "WhatsApp integration"],
      ["Smooth Scrolling", "Smooth scrolling"],
      ["Dezente Animationen", "Subtle animations"],
      ["Basis SEO", "Basic SEO setup"],
      ["Impressum & Datenschutz falls benötigt", "Imprint and privacy pages if needed"],
      ["Hosting & Domain Setup Support", "Hosting and domain setup support"],
    ],
  },
  {
    name: "Individuelle Website", nameEn: "Custom Website", priceDe: "ab 2.500 €", priceEn: "from 2,500 €", highlight: false,
    descDe: "Für Websites mit besonderen Funktionen, komplexeren Abläufen und individuellen Anforderungen.",
    descEn: "For websites with special features, advanced user flows and custom requirements.",
    features: [
      ["Alles aus dem Website-Paket", "Everything from the Website package"],
      ["Individuelles UI/UX Konzept", "Custom UI/UX concept"],
      ["Mehrstufige Konfiguratoren", "Multi-step configurators"],
      ["Produkt-Anfragesysteme", "Product request systems"],
      ["WhatsApp Automation", "WhatsApp automation"],
      ["Automatisch generierte Nachrichten", "Auto-generated messages"],
      ["Produktfilter", "Product filters"],
      ["Terminbuchung", "Booking or appointment forms"],
      ["Upload-Felder", "Upload fields"],
      ["Erweiterte Galerie / Slider", "Advanced galleries or sliders"],
      ["Lightbox Funktion", "Lightbox functionality"],
      ["Countdown Bereiche", "Countdown sections"],
      ["Individuelle JavaScript-Funktionen", "Custom JavaScript functions"],
      ["API-Anbindungen falls möglich", "API integrations where possible"],
      ["Strukturierte Daten / JSON-LD", "Structured data / JSON-LD"],
      ["Erweiterte SEO-Struktur", "Advanced SEO structure"],
      ["Performance Optimierung", "Performance optimization"],
      ["Detailliertes Testing", "Detailed testing"],
    ],
  },
];

const HOSTING_PACKAGES: Omit<Pkg, "notIncludedDe" | "notIncludedEn">[] = [
  {
    name: "Basic Hosting", priceDe: "15 € / Monat", priceEn: "15 € / month", highlight: false,
    descDe: "Für kleine statische Websites und einfache Online-Auftritte.",
    descEn: "For small static websites and simple online presences.",
    features: [
      ["Hosting für 1 Website", "Hosting for 1 website"],
      ["SSL-Zertifikat", "SSL certificate"],
      ["Cloudflare Setup", "Cloudflare setup"],
      ["Basis Performance", "Basic performance"],
      ["Technische Einrichtung", "Technical setup"],
      ["Kleine technische Hilfe", "Small technical support"],
    ],
  },
  {
    name: "Business Hosting", priceDe: "29 € / Monat", priceEn: "29 € / month", highlight: true,
    descDe: "Für professionelle Websites mit mehr Anforderungen und regelmäßiger Betreuung.",
    descEn: "For professional websites with higher requirements and regular support.",
    features: [
      ["Hosting für bis zu 3 Websites", "Hosting for up to 3 websites"],
      ["SSL-Zertifikat", "SSL certificate"],
      ["Cloudflare Optimierung", "Cloudflare optimization"],
      ["Performance Setup", "Performance setup"],
      ["Sicherheits-Grundsetup", "Basic security setup"],
      ["Monatliche technische Kontrolle", "Monthly technical check"],
      ["Kleine Inhaltsänderungen", "Small content changes"],
      ["Priorisierter Support", "Priority support"],
    ],
  },
  {
    name: "Premium Hosting", priceDe: "49 € / Monat", priceEn: "49 € / month", highlight: false,
    descDe: "Für anspruchsvollere Projekte mit mehr Betreuung, Sicherheit und Performance.",
    descEn: "For more demanding projects with stronger support, security and performance.",
    features: [
      ["Hosting für bis zu 5 Websites", "Hosting for up to 5 websites"],
      ["SSL-Zertifikat", "SSL certificate"],
      ["Erweiterte Cloudflare Optimierung", "Advanced Cloudflare optimization"],
      ["Performance Monitoring", "Performance monitoring"],
      ["Sicherheitskontrolle", "Security checks"],
      ["Regelmäßige Backups falls möglich", "Regular backups if possible"],
      ["Kleine Änderungen inklusive", "Small changes included"],
      ["Priorisierter Support", "Priority support"],
      ["Technische Beratung", "Technical consulting"],
    ],
  },
];

const DOMAIN_COSTS: [string, string][] = [
  ["Domain: ca. 18 € / Jahr", "Domain: approx. 18 € / year"],
  ["Business E-Mail: ab 3 € / Monat", "Business email: from 3 € / month"],
  ["Zusätzliche Domain: nach Anbieterpreis", "Additional domain: depending on provider"],
  ["Größere Änderungen: nach Aufwand", "Larger changes: based on effort"],
];

const PRICING_ADDONS: [string, string, string, string][] = [
  ["Logo / einfaches Branding", "Logo / simple branding", "ab 30 €", "from 30 €"],
  ["Zusätzliche Unterseite", "Additional page", "ab 80 €", "from 80 €"],
  ["Kontaktformular", "Contact form", "ab 50 €", "from 50 €"],
  ["WhatsApp Integration", "WhatsApp integration", "ab 50 €", "from 50 €"],
  ["Galerie / Lightbox", "Gallery / lightbox", "ab 80 €", "from 80 €"],
  ["Produkt-Anfragefunktion", "Product request function", "ab 250 €", "from 250 €"],
  ["Google Unternehmensprofil", "Google Business Profile", "ab 100 €", "from 100 €"],
  ["Wartung & kleine Änderungen", "Maintenance & small changes", "ab 20 € / Monat", "from 20 € / month"],
];

const PricingSection = ({ lang }: { lang: Lang }) => {
  const pick = (de: string, en: string) => (lang === "de" ? de : en);

  const featureGrid = (features: [string, string][]) => (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
      {features.map(([de, en]) => (
        <li key={de} className="flex gap-1.5 items-start text-xs text-foreground/85">
          <Check className="w-3 h-3 text-glow mt-[3px] shrink-0" strokeWidth={3} />
          <span className="leading-snug">{pick(de, en)}</span>
        </li>
      ))}
    </ul>
  );

  const includedLabel = (
    <div className="mt-4 mb-2.5 font-mono text-[10px] tracking-[0.2em] uppercase text-glow">{pick("Enthalten", "Included")}</div>
  );

  const cta = (highlight: boolean) => (
    <a href="#contact" className={clsx("mt-5 block text-center rounded-lg py-2.5 font-semibold text-sm transition-colors", highlight ? "bg-primary hover:bg-primary-hover text-white" : "border border-white/15 hover:border-white/35 hover:bg-white/5 text-foreground")}>
      {pick("Anfragen", "Get a quote")}
    </a>
  );

  return (
    <section id="pricing" className="py-24 scroll-mt-24">
      <div className="container mx-auto px-6">
        {/* header */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <div className="font-mono text-xs tracking-[0.25em] text-glow mb-3">{pick("PREISE", "PRICING")}</div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground">{pick("Preise für digitale Projekte", "Pricing for Digital Projects")}</h2>
          <p className="mt-5 text-foreground/75">{pick("Transparente Startpreise für Websites, individuelle Funktionen und Hosting.", "Transparent starting prices for websites, custom features and hosting.")}</p>
        </div>

        {/* website packages */}
        <div className="grid md:grid-cols-3 gap-5 items-start">
          {WEBSITE_PACKAGES.map((p) => (
            <div key={p.name} className={clsx("relative rounded-2xl p-6 flex flex-col", p.highlight ? "bg-primary/[0.07] border border-primary/40 shadow-[0_0_45px_rgba(59,130,246,0.14)]" : "glass-card")}>
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-glow to-primary text-white text-[10px] font-bold tracking-wider px-3 py-1 uppercase whitespace-nowrap">{pick("Beliebt", "Most Popular")}</span>
              )}
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-lg font-serif font-bold text-foreground">{pick(p.name, p.nameEn ?? p.name)}</h3>
                <div className="text-2xl font-serif font-bold gradient-text whitespace-nowrap">{pick(p.priceDe, p.priceEn)}</div>
              </div>
              <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">{pick(p.descDe, p.descEn)}</p>
              {includedLabel}
              <div className="flex-1">{featureGrid(p.features)}</div>
              {p.notIncludedDe && (
                <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-3">
                  <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1.5">{pick("Nicht enthalten", "Not included")}</div>
                  <p className="text-xs text-foreground/65 leading-relaxed">{pick(p.notIncludedDe, p.notIncludedEn!)}</p>
                </div>
              )}
              {cta(p.highlight)}
            </div>
          ))}
        </div>

        {/* hosting */}
        <div className="text-center mt-16 mb-8">
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground">{pick("Hosting-Pakete", "Hosting Packages")}</h3>
        </div>
        <div className="flex flex-col gap-4 max-w-5xl mx-auto">
          {HOSTING_PACKAGES.map((h) => (
            <div key={h.name} className={clsx("relative rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center gap-5", h.highlight ? "bg-primary/[0.06] border border-primary/40 shadow-[0_0_40px_rgba(59,130,246,0.12)]" : "glass-card")}>
              {/* left: name + price */}
              <div className="lg:w-60 lg:shrink-0">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-lg font-serif font-bold text-foreground">{h.name}</h3>
                  {h.highlight && (
                    <span className="rounded-full bg-gradient-to-r from-glow to-primary text-white text-[9px] font-bold tracking-wider px-2 py-0.5 uppercase">{pick("Beliebt", "Most Popular")}</span>
                  )}
                </div>
                <div className="mt-1.5 text-2xl font-serif font-bold gradient-text">{pick(h.priceDe, h.priceEn)}</div>
                <p className="mt-1 text-xs text-muted-foreground leading-snug">{pick(h.descDe, h.descEn)}</p>
              </div>
              {/* divider */}
              <div className="hidden lg:block w-px self-stretch bg-white/10" />
              {/* features as chips */}
              <div className="flex-1 flex flex-wrap gap-2">
                {h.features.map(([de, en]) => (
                  <span key={de} className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.04] border border-white/10 px-2.5 py-1 text-xs text-foreground/85">
                    <Check className="w-3 h-3 text-glow shrink-0" strokeWidth={3} />
                    {pick(de, en)}
                  </span>
                ))}
              </div>
              {/* cta */}
              <a href="#contact" className={clsx("lg:shrink-0 text-center rounded-lg px-6 py-2.5 text-sm font-semibold transition-colors", h.highlight ? "bg-primary hover:bg-primary-hover text-white" : "border border-white/15 hover:border-white/35 hover:bg-white/5 text-foreground")}>
                {pick("Anfragen", "Get a quote")}
              </a>
            </div>
          ))}
        </div>

        {/* domains + add-ons */}
        <div className="grid lg:grid-cols-2 gap-5 mt-14">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-base font-serif font-bold text-foreground mb-3">{pick("Domains & laufende Kosten", "Domains & running costs")}</h3>
            <ul className="divide-y divide-white/10">
              {DOMAIN_COSTS.map(([de, en]) => (
                <li key={de} className="py-2.5 text-sm text-foreground/85">{pick(de, en)}</li>
              ))}
            </ul>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-base font-serif font-bold text-foreground mb-3">{pick("Zusatzleistungen", "Add-ons")}</h3>
            <ul className="divide-y divide-white/10">
              {PRICING_ADDONS.map(([de, en, pde, pen]) => (
                <li key={de} className="py-2.5 flex items-center justify-between gap-4">
                  <span className="text-sm text-foreground/85">{pick(de, en)}</span>
                  <span className="text-sm font-semibold text-glow whitespace-nowrap">{pick(pde, pen)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* footer note */}
        <div className="glass-card rounded-2xl p-6 mt-8 max-w-3xl mx-auto text-center">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {pick(
              "Alle Preise sind Startpreise und hängen vom finalen Umfang, Design, Inhalt und den gewünschten Funktionen ab. Nach einem kurzen Gespräch erhältst du ein klares Festpreis-Angebot.",
              "All prices are starting prices and depend on the final scope, design, content and required features. After a short conversation, you receive a clear fixed-price offer."
            )}
          </p>
        </div>
      </div>
    </section>
  );
};

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
          {/* background server image */}
          <div className="absolute inset-0 z-0">
            <img src="/hero-servers.png" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: "right center" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, #06090f 0%, #06090f 30%, rgba(6,9,15,0.55) 41%, rgba(6,9,15,0) 55%)" }} />
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
                <a href="#pricing" className="inline-flex items-center gap-2 rounded-xl text-white font-semibold px-7 py-3.5 shadow-lg shadow-primary/30 transition-transform hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(110deg, #2563eb 0%, #6d5cf5 100%)" }}>
                  {t.heroCta1} <ArrowUpRight className="w-4 h-4" />
                </a>
                <a href="#contact" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] hover:bg-white/[0.07] text-foreground font-semibold px-7 py-3.5 transition-colors">
                  {t.heroCta2} <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              <div className="mt-12 flex">
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

        <PricingSection lang={lang} />

        {/* CONTACT */}
        <section id="contact" className="py-20 scroll-mt-24">
          <div className="container mx-auto px-6">
            <div className="glass-card rounded-3xl p-8 md:p-12">
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div>
                  <div className="font-mono text-xs tracking-[0.25em] text-glow mb-3">{t.contactEyebrow}</div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">{t.contactTitle}</h2>
                  <p className="mt-4 text-muted-foreground leading-relaxed max-w-md">{t.contactSub}</p>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary-hover text-white font-semibold px-7 py-3.5 transition-colors shadow-lg shadow-primary/30">
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
          <div className="flex items-center gap-3">
            <Cloud className="w-5 h-5 text-glow" fill="currentColor" strokeWidth={0} />
            <span className="font-serif font-bold tracking-[0.15em] text-foreground text-sm">LX CLOUDS</span>
            <span className="hidden md:inline text-muted-foreground text-sm">— {t.footerTagline}</span>
          </div>
          <p className="text-xs text-muted-foreground font-mono">{t.rights}</p>
        </div>
      </footer>
    </div>
  );
}
