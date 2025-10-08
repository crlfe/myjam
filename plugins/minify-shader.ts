const REPLACE_PATTERNS = [
  // Remove comments.
  [/\/\/[^\n]*|\/\*.*?\*\//gs, ""],

  // Remove newlines unless they end a #directive.
  [/^\s*([^#].*)\n/gm, "$1 "],

  // Remove whitespace around punctuation characters.
  [/\s*([()[\]{},.;:])\s*/g, "$1"],

  // Remove whitespace around operators unless it would merge two operators.
  [
    /(?:(?<![-!^&*=+<>/?|])\s+)?([-!^&*=+<>/?|]+)(?:\s+(?![-!^&*=+<>/?|]))?/g,
    "$1",
  ],

  // Shorten float constants.
  [/(\d+\.)0(?!\d)/g, "$1"],
  [/(?<!\d)0(\.\d+)/g, "$1"],
] satisfies [RegExp, string][];

/**
 * Applies simple transformations to shorten GLSL files.
 * @param code the shader code
 * @returns the minified shader code
 */
export function minifyShader(code: string): string {
  // TODO: This should really be replaced with enough of a parser to avoid
  // edge cases from regexp mismatches and add variable/parameter renaming.
  return REPLACE_PATTERNS.reduce((s, [p, r]) => s.replaceAll(p, r), code);
}
