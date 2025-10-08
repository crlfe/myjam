import { isFunction, isNullish, MaybeArray, Nullish, asArray } from "./util.ts";

type Attrs = Record<string, string | Nullish>;

type Children<T extends Element> = (
  | MaybeArray<string | Node>
  | Nullish
  | Hook<T>
)[];

type Hook<T extends Element> = (
  target: T,
) => MaybeArray<string | Node> | Nullish;

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

  (name: string, attrs?: Attrs, children?: Children<HTMLElement>): HTMLElement;
} = <T extends HTMLElement>(
  name: string,
  attrs?: Attrs,
  children?: Children<T>,
): T =>
  prepareElement(document.createElement(name) as unknown as T, attrs, children);

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
  prepareElement(document.createElement(name) as unknown as T, attrs, children);

/**
 * Sets attributes and children on the specified element.
 * @param element the element
 * @param attrs the attributes
 * @param children the children
 * @returns the element
 */
const prepareElement = <T extends Element>(
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
    for (const child of children) {
      element.append(...asArray(isFunction(child) ? child(element) : child));
    }
  }
  return element;
};
