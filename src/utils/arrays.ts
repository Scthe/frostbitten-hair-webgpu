import { getClassName } from './index.ts';

export type TypedArray = Uint32Array | Float32Array;

export const createArray = (len: number) => Array(len).fill(0);

type TypedArrayConstructor<T extends TypedArray> = new (len: number) => T;

export function copyToTypedArray<T extends TypedArray>(
  TypedArrayClass: TypedArrayConstructor<T>,
  data: number[]
): T {
  const result = new TypedArrayClass(data.length);
  data.forEach((e, idx) => (result[idx] = e));
  return result;
}

export function ensureTypedArray<T extends TypedArray>(
  TypedArrayClass: TypedArrayConstructor<T>,
  data: T | number[]
): T {
  if (data instanceof TypedArrayClass) {
    return data;
  } else {
    // deno-lint-ignore no-explicit-any
    return copyToTypedArray(TypedArrayClass, data as any);
  }
}

export function typedArr2str(arr: TypedArray, delimiter = -1) {
  let result = '  ';
  arr.forEach((v, i) => {
    result += v;
    const isLast = i === arr.length - 1;
    if ((i + 1) % delimiter === 0) {
      result += ',\n';
      if (!isLast) result += '  ';
    } else if (!isLast) {
      result += ', ';
    }
  });

  return `${getClassName(arr)}(len=${arr.length}, bytes=${arr.byteLength}) [\n${result}]`; // prettier-ignore
}
