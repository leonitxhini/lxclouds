import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { clsx } from "clsx";

export const EASE = [0.22, 0.61, 0.36, 1] as const;

// --- Scroll reveal with blur transition ---

export const Reveal = ({
  children,
  delay = 0,
  y = 26,
  once = true,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  once?: boolean;
  className?: string;
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y, filter: "blur(10px)" }}
    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    viewport={{ once, margin: "-70px" }}
    transition={{ duration: 0.8, delay, ease: EASE }}
  >
    {children}
  </motion.div>
);

// --- Magnetic wrapper (buttons drift toward the cursor) ---

export const Magnetic = ({
  children,
  strength = 0.3,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.5 });

  return (
    <motion.div
      ref={ref}
      className={clsx("inline-block", className)}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
};

// --- Click ripple (attach to onClick of a relative/overflow-hidden element) ---

export function ripple(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const span = document.createElement("span");
  span.style.cssText = `position:absolute;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px;width:${size}px;height:${size}px;border-radius:9999px;background:rgba(255,255,255,0.28);pointer-events:none;animation:ripple .7s ease-out forwards;`;
  el.appendChild(span);
  window.setTimeout(() => span.remove(), 700);
}

// --- 3D tilt card with cursor-following glow ---

export const TiltCard = ({
  children,
  className,
  max = 7,
  glowSize = 320,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
  glowSize?: number;
}) => {
  const glowRef = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 20 });
  const sry = useSpring(ry, { stiffness: 180, damping: 20 });

  return (
    <motion.div
      className={clsx("relative will-change-transform", className)}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        rx.set(-py * max);
        ry.set(px * max);
        if (glowRef.current) {
          glowRef.current.style.opacity = "1";
          glowRef.current.style.background = `radial-gradient(${glowSize}px circle at ${e.clientX - r.left}px ${e.clientY - r.top}px, rgba(29,124,255,0.16), transparent 65%)`;
        }
      }}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
        if (glowRef.current) glowRef.current.style.opacity = "0";
      }}
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300"
        aria-hidden="true"
      />
      {children}
    </motion.div>
  );
};

// --- Animated counter ---

export const Counter = ({
  to,
  prefix = "",
  suffix = "",
  duration = 1.8,
  className,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    let raf = 0;
    const step = (t: number) => {
      if (start === null) start = t;
      const p = Math.min(1, (t - start) / (duration * 1000));
      setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {val}
      {suffix}
    </span>
  );
};

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
