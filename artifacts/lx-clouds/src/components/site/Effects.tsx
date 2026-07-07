import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { prefersReducedMotion } from "@/lib/fx";

// --- Loading screen ---

export const Loader = ({ done }: { done: boolean }) => (
  <AnimatePresence>
    {!done && (
      <motion.div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#05070B]"
        exit={{ opacity: 0, filter: "blur(10px)" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        aria-hidden="true"
      >
        <motion.img
          src="/logo-mark.png"
          alt=""
          className="w-28 h-auto"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.92, 1, 0.92] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="mt-8 h-px w-40 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-glow"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            style={{ transformOrigin: "left" }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

// --- Premium cursor glow (desktop pointers only) ---

export const CursorFX = () => {
  const [enabled, setEnabled] = useState(false);
  const dx = useMotionValue(-100);
  const dy = useMotionValue(-100);
  const dotX = useSpring(dx, { stiffness: 900, damping: 50 });
  const dotY = useSpring(dy, { stiffness: 900, damping: 50 });
  const glowX = useSpring(dx, { stiffness: 120, damping: 22 });
  const glowY = useSpring(dy, { stiffness: 120, damping: 22 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || prefersReducedMotion()) return;
    setEnabled(true);
    const onMove = (e: PointerEvent) => {
      dx.set(e.clientX);
      dy.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [dx, dy]);

  if (!enabled) return null;
  return (
    <>
      <motion.div
        className="pointer-events-none fixed z-[95] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow mix-blend-screen"
        style={{ left: dotX, top: dotY }}
        aria-hidden="true"
      />
      <motion.div
        className="pointer-events-none fixed z-[94] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen"
        style={{
          left: glowX,
          top: glowY,
          background: "radial-gradient(circle, rgba(29,124,255,0.10), transparent 60%)",
        }}
        aria-hidden="true"
      />
    </>
  );
};

// --- Floating particles (canvas) ---

type P = { x: number; y: number; r: number; vx: number; vy: number; a: number; ph: number };

export const Particles = ({ count = 70, className }: { count?: number; className?: string }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const size = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      w = rect?.width || window.innerWidth;
      h = rect?.height || window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();

    const ps: P[] = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.6 + Math.random() * 1.4,
      vx: (Math.random() - 0.5) * 0.12,
      vy: -(0.06 + Math.random() * 0.22),
      a: 0.25 + Math.random() * 0.5,
      ph: Math.random() * Math.PI * 2,
    }));

    const tick = (t: number) => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w; }
        if (p.x < -4) p.x = w + 4;
        if (p.x > w + 4) p.x = -4;
        const tw = 0.55 + 0.45 * Math.sin(t / 900 + p.ph);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(120,190,255,${(p.a * tw).toFixed(3)})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onResize = () => size();
    const onVis = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [count]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
};
