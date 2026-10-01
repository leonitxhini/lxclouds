import type { MotionValue } from "framer-motion";
import { useEffect, useRef, useState, type RefObject } from "react";
import {
  BackSide,
  CanvasTexture,
  Color,
  DirectionalLight,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  NoToneMapping,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  WebGLRenderer,
  type BufferGeometry,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { cn } from "@/lib/utils";

type Props = {
  /** The 1440px stage the hero is laid out on; shapes are placed relative to it. */
  stageRef: RefObject<HTMLElement | null>;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  scroll: MotionValue<number>;
  /** Called once the first frame is on screen. */
  onReady?: () => void;
};

type Shape = {
  kind: "sphere" | "slab";
  /** Centre: x from the middle of the stage, y from its top, in CSS px. */
  x: number;
  y: number;
  /** Sphere radius, or slab width / height / depth. */
  size: number[];
  rotation?: [number, number, number];
  /** Pointer travel in px and extra scroll travel in px. */
  depth: number;
  speed: number;
  /** Phase of the idle float. */
  phase: number;
};

// Positions follow the reference composition (see cardLayout in Hero.tsx).
const shapes: Shape[] = [
  { kind: "sphere", x: -518, y: 176, size: [24], depth: 34, speed: 70, phase: 0 },
  { kind: "sphere", x: -374, y: 438, size: [21], depth: 46, speed: 130, phase: 2 },
  { kind: "sphere", x: 632, y: 240, size: [54], depth: 28, speed: 160, phase: 3.5 },
  { kind: "sphere", x: 640, y: 14, size: [14], depth: 18, speed: 40, phase: 1.2 },
  { kind: "slab", x: -606, y: 238, size: [150, 128, 20], rotation: [-0.42, 0.62, -0.3], depth: 16, speed: 50, phase: 0.6 },
  { kind: "slab", x: -588, y: 540, size: [196, 236, 24], rotation: [-1.02, 0.1, -0.56], depth: 26, speed: 110, phase: 2.6 },
  { kind: "slab", x: 532, y: 548, size: [204, 196, 24], rotation: [-0.96, -0.06, 0.4], depth: 22, speed: 90, phase: 4.1 },
];

const RIBBONS = [
  "M-40 250C120 150 300 190 470 330 600 440 520 590 360 640 200 690 60 640-40 700Z",
  "M-40 60C140 0 380 40 560 150 420 140 220 150 60 250-10 290-40 330-40 330Z",
  "M1680 220C1500 130 1330 190 1190 330 1090 430 1150 580 1300 640 1450 700 1600 660 1680 720Z",
  "M1680 40C1500-10 1260 30 1100 150 1240 130 1440 150 1590 250 1650 290 1680 320 1680 320Z",
];

/** Line work on the 1640×760 artboard of the ribbons: ribbon edges, orbits and their ring markers. */
const EDGES = [
  "M-40 250C120 150 300 190 470 330 600 440 520 590 360 640",
  "M1680 220C1500 130 1330 190 1190 330 1090 430 1150 580 1300 640",
];
const ORBITS = [
  "M268 62C330 20 520 40 610 138",
  "M214 148C150 260 320 330 492 292",
  "M440 470C520 430 580 410 630 398",
  "M1058 110C1110 40 1300 10 1372 50",
  "M1142 288C1220 250 1290 236 1328 230",
  "M1040 470C1180 420 1330 470 1262 560",
];
const RINGS: [number, number][] = [
  [426, 72],
  [492, 292],
  [1186, 72],
  [1142, 288],
];

/**
 * Paints what the glass looks through: the hero's colour fields plus soft ribbons.
 * It repeats the CSS backdrop of the hero, so the canvas can fade in over it without a seam.
 */
function paintBackdrop(width: number, height: number, stageCentre: number, stageTop: number, ratio: number) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  const g = canvas.getContext("2d");
  if (!g) return canvas;
  g.scale(ratio, ratio);

  const base = g.createLinearGradient(0, 0, 0, height);
  base.addColorStop(0, "#F4F2FF");
  base.addColorStop(0.62, "#F6F5FC");
  base.addColorStop(1, "#F8F7F4");
  g.fillStyle = base;
  g.fillRect(0, 0, width, height);

  const field = (cx: number, cy: number, rx: number, ry: number, rgb: string, alpha: number, stop: number) => {
    g.save();
    g.translate(cx, cy);
    g.scale(rx, ry);
    const grad = g.createRadialGradient(0, 0, 0, 0, 0, 1);
    grad.addColorStop(0, `rgba(${rgb},${alpha})`);
    grad.addColorStop(stop, `rgba(${rgb},0)`);
    g.fillStyle = grad;
    g.fillRect(-1, -1, 2, 2);
    g.restore();
  };
  field(0, height * 0.22, 760, 560, "190,182,255", 0.55, 0.68);
  field(width, height * 0.26, 760, 560, "196,190,255", 0.55, 0.68);
  field(width * 0.12, height * 0.96, 900, 520, "206,200,255", 0.5, 0.7);
  field(width * 0.9, height, 900, 520, "208,202,255", 0.5, 0.7);

  // the hero dissolves into the page colour at its lower edge
  const fade = g.createLinearGradient(0, height - 200, 0, height);
  fade.addColorStop(0, "rgba(248,247,244,0)");
  fade.addColorStop(1, "rgba(248,247,244,1)");
  g.fillStyle = fade;
  g.fillRect(0, height - 200, width, 200);

  // a soft shadow under each sphere
  for (const shape of shapes) {
    if (shape.kind !== "sphere") continue;
    const r = shape.size[0];
    field(stageCentre + shape.x + r * 0.3, stageTop + shape.y + r * 1.05, r * 1.1, r * 0.42, "88,78,200", 0.22, 1);
  }

  // ribbons: drawn small and scaled up, which blurs them on every browser
  const k = 1 / 7;
  const small = document.createElement("canvas");
  small.width = Math.ceil(width * k);
  small.height = Math.ceil(height * k);
  const s = small.getContext("2d");
  if (s) {
    s.scale(k, k);
    s.translate(stageCentre - 820, stageTop - 40);
    RIBBONS.forEach((d, i) => {
      const fill = s.createLinearGradient(i < 2 ? 0 : 1640, 0, i < 2 ? 700 : 940, 760);
      fill.addColorStop(0, `rgba(255,255,255,${i % 2 ? 0.6 : 0.85})`);
      fill.addColorStop(0.55, `rgba(214,208,255,${i % 2 ? 0.36 : 0.52})`);
      fill.addColorStop(1, "rgba(180,170,255,0.24)");
      s.fillStyle = fill;
      s.fill(new Path2D(d));
    });
    g.imageSmoothingQuality = "high";
    g.drawImage(small, 0, 0, width, height);
  }

  // crisp line work – drawn into the backdrop so the glass bends it
  g.save();
  g.translate(stageCentre - 820, stageTop - 40);
  g.lineWidth = 1.5;
  g.strokeStyle = "rgba(255,255,255,0.9)";
  EDGES.forEach((d) => g.stroke(new Path2D(d)));
  g.lineWidth = 1.1;
  g.strokeStyle = "rgba(142,134,255,0.45)";
  ORBITS.forEach((d) => g.stroke(new Path2D(d)));
  g.lineWidth = 2.6;
  g.strokeStyle = "#7C79FF";
  g.fillStyle = "#F4F2FF";
  RINGS.forEach(([x, y]) => {
    g.beginPath();
    g.arc(x, y, 5, 0, Math.PI * 2);
    g.fill();
    g.stroke();
  });
  g.restore();
  return canvas;
}

