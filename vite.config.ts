import { defineConfig } from "vite";
import reportBundleSize from "./plugins/report-bundle-size";
import shortCssNames from "./plugins/short-css-names";
import transformHtml from "./plugins/transform-html";
import transformShaders from "./plugins/transform-shaders";

export default defineConfig({
  plugins: [
    reportBundleSize(),
    shortCssNames(),
    transformHtml(),
    transformShaders(),
  ],
  base: "",
  build: {
    modulePreload: false,
    rollupOptions: {
      output: {
        assetFileNames: "a/[hash].[ext]",
        chunkFileNames: "a/[hash].js",
        entryFileNames: "a/[hash].js",
      },
    },
  },
});
