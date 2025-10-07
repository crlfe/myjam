import { Plugin, createFilter, transformWithEsbuild } from "vite";

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
 * @returns the plugin
 */
export default (): Plugin => {
  const filter = createFilter(["**/*.glsl"]);

  return {
    name: "transform-shaders",
    async transform(code, id) {
      if (!filter(id)) return;

      // TODO: This should really be replaced with enough of a parser to avoid
      // edge cases from regexp mismatches and add variable/parameter renaming.
      code = REPLACE_PATTERNS.reduce((s, [p, r]) => s.replaceAll(p, r), code);

      return transformWithEsbuild(code, id, {
        format: "esm",
        loader: "text",
      });
    },
  };
};
