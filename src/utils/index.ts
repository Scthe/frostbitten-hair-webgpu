import { Vec3 } from 'wgpu-matrix';

export interface Dimensions {
  width: number;
  height: number;
}

export type ValueOf<T> = T[keyof T];

/** Remove readonly from object properties */
export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export const dgr2rad = (dgr: number) => (dgr * Math.PI) / 180;
export const rad2dgr = (radians: number) => (radians / Math.PI) * 180;

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

export const sphericalToCartesian = (
  phi: number,
  theta: number,
  result: Vec3,
  autoConvertToRad = false
) => {
  if (autoConvertToRad) {
    phi = dgr2rad(phi);
    theta = dgr2rad(theta);
  }
  result[0] = Math.cos(phi) * Math.sin(theta);
  result[1] = Math.cos(theta);
  result[2] = Math.sin(phi) * Math.sin(theta);
  return result;
};

export const divideCeil = (a: number, b: number) => Math.ceil(a / b);

const BYTES_UNITS = [
  'Bytes',
  'KB',
  'MB',
  'GB',
  'TB',
  'PB',
  'EB',
  'ZB',
  'YB',
] as const;
type ByteUnit = ArrayElement<typeof BYTES_UNITS>;

export const getBytes = (a: number, unit: ByteUnit) => {
  const i = BYTES_UNITS.indexOf(unit);
  const unitVal = Math.floor(Math.pow(1024, i));
  return a * unitVal;
};
