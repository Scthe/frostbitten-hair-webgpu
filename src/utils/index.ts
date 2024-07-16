export interface Dimensions {
  width: number;
  height: number;
}

export type ValueOf<T> = T[keyof T];

/** Remove readonly from object properties */
export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export const dgr2rad = (dgr: number) => (dgr * Math.PI) / 180;

export function getClassName(a: object) {
  // deno-lint-ignore no-explicit-any
  return (a as any).constructor.name;
}

// deno-lint-ignore no-explicit-any
export function getTypeName(a: any) {
  if (Array.isArray(a)) return 'Array';
  if (typeof a === 'object') return getClassName(a);
  return typeof a;
}

export const lerp = (a: number, b: number, fac: number) => {
  fac = Math.max(0, Math.min(1, fac));
  return a * (1 - fac) + b * fac;
};

export function clamp(x: number, min: number, max: number): number {
  return Math.min(Math.max(x, min), max);
}

export function debounce<T extends unknown[]>(
  callback: (...args: T) => void,
  wait: number
) {
  let timer: number;

  return (...args: T): void => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), wait);
  };
}
