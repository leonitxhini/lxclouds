import type { Path } from "./types";

/** Reads the value at a path, e.g. ["items", 2, "title"]. */
export function getIn(value: unknown, path: Path): unknown {
  return path.reduce<unknown>((v, key) => (v == null ? undefined : (v as Record<string | number, unknown>)[key]), value);
}

/** Returns a copy of `value` with the entry at `path` replaced; everything off the path is shared, not copied. */
export function setIn<T>(value: T, path: Path, next: unknown): T {
  if (path.length === 0) return next as T;
  const [key, ...rest] = path;
  if (Array.isArray(value)) {
    const copy = value.slice();
    copy[key as number] = setIn(copy[key as number], rest, next);
    return copy as T;
  }
  const object = (value ?? {}) as Record<string | number, unknown>;
  return { ...object, [key]: setIn(object[key], rest, next) } as T;
}
