import eslint from "@eslint/js";
import jsdoc from "eslint-plugin-jsdoc";
import prettier from "eslint-plugin-prettier/recommended";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    files: ["**/*.{c,m,}js{x,}"],
    extends: [
      jsdoc.configs["flat/recommended-typescript-flavor"],
      eslint.configs.recommended,
    ],
  },
  {
    files: ["**/*.{c,m,}ts{x,}"],
    extends: [
      jsdoc.configs["flat/recommended-typescript"],
      eslint.configs.recommended,
      tseslint.configs.strict,
      tseslint.configs.stylistic,
    ],
  },
  prettier,
  globalIgnores(["**/dist"]),
  {
    rules: {
      "capitalized-comments": "error",
      eqeqeq: "error",
      "no-plusplus": "error",
      "no-use-before-define": "error",
      "no-ternary": "error",
      "prefer-template": "error",
    },
  },
);
