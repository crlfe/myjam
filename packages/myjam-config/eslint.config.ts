import css from "@eslint/css";
import eslint from "@eslint/js";
import html from "@html-eslint/eslint-plugin";
import jsdoc from "eslint-plugin-jsdoc";
import prettier from "eslint-plugin-prettier/recommended";
import { defineConfig, globalIgnores, type Config } from "eslint/config";
import tseslint from "typescript-eslint";

export { defineConfig };

const scriptCommon: Config = {
  rules: {
    "capitalized-comments": ["error"],
    eqeqeq: ["error"],
    "no-plusplus": ["error"],
    "no-use-before-define": ["error"],
    "no-ternary": ["error"],
    "prefer-template": ["error"],
  },
};

export const config = defineConfig(
  {
    files: ["**/*.{c,m,}js{x,}"],
    extends: [
      scriptCommon,
      jsdoc.configs["flat/recommended-typescript-flavor"],
      eslint.configs.recommended,
    ],
  },
  {
    files: ["**/*.{c,m,}ts{x,}"],
    extends: [
      scriptCommon,
      jsdoc.configs["flat/recommended-typescript"],
      eslint.configs.recommended,
      tseslint.configs.strict,
      tseslint.configs.stylistic,
    ],
  },
  {
    files: ["**/*.css"],
    language: "css/css",
    plugins: { css },
    extends: ["css/recommended"],
    rules: {
      "css/use-baseline": ["error", { available: "newly" }],
    },
  },
  {
    files: ["**/*.html"],
    language: "html/html",
    plugins: { html },
    extends: ["html/recommended"],
    rules: {
      // Tweak format checks to match prettier.
      "html/indent": ["error", 2, {}],
      "html/no-extra-spacing-attrs": [
        "error",
        { enforceBeforeSelfClose: true },
      ],
      "html/require-closing-tags": [
        "error",
        {
          selfClosing: "always",
        },
      ],
    },
  },
  prettier,
  globalIgnores(["**/dist"]),
);

export default config;
