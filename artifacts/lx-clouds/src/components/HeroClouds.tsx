import { useEffect, useRef } from "react";

type VantaEffect = { destroy: () => void } | null;

// Software rasterizers (SwiftShader etc.) can't sustain the shader loop — keep the static fallback image
function isSoftwareGL(): boolean {
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl") || c.getContext("webgl2")) as WebGLRenderingContext | null;
    if (!gl) return true;
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : "";
    return /swiftshader|software|llvmpipe/i.test(renderer);
  } catch {
    return true;
  }
}

export default function HeroClouds() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSoftwareGL()) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let effect: VantaEffect = null;
    let cancelled = false;

    (async () => {
      const THREE = await import("three");
      const CLOUDS = (await import("vanta/dist/vanta.clouds.min")).default;
      if (cancelled || !ref.current) return;
      effect = CLOUDS({
        el: ref.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        // LX CLOUDS brand palette
        backgroundColor: 0x06090f, // page background
        skyColor: 0x0a1424, // deep navy sky
        cloudColor: 0x152647, // dark royal-blue clouds
        cloudShadowColor: 0x03060d, // near-black shadows
        sunColor: 0x2563eb, // royal blue sun
        sunGlareColor: 0x22d3ee, // cyan glare
        sunlightColor: 0x7c6cf6, // violet light
        speed: 0.9,
      });
    })();

    return () => {
      cancelled = true;
      effect?.destroy();
    };
  }, []);

  return <div ref={ref} className="absolute inset-0" aria-hidden="true" />;
}
