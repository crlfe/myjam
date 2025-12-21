import { createFilter, transformWithEsbuild, type Plugin } from "vite";
import { minifyHtml } from "./minify-html.ts";
import { minifyShader } from "./minify-shader.ts";
import { reportBundleSize } from "./report-bundle-size.ts";
import { ShortCssNames } from "./short-css-names.ts";
import { loadWebAssemblyText } from "./webassembly.ts";

/**
 * Vite plugin to minimize myjam-based apps and report output sizes.
 * @returns the plugin
 */
export default function myjam(): Plugin {
  const names = new ShortCssNames();
  const shaderFilter = createFilter("**/*.glsl");
  const webassemblyTextFilter = createFilter("**/*.wat");

  // TODO: Consider turning off most/all of the optimizations in dev mode.
  // TODO: Look for a clean way to have vite's watcher pick up changes in linked dependencies.
  return {
    name: "vite-plugin-myjam",
    config() {
      return {
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
        css: {
          modules: {
            generateScopedName(name, filename) {
              return names.get(name, filename);
            },
          },
        },
        server: {
          headers: {
            "Cross-Origin-Embedder-Policy": "require-corp",
            "Cross-Origin-Opener-Policy": "same-origin",
          },
        },
      };
    },
    async transform(code, id) {
      if (shaderFilter(id)) {
        return await transformWithEsbuild(minifyShader(code), id, {
          format: "esm",
          loader: "text",
        });
      }
      if (webassemblyTextFilter(id)) {
        return loadWebAssemblyText(code);
      }
      return null;
    },
    transformIndexHtml(html) {
      return minifyHtml(html);
    },
    async writeBundle(_options, bundle) {
      console.info(await reportBundleSize(bundle));
    },
  };
}
