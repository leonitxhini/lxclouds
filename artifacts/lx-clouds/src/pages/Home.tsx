import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import { clsx } from "clsx";
import {
  ArrowRight, ArrowUpRight, Check, X as XIcon, Menu, X,
  Monitor, Server, Cpu, Network, Bot, Code2,
  ShieldCheck, Gauge, DatabaseBackup, Maximize2, Activity, Wrench, BarChart3, Webhook,
  Zap, Lock, TrendingUp, Quote, Mail, Globe, ExternalLink, MapPin,
  Instagram, Linkedin, Github, Send,
} from "lucide-react";
import { Reveal, Magnetic, TiltCard, Counter, ripple, EASE, prefersReducedMotion } from "@/lib/fx";
import { Loader, CursorFX, Particles } from "@/components/site/Effects";
import { useSubmitContact } from "@/hooks/use-contact";

// --- Constants ---

const PHONE_DISPLAY = "0157 8099 8115";
const WHATSAPP_URL = "https://wa.me/4915780998115";
const EMAIL = "info@lxclouds.com";
const YEAR = new Date().getFullYear();

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

// --- Data ---

const TRUST_ITEMS = [
  { icon: Zap, label: "Fast" },
  { icon: ShieldCheck, label: "Secure" },
  { icon: TrendingUp, label: "Scalable" },
  { icon: Activity, label: "99.99% Uptime" },
  { icon: Lock, label: "SSL" },
  { icon: Network, label: "Cloud Infrastructure" },
];

const SERVICES = [
  { icon: Monitor, title: "Website Development", desc: "High-end websites and web apps — engineered for speed, SEO and conversion, designed to feel expensive.", span: true },
  { icon: Server, title: "Cloud Hosting", desc: "Blazing fast, reliable hosting for websites and applications.", span: false },
  { icon: Cpu, title: "Virtual Servers", desc: "Full-control VPS with dedicated resources and root access.", span: false },
  { icon: Network, title: "Cloud Infrastructure", desc: "Scalable infrastructure, storage and networking that grows with your business — without the complexity.", span: true },
  { icon: Bot, title: "Business Automation", desc: "Workflows, WhatsApp bots and integrations that save hours every week.", span: false },
  { icon: Code2, title: "Custom Software", desc: "Tailored systems, dashboards and tools built around your exact workflow — goodbye spreadsheet chaos.", span: true },
];

const COMPARISON: [string, string][] = [
  ["Slow handoffs and ticket queues", "Direct line to the people who build"],
  ["Recycled templates", "Custom design systems"],
  ["Hidden costs and surprises", "Transparent fixed pricing"],
  ["Weeks of waiting", "Days, not weeks"],
  ["Outsourced support", "Personal 24/7 support"],
];

const FEATURES = [
  { icon: ShieldCheck, title: "Enterprise Security", desc: "Hardened setups, SSL everywhere." },
  { icon: Gauge, title: "High Performance", desc: "Optimized for instant load times." },
  { icon: DatabaseBackup, title: "Automatic Backups", desc: "Your data, safe every single day." },
  { icon: Maximize2, title: "Cloud Scaling", desc: "Resources that grow on demand." },
  { icon: Activity, title: "Monitoring", desc: "24/7 uptime and health checks." },
  { icon: Wrench, title: "Maintenance", desc: "Updates handled in the background." },
  { icon: BarChart3, title: "Analytics", desc: "Know what your visitors do." },
  { icon: Webhook, title: "API Integrations", desc: "Connect any tool you rely on." },
];

const PROJECTS = [
  { title: "Lonorix", tag: "AI Platform", img: "/project-lonorix.png", url: "https://lonorix.com" },
  { title: "ZgjedhPlus", tag: "Price Comparison", img: "/project-zgjedhplus.png", url: "https://zgjedhplus.com" },
  { title: "Rent a Car Ron", tag: "Booking Platform", img: "/project-rentacarron.png", url: "https://rentacarron.com" },
  { title: "AutoElite", tag: "Automotive Platform", img: "/project-autoelite.png", url: null },
];

