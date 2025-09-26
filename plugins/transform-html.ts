import { Plugin } from "vite";

const REMOVE_PATTERNS = [
  // Remove crossorigin from script tags (these are added by Vite).
  /(?<=<script[^>]*\s)crossorigin\s*/g,

  // Remove trailing whitespace and slash in a self-closing tag.
  /\s*\/(?=>)/g,

  // Remove whitespace after an HTML tag.
  /(?<=>)\s+/g,

  // Remove whitespace before an HTML tag.
  /\s+(?=<)/g,
];

export default (): Plugin => {
  return {
    name: "transform-html",
    transformIndexHtml(html) {
      return REMOVE_PATTERNS.reduce((s, p) => s.replaceAll(p, ""), html);
    },
  };
};
