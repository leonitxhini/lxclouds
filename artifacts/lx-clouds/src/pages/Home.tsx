import { useState, useEffect } from "react";
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
  ChevronDown, Check, ExternalLink, ArrowRight 
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
    <div className="absolute inset-0" style={{
      background: "linear-gradient(135deg, #05091a 0%, #091428 40%, #081e32 70%, #040e1c 100%)",
    }} />
    {/* Cyan glow — right where the illustration lives */}
    <div className="absolute inset-0" style={{
      background: "radial-gradient(ellipse 60% 70% at 80% 55%, rgba(0,200,255,0.10) 0%, transparent 70%)",
    }} />
    {/* Purple glow — upper-left */}
    <div className="absolute inset-0" style={{
      background: "radial-gradient(ellipse 50% 55% at 15% 35%, rgba(110,50,220,0.09) 0%, transparent 65%)",
    }} />
    {/* Subtle top haze */}
    <div className="absolute inset-0" style={{
      background: "radial-gradient(ellipse 90% 35% at 50% 0%, rgba(0,160,220,0.06) 0%, transparent 60%)",
    }} />
  </div>
);

const TechIllustration = () => (
  <svg viewBox="0 0 560 440" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-h-[520px]">
    <defs>
      <filter id="gcyan" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="8" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="gpurp" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="10" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="gsoft" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="4"/>
      </filter>
      <radialGradient id="cloudFill" cx="50%" cy="40%" r="55%">
        <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.18"/>
        <stop offset="60%" stopColor="#0044aa" stopOpacity="0.06"/>
        <stop offset="100%" stopColor="#001144" stopOpacity="0.02"/>
      </radialGradient>
      <linearGradient id="screenL" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#021830"/>
        <stop offset="100%" stopColor="#032a50"/>
      </linearGradient>
      <linearGradient id="lapTop" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0a2448"/>
        <stop offset="100%" stopColor="#061830"/>
      </linearGradient>
      <linearGradient id="lapRight" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#041220"/>
        <stop offset="100%" stopColor="#061830"/>
      </linearGradient>
    </defs>

    {/* ── ORBIT RINGS ── */}
    <ellipse cx="268" cy="295" rx="225" ry="58" fill="none" stroke="#00e5ff" strokeWidth="0.7" strokeOpacity="0.15"/>
    <ellipse cx="268" cy="295" rx="195" ry="49" fill="none" stroke="#8b5cf6" strokeWidth="0.5" strokeOpacity="0.12"/>

    {/* ── CLOUD BODY ── */}
    {/* outer glow */}
    <ellipse cx="250" cy="195" rx="140" ry="105" fill="#00e5ff" fillOpacity="0.04" filter="url(#gsoft)"/>
    {/* cloud outline — three concentric strokes */}
    <path d="M138 228 Q124 158 178 140 Q200 108 250 114 Q288 98 322 128 Q364 136 366 175 Q378 202 358 228 Q338 252 300 254 L200 254 Q158 252 138 228Z"
      fill="url(#cloudFill)" stroke="#00e5ff" strokeWidth="2.2" strokeOpacity="0.75"/>
    <path d="M130 233 Q114 156 174 136 Q198 102 250 108 Q292 90 328 124 Q374 132 376 178 Q390 208 366 236 Q344 262 304 264 L196 264 Q150 260 130 233Z"
      fill="none" stroke="#00e5ff" strokeWidth="1" strokeOpacity="0.3"/>
    <path d="M122 238 Q104 154 170 130 Q196 94 250 100 Q296 82 336 120 Q386 128 388 180 Q404 214 374 244 Q350 274 308 276 L192 276 Q142 270 122 238Z"
      fill="none" stroke="#00e5ff" strokeWidth="0.6" strokeOpacity="0.14"/>

    {/* cloud center glow dot */}
    <circle cx="250" cy="185" r="14" fill="#00e5ff" fillOpacity="0.08" filter="url(#gsoft)"/>
    <circle cx="250" cy="185" r="6"  fill="#00e5ff" fillOpacity="0.25"/>
    <circle cx="250" cy="185" r="3"  fill="#00e5ff" fillOpacity="0.7"/>
    <circle cx="250" cy="185" r="1.2" fill="white"/>

    {/* ── CLOUD ARROWS (data flow) ── */}
    {/* down-left */}
    <line x1="218" y1="162" x2="218" y2="248" stroke="#00e5ff" strokeWidth="1.8" strokeOpacity="0.8"/>
    <polygon points="218,257 212,242 224,242" fill="#00e5ff" fillOpacity="0.9"/>
    {/* down-center */}
    <line x1="250" y1="152" x2="250" y2="248" stroke="#8b5cf6" strokeWidth="1.8" strokeOpacity="0.8"/>
    <polygon points="250,257 244,242 256,242" fill="#8b5cf6" fillOpacity="0.9"/>
    {/* up-right */}
    <line x1="282" y1="248" x2="282" y2="162" stroke="#00e5ff" strokeWidth="1.8" strokeOpacity="0.8"/>
    <polygon points="282,153 276,168 288,168" fill="#00e5ff" fillOpacity="0.9"/>

    {/* ── ISOMETRIC LAPTOP (right) ── */}
    {/* base top face */}
    <path d="M390 298 L458 260 L508 285 L440 323Z" fill="url(#lapTop)" stroke="#00e5ff" strokeWidth="1.4" strokeOpacity="0.65"/>
    {/* base right face */}
    <path d="M508 285 L508 302 L440 340 L440 323Z" fill="url(#lapRight)" stroke="#00e5ff" strokeWidth="1" strokeOpacity="0.4"/>
    {/* base left face */}
    <path d="M390 298 L390 315 L440 340 L440 323Z" fill="#051220" stroke="#00e5ff" strokeWidth="1" strokeOpacity="0.4"/>
    {/* screen hinge */}
    <path d="M390 298 L458 260 L463 210 L395 248Z" fill="#041830" stroke="#00e5ff" strokeWidth="1.2" strokeOpacity="0.45"/>
    {/* screen face */}
    <path d="M395 248 L463 210 L513 235 L445 273Z" fill="url(#screenL)" stroke="#00e5ff" strokeWidth="1.6" strokeOpacity="0.85"/>
    {/* screen — chart bars */}
    <rect x="401" y="250" width="5" height="16" fill="#00e5ff" fillOpacity="0.75" rx="1"/>
    <rect x="409" y="245" width="5" height="21" fill="#8b5cf6" fillOpacity="0.65" rx="1"/>
    <rect x="417" y="253" width="5" height="13" fill="#00e5ff" fillOpacity="0.6" rx="1"/>
    <rect x="425" y="241" width="5" height="25" fill="#00e5ff" fillOpacity="0.7" rx="1"/>
    <rect x="433" y="248" width="5" height="18" fill="#8b5cf6" fillOpacity="0.55" rx="1"/>
    {/* screen — line chart */}
    <polyline points="400,243 410,240 420,244 432,235 442,241 452,237" fill="none" stroke="#00e5ff" strokeWidth="1.6" strokeOpacity="0.95"/>
    <circle cx="432" cy="235" r="2.5" fill="#00e5ff" fillOpacity="0.9"/>
    {/* screen glow overlay */}
    <rect x="396" y="248" width="57" height="27" fill="#00e5ff" fillOpacity="0.03" rx="1"/>

    {/* ── ISOMETRIC PHONE (left) ── */}
    {/* top face */}
    <path d="M94 310 L126 292 L146 302 L114 320Z" fill="url(#lapTop)" stroke="#8b5cf6" strokeWidth="1.3" strokeOpacity="0.7"/>
    {/* right face */}
    <path d="M146 302 L146 354 L114 372 L114 320Z" fill="#040e20" stroke="#8b5cf6" strokeWidth="1" strokeOpacity="0.4"/>
    {/* left face */}
    <path d="M94 310 L94 362 L114 372 L114 320Z" fill="#051420" stroke="#8b5cf6" strokeWidth="1" strokeOpacity="0.4"/>
    {/* screen */}
    <path d="M96 312 L126 294 L144 304 L114 322Z" fill="url(#screenL)" stroke="#8b5cf6" strokeWidth="1.2" strokeOpacity="0.75"/>
    {/* phone screen content */}
    <circle cx="120" cy="308" r="6" fill="none" stroke="#8b5cf6" strokeWidth="1.2" strokeOpacity="0.85"/>
    <circle cx="120" cy="308" r="2.5" fill="#8b5cf6" fillOpacity="0.5"/>
    <line x1="120" y1="303" x2="120" y2="308" stroke="#8b5cf6" strokeWidth="1.2" strokeOpacity="0.8"/>
    {/* phone up arrow */}
    <line x1="90" y1="300" x2="90" y2="273" stroke="#00e5ff" strokeWidth="2" strokeOpacity="0.85"/>
    <polygon points="90,264 84,280 96,280" fill="#00e5ff" fillOpacity="0.9"/>
    {/* second arrow */}
    <line x1="80" y1="310" x2="80" y2="286" stroke="#8b5cf6" strokeWidth="1.5" strokeOpacity="0.6"/>
    <polygon points="80,278 74,294 86,294" fill="#8b5cf6" fillOpacity="0.7"/>

    {/* ── CIRCUIT LINES ── */}
    {/* Cloud → Laptop */}
    <path d="M362 190 L392 190 L410 230 L420 256" fill="none" stroke="#00e5ff" strokeWidth="1.6" strokeOpacity="0.55" strokeDasharray="5,3"/>
    {/* Cloud → Phone */}
    <path d="M144 218 L120 218 L116 270 L116 292" fill="none" stroke="#8b5cf6" strokeWidth="1.6" strokeOpacity="0.55" strokeDasharray="5,3"/>
    {/* Cloud bottom lines */}
    <path d="M210 262 L210 292 L185 305" fill="none" stroke="#00e5ff" strokeWidth="1.2" strokeOpacity="0.45"/>
    <path d="M250 268 L250 305 L250 322" fill="none" stroke="#8b5cf6" strokeWidth="1.2" strokeOpacity="0.45"/>
    <path d="M290 262 L290 292 L318 305" fill="none" stroke="#00e5ff" strokeWidth="1.2" strokeOpacity="0.45"/>

    {/* ── NODES ── */}
    <circle cx="363" cy="190" r="7" fill="#00e5ff" fillOpacity="0.12" filter="url(#gsoft)"/>
    <circle cx="363" cy="190" r="4"  fill="#00e5ff" fillOpacity="0.45"/>
    <circle cx="363" cy="190" r="1.8" fill="white"/>
    <circle cx="143" cy="218" r="7"  fill="#8b5cf6" fillOpacity="0.12" filter="url(#gsoft)"/>
    <circle cx="143" cy="218" r="4"  fill="#8b5cf6" fillOpacity="0.45"/>
    <circle cx="143" cy="218" r="1.8" fill="white"/>
    <circle cx="185" cy="305" r="4" fill="#00e5ff" fillOpacity="0.45"/>
    <circle cx="318" cy="305" r="4" fill="#00e5ff" fillOpacity="0.45"/>
    <circle cx="250" cy="322" r="4" fill="#8b5cf6" fillOpacity="0.45"/>
    {/* scattered dots */}
    <circle cx="165" cy="155" r="2.2" fill="#00e5ff" fillOpacity="0.5"/>
    <circle cx="335" cy="138" r="2.5" fill="#00e5ff" fillOpacity="0.4"/>
    <circle cx="470" cy="188" r="2" fill="#8b5cf6" fillOpacity="0.5"/>
    <circle cx="355" cy="358" r="2" fill="#00e5ff" fillOpacity="0.3"/>
    <circle cx="135" cy="368" r="2" fill="#8b5cf6" fillOpacity="0.4"/>
    <circle cx="480" cy="140" r="1.8" fill="#00e5ff" fillOpacity="0.35"/>
    <circle cx="68"  cy="250" r="1.8" fill="#8b5cf6" fillOpacity="0.35"/>

    {/* ── DATA BARS (lower right) ── */}
    <rect x="356" y="340" width="9" height="34" fill="#00e5ff" fillOpacity="0.55" rx="2"/>
    <rect x="369" y="328" width="9" height="46" fill="#8b5cf6" fillOpacity="0.5" rx="2"/>
    <rect x="382" y="345" width="9" height="29" fill="#00e5ff" fillOpacity="0.4" rx="2"/>
    <rect x="395" y="334" width="9" height="40" fill="#8b5cf6" fillOpacity="0.55" rx="2"/>
    {/* bars glow */}
    <rect x="354" y="326" width="54" height="54" fill="#00e5ff" fillOpacity="0.03" filter="url(#gsoft)" rx="4"/>

    {/* ── BIG UPLOAD ARROWS (top right) ── */}
    <line x1="510" y1="200" x2="510" y2="142" stroke="#00e5ff" strokeWidth="2.5" strokeOpacity="0.85"/>
    <polygon points="510,132 503,150 517,150" fill="#00e5ff" fillOpacity="0.9"/>
    <circle cx="510" cy="205" r="3.5" fill="#00e5ff" fillOpacity="0.5"/>
    <line x1="524" y1="218" x2="524" y2="162" stroke="#00e5ff" strokeWidth="1.5" strokeOpacity="0.45"/>
    <polygon points="524,152 518,168 530,168" fill="#00e5ff" fillOpacity="0.5"/>
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
        ? "bg-background/90 backdrop-blur-md border-border/50 py-4 shadow-lg shadow-black/10"
        : "bg-transparent border-transparent py-6"
    )}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="font-serif font-bold text-2xl tracking-widest" style={{
          background: scrolled
            ? "linear-gradient(135deg, #0d8a48, #4ade80)"
            : "linear-gradient(135deg, #00e5ff, #8b5cf6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          LX CLOUDS
        </div>
        <nav className="hidden md:flex gap-8 items-center font-mono text-sm">
          {["About","Services","Work"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`}
              className="transition-colors"
              style={{ color: scrolled ? undefined : "rgba(255,255,255,0.75)" }}
            >{l}</a>
          ))}
          <Button asChild size="sm" className="rounded-full px-6"
            style={scrolled ? {} : {
              background: "rgba(0,229,255,0.12)",
              border: "1.5px solid rgba(0,229,255,0.5)",
              color: "#00e5ff",
              backdropFilter: "blur(8px)",
            }}>
            <a href="#contact">Let's Talk</a>
          </Button>
        </nav>
      </div>
    </header>
  );
};

const SERVICES = [
  { icon: Monitor, title: "Web Design & Development", desc: "Custom websites built from the ground up for performance and aesthetics." },
  { icon: AppWindow, title: "Web App Development", desc: "Complex, scalable web applications solving real business problems." },
  { icon: PenTool, title: "UI/UX Design", desc: "Intuitive, engaging, and beautiful user interfaces tailored to your audience." },
  { icon: LayoutTemplate, title: "Landing Pages & Portfolios", desc: "High-converting marketing pages designed to captivate and convert." },
  { icon: Wrench, title: "Maintenance & Support", desc: "Keeping your digital presence secure, fast, and running flawlessly." }
];

const WHY_US = [
  "Clean Modern Code",
  "Tailored to Your Brand",
  "Fast Delivery",
  "Long-term Support"
];

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

// --- Main Page Component ---

export default function Home() {
  const { data: projects = [], isLoading: isProjectsLoading } = usePortfolio();
  const [filter, setFilter] = useState("All");
  
  const filteredProjects = filter === "All" 
    ? projects 
    : projects.filter(p => p.category === filter);

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
        <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
          <HeroBackground />

          <div className="container relative z-10 mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-24">

            {/* LEFT — text content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="flex flex-col items-start"
            >
              {/* eyebrow tag */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-mono tracking-widest uppercase"
                style={{ background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.3)", color: "#00e5ff" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"/>
                Boutique Web Studio
              </div>

              <h1 className="font-serif font-bold leading-[1.05] tracking-tight text-5xl md:text-6xl lg:text-7xl text-white">
                We Build<br/>
                <span style={{
                  background: "linear-gradient(125deg, #00e5ff 0%, #a78bfa 60%, #e879f9 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>Digital Experiences</span><br/>
                That Last.
              </h1>

              <p className="mt-6 text-base md:text-lg max-w-md font-sans leading-relaxed"
                style={{ color: "rgba(255,255,255,0.65)" }}>
                LX CLOUDS crafts high-performance websites and web apps — designed with precision, built for growth, and delivered with care.
              </p>

              {/* stats row */}
              <div className="mt-8 flex gap-8">
                {[["50+","Projects Delivered"],["100%","Client Satisfaction"],["5★","Average Rating"]].map(([n,l]) => (
                  <div key={l}>
                    <div className="text-2xl font-serif font-bold" style={{ color: "#00e5ff" }}>{n}</div>
                    <div className="text-xs font-mono mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>{l}</div>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="group text-base font-sans px-8"
                  style={{ background: "linear-gradient(135deg, #00b4d8, #7c3aed)", border: "none", color: "white", boxShadow: "0 0 32px rgba(0,180,216,0.35)" }}>
                  <a href="#work">
                    View Our Work
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"/>
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-base font-sans px-8"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)" }}>
                  <a href="#contact">Get in Touch</a>
                </Button>
              </div>
            </motion.div>

            {/* RIGHT — isometric illustration */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.15, ease: "easeOut" }}
              className="hidden lg:flex items-center justify-center"
            >
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="w-full"
              >
                <TechIllustration />
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            style={{ color: "rgba(0,229,255,0.6)" }}
          >
            <ChevronDown className="w-7 h-7"/>
          </motion.div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="py-24 relative z-10">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="max-w-4xl mx-auto border-l-4 border-primary pl-8 py-2"
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-foreground">
                A Boutique Web Studio
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-sans font-light">
                At LX CLOUDS, we don't just build websites; we engineer digital ecosystems. 
                With a focus on stunning design, modern architecture, and scalable performance, 
                we transform your vision into an elegant reality that elevates your brand and engages your users.
              </p>
            </motion.div>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section id="services" className="py-24 bg-background-secondary relative z-10 border-y border-border">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Our Services</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Everything you need to establish a dominant digital presence.</p>
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
        <section id="work" className="py-32 relative z-10">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Selected Work</h2>
                <p className="mt-4 text-muted-foreground max-w-2xl">A showcase of our recent digital crafts.</p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {["All", "Web Apps", "Websites", "Landing Pages"].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={clsx(
                      "px-4 py-2 rounded-full font-mono text-xs transition-all duration-300 border",
                      filter === cat 
                        ? "bg-primary text-background border-primary shadow-[0_0_15px_rgba(0,196,106,0.3)]" 
                        : "bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-primary"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {isProjectsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="glass-card aspect-[4/3] rounded-2xl animate-pulse bg-surface/80" />
                ))}
              </div>
            ) : (
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                  {filteredProjects.map((project, idx) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                      key={project.id}
                      className="group glass-card overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,196,106,0.15)]"
                    >
                      <div className="relative overflow-hidden aspect-[16/10]">
                        <img 
                          src={project.imageUrl} 
                          alt={project.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-4">
                          <Button className="scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 delay-100">
                            Live Preview <ExternalLink className="w-4 h-4 ml-2" />
                          </Button>
                          <Button variant="outline" className="bg-background/80 border-transparent hover:bg-background scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 delay-150">
                            View Details
                          </Button>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-serif font-bold text-foreground">{project.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                        <div className="mt-6 flex flex-wrap gap-2">
                          {project.tags.map(tag => (
                            <span key={tag} className="text-[10px] font-mono px-2 py-1 bg-primary/10 text-primary rounded border border-primary/20">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </section>

        {/* WHY US SECTION */}
        <section id="why" className="py-24 relative z-10 border-t border-border">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
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
                  <div className="text-primary flex-shrink-0 drop-shadow-[0_0_8px_rgba(0,196,106,0.6)]">
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

        {/* CONTACT SECTION */}
        <section id="contact" className="py-32 relative z-10 bg-background-secondary/50">
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
              <p className="mt-6 text-muted-foreground font-mono text-lg">contact@lxclouds.com</p>
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
                  <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(0,196,106,0.2)]">
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
      <footer className="py-16 border-t border-border bg-background relative z-10 text-center">
        <div className="font-serif font-bold text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-primary to-glow mb-4">
          LX CLOUDS
        </div>
        <p className="text-muted-foreground font-sans mb-8 tracking-wide">Crafting Digital Experiences That Last</p>
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary/40 to-transparent mx-auto mb-8" />
        <p className="text-sm text-border font-mono tracking-wider">© {new Date().getFullYear()} LX CLOUDS. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}
