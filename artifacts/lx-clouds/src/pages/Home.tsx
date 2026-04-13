import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { usePortfolio } from "@/hooks/use-portfolio";
import { useSubmitContact } from "@/hooks/use-contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { clsx } from "clsx";
import { 
  Monitor, AppWindow, PenTool, LayoutTemplate, Wrench, 
  ChevronDown, Check, ExternalLink, ArrowRight,
  Smartphone, CalendarCheck, Zap
} from "lucide-react";

// --- Sub-components (Kept in-file for optimal single-page structure) ---

const NoiseOverlay = () => (
  <div className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.03]">
    <svg className="absolute inset-0 h-full w-full">
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  </div>
);

const HeroBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {/* Base — pure ice white */}
    <div className="absolute inset-0" style={{
      background: "linear-gradient(140deg, #f8fdff 0%, #eef8fd 35%, #e8f4fa 65%, #f2faff 100%)",
    }} />
    {/* Soft sky-cyan glow — right, behind illustration */}
    <div className="absolute inset-0" style={{
      background: "radial-gradient(ellipse 65% 75% at 85% 55%, rgba(0,180,220,0.14) 0%, transparent 65%)",
    }} />
    {/* Pale lavender glow — center */}
    <div className="absolute inset-0" style={{
      background: "radial-gradient(ellipse 50% 55% at 60% 45%, rgba(160,200,255,0.10) 0%, transparent 60%)",
    }} />
    {/* Ice-cyan glow — upper-left behind text */}
    <div className="absolute inset-0" style={{
      background: "radial-gradient(ellipse 55% 60% at 8% 25%, rgba(0,200,240,0.09) 0%, transparent 60%)",
    }} />
    {/* Faint sky-blue top haze */}
    <div className="absolute inset-0" style={{
      background: "radial-gradient(ellipse 100% 40% at 50% 0%, rgba(100,180,240,0.07) 0%, transparent 55%)",
    }} />
  </div>
);

