export type MaybeArray<T> = T | T[];
export type MaybePromise<T> = T | Promise<T>;

// Nullish must include void to handle the output of arbitrary functions.
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
type VoidIgnoreLint = void;

export type Nullish = null | undefined | VoidIgnoreLint;

export const clamp = (value: number, min: number, max: number): number => {
  return value < min ? min : value > max ? max : value;
};

export const debugNotNull = <T>(value: T | Nullish): T => {
  if (import.meta.env.DEV && isNullish(value)) {
    throw new Error();
  }
  return value as T;
};

export const isArray = (value: unknown): value is unknown[] => {
  return Array.isArray(value);
};

// Use the general Function type so Typescript narrowing works properly.
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
type FunctionIgnoreLint = Function;

export const isFunction = (value: unknown): value is FunctionIgnoreLint => {
  return typeof value === "function";
};

export const isNullish = (value: unknown): value is Nullish => {
  return value == null;
};

export const toArray = <T>(value: MaybeArray<T> | Nullish): T[] => {
  if (isNullish(value)) {
    return [];
  } else if (isArray(value)) {
    return value;
  } else {
    return [value];
  }
};
