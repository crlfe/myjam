import { type Plugin, defineConfig } from "vite";
import myjam from "vite-plugin-myjam";
import { opendir, readFile } from "node:fs/promises";
import NodePath from "node:path";

export default defineConfig({
  plugins: [myjam(), copyExamples()],
  appType: "mpa",
});

/**
 * Copy examples from node_modules into dist/examples.
 * @returns the plugin
 */
function copyExamples(): Plugin {
  return {
    name: "copy-examples",
    async generateBundle() {
      // TODO: Look for a better way to collect the compiled examples.
      // Hopefully one that automatically supports `vite dev`, so we can avoid
      // writing a server middleware.
      //
      // TODO: pnpm recursive says that it will respect project depdencies, but
      // without the --sequential argument this actually gets run before the
      // examples finish building. Not sure whether that's their bug or ours.
      const modules = await opendir("node_modules");
      for await (const module of modules) {
        if (module.name.startsWith("examples-")) {
          const dst = NodePath.join("examples", module.name.substring(9));
          const src = NodePath.resolve(module.parentPath, module.name, "dist");
          const entries = await opendir(src, { recursive: true });
          for await (const entry of entries) {
            if (entry.isFile()) {
              const path = NodePath.resolve(entry.parentPath, entry.name);
              if (path.startsWith(src)) {
                this.emitFile({
                  type: "asset",
                  fileName: NodePath.join(dst, path.substring(src.length)),
                  source: await readFile(path),
                });
              }
            }
          }
        }
      }
    },
  };
}