const TechIllustration = () => (
  <svg viewBox="0 0 560 440" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-h-[520px]">
    <defs>
      <filter id="gg" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="9" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="gs" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="5"/>
      </filter>
      <filter id="gsm" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2.5"/>
      </filter>
      {/* Cloud fill — deep green inner glow */}
      <radialGradient id="cFill" cx="50%" cy="38%" r="58%">
        <stop offset="0%"   stopColor="#00ff88" stopOpacity="0.22"/>
        <stop offset="55%"  stopColor="#00aa44" stopOpacity="0.07"/>
        <stop offset="100%" stopColor="#003318" stopOpacity="0.02"/>
      </radialGradient>
      {/* Device surfaces */}
      <linearGradient id="devTop" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0a2018"/>
        <stop offset="100%" stopColor="#061410"/>
      </linearGradient>
      <linearGradient id="scrn" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#011a0c"/>
        <stop offset="100%" stopColor="#022a14"/>
      </linearGradient>
      <linearGradient id="grnLine" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#00ff88" stopOpacity="0"/>
        <stop offset="50%" stopColor="#00ff88" stopOpacity="1"/>
        <stop offset="100%" stopColor="#00ff88" stopOpacity="0"/>
      </linearGradient>
    </defs>

    {/* ── ORBIT RING ── */}
    <ellipse cx="268" cy="302" rx="228" ry="58" fill="none" stroke="#00ff88" strokeWidth="0.8" strokeOpacity="0.14"/>
    <ellipse cx="268" cy="302" rx="198" ry="49" fill="none" stroke="#22c55e" strokeWidth="0.5" strokeOpacity="0.10"/>

    {/* ── CLOUD ICON (proper cloud-service silhouette) ── */}
    {/* Outer ambient glow */}
    <ellipse cx="258" cy="185" rx="150" ry="110" fill="#00ff88" fillOpacity="0.04" filter="url(#gs)"/>

    {/* Cloud body — classic fluffy cloud shape */}
    {/* Three concentric outlines for depth */}
    <path d="
      M 148 248
      C 128 248 118 234 120 216
      C 120 196 136 182 158 180
      C 154 154 170 132 194 126
      C 206 112 226 106 248 112
      C 252  90 272  80 298  80
      C 326  78 348  96 352 120
      C 374 108 396 120 402 144
      C 426 146 442 168 436 192
      C 432 214 414 230 392 232
      L 168 232
      C 155 232 148 242 148 248 Z"
      fill="url(#cFill)"
      stroke="#00ff88" strokeWidth="2.4" strokeOpacity="0.85"
      strokeLinejoin="round"/>
    <path d="
      M 140 252
      C 118 252 106 236 108 216
      C 106 192 124 175 148 172
      C 142 144 160 118 186 112
      C 200 96 222  90 246 96
      C 250  72 272  60 300  60
      C 332  57 357  78 362 106
      C 386  92 412 106 418 134
      C 446 136 464 162 458 190
      C 454 216 432 234 406 236
      L 162 236
      C 148 237 140 246 140 252 Z"
      fill="none" stroke="#00ff88" strokeWidth="1" strokeOpacity="0.28" strokeLinejoin="round"/>
    <path d="
      M 132 256
      C 108 256 94 238 96 215
      C 93 187 114 167 140 162
      C 132 130 152 104 180 96
      C 196 80 220  74 246  80
      C 251  54 274  42 304  42
      C 340  38 368  62 374  92
      C 400  76 430  92 436 124
      C 468 126 488 156 482 188
      C 478 218 452 238 422 240
      L 156 240
      C 140 241 132 250 132 256 Z"
      fill="none" stroke="#00ff88" strokeWidth="0.6" strokeOpacity="0.12" strokeLinejoin="round"/>

    {/* Upload ↑ arrow inside cloud */}
    <line x1="236" y1="220" x2="236" y2="152" stroke="#00ff88" strokeWidth="2" strokeOpacity="0.9"/>
    <polygon points="236,140 229,158 243,158" fill="#00ff88" fillOpacity="0.95"/>
    {/* Download ↓ arrow inside cloud */}
    <line x1="280" y1="148" x2="280" y2="220" stroke="#22c55e" strokeWidth="2" strokeOpacity="0.9"/>
    <polygon points="280,232 273,216 287,216" fill="#22c55e" fillOpacity="0.95"/>
    {/* Upload ↑ arrow 2 (right) */}
    <line x1="318" y1="218" x2="318" y2="155" stroke="#00ff88" strokeWidth="1.6" strokeOpacity="0.7"/>
    <polygon points="318,144 312,161 324,161" fill="#00ff88" fillOpacity="0.8"/>

    {/* Cloud center glow node */}
    <circle cx="258" cy="170" r="18" fill="#00ff88" fillOpacity="0.07" filter="url(#gs)"/>
    <circle cx="258" cy="170" r="8"  fill="#00ff88" fillOpacity="0.18"/>
    <circle cx="258" cy="170" r="4"  fill="#00ff88" fillOpacity="0.6"/>
    <circle cx="258" cy="170" r="1.5" fill="white"/>

    {/* Horizontal shine line through cloud */}
    <rect x="148" y="163" width="280" height="1" fill="url(#grnLine)" fillOpacity="0.25"/>

    {/* ── ISOMETRIC LAPTOP (right) ── */}
    <path d="M385 295 L455 258 L506 283 L436 320Z" fill="url(#devTop)" stroke="#00ff88" strokeWidth="1.4" strokeOpacity="0.6"/>
    <path d="M506 283 L506 300 L436 337 L436 320Z" fill="#040e08" stroke="#00ff88" strokeWidth="0.9" strokeOpacity="0.35"/>
    <path d="M385 295 L385 312 L436 337 L436 320Z" fill="#061210" stroke="#00ff88" strokeWidth="0.9" strokeOpacity="0.35"/>
    <path d="M385 295 L455 258 L460 206 L390 243Z" fill="#030e08" stroke="#00ff88" strokeWidth="1.1" strokeOpacity="0.4"/>
    <path d="M390 243 L460 206 L511 231 L441 268Z" fill="url(#scrn)" stroke="#00ff88" strokeWidth="1.8" strokeOpacity="0.9"/>
    {/* screen bars */}
    <rect x="396" y="246" width="5" height="16" fill="#00ff88" fillOpacity="0.7" rx="1"/>
    <rect x="404" y="241" width="5" height="21" fill="#22c55e" fillOpacity="0.6" rx="1"/>
    <rect x="412" y="249" width="5" height="13" fill="#00ff88" fillOpacity="0.55" rx="1"/>
    <rect x="420" y="238" width="5" height="26" fill="#00ff88" fillOpacity="0.65" rx="1"/>
    <rect x="428" y="245" width="5" height="19" fill="#22c55e" fillOpacity="0.5" rx="1"/>
    {/* screen line chart */}
    <polyline points="395,239 406,236 416,241 428,231 439,237 450,233" fill="none" stroke="#00ff88" strokeWidth="1.7" strokeOpacity="1"/>
    <circle cx="428" cy="231" r="2.8" fill="#00ff88"/>
    <rect x="391" y="244" width="60" height="26" fill="#00ff88" fillOpacity="0.025" rx="1"/>

    {/* ── ISOMETRIC PHONE (left) ── */}
    <path d="M90 308 L122 290 L142 300 L110 318Z" fill="url(#devTop)" stroke="#22c55e" strokeWidth="1.3" strokeOpacity="0.7"/>
    <path d="M142 300 L142 352 L110 370 L110 318Z" fill="#030c06" stroke="#22c55e" strokeWidth="0.9" strokeOpacity="0.35"/>
    <path d="M90 308 L90 360 L110 370 L110 318Z" fill="#040e08" stroke="#22c55e" strokeWidth="0.9" strokeOpacity="0.35"/>
    <path d="M92 310 L122 292 L140 302 L110 320Z" fill="url(#scrn)" stroke="#22c55e" strokeWidth="1.2" strokeOpacity="0.8"/>
    {/* phone dial indicator */}
    <circle cx="116" cy="306" r="7" fill="none" stroke="#00ff88" strokeWidth="1.4" strokeOpacity="0.9"/>
    <circle cx="116" cy="306" r="3" fill="#00ff88" fillOpacity="0.55"/>
    <line x1="116" y1="300" x2="116" y2="306" stroke="#00ff88" strokeWidth="1.3"/>
    {/* phone up arrow */}
    <line x1="84" y1="298" x2="84" y2="270" stroke="#00ff88" strokeWidth="2.2" strokeOpacity="0.9"/>
    <polygon points="84,260 77,277 91,277" fill="#00ff88" fillOpacity="0.95"/>
    <line x1="74" y1="308" x2="74" y2="284" stroke="#22c55e" strokeWidth="1.4" strokeOpacity="0.6"/>
    <polygon points="74,275 68,292 80,292" fill="#22c55e" fillOpacity="0.7"/>

    {/* ── CONNECTION LINES ── */}
    <path d="M400 200 L430 200 L448 232 L456 258" fill="none" stroke="#00ff88" strokeWidth="1.7" strokeOpacity="0.5" strokeDasharray="5,3"/>
    <path d="M132 220 L108 220 L104 268 L104 290" fill="none" stroke="#22c55e" strokeWidth="1.7" strokeOpacity="0.5" strokeDasharray="5,3"/>
    <path d="M210 240 L210 275 L185 288" fill="none" stroke="#00ff88" strokeWidth="1.2" strokeOpacity="0.4"/>
    <path d="M258 238 L258 278 L258 298" fill="none" stroke="#22c55e" strokeWidth="1.2" strokeOpacity="0.4"/>
    <path d="M308 240 L308 275 L332 290" fill="none" stroke="#00ff88" strokeWidth="1.2" strokeOpacity="0.4"/>

    {/* ── GLOWING NODES ── */}
    <circle cx="401" cy="200" r="8"  fill="#00ff88" fillOpacity="0.1" filter="url(#gsm)"/>
    <circle cx="401" cy="200" r="4.5" fill="#00ff88" fillOpacity="0.45"/>
    <circle cx="401" cy="200" r="2"  fill="white"/>
    <circle cx="131" cy="220" r="8"  fill="#22c55e" fillOpacity="0.1" filter="url(#gsm)"/>
    <circle cx="131" cy="220" r="4.5" fill="#22c55e" fillOpacity="0.45"/>
    <circle cx="131" cy="220" r="2"  fill="white"/>
    <circle cx="185" cy="288" r="4.5" fill="#00ff88" fillOpacity="0.5"/>
    <circle cx="332" cy="290" r="4.5" fill="#00ff88" fillOpacity="0.5"/>
    <circle cx="258" cy="298" r="4.5" fill="#22c55e" fillOpacity="0.5"/>
    {/* floating particles */}
    <circle cx="160" cy="148" r="2.4" fill="#00ff88" fillOpacity="0.55"/>
    <circle cx="358" cy="132" r="2.6" fill="#00ff88" fillOpacity="0.45"/>
    <circle cx="474" cy="184" r="2"   fill="#22c55e" fillOpacity="0.5"/>
    <circle cx="358" cy="362" r="2"   fill="#00ff88" fillOpacity="0.32"/>
    <circle cx="136" cy="370" r="2"   fill="#22c55e" fillOpacity="0.42"/>
    <circle cx="485" cy="136" r="1.8" fill="#00ff88" fillOpacity="0.38"/>
    <circle cx="64"  cy="252" r="1.8" fill="#22c55e" fillOpacity="0.36"/>
    <circle cx="420" cy="380" r="1.6" fill="#00ff88" fillOpacity="0.28"/>

    {/* ── DATA BARS (bottom-right) ── */}
    <rect x="358" y="344" width="10" height="34" fill="#00ff88" fillOpacity="0.5" rx="2"/>
    <rect x="372" y="330" width="10" height="48" fill="#22c55e" fillOpacity="0.45" rx="2"/>
    <rect x="386" y="348" width="10" height="30" fill="#00ff88" fillOpacity="0.38" rx="2"/>
    <rect x="400" y="337" width="10" height="41" fill="#22c55e" fillOpacity="0.5" rx="2"/>
    <rect x="356" y="328" width="58" height="56" fill="#00ff88" fillOpacity="0.025" filter="url(#gsm)" rx="4"/>

    {/* ── UPLOAD ARROWS (top-right) ── */}
    <line x1="514" y1="204" x2="514" y2="144" stroke="#00ff88" strokeWidth="2.6" strokeOpacity="0.88"/>
    <polygon points="514,133 507,152 521,152" fill="#00ff88" fillOpacity="0.92"/>
    <circle cx="514" cy="209" r="3.8" fill="#00ff88" fillOpacity="0.5"/>
    <line x1="528" y1="222" x2="528" y2="165" stroke="#22c55e" strokeWidth="1.5" strokeOpacity="0.45"/>
    <polygon points="528,155 522,172 534,172" fill="#22c55e" fillOpacity="0.5"/>
  </svg>
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={clsx(
      "fixed top-0 inset-x-0 z-40 transition-all duration-300 border-b",
      scrolled
        ? "bg-white/90 backdrop-blur-md border-border/50 py-4 shadow-md shadow-sky-100/70"
        : "bg-transparent border-transparent py-6"
    )}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <a href="#" aria-label="LX CLOUDS home" className="flex items-center gap-2.5">
          <span className="font-serif font-bold text-xl tracking-wide transition-colors"
            style={{ color: scrolled ? "rgba(10,18,42,1)" : "rgba(255,255,255,0.95)" }}>
            LX CLOUDS
          </span>
        </a>
        <nav className="hidden md:flex gap-8 items-center font-mono text-sm">
          {["About","Services","Work","Pricing"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`}
              className="transition-colors"
              style={{ color: scrolled ? "rgba(10,18,42,0.80)" : "rgba(255,255,255,0.80)" }}
            >{l}</a>
          ))}
          <Button asChild size="sm" className="rounded-full px-6"
            style={scrolled ? {
              background: "rgba(0,163,204,0.12)",
              border: "1.5px solid rgba(0,163,204,0.45)",
              color: "#007aa3",
            } : {
              background: "rgba(255,255,255,0.12)",
              border: "1.5px solid rgba(255,255,255,0.40)",
              color: "#ffffff",
            }}>
            <a href="#contact">Let's Talk</a>
          </Button>
        </nav>
      </div>
    </header>
  );
};

const SERVICES = [
  { icon: Monitor,       title: "Web Design & Development",  desc: "Custom websites built from the ground up for performance and stunning aesthetics." },
  { icon: AppWindow,     title: "Web App Development",        desc: "Complex, scalable web applications that solve real business problems." },
  { icon: Smartphone,    title: "Mobile App Development",     desc: "Native-quality iOS & Android apps built with modern cross-platform frameworks." },
  { icon: CalendarCheck, title: "Booking & Scheduling Apps",  desc: "Purpose-built booking systems, reservation platforms, and appointment apps tailored to your workflow." },
  { icon: PenTool,       title: "UI/UX Design",               desc: "Intuitive, engaging, and beautiful interfaces tailored to your audience." },
  { icon: LayoutTemplate,title: "Landing Pages & Portfolios", desc: "High-converting marketing pages designed to captivate and convert." },
  { icon: Wrench,        title: "Maintenance & Support",      desc: "Keeping your digital presence secure, fast, and running flawlessly." }
];

const PRICING_PLANS = [
  {
    name: "Starter",
    tagline: "Perfect for small businesses & personal brands",
    price: "From €799",
    period: "one-time",
    highlight: false,
    features: [
      "Up to 5 pages",
      "Fully responsive design",
      "SEO foundations",
      "Contact form",
      "2 revision rounds",
      "14-day delivery",
    ],
    cta: "Get Started",
  },
  {
    name: "Pro",
    tagline: "Best for growing businesses & custom apps",
    price: "From €1,499",
    period: "one-time",
    highlight: true,
    features: [
      "Custom web application",
      "User authentication",
      "Database & API integration",
      "Admin dashboard",
      "3 revision rounds",
      "Priority support",
      "30-day post-launch care",
    ],
    cta: "Get a Quote",
  },
  {
    name: "Custom",
    tagline: "Mobile apps, booking systems & complex builds",
    price: "Let's Talk",
    period: "tailored to scope",
    highlight: false,
    features: [
      "iOS & Android mobile apps",
      "Booking & scheduling systems",
      "Multi-role user systems",
      "Third-party integrations",
      "Ongoing maintenance plan",
      "Dedicated project manager",
      "SLA & priority hotline",
    ],
    cta: "Book a Call",
  },
];

const SUBSCRIPTION_PLANS = [
  {
    name: "Essential",
    tagline: "Keep your site healthy & up to date",
    price: "€149",
    period: "/ month",
    highlight: false,
    features: [
      "Security & CMS updates",
      "Uptime monitoring 24/7",
      "Monthly performance report",
      "1h of changes / month",
      "Email support",
    ],
    cta: "Subscribe",
  },
  {
    name: "Growth",
    tagline: "Active maintenance + ongoing improvements",
    price: "€299",
    period: "/ month",
    highlight: true,
    features: [
      "Everything in Essential",
      "4h of changes / month",
      "SEO monitoring & tips",
      "Speed & Core Web Vitals checks",
      "Priority email & chat support",
      "Quarterly review call",
    ],
    cta: "Subscribe",
  },
  {
    name: "Studio Partner",
    tagline: "Your dedicated digital partner, on-demand",
    price: "€599",
    period: "/ month",
    highlight: false,
    features: [
      "Everything in Growth",
      "10h of changes / month",
      "Feature development included",
      "Hotfix SLA within 4h",
      "Monthly strategy session",
      "Slack / direct line access",
    ],
    cta: "Book a Call",
  },
];

const WHY_US = [
  "Pixel-Perfect Execution",
  "Tailored to Your Brand",
  "Web, Mobile & Booking Systems",
  "On-Time Delivery",
  "Long-Term Partnership",
  "End-to-End Expertise"
];

// --- 3D Carousel ---
const ProjectCarousel3D = ({ projects }: { projects: import("@/hooks/use-portfolio").Project[] }) => {
  const [active, setActive] = useState(0);
  const startX = useRef(0);
  const len = projects.length;

  const prev = useCallback(() => setActive(a => (a - 1 + len) % len), [len]);
  const next = useCallback(() => setActive(a => (a + 1) % len), [len]);

  const getOffset = (i: number) => {
    let d = i - active;
    if (d > len / 2) d -= len;
    if (d < -len / 2) d += len;
    return d;
  };

  const getStyle = (d: number): React.CSSProperties => {
    const base: React.CSSProperties = { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.7s cubic-bezier(0.25,0.8,0.25,1)" };
    if (Math.abs(d) > 2) return { ...base, opacity: 0, pointerEvents: "none", zIndex: 0 };
    if (d === 0)  return { ...base, transform: "translateX(0%) translateZ(180px) scale(1)", opacity: 1, zIndex: 10, cursor: "default", pointerEvents: "none" };
    if (d === 1)  return { ...base, transform: "translateX(62%) translateZ(-60px) rotateY(-32deg) scale(0.82)", opacity: 0.72, zIndex: 6, cursor: "pointer" };
    if (d === -1) return { ...base, transform: "translateX(-62%) translateZ(-60px) rotateY(32deg) scale(0.82)", opacity: 0.72, zIndex: 6, cursor: "pointer" };
    if (d === 2)  return { ...base, transform: "translateX(105%) translateZ(-180px) rotateY(-58deg) scale(0.62)", opacity: 0.28, zIndex: 2, pointerEvents: "none" };
    if (d === -2) return { ...base, transform: "translateX(-105%) translateZ(-180px) rotateY(58deg) scale(0.62)", opacity: 0.28, zIndex: 2, pointerEvents: "none" };
    return { ...base, opacity: 0, pointerEvents: "none" };
  };

  return (
    <div className="select-none">
      <div
        className="relative h-[500px] flex items-center justify-center overflow-visible"
        style={{ perspective: "1300px", perspectiveOrigin: "50% 45%" }}
        onMouseDown={e => { startX.current = e.clientX; }}
        onMouseUp={e => { const d = e.clientX - startX.current; if (Math.abs(d) > 55) d < 0 ? next() : prev(); }}
        onTouchStart={e => { startX.current = e.touches[0].clientX; }}
        onTouchEnd={e => { const d = e.changedTouches[0].clientX - startX.current; if (Math.abs(d) > 55) d < 0 ? next() : prev(); }}
      >
        <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
          {projects.map((project, i) => {
            const d = getOffset(i);
            return (
              <div
                key={project.id}
                style={{ ...getStyle(d), transformStyle: "preserve-3d" }}
                onClick={() => { if (d === 1) next(); else if (d === -1) prev(); }}
              >
                <div className="w-[400px] max-w-[88vw] rounded-3xl overflow-hidden"
                  style={{
                    pointerEvents: "auto",
                    background: "rgba(255,255,255,0.97)",
                    boxShadow: d === 0
                      ? "0 30px 90px rgba(0,120,180,0.22), 0 0 0 1px rgba(0,163,204,0.10), 0 0 60px rgba(0,200,240,0.08)"
                      : "0 15px 50px rgba(0,0,0,0.10)",
                  }}>
                  <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      draggable={false}
                      onError={e => { e.currentTarget.src = `https://placehold.co/800x500/daf3fb/007099?text=${encodeURIComponent(project.title)}`; }}
                    />
                    <div className="absolute inset-0 flex items-end p-5"
                      style={{ background: "linear-gradient(to top, rgba(0,15,35,0.80) 0%, transparent 55%)", opacity: d === 0 ? 1 : 0, transition: "opacity 0.4s" }}>
                      {project.url !== "#" && (
                        <a href={project.url} target="_blank" rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-mono font-semibold text-white"
                          style={{ background: "linear-gradient(135deg,#0099cc,#00c9e8)", boxShadow: "0 4px 18px rgba(0,163,204,0.45)" }}>
                          Visit Live Site <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-serif font-bold text-foreground">{project.title}</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{project.category}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{project.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.tags.map(t => (
                        <span key={t} className="text-[10px] font-mono px-2 py-0.5 bg-sky-50 text-sky-700 rounded border border-sky-200">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-5 mt-2">
        <button onClick={prev}
          className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-light transition-all hover:scale-110"
          style={{ border: "1.5px solid rgba(0,163,204,0.35)", color: "#00a3cc", background: "rgba(0,163,204,0.06)" }}>
          ‹
        </button>
        <div className="flex gap-2 items-center">
          {projects.map((_, i) => (
            <button key={i} onClick={() => setActive(i)}
              className="rounded-full transition-all duration-300"
              style={{ width: i === active ? "22px" : "7px", height: "7px", background: i === active ? "#00a3cc" : "rgba(0,163,204,0.25)" }}
            />
          ))}
        </div>
        <button onClick={next}
          className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-light transition-all hover:scale-110"
          style={{ border: "1.5px solid rgba(0,163,204,0.35)", color: "#00a3cc", background: "rgba(0,163,204,0.06)" }}>
          ›
        </button>
      </div>
    </div>
  );
};

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

// --- Main Page Component ---

export default function Home() {
  const { data: projects = [], isLoading: isProjectsLoading } = usePortfolio();
  const [pricingTab, setPricingTab] = useState<"project" | "abo">("project");

  const { mutate: submitContact, isPending: isSubmitting, isSuccess: isSubmitSuccess } = useSubmitContact();
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema)
  });

  const onContactSubmit = (data: z.infer<typeof contactSchema>) => {
    submitContact(data);
  };

  return (
    <div className="relative bg-background text-foreground min-h-screen overflow-x-hidden">
      <NoiseOverlay />
      <Navbar />

      <main>
        {/* HERO SECTION */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden"
          style={{
            backgroundImage: "url('/hero-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Dark overlay for text legibility */}
          <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(135deg, rgba(5,10,30,0.72) 0%, rgba(10,20,60,0.55) 50%, rgba(5,10,30,0.68) 100%)" }} />

          {/* Subtle cyan glow from below */}
          <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 40% at 50% 100%, rgba(0,180,220,0.18) 0%, transparent 70%)" }} />

          <div className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center py-32 pt-40">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <h1 className="font-serif font-bold leading-[1.05] tracking-tight text-5xl md:text-7xl lg:text-8xl text-white max-w-5xl">
                We Build<br/>
                <span style={{
                  background: "linear-gradient(115deg, #00e5ff 0%, #38bdf8 40%, #a78bfa 75%, #c4b5fd 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 40px rgba(0,229,255,0.7))",
                }}>Digital Experiences</span><br/>
                That Last.
              </h1>

              <p className="mt-8 text-lg md:text-xl max-w-2xl font-sans leading-relaxed" style={{ color: "rgba(255,255,255,0.72)" }}>
                LX CLOUDS crafts websites, web apps, mobile apps, and custom booking systems — designed with precision, built for growth, delivered with care.
              </p>

              {/* stats row */}
              <div className="mt-10 flex gap-12">
                {[["50+","Projects Delivered"],["100%","Client Satisfaction"],["Germany","Based in Germany"]].map(([n,l]) => (
                  <div key={l} className="text-center">
                    <div className="text-3xl font-serif font-bold" style={{ color: "#00e5ff" }}>{n}</div>
                    <div className="text-xs font-mono mt-1 uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.50)" }}>{l}</div>
                  </div>
                ))}
              </div>

              <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="group text-base font-sans px-10"
                  style={{ background: "linear-gradient(135deg, #0099cc, #00c9e8)", border: "none", color: "#ffffff", fontWeight: 700, boxShadow: "0 4px 30px rgba(0,200,240,0.40)" }}>
                  <a href="#work">
                    View Our Work
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"/>
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-base font-sans px-10"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.30)", color: "#ffffff", backdropFilter: "blur(12px)" }}>
                  <a href="#contact">Get in Touch</a>
                </Button>
              </div>
            </motion.div>
          </div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
            style={{ color: "rgba(0,229,255,0.75)" }}
          >
            <ChevronDown className="w-7 h-7"/>
          </motion.div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="py-24 relative z-10" style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(0,163,204,0.04) 30%, rgba(0,163,204,0.06) 60%, transparent 100%)" }}>
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="max-w-4xl mx-auto border-l-4 border-primary pl-8 py-2"
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-foreground">
                Precision. Design. Impact.
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-sans font-light">
                LX CLOUDS is a boutique digital studio. We build websites, web apps, mobile applications, 
                and booking systems with a singular obsession — quality. Every line of code, every pixel, 
                every interaction is crafted to elevate your brand and outperform the competition.
              </p>
            </motion.div>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section id="services" className="py-24 relative z-10" style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(186,230,253,0.18) 20%, rgba(186,230,253,0.28) 50%, rgba(186,230,253,0.18) 80%, transparent 100%)" }}>
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Our Services</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto font-light tracking-wide">From pixel-perfect websites to full-scale applications — every discipline, one studio.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {SERVICES.map((service, idx) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="glass-card p-8 rounded-2xl group hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                    <service.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{service.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* PORTFOLIO SECTION */}
        <section id="work" className="py-32 relative z-10 overflow-hidden" style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(0,163,204,0.04) 25%, rgba(0,163,204,0.04) 75%, transparent 100%)" }}>
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Selected Work</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto font-light tracking-wide">
                A curated selection of projects we've built and shipped. Drag or swipe to explore.
              </p>
            </div>

            {isProjectsLoading ? (
              <div className="flex items-center justify-center h-[500px]">
                <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
            ) : (
              <ProjectCarousel3D projects={projects} />
            )}
          </div>
        </section>

        {/* WHY US SECTION */}
        <section id="why" className="py-24 relative z-10" style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(124,58,237,0.04) 25%, rgba(124,58,237,0.07) 55%, rgba(0,163,204,0.05) 80%, transparent 100%)" }}>
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Why LX CLOUDS?</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {WHY_US.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex items-center gap-4 p-6 glass-card rounded-xl border border-border/50"
                >
                  <div className="text-primary flex-shrink-0 drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M12 2L22 12L12 22L2 12L12 2Z"/>
                    </svg>
                  </div>
                  <h4 className="text-xl font-serif font-bold text-foreground">{item}</h4>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="py-28 relative z-10" style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(186,230,253,0.15) 20%, rgba(186,230,253,0.22) 55%, rgba(186,230,253,0.12) 80%, transparent 100%)" }}>
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10"
            >
              <span className="font-mono text-xs tracking-widest uppercase mb-4 block" style={{ color: "var(--color-primary)" }}>
                Transparent Pricing
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
                Simple, Honest Rates
              </h2>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-base leading-relaxed">
                No hidden fees. Every project is scoped carefully so you always know what you're getting.
              </p>
            </motion.div>

            {/* Tab toggle */}
            <div className="flex justify-center mb-12">
              <div className="inline-flex rounded-full p-1 gap-1"
                style={{ background: "var(--color-background-secondary)", border: "1.5px solid var(--color-border)" }}>
                {(["project", "abo"] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setPricingTab(tab)}
                    className="px-6 py-2 rounded-full font-mono text-sm font-semibold tracking-wide transition-all duration-200"
                    style={pricingTab === tab ? {
                      background: "linear-gradient(135deg, #7c3aed, #00e5ff)",
                      color: "#ffffff",
                      boxShadow: "0 2px 12px rgba(0,229,255,0.25)",
                    } : {
                      background: "transparent",
                      color: "var(--color-muted-foreground)",
                    }}
                  >
                    {tab === "project" ? "One-Time Projects" : "Monthly Plans"}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
              {(pricingTab === "project" ? PRICING_PLANS : SUBSCRIPTION_PLANS).map((plan, i) => (
                <motion.div
                  key={pricingTab + plan.name}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.45 }}
                  className="relative rounded-2xl flex flex-col overflow-hidden"
                  style={plan.highlight ? {
                    background: "linear-gradient(160deg, #daf3fb 0%, #c8edf7 100%)",
                    border: "1.5px solid rgba(0,163,204,0.45)",
                    boxShadow: "0 0 35px rgba(0,180,220,0.15), 0 8px 28px rgba(0,140,190,0.10)",
                  } : {
                    background: "var(--color-surface)",
                    border: "1.5px solid var(--color-border)",
                  }}
                >
                  {/* Popular badge */}
                  {plan.highlight && (
                    <div className="flex items-center justify-center gap-1.5 py-2"
                      style={{ background: "rgba(0,163,204,0.12)", borderBottom: "1px solid rgba(0,163,204,0.25)" }}>
                      <Zap className="w-3.5 h-3.5" style={{ color: "#0088aa" }} />
                      <span className="font-mono text-xs tracking-widest uppercase font-semibold" style={{ color: "#0088aa" }}>
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="p-8 flex flex-col flex-1 gap-6">
                    {/* Header */}
                    <div>
                      <h3 className="text-xl font-serif font-bold"
                        style={{ color: plan.highlight ? "var(--color-foreground)" : "var(--color-foreground)" }}>
                        {plan.name}
                      </h3>
                      <p className="mt-1 text-sm leading-snug"
                        style={{ color: plan.highlight ? "rgba(10,18,42,0.60)" : "var(--color-muted-foreground)" }}>
                        {plan.tagline}
                      </p>
                    </div>

                    {/* Price */}
                    <div>
                      <div className="text-3xl font-serif font-bold"
                        style={{ color: plan.highlight ? "#007099" : "var(--color-foreground)" }}>
                        {plan.price}
                      </div>
                      <div className="font-mono text-xs mt-1 uppercase tracking-wider"
                        style={{ color: plan.highlight ? "rgba(10,18,42,0.55)" : "var(--color-muted-foreground)" }}>
                        {plan.period}
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 flex-1">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-start gap-3 text-sm"
                          style={{ color: plan.highlight ? "rgba(10,18,42,0.85)" : "var(--color-foreground)" }}>
                          <Check className="w-4 h-4 mt-0.5 flex-shrink-0"
                            style={{ color: plan.highlight ? "#008aaa" : "var(--color-primary)" }} />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <a href="#contact"
                      className="mt-2 block text-center rounded-xl py-3 px-6 font-mono text-sm font-semibold tracking-wide transition-all duration-200"
                      style={plan.highlight ? {
                        background: "linear-gradient(135deg, #7c3aed, #00e5ff)",
                        color: "#ffffff",
                        boxShadow: "0 4px 20px rgba(0,229,255,0.28)",
                      } : {
                        background: "transparent",
                        border: "1.5px solid var(--color-border)",
                        color: "var(--color-foreground)",
                      }}
                      onMouseEnter={e => {
                        if (!plan.highlight) {
                          (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,229,255,0.5)";
                          (e.currentTarget as HTMLAnchorElement).style.color = "#00e5ff";
                        }
                      }}
                      onMouseLeave={e => {
                        if (!plan.highlight) {
                          (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--color-border)";
                          (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-foreground)";
                        }
                      }}
                    >
                      {plan.cta}
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Fine print */}
            <p className="text-center text-xs text-muted-foreground mt-10 font-mono">
              {pricingTab === "project"
                ? "All prices are estimates. Final scope agreed before any work begins. · VAT may apply."
                : "Monthly plans billed every 30 days. Minimum 3-month commitment. Cancel anytime after. · VAT may apply."}
            </p>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="py-32 relative z-10" style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(124,58,237,0.04) 15%, rgba(0,163,204,0.07) 50%, rgba(0,163,204,0.05) 85%, transparent 100%)" }}>
          <div className="container mx-auto px-6 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-foreground">
                Let's Build Something <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-glow">Together</span>
              </h2>
              <p className="mt-6 text-muted-foreground font-mono text-lg">info@lxclouds.com</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="glass-card p-8 md:p-12 rounded-3xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-glow opacity-60" />
              
              {isSubmitSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(0,163,204,0.2)]">
                    <Check className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-foreground">Message Sent</h3>
                  <p className="text-muted-foreground mt-4 text-lg">We will be in touch with you shortly to discuss your vision.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onContactSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-mono text-muted-foreground mb-2">Your Name</label>
                      <Input
                        {...register("name")}
                        placeholder="John Doe"
                      />
                      {errors.name && <p className="text-destructive/80 text-xs mt-2 font-mono">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-mono text-muted-foreground mb-2">Email Address</label>
                      <Input
                        {...register("email")}
                        placeholder="john@example.com"
                      />
                      {errors.email && <p className="text-destructive/80 text-xs mt-2 font-mono">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-mono text-muted-foreground mb-2">Project Details</label>
                    <Textarea
                      {...register("message")}
                      placeholder="Tell us about your project, timeline, and goals..."
                    />
                    {errors.message && <p className="text-destructive/80 text-xs mt-2 font-mono">{errors.message.message}</p>}
                  </div>
                  <div className="pt-4 text-center md:text-left">
                    <Button type="submit" disabled={isSubmitting} size="lg" className="w-full md:w-auto">
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-16 relative z-10 text-center" style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(0,163,204,0.05) 30%, rgba(0,163,204,0.07) 60%, rgba(0,163,204,0.04) 100%)" }}>
        <div className="mb-4 flex justify-center items-center">
          <span className="font-serif font-bold text-2xl tracking-wide text-foreground">LX CLOUDS</span>
        </div>
        <p className="text-muted-foreground font-sans mb-8 tracking-widest uppercase text-sm font-light">Where Precision Meets Elegance</p>
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary/40 to-transparent mx-auto mb-8" />
        <p className="text-sm text-border font-mono tracking-wider">© {new Date().getFullYear()} LX CLOUDS. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}
