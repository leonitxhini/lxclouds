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

const FloatingOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <motion.div
      className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-primary/20 blur-[120px]"
      animate={{ x: [0, 60, 0], y: [0, -30, 0] }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute bottom-[10%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-primary/15 blur-[140px]"
      animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
      transition={{ duration: 24, repeat: Infinity, ease: "easeInOut", delay: 3 }}
    />
  </div>
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
      scrolled ? "bg-background/80 backdrop-blur-md border-border/50 py-4 shadow-lg shadow-black/10" : "bg-transparent border-transparent py-6"
    )}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="font-serif font-bold text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-primary to-glow">
          LX CLOUDS
        </div>
        <nav className="hidden md:flex gap-8 items-center font-mono text-sm">
          <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">About</a>
          <a href="#services" className="text-muted-foreground hover:text-primary transition-colors">Services</a>
          <a href="#work" className="text-muted-foreground hover:text-primary transition-colors">Work</a>
          <Button asChild variant="outline" size="sm" className="rounded-full px-6 hover:text-background">
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
        <section
          className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
          style={{
            backgroundImage: "url('/hero-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Subtle overlay for text readability */}
          <div className="absolute inset-0 bg-black/25 z-0" />
          <div className="container relative z-10 mx-auto px-6 flex flex-col items-center text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight max-w-5xl leading-[1.1] text-white"
            >
              We Build Digital Experiences <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 inline-block mt-2">
                That Last
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="mt-8 text-lg md:text-xl text-white/75 max-w-2xl font-sans"
            >
              LX CLOUDS — Web Apps & Websites, Crafted with Precision
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="mt-12 flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
            >
              <Button asChild size="lg" className="w-full sm:w-auto text-lg group">
                <a href="#work">
                  View Our Work
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto text-lg">
                <a href="#contact">Get in Touch</a>
              </Button>
            </motion.div>
          </div>
          
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/60"
          >
            <ChevronDown className="w-8 h-8" />
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
