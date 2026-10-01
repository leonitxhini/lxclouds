import { asset } from "@/lib/utils";

/** The LXClouds mark. `size` is its height in px; the mark is wider than tall. */
export function LogoMark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <img
      src={asset("/logo-mark.webp")}
      alt=""
      width={Math.round((size * 218) / 160)}
      height={size}
      decoding="async"
      className={className}
    />
  );
}
