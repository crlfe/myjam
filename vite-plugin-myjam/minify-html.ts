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

/**
 * Applies simple transformations to shorten HTML files.
 * @param html the html
 * @returns the minified html
 */
export function minifyHtml(html: string): string {
  /* TODO: This should eventually be replaced with enough of a parser to avoid
   * edge cases from regexp mismatches and add id rewriting.
   */
  return REPLACE_PATTERNS.reduce((s, [p, r]) => s.replaceAll(p, r), html);
}
