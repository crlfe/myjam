import { Plugin } from "vite";

const REPLACE_PATTERNS = [
  // Compact all whitespace.
  [/\s+/g, " "],

  // Remove crossorigin from script tags (these are added by Vite).
  [/(?<=<script[^>]*\s)crossorigin\s*/g, ""],

  // Remove trailing whitespace and slash in a self-closing tag.
  [/\s*\/(?=>)/g, ""],

  // Remove whitespace after an HTML tag.
  [/(?<=>)\s+/g, ""],

  // Remove whitespace before an HTML tag.
  [/\s+(?=<)/g, ""],
] satisfies [RegExp, string][];

export default (): Plugin => {
  return {
    name: "transform-html",
    transformIndexHtml(html) {
      return REPLACE_PATTERNS.reduce((s, [p, r]) => s.replaceAll(p, r), html);
    },
  };
};
