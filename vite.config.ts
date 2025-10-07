import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import reportBundleSize from "./plugins/report-bundle-size";
import shortCssNames from "./plugins/short-css-names";
import transformHtml from "./plugins/transform-html";
import transformShaders from "./plugins/transform-shaders";
import { opendir } from "node:fs/promises";

const root = dirname(fileURLToPath(import.meta.url));

/**
 * Gets the absolute paths of all HTML files within the specified directory.
 * @param dirname the directory
 * @returns a promise resolving to the list of HTML files
 */
async function getEntries(dirname: string): Promise<string[]> {
  const result: string[] = [];

  const dir = await opendir(resolve(root, dirname), { recursive: true });
  for await (const entry of dir) {
    if (entry.isFile() && entry.name.endsWith(".html")) {
      result.push(resolve(entry.parentPath, entry.name));
    }
  }

  result.sort();
  return result;
}

export default async () =>
  defineConfig({
    plugins: [
      reportBundleSize(),
      shortCssNames(),
      transformHtml(),
      transformShaders(),
    ],
    appType: "mpa",
    base: "",
    resolve: {
      alias: {
        myjam: resolve(root, "src"),
      },
    },
    build: {
      modulePreload: false,
      rollupOptions: {
        input: [
          resolve(root, "index.html"),
          ...(await getEntries("bench")),
          ...(await getEntries("examples")),
        ],
        output: {
          assetFileNames: "a/[hash].[ext]",
          chunkFileNames: "a/[hash].js",
          entryFileNames: "a/[hash].js",
        },
      },
    },
  });
