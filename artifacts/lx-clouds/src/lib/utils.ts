import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Resolves a file from /public against the configured base path. */
export function asset(path: string) {
  return `${import.meta.env.BASE_URL.replace(/\/$/, "")}${path}`;
}
