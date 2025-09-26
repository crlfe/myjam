import { isFunction, isNullish, MaybeArray, Nullish, toArray } from "./util";

export type Ref<T extends Element> = (
  target: T,
) => MaybeArray<string | Node> | Nullish;

export type Attrs = Record<string, string | Nullish>;
export type Children<T extends Element> = (string | Node | Ref<T>)[];

export const h: {
  <Name extends keyof HTMLElementTagNameMap>(
    name: Name,
    attrs?: Attrs,
    Children?: Children<HTMLElementTagNameMap[Name]>,
  ): HTMLElementTagNameMap[Name];

  (name: string, attrs?: Attrs, children?: Children<Element>): HTMLElement;
} = <T extends HTMLElement>(
  name: string,
  attrs?: Attrs,
  children?: Children<T>,
): T =>
  prepareElement(document.createElement(name) as unknown as T, attrs, children);

const prepareElement = <T extends Element>(
  e: T,
  attrs?: Attrs,
  children?: Children<T>,
): T => {
  if (attrs) {
    for (const [name, value] of Object.entries(attrs)) {
      if (!isNullish(value)) {
        e.setAttribute(name, value);
      }
    }
  }
  if (children) {
    for (const child of children) {
      e.append(...toArray(isFunction(child) ? child(e) : child));
    }
  }
  return e;
};
