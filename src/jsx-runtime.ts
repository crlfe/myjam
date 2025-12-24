import { Attrs, Hook, prepareElement } from "./dom.ts";
import { asArray, MaybeArray, Nullish } from "./util.ts";

// ESLint and TypeScript seem to contradict each other.
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace JSX {
  export type Element = globalThis.Element;

  export type IntrinsicElements = {
    [Name in keyof HTMLElementTagNameMap]: IntrinsicClassAttributes<
      HTMLElementTagNameMap[Name]
    >;
  };

  export type IntrinsicAttributes = Record<string, unknown>;

  export interface IntrinsicClassAttributes<
    T extends Element,
  > extends IntrinsicAttributes {
    children?: MaybeArray<MaybeArray<string | Node> | Hook<T> | Nullish>;
  }

  export interface ElementChildrenAttribute {
    children: undefined;
  }
}

export type Props<T extends Element> = JSX.IntrinsicClassAttributes<T>;

export const jsx: {
  <Name extends keyof HTMLElementTagNameMap>(
    name: Name,
    props: Props<HTMLElementTagNameMap[Name]>,
  ): HTMLElementTagNameMap[Name];

  <T extends HTMLElement>(name: string, props: Props<T>): T;
} = <T extends HTMLElement>(
  name: string,
  { children, ...attrs }: Props<T>,
): T =>
  prepareElement<T>(
    document.createElement(name) as T,
    attrs as Attrs,
    asArray(children),
  );

export { jsx as jsxs };