/**
 * The studio the glass reflects: bright above, deeper violet below, so rims and edges get contrast,
 * plus soft boxes that show up as the highlights on the spheres.
 */
export function buildStudio() {
  const studio = new Scene();

  const sky = document.createElement("canvas");
  sky.width = 4;
  sky.height = 256;
  const g = sky.getContext("2d");
  if (g) {
    const gradient = g.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.3, "#f0edff");
    gradient.addColorStop(0.5, "#978cf0");
    gradient.addColorStop(0.74, "#5347cf");
    gradient.addColorStop(1, "#372e9e");
    g.fillStyle = gradient;
    g.fillRect(0, 0, 4, 256);
  }
  const skyTexture = new CanvasTexture(sky);
  skyTexture.colorSpace = SRGBColorSpace;
  studio.add(new Mesh(new SphereGeometry(60, 32, 16), new MeshBasicMaterial({ map: skyTexture, side: BackSide })));

  const panel = (color: string, intensity: number, position: [number, number, number], size: [number, number]) => {
    const material = new MeshBasicMaterial({ color: new Color(color).multiplyScalar(intensity), side: DoubleSide });
    const mesh = new Mesh(new PlaneGeometry(size[0], size[1]), material);
    mesh.position.set(...position);
    mesh.lookAt(0, 0, 0);
    studio.add(mesh);
  };
  panel("#ffffff", 12, [-22, 26, 18], [20, 12]);
  panel("#ffffff", 6, [28, 10, 14], [7, 20]);
  panel("#7b6bff", 5, [18, -24, 10], [26, 12]);
  panel("#9fc2ff", 4, [-28, -10, 0], [10, 18]);
  return studio;
}