const PROCESS = [
  { n: "01", title: "Discovery", desc: "We understand your goals, users and requirements." },
  { n: "02", title: "Design", desc: "Custom UI direction and pixel-perfect screens." },
  { n: "03", title: "Development", desc: "Clean, fast, scalable code — built to last." },
  { n: "04", title: "Launch", desc: "Deployment, domains, SSL and go-live support." },
  { n: "05", title: "Support", desc: "Monitoring, updates and a direct line to us." },
];

const STATS = [
  { to: 5, suffix: "+", label: "Years Experience" },
  { to: 50, suffix: "+", label: "Projects Delivered" },
  { to: 30, suffix: "+", label: "Happy Clients" },
  { to: 24, prefix: "<", suffix: "h", label: "Response Time" },
];

const TESTIMONIALS = [
  { quote: "LX CLOUDS rebuilt our entire web presence and automated our booking flow. We save hours every single week — and the site finally looks like us.", name: "Sarah M.", role: "Boutique Owner" },
  { quote: "Fast, reliable and always reachable. Our new platform loads instantly and our customers notice the difference immediately.", name: "Daniel K.", role: "Logistics Manager" },
  { quote: "From first call to launch in three weeks. The quality feels like a big agency — without the overhead or the buzzwords.", name: "Amir R.", role: "Startup Founder" },
];

// --- Small building blocks ---

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
    <span className="h-1.5 w-1.5 rounded-full bg-glow shadow-[0_0_8px_2px] shadow-glow/60" />
    <span className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-glow">{children}</span>
  </div>
);

const SectionHead = ({ eyebrow, title, sub, align = "center" }: { eyebrow: string; title: React.ReactNode; sub?: string; align?: "center" | "left" }) => (
  <Reveal className={clsx("mb-14 max-w-3xl", align === "center" ? "mx-auto text-center" : "")}>
    <Eyebrow>{eyebrow}</Eyebrow>
    <h2 className="font-display text-4xl font-bold leading-[1.06] md:text-5xl">{title}</h2>
    {sub && <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">{sub}</p>}
  </Reveal>
);

const PrimaryButton = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void }) => (
  <Magnetic>
    <a
      href={href}
      onClick={(e) => { ripple(e); onClick?.(e); }}
      className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-glow px-7 py-3.5 font-semibold text-white shadow-[0_8px_32px_rgba(29,124,255,0.35)] transition-shadow hover:shadow-[0_8px_44px_rgba(29,124,255,0.55)]"
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </a>
  </Magnetic>
);

const GhostButton = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void }) => (
  <Magnetic strength={0.22}>
    <a
      href={href}
      onClick={(e) => { ripple(e); onClick?.(e); }}
      className="relative inline-flex items-center gap-2 overflow-hidden rounded-xl glass px-7 py-3.5 font-semibold text-foreground transition-colors hover:border-white/25 hover:bg-white/[0.07]"
    >
      {children}
    </a>
  </Magnetic>
);

// --- Navbar ---

const Navbar = ({ goTo }: { goTo: (hash: string) => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const click = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    goTo(href);
  };

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 1.15, ease: EASE }}
      className={clsx(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
        scrolled ? "border-white/10 bg-[#05070B]/70 py-3 backdrop-blur-xl" : "border-transparent bg-transparent py-5"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-6">
        <a href="#home" onClick={(e) => click(e, "#home")} className="flex items-center gap-2.5" aria-label="LX CLOUDS home">
          <img src="/logo-mark.png" alt="" className="h-9 w-auto" />
          <span className="font-display text-lg font-bold tracking-[0.14em]">
            LX <span className="text-gradient">CLOUDS</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => click(e, l.href)}
              className="text-sm font-medium text-foreground/65 transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
          <Magnetic strength={0.25}>
            <a
              href="#contact"
              onClick={(e) => { ripple(e); click(e, "#contact"); }}
              className="relative inline-flex items-center gap-1.5 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-glow px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_24px_rgba(29,124,255,0.35)]"
            >
              Get Started <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </Magnetic>
        </nav>

        <button className="p-2 lg:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/10 bg-[#05070B]/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {NAV_LINKS.map((l) => (
                <a key={l.href} href={l.href} onClick={(e) => click(e, l.href)} className="py-2.5 text-sm font-medium text-foreground/80">
                  {l.label}
                </a>
              ))}
              <a href="#contact" onClick={(e) => click(e, "#contact")} className="mt-2 rounded-xl bg-gradient-to-r from-primary to-glow px-5 py-3 text-center text-sm font-semibold text-white">
                Get Started
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

