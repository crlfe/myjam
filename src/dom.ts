import {
  asArray,
  isFunction,
  isNullish,
  MaybeArray,
  Nullish,
  NullishOrVoid,
  voidAsUndefined,
} from "./util.ts";

export type Attrs = Record<string, string | Nullish>;

export type Children<T extends Element> = (
  | MaybeArray<string | Node>
  | Nullish
  | Hook<T>
)[];

export type Hook<T extends Element> = (
  target: T,
) => MaybeArray<string | Node> | NullishOrVoid;

/**
 * Sets attributes and children on the specified element.
 * @param element the element
 * @param attrs the attributes
 * @param children the children
 * @returns the element
 */
export const prepareElement = <T extends Element>(
  element: T,
  attrs?: Attrs,
  children?: Children<T>,
): T => {
  if (attrs) {
    for (const [name, value] of Object.entries(attrs)) {
      if (!isNullish(value)) {
        element.setAttribute(name, value);
      }
    }
  }
  if (children) {
    for (let child of children) {
      if (isFunction(child)) {
        child = voidAsUndefined(child(element));
      }
      element.append(...asArray(child));
    }
  }
  return element;
};

/**
 * Creates an HTML element with the specified tag name, and sets its initial
 * attributes and children.
 * @param name the tag name
 * @param attrs the attributes
 * @param children the children
 * @returns the element
 */
export const h: {
  <Name extends keyof HTMLElementTagNameMap>(
    name: Name,
    attrs?: Attrs,
    Children?: Children<HTMLElementTagNameMap[Name]>,
  ): HTMLElementTagNameMap[Name];

  <T extends HTMLElement>(
    name: string,
    attrs?: Attrs,
    children?: Children<T>,
  ): T;
} = <T extends HTMLElement>(
  name: string,
  attrs?: Attrs,
  children?: Children<T>,
): T => prepareElement(document.createElement(name) as T, attrs, children);

/**
 * Creates an SVG element with the specified tag name, and sets its initial
 * attributes and children.
 * @param name the tag name
 * @param attrs the attributes
 * @param children the children
 * @returns the element
 */
export const s: {
  <Name extends keyof SVGElementTagNameMap>(
    name: Name,
    attrs?: Attrs,
    Children?: Children<SVGElementTagNameMap[Name]>,
  ): SVGElementTagNameMap[Name];

  (name: string, attrs?: Attrs, children?: Children<SVGElement>): SVGElement;
} = <T extends SVGElement>(
  name: string,
  attrs?: Attrs,
  children?: Children<T>,
): T =>
  prepareElement(
    document.createElementNS("http://www.w3.org/2000/svg", name) as T,
    attrs,
    children,
  );