export function glass(thickness: number, plate: boolean) {
  return new MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 1,
    thickness,
    ior: 1.5,
    roughness: 0.02,
    metalness: 0,
    // only a breath of lavender inside the glass
    attenuationColor: new Color("#b4a9ff"),
    attenuationDistance: thickness * (plate ? 6 : 4.5),
    specularIntensity: 1,
    // plates stay clear on their faces and get their shape from the edges
    clearcoat: plate ? 0 : 1,
    clearcoatRoughness: 0.03,
    envMapIntensity: plate ? 0.9 : 1.25,
    iridescence: 0.4,
    iridescenceIOR: 1.25,
    iridescenceThicknessRange: [140, 420],
    dispersion: 0.8,
  });
}

/**
 * Real-time glass for the hero: spheres and slabs with a physically based, light-refracting material.
 * Loaded lazily and only on wide screens; without WebGL the hero simply keeps its CSS backdrop.
 */
export default function HeroGlass({ stageRef, mx, my, scroll, onReady }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    } catch {
      return; // no WebGL: the CSS backdrop stays
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = NoToneMapping;

    const scene = new Scene();
    const pmrem = new PMREMGenerator(renderer);
    const studio = buildStudio();
    const environment = pmrem.fromScene(studio, 0.035);
    scene.environment = environment.texture;

    const key = new DirectionalLight(0xffffff, 2.4);
    key.position.set(-600, 900, 1200);
    scene.add(key);

    const camera = new PerspectiveCamera(30, 1, 10, 6000);
    const DISTANCE = 2200;

    const meshes = shapes.map((shape) => {
      let geometry: BufferGeometry;
      let thickness: number;
      if (shape.kind === "sphere") {
        geometry = new SphereGeometry(shape.size[0], 96, 64);
        thickness = shape.size[0] * 1.5;
      } else {
        const [w, h, d] = shape.size;
        // a small bevel keeps the side faces flat, so they read as the thickness of the plate
        geometry = new RoundedBoxGeometry(w, h, d, 8, 6.5);
        thickness = d * 1.6;
      }
      const mesh = new Mesh(geometry, glass(thickness, shape.kind === "slab"));
      if (shape.rotation) mesh.rotation.set(...shape.rotation);
      scene.add(mesh);
      return mesh;
    });

    // layout in CSS pixels, with the origin in the middle of the hero
    let width = 0;
    let height = 0;
    let stageX = 0;
    let stageTop = 0;
    let backdrop: CanvasTexture | null = null;

    const layout = () => {
      const rect = host.getBoundingClientRect();
      const stage = stageRef.current?.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      stageX = stage ? stage.left + stage.width / 2 - rect.left : width / 2;
      stageTop = stage ? stage.top - rect.top : 0;

      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.fov = (2 * Math.atan(height / 2 / DISTANCE) * 180) / Math.PI;
      camera.position.set(0, 0, DISTANCE);
      camera.updateProjectionMatrix();

      backdrop?.dispose();
      backdrop = new CanvasTexture(paintBackdrop(width, height, stageX, stageTop, renderer.getPixelRatio()));
      backdrop.colorSpace = SRGBColorSpace;
      scene.background = backdrop;
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let visible = true;

    const draw = (time: number) => {
      const t = reduce ? 0 : time / 1000;
      const pointerX = mx.get();
      const pointerY = my.get();
      const scrolled = scroll.get();
      shapes.forEach((shape, i) => {
        const mesh = meshes[i];
        const float = Math.sin(t * 0.55 + shape.phase) * 7;
        mesh.position.set(
          stageX - width / 2 + shape.x + pointerX * shape.depth,
          height / 2 - (stageTop + shape.y) - pointerY * shape.depth + float + scrolled * shape.speed,
          0,
        );
        if (shape.kind === "slab" && shape.rotation) {
          mesh.rotation.set(
            shape.rotation[0] + Math.sin(t * 0.3 + shape.phase) * 0.06 - pointerY * 0.12,
            shape.rotation[1] + Math.cos(t * 0.26 + shape.phase) * 0.07 + pointerX * 0.16,
            shape.rotation[2],
          );
        }
      });
      renderer.render(scene, camera);
    };

    const loop = (time: number) => {
      frame = 0;
      draw(time);
      if (visible && !reduce && !document.hidden) frame = requestAnimationFrame(loop);
    };
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(loop);
    };

    layout();
    draw(0);
    setReady(true);
    onReady?.();
    wake();

    const resizeObserver = new ResizeObserver(() => {
      layout();
      wake();
    });
    resizeObserver.observe(host);
    const viewObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
    });
    viewObserver.observe(host);
    document.addEventListener("visibilitychange", wake);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      viewObserver.disconnect();
      document.removeEventListener("visibilitychange", wake);
      meshes.forEach((mesh) => {
        mesh.geometry.dispose();
        (mesh.material as MeshPhysicalMaterial).dispose();
      });
      backdrop?.dispose();
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
    // onReady is only needed for the first frame
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageRef, mx, my, scroll]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("absolute inset-0 h-full w-full transition-opacity duration-1000", ready ? "opacity-100" : "opacity-0")}
    />
  );
}