// --- Hero ---

const Hero = ({ goTo }: { goTo: (hash: string) => void }) => {
  const visualRef = useRef<HTMLDivElement>(null);

  // mouse parallax on the hero visual
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = visualRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 22;
      const y = (e.clientY / window.innerHeight - 0.5) * 14;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const anchor = (hash: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    goTo(hash);
  };

  return (
    <section id="home" className="relative overflow-hidden pt-36 pb-24 lg:pt-44 lg:pb-32">
      {/* background: depth, grid, volumetric light, particles */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_75%_60%_at_50%_35%,black,transparent)]" />
        <div className="animate-drift absolute -top-40 left-1/4 h-[560px] w-[560px] rounded-full bg-primary/15 blur-[140px]" />
        <div className="animate-drift absolute top-1/3 right-[-8%] h-[520px] w-[520px] rounded-full bg-glow/10 blur-[140px] [animation-delay:-7s]" />
        <div className="absolute right-[8%] top-0 h-[70%] w-40 rotate-[24deg] bg-gradient-to-b from-glow/[0.07] to-transparent blur-2xl" />
        <div className="absolute right-[24%] top-0 h-[55%] w-24 rotate-[24deg] bg-gradient-to-b from-primary/[0.08] to-transparent blur-2xl" />
        <Particles className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#05070B]" />
      </div>

      <div className="container relative z-10 mx-auto grid items-center gap-16 px-6 lg:grid-cols-2">
        {/* Left: copy */}
        <div>
          <motion.div initial={{ opacity: 0, y: 26, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.8, delay: 1.2, ease: EASE }}>
            <Eyebrow>Cloud Solutions</Eyebrow>
            <h1 className="font-display text-5xl font-bold leading-[1.03] tracking-tight md:text-6xl xl:text-7xl">
              Cloud Infrastructure
              <br />
              Built for
              <br />
              <span className="text-gradient-animated">Modern Business.</span>
            </h1>
            <p className="mt-7 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
              LX CLOUDS builds premium websites, cloud infrastructure, hosting, automation and digital solutions for modern businesses.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <PrimaryButton href="#contact" onClick={anchor("#contact")}>Get Started</PrimaryButton>
              <GhostButton href="#projects" onClick={anchor("#projects")}>View Projects</GhostButton>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3">
              {["Cloud Hosting", "Web Development", "Enterprise Solutions"].map((t) => (
                <span key={t} className="inline-flex items-center gap-2 text-sm text-foreground/75">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-glow">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right: interactive 3D cloud */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, filter: "blur(12px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 1.35, ease: EASE }}
          className="relative hidden items-center justify-center lg:flex"
        >
          <div ref={visualRef} className="relative transition-transform duration-300 ease-out will-change-transform">
            {/* glow core */}
            <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-[90px]" aria-hidden="true" />
            <div className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow/20 blur-[60px]" aria-hidden="true" />
            {/* orbit rings */}
            <div className="animate-spin-slower absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/15" aria-hidden="true">
              <span className="absolute -top-1 left-1/2 h-2 w-2 rounded-full bg-glow shadow-[0_0_12px_3px] shadow-glow/60" />
            </div>
            <div className="animate-spin-slower absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10 [animation-direction:reverse] [animation-duration:55s]" aria-hidden="true" />
            {/* the cloud */}
            <motion.img
              src="/logo-mark.png"
              alt="LX CLOUDS cloud logo"
              className="animate-float-slow relative w-[420px] max-w-full drop-shadow-[0_30px_80px_rgba(29,124,255,0.35)]"
              animate={prefersReducedMotion() ? undefined : { rotate: [0, 2.5, 0, -2.5, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// --- Trust bar (marquee) ---

const TrustBar = () => (
  <section className="border-y border-white/5 bg-white/[0.015] py-5" aria-label="Highlights">
    <div className="mask-fade-x overflow-hidden">
      <div className="animate-marquee flex w-max items-center gap-14 pr-14">
        {[...TRUST_ITEMS, ...TRUST_ITEMS].map((t, i) => (
          <span key={i} className="inline-flex items-center gap-2.5 whitespace-nowrap font-mono text-xs uppercase tracking-[0.22em] text-foreground/45">
            <t.icon className="h-4 w-4 text-primary/70" />
            {t.label}
          </span>
        ))}
      </div>
    </div>
  </section>
);

// --- Services (bento) ---

const Services = () => (
  <section id="services" className="scroll-mt-24 py-24 lg:py-32">
    <div className="container mx-auto px-6">
      <SectionHead
        eyebrow="Our Services"
        title={<>Everything You Need.<br />All in One Cloud.</>}
        sub="From powerful hosting to custom software — one partner for your entire digital stack."
      />
      <div className="grid gap-5 md:grid-cols-3">
        {SERVICES.map((s, i) => (
          <Reveal key={s.title} delay={(i % 3) * 0.08} className={clsx(s.span && "md:col-span-2")}>
            <TiltCard className="group glass h-full rounded-3xl p-8 transition-colors duration-300 hover:border-primary/40">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/25 to-glow/10 text-glow ring-1 ring-inset ring-primary/30 transition-transform duration-300 group-hover:scale-110">
                <s.icon className="h-7 w-7" />
              </div>
              <h3 className="font-display text-xl font-bold">{s.title}</h3>
              <p className="mt-2.5 max-w-md text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

// --- Why LX CLOUDS (comparison) ---

const WhyUs = ({ goTo }: { goTo: (hash: string) => void }) => (
  <section className="relative py-24 lg:py-32">
    <div className="absolute left-[-10%] top-1/3 h-[420px] w-[420px] rounded-full bg-primary/10 blur-[130px]" aria-hidden="true" />
    <div className="container relative mx-auto grid items-center gap-14 px-6 lg:grid-cols-2">
      <Reveal>
        <Eyebrow>Why LX CLOUDS</Eyebrow>
        <h2 className="font-display text-4xl font-bold leading-[1.05] md:text-6xl">
          An agency that
          <br />
          works like a
          <br />
          <span className="text-gradient-animated">product team.</span>
        </h2>
        <p className="mt-6 max-w-md text-muted-foreground md:text-lg">
          No layers, no hand-offs, no waiting. You talk directly to the people who design, build and run your platform.
        </p>
        <div className="mt-8">
          <PrimaryButton href="#contact" onClick={(e) => { e.preventDefault(); goTo("#contact"); }}>Work With Us</PrimaryButton>
        </div>
      </Reveal>

      <Reveal delay={0.12}>
        <div className="glass overflow-hidden rounded-3xl">
          <div className="grid grid-cols-2 border-b border-white/10">
            <div className="px-6 py-5 text-center font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Traditional Agency</div>
            <div className="border-l border-white/10 bg-primary/[0.06] px-6 py-5 text-center font-mono text-xs uppercase tracking-[0.18em] text-glow">LX CLOUDS</div>
          </div>
          {COMPARISON.map(([bad, good], i) => (
            <motion.div
              key={bad}
              className="grid grid-cols-2 border-b border-white/5 last:border-0"
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.09, duration: 0.5, ease: EASE }}
            >
              <div className="flex items-center gap-3 px-6 py-4 text-sm text-muted-foreground">
                <XIcon className="h-4 w-4 shrink-0 text-red-400/70" />
                {bad}
              </div>
              <div className="flex items-center gap-3 border-l border-white/10 bg-primary/[0.05] px-6 py-4 text-sm text-foreground/90">
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 + i * 0.09, type: "spring", stiffness: 400, damping: 15 }}
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-glow text-white"
                >
                  <Check className="h-3 w-3" strokeWidth={3.5} />
                </motion.span>
                {good}
              </div>
            </motion.div>
          ))}
        </div>
      </Reveal>
    </div>
  </section>
);

// --- Features ---

const Features = () => (
  <section className="py-24 lg:py-32">
    <div className="container mx-auto px-6">
      <SectionHead
        eyebrow="Platform"
        title={<>Enterprise-grade.<br />By default.</>}
        sub="Every project ships with the details that keep it fast, safe and worry-free."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={(i % 4) * 0.07}>
            <TiltCard max={5} className="group glass h-full rounded-2xl p-6 transition-colors duration-300 hover:border-glow/40">
              <f.icon className="mb-4 h-6 w-6 text-glow transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110" />
              <h3 className="font-display text-base font-bold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

// --- Projects ---

const Projects = () => (
  <section id="projects" className="scroll-mt-24 py-24 lg:py-32">
    <div className="container mx-auto px-6">
      <SectionHead
        eyebrow="Selected Work"
        title={<>Projects that ship<br />and perform.</>}
        sub="A selection of platforms we designed, built and launched."
      />
      <div className="grid gap-6 md:grid-cols-2">
        {PROJECTS.map((p, i) => {
          const Wrapper = p.url ? "a" : "div";
          return (
            <Reveal key={p.title} delay={(i % 2) * 0.1}>
              <TiltCard max={4} className="group">
                <Wrapper
                  {...(p.url ? { href: p.url, target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="block overflow-hidden rounded-2xl border border-white/10 bg-surface transition-colors duration-300 group-hover:border-primary/40"
                >
                  {/* browser chrome */}
                  <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                    <span className="ml-3 flex-1 truncate rounded-md bg-white/[0.05] px-3 py-1 font-mono text-[10px] text-muted-foreground">
                      {p.url ? p.url.replace("https://", "") : "internal project"}
                    </span>
                  </div>
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={p.img}
                      alt={`${p.title} — ${p.tag}`}
                      loading="lazy"
                      className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                    />
                    <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-[#05070B]/95 via-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div>
                        <div className="font-display text-lg font-bold">{p.title}</div>
                        <div className="text-xs text-glow">{p.tag}</div>
                      </div>
                      {p.url && (
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-primary to-glow text-white">
                          <ExternalLink className="h-4 w-4" />
                        </span>
                      )}
                    </div>
                  </div>
                </Wrapper>
              </TiltCard>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);

// --- Process (timeline) ---

const Process = () => (
  <section className="py-24 lg:py-32">
    <div className="container mx-auto px-6">
      <SectionHead
        eyebrow="How We Work"
        title={<>From idea<br />to launch.</>}
      />
      <div className="relative">
        {/* animated connecting line */}
        <motion.div
          className="absolute left-0 top-6 hidden h-px w-full bg-gradient-to-r from-primary via-glow to-primary/20 lg:block"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          style={{ transformOrigin: "left" }}
          transition={{ duration: 1.6, ease: EASE }}
          aria-hidden="true"
        />
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {PROCESS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.12}>
              <div className="relative">
                <div className="relative z-10 mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-[#05070B] font-mono text-sm font-semibold text-glow shadow-[0_0_24px_rgba(29,124,255,0.25)]">
                  {s.n}
                </div>
                <span className="pointer-events-none absolute -top-7 right-0 font-display text-6xl font-black text-white/[0.04]">{s.n}</span>
                <h3 className="font-display text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// --- About / stats ---

const About = () => (
  <section id="about" className="relative scroll-mt-24 py-24 lg:py-32">
    <div className="absolute right-[-8%] top-1/4 h-[380px] w-[380px] rounded-full bg-glow/10 blur-[120px]" aria-hidden="true" />
    <div className="container relative mx-auto px-6">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <Eyebrow>About LX CLOUDS</Eyebrow>
          <h2 className="font-display text-4xl font-bold leading-[1.06] md:text-5xl">
            Built in Germany.
            <br />
            <span className="text-gradient">Trusted everywhere.</span>
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
            LX CLOUDS is a digital studio for businesses that expect more: more speed, more polish, more ownership.
            We combine design, engineering and infrastructure under one roof — so your project has one responsible team from idea to operation.
          </p>
        </Reveal>
        <div className="grid grid-cols-2 gap-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="glass rounded-2xl p-7 text-center transition-colors duration-300 hover:border-primary/35">
                <div className="font-display text-4xl font-bold md:text-5xl">
                  <Counter to={s.to} prefix={s.prefix ?? ""} suffix={s.suffix} className="text-gradient" />
                </div>
                <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// --- Testimonials (auto slider) ---

const Testimonials = () => {
  const [idx, setIdx] = useState(0);
  const paused = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      if (!paused.current) setIdx((i) => (i + 1) % TESTIMONIALS.length);
    }, 5500);
    return () => clearInterval(id);
  }, []);

  const t = TESTIMONIALS[idx];

  return (
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <SectionHead eyebrow="Testimonials" title="What clients say." />
        <div
          className="relative mx-auto max-w-3xl"
          onMouseEnter={() => { paused.current = true; }}
          onMouseLeave={() => { paused.current = false; }}
        >
          <div className="glass relative min-h-[260px] overflow-hidden rounded-3xl p-10 md:p-12">
            <Quote className="absolute right-8 top-8 h-10 w-10 text-primary/20" aria-hidden="true" />
            <AnimatePresence mode="wait">
              <motion.figure
                key={idx}
                initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -18, filter: "blur(6px)" }}
                transition={{ duration: 0.55, ease: EASE }}
              >
                <blockquote className="text-lg leading-relaxed text-foreground/90 md:text-xl">“{t.quote}”</blockquote>
                <figcaption className="mt-7 flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-glow font-display text-sm font-bold text-white">
                    {t.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block font-semibold">{t.name}</span>
                    <span className="block text-sm text-muted-foreground">{t.role}</span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
          <div className="mt-6 flex justify-center gap-2.5">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Testimonial ${i + 1}`}
                className={clsx(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === idx ? "w-8 bg-gradient-to-r from-primary to-glow" : "w-3 bg-white/15 hover:bg-white/30"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Contact ---

const Field = ({ label, name, type = "text", textarea = false, required = true }: { label: string; name: string; type?: string; textarea?: boolean; required?: boolean }) => (
  <div className="relative">
    {textarea ? (
      <textarea
        id={name}
        name={name}
        rows={4}
        required={required}
        placeholder=" "
        className="peer w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 pb-3 pt-6 text-sm text-foreground outline-none transition-colors focus:border-primary/60"
      />
    ) : (
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder=" "
        className="peer w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 pb-3 pt-6 text-sm text-foreground outline-none transition-colors focus:border-primary/60"
      />
    )}
    <label
      htmlFor={name}
      className="pointer-events-none absolute left-4 top-4.5 text-sm text-muted-foreground transition-all duration-200 peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-glow peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px]"
    >
      {label}
    </label>
  </div>
);

const Contact = () => {
  const { mutate, isPending, isSuccess, isError, error } = useSubmitContact();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    mutate({
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
    });
  };

  return (
    <section id="contact" className="scroll-mt-24 py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <SectionHead
          eyebrow="Contact"
          title={<>Let's build<br />something great.</>}
          sub="Tell us about your project — we reply within 24 hours."
        />
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-5">
          {/* form */}
          <Reveal className="lg:col-span-3">
            <div className="glass h-full rounded-3xl p-8 md:p-10">
              {isSuccess ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex h-full flex-col items-center justify-center py-14 text-center">
                  <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-glow text-white">
                    <Check className="h-8 w-8" strokeWidth={3} />
                  </span>
                  <h3 className="font-display text-2xl font-bold">Message sent</h3>
                  <p className="mt-2 text-muted-foreground">Thanks! We'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Your Name" name="name" />
                    <Field label="Email Address" name="email" type="email" />
                  </div>
                  <Field label="Tell us about your project" name="message" textarea />
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <Magnetic>
                      <button
                        type="submit"
                        disabled={isPending}
                        onClick={(e) => ripple(e)}
                        className="relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-glow px-8 py-3.5 font-semibold text-white shadow-[0_8px_32px_rgba(29,124,255,0.35)] transition-shadow hover:shadow-[0_8px_44px_rgba(29,124,255,0.55)] disabled:opacity-60"
                      >
                        {isPending ? "Sending…" : "Send Message"} <Send className="h-4 w-4" />
                      </button>
                    </Magnetic>
                    {isError && <p className="text-sm text-destructive">{(error as Error)?.message ?? "Something went wrong."}</p>}
                  </div>
                </form>
              )}
            </div>
          </Reveal>

          {/* info + map */}
          <Reveal delay={0.12} className="lg:col-span-2">
            <div className="flex h-full flex-col gap-4">
              <a href={`mailto:${EMAIL}`} className="glass flex items-center gap-4 rounded-2xl p-5 transition-colors hover:border-primary/40">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-glow"><Mail className="h-5 w-5" /></span>
                <span><span className="block text-xs text-muted-foreground">Email</span><span className="text-sm font-semibold">{EMAIL}</span></span>
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="glass flex items-center gap-4 rounded-2xl p-5 transition-colors hover:border-primary/40">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-glow"><Globe className="h-5 w-5" /></span>
                <span><span className="block text-xs text-muted-foreground">WhatsApp</span><span className="text-sm font-semibold">{PHONE_DISPLAY}</span></span>
              </a>
              <div className="glass flex items-center gap-4 rounded-2xl p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-glow"><MapPin className="h-5 w-5" /></span>
                <span><span className="block text-xs text-muted-foreground">Based in</span><span className="text-sm font-semibold">Offenbach am Main, Germany</span></span>
              </div>
              <div className="glass flex-1 overflow-hidden rounded-2xl">
                <iframe
                  title="LX CLOUDS location"
                  src="https://www.google.com/maps?q=Offenbach%20am%20Main&z=11&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full min-h-[180px] w-full border-0 opacity-80 grayscale invert-[0.92] hue-rotate-180 transition-opacity hover:opacity-100"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

// --- Footer ---

const Footer = ({ goTo }: { goTo: (hash: string) => void }) => (
  <footer className="border-t border-white/5 py-14">
    <div className="container mx-auto px-6">
      <div className="flex flex-col items-start justify-between gap-10 md:flex-row">
        <div className="max-w-xs">
          <a href="#home" onClick={(e) => { e.preventDefault(); goTo("#home"); }} className="flex items-center gap-2.5">
            <img src="/logo-mark.png" alt="" className="h-9 w-auto" />
            <span className="font-display text-lg font-bold tracking-[0.14em]">LX <span className="text-gradient">CLOUDS</span></span>
          </a>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Cloud Solutions. Limitless Possibilities.</p>
        </div>
        <div className="flex flex-wrap gap-14">
          <div>
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Pages</div>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={(e) => { e.preventDefault(); goTo(l.href); }} className="text-sm text-foreground/70 transition-colors hover:text-foreground">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Legal</div>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-foreground/70 transition-colors hover:text-foreground">Imprint</a></li>
              <li><a href="#" className="text-sm text-foreground/70 transition-colors hover:text-foreground">Privacy</a></li>
            </ul>
          </div>
          <div>
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Social</div>
            <div className="flex gap-3">
              {[Instagram, Linkedin, Github].map((Icon, i) => (
                <a key={i} href="#" aria-label="Social link" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-foreground/60 transition-colors hover:border-primary/40 hover:text-foreground">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 md:flex-row">
        <p className="font-mono text-xs text-muted-foreground">© {YEAR} LX CLOUDS. All rights reserved.</p>
        <p className="font-mono text-xs text-muted-foreground">lxclouds.com</p>
      </div>
    </div>
  </footer>
);

// --- Page ---

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  // loader
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1250);
    return () => clearTimeout(t);
  }, []);

  // smooth scrolling
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.1 });
    lenisRef.current = lenis;
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const goTo = useCallback((hash: string) => {
    const el = document.querySelector(hash);
    if (!el) return;
    if (lenisRef.current) lenisRef.current.scrollTo(el as HTMLElement, { offset: -72 });
    else el.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <Loader done={loaded} />
      <CursorFX />

      {/* ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <div className="absolute left-[12%] top-[8%] h-[420px] w-[420px] rounded-full bg-primary/[0.06] blur-[140px]" />
        <div className="absolute bottom-[10%] right-[8%] h-[420px] w-[420px] rounded-full bg-glow/[0.05] blur-[140px]" />
      </div>

      <Navbar goTo={goTo} />

      <main>
        <Hero goTo={goTo} />
        <TrustBar />
        <Services />
        <WhyUs goTo={goTo} />
        <Features />
        <Projects />
        <Process />
        <About />
        <Testimonials />
        <Contact />
      </main>

      <Footer goTo={goTo} />
    </div>
  );
}
