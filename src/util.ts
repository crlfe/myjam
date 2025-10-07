/** Either a type or an array of that type. */
export type MaybeArray<T> = T | T[];

/** Either a type or an promise producing that type. */
export type MaybePromise<T> = T | Promise<T>;

/** Any null-like type: null, undefined, or void. */
export type Nullish = null | undefined | VoidIgnoreLint;

/** @ignore */
// Nullish must include void to handle the output of arbitrary functions. */
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
type VoidIgnoreLint = void;

/**
 * Clamps a value to the specified range.
 * @param value the value
 * @param min the minimum
 * @param max the maximum
 * @returns the clamped value
 */
export const clamp = (value: number, min: number, max: number): number => {
  return value < min ? min : value > max ? max : value;
};

/**
 * Asserts that a value is not nullish.
 * Only in development mode, this assertion will throw if violated.
 * @param value the value
 * @returns the non-nullish value
 */
export const debugNotNull = <T>(value: T | Nullish): T => {
  if (import.meta.env.DEV && isNullish(value)) {
    throw new TypeError(`${value} is nullish`);
  }
  return value as T;
};

/**
 * Test whether the value is an array.
 * @param value the value
 * @returns whether the value is an array
 */
export const isArray = (value: unknown): value is unknown[] => {
  return Array.isArray(value);
};

/**
 * Tests whether the value is a function.
 * @param value the value
 * @returns whether the value is a function
 */

export const isFunction = (value: unknown): value is FunctionIgnoreLint => {
  return typeof value === "function";
};

/** @ignore */
// Use the general Function type so Typescript narrowing works properly.
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
type FunctionIgnoreLint = Function;

/**
 * Tests whether the value is nullish (null, undefined, or void).
 * @param value the value
 * @returns whether the value is nullish
 */
export const isNullish = (value: unknown): value is Nullish => {
  return value == null;
};

/**
 * Coerces the value into an array. Nullish values will return an empty array,
 * arrays will be returned unchanged, and all other values will return a
 * single-element array containing that value.
 * @param value the value
 * @returns the array
 */
export const asArray = <T>(value: MaybeArray<T> | Nullish): T[] => {
  if (isNullish(value)) {
    return [];
  } else if (isArray(value)) {
    return value;
  } else {
    return [value];
  }
};
