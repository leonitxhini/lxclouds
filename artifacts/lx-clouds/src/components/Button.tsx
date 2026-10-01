import { ArrowRight } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

const base =
  "group/btn inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-[background-color,box-shadow,border-color,color] duration-300";

const variants = {
  dark: "bg-ink text-white shadow-[0_8px_20px_-10px_rgba(17,18,27,0.6)] hover:bg-[#23243a] hover:shadow-[0_12px_26px_-10px_rgba(104,101,255,0.65)]",
  light:
    "border border-ink/10 bg-white text-ink shadow-[0_1px_2px_rgba(17,18,27,0.04)] hover:border-accent/40 hover:text-accent",
  // on dark surfaces
  ghost: "border border-white/15 bg-white/[0.06] text-white hover:bg-white/[0.12]",
};

const sizes = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-[22px] text-[14.5px]",
};

type Props = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  /** Trailing icon; defaults to an arrow that nudges on hover. Pass null for none. */
  icon?: ReactNode | null;
  children: ReactNode;
  className?: string;
};

function Inner({ icon, children }: Pick<Props, "icon" | "children">) {
  return (
    <>
      {children}
      {icon === undefined ? (
        <ArrowRight
          className="size-[15px] transition-transform duration-300 ease-out group-hover/btn:translate-x-[3px]"
          strokeWidth={2}
          aria-hidden="true"
        />
      ) : (
        icon
      )}
    </>
  );
}

export function ButtonLink({
  variant = "dark",
  size = "md",
  icon,
  children,
  className,
  ...rest
}: Props & ComponentPropsWithoutRef<"a">) {
  return (
    <a className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      <Inner icon={icon}>{children}</Inner>
    </a>
  );
}

export function Button({
  variant = "dark",
  size = "md",
  icon,
  children,
  className,
  ...rest
}: Props & ComponentPropsWithoutRef<"button">) {
  return (
    <button type="button" className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      <Inner icon={icon}>{children}</Inner>
    </button>
  );
}
