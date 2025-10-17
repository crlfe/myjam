import { type Plugin, createFilter, transformWithEsbuild } from "vite";
import { minifyHtml } from "./minify-html";
import { minifyShader } from "./minify-shader";
import { reportBundleSize } from "./report-bundle-size";
import { ShortCssNames } from "./short-css-names";
import { loadWebAssemblyText } from "./webassembly";

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
          minify: "terser",
          terserOptions: {
            compress: {
              // A second pass inlines CSS module class names.
              passes: 2,
            },
          },
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
        return loadWebAssemblyText(code, id);
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
